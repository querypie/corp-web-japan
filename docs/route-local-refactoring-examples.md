# Real route-local refactoring examples

This document collects concrete code snapshots that can be cited directly when explaining route-local refactoring.

Important rule:

- Every code-file link below is pinned to an exact commit SHA.
- That means later refactors will not change what the reader sees in these before/after references.
- This is the detailed companion to [docs/route-local-refactoring-for-developers.md](./route-local-refactoring-for-developers.md).

Current after snapshot used here:

- `87a7f583fdd2af747a624d83f4f81cc8a993b187`

## Case 1. Top page: route shell + content registry + giant wrapper

This is the most typical illustration of why route-local refactoring matters.

### Core problem

In the old structure, you had to open all three layers to understand the page.

- route shell: [`src/app/page.tsx`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/app/page.tsx)
- page-specific content registry: [`src/content/top-page.ts`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/content/top-page.ts)
- giant wrapper/orchestrator: [`src/components/sections/top-page-sections.tsx`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/components/sections/top-page-sections.tsx)

After the refactor, the main structure became:

- route: [`src/app/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/page.tsx)
- section implementation: [`src/components/sections/home/hero-section.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/home/hero-section.tsx), [`src/components/sections/home/solution-overview-section.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/home/solution-overview-section.tsx), [`src/components/sections/home/solution-choice-card.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/home/solution-choice-card.tsx)

### Before 1: the route is only a shell

File: [`src/app/page.tsx`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/app/page.tsx)

```tsx
import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingConversionCta } from "@/components/layout/floating-conversion-cta";
import { SiteHeader } from "@/components/layout/site-header";
import { TopPageSections } from "@/components/sections/top-page-sections";
import { topPageContent } from "@/content/top-page";

export const metadata: Metadata = {
  title: topPageContent.metadata.title,
  description: topPageContent.metadata.description,
  openGraph: {
    title: topPageContent.metadata.title,
    description: topPageContent.metadata.description,
    type: "website",
  },
  twitter: {
    title: topPageContent.metadata.title,
    description: topPageContent.metadata.description,
    card: "summary_large_image",
  },
};

export default function HomePage() {
  return (
    <main className="relative overflow-x-hidden bg-white pt-[72px] text-slate-950">
      <SiteHeader />
      <FloatingConversionCta href="#contact" />
      <TopPageSections />
      <SiteFooter />
    </main>
  );
}
```

A reviewer cannot tell from this file alone:

- what the hero headline says
- what the section order is
- what the CTA intent is
- what real copy the user sees

### Before 2: the content registry hides the page copy inside a large object

File: [`src/content/top-page.ts`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/content/top-page.ts)

```tsx
export const topPageContent = {
  metadata: {
    title: "信頼できるAIが、現場を動かす。｜QueryPie AI",
    description:
      "AIは、単にツールを導入することではなく、変革を設計することです。QueryPieは、安全性と運用性を前提にしたAI活用の立ち上がりを支援します。",
  },
  hero: {
    tagline: "Secure Enterprise AI",
    title: "信頼できるAIが、現場を動かす",
    subcopy: "誰もが安全かつ迅速に業務で使えるAI",
    body:
      "QueryPie AIは、強固なセキュリティとガバナンスを前提としたエンタープライズAI基盤を提供します。経営層が求める「信頼」と、現場が求める「使いやすさ」を両立し、AI活用をスモールスタートから実運用・定着まで前に進めます。",
    image: {
      src: "/top-hero.png",
      alt: "QueryPie AIの導入イメージを想起させる、オフィスでAIダッシュボードを活用するチーム",
    },
    proofPills: [
      "国際基準のセキュリティ",
      "テスト導入から全社展開へ",
      "組織・役割に応じた権限管理",
    ],
    primaryCta: { label: "お問い合わせ", href: "#contact" },
    secondaryCta: { label: "資料をダウンロード", href: "#download" },
  },
  solutionBranch: {
    title: {
      line1: "AI活用は、単なる業務効率化にとどまらない",
      highlight: "経営課題",
      after: "への対策",
    },
    lead: {
      line1:
        "AI活用の真の目的は、日々の作業を減らすことではなく、企業全体の生産性と利益率を向上させることにあります。",
```

This kind of file can look tidy as data, but it is a poor primary authoring surface for a marketing page.
The more copy is moved into JSON-like objects, the harder it becomes to read paragraph flow, emphasis, and section narrative.

### Before 3: the giant wrapper owns both UI and page narrative

File: [`src/components/sections/top-page-sections.tsx`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/components/sections/top-page-sections.tsx)

