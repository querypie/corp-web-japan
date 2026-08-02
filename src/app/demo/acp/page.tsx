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
  title: "QueryPie ACPの機能 | QueryPie AI",
  description:
    "データベース、システム、Kubernetes、Web/SaaS、MCPへのアクセスを一元統制。QueryPie ACPの主要機能を、デモでご紹介します。",
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

      <ResourceListHeroSection className="text-left lg:pl-[300px]">
        <ResourceListHeroTitle className="!mx-0 max-w-[760px]">QueryPie ACPの機能</ResourceListHeroTitle>
        <ResourceListHeroDescription className="!mx-0 max-w-[760px] text-left text-[16px] leading-[26px] lg:text-[16px] lg:leading-[26px]">
          <span className="block">データベース、システム、Kubernetes、Web/SaaS、MCPへのアクセスを一元統制。</span>
          <span className="block">QueryPie ACPの主要機能を、デモでご紹介します。</span>
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
