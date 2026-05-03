# Static Page Route-Local Authoring Guide

This document defines the desired authoring pattern for static marketing pages in `corp-web-japan`.

It exists because some older guidance and intermediate refactor results do not fully match the intended end state.
The source of truth for this guide is the currently desired implementation direction discussed in repository work:

- `src/app/**/page.tsx` should own the page copy and the page composition
- `src/components/sections/**` should own the UI implementation details used by the page
- avoid old content-registry and giant wrapper patterns that hide the real page authoring surface

## Purpose

Use this guide when:

- creating a new static marketing page
- refactoring an existing static route
- reviewing whether a page is fully route-local or only partially refactored
- deciding what belongs in `page.tsx` versus `src/components/sections/**`

This guide applies to static marketing routes such as:

- `src/app/page.tsx`
- `src/app/solutions/**/page.tsx`
- mostly static preview pages under `src/app/t/**/page.tsx`

This guide does not define the preferred structure for:

- blog / whitepaper / news publication routes
- clearly data-backed feature routes
- backend-heavy route handlers or API behavior

## Core rule

For a static marketing page, the route file should be the primary authoring surface.

That means:

- the real copy should be visible in `src/app/**/page.tsx`
- the major section order should be visible in `src/app/**/page.tsx`
- the page should read like a page, not like a thin shell around hidden content layers
- section components may still be used, but they should implement presentation and interaction details rather than hide the page's authored content model

## Responsibility split

### What belongs in `src/app/**/page.tsx`

`page.tsx` should contain:

- page metadata
- the real headings, paragraphs, CTA labels, and other marketing copy
- the actual order of sections
- the calls that compose and use section components
- small route-local arrays or constants when they improve readability without becoming a giant content registry
- route-local links and CTA intent

In short:

- `page.tsx` owns copy and composition

### What belongs in `src/components/sections/**`

`src/components/sections/**` should contain:

- the component definitions used by `page.tsx`
- styling classes
- layout implementation details
- UI and UX behavior
- JavaScript interaction logic
- small reusable section primitives
- isolated client-side interaction where needed

In short:

- `src/components/sections/**` owns implementation details, not the page's hidden authored content model

## Desired end state

A static page is in the desired state when a reviewer can open only `src/app/**/page.tsx` and quickly understand:

- what the page is about
- what order the sections appear in
- what the major marketing claims are
- what the CTAs do
- which components are being used for presentation

A good route-local page may still import components from `src/components/sections/**`.
That is not a problem by itself.
The problem is when those imports hide most of the page's real authored copy and structure.

## Good result example

### Desired route-local authoring shape

The following shape is good because the route file visibly owns the copy and the component composition:

```tsx
export default function HomePage() {
  const topPageHeroContactUrl = "/contact-us?inquiry=ai-consulting";
  const topPageDownloadUrl =
    "https://www.querypie.com/ja/features/documentation/aip-introduction-download";

  return (
    <main>
      <SiteHeader />
      <FloatingConversionCta href="/contact-us" />

      <HeroSection imageSrc="/top-hero.png" imageAlt="...">
        <HeroProofPillGroup>
          <HeroProofPill>国際基準のセキュリティ</HeroProofPill>
          <HeroProofPill>テスト導入から全社展開へ</HeroProofPill>
        </HeroProofPillGroup>

        <HeroPanel>
          <HeroEyebrow>Secure Enterprise AI</HeroEyebrow>
          <HeroTitle>
            <HeroTitleLine>信頼できるAIが、</HeroTitleLine>
            <HeroTitleLine delayed>現場を動かす</HeroTitleLine>
          </HeroTitle>
          <HeroSubcopy>誰もが安全かつ迅速に業務で使えるAI</HeroSubcopy>
          <HeroBody>
            QueryPie AIは、強固なセキュリティとガバナンスを前提とした
            エンタープライズAI基盤を提供します。
          </HeroBody>
          <HeroActionGroup>
            <HeroPrimaryAction href={topPageHeroContactUrl}>お問い合わせ</HeroPrimaryAction>
            <HeroSecondaryAction href={topPageDownloadUrl}>資料をダウンロード</HeroSecondaryAction>
          </HeroActionGroup>
        </HeroPanel>
      </HeroSection>

      <SolutionOverviewSection>
        <SolutionOverviewTitle>
          AI活用は、単なる業務効率化にとどまらない
          <span className="heading-highlight-accent">経営課題</span>
          への対策
        </SolutionOverviewTitle>
      </SolutionOverviewSection>
    </main>
  );
}
```

