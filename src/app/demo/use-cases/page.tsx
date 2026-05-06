import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { DemoCategorySidebar } from "@/components/sections/demo-category-sidebar";
import { ResourceListLoadMore } from "@/components/sections/resource-list-load-more";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
} from "@/components/sections/resource-list-section";
import { listUseCasePublicationItems } from "@/lib/publications/use-case-publication-records";
import { resolveResourceListVisibleCount } from "@/lib/resource-list-load-more";

export const metadata: Metadata = {
  title: "活用事例 | QueryPie AI",
  description:
    "QueryPie AIがお客様のためにできることを見つけることができます。ライブデモを視聴し、実際のユースケースをご覧になってください。AIPとACP機能の実際の動作を確認したり、インタラクティブなショーケースを通じて全体像を把握することができます。",
  alternates: {
    canonical: "/demo/use-cases",
  },
};

type UseCasesPageProps = {
  searchParams?: Promise<{
    until?: string | string[];
  }>;
};

export default async function DemoUseCasesPage({ searchParams }: UseCasesPageProps) {
  const [useCaseItems, resolvedSearchParams] = await Promise.all([listUseCasePublicationItems(), searchParams]);
  const initialVisibleCount = resolveResourceListVisibleCount(useCaseItems, resolvedSearchParams?.until);

  return (
    <main className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>活用事例</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          QueryPie AIがお客様のためにできることを見つけることができます。
          ライブデモを視聴し、実際のユースケースをご覧になってください。
          AIPとACP機能の実際の動作を確認したり、インタラクティブなショーケースを通じて全体像を把握することができます。
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <DemoCategorySidebar activeLabel="活用事例" />

        <ResourceListLoadMore
          key={`use-cases:${initialVisibleCount}`}
          items={useCaseItems}
          initialVisibleCount={initialVisibleCount}
        />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
