import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NewsListPage } from "@/components/sections/news-list-page";
import { listNewsPublicationItems } from "@/content/publications/news-publication-records";

export const metadata: Metadata = {
  title: "ニュース | QueryPie AI",
  description: "QueryPie AI の公式発表と外部メディア掲載をまとめて確認できるニュース一覧です。",
  alternates: {
    canonical: "/t/news",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function TestNewsPage() {
  const newsItems = await listNewsPublicationItems();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <NewsListPage
        title="ニュース"
        description="QueryPie AI の公式発表、プロダクト関連ニュース、外部メディア掲載を掲載日順にまとめています。"
        items={newsItems}
      />
      <SiteFooter />
    </main>
  );
}
