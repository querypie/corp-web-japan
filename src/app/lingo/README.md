# Lingo migration notes

This route family contains the Japanese-only migration of the standalone
`lingo-web` marketing website into `corp-web-japan`.

The public route prefix is `/lingo/**`. The migration intentionally does not use
Next.js route groups, multiple root layouts, or `next-intl` in this repository.
Instead, the Lingo page family is kept as an explicit subtree with scoped CSS,
scoped source paths, and route-aligned public assets.

## Migration source

Source repository:

- `../lingo-web`
- GitHub remote: `git@github.com:querypie/lingo-web.git`

Source commit used for this migration:

- `b13b5537925641f486216a9835001caaa7e1f272`
- short SHA: `b13b553`
- commit subject: `쿠키 동의 UI 추가`

Recent source commit log at the time of migration:

```text
b13b553 쿠키 동의 UI 추가
e86221b 운영 배포 OG URL 도메인 수정
736040a 다국어 OG 이미지 및 언어 선택 순서 반영
4fd667a Lingo 웹사이트 홈 및 기능 페이지 정리 (#23)
c1070da feat: 홈페이지 FeatureBento 개선 (#21)
be1a390 feat: 홈페이지 벤토 UI 개선 및 에셋 교체 (#20)
8fd7c5d fix(cd): Vercel 클라우드 빌드 방식으로 스테이징 배포 복원
61ba535 ci: Vercel cloud build 우회 — 로컬 빌드 + --prebuilt 배포
3c44667 ci: Vercel CLI 버전 고정 (54.0.0)
322aa5a feat: 페이지 및 섹션 구조 정리 + design.md 현행화 (#19)
e0e4c48 feat: 홈페이지 섹션 개선 및 기능 페이지 추가 (#18)
1092814 feat: 홈페이지 섹션 개선 및 기능 페이지 추가 (#17)
```

When updating this migration later, compare the current `../lingo-web` HEAD
against the source commit above first. If the source repo has advanced, treat the
new source commit as the next migration baseline and update this README with the
new commit ID and the relevant commit log.

## Migrated routes

The source site uses `app/[locale]/**` and serves Japanese pages under `/ja/**`.
This migration maps those Japanese pages into the local `/lingo/**` subtree:

| Source route | Target route | Target file |
| --- | --- | --- |
| `/ja` | `/lingo` | `src/app/lingo/page.tsx` |
| `/ja/about` | `/lingo/about` | `src/app/lingo/about/page.tsx` |
| `/ja/contact` | `/lingo/contact` | `src/app/lingo/contact/page.tsx` |
| `/ja/features/ai-note` | `/lingo/features/ai-note` | `src/app/lingo/features/ai-note/page.tsx` |
| `/ja/features/transcription` | `/lingo/features/transcription` | `src/app/lingo/features/transcription/page.tsx` |
| `/ja/features/translation` | `/lingo/features/translation` | `src/app/lingo/features/translation/page.tsx` |
| `/ja/integrations` | `/lingo/integrations` | `src/app/lingo/integrations/page.tsx` |
| `/ja/pricing` | `/lingo/pricing` | `src/app/lingo/pricing/page.tsx` |
| `/ja/resources/help` | `/lingo/resources/help` | `src/app/lingo/resources/help/page.tsx` |
| `/ja/resources/release-note` | `/lingo/resources/release-note` | `src/app/lingo/resources/release-note/page.tsx` |

## Target source layout

The migration keeps Lingo-specific code and assets under Lingo-specific paths:

```text
src/app/lingo/**
src/components/layout/lingo/**
src/components/sections/lingo/**
src/components/lingo/**
src/lib/lingo/**
public/lingo/**
```

Responsibilities:

- `src/app/lingo/layout.tsx` owns the Lingo subtree wrapper and mounts the Lingo
  GNB and cookie consent UI.
