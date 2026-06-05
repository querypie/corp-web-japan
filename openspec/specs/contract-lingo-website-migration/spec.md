# contract-lingo-website-migration

## Purpose

This spec defines the durable migration contract for the Lingo website subtree in
`corp-web-japan`.

The source website lives in the sibling `../lingo-web` repository and uses a
locale-aware Next.js application shape. The target website exposes a
Japanese-only, namespaced Lingo subtree under `querypie.ai/lingo/**` without
adopting the source repository's full route, layout, or i18n architecture.

## Current implementation references

- `src/app/lingo/**`
- `src/app/lingo/README.md`
- `src/app/globals.css`
- `src/components/layout/lingo/**`
- `src/components/sections/lingo/**`
- `src/components/lingo/**`
- `src/lib/lingo/**`
- `public/lingo/**`
- `../lingo-web/app/[locale]/**`
- `../lingo-web/components/**`
- `../lingo-web/lib/**`
- `../lingo-web/messages/ja.json`
- `../lingo-web/public/**`

## Requirements

### Requirement: source baseline tracking

Each Lingo source sync SHALL identify the sibling `../lingo-web` source branch or
commit used as the migration input. The route-local Lingo README SHALL record the
source commit, short SHA, subject, and relevant recent commit log or source-change
summary. Future syncs SHALL compare the current target against the previous
recorded source baseline before copying files.

#### Scenario: source sync records the upstream baseline

- GIVEN a maintainer syncs changes from `../lingo-web`
- WHEN the target PR updates `src/app/lingo/**` or Lingo-specific components
- THEN `src/app/lingo/README.md` records the source commit used for the sync
- AND the PR summary names the source baseline or source commit range

### Requirement: route namespace mapping

The Lingo target SHALL expose the migrated website only under `/lingo/**`.
Source routes under `app/[locale]/**` SHALL map to `src/app/lingo/**` without
introducing locale routes such as `/ja`, `/ko`, or `/en` in `corp-web-japan`.
Routine Lingo sync work SHALL NOT introduce a top-level route group, multiple root
layouts, or a full Next Intl route architecture.

#### Scenario: localized source route maps to Lingo namespace

- GIVEN the source page is `../lingo-web/app/[locale]/pricing/page.tsx`
- WHEN the page is migrated into `corp-web-japan`
- THEN the target route file is `src/app/lingo/pricing/page.tsx`
- AND the public target route is `/lingo/pricing`
- AND no `/ja/pricing`, `/ko/pricing`, or `/en/pricing` route is added

### Requirement: Japanese-only i18n shim

The target Lingo subtree SHALL remain Japanese-only unless a separate accepted
site decision makes Lingo multilingual inside `corp-web-japan`. Source imports
from `next-intl` SHALL be rewritten to `@/lib/lingo/intl`. The local shim SHALL
provide the subset of `useLocale()` and `useTranslations()` behavior needed by
migrated Lingo components, including simple placeholder interpolation for values
such as `{id}`. Japanese messages SHALL live under `src/lib/lingo/messages/ja.json`.

#### Scenario: migrated component needs translated copy

- GIVEN a source Lingo component imports `useTranslations` from `next-intl`
- WHEN it is migrated into `corp-web-japan`
- THEN it imports from `@/lib/lingo/intl`
- AND it does not add `next-intl` route setup to the target repository

### Requirement: source and component isolation

Lingo-specific implementation SHALL stay in Lingo-specific target directories:

- `src/app/lingo/**`
- `src/components/layout/lingo/**`
- `src/components/sections/lingo/**`
- `src/components/lingo/**`
- `src/lib/lingo/**`

Source imports SHALL be rewritten into those target namespaces. Migrated Lingo
common, mockup, layout, and section components SHALL NOT be placed in generic
shared component directories unless the component is intentionally promoted into a
shared site primitive in a separate PR.

#### Scenario: source section component is migrated

- GIVEN the source file is `../lingo-web/components/sections/FeatureSection.tsx`
- WHEN it is copied into the target repository
- THEN the target file is `src/components/sections/lingo/FeatureSection.tsx`
- AND imports in Lingo pages reference `@/components/sections/lingo/FeatureSection`

### Requirement: asset isolation and URL rewriting

Lingo-only assets SHALL live under `public/lingo/**` and SHALL be referenced with
`/lingo/**` URLs. Source asset references such as `/images/...`, `/symbol.png`,
and `/favicon.png` SHALL be rewritten to `/lingo/images/...`, `/lingo/symbol.png`,
and `/lingo/favicon.png`. Routine Lingo syncs SHALL NOT add source Lingo assets to
shared roots such as `public/images/**` or `public/t/**`.

#### Scenario: source image path is migrated