Why this is good:

- the real headings, paragraphs, and CTA labels are visible in `page.tsx`
- the route file shows the section order directly
- `page.tsx` composes section components explicitly
- the imported section files provide UI structure, styling, and interaction details
- a reviewer can understand the page narrative without opening hidden content registries

Important nuance:

This does not mean everything must be inline JSX with no section components.
It means the route file must still remain the primary readable authoring surface.

## Partial result example

### Partially refactored, but not yet the target end state

The following shape is only partial because the route file still starts with large data blocks that dominate the authoring surface:

```tsx
const releaseFlow = [
  {
    step: "STEP 01",
    period: "1〜2週間",
    title: "ヒアリング・要件定義",
    body: "貴社のビジネスモデルや既存システム...",
  },
  {
    step: "STEP 02",
    period: "2〜3週間",
    title: "プロトタイプ作成",
    body: "要件に基づき、UI/UXを貴社ブランドに合わせて...",
  },
] as const;

const comparisonRows = [
  {
    label: "開発期間",
    left: ["最短1ヶ月（API組み込みのみ）", "すぐに市場投入が可能"],
    right: ["半年〜1年以上（試行錯誤の連続）", "競合に先を越され市場機会を逃す"],
  },
] as const;

export default function AIDashiPage() {
  return (
    <main>
      <SiteHeader />
      <FloatingConversionCta href={aiDashiFloatingUrl} />
      <section>
        <h1>自社サービスをAI搭載SaaSへ最短で進化させる</h1>
      </section>
    </main>
  );
}
```

Why this is only partial:

- the route file already owns much more of the page than the old wrapper/content-registry pattern
- however, large top-level route data blocks still dominate the file
- this can still read like `data blob first, page authoring second`

This shape is closer to the target than the old pattern, but it is not yet the cleanest result.

Typical symptoms of a partial result:

- large top-level arrays and objects dominate the route file
- the copy is technically local, but still separated from the JSX too mechanically
- the page still feels partly content-driven instead of clearly authored in place

## Wrong result example

### Typical pre-refactor anti-pattern

The following shape is wrong because `page.tsx` becomes only a shell:

```tsx
import { aiCrewFloatingCtaUrl, homePageContent } from "@/content/home";
import { HomePageSections } from "@/components/sections/home-page-sections";

export const metadata: Metadata = {
  title: "作業を減らし、成果を増やす。| AI Crew | QueryPie AI",
  description: homePageContent.metadata.description,
};

export default function AICrewPage() {
  return (
    <main>
      <SiteHeader />
      <FloatingConversionCta href={aiCrewFloatingCtaUrl} />
      <HomePageSections />
      <SiteFooter />
    </main>
  );
}
```

And the hidden content registry looks like this:

```ts
export const homePageContent = {
  metadata: {
    title: "作業を減らし、成果を増やす。",
    description: "調査、データ整理、下書きなど...",
  },
  hero: {
    eyebrow: "専用AIエージェントの設計・実運用支援",
    title: "作業を減らし、\n成果を増やす。",
    subcopy: "利益を生み出す実務特化型AIエージェント",
  },
};
```

And the hidden wrapper starts like this:

```tsx
export function HomePageSections() {
  const {
    hero,
    lostSection,
    whitepaperCta,
    featureIntro,
    featureTabs,
    comparison,
    roi,
    problem,
    roles,
    process,
    testimonials,
    contact,
  } = homePageContent;

  return (
    <>
      <section id="hero">
        ...
      </section>
    </>
  );
}
```

Why this is the wrong shape:

- `page.tsx` acts mainly as a shell
- the real copy is hidden in a page-specific content registry under `src/content/**`
- the real structure is hidden behind a large page-specific wrapper component under `src/components/sections/**`
- opening `page.tsx` alone does not explain the page

This is the classic pattern that should be refactored away.

## Anti-patterns to avoid

Avoid these outcomes even if they look like progress.

### 1. Giant page-specific content registry

Bad pattern:

- `page.tsx` imports a large page-specific content object from `src/content/**`
- most headings, paragraphs, CTA labels, and section data are stored there

Why it is bad:

- the route file stops being the main authoring surface
- copy and composition become harder to review together

### 2. Giant page-specific wrapper component

Bad pattern:

- `page.tsx` renders one large `*Sections` component that contains most of the actual page

Why it is bad:

- the route file becomes a shell
- the page structure is hidden in another file

