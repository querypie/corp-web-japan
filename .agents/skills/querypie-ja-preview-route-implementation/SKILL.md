---
name: querypie-ja-preview-route-implementation
description: Implement a new local `/t/**` preview route in corp-web-japan for a page sourced from querypie.com/ja or another upstream marketing page, once the target shape is already settled.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [corp-web-japan, migration, preview, static-page, nextjs, route-local-authoring]
---

# Implement a new local `/t/**` preview route for a QueryPie Japan page

Use this skill when the target page shape is already settled and you are creating the first local preview route.

It is the implementation phase of the QueryPie Japan migration stack.
It tells you how to place the route under `/t/**`, where to put assets, how `page.tsx` should read, and how preview metadata should be set.

It is not the higher-level source-of-truth investigation skill for QueryPie Japan pages.
When the source page is specifically under `querypie.com/ja/**` and correct implementation requires triangulating `../corp-web-contents`, `../corp-web-app`, and the live shipped page, load `querypie-ja-source-triangulation` first and then use this skill as the narrower implementation rulebook.

Typical targets:
- upstream QueryPie Japan pages such as `https://www.querypie.com/ja/...`
- external campaign / marketing pages that should be recreated locally before public rollout
- pages that should be reviewable on a non-production preview URI before replacing an existing redirect or public route

This skill is based on the preview-page migration pattern used in PR #182 (`feat: add /t/services preview pages`).

Important repo-local note:
- initial preview-route creation and later live-parity completion are different phases
- if an existing `/t/*` page already exists but still uses placeholder preview-only copy or a structurally simplified layout, do not treat this skill alone as sufficient; also load any narrower repo-local follow-up skill that captures the page-family-specific parity rules
- for `/t/services/*`, use `.agents/skills/querypie-ja-preview-route-parity/SKILL.md`

## Mandatory references

Load and follow these before authoring:
- `.agents/skills/static-page-route-local-authoring/SKILL.md`
- `.agents/skills/querypie-preview-root-rem-parity/SKILL.md`
- `docs/code-location-conventions.md`

Why:
- `static-page-route-local-authoring` defines how `page.tsx` should stay readable and route-local
- `querypie-preview-root-rem-parity` explains how to preserve visual parity when the source QueryPie page uses a 15px html root but corp-web-japan keeps a 16px root
- `docs/code-location-conventions.md` defines the repo's preferred code placement rules and the stronger exception rule for static marketing pages

Do not treat these as optional background reading. This skill assumes their rules are active.

## Goal

Create a local preview implementation that:
- lives under a `/t/...` route
- keeps the real marketing copy and section order primarily in `page.tsx`
- uses route-aligned static assets under `public/...`
- is safe to review without exposing the page as an indexed public canonical page yet
- does not silently replace an existing production redirect or live route unless the user explicitly asks for rollout

## When to use this skill

Use it when:
- the user asks to migrate a page from `querypie.com/ja` into this repo
- the user asks to migrate an external marketing page into this repo
- the user wants a preview implementation first, usually on `/t/...`
- the content is primarily static marketing content rather than CMS/data-backed application logic
- the main question is implementation shape, preview routing, asset placement, and route-local authoring

Load `querypie-ja-source-triangulation` first instead when:
- the source page is under `https://www.querypie.com/ja/**`
- you need `../corp-web-contents` as the authored-copy source of truth
- you need `../corp-web-app` to recover behavior contracts, selectors, helper logic, or route semantics
- you need to compare against the live shipped page before deciding whether a stale PR branch can be preserved or must be rewritten on latest main

Do not use it for:
- blog / whitepaper MDX posting work
- CMS-backed feature work unless explicitly requested
- backend-heavy routes where the main task is API or form-processing logic rather than page migration
- source-of-truth disputes where the hard part is reconciling authored copy vs `corp-web-app` behavior vs live page output; that belongs to `querypie-ja-source-triangulation`

## Mandatory repo workflow

1. Start from the latest `origin/main`.
2. Use a git worktree, not the main checkout.
3. Do not plan from stale local files when the page area may have changed recently.
4. Do not start a local dev server unless the user explicitly asks.
5. Rebase on the latest `origin/main` again before push / PR update.

## Core preview-route convention

The preview URI must be implemented as an App Router page under `src/app/t/**/page.tsx`.

Mapping rule:
- file path `src/app/t/<segments>/page.tsx`
- serves URL `/t/<segments>`

