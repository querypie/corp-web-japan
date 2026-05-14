# Route-Local Refactoring for Developers

## 1. Introduction to route-local refactoring

Route-local refactoring is a refactoring style that restores each App Router route's `page.tsx` as the primary authoring surface for that page.

The key idea is not merely "move files closer to the route."
The more important goals are:

- the real page copy should be readable in `src/app/**/page.tsx`
- the major section order should be visible directly in `page.tsx`
- `src/components/sections/**` should own UI implementation details
- giant page-specific content registries and orchestrator wrappers should not hide the meaning of the route

In other words, route-local refactoring is a way to enforce a clean split:

- page meaning and composition belong to the route
- rendering implementation belongs to section components

This is especially useful when:

- `page.tsx` has become an empty-looking shell
- the real marketing copy is buried in large `src/content/**` objects or arrays
- reviewers have to jump across many files to understand one page
- AI agents cannot tell which file is the real source of truth

### 1.1 What are these layers called in more general terms?

This document uses the concrete names `page.tsx` and `src/components/sections/**`, but the broader architectural vocabulary is more general.

#### The `page.tsx` layer

The closest generic terms are:

- route-level component
- page component / page-level component
- screen component
- the page UI entry inside a page slice
- page composition layer

More specifically:

- Next.js describes [`page`](https://nextjs.org/docs/app/api-reference/file-conventions/page) as the file that defines [UI that is unique to a route](https://nextjs.org/docs/app/api-reference/file-conventions/page).
- Feature-Sliced Design describes [`Pages`](https://feature-sliced.design/docs/reference/layers#pages) as the units that make up websites and applications, and explicitly notes that they are also known as [`screens` or `activities`](https://feature-sliced.design/docs/reference/layers#pages).
- In more general React language, this layer is closest to the top-level component in a local [component hierarchy](https://react.dev/learn/thinking-in-react#step-1-break-the-ui-into-a-component-hierarchy).

So in broader terms, the `page.tsx` discussed in this document is best understood as a route-level page composition component, not merely as a filename.

#### The `src/components/sections/**` layer

The closest generic terms are:

- section component
- presentational component
- shared UI component
- widget / self-sufficient UI block
- UI primitive
- atoms / molecules / organisms in Atomic Design terms

This layer also has internal sub-levels:

- small pieces like buttons, cards, and heading wrappers are closer to UI primitives or [Atomic Design atoms / molecules](https://atomicdesign.bradfrost.com/chapter-2/)
- larger blocks like a hero section, feature block, or pricing block are closer to [section components or widgets](https://feature-sliced.design/docs/reference/layers#widgets)
- when the code focuses on rendering responsibility without owning business logic, the term [presentational component](https://www.patterns.dev/react/presentational-container-pattern/) fits well

#### The layout / shell layer

There are also nearby terms that matter when explaining route-local refactoring:

- layout component
- page shell
- shared layout
- route shell
- composition root

In particular, Next.js [`layout.tsx`](https://nextjs.org/docs/app/api-reference/file-conventions/layout) is a framework-level layout concept, while the `page.tsx` in this document is closer to the leaf page composition that sits inside that layout hierarchy.

#### Recommended default wording for this document

To reduce confusion, these are the best default terms to use here:

- `page.tsx` -> route-level page component or page composition layer
- `src/components/sections/**` -> section component layer
- smaller shared building blocks under that -> shared UI primitives or presentational primitives

In other words, the important split is not just "is it in `page.tsx`?" but rather:

- route-level page composition
- section-level UI implementation
- shared UI primitives

## 2. Concrete design principles and implementation approach

### 2.1 Core principles

1. `page.tsx` owns copy and composition.
2. `src/components/sections/**` owns layout, styling, and interaction.
3. A reviewer should be able to open the route file first and understand the page narrative.
4. Reusable UI may be extracted, but the real authored sentences and section meaning should not disappear into hidden content layers.
5. Not every static or informational page should be forced into one universal primitive system.

### 2.2 What should live in `page.tsx`

- metadata
- real headings, paragraphs, and CTA labels
- the actual section order
- JSX composition of section components
- route-local CTA URLs and small constants
- the page meaning a reviewer needs to read

### 2.3 What should live in `src/components/sections/**`

- section wrappers, cards, grids, media, and primitive components
- styling details such as classes and spacing
- interaction, animation, and client behavior
- reusable presentation primitives
- UI implementation extracted to keep the route readable

### 2.4 Patterns to avoid

#### Bad pattern A: content-registry-first structure

```tsx
import { pageContent } from "@/content/page";
import { PageSections } from "@/components/sections/page-sections";

export default function ExamplePage() {
  return <PageSections content={pageContent} />;
}
```

Why it is bad:

- the route no longer reads like a page
- real copy and section order are hidden
- both reviewers and AI agents must trace multiple files at once

#### Bad pattern B: apparently route-local, but still dominated by data blobs

```tsx
const timeline = [
  { year: "2017", items: ["Founded"] },
  { year: "2018", items: ["Raised investment"] },
];

const leaders = [
  { name: "...", role: "..." },
];
```

Why it is bad:

- even if the data now sits in the route, the copy is still hidden outside the main JSX authoring surface
- the page still reads as "data blob first, page second"

### 2.5 Recommended implementation sequence

1. Choose the target route.
2. Identify where the current copy really lives: `src/content/**`, top-level route arrays/objects, or a giant wrapper.
3. Cut the scope by section.
4. Move real sentences and CTA labels into the JSX in `page.tsx`.
5. Keep only layout and UI primitives in `src/components/sections/**`.
6. Verify that render order did not change.
7. Remove old registry and orchestrator dependencies.
8. Update structure tests or guidance docs together when needed.

### 2.6 Important implementation rules

#### Refactor section by section

Instead of rewriting a whole page in one pass, it is usually better to finish one section to the intended standard.
In this repository, a PR with one fully completed section is better than a broad PR with many half-refactored sections.

#### Preserve section order

The goal of route-local refactoring is ownership transfer, not narrative reordering.
If a target section is pulled out of a shared shell and reinserted in the wrong place, the refactor is incorrect.

#### Keep page-family boundaries

Not every static page should be treated the same way.
For example:

- top page / solution pages: marketing-copy-heavy routes
- about-us / certifications / news / contact-us: company-page family, with the shared shell and layout contract in `docs/company-page-layout-contract.md`
- privacy-policy / eula / terms: legal document family
- plans / feature browser pages: informational routes with interaction contracts

So route-local refactoring is not about making every page look identical.
It is about giving each page family the clearest authoring structure.

## 3. Summary of before-and-after examples

This introduction document now keeps the examples short and moves the full real-code snapshots into separate example documents.

Detailed example documents:

- [docs/route-local-refactoring-examples.ko.md](./route-local-refactoring-examples.ko.md)
- [docs/route-local-refactoring-examples.md](./route-local-refactoring-examples.md)

What those detailed example documents include:

- real before / after code excerpts in 30–50+ line chunks
- not only `page.tsx`, but also the module structure that `page.tsx` depends on
- cases where `src/components/**` mixes UI implementation with marketing copy
- cases with Big JSON Props, compound aliases, and top-level data blobs
- commit-pinned GitHub links for every referenced code file

This document keeps only a short summary of the three representative cases.

### Example 1. Top page

- before: meaning was split across the shell route [`src/app/page.tsx`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/app/page.tsx), the content registry [`src/content/top-page.ts`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/content/top-page.ts), and the giant wrapper [`src/components/sections/top-page-sections.tsx`](https://github.com/querypie/corp-web-japan/blob/1550dc0673a11992e7fa5551cdbb6a4a43e2712d/src/components/sections/top-page-sections.tsx)
- after: the real hero/CTA/section order is directly visible in [`src/app/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/page.tsx), while files such as [`src/components/sections/home/hero-section.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/home/hero-section.tsx) are reduced to UI primitives and section implementation details

### Example 2. About Us

- before: [`src/app/t/about-us/page.tsx`](https://github.com/querypie/corp-web-japan/blob/c03333672e4e4ed5d21cb7d004ea9be2df1f3c9d/src/app/t/about-us/page.tsx) started with large data blobs such as `timeline`, `leaders`, and `locations`, which hurt route readability
- after: [`src/app/about-us/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/about-us/page.tsx) shows the real JSX authoring for timeline/leader/location copy directly, while [`src/components/sections/about-us/section.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/components/sections/about-us/section.tsx) focuses on layout primitives

### Example 3. Plans

- before: [`src/app/t/plans/page.tsx`](https://github.com/querypie/corp-web-japan/blob/4ab11fc40bf3e0f622a08d30a2ffebb44c5d9255/src/app/t/plans/page.tsx) combined `Object.assign(...)` aliases with giant `rows` / `columns` prop blobs, so even small copy changes required synchronized edits across multiple positional arrays
- after: [`src/app/t/plans/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/plans/page.tsx) composes `CompareTableSection`, `CompareTableRow`, and `CompareTableTextCell` directly, so labels and cell values are readable from the same authoring surface

## 4. Pros and cons of this approach

### Pros

- reviewers can understand page meaning quickly from one file
- the boundary between copy changes and UI changes becomes clearer
- AI agents are less likely to choose the wrong source of truth
- giant wrappers and giant registries become easier to reduce
- section-scoped PRs become easier to shape and review
- copy ownership and UI implementation ownership are separated cleanly

### Cons

- `page.tsx` can become long
- the number of imports can initially look large
- if applied too rigidly, repeated markup can grow
- forcing this pattern onto data-heavy pages can make structure worse, not better
- teams need a shared understanding of how much should remain in the route

### Important nuance

Route-local refactoring does not mean that everything must be inline in one file.
Repeated UI primitives, legal MDX bodies, and backend-heavy logic should still live in the right shared locations.
The real question is whether the route remains the primary authoring surface.

## 5. Effects: what gets better

### Developer experience

- the cost of reading a page decreases
- code review becomes faster
- diffs become easier to read in meaningful units
- responsibility boundaries between copy and UI become clearer

### Maintainability

- page-level source of truth becomes clearer
- dead content registries and obsolete wrappers become easier to remove
- section-scoped follow-up PRs become easier to plan

### AI agent collaboration

- agents can reason from the route file first
- the rule "copy in routes, implementation in sections" reduces file-selection mistakes
- safe edits are possible with less context chasing

### Product and UX work

- page narrative and CTA intent become easier to maintain consistently
- parity work becomes easier because ownership of section order and key messaging is explicit

## 6. How to instruct an AI agent to do route-local refactoring

Good instructions include scope, completion criteria, and protected areas.

### Minimal instruction example

```md
Refactor `src/app/about-us/page.tsx` to follow route-local authoring.
Keep the real copy and section composition in `page.tsx`.
Leave only UI implementation details in `src/components/sections/**`.
If there are large top-level data arrays, remove them.
Do not change render order.
```

### Section-scoped example

```md
Refactor only the use-cases section in the AI Crew page into route-local authoring.
Do not touch other sections.
The completion criterion is that the section's real copy is directly visible in `page.tsx`.
```

### Interactive-section example

```md
For the ACP feature browser, replace the data-blob prop pattern with children-based route-local JSX authoring.
Keep widget interaction in the section component,
but move the real feature title/body copy into the route.
```

### Information that improves prompts

- exact target file paths
- whether the task is section-scoped or whole-page
- render order that must be preserved
- scopes that must not be touched
- a current reference page
- completion criteria
- whether tests or docs should be updated too

### Ambiguous instructions to avoid

- "clean this up a bit"
- "make it route-local" with no scope
- "fix everything" without naming the target section

Those instructions make scope drift much more likely.
Whenever possible, specify which section should be completed and what "done" means.

## 7. Skills and Markdown documents to use

The key route-local-refactoring references in this repository are:

### Repo-local skill

- [`.agents/skills/static-page-route-local-authoring/SKILL.md`](../.agents/skills/static-page-route-local-authoring/SKILL.md)
  - explains how to keep `page.tsx` as the primary authoring surface for static marketing routes
  - includes section-scoped refactor rules, render-order preservation, and follow-up cleanup guidance

### Repository docs

- [`docs/static-page-route-local-authoring.md`](./static-page-route-local-authoring.md)
  - the detailed route-local authoring guide for this repository
- [`docs/code-location-conventions.md`](./code-location-conventions.md)
  - the short-form version of the code-location convention
- [`docs/route-local-refactoring-for-developers.ko.md`](./route-local-refactoring-for-developers.ko.md)
  - Korean version of this introduction
- [`docs/route-local-refactoring-for-developers.md`](./route-local-refactoring-for-developers.md)
  - English version of this introduction
- [`docs/route-local-refactoring-examples.ko.md`](./route-local-refactoring-examples.ko.md)
  - Korean long-form example collection with real before / after code snapshots
- [`docs/route-local-refactoring-examples.md`](./route-local-refactoring-examples.md)
  - English long-form example collection with real before / after code snapshots

### Suggested reading order

1. [`docs/code-location-conventions.md`](./code-location-conventions.md)
2. [`docs/static-page-route-local-authoring.md`](./static-page-route-local-authoring.md)
3. [`.agents/skills/static-page-route-local-authoring/SKILL.md`](../.agents/skills/static-page-route-local-authoring/SKILL.md)
4. real reference routes such as [`src/app/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/page.tsx), [`src/app/about-us/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/about-us/page.tsx), and [`src/app/t/platforms/acp/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/platforms/acp/page.tsx)

## 8. References and terminology for page-layer / UI-layer separation

For this topic, the more important references are not generic refactoring references, but references about how web UIs split page-level composition from lower UI component layers.

### 8.1 References for the route-level page component

- [Next.js - page.js](https://nextjs.org/docs/app/api-reference/file-conventions/page)
  - defines `page` as the file for UI that is unique to a route
  - explicitly says that a `page` is the leaf of the route subtree and the innermost file convention in the component hierarchy
  - this is the most direct framework-level reference for the `page.tsx` role described in this document
- [Next.js - Project structure and organization](https://nextjs.org/docs/app/getting-started/project-structure)
  - explains that `page` exposes a route, while `layout` handles shared UI such as header, nav, or footer
  - useful for vocabulary such as route segment, layout, template, private folder, and split-by-feature-or-route organization
- [Feature-Sliced Design - Layers](https://feature-sliced.design/docs/reference/layers)
  - describes `Pages` as the units that make up websites and applications, and explicitly notes that they are also known as screens or activities
  - this is a strong reference for using broader terms like page component, screen component, or pages layer

### 8.2 References for the UI component layer

- [React - Thinking in React](https://react.dev/learn/thinking-in-react)
  - explains how to break a UI into a component hierarchy and think in terms of top-level and child components
  - this is the most fundamental reference for reasoning about page composition versus lower-level UI building blocks
- [Patterns.dev - Container/Presentational Pattern](https://www.patterns.dev/react/presentational-container-pattern/)
  - a classic separation-of-concerns reference for separating the view from application logic
  - useful when explaining terms like presentational component in relation to route-local refactoring
- [Feature-Sliced Design - Slices and segments](https://feature-sliced.design/docs/reference/slices-segments)
  - describes the `ui` segment as the place for code grouped by technical UI nature
  - useful when talking about shared UI, page UI, and feature UI as separate layers
- [Atomic Design by Brad Frost - Chapter 2](https://atomicdesign.bradfrost.com/chapter-2/)
  - provides the layered vocabulary of atoms, molecules, organisms, templates, and pages
  - useful when connecting section components and UI primitives to a broader design-system vocabulary

### 8.3 Generalized terminology you can use in this document

#### Terms closest to `page.tsx`

- route-level component
- page component / page-level component
- screen component
- page composition layer
- page UI entry

Recommended wording:

- route-level page component
- page composition layer

#### Terms closest to `src/components/sections/**`

- section component
- presentational component
- widget
- shared UI component
- UI primitive

Recommended wording:

- section component layer
- shared UI primitives

#### Terms for smaller shared UI pieces

- presentational primitive
- shared UI primitive
- atom / molecule / organism
- design system component

### 8.4 Direct references inside this repository

Within this repository, the most direct practical references are:

- [`src/app/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/page.tsx)
- [`src/app/about-us/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/about-us/page.tsx)
- [`src/app/t/platforms/acp/page.tsx`](https://github.com/querypie/corp-web-japan/blob/87a7f583fdd2af747a624d83f4f81cc8a993b187/src/app/t/platforms/acp/page.tsx)
- the section-scoped route-local authoring direction established across PRs 155, 156, 157, and 158

---

In short, the goal of route-local refactoring is not "put everything into the route."
The goal is "make the page meaning readable from the route."
Once that standard is clear, developer review gets easier and AI agents get much less confused.
