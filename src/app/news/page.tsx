import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NewsArticleList } from "@/components/sections/news-list-page";
import {
  NewsFinalCtaAction,
  NewsFinalCtaBody,
  NewsFinalCtaSection,
  NewsFinalCtaShell,
  NewsFinalCtaTitle,
  NewsPageListArea,
  NewsPageSection,
  NewsPageTitle,
} from "@/components/sections/news-page-section";
import { listNewsPublicationItems } from "@/lib/publications/news-publication-records";

export const metadata: Metadata = {
  title: "ニュース | QueryPie AI",
  description: "QueryPie AIの最新ニュース、公式発表、外部メディア掲載情報をご覧いただけます。",
  alternates: {
    canonical: "/news",
  },
};

export default function NewsPage() {
  const newsItems = listNewsPublicationItems();
  const newsTrialUrl = "https://app.querypie.com/";

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <NewsPageSection>
        <div className="mx-auto max-w-[1200px]">
          <NewsPageTitle>News</NewsPageTitle>
          <NewsPageListArea>
            <NewsArticleList items={newsItems} />
          </NewsPageListArea>
        </div>
      </NewsPageSection>

      <NewsFinalCtaSection>
        <NewsFinalCtaShell>
          <NewsFinalCtaTitle>まずは小さく、失敗しないAXを始めよう</NewsFinalCtaTitle>
          <NewsFinalCtaBody>
            簡単サインアップで、14日間の無料トライアルをお試しください
          </NewsFinalCtaBody>
          <NewsFinalCtaAction href={newsTrialUrl}>無料で試してみる</NewsFinalCtaAction>
        </NewsFinalCtaShell>
      </NewsFinalCtaSection>

      <SiteFooter />
    </main>
  );
}