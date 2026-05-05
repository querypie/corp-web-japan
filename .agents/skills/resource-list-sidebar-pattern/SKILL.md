---
name: resource-list-sidebar-pattern
description: Refactor or extend corp-web-japan resource-list pages while keeping hero/CTA authoring route-local and centralizing only the repeated sidebar structure.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [corp-web-japan, resource-list, sidebar, sticky, preview, public, route-local-authoring]
---

# Resource list sidebar pattern for corp-web-japan

Use this when editing resource-list style pages such as:
- `src/app/blog/page.tsx`
- `src/app/whitepapers/page.tsx`
- `src/app/events/page.tsx`
- `src/app/internal/load-more/page.tsx`
- preview list pages under `src/app/t/**/page.tsx`

## Goal

Keep route-owned authoring visible in each `page.tsx` while avoiding repeated sidebar markup.

What should stay in `page.tsx`:
- `ResourceListHeroSection`
- `ResourceListHeroTitle`
- `ResourceListHeroDescription`
- CTA section(s) when present
- route-specific item loading and list composition

What may be centralized:
- repeated sidebar markup and link sets

## Recommended structure

Primitive layer:
- `ResourceListSidebar`
- `ResourceListSidebarNav`
- `ResourceListSidebarItem`
- related `ResourceListSidebar*` pieces in `resource-list-section.tsx`

Specialized/composed layer:
- `ResourceCategorySidebar`

Current concrete pattern:
- `src/components/sections/resource-category-sidebar.tsx`
  - owns public resource links in `resourceCategorySidebarLinks`
  - owns preview-resource links in `previewResourceCategorySidebarLinks`
  - accepts:
    - `activeLabel?`
    - `links?`

This lets pages reuse one concrete component while still supporting:
- public links like `/resources`, `/whitepapers`, `/blog`
- preview links like `/t/resources`, `/t/glossary`, `/t/manuals`
- mixed cases where preview pages should still point some entries to canonical public routes

## Important route/link rule learned from this refactor series

Do not assume every preview sidebar entry needs a `/t/...` destination.

Check whether the preview index route actually exists.
- `/t/resources`, `/t/introduction-deck`, `/t/glossary`, `/t/manuals` exist
- `/t/whitepapers` does not exist
- `/t/blog` does not exist

Therefore the current preview sidebar should link:
- `全て` -> `/t/resources`
- `紹介資料` -> `/t/introduction-deck`
- `用語集` -> `/t/glossary`
- `マニュアル` -> `/t/manuals`
- `ホワイトペーパー` -> `/whitepapers`
- `ブログ` -> `/blog`

Before changing any sidebar links, verify the actual route exists in `src/app/` and check tests for removed preview entrypoints.

## Important sticky behavior rule learned from this refactor series

If a resource-list page uses the sticky sidebar and the sidebar stops sticking while the same sidebar works elsewhere, inspect the nearest scrolling ancestor first.

Key finding:
- `ResourceListSidebar` can be correct (`lg:sticky lg:top-[128px]`)
- sticky still fails when the page `main` or another ancestor has overflow set

In this repo, resource-list pages with sticky sidebars should avoid:
- `overflow-x-hidden` on the top-level `main` wrapping the sidebar/list layout

Observed working contrast:
- `/internal/mdx-list-demo` sticky worked because its `main` did not set `overflow-x-hidden`
- `/blog` and `/whitepapers` lost expected sticky behavior when `main` had `overflow-x-hidden`, which computed into a non-visible overflow context in the browser

Practical rule:
- for resource-list pages using `ResourceCategorySidebar`, keep `main` as:
  - `className="relative bg-white text-slate-950"`
- do not add `overflow-x-hidden` there unless you have re-verified sticky behavior in the browser

## Verification checklist

1. Search for repeated sidebar markup before extracting:
```bash
search_files("<ResourceListSidebar>", path="src/app", file_glob="page.tsx")
```

2. Confirm route-owned hero/CTA still remain in each `page.tsx`.

3. Confirm there are no stale per-page sidebar constants where the shared concrete component should now be used.

4. Run targeted tests:
```bash
node --test \
  tests/resource-list-page-structure.test.mjs \
  tests/blog/list-server-source.test.mjs \
  tests/whitepaper-canonical-slug-routing.test.mjs \
  tests/src/app/t/resources/page.test.mjs \
  tests/src/app/t/glossary/page.test.mjs \
  tests/src/app/t/introduction-deck/page.test.mjs \
  tests/src/app/t/manuals/page.test.mjs \
  tests/seo-metadata.test.mjs \
  tests/link-and-metadata-integrity.test.mjs \
  tests/canonical-endpoints.test.mjs
```

5. Run typecheck:
```bash
npm run typecheck
```

6. If sticky behavior changed, verify the actual rendered page in the browser and inspect computed overflow on the page `main` and computed `position/top` on the sidebar `aside`.

## Pitfalls

- Do not extract hero/title/description into the shared sidebar component.
- Do not extract CTA sections into the shared sidebar component.
- Do not point preview sidebar entries at missing `/t/...` routes.
- Do not trust `read_file` display output as raw file bytes when doing scripted rewrites; use direct shell/Python file I/O for lossless edits if needed.
- Do not add `overflow-x-hidden` back to sticky resource-list page `main` wrappers without browser verification.
