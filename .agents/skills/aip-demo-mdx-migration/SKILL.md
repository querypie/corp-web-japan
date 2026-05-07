---
name: aip-demo-mdx-migration
description: Migrate corp-web-japan AIP demo content from ../corp-web-contents into the local MDX-backed publication system with /t/demo/aip preview and /demo/aip/:id/:slug canonical detail routes.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [corp-web-japan, aip-demo, mdx, migration, publications, nextjs]
---

# Migrate AIP demo entries into the local MDX publication system in corp-web-japan

Use this skill when the task is to move AIP feature/demo content from `../corp-web-contents/pages/features/demo/aip-features/**` into the local MDX-backed publication architecture in this repository.

This skill is based on the pattern implemented in PR #189.

## Goal

Implement local AIP demo content so that:
- preview list lives at `/t/demo/aip`
- canonical detail routes live at `/demo/aip/:id/:slug`
- `/demo/aip/:id` redirects to the canonical slug route
- content source lives under `src/content/demo/aip/*.mdx`
- thumbnails live under `public/demo/aip/<id>/thumbnail.png`
- the loader / records / tests follow the same publication architecture as blog, whitepaper, event, news, and use-case
- the existing `/demo/aip` root redirect route remains untouched unless the user explicitly asks to replace it

## Source of truth

Source corpus:
- `../corp-web-contents/pages/features/demo/aip-features/<id>/<slug>/ja/content.mdx`

Observed corpus facts from the current migration:
- current Japanese corpus count is 1 (`1/google-oauth-demo`)
- the current JA MDX entry uses the `Youtube` MDX component
- the current hero/thumbnail asset comes from `../corp-web-contents/public/demo/de-thumb-google-oauth.png`
- source frontmatter uses legacy `category: "aip-features"` and `relatedPosts` pointing at legacy `/features/demo/use-cases/...` URLs

## Mandatory route and file layout

Use these paths:
- preview list page: `src/app/t/demo/aip/page.tsx`
- canonical detail page: `src/app/demo/aip/[id]/[slug]/page.tsx`
- id-only redirect page: `src/app/demo/aip/[id]/page.tsx`
- content source: `src/content/demo/aip/<id>-<slug>.mdx`
- publication records: `src/content/publications/aip-demo-publication-records.ts`
- detail loader: `src/lib/publications/get-aip-demo-publication-post.ts`
- thumbnails: `public/demo/aip/<id>/thumbnail.png`

Also extend:
- `src/lib/publications/types.ts` with category `"aip-demo"`
- `src/lib/publications/get-publication-href.ts` with prefix `"aip-demo": "/demo/aip"`
- `src/app/sitemap.ts` with canonical AIP demo detail URLs

## Required local MDX frontmatter

Each migrated AIP demo file should be normalized to this shape:

```mdx
---
id: "1"
slug: "google-oauth-demo"
title: "AIP Google OAuth デモ"
description: "QueryPie AIP Google OAuth デモ"
date: "2025年9月23日"
heroImageSrc: "/demo/aip/1/thumbnail.png"
relatedIds:
  - "7"
  - "11"
  - "12"
---
```

Rules:
- convert source `date: "YYYY-MM-DD"` into Japanese date format like `2025年9月23日`
- convert source `relatedPosts` legacy URLs into `relatedIds`
- drop source-only fields such as `layout`, `category`, `ogImage`, `hideOgImage`, and `hideTableOfContents`
- if source `description` is blank, fill it with a minimal useful local description instead of leaving an empty string
- keep body MDX content intact unless route/asset references need rewriting

## Asset placement rule

This is mandatory:
- copy each source hero/thumbnail image into `public/demo/aip/<id>/thumbnail.png`
- do not keep migrated AIP demo thumbnails under generic `public/demo/*.png`
- do not introduce new demo-specific assets under generic `public/assets/...`

Why:
- the asset root should follow the final public detail route family
- it matches the repo’s route-aligned publication asset convention

## Loader / records implementation pattern

Follow the event/news/use-case publication pattern.

### Records file expectations

`src/content/publications/aip-demo-publication-records.ts` should:
- scan `src/content/demo/aip/*.mdx`
- parse frontmatter with YAML
- expose:
  - `aipDemoPublicationRecords`
  - `listAipDemoPublicationItems()`
  - `listAipDemoPublicationParams()`
  - `listAipDemoPublicationIds()`
  - `getAipDemoPublicationRecord(id)`
- build list items with:
  - `href: getPublicationHref("aip-demo", record.id, record.slug)`
  - `badge: "AIP機能"`

### Loader file expectations

