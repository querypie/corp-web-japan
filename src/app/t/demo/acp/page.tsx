import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { DemoCategorySidebar } from "@/components/sections/demo-category-sidebar";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
  ResourceListItems,
} from "@/components/sections/resource-list-section";
import { listAcpDemoPublicationItems } from "@/lib/publications/acp-demo-publication-records";

export const metadata: Metadata = {
  title: "ACP機能 | QueryPie AI",
  description: "QueryPie ACP機能デモをまとめたプレビュー一覧です。",
  alternates: {
    canonical: "/t/demo/acp",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function TestAcpDemoPage() {
  const acpDemoItems = await listAcpDemoPublicationItems();

  return (
    <main className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>ACP機能</ResourceListHeroTitle>
        <ResourceListHeroDescription>QueryPie ACPの主要機能デモを一覧で確認できるプレビューページです。各デモから詳細なMDXコンテンツを確認できます。</ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <DemoCategorySidebar activeLabel="ACP機能" />

        <ResourceListItems items={acpDemoItems} />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}

