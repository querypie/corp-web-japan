import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import { SiteNoticeSurface } from "@/components/sections/site-notice/site-notice-surface";
import { FeaturedEventHero } from "@/components/sections/events/hero";
import { InternalEventsDemoEmptyState } from "@/components/sections/events/empty-state";
import { ResourceCategorySidebar } from "@/components/sections/resource-category-sidebar";
import { ResourceListLoadMore } from "@/components/sections/resource-list-load-more";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
  ResourceListSectionDescription,
  ResourceListSectionEyebrow,
  ResourceListSectionHeading,
  ResourceListSectionTitle,
  ResourceListSectionTitleRow,
} from "@/components/sections/resource-list-section";
import { resolveEventTimeline } from "@/lib/publications/events/records";
import { resolveResourceListVisibleCount } from "@/lib/resource-list-load-more";

export const metadata: Metadata = {
  title: "イベント | QueryPie AI",
  description: "QueryPie AI に関するセミナーやイベント情報をまとめたページです。",
  alternates: {
    canonical: "/events",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const revalidate = 3600;

type EventsPageProps = {
  searchParams?: Promise<{
    asof?: string | string[];
    until?: string | string[];
  }>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const { heroEvent, pastEvents } = resolveEventTimeline(resolvedSearchParams?.asof);
  const initialVisibleCount = resolveResourceListVisibleCount(pastEvents, resolvedSearchParams?.until);

  return (
    <main {...componentNameDebugProps("EventsPage")} className="relative bg-white text-slate-950">
      <SiteHeader />
      <SiteNoticeSurface />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>イベント</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          QueryPie AI に関するセミナーやウェビナー、イベント情報をご覧いただけます。
          <br />
          開催予定のイベントから過去のインサイトまで、最新の情報を一か所で確認できます。
        </ResourceListHeroDescription>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceCategorySidebar activeLabel="イベント" />

        <div className="min-w-0 flex-1">
          {heroEvent ? (
            <FeaturedEventHero
              href={heroEvent.href}
              imageSrc={heroEvent.imageSrc}
              imageAlt={heroEvent.title}
              badge={heroEvent.badge}
              title={heroEvent.title}
              description={heroEvent.description}
              date={heroEvent.date}
              eyebrow="Upcoming Event"
              ctaLabel="詳細を見る"
            />
          ) : (
            <InternalEventsDemoEmptyState />
          )}

          <section className="mt-12 lg:mt-16">
            <ResourceListSectionHeading>
              <ResourceListSectionEyebrow>Past Events</ResourceListSectionEyebrow>
              <ResourceListSectionTitleRow>
                <ResourceListSectionTitle>過去のイベント</ResourceListSectionTitle>
                <ResourceListSectionDescription>カンファレンスやセミナーのインサイトをご覧ください。</ResourceListSectionDescription>
              </ResourceListSectionTitleRow>
            </ResourceListSectionHeading>

            <ResourceListLoadMore
              key={`events:${initialVisibleCount}`}
              items={pastEvents}
              initialVisibleCount={initialVisibleCount}
            />
          </section>
        </div>
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
