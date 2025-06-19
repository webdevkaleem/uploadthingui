import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import posthog from "posthog-js";

const f = createUploadthing();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(6, "60s"),
});

const rateLimitMiddleware = async (req: Request) => {
  const ip =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for") ??
    "127.0.0.1";

  const { success, reason } = await rateLimit.limit(ip);

  if (!success) {
    posthog.capture("file_upload_failed", {
      ip,
      reason,
    });

    throw new UploadThingError("Rate limit exceeded");
  }

  posthog.capture("file_upload_successful", {
    ip,
    reason,
  });

  // Otherwise, return
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
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.ufsUrl);
      console.log("metadata", metadata);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {};
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
