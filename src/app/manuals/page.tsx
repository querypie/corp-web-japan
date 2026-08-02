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
import { listManualPreviewItems } from "@/lib/resources/resource-preview-items";

export const metadata: Metadata = {
  title: "マニュアル | QueryPie AI",
  description:
    "リリースノート、管理者マニュアル、ユーザーマニュアル、API Docs など、QueryPie の主要ドキュメントをまとめて確認できるマニュアル一覧です。",
  alternates: {
    canonical: "/manuals",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ManualsPage() {
  const items = listManualPreviewItems();

  return (
    <main {...componentNameDebugProps("ManualsPage")} className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection className="text-left lg:pl-[300px]">
        <ResourceListHeroTitle className="!mx-0 max-w-[760px]">マニュアル</ResourceListHeroTitle>
        <ResourceListHeroDescription className="!mx-0 max-w-[760px] text-left text-[16px] leading-[26px] lg:text-[16px] lg:leading-[26px]">
          QueryPie AIの導入、設定、日常的な利用、運用に必要な手順を確認できます。
          リリースノートやAPIリファレンスを含め、製品を使いこなすための最新情報をご用意しています。
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceCategorySidebar links={resourceCategorySidebarLinks} activeLabel="マニュアル" />
        <ResourceListItems items={items} />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
