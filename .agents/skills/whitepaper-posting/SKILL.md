---
name: whitepaper-posting
description: Add a new local whitepaper posting to corp-web-japan from the current MDX-backed publication system.
version: 1.1.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [whitepaper, mdx, content, publishing, gating, corp-web-japan]
---

# Add a whitepaper posting in corp-web-japan

Use this skill when the task is to add a new whitepaper article to the local MDX-backed whitepaper system in this repository.

## What this repository currently does

- Local whitepaper content source lives in `src/content/whitepapers/*.mdx`.
- Canonical whitepaper detail routes are `/whitepapers/:id/:slug`.
- `/whitepapers/:id` must redirect to the canonical slug route.
- The detail loader is `src/lib/publications/get-whitepaper-publication-post.ts`.
- The whitepaper list source is derived from `src/content/publications/whitepapers.ts`.
- Whitepaper list items currently keep upstream `querypie.com/ja` hrefs for list-card destinations while local detail routes exist for the MDX-backed rendering flow.
- Author metadata is resolved from `src/content/authors/ja.yaml` via `src/lib/authors/resolve-authors.ts`.
- Whitepaper hero/list thumbnails now live at `/whitepapers/<id>/thumbnail.png` under `public/whitepapers/<id>/thumbnail.png`.
- In-body whitepaper figures, videos, downloadable files, and any other whitepaper-specific referenced assets should also live under `public/whitepapers/<id>/...`.

## Asset placement rule

This rule is mandatory for new whitepaper work:

- Put every whitepaper-specific referenced file under `public/whitepapers/<id>/...`.
- This includes:
  - thumbnail / hero images
  - in-body figures
  - charts / diagrams
  - videos or poster images
  - PDF or downloadable attachments that belong only to that whitepaper
  - any other referenced static file used only by that whitepaper
- Do not put new whitepaper-specific assets under `public/assets/...`.
- Keep the public URL route-aligned with the detail route family:
  - thumbnail: `/whitepapers/<id>/thumbnail.png`
  - other public URLs: `/whitepapers/<id>/<filename>`
  - MDX component filepaths: `public/whitepapers/<id>/<filename>`

Why:
- current implementation already uses `public/whitepapers/<id>/...` as the canonical whitepaper asset root
- route-aligned assets are easier to audit, move, diff, and deduplicate
- mixing `public/assets/...` and `public/whitepapers/...` for the same whitepaper causes duplicate-file drift

## Required frontmatter

Each new whitepaper file must be an MDX file in `src/content/whitepapers/` with frontmatter shaped like this:

```mdx
---
id: "29"
slug: "example-whitepaper-slug"
title: "ホワイトペーパータイトル"
description: "詳細ページのメタデータと導入部で使う説明文"
listDescription: "一覧カード向けの短い説明文"
date: "2026年4月29日"
heroImageSrc: "/whitepapers/29/thumbnail.png"
author: "kenny"
relatedIds:
  - "28"
  - "23"
gated: true
---
```

Notes:
- `id` must be a string and must be unique.
- Use the next available numeric filename and `id`, for example `src/content/whitepapers/29.mdx`.
- `slug` becomes the canonical route suffix.
- `listDescription` is strongly recommended because the whitepaper list uses `listDescription ?? description`.
- `author` is optional in the loader, but use it when a matching author exists in `src/content/authors/ja.yaml`.
- `relatedIds` should list existing local whitepaper IDs as strings.
- `heroImageSrc` must point at the route-aligned thumbnail path for that whitepaper.
- `gated: true` is optional and should only be used when the post must hide part of its body behind the current whitepaper gating flow.

## Recommended workflow

### 1. Inspect the current whitepaper ids

Check the existing files under `src/content/whitepapers/` and pick the next intended numeric id.

Do not assume every number is present already. Use the next approved available id for the new content set.

### 2. Inspect nearby examples

Read at least one or two recent whitepaper MDX files such as:
- `src/content/whitepapers/26.mdx`
- `src/content/whitepapers/28.mdx`

If gating is needed, also inspect:
- `src/content/whitepapers/24.mdx`
- `src/content/internal/whitepaper-gating-demo.mdx`

### 3. Add the thumbnail and any referenced assets

Create or copy the thumbnail to:
- `public/whitepapers/<id>/thumbnail.png`