- `src/app/lingo/**/page.tsx` files own the routed page entries.
- `src/components/layout/lingo/**` contains migrated Lingo layout/chrome
  components such as `GNB`, `Footer`, and `CookieConsent`.
- `src/components/sections/lingo/**` contains migrated Lingo marketing sections.
- `src/components/lingo/**` contains Lingo-only common and mockup components.
- `src/lib/lingo/**` contains Lingo-only helpers, copy shims, and Japanese
  message data.
- `public/lingo/**` contains migrated Lingo assets and must remain the asset root
  for this route family.

## Migration approach

The first migration was done as a direct-but-scoped port, with transformation
rather than a full redesign. The goal was to preserve visual parity first and
then make future cleanup safe and reviewable.

Major transformations:

1. App Router path mapping
   - Source `app/[locale]/**/page.tsx` files became target
     `src/app/lingo/**/page.tsx` files.
   - Locale-prefixed public paths such as `/${locale}/pricing` were rewritten to
     `/lingo/pricing`.
   - Route groups were intentionally not introduced.

2. Japanese-only i18n simplification
   - `next-intl` was not added to `corp-web-japan`.
   - Imports from `next-intl` were rewritten to `@/lib/lingo/intl`.
   - `src/lib/lingo/intl.ts` provides a small Japanese-only shim for
     `useLocale()` and `useTranslations()`.
   - `messages/ja.json` from `lingo-web` was copied to
     `src/lib/lingo/messages/ja.json`.
   - `getLocaleCopy()` was rewritten in `src/lib/lingo/locale-copy.ts` to always
     select Japanese copy.

3. Component path isolation
   - Source Lingo layout components moved to `src/components/layout/lingo/**`.
   - Source Lingo section and home components moved to
     `src/components/sections/lingo/**`.
   - Source Lingo common and mockup components moved to `src/components/lingo/**`.
   - Imports were rewritten to those Lingo-specific target paths.

4. Asset path isolation
   - Source `public/images/**`, `public/favicon.png`, and `public/symbol.png`
     were copied under `public/lingo/**`.
   - Source references like `/images/...` were rewritten to `/lingo/images/...`.
   - Future Lingo-only assets should be added under `public/lingo/**`, not the
     shared site `public/` root.

5. Scoped CSS isolation
   - Source Lingo global styles were not copied as unscoped global rules.
   - Lingo design tokens and helper classes are mounted under `.lingo-scope` in
     `src/app/globals.css`.
   - `src/app/lingo/layout.tsx` wraps the subtree with
     `className="lingo-scope locale-ja font-sans antialiased"`.
   - Selectors such as `.text-h1`, `.body-md`, `.section-gap`, `.gnb-surface`,
     `.feature-*`, `.mockup-*`, and `.transcript-*` are expected to remain
     scoped below `.lingo-scope`.
   - Only minimal Tailwind theme tokens needed by the migrated Lingo utility
     classes were registered globally.

6. Dependency alignment
   - Dependencies required by migrated Lingo components were added to
     `package.json` and `package-lock.json`:
     - `@phosphor-icons/react`
     - `qrcode.react`
     - `react-virtuoso`
     - `recharts`

## Important invariants

Preserve these invariants when applying future Lingo source updates:

- Public Lingo routes stay under `/lingo/**`.
- Lingo assets stay under `/lingo/**` URLs and `public/lingo/**` files.
- Lingo-specific source stays under Lingo-specific directories.
- `next-intl` should not be reintroduced unless the site intentionally becomes
  multilingual inside `corp-web-japan`.
- Lingo-specific CSS must stay scoped under `.lingo-scope` unless there is a
  deliberate shared-site design decision.
- Do not add a top-level route group or multiple-root-layout refactor as part of
  routine Lingo sync work.
- Prefer preserving visual parity during source syncs; do broader refactors in
  separate follow-up PRs after parity is confirmed.

## Intentional QueryPie.ai link divergence