Examples:
- preview URL `/t/about-us` -> `src/app/t/about-us/page.tsx`
- preview URL `/t/certifications` -> `src/app/t/certifications/page.tsx`
- preview URL `/t/services/aip` -> `src/app/t/services/aip/page.tsx`
- preview URL `/t/path/page` -> `src/app/t/path/page/page.tsx`

Important clarification:
- the URL is `/t/...`
- the filesystem shape always ends with `/page.tsx`
- do not confuse the filesystem `.../page.tsx` suffix with an extra visible `/page` URL segment unless the intended route really is `/t/path/page`

## Path-selection rule

When migrating an upstream public path, mirror the intended public route shape beneath `/t`.

Examples:
- intended future public route `/services/aip` -> preview route `/t/services/aip`
- intended future public route `/about-us` -> preview route `/t/about-us`
- intended future public route `/solutions/foo` -> preview route `/t/solutions/foo`

This keeps preview review intuitive and makes later rollout simpler.

## Asset placement rule

Keep page-specific static assets route-aligned under `public/<route-family>/...`, not under `public/t/...` and not under generic `public/assets/...`.

This is a critical convention.

Examples confirmed in this repo:
- `src/app/t/about-us/page.tsx` uses assets under `public/about-us/...`
- PR #182 preview pages under `src/app/t/services/**/page.tsx` use assets under `public/services/...`
- `src/app/t/certifications/page.tsx` uses assets under `public/certifications/...`

Rules:
- preview page `/t/about-us` -> page-specific assets under `public/about-us/...`
- preview page `/t/services/aip` -> page-specific assets under `public/services/aip/...`
- preview page `/t/path/page` -> page-specific assets under `public/path/page/...` when those assets belong only to that page
- shared family assets may stay under `public/<family>/...` if they are genuinely shared by several sibling pages in that family
- do not create new page-specific files under `public/assets/...`
- do not create a mirrored `public/t/...` asset tree just because the preview route starts with `/t`

Reason:
- the asset root should follow the intended real content family, not the temporary preview prefix
- this keeps rollout, auditing, and later cleanup straightforward

## page.tsx authoring rule

For static marketing migrations, `page.tsx` is the main authoring surface.

Important guardrail:
- this rule is for **static marketing migrations** and must not be misapplied to widget / application-contract pages
- if the upstream page is driven by tabs, visibility gates, comparison tables, query-string state, toggles, or a compound-component contract, do not redesign it into a new local data API just to make it look more route-local
- preserve the upstream authoring model first; only move copy/data into route-local literals when that move does not change the upstream component boundary
- if upstream already authors the page directly in JSX with compound components, prefer keeping that JSX/compound shape locally rather than converting it into `const cards = [...]`, `const groups = [...]`, or `products={[...]}` props for a new section renderer

You must follow the route-local authoring direction from `static-page-route-local-authoring` and `docs/code-location-conventions.md`:
- keep the page primarily understandable from its own `page.tsx`
- put the real marketing copy, section order, and page-specific structure directly in `page.tsx`
- prefer direct JSX authoring for the real copy
- keep only small repeated arrays local when they materially improve readability
- keep only clearly reusable UI primitives or isolated interactive helpers extracted

Good extracted pieces:
- `SiteHeader`
- `SiteFooter`
- small shared animation/presentation helpers such as `RevealOnScroll`
- clearly shared primitive or utility components

Bad extracted pieces:
- a giant page-specific content object that hides the full page structure
- a page-specific wrapper that turns `page.tsx` into a thin shell for a static marketing page
- moving the old content registry into top-level constants without making the route materially easier to read
- building a fresh local section API that reinterprets an upstream widget page's existing compound-component contract

