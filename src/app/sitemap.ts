import type { MetadataRoute } from "next";
import { acpDemoPublicationRecords } from "@/lib/publications/acp-demo-publication-records";
import { aipDemoPublicationRecords } from "@/lib/publications/aip-demo-publication-records";
import {
  useCasePublicationRecords,
} from "@/lib/publications/use-case-publication-records";
import { eventPostRecords, getEventPostHref } from "@/content/resources/events";
import { getAcpDemoPublicationHref } from "@/lib/publications/get-acp-demo-publication-post";
import { getAipDemoPublicationHref } from "@/lib/publications/get-aip-demo-publication-post";
import { getNewsPublicationHref } from "@/lib/publications/get-news-publication-post";
import { newsPublicationRecords } from "@/lib/publications/news-publication-records";
import { getUseCasePublicationHref } from "@/lib/publications/get-use-case-publication-post";
import { listIntroductionDeckPublicationParams } from "@/lib/resources/introduction-deck-publications";
import { listGlossaryPublicationParams } from "@/lib/resources/glossary-publications";
import { listManualPublicationParams } from "@/lib/resources/manual-publications";
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
  {
    url: absoluteUrl("/news"),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: absoluteUrl("/resources"),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: absoluteUrl("/introduction-deck"),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/glossary"),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/manuals"),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/contact-us"),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/demo/use-cases"),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: absoluteUrl("/demo/aip"),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: absoluteUrl("/demo/acp"),
    changeFrequency: "weekly",
    priority: 0.8,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const eventDetailRoutes: MetadataRoute.Sitemap = eventPostRecords.map(({ id, slug }) => ({
    url: absoluteUrl(getEventPostHref(id, slug)),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const newsDetailRoutes: MetadataRoute.Sitemap = newsPublicationRecords
    .filter(({ redirectUrl }) => !redirectUrl)
    .map(({ id, slug }) => ({
      url: absoluteUrl(getNewsPublicationHref(id, slug)),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const useCaseDetailRoutes: MetadataRoute.Sitemap = useCasePublicationRecords.map(({ id, slug }) => ({
    url: absoluteUrl(getUseCasePublicationHref(id, slug)),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const aipDemoDetailRoutes: MetadataRoute.Sitemap = aipDemoPublicationRecords.map(({ id, slug }) => ({
    url: absoluteUrl(getAipDemoPublicationHref(id, slug)),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const acpDemoDetailRoutes: MetadataRoute.Sitemap = acpDemoPublicationRecords.map(({ id, slug }) => ({
    url: absoluteUrl(getAcpDemoPublicationHref(id, slug)),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const introductionDeckDetailRoutes: MetadataRoute.Sitemap = listIntroductionDeckPublicationParams().map(({ id, slug }) => ({
    url: absoluteUrl(`/introduction-deck/${id}/${slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const glossaryDetailRoutes: MetadataRoute.Sitemap = listGlossaryPublicationParams().map(({ id, slug }) => ({
    url: absoluteUrl(`/glossary/${id}/${slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const manualDetailRoutes: MetadataRoute.Sitemap = listManualPublicationParams().map(({ id, slug }) => ({
    url: absoluteUrl(`/manuals/${id}/${slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
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
