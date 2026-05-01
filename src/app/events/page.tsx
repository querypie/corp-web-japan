import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourceListPage } from "@/components/sections/resource-list-page";
import { eventItems } from "@/content/resources/events";

export const metadata: Metadata = {
  title: "イベント | QueryPie AI",
  description: "QueryPie AI に関するセミナーやイベント情報をまとめたページです。",
};

type EventsPageProps = {
  searchParams?: Promise<{
    unblock?: string | string[];
  }>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const unblockParam = resolvedSearchParams?.unblock;
  const isEventContentReady = Array.isArray(unblockParam)
    ? unblockParam.length > 0
    : typeof unblockParam === "string";

  if (!isEventContentReady) {
    // TODO: When the real externally publishable event content is ready,
    // replace this temporary `unblock` query-based readiness check with the final launch condition.
    return notFound();
  }

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