Large-document exception:
- this skill still prefers route-local readability, but do not read it as "every migrated page body must be fully inlined into `page.tsx` no matter what"
- if the page is a very large legal/policy document, it can be better to keep the route self-contained under `src/app/t/<route>/...` and let `page.tsx` render an adjacent route-local source file
- in that case, `page.tsx` should still own metadata, the page shell, selector/CTA composition, and the rendering call site
- avoid broad generic indirection such as repo-wide `src/content/legal-preview/**` plus `src/lib/legal-preview/**` when the real goal is a reviewable one-page preview migration
- important legal-page pitfall: do not automatically reuse publication/article MDX renderers or shared article body class stacks for legal pages just because the source is long-form text
- first inspect the live page's actual heading hierarchy and typography contract
- if the source uses route-local JSX wrappers plus markdown headings (for example `StaticH1` with `#` and `##` inside the adjacent MDX file), map only the needed components route-locally so the legal page keeps its real semantic levels and spacing
- in practice, broad publication helpers can flatten the hierarchy or apply article-specific heading sizes (`h1`/`h2`/`h3`) that visibly diverge from the live legal page
- prefer a route-local legal body class and explicit heading mapping over `publicationBodyClassName` / `buildPublicationMdxComponents()` when those shared article helpers do not match the live legal contract
- additional route-local ownership rule for adjacent legal MDX files: if the imported MDX still contains outer layout/title wrappers such as `Box`, `CenterSection`, or `StaticH1`, remove those wrappers from the MDX body and move that responsibility into `page.tsx`
- preferred final split for legal previews with adjacent MDX:
  - `page.tsx` owns the page title, centering/max-width wrapper, top spacing, and the render call site
  - the adjacent MDX file owns only the legal body content and markdown heading structure
- preferred adjacent-source naming for these route-local legal pages:
  - use `src/app/t/<route>/content.mdx` as the default route-adjacent source filename
  - avoid verbose page-specific names like `eula-content.mdx` when the file already lives inside the dedicated route directory
  - keep the route subtree readable so reviewers can immediately infer that `page.tsx` renders `content.mdx`
- do not keep upstream layout wrappers inside the MDX file just because they existed in `corp-web-contents`; in this repo that hides page ownership and makes the route fail the intended route-local authoring standard

## Recommended implementation shape

A typical static preview page in this repo should look conceptually like this:
- `export const metadata: Metadata = { ... }`
- small local arrays or helper literals if needed for cards / steps / logos
- `export default function <PageName>() { return (...) }`
- direct composition with `SiteHeader`, page sections, and `SiteFooter`

Common imports seen in aligned pages:
- `import type { Metadata } from "next";`
- `import Image from "next/image";`
- `import Link from "next/link";`
- `import { SiteHeader } from "@/components/layout/site-header";`
- `import { SiteFooter } from "@/components/layout/site-footer";`
- optional small shared helpers such as `RevealOnScroll`

## Preview metadata rule

Preview pages should be explicitly non-indexed.

Default metadata expectations:
- set `alternates.canonical` to the preview route itself, e.g. `"/t/services/aip"`
- set `robots.index = false`
- set `robots.follow = false`

Why:
- the page is reviewable and deployable without being treated as a launch-ready canonical public route
- this matches the current repo pattern for preview pages such as `/t/about-us`, `/t/certifications`, and PR #182 `/t/services/*`

## Source gathering workflow

Before editing, gather:
- the source URL to migrate
- the intended preview route
- the intended eventual public route, if known
- whether the source is upstream QueryPie Japan or another external site
- all page sections, headings, CTA targets, and media assets to preserve
- whether any existing local public route or redirect already occupies that path

For upstream / external migration, inspect:
- headline / hero structure
- section ordering
- card / list / feature grouping
- CTA destinations
- image and illustration files
- whether the page is mostly static or contains application logic that should not be copied as-is
- the source page `html` root font size and whether the typography/spacing is driven by rem-based tokens

Important parity rule for QueryPie page imports:
- when the source page comes from `querypie.com/ja/**` or `querypie.com/en/**`, do not blindly copy source computed px values into corp-web-japan
- first determine whether the source page is rendering under a 15px root rem environment
- if corp-web-japan keeps the standard 16px root, preserve the source token/design intent and convert the values for the 16px-root preview environment
- use `.agents/skills/querypie-preview-root-rem-parity/SKILL.md` for the exact calculation workflow

## Existing-route safety rule

If an existing public route already exists at the non-`/t` path, do not silently replace it during preview migration.

Preferred pattern, as seen in PR #182:
- keep or preserve the existing production-facing redirect / route behavior
- add the local preview page separately under `/t/...`
- add the rollout or public-route swap only when the user explicitly asks for that step

Examples:
- existing `src/app/services/aip/route.ts` may keep redirect behavior
- preview implementation lives separately at `src/app/t/services/aip/page.tsx`

Additional follow-up rule learned from service-page parity work:
- an existing preview route may still need a later parity pass if it was first implemented as a placeholder or simplified surface
- signals include `Preview Service` labels, generic numbered cards, preview-only explanatory copy, missing hero video, missing CTA restoration, or a flat card grid replacing the live page's alternating/interactive structure
- in that case, create a follow-up PR from latest `origin/main` and rebuild the page toward live parity rather than preserving the placeholder structure just because the route already exists