`src/lib/publications/get-aip-demo-publication-post.ts` should:
- read the MDX source file
- render it through `renderPublicationMdx()`
- derive TOC with `extractHeadingsFromMdx()`
- resolve optional registered author data via `resolveArticleAuthors()` if author exists later
- build related items from `relatedIds`
- expose:
  - `getAipDemoPublicationPost(id)`
  - `getAipDemoPublicationHref(id, slug)`
  - re-exports for `getAipDemoPublicationRecord`, `listAipDemoPublicationIds`, `listAipDemoPublicationParams`

## Route behavior

### `/t/demo/aip`

Implement as a noindex preview list page.

Metadata expectations:
- `canonical: "/t/demo/aip"`
- `robots.index = false`
- `robots.follow = false`

Use:
- `SiteHeader`
- `SiteFooter`
- `ResourceListPage`
- `listAipDemoPublicationItems()`

Set:
- title to `AIP機能`
- `activeCategory="aip-demo"`

### `/demo/aip/:id/:slug`

Implement like blog/whitepaper/event canonical detail pages:
- load by `id`
- redirect mismatched slug to canonical slug
- render `PublicationPostPage`
- set canonical metadata using `absoluteUrl(getAipDemoPublicationHref(...))`
- set `robots.index = false` and `robots.follow = false`

### `/demo/aip/:id`

Implement id-only redirect:
- load record by `id`
- redirect to `getAipDemoPublicationHref(id, record.slug)`
- `notFound()` only when the `id` itself does not resolve

### `/demo/aip`

Do not replace the existing redirect route in a migration-only PR unless the user explicitly asks for public list-route rollout.

## Recommended migration workflow

1. Start from latest `origin/main` in a fresh worktree.
2. Inspect current publication examples:
   - `src/app/t/events/page.tsx`
   - `src/app/events/[id]/[slug]/page.tsx`
   - `src/content/publications/event-publication-records.ts`
   - `src/lib/publications/get-event-publication-post.ts`
   - `src/content/publications/use-case-publication-records.ts`
3. Inspect the source corpus under `../corp-web-contents/pages/features/demo/aip-features/**/ja/content.mdx`.
4. Inventory source asset paths from `ogImage`.
5. Generate or author normalized `src/content/demo/aip/<id>-<slug>.mdx` files.
6. Copy thumbnails into `public/demo/aip/<id>/thumbnail.png`.
7. Add the records file, loader file, preview page, canonical detail page, id redirect page, and sitemap wiring.
8. Add focused tests for corpus completeness and route architecture.
9. Rebase on latest `origin/main` again before push.

## Verification

Prefer the lightest meaningful verification first.

### Source-based regression tests

Add and run focused tests like:
- `tests/aip-demo-imported-ja-corpus.test.mjs`
- `tests/aip-demo-mdx-routing-and-preview.test.mjs`

The tests should verify:
- expected local MDX ids exist
- `heroImageSrc` uses `/demo/aip/<id>/thumbnail.png`
- legacy asset paths like `public/demo/...` are gone from migrated MDX
- legacy `/features/demo/aip-features/...` references are gone from migrated MDX
- preview page uses `listAipDemoPublicationItems()` and is noindex
- canonical detail page loads by `id` and redirects mismatched slugs
- id-only route redirects to canonical detail
- `PublicationCategory` and href prefix include `"aip-demo"`

### Type verification

If repo-root `node_modules` already exists, this fast check is useful from the worktree:
- `../../node_modules/.bin/tsc --noEmit`

## Common pitfalls

- forgetting to add the new publication category `"aip-demo"`
- forgetting to add `"aip-demo": "/demo/aip"` to href generation
- replacing the existing `/demo/aip` redirect when the user only asked for preview/detail migration
- keeping source `ogImage` paths instead of copying to `public/demo/aip/<id>/thumbnail.png`
- leaving `relatedPosts` legacy URLs in frontmatter instead of normalizing to `relatedIds`
- leaving an empty description when the source frontmatter has `description: ""`

## Minimal execution summary

When asked to migrate corp-web-japan AIP demos into local MDX routes:
1. use a fresh worktree from latest `origin/main`
2. source from `../corp-web-contents/pages/features/demo/aip-features/**/ja/content.mdx`
3. create `src/content/demo/aip/<id>-<slug>.mdx` with normalized frontmatter
4. copy thumbnails to `public/demo/aip/<id>/thumbnail.png`
5. add records and loader files following the event/news/use-case publication pattern
6. add `/t/demo/aip`, `/demo/aip/:id/:slug`, and `/demo/aip/:id`
7. extend publication category/href wiring and sitemap
8. verify with focused source-based tests first
