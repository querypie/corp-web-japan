# Code Location Conventions

This document records the current agreed code-location conventions for implementation work across the website.

## Route and implementation rules

- Keep App Router route files thin.
- Route files should primarily compose page content, call shared helpers, and define route-local metadata or HTTP handling.
- Backend and integration implementation should live in reusable shared code locations instead of growing route-local logic.

## Preferred shared code locations

- Reusable non-UI logic should primarily live under `src/lib/**`.
- Reusable UX primitive components should primarily live under `src/components/ui/**`.
- Page- or domain-specific composed UI should primarily live under `src/components/sections/**`.

## Practical guidance

- Keep route handlers and page files focused on request/response wiring and composition.
- Move shared submit handling, validation helpers, API integration code, and similar non-UI logic into `src/lib/**`.
- Keep reusable presentational primitives in `src/components/ui/**`, and assemble page-specific sections from those primitives in `src/components/sections/**`.

## Recognized examples that fit this convention

The following existing files are good reference points for new work because they already follow the intended split between thin routes and shared implementation:

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

## Known mismatches and later cleanup candidates

Some existing files are still useful implementation references, but their current locations do not fully match this convention and should not be treated as the preferred placement for new code.

- Page- or domain-specific composed UI that currently lives outside `src/components/sections/**`:
  - `src/components/PublicationPostPage.tsx`
  - `src/components/ResourceListPage.tsx`
- Non-UI publication loader/adaptor code that currently lives outside `src/lib/**`:
  - `src/content/publications/whitepapers.ts`
  - `src/content/publications/blog.ts`

These files are part of the current implementation, but they should be considered cleanup targets when the surrounding feature areas are next reorganized. New code should follow the preferred locations above so that humans and AI agents do not extend the same location drift.