### 3. Mechanical relocation of the same giant object into `page.tsx`

Bad pattern:

- removing `src/content/<page>.ts`
- moving the same giant registry into top-level constants at the top of `page.tsx`

Why it is still bad:

- this is only a location change
- the route still reads like a content registry rather than a page authoring surface

### 4. Mechanical relocation of the same giant wrapper into a local helper

Bad pattern:

- copying a large external `*Sections` wrapper into `page.tsx` as `function PageSections()`
- keeping most of the authored structure hidden inside that local helper

Why it is still bad:

- this is still a wrapper-first page shape
- the route file is not yet the primary readable authoring surface

### 5. Over-promoting page-specific copy into shared section files

Bad pattern:

- putting long page-specific marketing copy directly inside `src/components/sections/**`
- making section files the true source of page meaning

Why it is bad:

- section files should implement UI behavior and styling details
- the page route should still own the authored copy and section composition

## Preferred authoring pattern

A static page should usually read like this at a high level:

1. metadata
2. route-local links / CTA constants if needed
3. small local arrays only where they improve readability
4. route JSX that contains the real copy
5. explicit use of imported section components for presentation

A good reading experience is:

- open `page.tsx`
- understand the page narrative without chasing multiple files
- open section component files only when you need to inspect layout, styling, or interaction details

## Practical authoring rules

### Copy placement

Prefer this:

- headings directly in `page.tsx`
- paragraph copy directly in `page.tsx`
- CTA labels directly in `page.tsx`
- route-specific message ordering directly in `page.tsx`

Use local constants only when they make the route clearer, not when they recreate an old registry shape.

### Section component placement

Prefer this for `src/components/sections/**`:

- wrapper markup and layout primitives
- card shells
- animated section scaffolding
- reusable CTA shells
- reveal/scroll behavior
- tabs, accordions, or other client-side interaction
- classes, JavaScript behavior, and visual implementation details

### Constant placement

Acceptable in `page.tsx`:

- a few CTA URLs
- a small card list
- a short step list
- a short badge list

Needs caution:

- many large nested objects that recreate a hidden content CMS inside the route file

### Client-side behavior

If one section needs client-side state:

- keep the page route as the authoring surface
- extract only the interaction-heavy component
- keep the main copy and composition visible in `page.tsx`

## Refactor approach

When refactoring a non-compliant static page:

1. identify the old page-specific content registry
2. identify the old page-specific orchestrator wrapper
3. move real headings, paragraphs, and CTA labels into `page.tsx`
4. keep or extract only the UI implementation details into `src/components/sections/**`
5. remove obsolete content-registry and wrapper layers
6. verify that `page.tsx` now reads like the page itself

## What PR 155, 156, 157, and 158 demonstrate

PR 155, 156, 157, and 158 are the concrete reference sequence for the desired top-page refactor style.

Those PRs do not mean:

- "inline everything into one giant JSX file"
- "stop using section components"
- "move all layout and class names into the route file"

Instead, they show this exact pattern:

1. remove one authored section at a time from the old top-page content layer
2. remove the matching section from the old top-page orchestrator wrapper
3. move the real copy for that section into `src/app/page.tsx`
4. introduce or keep a dedicated section component file under `src/components/sections/**`
5. let that section component file own layout, classes, and interaction details
6. let `page.tsx` call those components directly with real text children and route-local props

In other words:

- `page.tsx` becomes the page authoring surface
- `src/components/sections/**` becomes the implementation surface

### The important change in those PRs

Before this refactor style, the top page had an older pattern like:

- `src/content/top-page.ts` holding the section copy/data
- `src/components/sections/top-page-sections.tsx` orchestrating the full section markup
- `src/app/page.tsx` remaining comparatively thin

PR 155-158 progressively removed that shape.

The desired result is not merely "content moved files".
The desired result is specifically:

- the page route now spells out the section content directly
- the old shared top-page content registry no longer owns that copy
- the old giant top-page wrapper no longer owns that section structure
- the route imports smaller section-specific component APIs and uses them explicitly

### Concrete example of the PR 155-158 pattern

Desired shape:

