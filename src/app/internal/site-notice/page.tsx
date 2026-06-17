import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  parseSpotlightPositionAsof,
  parseSpotlightYPosition,
  spotlightYPositionParamName,
} from "@/components/sections/site-notice/floating-spotlight-card-position";
import { SiteNoticeDataDebugPanel } from "@/components/sections/site-notice/site-notice-data-debug-panel";
import { SiteNoticeStorageDebugPanel } from "@/components/sections/site-notice/site-notice-storage-debug-panel";
import { SiteNoticeSurface } from "@/components/sections/site-notice/site-notice-surface";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import { loadSiteNoticeFeaturedContent } from "@/lib/site-notice";

type PageProps = {
  searchParams?: Promise<{
    asof?: string | string[];
    spotlightY?: string | string[];
  }>;
};

function parseSpotlightPositionAsofParam(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;

  return parseSpotlightPositionAsof(candidate) ? candidate : undefined;
}

function parseSpotlightYPositionParam(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;

  return parseSpotlightYPosition(candidate);
}

export const metadata: Metadata = {
  title: "Internal Site Notice | QueryPie AI",
  alternates: {
    canonical: "/internal/site-notice",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const revalidate = 3600;

export default async function InternalSiteNoticePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const content = loadSiteNoticeFeaturedContent();
  const spotlightPositionAsof = parseSpotlightPositionAsofParam(resolvedSearchParams?.asof);
  const spotlightYPosition = parseSpotlightYPositionParam(resolvedSearchParams?.[spotlightYPositionParamName]);

  return (
    <main
      {...componentNameDebugProps("InternalSiteNoticePage")}
      className="relative overflow-x-hidden bg-white text-slate-950"
    >
      <SiteHeader />
      <SiteNoticeSurface spotlightPositionAsof={spotlightPositionAsof} spotlightYPosition={spotlightYPosition} />
      <SiteNoticeDataDebugPanel content={content} />
      <SiteNoticeStorageDebugPanel spotlightYPosition={spotlightYPosition} />
      <SiteFooter />
    </main>
  );
}
