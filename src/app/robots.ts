import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/privacy-policy", "/terms-of-service"],
    },
    sitemap: `${siteUrl.toString()}sitemap.xml`,
    host: siteUrl.toString(),
  };
}
