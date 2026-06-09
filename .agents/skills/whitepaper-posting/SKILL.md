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
- The shared Open Graph preview image rule applies to whitepapers: keep the effective preview image route-aligned and `.png`, never SVG.
- Prefer setting `listDescription` explicitly.
- If no specific whitepaper author is named but an author block should still
  appear, set `author: "querypie"`. This default-author pattern applies only
  to blog, whitepaper, and event posts.
- If `gated: true`, the body must include `<GatingCut />`.
- Keep all whitepaper-specific assets under `public/whitepapers/<id>/...`.
- Do not put new whitepaper assets under `public/assets/...`.
- For downloadable whitepapers, keep the real localized PDF file under `public/whitepapers/<id>/...` and preserve the original downloadable filename for the actual PDF asset.
- Route article-page download CTAs through the canonical local PDF gate page `/whitepapers/<id>/<slug>/pdf` instead of linking directly to the PDF from the article body.
- The legacy `/whitepapers/<id>/<slug>/download` endpoint now exists only as a compatibility redirect to the canonical `/pdf` page.
- For `gated: true` whitepapers, place the article CTA near the start of the visible article body and keep the actual PDF download action behind the dedicated `/pdf` page form.
- For non-gated whitepapers, place the article CTA at the end of the article body unless the user explicitly requests a different position.
- If the download page should show a portrait PDF cover instead of the normal article thumbnail, add `downloadCoverImageSrc` in frontmatter and prefer a route-aligned name like `/whitepapers/<id>/download-cover.png`.
- Preview Toggle should not bypass the dedicated whitepaper `/pdf` page server-side by redirecting straight to the PDF.
- In preview mode, still load the canonical `/pdf` page, then client-side simulate the successful submit result for operator convenience: set the same unlock cookie and continue to the localized PDF without external Salesforce/Slack side effects.

## Minimum workflow
1. Follow the shared MDX publication skill.
2. Inspect nearby whitepaper examples in `src/content/whitepapers/`.
3. Edit or add `src/content/whitepapers/<id>-<slug>.mdx`.
4. Keep `heroImageSrc` route-aligned, e.g. `/whitepapers/<id>/thumbnail.png`.
5. If the whitepaper has a download flow, keep the actual PDF asset under `public/whitepapers/<id>/...`, preserve its real downloadable filename, and point the article CTA through `/whitepapers/<id>/<slug>/pdf`.
6. If the download page needs a PDF-cover preview, add `downloadCoverImageSrc` and localize that cover image under the same route-aligned asset root.
7. If preview-mode operator convenience is required, implement it on the `/pdf` page as client-side auto-unlock that mimics submit success (unlock cookie + PDF navigation) rather than as a server redirect that skips the page entirely.
8. Use `listDescription` when the list-card summary should differ from `description`.
9. Use `gated: true` only with `<GatingCut />`.
10. If needed, use `hidden` and `redirectUrl` according to the shared skill.
11. Run the whitepaper checks.

## Verification
```bash
npm run test -- tests/whitepaper-canonical-slug-routing.test.mjs
npm run test -- tests/whitepaper-gating-source.test.mjs
npm run test -- tests/whitepaper-route-aligned-assets.test.mjs
npm run test -- tests/whitepaper-download-route.test.mjs
```

If author data changed:
```bash
npm run test -- tests/author-profile-image-paths.test.mjs
```
