import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteNoticeDataDebugPanel } from "@/components/sections/site-notice/site-notice-data-debug-panel";
import { SiteNoticeStorageDebugPanel } from "@/components/sections/site-notice/site-notice-storage-debug-panel";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import { loadSiteNoticeFeaturedContent } from "@/lib/site-notice";

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

export default function InternalSiteNoticePage() {
  const content = loadSiteNoticeFeaturedContent();

  return (
    <main
      {...componentNameDebugProps("InternalSiteNoticePage")}
      className="relative overflow-x-hidden bg-white text-slate-950"
    >
      <SiteHeader />
      <SiteNoticeDataDebugPanel content={content} />
      <SiteNoticeStorageDebugPanel />
      <SiteFooter />
    </main>
  );
}
