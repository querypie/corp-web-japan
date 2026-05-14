# Route-Local Refactoring 실제 사례 모음

이 문서는 `route-local refactoring`을 설명할 때 바로 인용할 수 있는 실제 코드 사례를 모아 둔 문서입니다.

중요한 원칙:

- 아래의 코드 파일 링크는 모두 특정 commit SHA에 고정된 GitHub 링크입니다.
- 따라서 이후 코드가 더 바뀌더라도, 이 문서가 설명하는 before/after 스냅샷은 변하지 않습니다.
- 이 문서는 개념 소개용인 [docs/route-local-refactoring-for-developers.ko.md](./route-local-refactoring-for-developers.ko.md)의 상세 사례편입니다.

현재 after 기준 스냅샷:

- `87a7f583fdd2af747a624d83f4f81cc8a993b187`

## 사례 1. Top page: route shell + content registry + giant wrapper

이 사례는 route-local refactoring이 왜 필요한지 가장 전형적으로 보여줍니다.

### 핵심 문제

before 구조에서는 다음 세 레이어를 모두 열어야 페이지를 이해할 수 있었습니다.

- route shell: [`src/app/page.tsx`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/app/page.tsx)
- page-specific content registry: [`src/content/top-page.ts`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/content/top-page.ts)
- giant wrapper/orchestrator: [`src/components/sections/top-page-sections.tsx`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/components/sections/top-page-sections.tsx)

after 구조에서는 다음처럼 바뀌었습니다.

- route: [`src/app/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/page.tsx)
- section implementation: [`src/components/sections/home/hero-section.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/home/hero-section.tsx), [`src/components/sections/home/solution-overview-section.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/home/solution-overview-section.tsx), [`src/components/sections/home/solution-choice-card.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/home/solution-choice-card.tsx)

### Before 1: route는 shell이고, 실제 내용은 다른 파일에 있다

파일: [`src/app/page.tsx`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/app/page.tsx)

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

문제는 reviewer가 이 파일만 보고는 다음을 알 수 없다는 점입니다.

- hero headline이 무엇인지
- section 순서가 어떻게 되는지
- CTA 의도가 무엇인지
- 어떤 문구가 실제 사용자에게 보이는지

### Before 2: content registry가 페이지 카피를 큰 object 안에 숨긴다

파일: [`src/content/top-page.ts`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/content/top-page.ts)

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

이 파일은 데이터를 모으는 데는 편해 보이지만, 페이지 authoring surface로는 좋지 않습니다.
특히 마케팅 copy는 JSON-like object 안으로 들어가면 문단의 호흡, 강조 위치, section 흐름이 다 읽기 어려워집니다.

### Before 3: giant wrapper가 UI와 page narrative를 함께 떠안는다

파일: [`src/components/sections/top-page-sections.tsx`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/components/sections/top-page-sections.tsx)

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

이 파일은 이미 너무 많은 책임을 가집니다.

- page narrative 조립
- content registry 해석
- icon/theme mapping
- tab interaction state
- section rendering
- CTA 배치

즉, route가 아니라 wrapper component가 사실상 페이지 전체를 소유합니다.

### After 1: route에서 실제 문장이 보인다

파일: [`src/app/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/page.tsx)

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

이제 route file만 열어도 reviewer가 페이지의 핵심 메시지를 바로 읽을 수 있습니다.

### After 2: section file은 UI implementation detail에 집중한다

파일: [`src/components/sections/home/hero-section.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/home/hero-section.tsx)

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

이 파일은 이제 "카피의 source of truth"가 아니라 "카피를 어떻게 보여주는가"에 집중합니다.

### 이 사례에서 실제로 좋아지는 점

- title/body/CTA 수정 시 route에서 바로 수정할 수 있습니다.
- section 순서를 읽기 위해 giant wrapper를 열 필요가 없습니다.
- [`src/content/top-page.ts`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/content/top-page.ts) 같은 page-only registry가 더 이상 route의 의미를 가리지 않습니다.
- section component는 styling/layout/primitive로 역할이 좁아집니다.

## 사례 2. About Us: route 안에 있더라도 giant top-level array는 여전히 읽기 어렵다

이 사례는 "copy가 route 안에 있다"와 "route-local authoring이 잘 되어 있다"가 같은 말이 아님을 보여줍니다.

### 참조 스냅샷

