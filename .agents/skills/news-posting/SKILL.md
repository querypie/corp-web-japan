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
- Optional shared extras also supported: `author`, `hidden`, `redirectUrl`

## News-specific expectations
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
