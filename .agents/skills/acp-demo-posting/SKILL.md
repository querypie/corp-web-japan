---
name: acp-demo-posting
description: Thin wrapper for ACP demo MDX work in corp-web-japan. Load the shared mdx-publication-operations skill first, then apply the ACP-demo-specific paths, fields, and checks.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [acp-demo, mdx, content, publishing, corp-web-japan]
---

# ACP demo MDX wrapper

Always load `.agents/skills/mdx-publication-operations/SKILL.md` first.
This wrapper only adds the ACP-demo-specific contract.

## Use this for
- add an ACP demo post
- edit an existing `src/content/demo/acp/*.mdx` file
- hide an ACP demo from `/demo/acp`
- create a redirect-backed ACP demo shadow record

## ACP demo-specific contract
- Content root: `src/content/demo/acp/*.mdx`
- Canonical detail route: `/demo/acp/:id/:slug`
- ID-only route: `/demo/acp/:id`
- List route: `/demo/acp`
- Asset root: `public/demo/acp/<id>/...`
- Records loader: `src/lib/publications/demo/acp/records.ts`
- Detail loader: `src/lib/publications/demo/acp/get-post.ts`
- Related field: `relatedIds`
- Supported optional extras: `author`, `hidden`, `redirectUrl`

## Verification
```bash
npm run test -- tests/acp-demo-mdx-routing-and-preview.test.mjs
npm run test -- tests/acp-demo-imported-ja-corpus.test.mjs
```