```tsx
<PlatformRequirementsSection>
  <PlatformRequirementsIntro>
    <PlatformRequirementsTitle>
      企業がAIを
      <span className="heading-highlight-accent">安全に使いこなす</span>
      ための、3つの基盤要件
    </PlatformRequirementsTitle>
    <PlatformRequirementsBody>
      AI導入を阻む壁を乗り越え、現場での定着と全社レベルのガバナンスを両立するために。
    </PlatformRequirementsBody>
  </PlatformRequirementsIntro>

  <PlatformRequirementsBlockList>
    <PlatformRequirementsBlock>
      <PlatformRequirementsBlockContent>
        <PlatformRequirementsBlockLabel>ガバナンス＆セキュリティの壁に対応</PlatformRequirementsBlockLabel>
        <PlatformRequirementsBlockTitle>
          権限制御と監査ログによる、強固なガバナンス統制
        </PlatformRequirementsBlockTitle>
        <PlatformRequirementsBlockBody>
          「誰がどのデータにアクセスし、どう操作したか」を厳密に制御・記録します。
        </PlatformRequirementsBlockBody>
      </PlatformRequirementsBlockContent>
      <PlatformRequirementsBlockImage
        src="/top-assets/platform-requirements/governance.webp"
        alt="権限制御と監査ログによるガバナンス統制のイメージ"
      />
    </PlatformRequirementsBlock>
  </PlatformRequirementsBlockList>
</PlatformRequirementsSection>
```

Matching section implementation file:

```tsx
export function PlatformRequirementsSection({ children }: { children: ReactNode }) {
  return <section className="mx-auto max-w-[1920px] bg-white px-6 py-16 lg:px-10 lg:py-20">{children}</section>;
}

export function PlatformRequirementsTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[30px] font-semibold leading-[1.2] tracking-[-0.04em]">{children}</h2>;
}

export function PlatformRequirementsBlockImage({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} fill className="object-cover" />;
}
```

This is the important split:

- `page.tsx` owns the message
- `src/components/sections/**` owns how the message is rendered

### Why this is different from the old top-page wrapper pattern

Old pattern:

```tsx
export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <TopPageSections />
      <SiteFooter />
    </main>
  );
}
```

And inside the wrapper:

```tsx
export function TopPageSections() {
  return (
    <div>
      <section>
        <MarketingSectionIntro title={whitepapers.title} body={<p>{whitepapers.body}</p>} />
      </section>
    </div>
  );
}
```

This is wrong because:

- `page.tsx` does not author the page
- the route file does not tell the story directly
- the page meaning still lives in the old wrapper/content model

### The section-by-section migration rule

PR 155-158 also show an important migration strategy:

- refactor one authored section at a time
- delete the old source for that section in the same change when safe
- update tests so they stop assuming the old location is canonical
- keep moving until the old giant wrapper and old giant content file lose responsibility section by section

This is the preferred practical strategy for large static pages.

## Review checklist

Use this checklist in PR review or self-review.

### Route-local authoring checklist

- [ ] Does `page.tsx` contain the real page copy?
- [ ] Does `page.tsx` show the actual section order clearly?
- [ ] Can a reviewer understand the page without opening multiple hidden content files?
- [ ] Are CTA labels and route-specific messaging visible in `page.tsx`?
- [ ] Are imported section files mainly implementing UI, styling, layout, or interaction details?
- [ ] Is there no giant page-specific content registry under `src/content/**` for this page?
- [ ] Is there no giant page-specific `*Sections` wrapper hiding most of the page?
- [ ] Has the refactor avoided replacing one hidden abstraction with the same abstraction moved locally?
- [ ] Does the route feel like a page, not a shell around hidden layers?

### Warning signs checklist

- [ ] `page.tsx` mostly imports one content object and one giant wrapper component
- [ ] most copy lives outside the route file
- [ ] the route starts with many large top-level content objects that feel like a registry dump
- [ ] the real page cannot be understood without opening `src/content/**` and `src/components/sections/**`
- [ ] page-specific marketing copy is concentrated in section implementation files instead of the route

If several warning signs are true, the page is not in the desired end state.

## Short decision rule

Use this simple test:

- If `page.tsx` tells the page story and `src/components/sections/**` implements how it looks and behaves, the page is likely in the right shape.
- If `page.tsx` only wires together hidden content and hidden structure from elsewhere, the page is not yet in the right shape.

## Current repository examples

Desired reference:

- `src/app/page.tsx`

Partial / intermediate reference:

- `src/app/solutions/ai-dashi/page.tsx`

Wrong / pre-refactor reference:

- `src/app/solutions/ai-crew/page.tsx`
- `src/content/home.ts`
- `src/components/sections/home-page-sections.tsx`

## Notes for future documentation updates

If another document in `docs/` describes static-page authoring differently, treat this document as the route-local authoring guide for static marketing pages and reconcile the older doc in a follow-up change.
