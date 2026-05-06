# Publication Records Refactor Phase 1

> For Hermes: this memo documents the first-pass shared repository extraction for MDX publication records and the follow-up path toward category-local `records.ts` and `get-post.ts` layouts.

## Goal

Reduce repeated repository boilerplate in `src/lib/publications/**` without changing any public route behavior or widening the refactor beyond the three most duplicated record modules.

## Why this phase exists

The current publication-record modules repeat the same responsibilities:
- frontmatter block parsing
- source file scanning under a content root
- numeric-id sorting
- hidden-record filtering for list pages
- redirect-aware href derivation for list cards
- cached record/id/params accessors

The strongest duplication cluster is:
- `src/lib/publications/use-case-publication-records.ts`
- `src/lib/publications/aip-demo-publication-records.ts`
- `src/lib/publications/acp-demo-publication-records.ts`

These files differ mainly by:
- content root
- publication category
- badge label
- frontmatter type name
- frontmatter error label

## Phase 1 scope

Implement only:
- a shared repository helper for the standard record shape used by use-case, AIP demo, and ACP demo
- a small architecture regression test proving those three wrappers use the shared helper
- this design memo so the next refactor can proceed from an explicit baseline

Do not include in phase 1:
- post-loader unification
- blog/news/whitepaper/event repository migration
- category-directory renames such as `src/lib/publications/blog/records.ts`
- `get-post.ts` path renames

## Phase 1 implementation shape

Add:
- `src/lib/publications/create-standard-publication-records-repository.ts`

This helper should own:
- frontmatter block parsing
- `yaml` parsing
- source file enumeration
- source-path attachment
- id-desc sorting
- visible-record filtering
- redirect-aware list href generation
- `records`, `listItems`, `listParams`, `listIds`, and `getRecord`

Wrapper files should keep only:
- the category-specific frontmatter type
- the category-specific `normalize...Frontmatter()` function
- the repository instantiation config (`contentRoot`, `category`, `badge`)
- the existing exported API surface expected by routes and tests

## Why not refactor everything at once

Several publication modules still have category-specific behavior that should stay explicit until a later pass:
- whitepaper records: `listDescription`
- news records: `sourceLabel` and `opensExternal`
- blog/event loaders and related-item rules diverge from the demo/use-case trio
- whitepaper post loading has gating behavior
- news post loading strips the imported top-level title heading

A single broad base abstraction now would risk mixing unrelated concerns into one oversized helper.

## Recommended follow-up order

1. Migrate `event-publication-records.ts` to the same helper if its wrapper remains readable.
2. Add a second shared post-loader helper for the highly similar trio/quartet:
   - use-case
   - AIP demo
   - ACP demo
   - event
3. Re-evaluate whether `news` should share the same repository helper with small option hooks.
4. Re-evaluate whether `whitepaper` should share the repository helper while keeping loader/gating separate.
5. Only after that, consider directory restructuring for shorter names like:
   - `src/lib/publications/use-cases/records.ts`
   - `src/lib/publications/demo/aip/records.ts`
   - `src/lib/publications/demo/acp/records.ts`
   - `src/lib/publications/.../get-post.ts`

## Naming note for later path cleanup

Short names like `records.ts` and `get-post.ts` are reasonable only after publication modules move into category-local directories.

In the current flat layout, filename-only shortening would collide.

That future rename should therefore be paired with a directory split, not done in isolation.

## Verification for phase 1

Run:
- `node --test tests/src/lib/publications/records-repository-architecture.test.mjs`
- `node --test tests/use-cases-mdx-routing-and-preview.test.mjs tests/aip-demo-mdx-routing-and-preview.test.mjs tests/acp-demo-mdx-routing-and-preview.test.mjs`
- `npx tsc --noEmit --pretty false`

## Expected outcome

After phase 1:
- the three highest-duplication record modules share one repository helper
- routes and imports remain stable
- follow-up refactors can build on a smaller, proven abstraction rather than repeating the same repository code again
