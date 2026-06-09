---
name: news-posting
description: Thin wrapper for news MDX work in corp-web-japan. Load the shared mdx-publication-operations skill first, then apply the news-specific paths, fields, and checks.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [news, mdx, content, publishing, corp-web-japan]
---

# News MDX wrapper

Always load `.agents/skills/mdx-publication-operations/SKILL.md` first.
This wrapper only adds the news-specific contract.

## Use this for
- add a news post
- edit an existing `src/content/news/*.mdx` file
- hide a news item from `/news`
- create a redirect-backed news shadow record

## News-specific contract
- Content root: `src/content/news/*.mdx`
- Canonical detail route: `/news/:id/:slug`
- ID-only route: `/news/:id`
- List route: `/news`
- Asset root: `public/news/<id>/...`
- Records loader: `src/lib/publications/news/records.ts`
- Detail loader: `src/lib/publications/news/get-post.ts`
- Related field: `relatedIds`
- News-only frontmatter: `sourceLabel`
- Optional shared extras also supported: `hidden`, `redirectUrl`

## News-specific expectations
- Do not add `author` to news frontmatter. News posts should not show author
  information.
- Do not use `author: "querypie"` as a fallback for news; the `querypie`
  default-author pattern is only for blog, whitepaper, and event posts.
- News `heroImageSrc` is used for list cards and detail-page hero rendering; keep it route-aligned and `.png` by default.
- Detail metadata resolves the effective Open Graph/Twitter preview image as `openGraphImageSrc ?? heroImageSrc`.
- Use `openGraphImageSrc` when `heroImageSrc` is SVG or another non-PNG asset, or when the social preview should use a separate PNG. The referenced file must exist under `public/news/<id>/...` or another supported route-aligned news path.
- `openGraphImageSrc` may be shared across locales (`/news/<id>/thumbnail.png`) or locale-specific (`/news/<id>/thumbnail.ko.png` or `/ko/news/<id>/thumbnail.png`) when the referenced `public/**` file exists.
- `sourceLabel` is optional.
- If omitted, the current list defaults to `メディア掲載` when `redirectUrl` exists, otherwise `公式発表`.
- Use `redirectUrl` when the local news record should preserve a detail surface but human visitors should be sent to an upstream/media destination.

## Verification
```bash
npm run test -- tests/news-seo-and-sitemap.test.mjs
```

For broader news routing or redirect changes, also use:
```bash
npm run test:ci
```
