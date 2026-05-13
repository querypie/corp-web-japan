# Code Location Conventions

This document records the current agreed code-location conventions for implementation work across the website.

## 1. Static page implementation

This section covers static marketing pages such as the top page, solution landing pages, and mostly static preview pages under `src/app/t/**`.

The detailed source of truth for this topic is:

- `docs/static-page-route-local-authoring.md`

This document records the short version of the convention.

### Core rule

For static marketing pages, the route file should be the primary authoring surface.

That means:

- `src/app/**/page.tsx` should contain the real copy
- `src/app/**/page.tsx` should show the major section order directly
- `src/app/**/page.tsx` should call the section components used to render the page
- `src/components/sections/**` should define those components and own the UI implementation details such as classes, layout, styling behavior, and JavaScript interaction
- avoid old page-specific content registries under `src/content/**` when they hide the real authored page content
- avoid giant page-specific wrapper components that make `page.tsx` read like a shell instead of a page

### Responsibility split

Preferred split:

- `src/app/**/page.tsx`
  - page metadata
  - headings, paragraphs, CTA labels, and route-local messaging
  - major section ordering
  - component composition calls
  - small route-local constants only when they improve readability without recreating a giant registry
- `src/components/sections/**`
  - component definitions used by the page
  - classes and layout details
  - reusable presentation primitives
  - isolated interaction logic and client-side behavior

In short:

- `page.tsx` owns copy and composition
- `src/components/sections/**` owns implementation

### Recommended implementation pattern

For pages of this type, prefer the following implementation shape:

- keep the primary page implementation in `src/app/<route>/page.tsx`
- write the main Japanese copy in `page.tsx`
- keep the section order explicit in `page.tsx`
- call section components directly from `page.tsx`
- let section component files implement the rendering details
- keep route-local constants small and close to the route
- do not move the bulk of a static page into `src/content/**` data objects just to avoid a long `page.tsx` file
- do not hide most of the page structure behind one page-specific wrapper component

A good outcome is that a reviewer can open one `page.tsx` file and understand the page's content model, major sections, and CTA structure without chasing several content registries or giant page-specific wrapper layers.

### Static page family boundaries

Do not collapse every static or informational route into one universal primitive family.
For current `/t/**` preview pages, keep these family boundaries explicit:

- Legal / document family: `/t/eula`, `/t/privacy-policy`, `/t/privacy-policy/[slug]`, and `/t/terms-of-service`. These routes use legal document wrappers and legal body primitives.
- Company-intro / company family: `/t/about-us` and `/t/certifications`. These routes describe company identity and trust context and may reuse marketing page shells where the layout contract actually matches.

Classify adjacent routes such as `/t/cookie-preference` and `/t/plans` by their own interaction or pricing semantics before grouping them into either family.

### Current examples

Desired reference:
- `src/app/page.tsx`

Aligned solution-page references:
- `src/app/solutions/ai-crew/page.tsx`
- `src/app/solutions/ai-dashi/page.tsx`

Historical anti-pattern to avoid:
- pages where `page.tsx` mostly wires together a large page-specific content registry under `src/content/**` and a giant page-specific wrapper from `src/components/sections/**`

### Practical migration rule for large static pages

For large pages, migrate one authored section at a time.

Preferred sequence:

1. move one section's real copy into `page.tsx`
2. add or keep a dedicated section component file under `src/components/sections/**`
3. remove that section from the old page-specific content registry
4. remove that section from the old giant wrapper/orchestrator
5. update tests so they stop treating the old location as canonical
6. repeat until the old giant wrapper and old giant content file are no longer responsible for the page

This is the pattern demonstrated by the top-page refactor sequence in PR 155, 156, 157, and 158.

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

### Shared UI text rule

Shared UI component code should keep only Japanese text that is functionally necessary to describe or operate the UI.

Allowed examples include:
- field labels
- button labels
- validation and error messages
- status text
- short functional helper text

Shared UI component code should not contain:
- product explanations
- marketing copy
- sales messaging
- page-specific descriptive content

In short:
- keep functional language in `src/components/ui/**`
- keep content language out of `src/components/ui/**`

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
  - `src/lib/publications/blog/records.ts`
  - `src/lib/publications/blog/get-post.ts`
  - `src/lib/publications/whitepapers/get-post.ts`
  - `src/lib/publications/gating.ts`

When adding similar features, prefer these files as structural examples rather than copying code from older or legacy-shaped areas.

## 3. Exception cases and later cleanup targets

This section exists to prevent humans and AI agents from treating all current file locations as approved conventions.
Some files are part of the current implementation, but their locations should be treated as exceptions or technical debt rather than preferred patterns for new code.

### Known mismatches

There are no currently confirmed path-specific exceptions listed here.
If a future cleanup target is added to this section, verify that the file path still exists on latest `main` and that the exception is still real before treating it as active guidance.

### Guidance for future work

- Do not treat older or deleted file locations as reusable patterns for new code.
- Keep publication loader and adaptor code under `src/lib/publications/**` so `src/content/**` remains focused on source content.
- New code should follow the preferred locations in section 1 or section 2 so that humans and AI agents do not extend the same location drift.
