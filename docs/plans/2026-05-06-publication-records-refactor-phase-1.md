# Publication Records Refactor Status and Remaining Work

> For Hermes: this memo replaces the older phase-oriented note with a latest-`main` baseline. It should describe what is already true on `main`, not preserve the state of the original phase-1 PR.

## Goal

Keep the publication helper architecture documented against the current `main` implementation so future refactors do not restart from stale assumptions.

## Current latest-main baseline

The publication refactor is no longer at an early phase.
As of the current `main`, the helper rollout has already crossed these boundaries:

- shared records repository extraction
- shared related-items extraction
- shared standard post-loader extraction
- dedicated gated whitepaper post-loader extraction
- category-local publication file paths

This means the older follow-up plan that treated news/blog post-loader migration, whitepaper boundary isolation, and category-local path cleanup as future work is now outdated.

## Current helper layout on `main`

### 1. Shared records repository helper

Shared helper:
- `src/lib/publications/create-standard-records-repository.ts`

Current adopters:
- `src/lib/publications/use-cases/records.ts`
- `src/lib/publications/demo/aip/records.ts`
- `src/lib/publications/demo/acp/records.ts`
- `src/lib/publications/events/records.ts`
- `src/lib/publications/blog/records.ts`
- `src/lib/publications/whitepapers/records.ts`
- `src/lib/publications/news/records.ts`

Current helper responsibilities:
- frontmatter block detection
- YAML parsing
- content-root scanning
- `sourcePath` attachment
- descending numeric-id sorting
- hidden-record filtering for list pages
- redirect-aware href derivation
- default resource-card list item construction
- custom list item construction via `createListItem(record, href)`
- description override via `getListItemDescription(record)`
- badge override via `getListItemBadge(record)`
- precomputed `records`, `listItems`, `listParams`, `listIds`, and `getRecord`

Current category-specific extension points in wrappers:
- frontmatter normalization per category
- whitepaper list-description override via `getListItemDescription(...)`
- news custom list-item shape via `createListItem(...)`
- event badge selection via `getListItemBadge(...)`

### 2. Shared related-items helper

Shared helper:
- `src/lib/publications/build-related-publication-items.ts`

Current helper responsibilities:
- explicit `relatedIds` passthrough exactly as authored
- self-id exclusion
- same-category fallback to the most recent three other records
- redirect-aware href derivation for related items
- optional date formatting passthrough from the loader layer

Current consumers:
- `src/lib/publications/create-standard-publication-post-loader.ts`
- `src/lib/publications/create-gated-publication-post-loader.ts`

The category-local post-loader wrappers no longer own their own related-items builders.

### 3. Shared standard post-loader helper

Shared helper:
- `src/lib/publications/create-standard-publication-post-loader.ts`

Current adopters:
- `src/lib/publications/use-cases/get-post.ts`
- `src/lib/publications/demo/aip/get-post.ts`
- `src/lib/publications/demo/acp/get-post.ts`
- `src/lib/publications/events/get-post.ts`
- `src/lib/publications/news/get-post.ts`
- `src/lib/publications/blog/get-post.ts`

Current helper responsibilities:
- body-source caching and reading
- MDX rendering
- author resolution for registered authors
- TOC extraction
- final `PublicationPost` assembly for the non-gated path
- integration with `buildRelatedPublicationItems(...)`
- optional date formatting hook

### 4. Dedicated gated post-loader helper for whitepapers

Shared helper:
- `src/lib/publications/create-gated-publication-post-loader.ts`

Current adopter:
- `src/lib/publications/whitepapers/get-post.ts`

Current helper responsibilities:
- body-source caching and reading
- `<GatingCut />` source splitting
- preview/full/gated render branching
- gated content-key generation
- TOC extraction from the preview source for gated content
- final `PublicationPost` assembly for the gated path
- integration with `buildRelatedPublicationItems(...)`

This is an important architecture boundary on current `main`:
whitepaper is no longer “still separate and waiting for a decision” at the top level.
The decision has already been made to isolate gating-specific behavior in a dedicated helper rather than forcing it into the standard helper.

### 5. Category-local path cleanup is already done

Current category-local paths already exist on `main`:
- `src/lib/publications/blog/records.ts`
- `src/lib/publications/blog/get-post.ts`
- `src/lib/publications/blog/items.ts`
- `src/lib/publications/news/records.ts`
- `src/lib/publications/news/get-post.ts`
- `src/lib/publications/whitepapers/records.ts`
- `src/lib/publications/whitepapers/get-post.ts`
- `src/lib/publications/events/records.ts`
- `src/lib/publications/events/get-post.ts`
- `src/lib/publications/use-cases/records.ts`
- `src/lib/publications/use-cases/get-post.ts`
- `src/lib/publications/demo/aip/records.ts`
- `src/lib/publications/demo/aip/get-post.ts`
- `src/lib/publications/demo/acp/records.ts`
- `src/lib/publications/demo/acp/get-post.ts`

The old flat filenames are already gone.
Path cleanup should no longer be listed as upcoming work in this plan.

## Current architecture-test baseline

