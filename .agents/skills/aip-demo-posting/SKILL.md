---
name: aip-demo-posting
description: Thin wrapper for AIP demo MDX work in corp-web-japan. Load the shared mdx-publication-operations skill first, then apply the AIP-demo-specific paths, fields, and checks.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [aip-demo, mdx, content, publishing, corp-web-japan]
---

# AIP demo MDX wrapper

Always load `.agents/skills/mdx-publication-operations/SKILL.md` first.
This wrapper only adds the AIP-demo-specific contract.

## Use this for
- add an AIP demo post
- edit an existing `src/content/demo/aip/*.mdx` file
- hide an AIP demo from `/demo/aip`
- create a redirect-backed AIP demo shadow record

## AIP demo-specific contract
- Content root: `src/content/demo/aip/*.mdx`
- Canonical detail route: `/demo/aip/:id/:slug`
- ID-only route: `/demo/aip/:id`
- List route: `/demo/aip`
- Asset root: `public/demo/aip/<id>/...`
- Records loader: `src/lib/publications/demo/aip/records.ts`
- Detail loader: `src/lib/publications/demo/aip/get-post.ts`
- Related field: `relatedIds`
- Supported optional extras: `author`, `hidden`, `redirectUrl`

## AIP demo-specific expectations
- The shared Open Graph preview image rule applies to AIP demo posts: keep the effective preview image route-aligned and `.png`, never SVG.

## Verification
```bash
npm run test -- tests/aip-demo-mdx-routing-and-preview.test.mjs
npm run test -- tests/aip-demo-imported-ja-corpus.test.mjs
```
