---
name: introduction-deck-posting
description: Thin wrapper for introduction-deck MDX work in corp-web-japan. Load the shared mdx-publication-operations skill first, then apply the introduction-deck-specific paths, fields, and limits.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [introduction-deck, mdx, content, publishing, corp-web-japan]
---

# Introduction deck MDX wrapper

Always load `.agents/skills/mdx-publication-operations/SKILL.md` first.
This wrapper only adds the introduction-deck-specific contract.

## Use this for
- add an introduction deck post
- edit an existing `src/content/introduction-deck/*.mdx` file
- apply resource-family gating when needed

## Introduction deck-specific contract
- Content root: `src/content/introduction-deck/*.mdx`
- Canonical detail route: `/introduction-deck/:id/:slug`
- List route: `/introduction-deck`
- Asset root: `public/introduction-deck/<id>/...`
- Repository: `src/lib/resources/introduction-deck-publications.ts`
- Post loader: `src/lib/resources/introduction-deck-post-loader.ts`
- Resource-only fields: `date?`, `gated?`, `relatedItems?`

## Important limit
- Do not assume `hidden` or `redirectUrl` support for this family in the current code.

## Verification
```bash
npm run test:ci
```
