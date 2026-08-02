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
    <main {...componentNameDebugProps("GlossaryPage")} className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection className="text-left lg:pl-[300px]">
        <ResourceListHeroTitle className="!mx-0 max-w-[760px]">用語集</ResourceListHeroTitle>
        <ResourceListHeroDescription className="!mx-0 max-w-[728px] text-left text-[16px] leading-[26px] lg:text-[16px] lg:leading-[26px]">
          AI、AIエージェント、MCP、アクセス制御など、QueryPie AIに関わる主要な用語をわかりやすく解説します。
          基礎の確認から導入検討時の共通理解づくりまで、お役立てください。
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
