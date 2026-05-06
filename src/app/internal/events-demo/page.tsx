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
import { listEventPublicationItems } from "@/lib/publications/event-publication-records";

export const metadata: Metadata = {
  title: "Internal Events Demo | QueryPie AI",
  alternates: {
    canonical: "/internal/events-demo",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function InternalEventsDemoPage() {
  const eventItems = await listEventPublicationItems();

  return (
    <main className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>Internal Events Demo</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          events 목록 페이지 변경 전에, 실제 event publication 데이터를 그대로 사용해 internal 경로에서만 먼저 리스트 구성을 확인할 수 있는 데모 페이지입니다.
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceCategorySidebar activeLabel="イベント" />

        <ResourceListItems items={eventItems} />
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
