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

## Mobile narrow-width adaptation patterns learned from sidebar overflow work

When a resource/demo sidebar works on desktop but becomes too wide or horizontally scroll-heavy on mobile, do not default to preserving the same horizontal chip bar.

Preferred reusable options:

1. Bottom-sheet / drawer pattern
- Best for resource-style sidebars with 5+ items or longer labels.
- Keep desktop sticky sidebar unchanged.
- On mobile, replace the horizontal overflow list with:
  - a trigger button showing the current active label
  - a bottom sheet / drawer containing the same nav items as a vertical list
- Recommended structure:
  - shared client component such as `ResourceListMobileSidebarDrawer`
  - `ResourceCategorySidebar` / `DemoCategorySidebar` render:
    - mobile drawer trigger + drawer content
    - separate desktop-only sidebar nav
- Practical rule: keep mobile and desktop render trees separate instead of trying to make one overflowing wrapper behave for both.

2. Multi-column block-list / grid pattern
- Good when the item count is still fairly small and the user should see all options immediately.
- Keep desktop sticky sidebar unchanged.
- On mobile:
  - remove `overflow-x-auto`
  - remove `min-w-max` / nowrap-style flex assumptions
  - render links in a 2-column grid or wrapped block list
  - center mobile labels visually; return to left-aligned desktop text on `lg`
- Recommended structure:
  - `ResourceListSidebarViewport` as mobile-only wrapper
  - `ResourceListSidebarDesktop` as desktop-only wrapper
  - shared list primitive becomes `grid grid-cols-2 gap-3 lg:flex lg:flex-col lg:gap-0`

Decision rule:
- resource families with longer labels / more categories -> prefer drawer
- short demo families or low-count category sets -> block-list/grid can be a better direct-comparison UX

Test strategy learned from this work:
- Add a small structure test first in `tests/resource-list-page-structure.test.mjs`.
- For drawer pattern, assert:
  - dedicated client component exists
  - `aria-expanded`, `role="dialog"`, `aria-modal="true"`, and mobile-only visibility classes are present
  - old horizontal overflow classes are removed from shared primitives
- For grid pattern, assert:
  - old overflow/min-width classes are gone
  - shared primitives now use mobile grid + desktop-only wrapper split
  - the concrete resource/demo sidebar components still compose via the shared wrappers
- Keep regexes matched to the actual component that owns a class. In this repo, visibility wrappers like `hidden lg:block` may live in the concrete sidebar component rather than the primitive file.

Worktree reliability lesson from this same task:
- In this repo, `git worktree add` can print success while the target directory is missing.
- After creating a worktree, always verify the directory exists on disk before using file tools.
- If it does not, prune stale worktrees and recreate the worktree at a fresh flat external path.

## Important sticky behavior rule learned from this refactor series

If a resource-list page uses the sticky sidebar and the sidebar stops sticking while the same sidebar works elsewhere, inspect the nearest scrolling ancestor first.

Key finding:
- `ResourceListSidebar` can be correct (`lg:sticky lg:top-[128px]`)
- sticky still fails when the page `main` or another ancestor has overflow set

In this repo, resource-list pages with sticky sidebars should avoid:
- `overflow-x-hidden` on the top-level `main` wrapping the sidebar/list layout

Observed working contrast:
- `/internal/mdx-list` sticky worked because its `main` did not set `overflow-x-hidden`
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
