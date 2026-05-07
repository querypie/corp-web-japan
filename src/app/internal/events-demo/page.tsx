import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FeaturedEventHero } from "@/components/sections/featured-event-hero";
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
  const [heroEvent] = eventItems;

  return (
    <main className="relative bg-white text-slate-950">
      <SiteHeader />

      <ResourceListHeroSection>
        <ResourceListHeroTitle>Internal Events Demo</ResourceListHeroTitle>
        <ResourceListHeroDescription>
          This demo page lets you preview the list composition on an internal-only route using the real event publication data before updating the events index page.
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
          ) : null}

          <section className="mt-12 lg:mt-16">
            <div className="mb-8 border-b border-slate-200 pb-4">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-baseline lg:gap-4">
                <h2 className="text-[28px] font-medium leading-[1.25] text-slate-950 lg:text-[32px]">過去のイベント</h2>
                <p className="text-base leading-7 text-slate-600">カンファレンスやセミナーのインサイトをご覧ください。</p>
              </div>
            </div>

            <ResourceListItems items={eventItems} />
          </section>
        </div>
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
