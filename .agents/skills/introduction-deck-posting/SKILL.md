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
- move a downloadable file action from inline MDX markup into frontmatter `downloadCta`

## Introduction deck-specific contract
- Content root: `src/content/introduction-deck/*.mdx`
- Canonical detail route: `/introduction-deck/:id/:slug`
- List route: `/introduction-deck`
- Asset root: `public/introduction-deck/<id>/...`
- Repository: `src/lib/resources/introduction-deck-publications.ts`
- Post loader: `src/lib/resources/introduction-deck-post-loader.ts`
- Resource-only fields: `date?`, `gated?`, `downloadCta?`, `relatedItems?`

## Download CTA contract
- Introduction-deck PDFs should be modeled in frontmatter `downloadCta`, not as inline MDX `<ButtonLink>` markup inside the body.
- Current shape:
  ```yaml
  downloadCta:
    href: "/introduction-deck/<id>/<file>.pdf"
    label: "..."
    external: true
  ```
- Keep the actual PDF under the route-aligned asset root, e.g. `public/introduction-deck/<id>/...`.
- For gated introduction-deck posts, keep the `downloadCta` inside the same detail-page experience. Unlike whitepapers, do not route the article CTA through a separate `/download` page.
- UX rule for gated introduction-deck posts:
  - unlock form first
  - then reveal the gated section
  - inside that gated section, show the `## 資料ダウンロード` copy and place the download CTA directly under the explanatory sentence such as `フォーム送信後、以下のボタンから資料を確認できます。`
- Do not surface that introduction-deck download CTA above the gating form or before the gated content is revealed.

## Important limit
- Do not assume `hidden` or `redirectUrl` support for this family in the current code.
- For gated introduction-deck posts, prefer frontmatter `downloadCta` over an inline MDX `ButtonLink` for the actual PDF/file-opening action.
- Important placement rule learned from preview validation: the real download CTA must not appear above the gating form wall. Keep it in the unlocked gated-content flow, after the gated body copy and heading/description such as `資料ダウンロード`, so the reader sees the explanatory copy first and the file-opening action only in the correct unlocked position.

## Verification
```bash
node --test tests/introduction-deck-download-cta.test.mjs tests/button-link-external-prop.test.mjs tests/src/app/t/introduction-deck/page.test.mjs
```