The following links are intentionally different from `lingo-web`. Future Lingo
migration refreshes and visual/content parity checks must preserve these
same-site `querypie.ai` paths instead of reverting them to `querypie.com` source
links. Because these targets are served by the same `querypie.ai` website, use
root-relative paths in code.

Primary legal/footer policy:

- The Lingo GNB Company links and footer Company links point to the
  corresponding same-site company pages by root-relative path.
- Cookie Preference, Terms of Use, Privacy Policy, and EULA links in the Lingo
  footer point to the corresponding same-site legal pages by root-relative path.
- The cookie consent banner's Privacy Policy link also points to the same-site
  Privacy Policy path.
- The footer Cookie Preference item links to `/cookie-preference`; the cookie
  consent banner can still open its local settings UI.
- Other Lingo links that point to `querypie.com/` in the source should be mapped
  to the corresponding `querypie.ai` same-site destination below.

Mapping table:

| Source `querypie.com` link | Target same-site path | Usage |
| --- | --- | --- |
| `https://www.querypie.com/company/about-us` | `/about-us` | GNB and footer About link |
| `https://www.querypie.com/ko/company/about-us` | `/about-us` | GNB and footer About link fallback |
| `https://www.querypie.com/ja/company/about-us` | `/about-us` | GNB and footer About link |
| `https://www.querypie.com/company/contact-us` | `/contact-us` | GNB and footer Contact link and shared Lingo contact CTA |
| `https://www.querypie.com/ko/company/contact-us` | `/contact-us` | GNB and footer Contact link fallback |
| `https://www.querypie.com/ja/company/contact-us` | `/contact-us` | GNB and footer Contact link |
| `https://www.querypie.com/terms-of-service` | `/terms-of-service` | Footer Terms of Use link |
| `https://www.querypie.com/ko/terms-of-service-ko` | `/terms-of-service` | Footer Terms of Use fallback |
| `https://www.querypie.com/ja/terms-of-service-ja` | `/terms-of-service` | Footer Terms of Use link |
| `https://www.querypie.com/privacy-policy` | `/privacy-policy` | Footer and cookie banner Privacy Policy link |
| `https://www.querypie.com/ko/privacy-policy-ko` | `/privacy-policy` | Footer and cookie banner Privacy Policy fallback |
| `https://www.querypie.com/ja/privacy-policy-ja` | `/privacy-policy` | Footer and cookie banner Privacy Policy link |
| `https://www.querypie.com/eula` | `/eula` | Footer EULA link |
| `https://www.querypie.com/ko/eula` | `/eula` | Footer EULA fallback |
| `https://www.querypie.com/ja/eula` | `/eula` | Footer EULA link |
| Source Cookie Preference legal link | `/cookie-preference` | Footer Cookie Preference link |
| `https://querypie.com` | `/` | Pricing page QueryPie CTA |
| `https://www.querypie.com/solutions/aip` | `/platforms/aip` | Integrations page AIP link fallback |
| `https://www.querypie.com/ko/solutions/aip` | `/platforms/aip` | Integrations page AIP link fallback |
| `https://www.querypie.com/ja/solutions/aip` | `/platforms/aip` | Integrations page AIP link |

## Recommended future update workflow

Use this process when `lingo-web` changes and the `/lingo/**` migration needs to
be refreshed.

1. Inspect source repo state

```bash
git -C ../lingo-web fetch origin --prune
git -C ../lingo-web status --short --branch
git -C ../lingo-web rev-parse HEAD
git -C ../lingo-web log --oneline b13b5537925641f486216a9835001caaa7e1f272..HEAD
```

If `../lingo-web` is not on the desired source branch or commit, explicitly check
out the intended source before copying anything.

2. Compare source changes by family

Recommended checks:

```bash
git -C ../lingo-web diff --stat b13b5537925641f486216a9835001caaa7e1f272..HEAD -- \
  app/[locale] components lib messages public/images public/favicon.png public/symbol.png app/globals.css package.json

git -C ../lingo-web diff --name-status b13b5537925641f486216a9835001caaa7e1f272..HEAD -- \
  app/[locale] components lib messages public/images public/favicon.png public/symbol.png app/globals.css package.json
```