- before route: [`src/app/t/about-us/page.tsx`](https://github.com/querypie/corp-web-japan/blob/c03333672e4e4ed5d21cb7d004ea9be2df1f3c9d/src/app/t/about-us/page.tsx)
- after route: [`src/app/about-us/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/about-us/page.tsx)
- after section module: [`src/components/sections/about-us/section.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/about-us/section.tsx)
- after shared layout primitives: [`src/components/sections/company/page-primitives.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/company/page-primitives.tsx)

### Before: route 상단이 giant data blob으로 시작한다

파일: [`src/app/t/about-us/page.tsx`](https://github.com/querypie/corp-web-japan/blob/c03333672e4e4ed5d21cb7d004ea9be2df1f3c9d/src/app/t/about-us/page.tsx)

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
    linkedinUrl: "https://www.linkedin.com/in/ishwang/",
  },
  {
    name: "Paul Hong",
    role: "共同創業者 & 最高財務責任者 (CFO)",
    imageSrc: "/about-us/crew/paul.png",
    imageWidth: 242,
    imageHeight: 242,
```

이 구조의 문제는 다음과 같습니다.

- route가 페이지라기보다 data container처럼 보입니다.
- reviewer가 JSX를 보기 전에 큰 array/object를 먼저 해석해야 합니다.
- leader 한 명의 직함을 고치거나 순서를 바꿔도, 눈으로 보는 authoring surface와 실제 JSX 사이를 계속 왕복해야 합니다.

### After: route에서 timeline / leader / location copy가 바로 보인다

파일: [`src/app/about-us/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/about-us/page.tsx)

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

이제 reviewer는 route file에서 바로 다음을 읽을 수 있습니다.

- timeline의 실제 순서
- 각 연도에 어떤 이벤트가 노출되는지
- 문단/section heading이 어떤 흐름으로 이어지는지

### After: section module은 card/grid/image primitive에 집중한다

파일: [`src/components/sections/about-us/section.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/about-us/section.tsx)

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

이 파일은 더 이상 leader/timeline/location의 실제 문장을 소유하지 않습니다.
그 대신 layout, card, image, typography primitive를 제공합니다.

## 사례 3. Plans: Big JSON Props와 compound alias가 함께 들어오면 작은 copy 변경도 큰 계약 변경이 된다

이 사례는 route-local refactoring에서 특히 피하고 싶은 `Big JSON Props` 패턴을 보여줍니다.

### 참조 스냅샷

- before route: [`src/app/t/plans/page.tsx`](https://github.com/querypie/corp-web-japan/blob/4ab11fc40bf3e0f622a08d30a2ffebb44c5d9255/src/app/t/plans/page.tsx)
- before section module: [`src/components/sections/plans-page.tsx`](https://github.com/querypie/corp-web-japan/blob/4ab11fc40bf3e0f622a08d30a2ffebb44c5d9255/src/components/sections/plans-page.tsx)
- after route: [`src/app/t/plans/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/plans/page.tsx)
- after section module: [`src/components/sections/plans/section.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/plans/section.tsx)

### Before 1: local compound alias가 route readability를 떨어뜨린다

파일: [`src/app/t/plans/page.tsx`](https://github.com/querypie/corp-web-japan/blob/4ab11fc40bf3e0f622a08d30a2ffebb44c5d9255/src/app/t/plans/page.tsx)

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

이 alias 자체가 치명적인 것은 아니지만, route를 읽는 사람 입장에서는
실제 primitive가 무엇인지, 어떤 것이 page-local alias인지, 어디까지가 UI helper인지 한 번 더 해석해야 합니다.

### Before 2: CompareTable이 giant semantic blob을 props로 받는다

파일: [`src/app/t/plans/page.tsx`](https://github.com/querypie/corp-web-japan/blob/4ab11fc40bf3e0f622a08d30a2ffebb44c5d9255/src/app/t/plans/page.tsx)

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

이 패턴의 실질적인 문제는 매우 구체적입니다.

- 한 row label을 추가하면 `rows`와 모든 `columns[*].values[*]`를 동시에 맞춰야 합니다.
- 순서가 한 칸만 어긋나도 다른 셀 데이터가 잘못된 label 밑에 렌더링됩니다.
- 값 타입이 `string | boolean | ReactNode | CompareTableCellContent`로 섞여 있어, copy 수정과 renderer contract 수정이 쉽게 얽힙니다.
- 이 repo의 실제 구현은 TypeScript contract 중심이지만, 이런 구조에 runtime schema validation을 얹는 팀이라면 같은 변경이 schema 수정 또는 validation failure로 직결됩니다.

즉, 작은 문구 추가/순서 변경이 route 한 파일의 로컬 수정으로 끝나지 않고, 사실상 테이블용 mini-schema 전체를 동시에 바꾸는 작업이 됩니다.

### Before 3: renderer 쪽도 이미 schema-like contract를 해석하고 있다

파일: [`src/components/sections/plans-page.tsx`](https://github.com/querypie/corp-web-japan/blob/4ab11fc40bf3e0f622a08d30a2ffebb44c5d9255/src/components/sections/plans-page.tsx)

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

즉, route에서 giant blob을 넘기고, component에서는 그 blob을 해석하는 schema-like renderer를 또 한 번 만들어야 했습니다.

### After: route가 실제 테이블 내용을 직접 authoring한다

파일: [`src/app/t/plans/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/plans/page.tsx)

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

이제 label과 cell 값이 같은 JSX 덩어리 안에 있기 때문에 reviewer가 테이블 semantics를 바로 읽을 수 있습니다.

### After: section module은 reusable primitive에 집중한다

파일: [`src/components/sections/plans/section.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/plans/section.tsx)

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

primitive layer는 남아 있지만, giant semantic data structure를 해석하는 부담은 줄었습니다.

## 이 문서를 읽을 때의 체크리스트

실제 PR이나 코드리뷰에서 아래 질문을 던져보면 좋습니다.

1. route file만 열어도 page narrative가 보이는가?
2. section order가 route에 직접 나타나는가?
3. page-specific content registry가 source of truth를 가리고 있지 않은가?
4. section module이 UI implementation을 넘어서 marketing copy까지 소유하고 있지 않은가?
5. giant JSON props 때문에 작은 copy 변경이 여러 파일 동시 수정으로 번지고 있지 않은가?
6. label / cell / CTA / icon mapping이 data blob과 renderer contract 사이에 이중으로 퍼져 있지 않은가?

이 질문에 "예"가 많이 나올수록 route-local refactoring의 우선순위가 높다고 볼 수 있습니다.
