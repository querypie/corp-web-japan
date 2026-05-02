import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourceListPage } from "@/components/sections/resource-list-page";
import { listEventPublicationItems } from "@/content/publications/event-publication-records";

export const metadata: Metadata = {
  title: "イベント | QueryPie AI",
  description: "QueryPie AI に関するセミナーやイベント情報をまとめたページです。",
  alternates: {
    canonical: "/t/events",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function TestEventsPage() {
  const eventItems = await listEventPublicationItems();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <ResourceListPage
        title="イベント"
        description="包括的なガイド、技術マニュアル、業界ホワイトペーパー 、専門家ブログを見ることができます。基本概念から高度な実装まで、すべてのドキュメントを一か所で見ることができます。"
        activeCategory="events"
        items={eventItems}
      />
      <SiteFooter />
    </main>
  );
}