If the article body needs additional assets, keep all whitepaper-specific referenced files together under:
- `public/whitepapers/<id>/...`

Examples:
- `public/whitepapers/<id>/figure-1.png`
- `public/whitepapers/<id>/demo.mp4`
- `public/whitepapers/<id>/appendix.pdf`

Keep public URLs and MDX filepaths aligned with file placement.

### 4. Add the MDX file

Create:
- `src/content/whitepapers/<id>.mdx`

Requirements:
- include the required frontmatter
- write normal MDX body content
- prefer existing publication components/patterns already used in current whitepapers
- keep inline links and markup compatible with the current MDX renderer in `src/lib/publications/mdx/renderer.ts`

When referencing static files in MDX:
- for normal markdown images, use route-aligned URLs like `/whitepapers/<id>/figure-1.png`
- for `ArticleFileImage`, use `filepath="public/whitepapers/<id>/figure-1.png"`
- keep all referenced files inside the same `public/whitepapers/<id>/` asset root

### 5. Gating behavior

Only use the current whitepaper gating flow when the user explicitly wants gated content.

For a gated whitepaper:
- set `gated: true` in frontmatter
- insert a `<GatingCut />` marker at the boundary between preview content and gated content
- keep enough useful preview material before `<GatingCut />`

Example:

```mdx
## Intro

This section is visible before unlock.

<GatingCut />

## Members-only section

This section is visible after unlock.
```

Important rules:
- If `gated: true` is set, the file must include `<GatingCut />`.
- Do not use the old wrapper-style gating pattern.
- The current helper contract lives in `src/lib/publications/gating.ts`.

### 6. Author handling

If the requested author already exists in `src/content/authors/ja.yaml`, use that id in frontmatter.

If the author does not exist:
- add a new entry to `src/content/authors/ja.yaml`
- place the profile image under `public/crew/<filename>`
- use `profileImage: crew/<filename>` in the YAML entry

Do not use the old `crew/authors/...` path pattern for new author YAML values.

### 7. Route/list expectations

No manual route registration should be needed if the file follows the current conventions.

The current system auto-derives:
- whitepaper list items from `src/content/publications/whitepapers.ts`
- detail page content from `src/lib/publications/get-whitepaper-publication-post.ts`

However, always verify that:
- the new file is discoverable by the directory scan
- the new route shape remains `/whitepapers/<id>/<slug>`
- the new list card description works as intended through `listDescription` or `description`
- the new thumbnail and all other referenced files stay under `public/whitepapers/<id>/`

## Verification checklist

Run the lightest relevant checks first:

```bash
npm run test -- tests/whitepaper-canonical-slug-routing.test.mjs
npm run test -- tests/whitepaper-gating-source.test.mjs
npm run test -- tests/whitepaper-route-aligned-assets.test.mjs
```

If author data or profile images changed, also run:

```bash
npm run test -- tests/author-profile-image-paths.test.mjs
```

If the change affects broader metadata or publication rendering, run:

```bash
npm run test:ci
```

For deployment-sensitive or larger publication changes, also run:

```bash
npm run build
```

## Common pitfalls

- Forgetting to use a string `id` in frontmatter
- Reusing an existing numeric id
- Omitting `listDescription` and ending up with a poor list-card summary
- Adding a thumbnail file but mismatching the `heroImageSrc` path
- Using an author id that does not exist in `src/content/authors/ja.yaml`
- Setting `gated: true` without adding `<GatingCut />`
- Using legacy gated wrapper patterns instead of the current `gated: true` + `<GatingCut />` contract
- Placing new whitepaper-specific files under `public/assets/...` instead of `public/whitepapers/<id>/...`
- Scattering one whitepaper's images, video files, and attachments across multiple public roots
- Changing route patterns away from `/whitepapers/:id/:slug`

## Minimal task summary

When asked to add a whitepaper posting:
1. choose the intended next whitepaper id
2. add `public/whitepapers/<id>/thumbnail.png`
3. place all whitepaper-specific referenced files under `public/whitepapers/<id>/...`
4. add `src/content/whitepapers/<id>.mdx`
5. add `<GatingCut />` only if gated content is required
6. update `src/content/authors/ja.yaml` only if a new author is needed
7. run the targeted whitepaper tests
8. run broader verification only if the scope warrants it
