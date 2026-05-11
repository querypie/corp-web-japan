import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
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
import { listGlossaryPublicationItems } from "@/lib/resources/glossary-publications";

export const metadata: Metadata = {
  title: "用語集 | QueryPie AI",
  description: "QueryPie AI の主要セキュリティ・AI用語を確認できる用語集一覧です。",
  alternates: {
    canonical: "/glossary",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GlossaryPage() {
  const items = listGlossaryPublicationItems();

  return (
    <main className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>用語集</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          包括的なガイド、技術マニュアル、業界ホワイトペーパー 、専門家ブログを見ることができます。
          <br />
          基本概念から高度な実装まで、すべてのドキュメントを一か所で見ることができます。
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceCategorySidebar links={resourceCategorySidebarLinks} activeLabel="用語集" />

        <ResourceListItems items={items} />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
