---
name: static-page-route-local-authoring-refactor
description: Refactor a corp-web-japan static marketing route so page.tsx becomes the primary readable authoring surface and old giant content/wrapper layers are removed safely.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [corp-web-japan, static-page, route-local-authoring, refactor, nextjs]
---

# Refactor a static marketing page to route-local authoring in corp-web-japan

Use this skill when a corp-web-japan static marketing route should be rewritten so the route file itself becomes the main readable implementation surface.

Typical targets:
- `src/app/page.tsx`
- `src/app/solutions/<slug>/page.tsx`
- preview/company-info static pages under `src/app/t/**/page.tsx`

This skill is for repetitive refactors of the same class, especially when an earlier session already identified the target files, desired direction, and completion criteria.

## Goal

Move the real marketing copy, section order, and page-specific structure into the route file itself.

Preferred end state:
- `page.tsx` shows the real copy and major section composition directly
- giant page-specific content registries are removed
- giant page-specific orchestrator components are removed
- only small reusable UI primitives or isolated interactive helpers remain extracted
- tests are updated so they validate the new route-local structure instead of the removed file layout

## When to use this skill

Use it when the current implementation looks like this:
- `src/app/.../page.tsx` imports a large page-specific content object from `src/content/**`
- `page.tsx` also imports a page-specific orchestrator like `*Sections` from `src/components/sections/**`
- the main copy is hidden in nested objects instead of living near the JSX
- the user wants parity with the top-page / AI Dashi route-local authoring direction

Do not use it for:
- publication list/detail routes
- CMS/data-backed routes unless the user explicitly asks
- pages whose main complexity is backend/data logic rather than static authoring

## Inputs you should gather first

Before editing, identify:
- target route file
- old page-specific content file(s)
- old page-specific orchestrator/wrapper component(s)
- reusable section helpers that should remain extracted
- tests/helpers that read the old file paths directly
- completion rules from the user, including whether this should be a single PR or stacked PRs

A good task packet usually contains:
- target worktree path and branch name, if continuing existing work
- latest known example commits or reference routes
- files already changed in a prior partial attempt
- deletions expected at the end
- exact verification/PR requirements

## Mandatory repo workflow

1. Start from the latest `origin/main`.
2. Use a git worktree, not the main checkout.
3. If the user explicitly tells you to continue an existing worktree/branch, validate that worktree and continue there.
4. Do not start a local dev server unless the user explicitly asks.
5. Avoid repeated local `npm install` when the existing workspace already has what you need.
6. Rebase onto the latest `origin/main` again before push/PR update.

## Reference patterns in this repo

Read these before refactoring:
- `docs/code-location-conventions.md`
- the current target `page.tsx`
- the current page-specific content module
- the current page-specific wrapper/orchestrator component
- an aligned route-level example such as `src/app/solutions/ai-dashi/page.tsx`

If the user references specific merged commits as the canonical direction, inspect those commits too before editing.

## Refactor workflow

### 1. Inspect the current implementation shape

Read:
- target `page.tsx`
- old content registry file, often under `src/content/**`
- old wrapper/orchestrator component, often under `src/components/sections/**`
- related tests/helpers under `tests/**`

Map what belongs in each bucket:
- must move into `page.tsx`
- may stay as a tiny local array/constant inside `page.tsx`
- should remain extracted because it is shared or interactive
- should move to a small dedicated route-adjacent/shared constants file because multiple surfaces still need the same URL constants

### 2. Keep only the right extracted pieces

Good to keep extracted:
- small shared UI primitives
- isolated client-only interactive sections
- clearly reused visual helpers already shared by multiple pages
- tiny shared route constants files when the values are reused by multiple surfaces and are not a giant content registry

Bad to keep extracted:
- one big `HomePageSections`/`AiCrewSections`-style wrapper that hides most of the page
- one big `homePageContent`/`<page>Content` object that stores almost all marketing copy and section composition
- a top-level content registry copied from the old module into `page.tsx` with only the file location changed
- the same giant registry merely split into many section-level top-level constants such as `const hero = { ... }`, `const roles = { ... }`, `const contact = { ... }` while the route still reads as `data blob first, JSX second`
- an external page-specific wrapper merely moved into the route and renamed as a local helper such as `function AICrewSections()` or `function HomeSections()` while it still hides most of the authored page structure

Important rule:
Do not consider the refactor complete if you merely moved a giant object from `src/content/**` into the top of `page.tsx`.
The point is to make the route readable, not to preserve the same indirection in a different file.

Also do not consider the refactor complete if you only:
- break the old giant object into many section constants at the top of `page.tsx`, or
- copy the old page-specific wrapper into the same file as a large local `*Sections()` function.

Those are only location changes. They are not yet route-local authoring in the intended sense.

### 3. Move authoring into `page.tsx`

Preferred implementation style:
- write headings, paragraphs, CTA labels, and section structure directly in JSX where practical
- keep small repeated arrays local inside `page.tsx` only when they improve readability, for example:
  - cards
  - steps
  - use-case summaries
  - small badge/link lists
