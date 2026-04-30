"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Blocks,
  Compass,
  Settings2,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  topPageCoreValue,
  topPageFinalCta,
  topPageHero,
  topPagePlatformRequirements,
  topPageRoadmap,
  topPageSecurity,
  topPageSolutionBranch,
  topPageWhitepapers,
} from "@/content/top-page";
import {
  MarketingIconFrame,
  MarketingPill,
  MarketingSectionIntro,
  MarketingSurface,
} from "@/components/sections/marketing-section-primitives";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import {
  TopPageSolutionChoiceContent,
  TopPageSolutionChoiceGroup,
  TopPageSolutionChoiceHeading,
  TopPageSolutionOverviewIntro,
  TopPageSolutionOverviewLead,
  TopPageSolutionOverviewSection,
} from "@/components/sections/top-page-solution-overview-section";
import {
  SolutionChoiceAction,
  SolutionChoiceBadge,
  SolutionChoiceCard,
  SolutionChoiceDescription,
  SolutionChoiceHeader,
  SolutionChoiceSubtitle,
  SolutionChoiceTitle,
} from "@/components/sections/top-page-solution-choice-card";

const coreValueIcons = [ShieldCheck, Zap, Users] as const;
const roadmapIcons = [Compass, Settings2, Building2] as const;
const solutionBranchIcons = [Users, Blocks] as const;

