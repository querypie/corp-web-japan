import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourcePage } from "@/components/sections/resource-page";
import { eventItems } from "@/content/resources/events";

export const metadata: Metadata = {
  title: "イベント | QueryPie AI",
  description: "QueryPie AI に関するセミナーやイベント情報をまとめたページです。",
  alternates: {
    canonical: "/events",
  },
};

export default function EventsPage() {
  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <ResourcePage
        title="イベント"
        description="QueryPie AI に関するウェビナー、セミナー、オンデマンドイベント情報をまとめたページです。"
        activeCategory="events"
        items={eventItems}
      />
      <SiteFooter />
    </main>
  );
}
