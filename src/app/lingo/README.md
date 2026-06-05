# Lingo migration notes

This route family contains the Japanese-only migration of the standalone
`lingo-web` marketing website into `corp-web-japan`.

The canonical migration contract now lives in OpenSpec:

- `openspec/specs/contract-lingo-website-migration/spec.md`

Use this README as the short route-local handoff only. If a migration rule here
would conflict with OpenSpec, OpenSpec wins.

## Current source baseline

Source repository:

- `../lingo-web`
- GitHub remote: `git@github.com:querypie/lingo-web.git`

Latest migrated source commit:

- `368e1da`
- commit subject: `서브페이지 UI 정합성 및 모바일 대응 추가 개선 (#28)`

Recent migrated source log:

```text
368e1da 서브페이지 UI 정합성 및 모바일 대응 추가 개선 (#28)
8380de4 OG 이미지 업데이트 (ko/en/ja) (#27)
b9215dc 서브페이지 모바일 대응 및 UI 정합성 개선 (#26)
c1b14dd 목업 모바일 대응 및 실제 앱 UI 정합성 개선 (#25)
3f32a30 목업 다국어(i18n) 지원 추가 (#24)
b13b553 쿠키 동의 UI 추가
```

## Route mapping

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

Lingo-specific code and assets stay under Lingo-specific paths:

```text
src/app/lingo/**
src/components/layout/lingo/**
src/components/sections/lingo/**
src/components/lingo/**
src/lib/lingo/**
public/lingo/**
```

## Same-site link policy

OpenSpec requires same-site `querypie.ai` destinations to use root-relative paths
and open in the current tab/window. This applies to Footer, GNB, CTA buttons, and
other in-page links.

Examples:

| Source link | Target path |
| --- | --- |
| `https://querypie.ai/about-us` | `/about-us` |
| `https://querypie.ai/contact-us` | `/contact-us` |
| `https://querypie.ai/terms-of-service` | `/terms-of-service` |
| `https://querypie.ai/privacy-policy` | `/privacy-policy` |
| `https://querypie.ai/eula` | `/eula` |
| `https://www.querypie.com/ja/company/about-us` | `/about-us` |
| `https://www.querypie.com/ja/company/contact-us` | `/contact-us` |
| `https://www.querypie.com/ja/terms-of-service-ja` | `/terms-of-service` |
| `https://www.querypie.com/ja/privacy-policy-ja` | `/privacy-policy` |
| `https://www.querypie.com/ja/eula` | `/eula` |
| `https://www.querypie.com/ja/solutions/aip` | `/platforms/aip` |

Do not add `target="_blank"` for these same-site relative links.

## Future sync checklist

1. Inspect `../lingo-web` state and source commits.
2. Copy only the source changes needed for the sync.
3. Apply the OpenSpec transformations for route namespace, imports, assets,
   same-site links, scoped CSS, and Japanese-only i18n.
4. Update this README's source baseline when a sync is applied.
5. Run the stale-pattern checks listed in OpenSpec plus:

```bash
git diff --check
npm run typecheck
```

After a Preview deployment is available, compare the updated `/lingo/**` pages
against the corresponding Japanese source pages from `../lingo-web` on desktop and
mobile.
