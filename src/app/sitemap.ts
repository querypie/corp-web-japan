import type { MetadataRoute } from "next";
import { acpDemoPublicationRecords } from "@/lib/publications/acp-demo-publication-records";
import { aipDemoPublicationRecords } from "@/lib/publications/aip-demo-publication-records";
import {
  useCasePublicationRecords,
} from "@/lib/publications/use-case-publication-records";
import { eventPostRecords, getEventPostHref } from "@/content/resources/events";
import { getAcpDemoPublicationHref } from "@/lib/publications/get-acp-demo-publication-post";
import { getAipDemoPublicationHref } from "@/lib/publications/get-aip-demo-publication-post";
import { getUseCasePublicationHref } from "@/lib/publications/get-use-case-publication-post";
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
    url: absoluteUrl("/contact-us"),
    changeFrequency: "weekly",
    priority: 0.7,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const eventDetailRoutes: MetadataRoute.Sitemap = eventPostRecords.map(({ id, slug }) => ({
    url: absoluteUrl(getEventPostHref(id, slug)),
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

  return [...staticRoutes, ...eventDetailRoutes, ...useCaseDetailRoutes, ...aipDemoDetailRoutes, ...acpDemoDetailRoutes];
}
