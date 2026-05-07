# Publication Records Refactor Status and Follow-up Plan

> For Hermes: this memo supersedes the original PR #270 phase-1 note. It records the latest `main` baseline after the subsequent publication-helper refactors through PR #293 and defines the next recommended follow-up sequence.

## Goal

Keep the publication helper refactor readable, incremental, and aligned with the latest `main` branch instead of preserving an outdated “phase 1 only” snapshot.

## Latest main baseline

The original PR #270 introduced the first shared records helper:
- `src/lib/publications/create-standard-records-repository.ts`

That baseline has already been expanded on `main` by later PRs:
- PR #277: event records migrated to the shared records helper
- PR #278: shared post-loader extracted as `create-standard-publication-post-loader.ts`
- PR #279: blog records migrated to the shared records helper
- PR #280: whitepaper records migrated to the shared records helper
- PR #281: news records migrated to the shared records helper
- PR #293: related-items behavior unified behind `build-related-publication-items.ts`

As of the latest `main`, the refactor status is:

### Shared records helper adopters

These record modules now use `createStandardPublicationRecordsRepository(...)`:
- `src/lib/publications/use-case-publication-records.ts`
- `src/lib/publications/aip-demo-publication-records.ts`
- `src/lib/publications/acp-demo-publication-records.ts`
- `src/lib/publications/event-publication-records.ts`
- `src/lib/publications/blog-publication-records.ts`
- `src/lib/publications/whitepaper-publication-records.ts`
- `src/lib/publications/news-publication-records.ts`

The shared records helper now owns:
- frontmatter block parsing
- YAML parsing
- content-root scanning
- `sourcePath` attachment
- numeric id sorting
- hidden-record filtering
- redirect-aware href derivation
- default resource-card list item construction
- custom list item construction via `createListItem(...)`
- `records`, `listItems`, `listParams`, `listIds`, and `getRecord`

### Shared related-items helper adopters

These publication post loaders now use `buildRelatedPublicationItems(...)`:
- `src/lib/publications/create-standard-publication-post-loader.ts`
- `src/lib/publications/get-publication-post.ts`
- `src/lib/publications/get-news-publication-post.ts`
- `src/lib/publications/get-whitepaper-publication-post.ts`

The shared related-items helper now owns:
- explicit `relatedIds` passthrough exactly as authored
- same-category fallback to the most recent three other records
- self-id exclusion
- redirect-aware href derivation for related cards

This matters because PR #293 also narrowed the current contract explicitly:
- `relatedIds: string[]` is currently category-local
- cross-publication related entries are not part of the current helper contract
- any future cross-publication related system should be a separate schema change, not an incidental option added to the current helper line

### Shared post-loader adopters

These post loaders now use `createStandardPublicationPostLoader(...)`:
- `src/lib/publications/get-use-case-publication-post.ts`
- `src/lib/publications/get-aip-demo-publication-post.ts`
- `src/lib/publications/get-acp-demo-publication-post.ts`
- `src/lib/publications/get-event-publication-post.ts`

The shared post-loader now owns:
- body-source caching
- MDX rendering
- author resolution for registered authors
- TOC extraction
- final `PublicationPost` assembly for the standard non-gated path
- integration with the shared same-category related-items helper

## What is still intentionally separate

The remaining non-shared post loaders are:
- `src/lib/publications/get-publication-post.ts` (blog)
- `src/lib/publications/get-news-publication-post.ts`
- `src/lib/publications/get-whitepaper-publication-post.ts`

Those files are still separate for understandable reasons, but PR #293 changed why they remain separate.
The remaining differences are now mostly about loader assembly shape, not about the related-items contract.

### Blog post loader

`get-publication-post.ts` no longer has a special related-items path.
After PR #293, it already uses the same `buildRelatedPublicationItems(...)` contract as the other post loaders.

Its remaining custom logic is mostly:
- local body-source caching and reading
- local author assembly inline in the loader file
- direct `PublicationPost` assembly in the category-specific file

That means blog is no longer blocked on any cross-publication related-items generalization.
If cross-publication related links are ever needed later, they should come back only with a new frontmatter schema rather than by reopening the current `relatedIds` contract.

### News post loader

`get-news-publication-post.ts` is still the smallest and clearest next post-loader migration target.

Its remaining custom logic is mostly:
- local `readNewsPublicationBodySource(...)`
- local author assembly inline in the loader file
- direct `PublicationPost` assembly in the category-specific file

Unlike whitepaper, news does not currently have a gating split or a different content-render pipeline.
That keeps news as the strongest next candidate for post-loader unification.

### Whitepaper post loader

`get-whitepaper-publication-post.ts` still owns real category-specific behavior:
- `<GatingCut />` splitting
- preview/full/gated render branching
- gated content-key generation
- TOC extraction from the preview source when gated

PR #293 removed the related-items discrepancy here too, but it did not reduce the actual gating-specific loader complexity.
Whitepaper should therefore remain explicit until the gating boundary is extracted deliberately.
It should not be forced into the current standard helper by adding ad hoc conditionals.

## Current gaps after the phase 2A alignment pass

The helper baseline is now documented coherently through PR #293, and the architecture tests cover the current helper adopters in each layer.