export function TopPageSections() {
  const hero = topPageHero;
  const coreValue = topPageCoreValue;
  const roadmap = topPageRoadmap;
  const platformRequirements = topPagePlatformRequirements;
  const security = topPageSecurity;
  const whitepapers = topPageWhitepapers;
  const finalCta = topPageFinalCta;
  const router = useRouter();
  const [activeRoadmapTab, setActiveRoadmapTab] = useState<"crew" | "dashi">((roadmap.tabs[0]?.key as "crew" | "dashi") ?? "crew");
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
  const [heroTitleFirstRaw, ...heroTitleRestParts] = hero.title.split("、");
  const heroTitleFirst = heroTitleRestParts.length > 0 ? `${heroTitleFirstRaw}、` : hero.title;
  const heroTitleRest = heroTitleRestParts.join("、");

  return (
    <div className="bg-white text-[#17191d]">
        <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            priority
            className="object-cover object-[58%_center]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.88)_0%,rgba(2,6,23,0.72)_34%,rgba(2,6,23,0.36)_60%,rgba(2,6,23,0.18)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.22),transparent_24%),radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.14),transparent_18%),linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(15,23,42,0.16)_62%,rgba(15,23,42,0.56)_100%)]" />

          <div className="relative mx-auto flex min-h-[760px] w-full max-w-[1260px] flex-col justify-between px-[30px] py-10 lg:py-12">
            <div className="flex justify-start">
              <div className="hidden flex-wrap items-center gap-1.5 lg:flex">
                {hero.proofPills.map((item) => (
                  <MarketingPill
                    key={item}
                    className="border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white/88 backdrop-blur"
                  >
                    {item}
                  </MarketingPill>
                ))}
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,668px)_1fr] lg:items-start">
              <div className="-mt-3 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.05)_100%)] p-7 text-white shadow-[0_32px_120px_-60px_rgba(15,23,42,0.75)] backdrop-blur-xl sm:p-8 lg:-mt-14 lg:p-10">
                <p className="hero-copy-enter text-[11px] font-semibold uppercase tracking-[0.18em] text-white/58">
                  {hero.tagline}
                </p>
                <h1 className="mt-2 text-[42px] font-semibold leading-[1.07] tracking-[-0.065em] sm:max-w-[14ch] sm:text-[58px] lg:max-w-[15ch] lg:text-[72px]">
                  <span className="hero-title-fragment block">{heroTitleFirst}</span>
                  {heroTitleRest ? (
                    <span className="hero-title-fragment hero-title-fragment-delay block">{heroTitleRest}</span>
                  ) : null}
                </h1>
                <p className="hero-copy-enter hero-copy-enter-1 mt-4 text-[18px] font-semibold leading-[1.5] tracking-[0.12em] text-transparent drop-shadow-[0_10px_30px_rgba(15,23,42,0.32)] bg-gradient-to-r from-[#dce6ff] via-[#bfd0ff] to-[#9fb6ff] bg-clip-text sm:text-[22px] sm:tracking-[0.14em] lg:text-[24px]">
                  {hero.subcopy}
                </p>
                <p className="hero-copy-enter hero-copy-enter-2 mt-5 max-w-[628px] text-[15px] leading-[2.05] text-white/84 lg:text-base">
                  {hero.body}
                </p>

                <div className="hero-copy-enter hero-copy-enter-3 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href={hero.primaryCta.href}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                  >
                    {hero.primaryCta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={hero.secondaryCta.href}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/16"
                  >
                    {hero.secondaryCta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="relative hidden min-h-[520px] lg:block">
                <div className="absolute inset-0" />
              </div>
            </div>
          </div>
        </section>

        <TopPageSolutionOverviewSection>
          <TopPageSolutionOverviewIntro
            title={
              <>
                AI活用は、単なる業務効率化にとどまらない
                <span className="heading-highlight-accent">経営課題</span>
                への対策
              </>
            }
          >
            <TopPageSolutionOverviewLead>
              AI活用の真の目的は、日々の作業を減らすことではなく、企業全体の生産性と利益率を向上させることにあります。
            </TopPageSolutionOverviewLead>
            <TopPageSolutionOverviewLead>
              QueryPie AIは、<strong className="font-bold text-[#174EA6]">社内業務の劇的な効率化がもたらすコスト削減</strong>と、
              <strong className="font-bold text-[#B85733]">自社サービスの価値向上を通じた売上拡大</strong>
              という2つのアプローチで、貴社の経営課題の解決を支援します。
            </TopPageSolutionOverviewLead>
          </TopPageSolutionOverviewIntro>

          <TopPageSolutionChoiceGroup>
            <SolutionChoiceCard href="/solutions/ai-crew" tone="crew">
              <SolutionChoiceHeader icon={Users}>
                <SolutionChoiceBadge>AI Crew</SolutionChoiceBadge>
              </SolutionChoiceHeader>
              <TopPageSolutionChoiceContent>
                <TopPageSolutionChoiceHeading>
                  <SolutionChoiceTitle>AIで社内業務を大幅に効率化したい</SolutionChoiceTitle>
                  <SolutionChoiceSubtitle>専用AIエージェントの設計・実運用支援</SolutionChoiceSubtitle>
                </TopPageSolutionChoiceHeading>
                <SolutionChoiceDescription>
                  業務に合わせた専用AIエージェントを設計し、導入から運用、改善までを伴走支援します。テスト導入で終わらず、現場で使われるAI活用へつなげます。
                </SolutionChoiceDescription>
                <SolutionChoiceAction>社内業務効率化の進め方を見る</SolutionChoiceAction>
              </TopPageSolutionChoiceContent>
            </SolutionChoiceCard>

            <SolutionChoiceCard href="/solutions/ai-dashi" tone="dashi">
              <SolutionChoiceHeader icon={Blocks}>
                <SolutionChoiceBadge>AI Dashi</SolutionChoiceBadge>
              </SolutionChoiceHeader>
              <TopPageSolutionChoiceContent>
                <TopPageSolutionChoiceHeading>
                  <SolutionChoiceTitle>SaaSやWebサービスのAI化を進めたい</SolutionChoiceTitle>
                  <SolutionChoiceSubtitle>組み込み型AI基盤・ホワイトラベル対応</SolutionChoiceSubtitle>
                </TopPageSolutionChoiceHeading>
                <SolutionChoiceDescription>
                  自社SaaSやWebサービスに組み込める、エンタープライズ向けAI基盤です。安全性、拡張性、運用性を備えたAI機能を、自社ブランドで既存のサービスに展開できます。
                </SolutionChoiceDescription>
                <SolutionChoiceAction>自社サービスAI化の進め方を見る</SolutionChoiceAction>
              </TopPageSolutionChoiceContent>
            </SolutionChoiceCard>
          </TopPageSolutionChoiceGroup>
        </TopPageSolutionOverviewSection>

        <section id="about" className="mx-auto max-w-[1920px] px-6 py-16 lg:px-10 lg:py-20">
          <div className="mx-auto w-full max-w-[1120px]">
            <div className="mx-auto max-w-[900px] text-center">
              <RevealOnScroll variant="up">
                <MarketingSectionIntro
                  title={
                    <>
                      {coreValue.title.before}
                      <span className="heading-highlight-accent">{coreValue.title.highlight}</span>
                      {coreValue.title.after}
                    </>
                  }
                  body={<p>{coreValue.body}</p>}
                  bodyClassName="max-w-[760px] text-center leading-7"
                />
              </RevealOnScroll>
            </div>

            <RevealOnScroll className="mt-10 grid items-stretch gap-4 lg:grid-cols-3" variant="up" delayMs={220}>
              {coreValue.cards.map((card, index) => {
                const Icon = coreValueIcons[index];

                return (
                  <MarketingSurface
                    as="article"
                    key={card.title}
                    className="flex h-full flex-col rounded-[1.8rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.95)_100%)] px-5 py-6 shadow-[0_20px_54px_-44px_rgba(15,23,42,0.18)] sm:px-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <MarketingPill className="bg-[#2f3a49] px-3 py-1 tracking-[0.08em] text-white shadow-[0_12px_24px_-18px_rgba(15,23,42,0.42)]">
                        {card.number} {card.title}
                      </MarketingPill>
                      <MarketingIconFrame className="bg-[#eef2f7] text-[#2f3a49]">
                        <Icon className="h-5 w-5" />
                      </MarketingIconFrame>
                    </div>

                    <div className="mt-5">
                      <h3 className="mt-2 text-[24px] font-semibold tracking-[0.02em] text-slate-950">
                        {card.subtitle}
                      </h3>
                    </div>

                    <ul className="mt-4 flex-1 space-y-2.5 text-[15px] leading-7 text-slate-600">
                      {card.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2">
                          <span className="mt-[0.55rem] h-1.5 w-1.5 flex-none rounded-full bg-[#2f3a49]/75" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </MarketingSurface>
                );
              })}
            </RevealOnScroll>
          </div>
        </section>

        <section className="mx-auto max-w-[1920px] bg-[#f7f9fc] px-6 py-16 lg:px-10 lg:py-20">
          <div className="mx-auto w-full max-w-[1120px]">
            <div className="mx-auto max-w-[860px] text-center">
              <RevealOnScroll variant="up">
                <h2 className="text-[30px] font-semibold leading-[1.2] tracking-[-0.04em] text-slate-950 sm:text-[42px]">
                  {roadmap.title.line1}
                  <br />
                  {roadmap.title.before}
                  <span className="heading-highlight-accent">
                    {roadmap.title.highlight}
                  </span>
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
                    <MarketingSurface
                      as="article"
                      className="flex h-full flex-col rounded-[1.5rem] bg-white p-6"
                    >
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
                        {step.title.before}{step.title.highlight}{step.title.after}
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
                    </MarketingSurface>

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
                    <MarketingSurface
                      as="article"
                      className="flex flex-col rounded-[1.5rem] bg-white p-6"
                    >
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
                        {step.title.before}{step.title.highlight}{step.title.after}
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
                    </MarketingSurface>

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
                <article
                  key={item.title}
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(item.href)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      router.push(item.href);
                    }
                  }}
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
                      <Link
                        href={item.href}
                        onClick={(event) => event.stopPropagation()}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-white/80"
                      >
                        {item.ctaLabel}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </RevealOnScroll>
          </div>
        </section>

        <section className="mx-auto max-w-[1920px] bg-white px-6 py-16 lg:px-10 lg:py-20">
          <div className="mx-auto w-full max-w-[1120px]">
            <div className="mx-auto max-w-[1280px] text-center">
              <RevealOnScroll variant="up">
                <MarketingSectionIntro
                  className="max-w-[1280px]"
                  titleClassName="mx-auto max-w-[38ch] text-balance"
                  bodyClassName="max-w-[758px] text-left leading-[1.85]"
                  title={
                    <>
                      {platformRequirements.title.before}
                      <span className="heading-highlight-accent">{platformRequirements.title.highlight}</span>
                      {platformRequirements.title.after}
                    </>
                  }
                  body={<p>{platformRequirements.body}</p>}
                />
              </RevealOnScroll>
            </div>

            <RevealOnScroll className="mt-12 space-y-5" variant="up" delayMs={220}>
              {platformRequirements.blocks.map((block) => {
                const isReversed = block.align === "right";

                return (
                  <MarketingSurface
                    as="article"
                    key={block.title}
                    className="overflow-hidden rounded-[1.6rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.95)_100%)] shadow-[0_20px_54px_-44px_rgba(15,23,42,0.16)]"
                  >
                    <div className={`flex flex-col lg:flex-row ${isReversed ? "lg:flex-row-reverse" : ""}`}>
                      <div className="p-6 lg:basis-2/3 lg:p-7">
                        <MarketingPill className="bg-[#eef2f7] px-3 py-1 tracking-[0.08em] text-[#2f3a49]">
                          {block.label}
                        </MarketingPill>
                        <h3 className="mt-4 text-[26px] font-semibold leading-[1.28] tracking-[-0.04em] text-slate-950">
                          {block.title}
                        </h3>
                        <p className="mt-4 text-[15px] leading-7 text-slate-600">{block.body}</p>
                      </div>

                      <div className="relative min-h-[220px] lg:min-h-0 lg:basis-1/3">
                        <div className="relative h-full w-full">
                          <Image
                            src={block.image.src}
                            alt={block.image.alt}
                            fill
                            className="object-cover"
                            sizes="(min-width: 1024px) 33vw, 100vw"
                          />
                        </div>
                      </div>
                    </div>
                  </MarketingSurface>
                );
              })}
            </RevealOnScroll>

            <RevealOnScroll className="mx-auto mt-10 max-w-[960px] overflow-hidden rounded-[1.8rem] border border-slate-200/80 bg-slate-950 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.28)]" variant="up" delayMs={320}>
              <div className="relative aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src={platformRequirements.videoUrl}
                  title="QueryPie AI overview video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section id="security" className="mx-auto max-w-[1920px] bg-[#f7f9fc] px-6 py-16 lg:px-10 lg:py-20">
          <div className="mx-auto w-full max-w-[1120px]">
            <div className="mx-auto max-w-[900px] text-center">
              <RevealOnScroll variant="up">
                <MarketingSectionIntro
                  eyebrow="Security & Compliance"
                  titleClassName="mt-2 text-[26px] leading-[1.24] tracking-[-0.03em] sm:text-[32px]"
                  bodyClassName="mt-4 max-w-[840px] text-left leading-7"
                  title={security.title}
                  body={<p>{security.body}</p>}
                />
              </RevealOnScroll>
            </div>

            <RevealOnScroll className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4" variant="up" delayMs={220}>
              {security.certifications.map((item) => (
                <MarketingSurface
                  as="article"
                  key={item.title}
                  className="flex min-h-[150px] flex-col items-center justify-center rounded-[1.5rem] bg-white px-5 py-5 text-center shadow-[0_18px_44px_-42px_rgba(15,23,42,0.14)]"
                >
                  <div className="relative flex h-14 w-full items-center justify-center">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      unoptimized
                      className="object-contain"
                      sizes="(min-width: 1280px) 15vw, (min-width: 768px) 25vw, 50vw"
                    />
                  </div>
                  <p className="mt-4 text-[13px] font-semibold tracking-[0.01em] text-[#2f3a49]">{item.title}</p>
                </MarketingSurface>
              ))}
            </RevealOnScroll>

            <RevealOnScroll className="mt-8 flex justify-center" variant="up" delayMs={320}>
              <Link
                href={security.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#15181d] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_-26px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:bg-[#0f1216] hover:shadow-md"
              >
                {security.link.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </RevealOnScroll>
          </div>
        </section>

        <section className="mx-auto max-w-[1920px] bg-white px-6 py-16 lg:px-10 lg:py-20">
          <div className="mx-auto w-full max-w-[1120px]">
            <MarketingSurface className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(255,255,255,0.98)_100%)] px-6 py-8 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.14)] lg:px-8 lg:py-10">
              <div className="mx-auto max-w-[900px] text-center">
                <RevealOnScroll variant="up">
                  <MarketingSectionIntro
                    eyebrow="Download"
                    titleClassName="mt-2 text-[24px] leading-[1.3] tracking-[-0.03em] sm:text-[30px]"
                    bodyClassName="mt-4 max-w-[820px] text-left leading-7"
                    title={whitepapers.title}
                    body={<p>{whitepapers.body}</p>}
                  />
                </RevealOnScroll>
              </div>

              <RevealOnScroll className="mt-8 grid gap-5 lg:grid-cols-2" variant="up" delayMs={220}>
                {whitepapers.items.map((item) => (
                  <MarketingSurface
                    as="article"
                    key={item.title}
                    className="overflow-hidden rounded-[1.8rem] bg-white shadow-[0_20px_54px_-44px_rgba(15,23,42,0.16)]"
                  >
                    <div className="flex flex-col">
                      <div className="relative min-h-[320px] bg-[#f5f7fb]">
                        <Image
                          src={item.image.src}
                          alt={item.image.alt}
                          fill
                          unoptimized
                          className="object-contain p-4"
                          sizes="(min-width: 1024px) 50vw, 100vw"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-[21px] font-medium leading-[1.4] tracking-[-0.02em] text-slate-950">
                          {item.title}
                        </h3>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <MarketingPill
                              key={tag}
                              className="bg-[#eef2f7] px-3 py-1 tracking-[0.04em] text-[#2f3a49]"
                            >
                              {tag}
                            </MarketingPill>
                          ))}
                        </div>
                        {item.description ? (
                          <p className="mt-4 text-[14px] leading-7 text-slate-600">{item.description}</p>
                        ) : null}
                        {item.toc ? (
                          <details className="mt-4 rounded-[1rem] border border-slate-200 bg-slate-50/70 px-4 py-3">
                            <summary className="cursor-pointer list-none text-sm font-semibold text-[#2f3a49] [&::-webkit-details-marker]:hidden">
                              目次を見る
                            </summary>
                            <ul className="mt-3 space-y-2 text-[13px] leading-6 text-slate-600">
                              {item.toc.map((tocItem) => (
                                <li key={tocItem} className="flex gap-2">
                                  <span className="mt-[0.45rem] h-1.5 w-1.5 flex-none rounded-full bg-[#2f3a49]/70" />
                                  <span>{tocItem}</span>
                                </li>
                              ))}
                            </ul>
                          </details>
                        ) : null}
                        <Link
                          href={item.href}
                          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-[#2f3a49]"
                        >
                          {item.ctaLabel}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </MarketingSurface>
                ))}
              </RevealOnScroll>
            </MarketingSurface>
          </div>
        </section>

        <section id="contact" className="bg-[#0f172a] text-white">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
            <div className="rounded-[2rem] border border-white/12 bg-white/5 px-6 py-8 shadow-[0_28px_100px_-60px_rgba(15,23,42,0.55)] backdrop-blur xl:px-10 xl:py-10">
              <div className="mx-auto max-w-[880px] text-center">
                <RevealOnScroll variant="up">
                  <h2 className="text-[34px] font-semibold leading-[1.15] tracking-[-0.04em] sm:text-[46px]">
                    {finalCta.title}
                  </h2>
                </RevealOnScroll>
                <RevealOnScroll variant="up" delayMs={120}>
                  <div className="mx-auto mt-5 max-w-[760px] text-sm leading-8 text-white/75 sm:text-[15px]">
                    <p>{finalCta.body.line1}</p>
                    <p>{finalCta.body.line2}</p>
                  </div>
                </RevealOnScroll>
              </div>

              <RevealOnScroll variant="up" delayMs={220}>
                <div id="download" className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:flex-wrap">
                  {finalCta.actions.map((action, index) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={`flex min-h-[44px] w-full max-w-[220px] items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-center text-[13px] font-semibold transition sm:w-[220px] ${
                        index === 0
                          ? "border-white bg-white text-slate-950 hover:bg-slate-100"
                          : "border-white/15 bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      {action.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

    </div>
  );
}
