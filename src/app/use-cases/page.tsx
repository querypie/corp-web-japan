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
import { listUseCasePublicationItems } from "@/lib/publications/use-cases/records";
import { resolveResourceListVisibleCount } from "@/lib/resource-list-load-more";

export const metadata: Metadata = {
  title: "活用事例 | QueryPie AI",
  description:
    "QueryPie AIが、企業のAI活用をどのように前進させているかをご紹介します。課題から導入・定着までの取り組みを、具体的な事例でご覧いただけます。",
  alternates: {
    canonical: "/use-cases",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type UseCasesPageProps = {
  searchParams?: Promise<{
    until?: string | string[];
  }>;
};

export default async function UseCasesPage({ searchParams }: UseCasesPageProps) {
  const [useCaseItems, resolvedSearchParams] = await Promise.all([listUseCasePublicationItems(), searchParams]);
  const initialVisibleCount = resolveResourceListVisibleCount(useCaseItems, resolvedSearchParams?.until);

  return (
    <main {...componentNameDebugProps("UseCasesPage")} className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection className="text-left lg:pl-[300px]">
        <ResourceListHeroTitle className="!mx-0 max-w-[760px]">活用事例</ResourceListHeroTitle>
        <ResourceListHeroDescription className="!mx-0 max-w-[760px] text-left text-[16px] leading-[26px] lg:text-[16px] lg:leading-[26px]">
          <span className="block">QueryPie AIが、企業のAI活用をどのように前進させているかをご紹介します。</span>
          <span className="block">課題から導入・定着までの取り組みを、具体的な事例でご覧いただけます。</span>
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
