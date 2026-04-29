# Code Location Conventions

This document records the current agreed code-location conventions for implementation work across the website.

## 1. Static page implementation

This section covers representative static marketing pages such as the top page, AI Crew, and AI Dashi.

### Core rule

For static marketing pages, the preferred implementation style is stronger than the general thin-route rule used for publication and data-backed routes.

- Keep the page primarily understandable from its own `page.tsx` file.
- Prefer keeping the main page copy, section order, and page-specific structure directly in `page.tsx`.
- Reusable UX primitives and clearly reusable visual helpers may still be called from `src/components/ui/**` or other shared component locations.
- Avoid pushing most of the static page's content and structure into separate `src/content/**` data files or large page-specific section wrappers when that makes the route harder to understand in one place.

### Recommended implementation pattern

Use top page, AI Crew, and AI Dashi as the representative content family for this rule.
For pages of this type, prefer the following implementation shape so the page can be built quickly, reviewed easily, and kept structurally consistent across routes.

- Keep the primary page implementation in `src/app/<route>/page.tsx`.
- Write the main Japanese copy, section order, and page-specific JSX directly in that `page.tsx` file.
- Allow shared calls only for clearly reusable UI primitives or small visual helpers.
- Keep route-specific constants close to the page when they mainly exist to support that one page.
- Do not move the bulk of a static page into `src/content/**` data objects just to avoid a long `page.tsx` file.
- Do not hide most of the page structure behind a single page-specific wrapper component if that makes the route harder to inspect.
- If a helper is reused across multiple static pages, promote only that helper; keep the rest route-local.

A good outcome is that a reviewer can open one `page.tsx` file and understand the page's content model, major sections, and CTA structure without chasing several content registries or page-specific wrapper layers.

### Current examples

- Largely aligned:
  - `src/app/solutions/ai-dashi/page.tsx`
- Not aligned and should not be treated as the preferred pattern for new static pages:
  - `src/app/page.tsx`
  - `src/app/solutions/ai-crew/page.tsx`

## 2. Code-location conventions for feature implementation

This section covers feature-oriented implementation such as Contact Us, blog, whitepapers, and gating flows.

### Route and implementation rules

- Keep App Router route files thin.
- Route files should primarily compose page content, call shared helpers, and define route-local metadata or HTTP handling.
- Backend and integration implementation should live in reusable shared code locations instead of growing route-local logic.

### Preferred shared code locations

- Reusable non-UI logic should primarily live under `src/lib/**`.
- Reusable UX primitive components should primarily live under `src/components/ui/**`.
- Page- or domain-specific composed UI should primarily live under `src/components/sections/**`.

### Practical guidance

- Keep route handlers and page files focused on request/response wiring and composition.
- Move shared submit handling, validation helpers, API integration code, and similar non-UI logic into `src/lib/**`.
- Keep reusable presentational primitives in `src/components/ui/**`, and assemble page-specific sections from those primitives in `src/components/sections/**`.

### Recognized examples that fit this convention

The following existing files are good reference points for new work because they already follow the intended split between thin routes and shared implementation.

- Thin App Router pages:
  - `src/app/blog/page.tsx`
  - `src/app/blog/[id]/[slug]/page.tsx`
  - `src/app/whitepapers/page.tsx`
  - `src/app/whitepapers/[id]/[slug]/page.tsx`
- Shared non-UI implementation in `src/lib/**`:
  - `src/lib/publications/blog-publication-records.ts`
  - `src/lib/publications/get-publication-post.ts`
  - `src/lib/publications/get-whitepaper-publication-post.ts`
  - `src/lib/publications/gating.ts`

When adding similar features, prefer these files as structural examples rather than copying code from older or legacy-shaped areas.

## 3. Exception cases and later cleanup targets

This section exists to prevent humans and AI agents from treating all current file locations as approved conventions.
Some files are part of the current implementation, but their locations should be treated as exceptions or technical debt rather than preferred patterns for new code.

### Known mismatches

- Page- or domain-specific composed UI that currently lives outside `src/components/sections/**`:
  - `src/components/PublicationPostPage.tsx`
  - `src/components/ResourceListPage.tsx`
- Non-UI publication loader/adaptor code that currently lives outside `src/lib/**`:
  - `src/content/publications/whitepapers.ts`
  - `src/content/publications/blog.ts`

### Guidance for future work

- Do not copy these exception locations as the default pattern for new code.
- Treat them as cleanup targets when the surrounding feature areas are next reorganized.
- New code should follow the preferred locations in section 1 or section 2 so that humans and AI agents do not extend the same location drift.
