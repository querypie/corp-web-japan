import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NewsArticleLoadMore } from "@/components/sections/news/list-load-more";
import { NewsListSection, NewsPageIntro, NewsPageSection, NewsPageTitle } from "@/components/sections/news/page-section";
import { AipFreeTrialCtaSection } from "@/components/sections/simple-cta-section";
import { listNewsPublicationItems } from "@/lib/publications/news/records";
import { resolveResourceListVisibleCount } from "@/lib/resource-list-load-more";

export const metadata: Metadata = {
  title: "ニュース | QueryPie AI",
  description: "QueryPie AIの最新ニュース、公式発表、外部メディア掲載情報をご覧いただけます。",
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
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <NewsPageSection>
        <NewsPageIntro>
          <NewsPageTitle>ニュース</NewsPageTitle>
        </NewsPageIntro>
        <NewsListSection>
          <NewsArticleLoadMore
            key={`news:${initialVisibleCount}`}
            items={newsItems}
            initialVisibleCount={initialVisibleCount}
          />
        </NewsListSection>
      </NewsPageSection>

      <AipFreeTrialCtaSection />

      <SiteFooter />
    </main>
  );
}
