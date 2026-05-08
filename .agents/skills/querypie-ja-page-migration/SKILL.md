---
name: querypie-ja-page-migration
description: Migrate a page under querypie.com/ja into corp-web-japan by triangulating corp-web-contents source content, corp-web-app behavior contracts, and the live rendered page, then implementing a route-local static preview route under /t/*.
version: 1.1.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [corp-web-japan, querypie.com/ja, migration, preview, static-page, route-local-authoring]
---

# Migrate a `querypie.com/ja/**` page into `corp-web-japan`

Use this skill when the source of truth is an existing public QueryPie Japan page and the target is a new static implementation in `corp-web-japan`, usually first under `/t/**`.

This skill captures the workflow proven during the `/t/cookie-preference` migration, where the implementation needed all three of these inputs at once:
- `../corp-web-contents` for authored copy and section structure
- `../corp-web-app` for behavior contracts, cookie keys, helper logic, and other implementation semantics
- the live `https://www.querypie.com/ja/...` page for the final rendered hierarchy, spacing intent, and real user-facing UI shape

## Mandatory references

Load and follow these first:
- `.agents/skills/page-migration-preview-route/SKILL.md`
- `.agents/skills/static-page-route-local-authoring-refactor/SKILL.md`
- `.agents/skills/preview-root-rem-parity/SKILL.md`
- `docs/code-location-conventions.md`

This skill is not a replacement for those files.
It is the higher-level investigation and implementation workflow for a very specific migration source: `querypie.com/ja/**`.

## When to use this skill

Use it when:
- the source URL is under `https://www.querypie.com/ja/`
- the user wants the page rebuilt locally in `corp-web-japan`
- the target is mostly static marketing/legal/company UI, possibly with small client-side interactivity
- you need more than one repository to reconstruct the page correctly

Typical examples:
- `/ja/cookie-preference`
- `/ja/about-us`
- `/ja/certifications`
- `/ja/services/...`
- other legal/company/marketing pages that currently live on QueryPie Japan

Do not use it for:
- ordinary local-only day-2 edits to an already-migrated page
- publication MDX tasks such as blog, whitepaper, news, events, or demo postings
- backend-heavy flows where the main challenge is API or server logic rather than page migration

## Goal

Produce a local implementation that:
- starts from latest `origin/main` in a fresh worktree
- recreates the same page content and UI composition under `/t/**`
- keeps marketing/legal copy route-local in `page.tsx`
- extracts only UI implementation details and isolated client behavior into `src/components/sections/**`
- preserves any real upstream behavior contract discovered in `corp-web-app`
- stays safe for preview review by using non-indexed preview metadata

## Core principle: triangulate, do not guess

For `querypie.com/ja/**` page migrations, do not rely on only one of these sources.
Use all three and reconcile them:

### 1. `../corp-web-contents` answers “what was authored?”

Inspect the page source tree first.
For a simple static page, check whether a page exists under a pattern such as:
- `../corp-web-contents/pages/<slug>/ja/content.mdx`
- `../corp-web-contents/pages/<slug>/ja/meta.json`

Use this repo to recover:
- page title
- description/meta text
- authored paragraph copy
- section ordering
- long-form explanatory text
- original component composition hints

Important rule:
- treat `corp-web-contents` as the best source for literal authored Japanese copy
- do not paraphrase or shorten just because the existing local PR example did so
- if the upstream content is long and exact, prefer preserving it exactly unless the user asked for copy editing

### 2. `../corp-web-app` answers “what behavior contract exists?”

Inspect `corp-web-app` whenever the page contains more than static copy.
Typical things to search there:
- constants
- cookie keys
- toggle/setter behavior
- form/query contracts
- shared UI semantics
- route or footer/header link behavior

Typical search targets:
- `cookie-preference`
- page slug
- known labels from the UI
- relevant constants and helper names

Examples from the cookie-preference migration:
- `../corp-web-app/src/constants/index.ts`
- `../corp-web-app/src/components/layout/provider/lib/use-google-tag-and-analytics.hook.ts`
- `../corp-web-app/src/components/widget/cookie-preference-switch/**`

Use `corp-web-app` to recover contracts such as:
- exact cookie key names
- persistence behavior
- helper side effects
- whether the page uses a checkbox, switch, or button role contract
- whether supporting layout links should point to a local route, redirect route, or preview-aware route
- the actual DOM composition and primitive/component chain that produces the shipped UI
- the CSS/layout contract carried by that primitive chain (for example wrapper flex direction, inline order, spacing, and alignment)

Important rule:
- if `corp-web-app` defines a stable behavior contract, preserve that contract in the preview implementation unless the user explicitly asks to change it
- do not invent new cookie keys, query params, or route semantics when a real upstream contract already exists
- do not treat visual structure as separate from behavior when the structure is already encoded in the upstream component chain
- if the upstream page already renders through a concrete component such as `CookiePreferenceSwitch -> CookieSwitch -> Switch`, inspect that chain completely before redesigning the local markup

### 3. the live page answers “what actually shipped?”

Open the exact live page in the browser:
- `https://www.querypie.com/ja/<path>`

Inspect:
- visible section order
- actual CTA presence and wording
- whether the UI is card-like, flat-row, centered, left-aligned, etc.
- heading hierarchy
- whether explanatory copy is truly one paragraph or visually split
- the rendered toggle/control semantics
- the relative order of control vs label vs description inside each repeated row
- whether the control/label pair is left-inline, right-aligned, centered, or distributed with `space-between`
- root font size and token-vs-computed spacing behavior

Important rule:
- the live page is the source of truth for the shipped UI composition
- `corp-web-contents` can tell you what was authored, but the live page tells you what users actually see
- when they differ, reconstruct intentionally and document the decision in the PR body if it mattered

## Root-rem parity rule for QueryPie imports

When the source page is under `querypie.com/ja/**`, explicitly check the live page root font size.

Typical pattern:
- source page root font size: `15px`
- `corp-web-japan` preview/public environment: `16px`

Do not blindly copy source computed pixel values.
Instead:
1. measure the live source page root font size
2. identify token-vs-computed values when possible
3. preserve the design/token intent in the 16px-root preview environment

For the cookie-preference migration, the live page root font size was verified as `15px`.
This must be written down whenever it affects spacing or typography choices.

## Recommended migration workflow

### 1. Start from latest main in a fresh worktree

Required baseline:
- `git fetch origin --prune`
- update local `main`
- create a fresh worktree from `origin/main`
- verify the worktree is a real checkout before editing

### 2. Gather source evidence in this order

1. `../corp-web-contents` page source
2. `../corp-web-app` behavior/contract files
3. the exact live `querypie.com/ja` page in browser tools
4. existing local aligned preview examples in `src/app/t/**`

Why this order works:
- authored copy first
- behavior contract second
- shipped UI confirmation third
- local implementation style last

### 2a. Extract row-level UI contracts explicitly before writing JSX

For any page with repeated rows, toggles, cards, disclosures, or mixed control/text blocks, do not stop at high-level statements like "flat list" or "settings page".

Before implementing, explicitly record all of these from upstream:
- row DOM shape
- control/label order
- whether the label is part of the same primitive wrapper as the control
- whether spacing comes from the repeated-item wrapper or from the control primitive itself
- whether the heading text is a standalone heading node or the child/label of the control primitive
- whether the row alignment is inline-start, end-aligned, or `space-between`

For browser verification, inspect at least one concrete repeated item using DOM extraction, not only screenshots or text snapshots.
Examples:
- `outerHTML` of the first repeated row
- `getBoundingClientRect()` for control, label, and description
- computed `display`, `justify-content`, `align-items`, and gap values on the immediate row wrapper

### 3. Decide the target route and scope

For preview-first migration:
- target route should be `src/app/t/<slug>/page.tsx`
- route should render `/t/<slug>`

Use a fresh PR branch for this implementation work.
Do not continue a stale older PR branch unless the user explicitly asked to update that same PR.

### 4. Keep copy route-local in `page.tsx`

`page.tsx` should own:
- page metadata
- title
- descriptive paragraphs
- CTA labels
- visible section order
- the direct JSX composition of the page

Good pattern:
- `page.tsx` contains the real Japanese copy
- `src/components/sections/**` contains only UI implementation details and isolated client behavior

For small interactive legal/settings pages, a good split is:
- `page.tsx`: authored heading/body/CTA copy plus per-row labels and descriptions when those strings truly belong to the route layer
- section component: switch visuals, local state, cookie persistence, accessibility attributes, interaction plumbing, and any upstream-presentational contract that already belongs to the control primitive chain

Guardrail:
- if the upstream component chain already owns both the control and its inline label structure, do not arbitrarily split them into a new `h2 + switch` layout just because that feels cleaner locally
- preserve the upstream row composition first, then localize only what is truly route-authored

### 5. Preserve upstream helper contracts where needed

Common examples:
- cookie keys
- preview-aware link rewriting via `t(path, previewModeEnabled)`
- local redirect endpoint usage instead of direct upstream URLs

Important supporting-rule:
- even when the user asked for a page route only, a tiny supporting shared-layout change can still be correct if it is required for the page to be reachable in preview navigation
- keep such changes minimal and page-scoped

Cookie-preference example:
- the footer legal link needed to become preview-aware via `t("/cookie-preference", previewModeEnabled)`
- this is acceptable because it is the smallest shared-layout change needed to expose the new preview page through the existing preview navigation system

### 6. Prefer flat reviewable diffs

Avoid:
- giant content registries under `src/content/**` for static page migrations
- page-specific wrapper shells that hide the actual page in one orchestrator component
- speculative refactors outside the target page/route family

Prefer:
- one new `src/app/t/.../page.tsx`
- one section component file if needed
- one or two supporting shared-link/test adjustments if strictly necessary

### 7. Add narrow regression tests

At minimum, add a page-specific structure test that verifies:
- preview canonical path
- `robots.index = false` and `robots.follow = false`
- route-local copy remains in `page.tsx`
- the expected section component is used
- any preserved upstream contract is still present (cookie keys, helper call, footer link behavior, etc.)

Good examples of what to assert:
- the route file exists
- the route includes the real Japanese copy
- the section file includes the preserved contract names/keys
- the footer or header link uses preview-aware local routing when required
- when a row-level UI contract matters, the structure test asserts the intended relative composition rather than only the existence of text and cookie keys

## Implementation heuristics

### Use `corp-web-contents` literally for copy
- if the source MDX contains the Japanese sentence, copy that sentence
- avoid silent shortening

### Use `corp-web-app` literally for contract names
- if the cookie key is `cookie-preference-event`, keep that exact key
- if preview navigation uses `t(path, previewModeEnabled)`, reuse that helper instead of inventing a new variant

### Use the live page literally for composition
- if the live UI is a flat list with whitespace, do not rebuild it as boxed marketing cards
- if the live page includes a CTA block beneath the settings section, keep that CTA block
- if the heading hierarchy is one H1 + repeated item headings, keep that shape
- if a repeated row renders as `control + label` inline on the live page, do not reinterpret it into `label left / control right` or another familiar settings-page layout without explicit evidence
- do not replace an upstream row-level contract with a generic SaaS dashboard convention just because it looks reasonable in isolation

### Do not inherit stale intermediate PR layout decisions as migration truth
- an older local PR or draft implementation can be useful as a clue, but it is never a source of truth over `corp-web-contents`, `corp-web-app`, and the live page
- if an earlier branch already rebuilt the page with placeholder layout choices, verify every row-level structure against the upstream sources before carrying that shape forward
- when the upstream component chain and the draft PR disagree, prefer the upstream component chain and live page unless the user explicitly asked for a redesign

## Verification checklist

Before opening the PR:
1. verify the worktree is still based on latest `origin/main`
2. run the narrowest meaningful test for the new page
3. confirm the copied contract names still match the upstream implementation
4. confirm the preview page metadata is non-indexed
5. if the task was visually sensitive, compare against the exact live page in the browser
6. for repeated rows or interactive controls, verify at least one concrete row against upstream DOM structure and geometry before finalizing

Preferred minimum verification for this class of task:
- page-specific `node --test ...` regression(s)
- browser inspection of the exact live source page
- preview deployment review after push when available

## PR guidance

In the PR body, record the three-source evidence explicitly:
- which `corp-web-contents` files supplied the authored copy
- which `corp-web-app` files supplied the behavior contract
- which live URL was inspected for final UI confirmation

This makes later follow-up work much easier.

## Pitfalls

- using only the live page and losing exact authored copy
- using only `corp-web-contents` and missing runtime behavior contracts
- using only `corp-web-app` and missing the actual shipped visual composition
- preserving cookie/query behavior but silently redesigning the upstream DOM/layout contract for repeated rows
- copying only text and keys while missing the primitive chain that determines control/label order and alignment
- reinterpreting the page through a generic local pattern such as `justify-between` settings rows without upstream evidence
- trusting an older local PR's intermediate layout over the upstream component chain and live page
- shortening copy because an earlier stale PR used placeholders
- copying computed px values from a 15px-root source into a 16px-root preview without conversion reasoning
- hiding all page content in a new content registry instead of keeping route-local authoring
- forgetting small shared-layout changes that are required for preview discoverability

## Done criteria

You are done when:
- the page exists locally under `/t/**`
- the route file is the readable source of truth for the page copy and section order
- any required upstream contract from `corp-web-app` is preserved exactly, including row-level structure when that contract is encoded in the upstream component chain
- the implementation matches the live `querypie.com/ja` page’s content and UI composition closely enough for preview review
- a narrow regression test proves the intended route/contract behavior, and for row-sensitive UIs that includes the expected control/label composition
