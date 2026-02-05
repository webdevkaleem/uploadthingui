import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();

// Matcher to limit proxy execution to specific routes only
export const config = {
  matcher: [
    // PostHog ingest routes
    "/ingest/:path*",
    // Registry JSON files - skip prefetch requests
    {
      source: "/r/:component*.json",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(12, "60s"),
});

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/ingest/")) {
    let url = request.nextUrl.clone();
    const hostname = url.pathname.startsWith("/ingest/static/")
      ? "us-assets.i.posthog.com"
      : "us.i.posthog.com";
    const requestHeaders = new Headers(request.headers);

    requestHeaders.set("host", hostname);

    url.protocol = "https";
    url.hostname = hostname;
    url.port = "443";
    url.pathname = url.pathname.replace(/^\/ingest/, "");

    return NextResponse.rewrite(url, {
      headers: requestHeaders,
    });
  } else if (pathname.startsWith("/r/") && pathname.endsWith(".json")) {
    const ip =
      request.headers.get("x-real-ip") ??
      request.headers.get("x-forwarded-for") ??
      "127.0.0.1";

    const { success } = await rateLimit.limit(ip);

    if (!success) {
      return new Response("Rate limit exceeded", { status: 429 });
    }

    const arr = pathname.split("/");
    const rawComponent = arr[arr.length - 1].replace(".json", "");

    // Decode URI component and trim any trailing slashes/whitespace
    let componentName: string;
    try {
      componentName = decodeURIComponent(rawComponent).replace(/\/+$/, "").trim();
    } catch {
      // Invalid URI encoding
      return new Response("Invalid component name", { status: 400 });
    }

    // Validate against allowed pattern: non-empty, alphanumeric with hyphens/underscores
    const VALID_COMPONENT_PATTERN = /^[A-Za-z0-9_-]+$/;
    if (!componentName || !VALID_COMPONENT_PATTERN.test(componentName)) {
      return new Response("Invalid component name", { status: 400 });
    }

    try {
      // Deduplicate: Only count if this IP hasn't fetched this component in the last 10 seconds
      const dedupeKey = `registry:dedupe:${ip}:${componentName}`;
      const alreadyCounted = await redis.get(dedupeKey);
      
      if (!alreadyCounted) {
        // Set dedupe key with 10 second expiry
        await redis.set(dedupeKey, "1", { ex: 10 });
        await redis.incr(`registry:views:${componentName}`);
        await redis.incr(`registry:views:total`);
      }
    } catch (error) {
      console.error("Redis counter increment failed:", error);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}
