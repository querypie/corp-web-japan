import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NewsArticleList } from "@/components/sections/news/list-page";
import { NewsListSection, NewsPageIntro, NewsPageSection, NewsPageTitle } from "@/components/sections/news/page-section";
import { AipFreeTrialCtaSection } from "@/components/sections/simple-cta-section";
import { listNewsPublicationItems } from "@/lib/publications/news/records";

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

export default function NewsPage() {
  const newsItems = listNewsPublicationItems();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <NewsPageSection>
        <NewsPageIntro>
          <NewsPageTitle>News</NewsPageTitle>
        </NewsPageIntro>
        <NewsListSection>
          <NewsArticleList items={newsItems} />
        </NewsListSection>
      </NewsPageSection>

      <AipFreeTrialCtaSection />

      <SiteFooter />
    </main>
  );
}
