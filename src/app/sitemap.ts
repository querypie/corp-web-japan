import type { MetadataRoute } from "next";
import { acpDemoPublicationRecords } from "@/lib/publications/demo/acp/records";
import { aipDemoPublicationRecords } from "@/lib/publications/demo/aip/records";
import { blogPostRecords } from "@/lib/publications/blog/records";
import { eventPostRecords, getEventPostHref } from "@/content/resources/events";
import { getAcpDemoPublicationHref } from "@/lib/publications/demo/acp/get-post";
import { getAipDemoPublicationHref } from "@/lib/publications/demo/aip/get-post";
import { getBlogPublicationHref } from "@/lib/publications/blog/get-post";
import { getNewsPublicationHref } from "@/lib/publications/news/get-post";
import { getUseCasePublicationHref } from "@/lib/publications/use-cases/get-post";
import { getWhitepaperPublicationHref } from "@/lib/publications/whitepapers/get-post";
import { newsPublicationRecords } from "@/lib/publications/news/records";
import {
  useCasePublicationRecords,
} from "@/lib/publications/use-cases/records";
import { whitepaperPublicationRecords } from "@/lib/publications/whitepapers/records";
import { listIntroductionDeckPublicationParams } from "@/lib/resources/introduction-deck-publications";
import { listGlossaryPublicationParams } from "@/lib/resources/glossary-publications";
import { listManualPublicationParams } from "@/lib/resources/manual-publications";
import { absoluteUrl } from "@/lib/site-url";
import { getRequestDeployedSiteUrl } from "@/lib/site-url.server";

export const dynamic = "force-dynamic";

// `/privacy-policy` and `/terms-of-service` are public local legal pages,
// but they are intentionally noindex and therefore omitted from the sitemap.
function buildStaticRoutes(deployedSiteUrl: URL): Array<MetadataRoute.Sitemap[number]> {
  return [
  {
    url: absoluteUrl("/", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: absoluteUrl("/solutions/ai-crew", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: absoluteUrl("/solutions/ai-dashi", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: absoluteUrl("/blog", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: absoluteUrl("/whitepapers", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: absoluteUrl("/news", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: absoluteUrl("/resources", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: absoluteUrl("/events", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: absoluteUrl("/introduction-deck", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/glossary", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/manuals", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/about-us", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/certifications", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/contact-us", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/cookie-preference", deployedSiteUrl),
    changeFrequency: "yearly",
    priority: 0.4,
  },
  {
    url: absoluteUrl("/eula", deployedSiteUrl),
    changeFrequency: "yearly",
    priority: 0.4,
  },
  {
    url: absoluteUrl("/plans", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: absoluteUrl("/plans/aip", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/plans/acp", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/platforms/aip", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: absoluteUrl("/platforms/aip/integrations", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/platforms/acp", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: absoluteUrl("/platforms/acp/integrations", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/platforms/acp/database-access-controller", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/platforms/acp/system-access-controller", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/platforms/acp/kubernetes-access-controller", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/platforms/acp/web-access-controller", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/platforms/aip/usage-based-llm", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/platforms/aip/mcp-gateway", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/use-cases", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: absoluteUrl("/demo/aip", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: absoluteUrl("/demo/acp", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: absoluteUrl("/services/fde", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: absoluteUrl("/services/as400-cobol", deployedSiteUrl),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  ];
}

function shouldIncludeRedirectableRecordInSitemap(record: { hidden?: boolean; redirectUrl?: string }) {
  return record.hidden !== true || typeof record.redirectUrl === "string";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const deployedSiteUrl = await getRequestDeployedSiteUrl();

  const blogDetailRoutes: MetadataRoute.Sitemap = blogPostRecords
    .filter(shouldIncludeRedirectableRecordInSitemap)
    .map(({ id, slug }) => ({
      url: absoluteUrl(getBlogPublicationHref(id, slug), deployedSiteUrl),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const whitepaperDetailRoutes: MetadataRoute.Sitemap = whitepaperPublicationRecords
    .filter(shouldIncludeRedirectableRecordInSitemap)
    .map(({ id, slug }) => ({
      url: absoluteUrl(getWhitepaperPublicationHref(id, slug), deployedSiteUrl),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const eventDetailRoutes: MetadataRoute.Sitemap = eventPostRecords
    .filter(shouldIncludeRedirectableRecordInSitemap)
    .map(({ id, slug }) => ({
      url: absoluteUrl(getEventPostHref(id, slug), deployedSiteUrl),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const newsDetailRoutes: MetadataRoute.Sitemap = newsPublicationRecords
    .filter(shouldIncludeRedirectableRecordInSitemap)
    .map(({ id, slug }) => ({
      url: absoluteUrl(getNewsPublicationHref(id, slug), deployedSiteUrl),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const useCaseDetailRoutes: MetadataRoute.Sitemap = useCasePublicationRecords.map(({ id, slug }) => ({
    url: absoluteUrl(getUseCasePublicationHref(id, slug), deployedSiteUrl),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const aipDemoDetailRoutes: MetadataRoute.Sitemap = aipDemoPublicationRecords.map(({ id, slug }) => ({
    url: absoluteUrl(getAipDemoPublicationHref(id, slug), deployedSiteUrl),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const acpDemoDetailRoutes: MetadataRoute.Sitemap = acpDemoPublicationRecords.map(({ id, slug }) => ({
    url: absoluteUrl(getAcpDemoPublicationHref(id, slug), deployedSiteUrl),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const introductionDeckDetailRoutes: MetadataRoute.Sitemap = listIntroductionDeckPublicationParams().map(({ id, slug }) => ({
    url: absoluteUrl(`/introduction-deck/${id}/${slug}`, deployedSiteUrl),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const glossaryDetailRoutes: MetadataRoute.Sitemap = listGlossaryPublicationParams().map(({ id, slug }) => ({
    url: absoluteUrl(`/glossary/${id}/${slug}`, deployedSiteUrl),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const manualDetailRoutes: MetadataRoute.Sitemap = listManualPublicationParams().map(({ id, slug }) => ({
    url: absoluteUrl(`/manuals/${id}/${slug}`, deployedSiteUrl),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...buildStaticRoutes(deployedSiteUrl),
    ...blogDetailRoutes,
    ...whitepaperDetailRoutes,
    ...eventDetailRoutes,
    ...newsDetailRoutes,
    ...useCaseDetailRoutes,
    ...aipDemoDetailRoutes,
    ...acpDemoDetailRoutes,
    ...introductionDeckDetailRoutes,
    ...glossaryDetailRoutes,
    ...manualDetailRoutes,
  ];
}
