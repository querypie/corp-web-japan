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
import { listManualPreviewItems } from "@/lib/resources/resource-preview-items";

export const metadata: Metadata = {
  title: "マニュアル | QueryPie AI",
  description: "リリースノート、管理者マニュアル、ユーザーマニュアル、API Docs など、QueryPie の主要ドキュメントをまとめて確認できるマニュアル一覧です。",
  alternates: {
    canonical: "/t/manuals",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PreviewManualsPage() {
  const items = listManualPreviewItems();

  return (
    <main className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>マニュアル</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          リリースノート、管理者マニュアル、ユーザーマニュアル、API Docs など、QueryPie の導入・運用・活用に役立つ主要ドキュメントをまとめてご覧いただけます。
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceCategorySidebar links={previewResourceCategorySidebarLinks} activeLabel="マニュアル" />
        <ResourceListItems items={items} />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
