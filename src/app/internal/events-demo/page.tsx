import Image from "next/image";
import Link from "next/link";
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
  const [heroEvent, ...pastEvents] = eventItems;

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

        <div className="min-w-0 flex-1">
          {heroEvent ? (
            <section>
              <Link
                href={heroEvent.href}
                className="grid gap-6 rounded-[24px] border border-slate-200 bg-slate-50 p-6 transition hover:border-slate-300 hover:opacity-90 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-10 lg:p-8"
              >
                <div className="order-2 flex flex-col gap-4 lg:order-1">
                  <span className="inline-flex self-start rounded-full border border-[#353c45] px-3 py-1 text-xs font-medium leading-[1.42] tracking-[0.015rem] text-slate-950">
                    {heroEvent.badge}
                  </span>
                  <div className="space-y-3">
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Most Recent Event</p>
                    <h2 className="text-[28px] font-medium leading-[1.25] text-slate-950 lg:text-[34px]">
                      {heroEvent.title}
                    </h2>
                  </div>
                  <p className="text-[15px] leading-7 text-slate-600">{heroEvent.description}</p>
                  {heroEvent.date ? <p className="text-sm leading-6 text-slate-400">{heroEvent.date}</p> : null}
                </div>
                <div className="order-1 aspect-[16/9] overflow-hidden rounded-[18px] bg-[#eceff3] lg:order-2">
                  <Image
                    src={heroEvent.imageSrc}
                    alt={heroEvent.title}
                    width={960}
                    height={540}
                    className="h-full w-full object-cover"
                  />
                </div>
              </Link>
            </section>
          ) : null}

          <section className="mt-12 lg:mt-16">
            <div className="mb-8 border-b border-slate-200 pb-4">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Past Events</p>
              <h2 className="mt-2 text-[28px] font-medium leading-[1.25] text-slate-950 lg:text-[32px]">지난 이벤트</h2>
            </div>

            <ResourceListItems items={pastEvents} />
          </section>
        </div>
      </ResourceListContentSection>

      <SiteFooter />
    </main>
  );
}
