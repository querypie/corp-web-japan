import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourceListLoadMore } from "@/components/sections/resource-list-load-more";
import { ResourceCategorySidebar } from "@/components/sections/resource-category-sidebar";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
} from "@/components/sections/resource-list-section";
import { listWhitepaperPublicationItems } from "@/lib/publications/whitepapers/records";
import { resolveResourceListVisibleCount } from "@/lib/resource-list-load-more";

export const metadata: Metadata = {
  title: "ホワイトペーパー | QueryPie AI",
  description: "AI Staff に関する資料や導入検討向けホワイトペーパーをまとめたページです。",
  alternates: {
    canonical: "/whitepapers",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type WhitepaperPageProps = {
  searchParams?: Promise<{
    until?: string | string[];
  }>;
};

export default async function WhitepaperPage({ searchParams }: WhitepaperPageProps) {
  const [whitepaperItems, resolvedSearchParams] = await Promise.all([listWhitepaperPublicationItems(), searchParams]);
  const initialVisibleCount = resolveResourceListVisibleCount(whitepaperItems, resolvedSearchParams?.until);

  return (
    <main className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>ホワイトペーパー</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          包括的なガイド、技術マニュアル、業界ホワイトペーパー 、専門家ブログを見ることができます。
          <br />
          基本概念から高度な実装まで、すべてのドキュメントを一か所で見ることができます。
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceCategorySidebar activeLabel="ホワイトペーパー" />

        <ResourceListLoadMore
          key={`whitepaper:${initialVisibleCount}`}
          items={whitepaperItems}
          initialVisibleCount={initialVisibleCount}
        />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}