```tsx
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
import { topPageContent } from "@/content/top-page";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

const coreValueIcons = [ShieldCheck, Zap, Users] as const;
const roadmapIcons = [Compass, Settings2, Building2] as const;
const solutionBranchIcons = [Users, Blocks] as const;

export function TopPageSections() {
  const {
    hero,
    solutionBranch,
    coreValue,
    roadmap,
    platformRequirements,
    security,
    whitepapers,
    finalCta,
  } = topPageContent;
  const router = useRouter();
  const [activeRoadmapTab, setActiveRoadmapTab] = useState<"crew" | "dashi">((roadmap.tabs[0]?.key as "crew" | "dashi") ?? "crew");
  const activeRoadmap = roadmap.tabs.find((tab) => tab.key === activeRoadmapTab) ?? roadmap.tabs[0];
```

This file now carries too many responsibilities:

- assembling the page narrative
- interpreting the content registry
- icon and theme mapping
- tab interaction state
- section rendering
- CTA placement

In practice, the wrapper becomes the real page owner instead of the route.

### After 1: the route shows the real authored sentences

File: [`src/app/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/page.tsx)

```tsx
export default function HomePage() {
  const topPageFloatingCtaUrl = "/contact-us";
  const topPageHeroContactUrl = "/contact-us?inquiry=ai-consulting";
  const topPageDownloadUrl =
    "https://www.querypie.com/ja/features/documentation/aip-introduction-download";
  const topPageFinalDemoUrl = "/contact-us?inquiry=demo-request";
  const topPageFinalConsultUrl = "/contact-us?inquiry=ai-consulting";

  return (
    <main className="relative overflow-x-hidden bg-white pt-[72px] text-slate-950">
      <SiteHeader />
      <FloatingConversionCta href={topPageFloatingCtaUrl} />
      <HeroSection
        imageSrc="/top-hero.png"
        imageAlt="QueryPie AIの導入イメージを想起させる、オフィスでAIダッシュボードを活用するチーム"
      >
        <HeroProofPillGroup>
          <HeroProofPill>国際基準のセキュリティ</HeroProofPill>
          <HeroProofPill>テスト導入から全社展開へ</HeroProofPill>
          <HeroProofPill>組織・役割に応じた権限管理</HeroProofPill>
        </HeroProofPillGroup>

        <HeroPanel>
          <HeroEyebrow>Secure Enterprise AI</HeroEyebrow>
          <HeroTitle>
            <HeroTitleLine>信頼できるAIが、</HeroTitleLine>
            <HeroTitleLine delayed>現場を動かす</HeroTitleLine>
          </HeroTitle>
          <HeroSubcopy>誰もが安全かつ迅速に業務で使えるAI</HeroSubcopy>
          <HeroBody>
            QueryPie AIは、強固なセキュリティとガバナンスを前提としたエンタープライズAI基盤を提供します。経営層が求める「信頼」と、現場が求める「使いやすさ」を両立し、AI活用をスモールスタートから実運用・定着まで前に進めます。
          </HeroBody>
          <HeroActionGroup>
            <HeroPrimaryAction href={topPageHeroContactUrl}>お問い合わせ</HeroPrimaryAction>
            <HeroSecondaryAction href={topPageDownloadUrl}>資料をダウンロード</HeroSecondaryAction>
          </HeroActionGroup>
        </HeroPanel>
      </HeroSection>
```

Now the reviewer can read the core message directly from the route file.

### After 2: the section file focuses on UI implementation details

File: [`src/components/sections/home/hero-section.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/home/hero-section.tsx)

```tsx
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingPill } from "@/components/sections/home/primitives";

export function HeroSection({ imageSrc, imageAlt, children }: { imageSrc: string; imageAlt: string; children: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
      <Image src={imageSrc} alt={imageAlt} fill priority className="object-cover object-[58%_center]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.88)_0%,rgba(2,6,23,0.72)_34%,rgba(2,6,23,0.36)_60%,rgba(2,6,23,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.22),transparent_24%),radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.14),transparent_18%),linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(15,23,42,0.16)_62%,rgba(15,23,42,0.56)_100%)]" />
      <div className="relative mx-auto flex min-h-[760px] w-full max-w-[1260px] flex-col justify-between px-[30px] py-10 lg:py-12">
        {children}
      </div>
    </section>
  );
}

export function HeroProofPill({ children }: { children: ReactNode }) {
  return (
    <MarketingPill className="border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white/88 backdrop-blur">
      {children}
    </MarketingPill>
  );
}

export function HeroPrimaryAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
```

This file is no longer the source of truth for page copy.
It is focused on layout, styling, and reusable UI primitives.

### What gets better in practice

- title/body/CTA edits can be made directly in the route
- you no longer need to open a giant wrapper just to understand section order
- a page-only registry like [`src/content/top-page.ts`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/content/top-page.ts) no longer hides the real narrative
- the section component boundary becomes narrower and easier to review

## Case 2. About Us: even if data sits in the route, giant top-level arrays are still hard to review

This case shows that "copy is in the route" is not the same thing as "the route is a good authoring surface."

### Snapshot references

- before route: [`src/app/t/about-us/page.tsx`](https://github.com/querypie/corp-web-japan/blob/c03333672e4e4ed5d21cb7d004ea9be2df1f3c9d/src/app/t/about-us/page.tsx)
- after route: [`src/app/about-us/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/about-us/page.tsx)
- after section module: [`src/components/sections/about-us/section.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/about-us/section.tsx)
- after shared layout primitives: [`src/components/sections/company/page-primitives.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/company/page-primitives.tsx)

### Before: the route starts with a giant data blob

File: [`src/app/t/about-us/page.tsx`](https://github.com/querypie/corp-web-japan/blob/c03333672e4e4ed5d21cb7d004ea9be2df1f3c9d/src/app/t/about-us/page.tsx)

```tsx
const timeline = [
  {
    year: "2017",
    events: ["設立"],
  },
  {
    year: "2018",
    events: ["カカオインベストメントからの資金調達"],
  },
  {
    year: "2019",
    events: ["TechCrunch SF 2019 に参加", "LG スタートアップコンペティション 2019 で優勝"],
  },
  {
    year: "2020",
    events: ["Y-Combinator からの資金調達"],
  },
  {
    year: "2021",
    events: [
      "QueryPie DAC（データベースアクセスコントローラー）提供開始",
      "優先シードラウンドで 1,775万ドルを調達",
    ],
  },
  {
    year: "2023",
    events: [
      "韓国信用保証基金から 581万ドルの資金を確保",
      "QueryPie SAC（システムアクセスコントローラー）提供開始",
    ],
  },
] as const;

const leaders = [
  {
    name: "Brant Hwang",
    role: "創業者 & 最高経営責任者 (CEO)",
    imageSrc: "/about-us/crew/brant.png",
    imageWidth: 264,
    imageHeight: 264,
```

Problems with this shape:

- the route reads like a data container
- reviewers must decode large arrays before seeing the page composition
- even a small title or ordering change requires the reviewer to mentally map array data back to JSX

### After: the route shows timeline, leaders, and locations directly in JSX

File: [`src/app/about-us/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/about-us/page.tsx)

```tsx
      <AboutUsSection muted className="py-[112.5px]">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-0">
          <RevealOnScroll>
            <AboutUsSectionHeading>私たちの歩み</AboutUsSectionHeading>
            <AboutUsSectionIntro>
              <AboutUsBodyCopy>
                AIが次のフロンティアになったとき、多くの企業が「莫大なコストと複雑な実装」という2つの壁に直面しました。
                <br />
                そこで私たちは、その両方を解決するために進化を続けてきました。
                <br />
                誰もが使えるアクセシビリティを保ちながら、AI変革の専門性を構築しています。
              </AboutUsBodyCopy>
            </AboutUsSectionIntro>
          </RevealOnScroll>

          <AboutUsTimeline>
            <RevealOnScroll>
              <AboutUsTimelineItem year="2017">
                <li>設立</li>
              </AboutUsTimelineItem>
            </RevealOnScroll>
            <RevealOnScroll delayMs={50}>
              <AboutUsTimelineItem year="2018">
                <li>カカオインベストメントからの資金調達</li>
              </AboutUsTimelineItem>
            </RevealOnScroll>
            <RevealOnScroll delayMs={100}>
              <AboutUsTimelineItem year="2019">
                <li>TechCrunch SF 2019 に参加</li>
                <li>LG スタートアップコンペティション 2019 で優勝</li>
              </AboutUsTimelineItem>
            </RevealOnScroll>
```

Now the reviewer can read the actual timeline order and copy directly from the route.

### After: the section module focuses on cards, grids, images, and text primitives

File: [`src/components/sections/about-us/section.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/about-us/section.tsx)

```tsx
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { companyBodyTextClassName } from "@/components/ui/text-tokens";

const sectionHeadingClass =
  "text-[48.75px] font-normal leading-[58.125px] tracking-[-0.035em] text-slate-950";
const bodyCopyClass = companyBodyTextClassName;

export function AboutUsBodyCopy({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`${bodyCopyClass}${className ? ` ${className}` : ""}`}>{children}</p>;
}

export function AboutUsHeroCopy({ children }: { children: ReactNode }) {
  return <div className="max-w-[504px] space-y-6">{children}</div>;
}

export function AboutUsHeroImage() {
  return (
    <div className="relative h-[360px] w-full lg:w-[640px]">
      <Image src="/about-us/hero-game-changer.png" alt="Game Changer" fill priority className="object-cover" />
    </div>
  );
}

export function AboutUsSection({ children, muted = false, className = "" }: { children: ReactNode; muted?: boolean; className?: string }) {
  const backgroundClass = muted ? "bg-[#F6F8FA]" : "bg-white";
  return <section className={`${backgroundClass}${className ? ` ${className}` : ""}`}>{children}</section>;
}
```

The section module no longer owns the real leader, timeline, or location sentences.
It provides the visual primitives instead.

## Case 3. Plans: when Big JSON Props and compound aliases appear together, a small copy edit becomes a large contract edit

This case shows the `Big JSON Props` pattern that route-local refactoring should avoid.

### Snapshot references

- before route: [`src/app/t/plans/page.tsx`](https://github.com/querypie/corp-web-japan/blob/4ab11fc40bf3e0f622a08d30a2ffebb44c5d9255/src/app/t/plans/page.tsx)
- before section module: [`src/components/sections/plans-page.tsx`](https://github.com/querypie/corp-web-japan/blob/4ab11fc40bf3e0f622a08d30a2ffebb44c5d9255/src/components/sections/plans-page.tsx)
- after route: [`src/app/t/plans/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/plans/page.tsx)
- after section module: [`src/components/sections/plans/section.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/plans/section.tsx)

### Before 1: local compound aliases reduce route readability

File: [`src/app/t/plans/page.tsx`](https://github.com/querypie/corp-web-japan/blob/4ab11fc40bf3e0f622a08d30a2ffebb44c5d9255/src/app/t/plans/page.tsx)

```tsx
const Pricing = Object.assign(PricingRoot, { Header: PricingHeader });
const Plan = Object.assign(PlanRoot, {
  Card: PlanCard,
  TitleContainer: PlanTitleContainer,
  Title: PlanTitle,
  Description: PlanDescription,
  Price: PlanPrice,
  Button: PlanButton,
  Features: PlanFeatures,
  Feature: PlanFeature,
  Divider: PlanDivider,
});

export default function PlansPreviewPage() {
  return (
    <main className="relative overflow-x-hidden bg-white pt-[72px] text-slate-950">
      <SiteHeader />
      <PlansPageSection>
        <PricingRoot>
          <Pricing.Header>
            <PlansHeroTitle>プラン</PlansHeroTitle>
            <PlansHeroDescription>
              <p>
                あなたのチームに最適なプランを見つけよう。
                <br />
                14日間の無料トライアルで今すぐ始められます。
              </p>
            </PlansHeroDescription>
          </Pricing.Header>
```

This alias layer is not catastrophic on its own, but it adds one more interpretation step for the reviewer.
They now have to decode which names are the real primitives and which ones are route-local aliases.

### Before 2: `CompareTable` receives a giant semantic blob as props

File: [`src/app/t/plans/page.tsx`](https://github.com/querypie/corp-web-japan/blob/4ab11fc40bf3e0f622a08d30a2ffebb44c5d9255/src/app/t/plans/page.tsx)

```tsx
              <CompareTable
                rows={[
                  {
                    label: "一般",
                    values: ["料金", "AI利用クレジット", "利用可能なAIモデル", "独自AIモデルの利用"],
                  },
                  {
                    label: "プラットフォーム機能",
                    values: [
                      "Web検索",
                      "データ可視化ウィジェット",
                      "コード生成・実行",
                      "外部ツール連携 (MCP)",
                      "MCP連携設定の作成",
                      "MCPプロンプト自動生成",
                      "外部アプリでの連携利用",
                      "AIエージェント作成数",
                      "組み込みエージェント利用",
                      "エージェント自動実行",
                      "文書学習の登録数 (RAG)",
                    ],
                  },
                ]}
                columns={[
                  {
                    label: "スターター",
                    values: [
                      [{ primary: "$20/月", isBold: true }, { primary: "800クレジット/月" }, { primary: "Claude" }, false],
                      [true, true, true, true, true, true, true, { primary: "一時的に無制限" }, true, true, { primary: "3" }],
                    ],
                  },
```

The concrete problem is very practical:

- add one row label, and you must update both `rows` and every `columns[*].values[*]`
- if one positional array is off by one, the wrong cell renders under the wrong label
- values mix `string | boolean | ReactNode | CompareTableCellContent`, so copy edits and renderer-contract edits get entangled
- this repository used a TypeScript contract here, but in teams that layer runtime schemas on top, the same change path often expands into schema edits or validation failures

In other words, a small wording or ordering change stops being a local route edit and becomes a mini-schema migration.

### Before 3: the renderer is already decoding a schema-like contract

File: [`src/components/sections/plans-page.tsx`](https://github.com/querypie/corp-web-japan/blob/4ab11fc40bf3e0f622a08d30a2ffebb44c5d9255/src/components/sections/plans-page.tsx)

```tsx
type FeatureValue = string | boolean | ReactNode | CompareTableCellContent;

type CompareTableCellContent = {
  primary: string;
  secondary?: string;
  isBold?: boolean;
  showIcon?: boolean;
};

export type CompareTableRowGroup = {
  label: string;
  values: string[];
};

export type CompareTableColumn = {
  label: string;
  values: FeatureValue[][];
};

export function CompareTable({ rows, columns }: { rows: CompareTableRowGroup[]; columns: CompareTableColumn[] }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm leading-6 text-slate-700">
          <thead>
            <tr className="border-b border-slate-200 bg-white text-slate-950">
              <th className="min-w-[220px] px-5 py-4 font-medium sm:px-6">&nbsp;</th>
              {columns.map((column) => (
                <th key={column.label} className="min-w-[180px] px-5 py-4 text-center font-medium sm:px-6">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
```

So the route passes a giant semantic blob, and the component builds a schema-like decoder for it.
That increases the chance of rendering mistakes and makes simple review harder.

### After: the route authors the real table content directly

File: [`src/app/t/plans/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/plans/page.tsx)

```tsx
              <CompareTable>
                <CompareTableHead>
                  <CompareTablePlanHead>スターター</CompareTablePlanHead>
                  <CompareTablePlanHead>チーム</CompareTablePlanHead>
                  <CompareTablePlanHead>エンタープライズ</CompareTablePlanHead>
                </CompareTableHead>

                <CompareTableSection title="一般">
                  <CompareTableRow label="料金">
                    <CompareTableTextCell isBold>$20/月</CompareTableTextCell>
                    <CompareTableTextCell isBold>$500/月</CompareTableTextCell>
                    <CompareTableTextCell isBold secondary="（年間契約）">
                      カスタム価格
                    </CompareTableTextCell>
                  </CompareTableRow>
                  <CompareTableRow label="AI利用クレジット">
                    <CompareTableTextCell>800クレジット/月</CompareTableTextCell>
                    <CompareTableTextCell>20,000クレジット/月</CompareTableTextCell>
                    <CompareTableTextCell>カスタムクレジット</CompareTableTextCell>
                  </CompareTableRow>
                  <CompareTableRow label="利用可能なAIモデル">
                    <CompareTableTextCell>Claude</CompareTableTextCell>
                    <CompareTableTextCell>Claude / ChatGPT / Gemini</CompareTableTextCell>
                    <CompareTableTextCell>主要LLMを自由に選択可</CompareTableTextCell>
                  </CompareTableRow>
```

Now labels and cell values live in the same JSX block, so the reviewer can read the table semantics directly.

### After: the section module focuses on reusable primitives

File: [`src/components/sections/plans/section.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/plans/section.tsx)

```tsx
export function CompareTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm leading-6 text-slate-700">{children}</table>
      </div>
    </div>
  );
}

export function CompareTableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-slate-200 bg-white text-slate-950">
        <th className="min-w-[220px] px-5 py-4 font-medium sm:px-6">&nbsp;</th>
        {children}
      </tr>
    </thead>
  );
}

export function CompareTablePlanHead({ children }: { children: ReactNode }) {
  return <th className="min-w-[180px] px-5 py-4 text-center font-medium sm:px-6">{children}</th>;
}

export function CompareTableSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <tbody>
      <tr className="bg-slate-900 text-white">
        <th colSpan={4} className="px-5 py-3 text-left text-sm font-medium sm:px-6">
          {title}
        </th>
      </tr>
      {children}
    </tbody>
  );
}
```

The primitive layer remains, but it no longer has to decode a giant semantic data structure.

## Review checklist for real PRs

When reviewing or planning a real route-local refactor, these questions are useful:

1. Can I understand the page narrative from the route file alone?
2. Is the section order directly visible in the route?
3. Is a page-specific content registry hiding the source of truth?
4. Does a section module still own marketing copy instead of just UI implementation?
5. Are giant JSON props turning a small copy edit into a multi-file synchronized change?
6. Are labels, cells, CTA text, and icon mappings spread across both a data blob and a renderer contract?

The more often the answer is yes, the stronger the case for route-local refactoring.
