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

      <ResourceListHeroSection className="text-left lg:pl-[300px]">
        <ResourceListHeroTitle className="mx-0 max-w-[760px]">紹介資料</ResourceListHeroTitle>
        <ResourceListHeroDescription className="mx-0 max-w-[760px] text-left text-[16px] leading-[26px] lg:text-[16px] lg:leading-[26px]">
          QueryPie AIの製品・サービスの概要、主な機能、導入イメージをまとめた資料です。
          導入検討や、社内の関係者との情報共有にご活用ください。
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
