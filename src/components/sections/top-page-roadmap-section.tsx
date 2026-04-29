"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import { ArrowDown, ArrowRight, Building2, Compass, Settings2 } from "lucide-react";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

type RoadmapBodyPart = {
  text: string;
  strong: boolean;
};

type RoadmapStep = {
  number: string;
  label: string;
  title: {
    before: string;
    highlight: string;
    after: string;
  };
  body: readonly RoadmapBodyPart[];
};

type RoadmapTab = {
  key: "crew" | "dashi";
  label: string;
  description: string;
  steps: readonly RoadmapStep[];
};

type RoadmapLink = {
  title: string;
  body: string;
  ctaLabel: string;
  href: string;
  image: {
    src: string;
    alt: string;
  };
};

type RoadmapData = {
  title: {
    line1: string;
    before: string;
    highlight: string;
    after: string;
  };
  body: string;
  tabs: readonly RoadmapTab[];
  links: readonly RoadmapLink[];
};

type TopPageRoadmapSectionProps = {
  roadmap: RoadmapData;
};

const roadmapIcons = [Compass, Settings2, Building2] as const;

export function TopPageRoadmapSection({ roadmap }: TopPageRoadmapSectionProps) {
  const [activeRoadmapTab, setActiveRoadmapTab] = useState<"crew" | "dashi">(
    (roadmap.tabs[0]?.key as "crew" | "dashi") ?? "crew",
  );
  const activeRoadmap = roadmap.tabs.find((tab) => tab.key === activeRoadmapTab) ?? roadmap.tabs[0];
  const activeRoadmapTheme =
    activeRoadmap.key === "crew"
      ? {
          activeTab: "border-[#174EA6] bg-[#174EA6] text-white shadow-[0_12px_26px_-18px_rgba(23,78,166,0.45)]",
          inactiveTab: "border-[#C9D8F5] bg-white text-[#174EA6] hover:bg-[#EEF4FF]",
          accentText: "text-[#174EA6]",
          labelClass: "border-[#C9D8F5] bg-white text-[#174EA6]",
        }
      : {
          activeTab: "border-[#ED602E] bg-[#ED602E] text-white shadow-[0_12px_26px_-18px_rgba(237,96,46,0.45)]",
          inactiveTab: "border-[#F0C8B7] bg-white text-[#B85733] hover:bg-[#FFF4EE]",
          accentText: "text-[#B85733]",
          labelClass: "border-[#F0C8B7] bg-white text-[#B85733]",
        };

  return (
    <section className="mx-auto max-w-[1920px] bg-[#f7f9fc] px-6 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-[1120px]">
        <div className="mx-auto max-w-[860px] text-center">
          <RevealOnScroll variant="up">
            <h2 className="text-[30px] font-semibold leading-[1.2] tracking-[-0.04em] text-slate-950 sm:text-[42px]">
              {roadmap.title.line1}
              <br />
              {roadmap.title.before}
              <span className="heading-highlight-accent">{roadmap.title.highlight}</span>
              {roadmap.title.after}
            </h2>
          </RevealOnScroll>
          <RevealOnScroll variant="up" delayMs={120}>
            <p className="ml-auto mr-auto mt-5 max-w-[860px] pl-3 text-left text-[15px] leading-7 text-slate-600 lg:pl-5 lg:text-balance">
              {roadmap.body}
            </p>
          </RevealOnScroll>
        </div>

        <RevealOnScroll className="mt-10" variant="up" delayMs={220}>
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {roadmap.tabs.map((tab) => {
              const active = tab.key === activeRoadmapTab;
              const tabTheme =
                tab.key === "crew"
                  ? {
                      active: "border-[#174EA6] bg-[#174EA6] text-white shadow-[0_12px_26px_-18px_rgba(23,78,166,0.45)]",
                      inactive: "border-[#C9D8F5] bg-white text-[#174EA6] hover:bg-[#EEF4FF]",
                    }
                  : {
                      active: "border-[#ED602E] bg-[#ED602E] text-white shadow-[0_12px_26px_-18px_rgba(237,96,46,0.45)]",
                      inactive: "border-[#F0C8B7] bg-white text-[#B85733] hover:bg-[#FFF4EE]",
                    };

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveRoadmapTab(tab.key)}
                  className={`inline-flex min-h-[40px] items-center rounded-full border px-4 py-2 text-[13px] font-semibold transition ${
                    active ? tabTheme.active : tabTheme.inactive
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="hidden items-stretch gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
            {activeRoadmap.steps.map((step, index) => (
              <Fragment key={step.number}>
                <article className="flex h-full flex-col rounded-[1.5rem] border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-md">
                  {(() => {
                    const Icon = roadmapIcons[index];
                    return (
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#eef2f7] text-[#2f3a49]">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className={`inline-flex min-h-[32px] items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.04em] shadow-[0_12px_24px_-20px_rgba(15,23,42,0.20)] ${activeRoadmapTheme.labelClass}`}>
                            {step.label}
                          </div>
                        </div>
                        <p className={`mt-3 text-[12px] font-semibold tracking-[0.08em] ${activeRoadmapTheme.accentText}`}>
                          STEP {index + 1}
                        </p>
                      </div>
                    );
                  })()}
                  <h3 className="mt-2 min-h-[72px] text-[20px] font-semibold leading-[1.4] tracking-[-0.02em] text-slate-900">
                    {step.title.before}
                    {step.title.highlight}
                    {step.title.after}
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm leading-7 text-slate-600">
                    {step.body.map((part, bodyIndex) =>
                      part.strong ? (
                        <strong key={`${part.text}-${bodyIndex}`} className="font-bold text-slate-800">
                          {part.text}
                        </strong>
                      ) : (
                        <span key={`${part.text}-${bodyIndex}`}>{part.text}</span>
                      ),
                    )}
                  </p>
                </article>

                {index < activeRoadmap.steps.length - 1 ? (
                  <div className="hidden lg:flex lg:justify-center">
                    <ArrowRight className="h-8 w-8 text-slate-300" />
                  </div>
                ) : null}
              </Fragment>
            ))}
          </div>

          <div className="space-y-3 lg:hidden">
            {activeRoadmap.steps.map((step, index) => (
              <Fragment key={step.number}>
                <article className="flex flex-col rounded-[1.5rem] border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-md">
                  {(() => {
                    const Icon = roadmapIcons[index];
                    return (
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#eef2f7] text-[#2f3a49]">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className={`inline-flex min-h-[32px] items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.04em] shadow-[0_12px_24px_-20px_rgba(15,23,42,0.20)] ${activeRoadmapTheme.labelClass}`}>
                            {step.label}
                          </div>
                        </div>
                        <p className={`mt-3 text-[12px] font-semibold tracking-[0.08em] ${activeRoadmapTheme.accentText}`}>
                          STEP {index + 1}
                        </p>
                      </div>
                    );
                  })()}
                  <h3 className="mt-2 text-[20px] font-semibold leading-[1.4] tracking-[-0.02em] text-slate-900">
                    {step.title.before}
                    {step.title.highlight}
                    {step.title.after}
                  </h3>
                  <p className="mt-1.5 text-sm leading-7 text-slate-600">
                    {step.body.map((part, bodyIndex) =>
                      part.strong ? (
                        <strong key={`${part.text}-${bodyIndex}`} className="font-bold text-slate-800">
                          {part.text}
                        </strong>
                      ) : (
                        <span key={`${part.text}-${bodyIndex}`}>{part.text}</span>
                      ),
                    )}
                  </p>
                </article>

                {index < activeRoadmap.steps.length - 1 ? (
                  <div className="flex items-center justify-center py-1">
                    <div className="flex flex-col items-center gap-1 text-slate-400">
                      <div className="h-6 w-px bg-slate-300" />
                      <ArrowDown className="h-4 w-4" />
                      <div className="h-6 w-px bg-slate-300" />
                    </div>
                  </div>
                ) : null}
              </Fragment>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="mt-8 flex justify-center" variant="up" delayMs={280}>
          <div className="inline-flex flex-col items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-5 py-3 text-center shadow-[0_18px_42px_-34px_rgba(15,23,42,0.18)] backdrop-blur-sm sm:flex-row sm:gap-3">
            <span className="rounded-full bg-[#2f3a49] px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-white">
              Solutions
            </span>
            <span className="text-[14px] font-semibold tracking-[-0.01em] text-slate-800">
              社内業務の効率化と、自社サービスのAI化。目的に合わせて2つのソリューションを選べます。
            </span>
            <ArrowDown className="h-4 w-4 text-slate-400 sm:hidden" />
            <ArrowRight className="hidden h-4 w-4 text-slate-400 sm:block" />
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="mt-8 grid gap-4 lg:grid-cols-2" variant="up" delayMs={320}>
          {roadmap.links.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className="relative overflow-hidden rounded-[1.4rem] border border-slate-200/70 shadow-[0_18px_44px_-42px_rgba(15,23,42,0.22)] transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative min-h-[260px]">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                <div
                  className={`absolute inset-0 ${
                    index === 0
                      ? "bg-[linear-gradient(180deg,rgba(15,42,95,0.08)_0%,rgba(23,78,166,0.35)_42%,rgba(15,42,95,0.78)_100%)]"
                      : "bg-[linear-gradient(180deg,rgba(245,158,11,0.12)_0%,rgba(217,119,6,0.36)_42%,rgba(92,48,12,0.78)_100%)]"
                  }`}
                />
                <div
                  className={`absolute inset-0 mix-blend-color ${
                    index === 0 ? "bg-[#174EA6]/30" : "bg-[#D97706]/32"
                  }`}
                />

                <div className="relative flex min-h-[260px] flex-col justify-end px-5 py-5">
                  <p className="text-[18px] font-semibold leading-[1.4] tracking-[-0.02em] text-white sm:text-[20px]">
                    {item.title}
                  </p>
                  <p className="mt-2 max-w-[390px] text-[13px] leading-6 text-white/82">{item.body}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-white/80">
                    {item.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
