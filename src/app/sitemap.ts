import type { MetadataRoute } from "next";
import { listBlogPostParams } from "@/lib/blog-posts";
import { listResourcePostParams } from "@/lib/resource-posts";
import { absoluteUrl } from "@/lib/site-url";

const staticRoutes: Array<MetadataRoute.Sitemap[number]> = [
  {
    url: absoluteUrl("/"),
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: absoluteUrl("/solutions/ai-crew"),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: absoluteUrl("/solutions/ai-dashi"),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: absoluteUrl("/blog"),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: absoluteUrl("/whitepapers"),
    changeFrequency: "weekly",
    priority: 0.8,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postRoutes: MetadataRoute.Sitemap = listResourcePostParams().map(({ category, slug }) => ({
    url: absoluteUrl(`/posts/${category}/${slug.replace(/\.html$/i, "")}`),
    changeFrequency: "monthly",
    priority: category === "event" ? 0.7 : 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = (await listBlogPostParams()).map(({ id, slug }) => ({
    url: absoluteUrl(`/blog/${id}/${slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes, ...blogRoutes];
}
