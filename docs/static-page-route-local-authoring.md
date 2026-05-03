# Static Page Route-Local Authoring Guide

This document defines the desired authoring pattern for static marketing pages in `corp-web-japan`.

It exists because some older guidance and intermediate refactor results do not fully match the intended end state.
The source of truth for this guide is the currently desired implementation direction discussed in repository work:

- `src/app/**/page.tsx` should own the page copy and the page composition
- `src/components/sections/**` should own the UI implementation details used by the page
- avoid old content-registry and giant wrapper patterns that hide the real page authoring surface

## Purpose

Use this guide when:

- creating a new static marketing page
- refactoring an existing static route
- reviewing whether a page is fully route-local or only partially refactored
- deciding what belongs in `page.tsx` versus `src/components/sections/**`

This guide applies to static marketing routes such as:

- `src/app/page.tsx`
- `src/app/solutions/**/page.tsx`
- mostly static preview pages under `src/app/t/**/page.tsx`

This guide does not define the preferred structure for:

- blog / whitepaper / news publication routes
- clearly data-backed feature routes
- backend-heavy route handlers or API behavior

## Core rule

For a static marketing page, the route file should be the primary authoring surface.

That means:

- the real copy should be visible in `src/app/**/page.tsx`
- the major section order should be visible in `src/app/**/page.tsx`
- the page should read like a page, not like a thin shell around hidden content layers
- section components may still be used, but they should implement presentation and interaction details rather than hide the page's authored content model

## Responsibility split

### What belongs in `src/app/**/page.tsx`

`page.tsx` should contain:

- page metadata
- the real headings, paragraphs, CTA labels, and other marketing copy
- the actual order of sections
- the calls that compose and use section components
- small route-local arrays or constants when they improve readability without becoming a giant content registry
- route-local links and CTA intent

In short:

- `page.tsx` owns copy and composition

### What belongs in `src/components/sections/**`

`src/components/sections/**` should contain:

- the component definitions used by `page.tsx`
- styling classes
- layout implementation details
- UI and UX behavior
- JavaScript interaction logic
- small reusable section primitives
- isolated client-side interaction where needed

In short:

- `src/components/sections/**` owns implementation details, not the page's hidden authored content model

## Desired end state

A static page is in the desired state when a reviewer can open only `src/app/**/page.tsx` and quickly understand:

- what the page is about
- what order the sections appear in
- what the major marketing claims are
- what the CTAs do
- which components are being used for presentation

A good route-local page may still import components from `src/components/sections/**`.
That is not a problem by itself.
The problem is when those imports hide most of the page's real authored copy and structure.

## Good result example

### Current desired reference

- `src/app/page.tsx`

Why this is the desired direction:

- the route file contains the actual page copy
- the route file shows the major section order directly
- the route file composes section components explicitly
- the imported section files primarily provide UI structure, styling, and interaction details
- the page is readable as a page from the route file itself

Important nuance:

This does not mean everything must be inline JSX with no section components.
It means the route file must still remain the primary readable authoring surface.

## Partial result example

### Partially refactored, but not yet the target end state

- `src/app/solutions/ai-dashi/page.tsx`

Why it is only partial:

- the route file already owns much more of the page than the old wrapper/content-registry pattern
- however, the page still keeps a large amount of route content in top-level data blocks
- this can still read like `data blob first, page authoring second`

This shape is closer to the target than the old pattern, but it is not yet the cleanest result.

Typical symptoms of a partial result:

- large top-level arrays and objects dominate the route file
- the copy is technically local, but still separated from the JSX too mechanically
- the page still feels partly content-driven instead of clearly authored in place

## Wrong result example

### Typical pre-refactor anti-pattern

- `src/app/solutions/ai-crew/page.tsx`
- `src/content/home.ts`
- `src/components/sections/home-page-sections.tsx`

Why this is the wrong shape:

- `page.tsx` acts mainly as a shell
- the real copy is hidden in a page-specific content registry under `src/content/**`
- the real structure is hidden behind a large page-specific wrapper component under `src/components/sections/**`
- opening `page.tsx` alone does not explain the page

This is the classic pattern that should be refactored away.

## Anti-patterns to avoid

Avoid these outcomes even if they look like progress.

### 1. Giant page-specific content registry

Bad pattern:

- `page.tsx` imports a large page-specific content object from `src/content/**`
- most headings, paragraphs, CTA labels, and section data are stored there

Why it is bad:

- the route file stops being the main authoring surface
- copy and composition become harder to review together

### 2. Giant page-specific wrapper component

Bad pattern:

- `page.tsx` renders one large `*Sections` component that contains most of the actual page

Why it is bad:

- the route file becomes a shell
- the page structure is hidden in another file

