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

## 3. Three before-and-after examples

### Example 1. Top page

#### Before

- copy lived in a page-specific content registry such as `src/content/home.ts`
- `page.tsx` looked mostly like a shell that called something like `TopPageSections`
- reviewers had to jump across multiple files to understand copy, order, and CTA intent

Illustrative shape:

```tsx
import { topPageContent } from "@/content/home";
import { TopPageSections } from "@/components/sections/top-page-sections";

export default function HomePage() {
  return <TopPageSections content={topPageContent} />;
}
```

#### After

The current `src/app/page.tsx` shows the intended direction:

- hero copy is visible directly in the route file
- section order is visible directly in the route file
- CTA intent is visible directly in the route file
- `src/components/sections/home/*` owns UI primitives and section implementation

Representative current structure:

- `src/app/page.tsx`
- `src/components/sections/home/hero-section.tsx`
- `src/components/sections/home/solution-overview-section.tsx`
- `src/components/sections/home/core-value-section.tsx`

What improves:

- a reviewer can understand the page narrative from the route file alone
- section components handle how to present the page, while the route handles what the page says

### Example 2. About Us page

#### Before

Even when data already lives in the route file, it is still not a fully satisfactory route-local result if large top-level arrays dominate the page:

```tsx
const timeline = [...];
const leaders = [...];
const locations = [...];
```

Problems with this shape:

- the copy is still separated from the JSX authoring surface
- reviewers must mentally reconstruct the rendered page
- the route reads more like a data container than a page

#### After

The current `src/app/about-us/page.tsx` is a better direction:

- timeline entries are authored directly as `AboutUsTimelineItem` JSX
- leader names and roles are authored directly as card children
- section headings and body copy are visible directly in the route
- `src/components/sections/about-us/section.tsx` focuses on card, grid, image, and primitive responsibilities

Representative current structure:

- `src/app/about-us/page.tsx`
- `src/components/sections/about-us/section.tsx`
- `src/components/sections/company/page-primitives.tsx`

What improves:

- the real company-intro messaging is visible in the route
- the extracted section file stays focused on layout primitives

### Example 3. ACP feature browser page

#### Before

A common bad pattern for interactive sections is to push all real content into a JSON-like structure:

```tsx
const categories = [
  {
    label: "Database access control",
    items: [
      { title: "...", body: "...", imageSrc: "..." },
    ],
  },
];

<AcpFeatureBrowser categories={categories} />
```

Problems:

- the real marketing copy is trapped in a data blob
- the presence of an interactive widget pushes copy ownership away from the route
- the route stops being a semantic page authoring surface

#### After

The current `src/app/t/platforms/acp/page.tsx` uses children-based composition:

- `AcpFeatureBrowser`
- `AcpFeatureCategory`
- `AcpFeatureItem`
- `AcpFeatureItemTitle`
- `AcpFeatureItemBody`

That means an interactive section can still preserve route-local JSX authoring:

```tsx
<AcpFeatureBrowser>
  <AcpFeatureCategory>
    <AcpFeatureCategoryLabel>Database access control</AcpFeatureCategoryLabel>
    <AcpFeatureItem imageSrc="...">
      <AcpFeatureItemTitle>Agentless cloud</AcpFeatureItemTitle>
      <AcpFeatureItemBody>...</AcpFeatureItemBody>
    </AcpFeatureItem>
  </AcpFeatureCategory>
</AcpFeatureBrowser>
```

What improves:

- even interactive UI can keep route-local authoring
- the section file owns widget behavior, while the route owns the actual feature copy

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

- `.agents/skills/static-page-route-local-authoring/SKILL.md`
  - explains how to keep `page.tsx` as the primary authoring surface for static marketing routes
  - includes section-scoped refactor rules, render-order preservation, and follow-up cleanup guidance

### Repository docs

- `docs/static-page-route-local-authoring.md`
  - the detailed route-local authoring guide for this repository
- `docs/code-location-conventions.md`
  - the short-form version of the code-location convention
- `docs/route-local-refactoring-for-developers.ko.md`
  - Korean version of this introduction
- `docs/route-local-refactoring-for-developers.md`
  - English version of this introduction

### Suggested reading order

1. `docs/code-location-conventions.md`
2. `docs/static-page-route-local-authoring.md`
3. `.agents/skills/static-page-route-local-authoring/SKILL.md`
4. real reference routes such as `src/app/page.tsx`, `src/app/about-us/page.tsx`, and `src/app/t/platforms/acp/page.tsx`

## 8. Well-known references

The following references are helpful for the broader ideas behind route-local refactoring:

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
  - useful for route-level file structure and server/client boundaries
- [htmx: Locality of Behaviour](https://htmx.org/essays/locality-of-behaviour/)
  - useful as a thinking model for keeping behavior close to authored structure
- [Refactoring.Guru - Refactoring](https://refactoring.guru/refactoring)
  - useful for general refactoring principles and code-structure improvement

Within this repository, the most direct practical references are:

- `src/app/page.tsx`
- `src/app/about-us/page.tsx`
- `src/app/t/platforms/acp/page.tsx`
- the section-scoped route-local authoring direction established across PRs 155, 156, 157, and 158

---

In short, the goal of route-local refactoring is not "put everything into the route."
The goal is "make the page meaning readable from the route."
Once that standard is clear, developer review gets easier and AI agents get much less confused.