Relevant architecture / structure tests currently present on `main`:
- `tests/src/lib/publications/records-repository-architecture.test.mjs`
- `tests/src/lib/publications/standard-publication-post-loader-architecture.test.mjs`
- `tests/src/lib/publications/gated-publication-post-loader-architecture.test.mjs`
- `tests/src/lib/publications/related-publication-items-architecture.test.mjs`
- `tests/src/lib/publications/category-local-paths.test.mjs`

What these already cover well:
- standard post-loader adoption includes use-cases, AIP demo, ACP demo, event, news, and blog
- whitepaper gating is isolated behind a dedicated gated helper
- related-items logic is centralized behind one helper
- category-local file paths exist and legacy flat files are removed

What is still uneven:
- `tests/src/lib/publications/records-repository-architecture.test.mjs` currently asserts only a subset of the records-helper adopters (`use-cases`, `demo/aip`, `demo/acp`, `news`)
- the same repo already has `events`, `blog`, and `whitepapers` on the shared records helper, but that broader baseline is not described in that specific architecture test

That gap is now more about documentation / architecture-test framing than about product behavior.

## What is no longer remaining work

The following items should not be described as pending anymore:

- migrate news post loader to the shared standard post-loader
- migrate blog post loader to the shared standard post-loader
- decide whether whitepaper should remain separate or gain a dedicated helper
- perform category-local path cleanup after helper boundaries stabilize

All of those are already reflected in the current codebase.

## Remaining work

There is no obvious mandatory “Phase 2” product-facing refactor left in this helper line.
The remaining tasks are narrower and should be treated as cleanup / maintenance work.

### Remaining task A: align the records-helper architecture test with the actual helper baseline

Objective:
- make `tests/src/lib/publications/records-repository-architecture.test.mjs` match the real latest-`main` records-helper adoption story

Why this matters:
- the codebase already uses the records helper for `events`, `blog`, and `whitepapers`
- the current test still reads like an earlier intermediate milestone
- future readers can misinterpret that as “the rest are still pending” even though the code already moved on

Preferred direction:
- either expand that test to cover every current records-helper adopter
- or explicitly rename / narrow its purpose so it is clear that it validates only the custom-extension subset rather than the full adopter list

Guardrail:
- do not rewrite route-behavior tests just to make the architecture test broader
- keep this as structure/documentation alignment, not feature work

### Remaining task B: keep the current low-level loader duplication as-is unless it grows materially

Current duplication still visible between:
- `src/lib/publications/create-standard-publication-post-loader.ts`
- `src/lib/publications/create-gated-publication-post-loader.ts`

Duplicated concerns currently include:
- body-source cache setup and file reading
- author-building logic
- some top-level `PublicationPost` assembly shape

Current decision:
- keep this duplication as-is for now
- do not schedule an immediate helper-internal deduplication PR

Rationale:
- the duplication is currently limited to two small top-level helpers
- the standard and gated flows are intentionally distinct and still read clearly in their current form
- introducing another abstraction layer now would likely add indirection without enough payoff

Future trigger for reconsideration:
- if a third loader style appears
- if both helpers continue to grow in parallel
- if the duplicated low-level code expands materially beyond the current scope

If that future trigger is hit, the preferred follow-up remains small and low-level only, for example:
- shared `buildPublicationAuthor(...)`
- shared body-source cache / reader utility
- a tiny lower-level post-base assembler that does not mix gated and non-gated branching into one helper

Guardrails:
- do not collapse standard and gated flows back into one mega-helper
- do not reintroduce category conditionals for whitepaper gating into the standard loader
- keep the current “two top-level helpers, one non-gated and one gated” boundary unless future growth makes a narrowly scoped extraction clearly worthwhile

### Remaining task C: keep this memo as a latest-main status memo, not another stale phase note

Objective:
- whenever the helper architecture changes again, update this document so it continues to reflect the current baseline rather than a historical slice

Practical rule:
- if a future PR changes helper adoption or helper boundaries, update this memo in the same PR
- do not create another follow-up plan that describes already-landed migrations as if they were still hypothetical

## Recommended next-step order

If follow-up work is requested, the safest order is:

1. documentation / architecture-test alignment for the records-helper baseline
2. otherwise stop and keep the current architecture stable
3. revisit low-level loader deduplication only if future growth materially increases the duplicated code surface

## What not to do next

Do not open another broad “finish publication helper refactor” task that bundles together:
- architecture-test alignment
- helper-internal deduplication
- unrelated path churn
- any new related-items schema redesign

Also do not reopen cross-publication related-items design inside the current helper line.
The current contract is category-local `relatedIds`, and any cross-publication relationship system should be introduced only as a separate schema change.

## Verification guidance

For docs-only updates like this memo:
- verify the statements directly against the latest `main` helper files and architecture tests

For future helper-maintenance work:
- run the architecture test for the helper layer being changed
- run the affected publication-family routing tests
- run `npx tsc --noEmit --pretty false` when helper signatures change

## Expected outcome

After this memo update:
- the plan matches the real latest-`main` helper architecture
- already-completed refactors are no longer presented as future work
- the only active follow-up task is architecture-test alignment for the records-helper baseline
- low-level standard/gated loader duplication is explicitly kept as-is for now and revisited only if it grows materially
- future follow-up work can start from the real current baseline instead of a stale mid-refactor snapshot
