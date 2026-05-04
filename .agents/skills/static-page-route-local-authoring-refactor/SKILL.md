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

Move the real marketing copy ownership into the route file itself, using the same section-scoped route-authoring pattern proven in PRs 155, 156, 157, and 158.

Preferred end state:
- `page.tsx` shows the real copy and the route-level section composition directly
- the route owns the migrated section's headings, lead copy, body copy, and CTA labels in JSX
- giant page-specific content registries are reduced or removed section by section
- giant page-specific orchestrator components are reduced over time, but may temporarily remain as shells during a staged migration
- only small reusable UI primitives or isolated interactive helpers remain extracted
- tests are updated so they validate the new route-local section ownership instead of the removed file layout

Important nuance from PRs 155–158:
- the intended workflow is usually **section-scoped migration**, not one giant whole-page rewrite
- a PR can be fully correct even if the page still keeps a temporary shared shell such as `TopPageSections`, as long as the target section's marketing copy now clearly lives in `page.tsx`
- the key question is not "did we delete every wrapper yet?" but "does the route now own the authored copy for the section we moved?"

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

## Scope lock before editing

Before you write any code, explicitly classify the intended PR shape.

Preferred order of interpretation:
1. whole-page final refactor
2. section-scoped refactor
3. comparison/experiment PR for exactly one named section

Important rule learned from AI Dashi follow-up work:
- if the user's real goal is "make one section fully correct," do **not** opportunistically refactor neighboring sections in the same PR just because they are adjacent or currently similar
- choose the *hero scope* of the PR first, and keep that scope visible in both the diff and the final PR description
- when the user says a specific section should be the only fully refactored result, treat every other section as preserve-by-default unless a supporting change is strictly required

Practical checklist:
- name the target section(s) before editing
- list the neighboring sections that must stay minimally changed
- decide which files are allowed to be added for the target section only
- decide whether the PR is meant to demonstrate a reusable pattern or only to complete one narrow section

If you cannot state the target section in one short sentence, the scope is probably still too broad.

## Section-complete-first rule

For this repository, a narrow PR with one *fully completed* section is better than a broad PR with many half-finished sections.

When the user wants a section-scoped refactor:
- finish that section to the intended end-state standard
- keep the rest of the page as unchanged as practical
- do not dilute the review by mixing in unrelated partial cleanups elsewhere on the page

A section counts as fully complete when:
- the visible marketing copy for that section is authored in `page.tsx`
- `page.tsx` shows the section composition directly
- the implementation details for that section live under `src/components/sections/**`
- the section no longer depends on a page-level content blob or prop-shaped copy object for its real user-facing sentences
- the PR diff makes it obvious that *this specific section* is the completed outcome

## If scope drifts mid-PR

If you discover that the branch has already accumulated broader refactor changes than the user actually wants:
- stop widening the scope
- identify the intended hero section of the PR
- revert or remove non-hero-section refactor changes unless they are strictly required support work
- keep only the minimal surrounding edits necessary for the hero section to function and remain reviewable

Important lesson from PR 193 follow-up:
- if one section becomes the true completed result and the rest of the page is still intermediate, prefer rewriting the PR so only that completed section stands out
- do not leave unrelated extracted files or partial route-localization work in the branch just because they were already written once
- a narrower PR with one clearly correct section is easier to review, easier to explain, and less likely to create misleading precedent in the skill itself

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

For this repository, the most important concrete references are the section-scoped top-page refactors in:
- PR 155 — move top-page platform requirements authoring into `src/app/page.tsx`
- PR 156 — move top-page security authoring into `src/app/page.tsx`
- PR 157 — move top-page whitepaper authoring into `src/app/page.tsx`
- PR 158 — move top-page final CTA authoring into `src/app/page.tsx`

Treat those PRs as the canonical pattern when the user says "this repo's route-local authoring style".

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
- a temporary shared page shell/orchestrator when you are intentionally migrating one section at a time and the shell still provides the surrounding layout for untouched sections
- section component files that have been reduced to UI-only structure/styling wrappers while the moved section's marketing copy now lives in `page.tsx`
- section-level primitives or semantic wrapper components under `src/components/sections/**` that are composed directly from `page.tsx`

