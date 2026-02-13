import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "1nc21dil75.ufs.sh",
        pathname: "/f/**",
      },
    ],
  },
  // Required for next-mdx-remote when using Turbopack.
  transpilePackages: ["next-mdx-remote"],

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
