---
name: querypie-ja-preview-parity-followup
description: Finish an existing QueryPie Japan preview route so it reaches live-parity structure, route-local authoring, and route-aligned assets, while still allowing page-family-specific rules such as `/t/services/*` follow-up work.
version: 1.0.0
author: Hermes Agent
license: MIT
---

# Finish an existing QueryPie Japan preview route in corp-web-japan so it reaches live parity

Use this repo-local skill when a page already exists under `/t/**`, but the current local preview is still a placeholder or simplified approximation and needs to be brought up to live parity.

Typical examples:
- `/t/services/aip`
- `/t/services/acp`
- `/t/services/fde`
- other future `querypie.com/ja/**` preview routes where the first-pass preview exists but still needs a follow-up parity pass

This skill is intentionally broader than just the services family, but it includes page-family-specific rules for `/t/services/*` because those were the first concrete follow-up migrations that exposed the pattern.

## Load together with

Before using this skill, also read:
- `.agents/skills/querypie-ja-page-migration/SKILL.md`
- `.agents/skills/page-migration-preview-route/SKILL.md`
- `.agents/skills/static-page-route-local-authoring-refactor/SKILL.md`
- `.agents/skills/preview-root-rem-parity/SKILL.md`
- `docs/code-location-conventions.md`

Role split:
- `querypie-ja-page-migration` = source-of-truth investigation workflow
- `page-migration-preview-route` = generic `/t/*` implementation rules
- `querypie-ja-preview-parity-followup` = follow-up parity rules for existing QueryPie Japan preview routes, including service-page-specific heuristics learned from `/t/services/aip`, `/t/services/acp`, and `/t/services/fde`

## When to use

Use this skill when:
- the source page is under `https://www.querypie.com/ja/...`
- the local route already exists under `/t/**`
- the current local page has placeholder preview-only copy, generic cards, missing media, or flattened/simplified structure
- the user wants actual browser-rendered parity, not just source-text migration

## Core rule

Do not treat an existing `/t/services/*` page as already-migrated just because the title and a few paragraphs roughly match.

A service preview page is incomplete if any of these remain:
- placeholder preview-only labels such as `Preview Service`
- explanatory copy such as `preview で確認できるように移しています`
- generic numbered cards like `Value 1`, `Value 2`
- flattened card grids replacing an alternating feature-band layout
- missing hero video when the source page has one
- missing integrations / deep links / docs links from the source page
- CTA wording replaced with local placeholder explanation rather than the real source CTA

## Default PR strategy

If the user asks for several service pages in one request, create separate branches/worktrees/PRs unless they explicitly ask for one combined PR.

Recommended default:
- one PR for `/t/services/aip`
- one PR for `/t/services/acp`
- one PR for `/t/services/fde`

Reason:
- each page can differ greatly in complexity
- ACP especially may require interactive stateful UI that should not be buried inside a multi-page PR
- separate preview deployments make browser verification easier and safer

## Required evidence order

For each page, gather evidence in this order:
1. the short public redirect route, e.g. `src/app/services/aip/route.ts`
2. repo tests such as `tests/redirect-endpoints.test.mjs` and `tests/services-preview-routes.test.mjs`
3. `../corp-web-contents/pages/solutions/.../ja/content.mdx`
4. the exact live page in the browser
5. any already-good sibling preview page in this repo that can be reused structurally

## Page-specific heuristics

### `/t/services/aip`

Required parity elements:
- hero title + body copy
- hero embedded YouTube video
- 3-card value section with real image + title + body + `詳細を見る`
- alternating feature bands instead of a generic 2-column card grid
- upstream CTA wording restored exactly

Link strategy:
- if a corresponding deeper preview page already exists locally, use it
  - `/t/solutions/aip/usage-based-llm`
  - `/t/solutions/aip/mcp-gateway`
  - `/t/solutions/aip/fde-services`
- if no local equivalent exists yet, keep the upstream destination instead of inventing a broken local path

### `/t/services/fde`

Strong shortcut:
- compare against `src/app/t/solutions/aip/fde-services/page.tsx`
- if that sibling preview already matches the same live source, reuse its route-local copy and section structure rather than maintaining a second placeholder layout
- keep `/t/services/fde` as its own route with its own canonical path and asset root under `public/services/fde/*`

Required parity shape:
- hero with the same title/body/hero visual structure
- 4 alternating feature bands
- final CTA using the standard trial wording

### `/t/services/acp`

Do not reduce ACP to a flat feature-card page.

Live parity requires:
- hero with embedded YouTube video
- easy-use section with the large image
- category-driven feature browser
- integrations split section
- final CTA

The live ACP page uses five categories:
- `データベースアクセス制御`
- `システムアクセス制御`
- `Kubernetesアクセス制御`
- `Webアクセス制御`
- `ワークフロー & 統合`

Each category includes multiple tutorial items with:
- title
- body copy
- animated image
- external docs `Learn More` link

Implementation rule for ACP:
- keep category/item data route-local in `page.tsx`
- implement the tab/previous/next interaction in a dedicated client section component under `src/components/sections/**`
- keep tutorial assets route-aligned under `public/services/acp/*`
- keep docs links external when no local migrated equivalent exists

## Asset rules

Always use route-aligned assets:
- `public/services/aip/*`
- `public/services/acp/*`
- `public/services/fde/*`

Do not use:
- `public/t/...`
- generic `public/assets/...`

For parity work, copy only the assets actually needed by the route.

## Testing rules

At minimum:
1. keep or update `tests/services-preview-routes.test.mjs`
2. add a page-specific structure test under a mirrored path such as:
   - `tests/src/app/t/services/aip/page.test.mjs`
   - `tests/src/app/t/services/acp/page.test.mjs`
   - `tests/src/app/t/services/fde/page.test.mjs`

What those tests should guard:
- route exports noindex preview metadata
- route keeps `SiteHeader` + `SiteFooter`
- route-local copy contains the key live headings/CTA text
- section module owns the implementation details for any extracted interactive layout
- placeholder preview-only wording is absent

For ACP specifically, also assert the section module contains:
- client interactivity (`useState`)
- category browser implementation
- prev/next controls
- `Learn More` links

## Browser verification rules

For each PR, verify the exact live page and the exact preview deployment URL in the browser.

Minimum checks:
- section order
- hero structure
- CTA wording
- image presence and rough geometry
- no remaining placeholder preview copy

For `querypie.com/ja/**` pages, remember:
- source often renders at `html { font-size: 15px }`
- corp-web-japan preview should stay at `16px`
- preserve token/design intent, not blindly copied computed px values

## Done criteria

A `/t/services/*` page is done when:
- it matches the live page structure materially, not just the page title
- placeholder preview-only wording is gone
- route-local copy and section composition are reviewable
- assets live under `public/services/<name>/*`
- page-specific regression test exists
- PR is open and CI/Preview have been checked
