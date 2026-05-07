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
import { listAipDemoPublicationItems } from "@/lib/publications/demo/aip/records";

export const metadata: Metadata = {
  title: "QueryPie AI Platform (AIP) の機能 | QueryPie AI",
  description:
    "QueryPie AIがお客様のためにできることを見つけることができます。ライブデモを視聴し、実際のユースケースをご覧になってください。AIPとACP機能の実際の動作を確認したり、インタラクティブなショーケースを通じて全体像を把握することができます。",
  alternates: {
    canonical: "/demo/aip",
  },
};

export default async function AipDemoPage() {
  const aipDemoItems = await listAipDemoPublicationItems();

  return (
    <main className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>QueryPie AI Platform (AIP) の機能</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          QueryPie AIがお客様のためにできることを見つけることができます。
          ライブデモを視聴し、実際のユースケースをご覧になってください。
          AIPとACP機能の実際の動作を確認したり、インタラクティブなショーケースを通じて全体像を把握することができます。
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
