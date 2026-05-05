import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourceCategorySidebar } from "@/components/sections/resource-category-sidebar";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
  ResourceListItems,
} from "@/components/sections/resource-list-section";
import { listWhitepaperPublicationItems } from "@/lib/publications/whitepaper-publication-records";

export const metadata: Metadata = {
  title: "ホワイトペーパー | QueryPie AI",
  description: "AI Staff に関する資料や導入検討向けホワイトペーパーをまとめたページです。",
  alternates: {
    canonical: "/whitepapers",
  },
};

export default async function WhitepaperPage() {
  const whitepaperItems = await listWhitepaperPublicationItems();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>ホワイトペーパー</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          包括的なガイド、技術マニュアル、業界ホワイトペーパー 、専門家ブログを見ることができます。基本概念から高度な実装まで、すべてのドキュメントを一か所で見ることができます。
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceCategorySidebar activeLabel="ホワイトペーパー" />

        <ResourceListItems items={whitepaperItems} />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
