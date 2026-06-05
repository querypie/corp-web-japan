import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import {
  resourceCategorySidebarLinks,
  ResourceCategorySidebar,
} from "@/components/sections/resource-category-sidebar";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
  ResourceListItems,
} from "@/components/sections/resource-list-section";
import { listIntroductionDeckPublicationItems } from "@/lib/resources/introduction-deck-publications";

export const metadata: Metadata = {
  title: "紹介資料 | QueryPie AI",
  description: "AIP / ACP の製品紹介資料をまとめて確認できる紹介資料一覧です。",
  alternates: {
    canonical: "/introduction-deck",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function IntroductionDeckPage() {
  const items = listIntroductionDeckPublicationItems();

  return (
    <main {...componentNameDebugProps("IntroductionDeckPage")} className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>紹介資料</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          包括的なガイド、技術マニュアル、業界ホワイトペーパー 、専門家ブログを見ることができます。
          <br />
          基本概念から高度な実装まで、すべてのドキュメントを一か所で見ることができます。
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceCategorySidebar links={resourceCategorySidebarLinks} activeLabel="紹介資料" />

        <ResourceListItems items={items} />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
