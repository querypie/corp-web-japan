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
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>ドキュメント</ResourceListHeroTitle>
        <ResourceListHeroDescription>紹介資料、用語集、マニュアルに加えて、現在の日本向けホワイトペーパーとブログもまとめて確認できる preview リソース一覧です。</ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceCategorySidebar links={previewResourceCategorySidebarLinks} activeLabel="全て" />

        <ResourceListItems items={items} />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
