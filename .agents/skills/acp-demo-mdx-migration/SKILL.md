---
name: acp-demo-mdx-migration
description: Migrate corp-web-japan ACP demo content from ../corp-web-contents into the local MDX-backed publication system with /t/demo/acp preview and /demo/acp/:id/:slug canonical detail routes.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [corp-web-japan, acp-demo, mdx, migration, publications, nextjs]
---

# Migrate ACP demo entries into the local MDX publication system in corp-web-japan

Use this skill when the task is to move ACP feature/demo content from `../corp-web-contents/pages/features/demo/acp-features/**` into the local MDX-backed publication architecture in this repository.

This skill is based on the pattern implemented in PR #192.

## Goal

Implement local ACP demo content so that:
- preview list lives at `/t/demo/acp`
- canonical detail routes live at `/demo/acp/:id/:slug`
- `/demo/acp/:id` redirects to the canonical slug route
- content source lives under `src/content/demo/acp/*.mdx`
- thumbnails live under `public/demo/acp/<id>/thumbnail.png`
- the loader / records / tests follow the same publication architecture as blog, whitepaper, event, news, and use-case
- the existing `/demo/acp` root redirect route remains untouched unless the user explicitly asks to replace it

## Source of truth

Source corpus:
- `../corp-web-contents/pages/features/demo/acp-features/<id>/<slug>/ja/content.mdx`

Observed corpus facts from the current migration:
- current Japanese corpus count is 26 (`1` through `26`)
- all entries use `Youtube`
- entry `4` additionally uses `BlueState`, `InfoNote`, and `User`
- source thumbnails come from `../corp-web-contents/public/demo/*` and `../corp-web-contents/public/tutorial/*`
- source frontmatter currently uses legacy `category: "acp-features"` and `relatedPosts` pointing at legacy `/features/demo/acp-features/...` URLs
- current JA source frontmatter descriptions are empty strings, so local descriptions should be filled during migration

## Mandatory route and file layout

Use these paths:
- preview list page: `src/app/t/demo/acp/page.tsx`
- canonical detail page: `src/app/demo/acp/[id]/[slug]/page.tsx`
- id-only redirect page: `src/app/demo/acp/[id]/page.tsx`
- content source: `src/content/demo/acp/<id>.mdx`
- publication records: `src/content/publications/acp-demo-publication-records.ts`
- detail loader: `src/lib/publications/get-acp-demo-publication-post.ts`
- thumbnails: `public/demo/acp/<id>/thumbnail.png`

Also extend:
- `src/lib/publications/types.ts` with category `"acp-demo"`
- `src/lib/publications/get-publication-href.ts` with prefix `"acp-demo": "/demo/acp"`
- `src/app/sitemap.ts` with canonical ACP demo detail URLs
- `src/lib/publications/mdx/components.tsx` with the minimal imported corpus support for `BlueState` and `User` if they are not already present

## Required local MDX frontmatter

Each migrated ACP demo file should be normalized to this shape:

```mdx
---
id: "4"
slug: "connect-kubernetes-agent"
title: "How to Connect to Kubernetes via the QueryPie Agent"
description: "How to Connect to Kubernetes via the QueryPie Agent | QueryPie ACP demo"
date: "2024年11月29日"
heroImageSrc: "/demo/acp/4/thumbnail.png"
relatedIds:
  - "6"
  - "5"
  - "7"
---
```

Rules:
- convert source `date: "YYYY-MM-DD"` into Japanese date format like `2024年11月29日`
- convert source `relatedPosts` legacy URLs into `relatedIds`
- drop source-only fields such as `layout`, `category`, `ogImage`, `hideOgImage`, and `hideTableOfContents`
- if source `description` is blank, fill it with a minimal useful local description instead of leaving an empty string
- keep body MDX content intact unless route/asset references need rewriting

## Asset placement rule

This is mandatory:
- copy each source hero/thumbnail image into `public/demo/acp/<id>/thumbnail.png`
- do not keep migrated ACP demo thumbnails under generic `public/demo/*.png`
- do not keep migrated ACP demo thumbnails under generic `public/tutorial/*.png`
- do not introduce new demo-specific assets under generic `public/assets/...`

Why:
- the asset root should follow the final public detail route family
- it matches the repo’s route-aligned publication asset convention

## Loader / records implementation pattern

Follow the event/news/use-case publication pattern.

### Records file expectations

`src/content/publications/acp-demo-publication-records.ts` should:
- scan `src/content/demo/acp/*.mdx`
- parse frontmatter with YAML
- expose:
  - `acpDemoPublicationRecords`
  - `listAcpDemoPublicationItems()`
  - `listAcpDemoPublicationParams()`
  - `listAcpDemoPublicationIds()`
  - `getAcpDemoPublicationRecord(id)`
- build list items with:
  - `href: getPublicationHref("acp-demo", record.id, record.slug)`
  - `badge: "ACP機能"`

### Loader file expectations