### 3. Mechanical relocation of the same giant object into `page.tsx`

Bad pattern:

- removing `src/content/<page>.ts`
- moving the same giant registry into top-level constants at the top of `page.tsx`

Why it is still bad:

- this is only a location change
- the route still reads like a content registry rather than a page authoring surface

### 4. Mechanical relocation of the same giant wrapper into a local helper

Bad pattern:

- copying a large external `*Sections` wrapper into `page.tsx` as `function PageSections()`
- keeping most of the authored structure hidden inside that local helper

Why it is still bad:

- this is still a wrapper-first page shape
- the route file is not yet the primary readable authoring surface

### 5. Over-promoting page-specific copy into shared section files

Bad pattern:

- putting long page-specific marketing copy directly inside `src/components/sections/**`
- making section files the true source of page meaning

Why it is bad:

- section files should implement UI behavior and styling details
- the page route should still own the authored copy and section composition

## Preferred authoring pattern

A static page should usually read like this at a high level:

1. metadata
2. route-local links / CTA constants if needed
3. small local arrays only where they improve readability
4. route JSX that contains the real copy
5. explicit use of imported section components for presentation

A good reading experience is:

- open `page.tsx`
- understand the page narrative without chasing multiple files
- open section component files only when you need to inspect layout, styling, or interaction details

## Practical authoring rules

### Copy placement

Prefer this:

- headings directly in `page.tsx`
- paragraph copy directly in `page.tsx`
- CTA labels directly in `page.tsx`
- route-specific message ordering directly in `page.tsx`

Use local constants only when they make the route clearer, not when they recreate an old registry shape.

### Section component placement

Prefer this for `src/components/sections/**`:

- wrapper markup and layout primitives
- card shells
- animated section scaffolding
- reusable CTA shells
- reveal/scroll behavior
- tabs, accordions, or other client-side interaction
- classes, JavaScript behavior, and visual implementation details

### Constant placement

Acceptable in `page.tsx`:

- a few CTA URLs
- a small card list
- a short step list
- a short badge list

Needs caution:

- many large nested objects that recreate a hidden content CMS inside the route file

### Client-side behavior

If one section needs client-side state:

- keep the page route as the authoring surface
- extract only the interaction-heavy component
- keep the main copy and composition visible in `page.tsx`

## Refactor approach

When refactoring a non-compliant static page:

1. identify the old page-specific content registry
2. identify the old page-specific orchestrator wrapper
3. move real headings, paragraphs, and CTA labels into `page.tsx`
4. keep or extract only the UI implementation details into `src/components/sections/**`
5. remove obsolete content-registry and wrapper layers
6. verify that `page.tsx` now reads like the page itself

## Review checklist

Use this checklist in PR review or self-review.

### Route-local authoring checklist

- [ ] Does `page.tsx` contain the real page copy?
- [ ] Does `page.tsx` show the actual section order clearly?
- [ ] Can a reviewer understand the page without opening multiple hidden content files?
- [ ] Are CTA labels and route-specific messaging visible in `page.tsx`?
- [ ] Are imported section files mainly implementing UI, styling, layout, or interaction details?
- [ ] Is there no giant page-specific content registry under `src/content/**` for this page?
- [ ] Is there no giant page-specific `*Sections` wrapper hiding most of the page?
- [ ] Has the refactor avoided replacing one hidden abstraction with the same abstraction moved locally?
- [ ] Does the route feel like a page, not a shell around hidden layers?

### Warning signs checklist

- [ ] `page.tsx` mostly imports one content object and one giant wrapper component
- [ ] most copy lives outside the route file
- [ ] the route starts with many large top-level content objects that feel like a registry dump
- [ ] the real page cannot be understood without opening `src/content/**` and `src/components/sections/**`
- [ ] page-specific marketing copy is concentrated in section implementation files instead of the route

If several warning signs are true, the page is not in the desired end state.

## Short decision rule

Use this simple test:

- If `page.tsx` tells the page story and `src/components/sections/**` implements how it looks and behaves, the page is likely in the right shape.
- If `page.tsx` only wires together hidden content and hidden structure from elsewhere, the page is not yet in the right shape.

## Current repository examples

Desired reference:

- `src/app/page.tsx`

Partial / intermediate reference:

- `src/app/solutions/ai-dashi/page.tsx`

Wrong / pre-refactor reference:

- `src/app/solutions/ai-crew/page.tsx`
- `src/content/home.ts`
- `src/components/sections/home-page-sections.tsx`

## Notes for future documentation updates

If another document in `docs/` describes static-page authoring differently, treat this document as the route-local authoring guide for static marketing pages and reconcile the older doc in a follow-up change.
