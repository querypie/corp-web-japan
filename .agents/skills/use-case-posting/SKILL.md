---
name: use-case-posting
description: Thin wrapper for use-case MDX work in corp-web-japan. Load the shared mdx-publication-operations skill first, then apply the use-case-specific paths, fields, and checks.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [use-case, mdx, content, publishing, corp-web-japan]
---

# Use-case MDX wrapper

Always load `.agents/skills/mdx-publication-operations/SKILL.md` first.
This wrapper only adds the use-case-specific contract.

## Use this for
- add a use-case post
- edit an existing `src/content/use-cases/*.mdx` file
- hide a use-case from `/use-cases`
- create a redirect-backed use-case shadow record

## Use-case-specific contract
- Content root: `src/content/use-cases/*.mdx`
- Canonical detail route: `/use-cases/:id/:slug`
- ID-only route: `/use-cases/:id`
- List route: `/use-cases`
- Asset root: `public/use-cases/<id>/...`
- Records loader: `src/lib/publications/use-cases/records.ts`
- Detail loader: `src/lib/publications/use-cases/get-post.ts`
- Related field: `relatedIds`
- Supported optional extras: `hidden`, `redirectUrl`

## Use-case-specific expectations
- The shared Open Graph preview image rule applies to use cases: keep the effective preview image route-aligned and `.png`, never SVG.
- Do not add `author` to use-case frontmatter. Author display is limited to
  blog, whitepaper, and event posts.

## Verification
```bash
npm run test -- tests/use-cases-mdx-routing-and-preview.test.mjs
npm run test -- tests/use-cases-imported-ja-corpus.test.mjs
```
