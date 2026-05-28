# Lingo Japanese page migration plan

## Goal

Migrate the Japanese-only Lingo marketing pages from `../lingo-web` into this repository under the public `/lingo/**` path family, while preserving the Lingo UI as closely as possible and preventing Lingo-specific styles, tokens, routes, and assets from leaking into the rest of the QueryPie Japan site.

## Source summary

Source repository: `../lingo-web`

Relevant source routes:

- `/ja`
- `/ja/about`
- `/ja/contact`
- `/ja/features/ai-note`
- `/ja/features/transcription`
- `/ja/features/translation`
- `/ja/integrations`
- `/ja/pricing`
- `/ja/resources/help`
- `/ja/resources/release-note`

The source site uses Next.js App Router, React 19, TypeScript, Tailwind CSS v4, and `next-intl` for `en`, `ko`, and `ja` routes. For this migration, only Japanese copy is carried over.

## Target route plan

Target routes in `corp-web-japan`:

- `/lingo`
- `/lingo/about`
- `/lingo/contact`
- `/lingo/features/ai-note`
- `/lingo/features/transcription`
- `/lingo/features/translation`
- `/lingo/integrations`
- `/lingo/pricing`
- `/lingo/resources/help`
- `/lingo/resources/release-note`

Route groups are intentionally not used. The route family is explicit in the URL and source tree, which keeps review, rollout, and later cleanup straightforward.

## Target file layout

- `src/app/lingo/**` owns the route entries.
- `src/app/lingo/layout.tsx` provides the Lingo subtree scope wrapper and Lingo-owned chrome.
- `src/components/layout/lingo/**` contains Lingo layout/chrome components.
- `src/components/sections/lingo/**` contains Lingo section components.
- `src/components/lingo/**` contains Lingo-only common/mockup components that do not fit the shared site component families.
- `src/lib/lingo/**` contains Lingo-only copy helpers, utility helpers, and Japanese message data.
- `public/lingo/images/**` contains migrated Lingo image assets.

## Isolation rules

1. Keep all public routes under `/lingo/**`.
2. Keep all migrated assets under `/lingo/images/**`.
3. Keep Lingo-specific CSS under a `.lingo-scope` wrapper.
4. Do not copy `next-intl` routing into this repository.
5. Do not add a route group or multiple-root-layout refactor for this migration.
6. Keep Lingo GNB/Footer inside the Lingo subtree so the migrated pages can retain their original UI.
7. Keep shared QueryPie Japan pages and chrome unchanged.

## CSS strategy

The source Lingo site defines Tailwind v4 utilities, component classes, animation classes, and CSS variables in a single global stylesheet. This migration appends a scoped Lingo CSS block to `src/app/globals.css`:

- Lingo CSS variables live under `.lingo-scope`.
- typography/layout helper classes are scoped, for example `.lingo-scope .text-h1`.
- Lingo GNB and feature animation classes are scoped.
- Tailwind theme token additions are limited to enabling the migrated Lingo utility classes; visible styling is controlled by `.lingo-scope` variables.

## i18n strategy

The migrated route family is Japanese-only.

- `useLocale()` is replaced by a local Lingo shim that returns `ja`.
- `useTranslations()` is replaced by a local Lingo shim backed by the migrated Japanese message JSON.
- locale switching in the Lingo GNB is reduced to the Japanese route family.
- Lingo links are rewritten from `/${locale}/...` to `/lingo/...`.

## Verification plan

Lightweight verification for this PR:

- inspect `git diff --check`
- run TypeScript/route parsing checks when practical
- inspect the `/lingo/**` source tree for stale `/images/` references and stale `next-intl` imports
- avoid local long-running dev-server/browser verification unless explicitly requested

After PR preview deployment is available, visual parity should be checked against the source Lingo Japanese pages at desktop and mobile viewports.
