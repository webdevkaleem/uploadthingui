import { getAllBlogsFrontmatter } from "@/lib/markdown";
import { page_routes } from "@/lib/routes-config";
import type { MetadataRoute } from "next";

const DEFAULT_SITE_URL = "https://uploadthingui.webdevkaleem.com";

function getSiteUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    DEFAULT_SITE_URL;

  return envUrl.endsWith("/") ? envUrl.slice(0, -1) : envUrl;
}

function toAbsoluteUrl(pathname: string) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: toAbsoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: toAbsoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...page_routes.map((route) => ({
      url: toAbsoluteUrl(`/docs${route.href}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  const blogs = await getAllBlogsFrontmatter();
  const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => {
    const parsedDate = new Date(blog.date);

    return {
      url: toAbsoluteUrl(`/blog/${blog.slug}`),
      lastModified: Number.isNaN(parsedDate.getTime()) ? now : parsedDate,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

  return [...staticEntries, ...blogEntries];
}
