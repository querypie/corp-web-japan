"use client";

import type { ReactElement, ReactNode } from "react";
import { Children, Fragment, isValidElement, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Building2, Compass, Settings2 } from "lucide-react";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { componentNameDebugProps } from "@/lib/component-name-debug";

type RoadmapTone = "crew" | "dashi";

type RoadmapTabProps = {
  tabKey: RoadmapTone;
  label: string;
  children: ReactNode;
};

type RoadmapStepProps = {
  label: string;
  title: ReactNode;
  children: ReactNode;
};

const roadmapIcons = [Compass, Settings2, Building2] as const;

function toneTheme(tone: RoadmapTone) {
  return tone === "crew"
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
}

function isRoadmapTabElement(node: ReactNode): node is ReactElement<RoadmapTabProps> {
  return (
    isValidElement(node) &&
    typeof node.props === "object" &&
    node.props !== null &&
    (node.props as { tabKey?: unknown }).tabKey !== undefined &&
    typeof (node.props as { label?: unknown }).label === "string"
  );
}

function isRoadmapStepElement(node: ReactNode): node is ReactElement<RoadmapStepProps> {
  return (
    isValidElement(node) &&
    typeof node.props === "object" &&
    node.props !== null &&
    typeof (node.props as { label?: unknown }).label === "string" &&
    (node.props as { title?: unknown }).title !== undefined
  );
}

export function RoadmapSection({ children }: { children: ReactNode }) {
  return (
    <section {...componentNameDebugProps("RoadmapSection")} className="mx-auto max-w-[1920px] bg-[#f7f9fc] px-6 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-[1120px]">{children}</div>
    </section>
  );
}

export function RoadmapIntro({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("RoadmapIntro")} className="mx-auto max-w-[860px] text-center">{children}</div>;
}

export function RoadmapTitle({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll {...componentNameDebugProps("RoadmapTitle")} variant="up">
      <h2 className="text-[30px] font-semibold leading-[1.2] tracking-[-0.04em] text-slate-950 sm:text-[42px]">{children}</h2>
    </RevealOnScroll>
  );
}

export function RoadmapBody({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll {...componentNameDebugProps("RoadmapBody")} variant="up" delayMs={120}>
      <p className="ml-auto mr-auto mt-5 max-w-[860px] pl-3 text-left text-[15px] leading-7 text-slate-600 lg:pl-5 lg:text-balance">{children}</p>
    </RevealOnScroll>
  );
}