Bad to keep extracted:
- one big `HomePageSections`/`AiCrewSections`-style wrapper that still owns the target section's marketing copy after the migration
- one big `homePageContent`/`<page>Content` object that still owns the target section's headings/body/CTA text after the migration
- a top-level content registry copied from the old module into `page.tsx` with only the file location changed
- the same giant registry merely split into many section-level top-level constants such as `const hero = { ... }`, `const roles = { ... }`, `const contact = { ... }` while the route still reads as `data blob first, JSX second`
- JSON-like or object/array-based marketing copy declarations inside `page.tsx`, such as `const cards = [{ title, body }]`, `const section = { title, body, cta }`, or `const items = [...]`, when the main purpose is to store visible page copy rather than tiny incidental labels
- prop-shaped copy APIs such as `intro={{ title: ..., body: ... }}`, `section={{ ... }}`, or large `items` arrays whose values are the real user-facing marketing sentences
- an external page-specific wrapper merely moved into the route and renamed as a local helper such as `function AICrewSections()` or `function HomeSections()` while it still hides most of the authored page structure
- passing a giant raw JSX section blob as a prop such as `contactSection={<section ...>...</section>}` or `aboutSection={<section ...>...</section>}` from `page.tsx` into a shared shell component

Important rule:
Do not consider the refactor complete if you merely moved a giant object from `src/content/**` into the top of `page.tsx`.
The point is to make the route readable, not to preserve the same indirection in a different file.

Also do not consider the refactor complete if you only:
- break the old giant object into many section constants at the top of `page.tsx`, or
- copy the old page-specific wrapper into the same file as a large local `*Sections()` function, or
- move a whole section's implementation blob into a `page.tsx` prop passed to an old shell component.

Those are only location changes. They are not yet route-local authoring in the intended sense.

Important staged-refactor rule from PRs 155–158:
- the existence of a temporary shared shell is **not** itself a failure
- it becomes a failure only if that shell still owns the migrated section's marketing copy
- if the target section's visible copy now lives in `page.tsx`, while the shell only places that section among other not-yet-migrated sections, that is an acceptable intermediate state
- however, even in this acceptable intermediate state, the migrated section's implementation should still live under `src/components/sections/**`; `page.tsx` should compose section components, not inject a giant raw JSX section blob into a shell prop

### 3. Move authoring into `page.tsx`

Preferred implementation style:
- write headings, paragraphs, CTA labels, and section structure directly in JSX where practical
- keep metadata strings route-local instead of referencing old content registries
- prefer direct authored markup like:
  - `<SectionTitle>...</SectionTitle>`
  - `<SectionBody>...</SectionBody>`
  - `<CardTitle>...</CardTitle>`
  - `<CardBody>...</CardBody>`
- when emphasis is needed, prefer authored JSX such as `<strong>...</strong>` or small inline elements in the route instead of hiding the sentence in a data object

Most important implementation rule from PRs 155–158:
- move **one target section at a time** into route-local authoring when that is the cleanest path
- in that migration PR, `page.tsx` should visibly own that section's copy
- the corresponding section component should shrink toward a UI-only shell or slot wrapper
- do not require unrelated sections on the same page to migrate in the same PR if that makes the change harder to review
- if the PR is intentionally comparison-only or section-only, prefer leaving neighboring sections on their previous implementation rather than partially refactoring them in the same branch

A good route-authored section usually looks like:
- route-local JSX in `page.tsx`
- explicit text nodes and small inline emphasis
- section-level composition that can be read top-to-bottom without opening the old content file
- any surviving section component used primarily as a visual wrapper, not as the owner of marketing prose

A good outcome is that a reviewer can open only `page.tsx` and understand:
- the page purpose
- the section order
- the main Japanese copy for the migrated section(s)
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
- allow a staged section-scoped migration where a shared page shell still exists, as long as the migrated section's copy ownership moved to `page.tsx`

Do not weaken tests so they merely accept the same old abstraction after it is moved locally.
Examples of bad post-refactor assertions:
- requiring a large local `function <Page>Sections()` wrapper to exist
- checking only that content moved from `src/content/**` into top-level `const hero = ...` / `const contact = ...` blobs
- requiring the temporary shell to be deleted immediately even when the intended PR scope is only one section migration

Prefer tests that confirm the route now owns the migrated section's authoring surface, not tests that bless an intermediate mechanical relocation or punish a deliberate staged migration.

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
- losing PR focus by partially refactoring neighboring sections after the user only asked for one section to be fully completed
- keeping earlier experimental extracts in the branch after deciding that only one section should remain as the showcased completed result

## Suggested resume-prompt template

Use this template when you want to resume the same refactor class in a fresh session.
Replace placeholders with concrete values.

```text
Continue the corp-web-japan static-page route-local authoring refactor.

Current goal:
- Refactor `<target-page>` toward the same route-local authoring direction as `<reference-example>`.
- Complete the hero section `<hero-section>` to the intended end-state standard.
- Keep neighboring sections `<preserve-sections>` minimally changed unless strictly required support work is needed.
- Remove the giant content registry layer and page-specific orchestrator layer only within the approved scope.
- Move the real marketing copy for the hero section into `page.tsx`.
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