- GIVEN source code references `/images/logo-symbol.png`
- WHEN the source is migrated into the Lingo subtree
- THEN the target code references `/lingo/images/logo-symbol.png`
- AND the asset file lives under `public/lingo/images/logo-symbol.png`

### Requirement: scoped styling boundary

Lingo design tokens and helper selectors SHALL remain scoped below `.lingo-scope`
in `src/app/globals.css` unless they are intentionally promoted into shared site
styling in a separate accepted decision. `src/app/lingo/layout.tsx` SHALL mount
the subtree with the Lingo scope class. Routine Lingo syncs SHALL NOT paste source
Lingo global CSS into the target as unscoped global selectors.

#### Scenario: Lingo helper selector is added

- GIVEN a sync adds a new Lingo helper class from source CSS
- WHEN the helper is implemented in `src/app/globals.css`
- THEN the selector is scoped under `.lingo-scope`
- AND it does not affect non-Lingo pages

### Requirement: same-site link targets

Links from the Lingo subtree to pages served by the current `querypie.ai` website
SHALL use root-relative paths and SHALL open in the current tab/window. These
same-site links SHALL NOT use absolute `https://querypie.ai/...`,
`https://www.querypie.ai/...`, or `https://www.querypie.com/...` URLs in Lingo
implementation code, and SHALL NOT set `target="_blank"` or
`rel="noopener noreferrer"` solely for same-site navigation.

This rule applies to the Footer, GNB, CTA buttons, cookie consent, and other
in-page links. Source `querypie.ai` links are not copied literally: because the
Lingo migration result is served as a subpage of the `querypie.ai` website, any
`https://querypie.ai/...` destination SHALL be normalized to the corresponding
root-relative path such as `/about-us`, `/contact-us`, `/terms-of-service`,
`/privacy-policy`, or `/eula`.

#### Scenario: footer company links navigate in the same tab

- GIVEN the Lingo footer renders the Company column
- WHEN it renders `About` and `Contact`
- THEN the links use `/about-us` and `/contact-us`
- AND they do not include `target="_blank"`
- AND they do not include `rel="noopener noreferrer"`

#### Scenario: footer legal links navigate in the same tab

- GIVEN the Lingo footer renders legal links
- WHEN it renders `Terms of Use`, `Privacy Policy`, and `EULA`
- THEN the links use `/terms-of-service`, `/privacy-policy`, and `/eula`
- AND they open in the current tab/window

#### Scenario: source QueryPie link is normalized

- GIVEN the source Lingo website points to `https://querypie.ai/contact-us`
- WHEN that link is migrated into `corp-web-japan`
- THEN the target link is `/contact-us`
- AND it is treated as same-site navigation
- AND it does not include `target="_blank"` or `rel="noopener noreferrer"`

### Requirement: Lingo-internal navigation

Lingo-internal links SHALL stay under `/lingo/**`. Source locale-prefixed internal
links such as `/${locale}/features/transcription` SHALL be rewritten to
`/lingo/features/transcription`. A sync SHALL NOT leave `${locale}` route
construction, `router.push` locale switching, or double-prefixed `/lingo/lingo`
paths in the target Lingo tree.

#### Scenario: source locale-prefixed feature link is migrated

- GIVEN a source link is `/${locale}/features/translation`
- WHEN it is migrated into the target repository
- THEN the target link is `/lingo/features/translation`
- AND the target code does not keep locale-switch routing for the link

### Requirement: source sync verification

Every Lingo sync PR SHALL run lightweight source checks before commit. At minimum,
the PR SHALL verify no stale `next-intl` imports, locale-prefixed internal route
construction, double `/lingo/lingo` paths, or un-namespaced `/images/**` asset
references remain in the Lingo target tree. The PR SHALL also run `git diff
--check` and a TypeScript verification such as `npm run typecheck` unless the PR
is explicitly docs-only.

#### Scenario: stale source route pattern is caught

- GIVEN a migrated Lingo component still contains `href={`/${locale}${item.href}`}`
- WHEN the source sync verification is run
- THEN the stale locale-prefixed pattern is reported before the PR is considered ready

### Requirement: parity-first update policy

Routine Lingo syncs SHOULD preserve visual/content parity with `../lingo-web`
within the target namespace and policy boundaries above. Broader refactors, shared
component promotion, `next/image` conversion, client/server boundary reduction,
or unused asset pruning SHOULD happen in separate follow-up PRs after parity is
confirmed.

#### Scenario: sync reveals cleanup opportunity

- GIVEN a migrated source component still uses `<img>` for parity with `lingo-web`
- WHEN a maintainer wants to convert it to `next/image`
- THEN that cleanup is planned separately unless it is required for the current sync