export function RoadmapTabs({ children }: { children: ReactNode }) {
  const tabs = useMemo(() => Children.toArray(children).filter(isRoadmapTabElement), [children]);
  const [activeTab, setActiveTab] = useState<RoadmapTone>(tabs[0]?.props.tabKey ?? "crew");
  const activePanel = tabs.find((tab) => tab.props.tabKey === activeTab) ?? tabs[0];
  const theme = toneTheme(activeTab);
  const steps = Children.toArray(activePanel?.props.children).filter(isRoadmapStepElement);

  return (
    <RevealOnScroll {...componentNameDebugProps("RoadmapTabs")} className="mt-10" variant="up" delayMs={220}>
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {tabs.map((tab) => {
          const active = tab.props.tabKey === activeTab;
          const tabTheme = toneTheme(tab.props.tabKey);
          return (
            <button
              key={tab.props.tabKey}
              type="button"
              onClick={() => setActiveTab(tab.props.tabKey)}
              className={`inline-flex min-h-[40px] items-center rounded-full border px-4 py-2 text-[13px] font-semibold transition ${active ? tabTheme.activeTab : tabTheme.inactiveTab}`}
            >
              {tab.props.label}
            </button>
          );
        })}
      </div>

      <div className="hidden items-stretch gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
        {steps.map((step, index) => (
          <Fragment key={`${activeTab}-${index}`}>
            <RoadmapStepCard step={step.props} index={index} theme={theme} mobile={false} />
            {index < steps.length - 1 ? (
              <div className="hidden lg:flex lg:justify-center">
                <ArrowRight className="h-8 w-8 text-slate-300" />
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>

      <div className="space-y-3 lg:hidden">
        {steps.map((step, index) => (
          <Fragment key={`${activeTab}-mobile-${index}`}>
            <RoadmapStepCard step={step.props} index={index} theme={theme} mobile />
            {index < steps.length - 1 ? (
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
  );
}

function RoadmapStepCard({
  step,
  index,
  theme,
  mobile,
}: {
  step: RoadmapStepProps;
  index: number;
  theme: ReturnType<typeof toneTheme>;
  mobile: boolean;
}) {
  const Icon = roadmapIcons[index];
  return (
    <article className={`flex ${mobile ? "" : "h-full "+""} flex-col rounded-[1.5rem] border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-md`}>
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#eef2f7] text-[#2f3a49]">
            <Icon className="h-5 w-5" />
          </div>
          <div className={`inline-flex min-h-[32px] items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.04em] shadow-[0_12px_24px_-20px_rgba(15,23,42,0.20)] ${theme.labelClass}`}>
            {step.label}
          </div>
        </div>
        <p className={`mt-3 text-[12px] font-semibold tracking-[0.08em] ${theme.accentText}`}>STEP {index + 1}</p>
      </div>
      <h3 className={`${mobile ? "" : "min-h-[72px] "+""} mt-2 text-[20px] font-semibold leading-[1.4] tracking-[-0.02em] text-slate-900`}>{step.title}</h3>
      <div className={`${mobile ? "" : "flex-1 "+""} mt-1.5 text-sm leading-7 text-slate-600`}>{step.children}</div>
    </article>
  );
}

export function RoadmapTab(props: RoadmapTabProps) {
  void props;
  return null;
}

export function RoadmapStep(props: RoadmapStepProps) {
  void props;
  return null;
}

export function RoadmapCallout({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll {...componentNameDebugProps("RoadmapCallout")} className="mt-8 flex justify-center" variant="up" delayMs={280}>
      <div className="inline-flex flex-col items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-5 py-3 text-center shadow-[0_18px_42px_-34px_rgba(15,23,42,0.18)] backdrop-blur-sm sm:flex-row sm:gap-3">{children}</div>
    </RevealOnScroll>
  );
}

export function RoadmapCalloutBadge({ children }: { children: ReactNode }) {
  return <span {...componentNameDebugProps("RoadmapCalloutBadge")} className="rounded-full bg-[#2f3a49] px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-white">{children}</span>;
}

export function RoadmapCalloutBody({ children }: { children: ReactNode }) {
  return <span {...componentNameDebugProps("RoadmapCalloutBody")} className="text-[14px] font-semibold tracking-[-0.01em] text-slate-800">{children}</span>;
}

export function RoadmapLinkGrid({ children }: { children: ReactNode }) {
  return <RevealOnScroll {...componentNameDebugProps("RoadmapLinkGrid")} className="mt-8 grid gap-4 lg:grid-cols-2" variant="up" delayMs={320}>{children}</RevealOnScroll>;
}

export function RoadmapLinkCard({ href, imageSrc, imageAlt, tone, children }: { href: string; imageSrc: string; imageAlt: string; tone: RoadmapTone; children: ReactNode }) {
  return (
    <Link {...componentNameDebugProps("RoadmapLinkCard")} href={href} className="relative overflow-hidden rounded-[1.4rem] border border-slate-200/70 shadow-[0_18px_44px_-42px_rgba(15,23,42,0.22)] transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative min-h-[260px]">
        <Image src={imageSrc} alt={imageAlt} fill unoptimized className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
        <div className={`absolute inset-0 ${tone === "crew" ? "bg-[linear-gradient(180deg,rgba(15,42,95,0.08)_0%,rgba(23,78,166,0.35)_42%,rgba(15,42,95,0.78)_100%)]" : "bg-[linear-gradient(180deg,rgba(245,158,11,0.12)_0%,rgba(217,119,6,0.36)_42%,rgba(92,48,12,0.78)_100%)]"}`} />
        <div className={`absolute inset-0 mix-blend-color ${tone === "crew" ? "bg-[#174EA6]/30" : "bg-[#D97706]/32"}`} />
        <div className="relative flex min-h-[260px] flex-col justify-end px-5 py-5">{children}</div>
      </div>
    </Link>
  );
}

export function RoadmapLinkTitle({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("RoadmapLinkTitle")} className="text-[18px] font-semibold leading-[1.4] tracking-[-0.02em] text-white sm:text-[20px]">{children}</p>;
}

export function RoadmapLinkBody({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("RoadmapLinkBody")} className="mt-2 max-w-[390px] text-[13px] leading-6 text-white/82">{children}</p>;
}

export function RoadmapLinkAction({ children }: { children: ReactNode }) {
  return <span {...componentNameDebugProps("RoadmapLinkAction")} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-white/80">{children}<ArrowRight className="h-4 w-4" /></span>;
}
