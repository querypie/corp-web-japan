---
name: manuals-posting
description: Thin wrapper for manuals MDX work in corp-web-japan. Load the shared mdx-publication-operations skill first, then apply the manuals-specific paths, fields, and limits.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [manuals, mdx, content, publishing, corp-web-japan]
---

# Manuals MDX wrapper

Always load `.agents/skills/mdx-publication-operations/SKILL.md` first.
This wrapper only adds the manuals-specific contract.

## Use this for
- add a manual post
- edit an existing `src/content/manuals/*.mdx` file
- apply resource-family gating when needed

## Manuals-specific contract
- Content root: `src/content/manuals/*.mdx`
- Canonical detail route: `/manuals/:id/:slug`
- List route: `/manuals`
- Asset root: `public/manuals/<id>/...`
- Repository: `src/lib/resources/manual-publications.ts`
- Post loader: `src/lib/resources/manual-post-loader.ts`
- Resource-supported optional fields: `date?`, `author?`, `gated?`, `relatedItems?`

## Important limit
- Do not assume `hidden` or `redirectUrl` support for this family in the current code.

## Verification
```bash
npm run test:ci
```
