import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { PostHog } from "posthog-node";

const f = createUploadthing();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(6, "60s"),
});

// Initialize PostHog server-side client
const posthog = new PostHog(
  process.env.NEXT_PUBLIC_POSTHOG_KEY as string,
  {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST as string,
  }
);

const rateLimitMiddleware = async (req: Request) => {
  const ip =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for") ??
    "127.0.0.1";

  const { success, reason } = await rateLimit.limit(ip);

  if (!success) {
    posthog.capture({
      distinctId: ip,
      event: "file_upload_rate_limited",
      properties: {
        ip,
        reason,
        endpoint: "imageUploader",
      },
    });

    throw new UploadThingError("Rate limit exceeded");
  }

  posthog.capture({
    distinctId: ip,
    event: "file_upload_rate_limit_check_passed",
    properties: {
      ip,
      reason,
      endpoint: "imageUploader",
    },
  });

  return;
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f(
    {
      image: {
        /**
         * For full list of options and defaults, see the File Route API reference
         * @see https://docs.uploadthing.com/file-routes#route-config
         */
        maxFileSize: "8MB",
      },
    },
    // Await server data to be sent to the client inorder to mark the file as uploaded
    { awaitServerData: true }
  )
    .middleware(async ({ req }) => {
      await rateLimitMiddleware(req);

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {};
    })
    .onUploadComplete(async ({ file, req }) => {
      // Capture successful upload event
      const ip =
        req.headers.get("x-real-ip") ??
        req.headers.get("x-forwarded-for") ??
        "127.0.0.1";


      posthog.capture({
        distinctId: ip,
        event: "file_upload_completed",
        properties: {
          ip,
          fileUrl: file.ufsUrl,
          fileName: file.name,
          fileSize: file.size,
          endpoint: "imageUploader",
        },
      });

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {};
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
