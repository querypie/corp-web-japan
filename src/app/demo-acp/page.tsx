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
  title: "QueryPie Access Control Platform (ACP) の機能 | QueryPie AI",
  description:
    "QueryPie AIがお客様のためにできることを見つけることができます。ライブデモを視聴し、実際のユースケースをご覧になってください。AIPとACP機能の実際の動作を確認したり、インタラクティブなショーケースを通じて全体像を把握することができます。",
  alternates: {
    canonical: "/demo-acp",
  },
};

export default async function AcpDemoPage() {
  const acpDemoItems = await listAcpDemoPublicationItems();

  return (
    <main className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>QueryPie Access Control Platform (ACP) の機能</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          QueryPie AIがお客様のためにできることを見つけることができます。
          ライブデモを視聴し、実際のユースケースをご覧になってください。
          AIPとACP機能の実際の動作を確認したり、インタラクティブなショーケースを通じて全体像を把握することができます。
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <DemoCategorySidebar activeLabel="ACP機能" />

        <ResourceListItems items={acpDemoItems} />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
