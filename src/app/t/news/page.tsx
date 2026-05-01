import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourceListPage } from "@/components/ResourceListPage";
import { listNewsPublicationItems } from "@/content/publications/news-publication-records";

export const metadata: Metadata = {
  title: "ニュース | QueryPie AI",
  description: "QueryPie AI に関するニュースやメディア掲載情報をまとめたプレビュー一覧です。",
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
      <ResourceListPage
        title="ニュース"
        description="QueryPie AI に関するニュース、メディア掲載、アナウンスをローカル MDX で確認できるプレビュー一覧です。"
        activeCategory="news"
        items={newsItems}
      />
      <SiteFooter />
    </main>
  );
}