- keep metadata strings route-local instead of referencing old content registries

A good outcome is that a reviewer can open only `page.tsx` and understand:
- the page purpose
- the section order
- the main Japanese copy
- the CTA wiring
- which small helpers remain shared

### 4. Delete obsolete page-specific layers

Once the route-local version is in place:
- remove old page-specific content files that no longer serve a valid purpose
- remove old page-specific orchestrator/wrapper files that are no longer used
- search for leftover imports/usages of those files in tests, helpers, floating guides, or sibling routes

If one small shared constant still needs to survive, re-home only that small constant rather than preserving the old giant file.

### 5. Update tests and helpers in the same change

Common test migration pattern:
- replace exact dependence on `src/content/<page>.ts` with a route-local source reader
- replace exact dependence on `src/components/sections/<page>-sections.tsx` with either:
  - `page.tsx`, or
  - `page.tsx` + the few shared interactive section files that still legitimately remain

Examples of helpful test helper functions:
- `get<Page>DataSource()` -> combine `page.tsx` with any small surviving shared constants file
- `get<Page>StructureSource()` -> combine `page.tsx` with the few remaining shared interactive section sources

Test intent should remain stable:
- preserve CTA invariants
- preserve required copy/section markers
- preserve route-local readability expectations
- allow the file layout to evolve away from the old content registry pattern

Do not weaken tests so they merely accept the same old abstraction after it is moved locally.
Examples of bad post-refactor assertions:
- requiring a large local `function <Page>Sections()` wrapper to exist
- checking only that content moved from `src/content/**` into top-level `const hero = ...` / `const contact = ...` blobs

Prefer tests that confirm the route now owns the page authoring surface, not tests that bless an intermediate mechanical relocation.

### 6. Verification

Default for this user:
- do not start a local dev server
- prefer the lightest relevant verification first
- avoid long passive waits

Recommended order:
1. targeted tests for the touched route/helpers
2. `npm run test:ci` if the change touches broad route/test structure
3. `npm run build` if the change is deployment-sensitive or the user explicitly wants it

If the repo/worktree already has dependency resolution available, prefer using it directly instead of repeating install steps.

### 7. Final git workflow

Before finalizing:
- `git fetch origin --prune`
- rebase the branch onto `origin/main`
- re-run the relevant verification after the rebase if anything changed materially
- commit with an English message
- push the branch
- open the PR

Unless the user explicitly says otherwise, the task is not complete until:
- commit exists
- branch is pushed
- PR exists and is reviewable

## Common pitfalls

- planning from stale local `main` instead of latest `origin/main`
- editing the main checkout instead of a worktree
- continuing an old worktree without validating its current base
- recreating the giant content object inside `page.tsx`
- leaving the old content/orchestrator files in place after the move
- forgetting that tests may still read removed file paths directly
- widening scope into CMS/data-backed routes that the user did not authorize
- starting a local dev server even though CI/targeted checks are sufficient
- spending time on repeated installs in a fresh worktree when the existing environment can already run the relevant checks

## Suggested resume-prompt template

Use this template when you want to resume the same refactor class in a fresh session.
Replace placeholders with concrete values.

```text
Continue the corp-web-japan static-page route-local authoring refactor.

Current goal:
- Refactor `<target-page>` toward the same route-local authoring direction as `<reference-example>`.
- Remove the giant content registry layer and page-specific orchestrator layer.
- Move the real marketing copy into `page.tsx`.
- Keep section components only when they are truly reusable or isolated interactive helpers.
- Finish in a single PR unless otherwise noted.

Required constraints:
- Start from latest `origin/main`.
- Use worktree `<worktree-path>`.
- Use branch `<branch-name>`.
- Do not modify the main checkout.
- Do not start a local dev server.
- Avoid repeated local npm install when possible.
- Final done condition is commit + push + PR creation.

Already known references:
- Reference routes/commits: `<commits-or-files>`
- Current target route: `<page.tsx>`
- Old content source: `<content-file>`
- Old orchestrator: `<sections-file>`
- Small shared constants/helpers that may survive: `<files>`

Still required:
1. Update `<page.tsx>` to route-local authoring.
2. Delete `<old-content-file>` when fully unused.
3. Delete `<old-wrapper-file>` when fully unused.
4. Update tests/helpers:
   - `<test-file-1>`
   - `<test-file-2>`
   - `<helper-file>`
5. Recheck latest `origin/main`, rebase if needed, run relevant tests, then commit/push/open PR.

Implementation guidance:
- Avoid recreating a giant nested content object inside `page.tsx`.
- Keep metadata strings route-local.
- Keep repeated arrays minimal and local.
- Keep canonical route unchanged unless explicitly requested.
```

## Minimal execution summary

When this skill applies:
1. validate latest-main + worktree state
2. inspect the target route, old content module, old orchestrator, and affected tests
3. move real copy/section order into `page.tsx`
4. keep only small shared/interactive helpers extracted
5. delete obsolete page-specific content/wrapper files
6. update tests/helpers to the new source shape
7. verify with the lightest meaningful checks
8. rebase, commit, push, and open the PR
