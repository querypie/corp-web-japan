---
name: whitepaper-posting
description: Thin wrapper for whitepaper MDX work in corp-web-japan. Load the shared mdx-publication-operations skill first, then apply the whitepaper-specific paths, fields, and checks.
version: 2.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [whitepaper, mdx, content, publishing, gating, corp-web-japan]
---

# Whitepaper MDX wrapper

Always load `.agents/skills/mdx-publication-operations/SKILL.md` first.
This wrapper only adds the whitepaper-specific contract.

## Use this for
- add a new whitepaper
- edit an existing `src/content/whitepapers/*.mdx` file
- hide a whitepaper from `/whitepapers`
- create a redirect-backed whitepaper shadow record
- apply whitepaper gating

## Whitepaper-specific contract
- Content root: `src/content/whitepapers/*.mdx`
- Canonical detail route: `/whitepapers/:id/:slug`
- ID-only route: `/whitepapers/:id`
- List route: `/whitepapers`
- Asset root: `public/whitepapers/<id>/...`
- Records loader: `src/lib/publications/whitepapers/records.ts`
- Detail loader: `src/lib/publications/whitepapers/get-post.ts`
- Related field: `relatedIds`
- Whitepaper-only frontmatter: `listDescription`, `gated`
- Optional shared extras also supported: `author`, `hidden`, `redirectUrl`

## Whitepaper-specific expectations
- Prefer setting `listDescription` explicitly.
- If `gated: true`, the body must include `<GatingCut />`.
- Keep all whitepaper-specific assets under `public/whitepapers/<id>/...`.
- Do not put new whitepaper assets under `public/assets/...`.

## Minimum workflow
1. Follow the shared MDX publication skill.
2. Inspect nearby whitepaper examples in `src/content/whitepapers/`.
3. Edit or add `src/content/whitepapers/<id>-<slug>.mdx`.
4. Keep `heroImageSrc` route-aligned, e.g. `/whitepapers/<id>/thumbnail.png`.
5. Use `listDescription` when the list-card summary should differ from `description`.
6. Use `gated: true` only with `<GatingCut />`.
7. If needed, use `hidden` and `redirectUrl` according to the shared skill.
8. Run the whitepaper checks.

## Verification
```bash
npm run test -- tests/whitepaper-canonical-slug-routing.test.mjs
npm run test -- tests/whitepaper-gating-source.test.mjs
npm run test -- tests/whitepaper-route-aligned-assets.test.mjs
```

If author data changed:
```bash
npm run test -- tests/author-profile-image-paths.test.mjs
```
