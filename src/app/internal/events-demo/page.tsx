import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FeaturedEventHero } from "@/components/sections/events/hero";
import { InternalEventsDemoEmptyState } from "@/components/sections/events/empty-state";
import { InternalEventsDemoHeroToggle } from "@/components/sections/events/demo-hero-toggle";
import { ResourceCategorySidebar } from "@/components/sections/resource-category-sidebar";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
  ResourceListItems,
  ResourceListSectionDescription,
  ResourceListSectionEyebrow,
  ResourceListSectionHeading,
  ResourceListSectionTitle,
  ResourceListSectionTitleRow,
} from "@/components/sections/resource-list-section";
import { resolveInternalEventsDemoState } from "@/lib/publications/events/records";

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

type InternalEventsDemoPageProps = {
  searchParams?: Promise<{
    asof?: string | string[];
    upcoming?: string | string[];
  }>;
};

export default async function InternalEventsDemoPage({ searchParams }: InternalEventsDemoPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const { demoHeroEvent, showUpcomingEvent, visiblePastEvents } = resolveInternalEventsDemoState(resolvedSearchParams);

  return (
    <main className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-5">
            <ResourceListHeroTitle className="whitespace-normal">Internal Events Demo</ResourceListHeroTitle>
            <InternalEventsDemoHeroToggle showUpcomingEvent={showUpcomingEvent} disabled={!demoHeroEvent} />
          </div>
          <ResourceListHeroDescription className="max-w-[920px]">
            This demo page lets you preview the list composition on an internal-only route using the real event publication data before updating the events index page.
          </ResourceListHeroDescription>
        </div>
      </ResourceListHeroSection>

      <ResourceListContentSection>
        <ResourceCategorySidebar activeLabel="イベント" />

        <div className="min-w-0 flex-1">
          {showUpcomingEvent && demoHeroEvent ? (
            <FeaturedEventHero
              href={demoHeroEvent.href}
              imageSrc={demoHeroEvent.imageSrc}
              imageAlt={demoHeroEvent.title}
              badge={demoHeroEvent.badge}
              title={demoHeroEvent.title}
              description={demoHeroEvent.description}
              date={demoHeroEvent.date}
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

            <ResourceListItems items={visiblePastEvents} />
          </section>
        </div>
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
