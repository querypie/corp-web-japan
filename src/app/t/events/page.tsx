import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FeaturedEventHero } from "@/components/sections/featured-event-hero";
import { InternalEventsDemoEmptyState } from "@/components/sections/internal-events-demo-empty-state";
import { ResourceCategorySidebar } from "@/components/sections/resource-category-sidebar";
import {
  ResourceListContentSection,
  ResourceListHeroDescription,
  ResourceListHeroSection,
  ResourceListHeroTitle,
  ResourceListItems,
} from "@/components/sections/resource-list-section";
import { resolveEventTimeline } from "@/lib/publications/events/records";

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

type TestEventsPageProps = {
  searchParams?: Promise<{
    asof?: string | string[];
  }>;
};

export default async function TestEventsPage({ searchParams }: TestEventsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const { heroEvent, pastEvents } = resolveEventTimeline(resolvedSearchParams?.asof);

  return (
    <main className="relative bg-white text-slate-950">
      <SiteHeader />

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
            <div className="mb-8 border-b border-slate-200 pb-4">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Past Events</p>
              <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-baseline lg:gap-4">
                <h2 className="text-[28px] font-medium leading-[1.25] text-slate-950 lg:text-[32px]">過去のイベント</h2>
                <p className="text-base leading-7 text-slate-600">カンファレンスやセミナーのインサイトをご覧ください。</p>
              </div>
            </div>

            <ResourceListItems items={pastEvents} />
          </section>
        </div>
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
