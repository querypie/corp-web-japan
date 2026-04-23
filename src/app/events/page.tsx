import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourcePage } from "@/components/sections/resource-page";
import { eventItems } from "@/content/resources/events";

export const metadata: Metadata = {
  title: "イベント | QueryPie AI",
  description: "AI Staff に関するセミナーやイベント情報をまとめたページです。",
};

export default function EventsPage() {
  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <ResourcePage
        title="イベント"
        description="包括的なガイド、技術マニュアル、業界ホワイトペーパー 、専門家ブログを見ることができます。基本概念から高度な実装まで、すべてのドキュメントを一か所で見ることができます。"
        activeCategory="events"
        items={eventItems}
      />
      <SiteFooter />
    </main>
  );
}
