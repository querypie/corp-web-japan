import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResourceCategorySidebar } from "@/components/sections/resource-category-sidebar";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
  ResourceListItems,
} from "@/components/sections/resource-list-section";
import { listEventPublicationItems } from "@/lib/publications/events/records";

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
    <main className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>イベント</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          包括的なガイド、技術マニュアル、業界ホワイトペーパー 、専門家ブログを見ることができます。
          <br />
          基本概念から高度な実装まで、すべてのドキュメントを一か所で見ることができます。
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceCategorySidebar />

        <ResourceListItems items={eventItems} />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}

