import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Blocks, ShieldCheck, Users, Zap } from "lucide-react";
import { FloatingConversionCta } from "@/components/layout/floating-conversion-cta";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  MarketingIconFrame,
  MarketingPill,
  MarketingSectionIntro,
  MarketingSurface,
} from "@/components/sections/marketing-section-primitives";
import { TopPageHeroSection } from "@/components/sections/top-page-hero-section";
import {
  SolutionChoiceAction,
  SolutionChoiceBadge,
  SolutionChoiceCard,
  SolutionChoiceDescription,
  SolutionChoiceHeader,
  SolutionChoiceSubtitle,
  SolutionChoiceTitle,
} from "@/components/sections/top-page-solution-choice-card";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { TopPageRoadmapSection } from "@/components/sections/top-page-roadmap-section";
import {
  topPageCoreValue,
  topPageFinalCta,
  topPageFloatingCtaUrl,
  topPageHero,
  topPageMetadata,
  topPagePlatformRequirements,
  topPageRoadmap,
  topPageSecurity,
  topPageSolutionBranch,
  topPageWhitepapers,
} from "@/content/top-page";

export const metadata: Metadata = {
  title: topPageMetadata.title,
  description: topPageMetadata.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: topPageMetadata.title,
    description: topPageMetadata.description,
    type: "website",
  },
  twitter: {
    title: topPageMetadata.title,
    description: topPageMetadata.description,
    card: "summary_large_image",
  },
};

const coreValueIcons = [ShieldCheck, Zap, Users] as const;

export default function HomePage() {
  const hero = topPageHero;
  const solutionBranch = topPageSolutionBranch;
  const coreValue = topPageCoreValue;
  const platformRequirements = topPagePlatformRequirements;
  const security = topPageSecurity;
  const whitepapers = topPageWhitepapers;
  const finalCta = topPageFinalCta;
  const [heroTitleFirstRaw, ...heroTitleRestParts] = hero.title.split("、");
  const heroTitleFirst = heroTitleRestParts.length > 0 ? `${heroTitleFirstRaw}、` : hero.title;
  const heroTitleRest = heroTitleRestParts.join("、");

  return (
    <main className="relative overflow-x-hidden bg-white pt-[72px] text-slate-950">
      <SiteHeader />
      <FloatingConversionCta href={topPageFloatingCtaUrl} />

      <div className="bg-white text-[#17191d]">
        <TopPageHeroSection hero={hero} heroTitleFirst={heroTitleFirst} heroTitleRest={heroTitleRest} />

        <section className="mx-auto max-w-[1920px] bg-[#f6f8fb] px-6 py-16 lg:px-10 lg:py-20">
          <div className="mx-auto w-full max-w-[1120px]">
            <div className="mx-auto max-w-[900px] text-center">
              <RevealOnScroll variant="up">
                <MarketingSectionIntro
                  className="max-w-[900px]"
                  titleClassName="mx-auto max-w-[730px] text-balance text-[31px] leading-[1.22] tracking-[-0.045em] sm:text-[40px] lg:text-[43px]"
                  bodyClassName="mt-6 max-w-[790px] space-y-4 text-left leading-[1.9]"
                  title={
                    <>
                      {solutionBranch.title.line1}
                      <span className="heading-highlight-accent">{solutionBranch.title.highlight}</span>
                      {solutionBranch.title.after}
                    </>
                  }
                  body={
                    <>
                      <p>{solutionBranch.lead.line1}</p>
                      <p>
                        {solutionBranch.lead.line2.map((part, index) =>
                          part.strong ? (
                            <strong
                              key={`${part.text}-${index}`}
                              className={`font-bold ${index === 1 ? "text-[#174EA6]" : "text-[#B85733]"}`}
                            >
                              {part.text}
                            </strong>
                          ) : (
                            <span key={`${part.text}-${index}`}>{part.text}</span>
                          ),
                        )}
                      </p>
                    </>
                  }
                />
              </RevealOnScroll>
            </div>

            <RevealOnScroll className="mt-10 grid items-stretch gap-5 lg:grid-cols-2" variant="up" delayMs={220}>
              <SolutionChoiceCard href="/solutions/ai-crew" tone="crew">
                <SolutionChoiceHeader icon={Users}>
                  <SolutionChoiceBadge>AI Crew</SolutionChoiceBadge>
                </SolutionChoiceHeader>
                <div className="mt-5">
                  <SolutionChoiceTitle>AIで社内業務を大幅に効率化したい</SolutionChoiceTitle>
                  <SolutionChoiceSubtitle>専用AIエージェントの設計・実運用支援</SolutionChoiceSubtitle>
                </div>
                <SolutionChoiceDescription>
                  業務に合わせた専用AIエージェントを設計し、導入から運用、改善までを伴走支援します。テスト導入で終わらず、現場で使われるAI活用へつなげます。
                </SolutionChoiceDescription>
                <SolutionChoiceAction>社内業務効率化の進め方を見る</SolutionChoiceAction>
              </SolutionChoiceCard>

              <SolutionChoiceCard href="/solutions/ai-dashi" tone="dashi">
                <SolutionChoiceHeader icon={Blocks}>
                  <SolutionChoiceBadge>AI Dashi</SolutionChoiceBadge>
                </SolutionChoiceHeader>
                <div className="mt-5">
                  <SolutionChoiceTitle>SaaSやWebサービスのAI化を進めたい</SolutionChoiceTitle>
                  <SolutionChoiceSubtitle>組み込み型AI基盤・ホワイトラベル対応</SolutionChoiceSubtitle>
                </div>
                <SolutionChoiceDescription>
                  自社SaaSやWebサービスに組み込める、エンタープライズ向けAI基盤です。安全性、拡張性、運用性を備えたAI機能を、自社ブランドで既存のサービスに展開できます。
                </SolutionChoiceDescription>
                <SolutionChoiceAction>自社サービスAI化の進め方を見る</SolutionChoiceAction>
              </SolutionChoiceCard>
            </RevealOnScroll>
          </div>
        </section>

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

        <TopPageRoadmapSection roadmap={topPageRoadmap} />

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

      <SiteFooter />
    </main>
  );
}

