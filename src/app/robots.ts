import type { MetadataRoute } from "next";
import { getRequestDeployedSiteUrl } from "@/lib/site-url.server";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const deployedSiteUrl = await getRequestDeployedSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/privacy-policy", "/terms-of-service"],
    },
    sitemap: new URL("/sitemap.xml", deployedSiteUrl).toString(),
    host: deployedSiteUrl.toString(),
  };
}
