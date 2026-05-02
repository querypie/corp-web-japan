import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NewsListPage } from "@/components/sections/news-list-page";
import { listNewsPublicationItems } from "@/content/publications/news-publication-records";

export const metadata: Metadata = {
  title: "ニュース | QueryPie AI",
  description: "QueryPie AIの最新ニュース、公式発表、外部メディア掲載情報をご覧いただけます。",
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
      <NewsListPage items={newsItems} />
      <SiteFooter />
    </main>
  );
}
