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

      <ResourceListHeroSection>
        <ResourceListHeroTitle>マニュアル</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          リリースノート、マニュアル、API Reference など、QueryPie の導入・運用・活用に役立つドキュメントをご用意しています。
          <br />
          製品の設定方法から日常的な利用手順、最新のアップデート情報まで、必要な情報を目的に応じてすばやくご確認いただけます。
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