The remaining gaps are now implementation-focused:
- `get-news-publication-post.ts` still duplicates the standard non-gated post-loader shape
- `get-publication-post.ts` still keeps a category-local loader body even though PR #293 removed the old related-items divergence
- `get-whitepaper-publication-post.ts` still needs an explicit long-term boundary decision around the gating split
- the publication helper paths are still flat and verbose, but should not be renamed until the loader boundaries settle

## Recommended follow-up order

### Phase 2B: migrate the news post loader to the shared post-loader

Objective:
- make `get-news-publication-post.ts` a thin wrapper around `createStandardPublicationPostLoader(...)`

Why this should come next:
- news already shares the same non-gated MDX render path
- PR #293 already removed its local related-items builder
- its remaining duplication is mechanical rather than architectural

Expected file set:
- `src/lib/publications/create-standard-publication-post-loader.ts`
- `src/lib/publications/get-news-publication-post.ts`
- `tests/news/mdx-routing-and-preview.test.mjs`
- `tests/src/lib/publications/standard-publication-post-loader-architecture.test.mjs`

Preferred implementation direction:
- first check whether news can migrate with the current helper API exactly as-is
- if not, add the smallest explicit hook needed for news rather than introducing a broad abstraction jump
- avoid adding whitepaper-oriented complexity at this step

Done criteria:
- `get-news-publication-post.ts` no longer owns local body-source reading
- `get-news-publication-post.ts` no longer owns inline author assembly
- route behavior stays unchanged

### Phase 2C: migrate blog to the shared post-loader if the current API still fits

Objective:
- pull blog onto the shared post-loader now that PR #293 removed the old related-items divergence

Expected file set:
- `src/lib/publications/create-standard-publication-post-loader.ts`
- `src/lib/publications/get-publication-post.ts`
- `tests/blog/canonical-slug-routing.test.mjs`
- `tests/blog/frontmatter-visibility-and-redirect.test.mjs`
- `tests/src/lib/publications/standard-publication-post-loader-architecture.test.mjs`

Preferred implementation direction:
- first test whether blog can migrate with the current helper API exactly as-is
- if a small explicit hook is still needed, keep it narrowly scoped to loader assembly concerns rather than reopening related-items semantics
- do not reintroduce `buildRelatedPublications(...)`-style cross-publication logic under the current `relatedIds` schema

Guardrails:
- keep the current category-local `relatedIds` contract intact
- if future product requirements need cross-publication related links, handle that as a separate schema/change-set with explicit typing
- prefer one small loader-shape hook over a large “everything is configurable” helper surface

### Phase 2D: decide the whitepaper isolation boundary explicitly

Objective:
- determine whether whitepaper should remain a dedicated loader or whether its gated rendering should be extracted into a dedicated lower-level helper

Recommended decision rule:
- if the only meaningful whitepaper-specific difference remains the gated render split, extract a whitepaper-specific gated-render helper and keep the top-level loader thin
- if the gated flow still dominates the full loader shape, keep whitepaper separate and document it as a deliberate exception

Expected file set if refactored:
- `src/lib/publications/get-whitepaper-publication-post.ts`
- `src/lib/publications/gating.ts`
- optionally a new helper such as `src/lib/publications/create-gated-publication-post-loader.ts`
- whitepaper routing / gating tests only

Guardrails:
- do not mix whitepaper gating logic into the standard non-gated loader with category conditionals
- do not combine this step with any path-renaming work

### Phase 2E: perform category-local path cleanup only after helper boundaries settle

Objective:
- shorten the flat publication-helper filenames without creating another intermediate naming churn later

This should happen only after the records, related-items, and post-loader boundaries are stable.

Recommended target layout:
- `src/lib/publications/blog/records.ts`
- `src/lib/publications/blog/get-post.ts`
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

Why this is last:
- the current flat filenames are verbose, but stable
- renaming before helper convergence would multiply import churn across several PRs
- the path cleanup should reflect the final helper boundaries, not the pre-refactor intermediate state

## What not to do in the next PR

Do not combine all remaining publication-helper work into one broad “final cleanup” PR.

Avoid bundling together:
- docs/test alignment
- news post-loader migration
- blog post-loader migration
- whitepaper gating extraction
- category-local path renames

Those are separate review concerns and should remain reviewable as separate steps.

Do not reopen cross-publication related-items design inside the current helper line.
If that product requirement returns later, it should be proposed as an explicit schema change rather than smuggled in as a helper option.

## Verification guidance

For docs-only updates like this memo:
- verify the file content against the latest `main` implementation and helper adopters through PR #293

For future code follow-up PRs:
- run the narrow architecture tests for the helper layer being changed
- run the category routing tests for the affected publication family
- run `npx tsc --noEmit --pretty false` when helper signatures change

## Expected outcome

After the next follow-up sequence:
- the records-layer refactor history is documented accurately through PR #293
- the related-items contract boundary is explicit
- the next post-loader target is unambiguous (`news` first)
- blog and whitepaper follow-up work have explicit boundaries instead of an implied “just share more” direction
- path cleanup is deferred until the helper architecture stops moving
