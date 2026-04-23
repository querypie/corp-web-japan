import type { Metadata } from "next";
import { notFound } from "next/navigation";
// import { SiteFooter } from "@/components/layout/site-footer";
// import { SiteHeader } from "@/components/layout/site-header";
// import { ResourcePage } from "@/components/sections/resource-page";
// import { eventItems } from "@/content/resources/events";

export const metadata: Metadata = {
  title: "イベント | AI Staff",
  description: "AI Staff に関するセミナーやイベント情報をまとめたページです。",
};

export default function EventsPage() {
  // TODO: When the real externally publishable event content is ready,
  // restore the original page composition below and start exposing `/events`.
  // return (
  //   <main className="relative overflow-x-hidden bg-white text-slate-950">
  //     <SiteHeader />
  //     <ResourcePage
  //       title="イベント"
  //       description="包括的なガイド、技術マニュアル、業界ホワイトペーパー 、専門家ブログを見ることができます。基本概念から高度な実装まで、すべてのドキュメントを一か所で見ることができます。"
  //       activeCategory="events"
  //       items={eventItems}
  //     />
  //     <SiteFooter />
  //   </main>
  // );

  return notFound();
}