This separation is especially important when the current public path still intentionally redirects upstream.

## Migration workflow

### 1. Inspect the latest local examples

Read these first:
- `docs/code-location-conventions.md`
- `.agents/skills/static-page-route-local-authoring/SKILL.md`
- one or more aligned preview examples such as:
  - `src/app/t/about-us/page.tsx`
  - `src/app/t/certifications/page.tsx`
- if relevant, PR #182 preview pages:
  - `src/app/t/services/aip/page.tsx`
  - `src/app/t/services/acp/page.tsx`
  - `src/app/t/services/fde/page.tsx`

### 2. Choose the preview path and file path

Decide the exact preview URI first, then create the matching route file.

Examples:
- `/t/services/acp` -> `src/app/t/services/acp/page.tsx`
- `/t/path/page` -> `src/app/t/path/page/page.tsx`

### 3. Gather and place assets

Download or copy the required page-specific assets into a route-aligned public root.

Examples:
- `public/services/acp/...`
- `public/about-us/...`
- `public/path/page/...`

Use stable descriptive filenames.
Keep all page-specific media for the same page together.

### 4. Author the page in route-local style

Implement the page directly in `page.tsx`.

Guidance:
- author the main copy in JSX
- keep section order visible in the route file
- keep repeated card data small and local
- avoid a page-specific data registry under `src/content/**` unless the content model truly requires it
- avoid a page-specific `*Sections` wrapper for static page migration

Important scope boundary:
- this skill tells you how to implement the preview route once you already know the correct content and behavior
- it does not by itself decide whether an existing PR branch is stale, whether the live page contradicts an older draft implementation, or whether `corp-web-app` semantics overrule a local refactor idea
- if those questions matter, switch up one level to `querypie-ja-source-triangulation`

### 5. Add metadata and safe preview semantics

At minimum:
- title
- description
- canonical preview path under `/t/...`
- `robots: { index: false, follow: false }`

### 6. Preserve or inspect existing public routing separately

If the non-preview route already exists:
- inspect `src/app/<path>/page.tsx` or `src/app/<path>/route.ts`
- do not change it unless the user explicitly requested rollout
- if needed, document in the PR or commit scope that preview migration is intentionally separate from public route replacement

### 7. Add verification

Use the lightest meaningful checks first.

Recommended checks for this migration class:
- a targeted node test that confirms:
  - the preview page file exists
  - metadata exports exist
  - canonical points at the preview path
  - `robots.index` and `robots.follow` are both false
  - `SiteHeader` and `SiteFooter` are present when expected
- broader tests only if the change touches shared navigation or routing

PR #182-style targeted test intent:
- preview page exists
- preview page is noindex
- preview page canonical is under `/t/...`
- existing non-preview redirect route remains unchanged when that separation is intended

### 8. Rebase and finish

Before finalizing:
- `git fetch origin --prune`
- `git rebase origin/main`
- rerun the relevant targeted checks if needed
- commit with an English message
- push and open/update the PR if the user requested full PR workflow

## Common pitfalls

- authoring the preview page under the public route instead of under `/t/...`
- confusing `src/app/t/path/page.tsx` with a visible `/t/path/page` route when the intended URL was only `/t/path`
- putting preview-only assets under `public/t/...`
- putting page-specific assets under generic `public/assets/...`
- hiding the migrated page behind a giant content object or page-specific wrapper
- changing an existing public redirect / route during a preview-only migration without explicit approval
- forgetting `robots.index = false` and `robots.follow = false`
- omitting the preview canonical path
- planning from stale local main instead of latest `origin/main`

## Minimal execution summary

When asked to migrate a `querypie.com/ja` or external page into this website as a preview page:
1. start from latest `origin/main` in a worktree
2. if the source is specifically `querypie.com/ja/**` and correctness depends on source triangulation, load `querypie-ja-source-triangulation` first
3. load `static-page-route-local-authoring` and read `docs/code-location-conventions.md`
4. choose the preview URI under `/t/...`
5. create the matching `src/app/t/**/page.tsx`
6. place page-specific assets under route-aligned `public/**`, not `public/t/**` and not `public/assets/**`
7. author the real copy directly in `page.tsx` or, for very large legal documents, keep the route self-contained with an adjacent route-local source file
8. mark the preview page as noindex with canonical `/t/...`
9. keep existing non-preview public redirects/routes separate unless rollout was explicitly requested
10. add the lightest targeted regression checks
11. rebase and finish the git workflow
