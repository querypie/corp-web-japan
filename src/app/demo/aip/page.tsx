import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import { DemoCategorySidebar } from "@/components/sections/demo-category-sidebar";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
  ResourceListItems,
} from "@/components/sections/resource-list-section";
import { listAipDemoPublicationItems } from "@/lib/publications/demo/aip/records";

export const metadata: Metadata = {
  title: "QueryPie AIPの機能 | QueryPie AI",
  description:
    "AIエージェントの構築・実行から、データ連携、管理・統制まで。QueryPie AIPが企業のAI活用を支える主要機能を、デモでご紹介します。",
  alternates: {
    canonical: "/demo/aip",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function AipDemoPage() {
  const aipDemoItems = await listAipDemoPublicationItems();

  return (
    <main {...componentNameDebugProps("AipDemoPage")} className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection className="text-left lg:pl-[300px]">
        <ResourceListHeroTitle className="!mx-0 max-w-[760px]">QueryPie AIPの機能</ResourceListHeroTitle>
        <ResourceListHeroDescription className="!mx-0 max-w-[760px] text-left text-[16px] leading-[26px] lg:text-[16px] lg:leading-[26px]">
          <span className="block">AIエージェントの構築・実行から、データ連携、管理・統制まで。</span>
          <span className="block">QueryPie AIPが企業のAI活用を支える主要機能を、デモでご紹介します。</span>
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <DemoCategorySidebar activeLabel="AIP機能" />

        <ResourceListItems items={aipDemoItems} />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