`src/lib/publications/get-acp-demo-publication-post.ts` should:
- read the MDX source file
- render it through `renderPublicationMdx()`
- derive TOC with `extractHeadingsFromMdx()`
- resolve optional registered author data via `resolveArticleAuthors()` if author exists later
- build related items from `relatedIds`
- expose:
  - `getAcpDemoPublicationPost(id)`
  - `getAcpDemoPublicationHref(id, slug)`
  - re-exports for `getAcpDemoPublicationRecord`, `listAcpDemoPublicationIds`, `listAcpDemoPublicationParams`

## MDX component compatibility

Current imported JA corpus needs at least:
- `Youtube`
- `InfoNote`
- `BlueState`
- `User`

If `BlueState` and `User` are missing from `src/lib/publications/mdx/components.tsx`, add the smallest reasonable presentational implementations that preserve readability without overfitting to old legacy styling.

## Route behavior

### `/t/demo/acp`

Implement as a noindex preview list page.

Metadata expectations:
- `canonical: "/t/demo/acp"`
- `robots.index = false`
- `robots.follow = false`

Use:
- `SiteHeader`
- `SiteFooter`
- `ResourceListPage`
- `listAcpDemoPublicationItems()`

Set:
- title to `ACP機能`
- `activeCategory="acp-demo"`

### `/demo/acp/:id/:slug`

Implement like blog/whitepaper/event canonical detail pages:
- load by `id`
- redirect mismatched slug to canonical slug
- render `PublicationPostPage`
- set canonical metadata using `absoluteUrl(getAcpDemoPublicationHref(...))`
- set `robots.index = false` and `robots.follow = false`

### `/demo/acp/:id`

Implement id-only redirect:
- load record by `id`
- redirect to `getAcpDemoPublicationHref(id, record.slug)`
- `notFound()` only when the `id` itself does not resolve

### `/demo/acp`

Do not replace the existing redirect route in a migration-only PR unless the user explicitly asks for public list-route rollout.

## Recommended migration workflow

1. Start from latest `origin/main` in a fresh worktree.
2. Inspect current publication examples:
   - `src/app/t/events/page.tsx`
   - `src/app/events/[id]/[slug]/page.tsx`
   - `src/content/publications/event-publication-records.ts`
   - `src/lib/publications/get-event-publication-post.ts`
   - `src/content/publications/use-case-publication-records.ts`
3. Inspect the source corpus under `../corp-web-contents/pages/features/demo/acp-features/**/ja/content.mdx`.
4. Inventory source asset paths from `ogImage`.
5. Generate or author normalized `src/content/demo/acp/<id>.mdx` files.
6. Copy thumbnails into `public/demo/acp/<id>/thumbnail.png`.
7. Add the records file, loader file, preview page, canonical detail page, id redirect page, and sitemap wiring.
8. Add focused tests for corpus completeness and route architecture.
9. Rebase on latest `origin/main` again before push.

## Verification

Prefer the lightest meaningful verification first.

### Source-based regression tests

Add and run focused tests like:
- `tests/acp-demo-imported-ja-corpus.test.mjs`
- `tests/acp-demo-mdx-routing-and-preview.test.mjs`

The tests should verify:
- expected local MDX ids exist
- `heroImageSrc` uses `/demo/acp/<id>/thumbnail.png`
- legacy asset paths like `public/demo/...` and `public/tutorial/...` are gone from migrated MDX
- legacy `/features/demo/acp-features/...` references are gone from migrated MDX
- preview page uses `listAcpDemoPublicationItems()` and is noindex
- canonical detail page loads by `id` and redirects mismatched slugs
- id-only route redirects to canonical detail
- `PublicationCategory` and href prefix include `"acp-demo"`
- MDX components include `BlueState` and `User`

### Type verification

If repo-root `node_modules` already exists, this fast check is useful from the worktree:
- `../../node_modules/.bin/tsc --noEmit`

## Common pitfalls

- forgetting to add the new publication category `"acp-demo"`
- forgetting to add `"acp-demo": "/demo/acp"` to href generation
- replacing the existing `/demo/acp` redirect when the user only asked for preview/detail migration
- keeping source `ogImage` paths instead of copying to `public/demo/acp/<id>/thumbnail.png`
- leaving `relatedPosts` legacy URLs in frontmatter instead of normalizing to `relatedIds`
- leaving all blank descriptions empty instead of filling a local fallback description
- failing to add `BlueState` or `User` support before rendering imported MDX

## Minimal execution summary

When asked to migrate corp-web-japan ACP demos into local MDX routes:
1. use a fresh worktree from latest `origin/main`
2. source from `../corp-web-contents/pages/features/demo/acp-features/**/ja/content.mdx`
3. create `src/content/demo/acp/<id>.mdx` with normalized frontmatter
4. copy thumbnails to `public/demo/acp/<id>/thumbnail.png`
5. add records and loader files following the event/news/use-case publication pattern
6. add `/t/demo/acp`, `/demo/acp/:id/:slug`, and `/demo/acp/:id`
7. extend publication category/href wiring, sitemap, and minimal MDX component compatibility
8. verify with focused source-based tests first
