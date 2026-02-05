import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/ingest/static/")) {
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
  } else if (pathname.startsWith("/r/")) {
    const arr = pathname.split("/");
    const componentName = arr[arr.length - 1].replace(".json", "");

    await redis.incr(`registry:views:${componentName}`);
    await redis.incr(`registry:views:total`);

    return NextResponse.next();
  } 

  return NextResponse.next();
}
