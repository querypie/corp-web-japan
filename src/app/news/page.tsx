import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import { NewsArticleLoadMore } from "@/components/sections/news/list-load-more";
import { NewsListSection } from "@/components/sections/news/page-section";
import {
  CompanyPageLayout,
  CompanyPageIntro,
  CompanyPageLead,
  CompanyPageSection,
  CompanyPageTitle,
} from "@/components/sections/company/page-primitives";
import { AipFreeTrialCtaSection } from "@/components/sections/simple-cta-section";
import { listNewsPublicationItems } from "@/lib/publications/news/records";
import { resolveResourceListVisibleCount } from "@/lib/resource-list-load-more";

export const metadata: Metadata = {
  title: "ニュース | QueryPie AI",
  description:
    "QueryPie AIの公式発表、プレスリリース、メディア掲載情報を集約し、事業や製品に関する最新ニュースをお届けします。",
  alternates: {
    canonical: "/news",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type NewsPageProps = {
  searchParams?: Promise<{
    until?: string | string[];
  }>;
};

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const [newsItems, resolvedSearchParams] = await Promise.all([listNewsPublicationItems(), searchParams]);
  const initialVisibleCount = resolveResourceListVisibleCount(newsItems, resolvedSearchParams?.until);

  return (
    <main {...componentNameDebugProps("NewsPage")} className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <CompanyPageSection>
        <CompanyPageIntro>
          <CompanyPageTitle>ニュース</CompanyPageTitle>
          <CompanyPageLead>
            QueryPie AIの公式発表、プレスリリース、メディア掲載情報を集約し、事業や製品に関する最新ニュースをお届けします。
          </CompanyPageLead>
        </CompanyPageIntro>
        <CompanyPageLayout>
          <NewsListSection>
            <NewsArticleLoadMore
              key={`news:${initialVisibleCount}`}
              items={newsItems}
              initialVisibleCount={initialVisibleCount}
            />
          </NewsListSection>
        </CompanyPageLayout>
      </CompanyPageSection>

      <AipFreeTrialCtaSection />

      <SiteFooter />
    </main>
  );
}
