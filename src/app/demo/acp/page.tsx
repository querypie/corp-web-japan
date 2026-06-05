import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import { DemoCategorySidebar } from "@/components/sections/demo-category-sidebar";
import { ResourceListLoadMore } from "@/components/sections/resource-list-load-more";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
} from "@/components/sections/resource-list-section";
import { listAcpDemoPublicationItems } from "@/lib/publications/demo/acp/records";
import { resolveResourceListVisibleCount } from "@/lib/resource-list-load-more";

export const metadata: Metadata = {
  title: "QueryPie Access Control Platform (ACP) の機能 | QueryPie AI",
  description:
    "QueryPie AIがお客様のためにできることを見つけることができます。ライブデモを視聴し、実際のユースケースをご覧になってください。AIPとACP機能の実際の動作を確認したり、インタラクティブなショーケースを通じて全体像を把握することができます。",
  alternates: {
    canonical: "/demo/acp",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type AcpDemoPageProps = {
  searchParams?: Promise<{
    until?: string | string[];
  }>;
};

export default async function AcpDemoPage({ searchParams }: AcpDemoPageProps) {
  const [acpDemoItems, resolvedSearchParams] = await Promise.all([listAcpDemoPublicationItems(), searchParams]);
  const initialVisibleCount = resolveResourceListVisibleCount(acpDemoItems, resolvedSearchParams?.until);

  return (
    <main {...componentNameDebugProps("AcpDemoPage")} className="relative bg-white text-slate-950">
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

        <ResourceListLoadMore
          key={`acp:${initialVisibleCount}`}
          items={acpDemoItems}
          initialVisibleCount={initialVisibleCount}
        />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
