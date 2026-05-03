---
name: page-migration-preview-route
description: Migrate a querypie.com/ja page or another external marketing page into a local corp-web-japan preview route under /t/* with route-local authoring and route-aligned assets.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [corp-web-japan, migration, preview, static-page, nextjs, route-local-authoring]
---

# Migrate an upstream or external page into a local preview route in corp-web-japan

Use this skill when the user wants to migrate a page that currently lives on `querypie.com/ja/**` or another external site into this repository first as a local preview page.

Typical targets:
- upstream QueryPie Japan pages such as `https://www.querypie.com/ja/...`
- external campaign / marketing pages that should be recreated locally before public rollout
- pages that should be reviewable on a non-production preview URI before replacing an existing redirect or public route

This skill is based on the preview-page migration pattern used in PR #182 (`feat: add /t/services preview pages`).

## Mandatory references

Load and follow these before authoring:
- `.agents/skills/static-page-route-local-authoring-refactor/SKILL.md`
- `docs/code-location-conventions.md`

Why:
- `static-page-route-local-authoring-refactor` defines how `page.tsx` should stay readable and route-local
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

Do not use it for:
- blog / whitepaper MDX posting work
- CMS-backed feature work unless explicitly requested
- backend-heavy routes where the main task is API or form-processing logic rather than page migration

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

You must follow the route-local authoring direction from `static-page-route-local-authoring-refactor` and `docs/code-location-conventions.md`:
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

## Existing-route safety rule

If an existing public route already exists at the non-`/t` path, do not silently replace it during preview migration.

Preferred pattern, as seen in PR #182:
- keep or preserve the existing production-facing redirect / route behavior
- add the local preview page separately under `/t/...`
- add the rollout or public-route swap only when the user explicitly asks for that step

Examples:
- existing `src/app/services/aip/route.ts` may keep redirect behavior
- preview implementation lives separately at `src/app/t/services/aip/page.tsx`

This separation is especially important when the current public path still intentionally redirects upstream.

## Migration workflow

### 1. Inspect the latest local examples

Read these first:
- `docs/code-location-conventions.md`
- `.agents/skills/static-page-route-local-authoring-refactor/SKILL.md`
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
2. load `static-page-route-local-authoring-refactor` and read `docs/code-location-conventions.md`
3. choose the preview URI under `/t/...`
4. create the matching `src/app/t/**/page.tsx`
5. place page-specific assets under route-aligned `public/**`, not `public/t/**` and not `public/assets/**`
6. author the real copy directly in `page.tsx`
7. mark the preview page as noindex with canonical `/t/...`
8. keep existing non-preview public redirects/routes separate unless rollout was explicitly requested
9. add the lightest targeted regression checks
10. rebase and finish the git workflow
