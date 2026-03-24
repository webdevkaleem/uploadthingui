import { getAllBlogsFrontmatter } from "@/lib/markdown";
import { page_routes } from "@/lib/routes-config";
import { getSiteUrl } from "@/lib/site-url";
import type { MetadataRoute } from "next";

function parseDate(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const siteUrl = getSiteUrl();

  const docsEntries: MetadataRoute.Sitemap = page_routes.map((route) => ({
    url: `${siteUrl}/docs${route.href}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: route.href.startsWith("/getting-started") ? 0.8 : 0.7,
  }));

  const blogs = await getAllBlogsFrontmatter();
  const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${siteUrl}/blog/${blog.slug}`,
    lastModified: parseDate(blog.date) ?? now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...docsEntries,
    ...blogEntries,
  ];
}