Classify changes into:

- route/page JSX changes
- Lingo layout/chrome changes
- section/common/mockup component changes
- Japanese copy/message changes
- asset additions/removals/renames
- CSS token/helper/animation changes
- dependency changes

3. Apply the same migration transformations

For changed source files, repeat the path and import transformations used in the
initial migration:

- `app/[locale]/**` -> `src/app/lingo/**`
- `components/layout/**` -> `src/components/layout/lingo/**`
- `components/sections/**` -> `src/components/sections/lingo/**`
- `components/home/**` -> `src/components/sections/lingo/home/**`
- `components/common/**` -> `src/components/lingo/common/**`
- `components/mockup/**` -> `src/components/lingo/mockup/**`
- `lib/**` -> `src/lib/lingo/**`
- `messages/ja.json` -> `src/lib/lingo/messages/ja.json`
- `public/images/**` -> `public/lingo/images/**`
- `/images/...` -> `/lingo/images/...`
- `/${locale}/...` -> `/lingo/...`
- `next-intl` imports -> `@/lib/lingo/intl`

4. Re-check scoped CSS carefully

CSS updates need manual review. Do not paste new Lingo CSS into `globals.css`
without scoping it.

Before committing, verify that Lingo helper selectors are scoped:

```bash
rg -n '^(\.text-h1|\.text-h2|\.body-md|\.section-gap|\.gnb-|\.feature-|\.mockup-|\.transcript-)' src/app/globals.css
```

This should return no unscoped Lingo helper selectors. Scoped selectors should
look like `.lingo-scope .text-h1`, `.lingo-scope .gnb-surface`, and so on.

5. Re-check route and asset rewrites

```bash
rg -n 'next-intl|@/lib/lingo/lingo|href=\{`/\$\{locale\}|router\.push\(`/)' \
  src/app/lingo src/components/layout/lingo src/components/sections/lingo src/components/lingo src/lib/lingo

rg -n '"/images/|\x27/images/' \
  src/app/lingo src/components/layout/lingo src/components/sections/lingo src/components/lingo src/lib/lingo
```

Expected result: no stale `next-intl`, double-`lingo` import, locale-prefixed
internal route, or un-namespaced `/images/**` references in the migrated tree.

6. Verify locally with lightweight checks

At minimum:

```bash
git diff --check
npm run typecheck
npx next typegen
npm run lint
```

The initial migration retained source `<img>` markup for parity, so lint may show
`@next/next/no-img-element` warnings. Treat lint errors as blockers; treat these
image warnings as known follow-up cleanup unless the update explicitly includes
image-component refactoring.

7. Update this README

Whenever a source sync is applied, update:

- the source commit ID
- the recent or relevant source commit log
- any new transformation rules
- any new dependencies or migration caveats

8. Visual parity review

After the PR Preview deployment is available, compare the updated `/lingo/**`
pages against the corresponding source Japanese Lingo pages. At minimum compare:

- desktop `1440x900`
- mobile `390x844`

Focus on:

- GNB layout and glass surface
- hero spacing and background image
- typography and line breaks in Japanese copy
- card sizes, gaps, radii, and shadows
- feature/mockup animation states
- image sizing and object fit
- footer and cookie consent behavior

## Known follow-up opportunities

These were intentionally not part of the first migration because the priority was
route availability and visual parity:

- Replace migrated `<img>` usage with `next/image` where it does not affect
  parity or implementation risk.
- Reduce client-component surface where components no longer need client-only
  behavior after Japanese-only simplification.
- Remove unused non-Japanese assets from `public/lingo/**` if visual parity and
  future sync needs do not require keeping the full source asset set.
- Add route-level smoke tests for the `/lingo/**` pages after the route contract
  stabilizes.
- Add browser-render parity artifacts once the PR Preview URL is available.
