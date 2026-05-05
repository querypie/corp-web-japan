import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  previewResourceCategorySidebarLinks,
  ResourceCategorySidebar,
} from "@/components/sections/resource-category-sidebar";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
  ResourceListItems,
} from "@/components/sections/resource-list-section";
import { listResourcePreviewItems } from "@/lib/resources/resource-preview-items";

export const metadata: Metadata = {
  title: "ドキュメント | QueryPie AI",
  description:
    "corp-web-contents の documentation source と local MDX loader を元にした preview リソース一覧です。",
  alternates: {
    canonical: "/t/resources",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PreviewResourcesPage() {
  const items = listResourcePreviewItems();

  return (
    <main className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>ドキュメント</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          包括的なガイド、技術マニュアル、業界ホワイトペーパー 、専門家ブログを見ることができます。
          <br />
          基本概念から高度な実装まで、すべてのドキュメントを一か所で見ることができます。
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceCategorySidebar links={previewResourceCategorySidebarLinks} activeLabel="全て" />

        <ResourceListItems items={items} />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}

