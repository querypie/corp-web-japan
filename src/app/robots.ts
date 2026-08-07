import type { MetadataRoute } from "next";
import { getRequestDeployedSiteUrl } from "@/lib/site-url.server";
import { isStagingSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const deployedSiteUrl = await getRequestDeployedSiteUrl();

  if (isStagingSiteUrl(deployedSiteUrl)) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      host: deployedSiteUrl.toString(),
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", deployedSiteUrl).toString(),
    host: deployedSiteUrl.toString(),
  };
}
