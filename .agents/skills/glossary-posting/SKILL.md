---
name: glossary-posting
description: Thin wrapper for glossary MDX work in corp-web-japan. Load the shared mdx-publication-operations skill first, then apply the glossary-specific paths, fields, and limits.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [glossary, mdx, content, publishing, corp-web-japan]
---

# Glossary MDX wrapper

Always load `.agents/skills/mdx-publication-operations/SKILL.md` first.
This wrapper only adds the glossary-specific contract.

## Use this for
- add a glossary post
- edit an existing `src/content/glossary/*.mdx` file
- apply resource-family gating when needed

## Glossary-specific contract
- Content root: `src/content/glossary/*.mdx`
- Canonical detail route: `/glossary/:id/:slug`
- List route: `/glossary`
- Asset root: `public/glossary/<id>/...`
- Repository: `src/lib/resources/glossary-publications.ts`
- Post loader: `src/lib/resources/glossary-post-loader.ts`
- Resource-supported optional fields: `date?`, `author?`, `gated?`, `relatedItems?`

## Important limit
- Do not assume `hidden` or `redirectUrl` support for this family in the current code.

## Verification
```bash
npm run test:ci
```
