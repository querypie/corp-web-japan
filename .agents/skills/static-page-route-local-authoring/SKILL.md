---
name: static-page-route-local-authoring
description: Keep a static marketing route readable and route-local by making `page.tsx` the primary authoring surface while extracted sections own only UI implementation details.
version: 1.2.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [corp-web-japan, static-page, route-local-authoring, refactor, nextjs]
---

# Keep a static marketing route readable and route-local

Use this skill when the route file should stay the primary readable authoring surface.

It is a support skill, not a migration-phase skill.
Use it whenever `page.tsx` should own the copy and section composition while extracted sections own only UI implementation details.

## Goal

Move the real marketing copy ownership into the route file itself, using the same section-scoped route-authoring pattern proven in PRs 155, 156, 157, and 158.

Preferred end state:
- `page.tsx` shows the real copy and the route-level section composition directly
- the route owns the migrated section's headings, lead copy, body copy, and CTA labels in JSX
- giant page-specific content registries are reduced or removed section by section
- giant page-specific orchestrator components are reduced over time, but may temporarily remain as shells during a staged migration
- only small reusable UI primitives or isolated interactive helpers remain extracted
- tests are updated so they validate the new route-local section ownership instead of the removed file layout

## File-location contract

Route-local authoring is an ownership/readability rule, not a component-colocation rule.

Default locations:
- `src/app/<route>/page.tsx` owns route entry, metadata, visible copy, section order, and composition.
- `src/components/sections/**` owns section/UI component implementations, layout classes, styling details, visual primitives, and isolated client-side behavior.

Do not interpret "route-local" as "put UI component files beside `page.tsx`."
For normal static marketing and internal demo pages, `src/app/<route>/` should not accumulate files like `hero-section.tsx`, `faq.tsx`, `role-slides.tsx`, or `use-case-showcase.tsx` unless the user explicitly asks for a route-adjacent exception.

Allowed route-adjacent exceptions are narrow and content-oriented:
- App Router required files such as `page.tsx`, `layout.tsx`, `loading.tsx`, `not-found.tsx`, and `route.ts`.
- Route-local long-form source files such as `content.mdx` for legal/document pages when that route intentionally owns the document source.
- Small route-only helpers only when keeping them in `page.tsx` would clearly hurt readability and they are not reusable UI section components.

When extracting UI from `page.tsx`, choose a section/component path under `src/components/sections/**`, usually grouped by page family or ownership, for example:
- `src/components/sections/home/*`
- `src/components/sections/ai-crew/*`
- `src/components/sections/ai-dashi/*`
- `src/components/sections/internal-demo/*`

If you are about to create `src/app/<route>/<component-name>.tsx`, stop and re-check whether it is actually one of the route-adjacent exceptions above. If not, put it under `src/components/sections/**` instead.

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
- widget / application-contract pages whose upstream implementation already depends on a meaningful compound-component chain, tab/visibility state contract, or data-matrix renderer contract

Important anti-misuse rule:
- this skill helps static marketing routes stay readable; it is **not** permission to redesign every migrated page into route-local arrays/objects
- if the upstream page is already authored clearly through JSX compound components, keep that authoring model unless you have a concrete reason to change it
- do not convert an upstream widget page into a fresh local `const cards = [...]`, `const sections = [...]`, or `products={[...]}` API merely because those props look route-local
- preserve the upstream page's authoring boundary first, then apply route-local cleanup only where it is truly presentation-only

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

Important rule learned from late-stage AI Crew follow-up work:
- when the user asks for section-split PRs on a page that may already have multiple route-local migrations merged, inspect latest `origin/main` and recent file history first before deciding the PR plan
- do not assume the remaining work still matches an older broad PR branch or earlier migration plan
- first identify which sections are already merged on `main`, then create PRs only for the truly remaining route-local or hidden-copy cleanup units
- if an older broad PR is still open but now conflicts with `main`, prefer replacing it with new narrow PRs from latest `origin/main` rather than continuing to pile follow-up commits onto the stale broad branch
- for user requests like "split by section and do them simultaneously," the correct output can be a small set of remaining independent PRs in parallel, not one PR per historical section name

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
- the migrated section still appears in the same rendered page order relative to its neighboring sections as before the refactor

Practical pattern confirmed on `/t/about-us` follow-up work:
- even when a route is already technically route-local because everything lives in one `page.tsx`, it can still fail the intended readability standard if the page hides major content in large top-level data arrays such as `const timeline = [...]`, `const leaders = [...]`, or `const locations = [...]`
- in that case, a valid refactor is to move those user-facing entries into direct JSX in `page.tsx` while extracting only UI/layout primitives into a dedicated section file such as `src/components/sections/about-us.tsx`
- good outcome:
  - `page.tsx` shows the real timeline entries, leader names/roles, and location copy directly
  - the extracted section file owns card/grid/layout/image/link styling primitives only
- add a narrow page-specific structure test that asserts both sides of the contract:
  - `page.tsx` imports and composes the new section primitives directly
  - the old top-level data arrays are gone from the route
  - the new section module exports the intended UI primitive set

Practical pattern confirmed on `/t/platforms/acp` follow-up work:
- a route can look partially refactored even after a server-safe section file and a dedicated client widget file already exist, if the route still keeps a large top-level object/array blob such as `const categories = [...]` whose nested fields contain the real marketing copy
- when the page includes one interactive browser/tab/carousel section, do not keep that marketing copy inside a JSON-like data structure just because the client widget needs structured input
- preferred end state:
  - `page.tsx` authors each category/item in JSX directly
  - the client widget consumes `children`-based semantic elements such as `FeatureCategory` and `FeatureItem`
  - the static section file keeps only layout primitives for the surrounding section shell and neighboring non-interactive sections
- this pattern is especially useful when a user explicitly objects to lingering JSON-props / data-blob authoring even after a first-pass route-local refactor
- good outcome:
  - the route no longer defines top-level `type ...Item`, `type ...Category`, or `const categories = [...]` blobs for the interactive section's real copy
  - the client widget parses typed child elements with `Children.toArray(...)` / element guards, so interactivity stays isolated without pulling authored copy back out of `page.tsx`
  - the structure test asserts both the route-owned JSX category/item authoring and the client/server boundary split

## Second-stage cleanup after a section is already route-local

A route-local section can still deserve a follow-up refactor even after its copy ownership is already in `page.tsx`.

Important lesson from AI Crew platform-card follow-up work:
- once a section's copy already lives in the route, the next useful cleanup can be reducing the section helper toward smaller UI-only primitives
- this kind of PR is appropriate when the route still hides meaningful section composition behind a helper contract like `icon`/`variant` props or other bundled structural shortcuts
- the goal is not to move more copy; the goal is to make the route's JSX show the section composition more explicitly while pushing the shared file closer to a pure primitive layer

Good examples of valid second-stage cleanup:
- replacing a single bundled card API with smaller primitives such as `CardHeader`, `CardIcon`, and `CardText`
- keeping the visible copy in `page.tsx` but exposing more of the section's semantic composition there
- removing layout hacks that became unnecessary after the primitive split
- when a first-pass refactor over-corrects into dozens of page-specific thin wrappers or massive duplicated JSX blocks, rebalancing toward a clearer middle ground: route-local semantic data for repetitive homogeneous cards, plus one extracted shared card renderer that absorbs presentation-only concerns like image-slot sizing
- when a first-pass route already moved most copy into `page.tsx` but still hides meaningful structure behind local compound aliases such as `const Pricing = Object.assign(...)`, `const Plan = Object.assign(...)`, or big prop blobs like `<CompareTable rows={[...]} columns={[...]} />`, flattening those back into direct route-authored JSX primitives such as `<PricingHeader>`, `<PlanCard>`, `<CompareTableSection>`, `<CompareTableRow>`, and explicit cell components

Practical pattern confirmed on `/t/plans` follow-up work:
- a route can look "already route-local" at first glance because the visible copy lives in `page.tsx`, yet still fall short of the intended readability standard if the route keeps:
  - local compound-component alias wrappers created with `Object.assign(...)`
  - large comparison-table prop blobs where real labels/values are still packed into `rows` / `columns` arrays
- in that situation, a valid follow-up refactor is:
  - remove the local alias wrappers and import/render the real primitives directly in `page.tsx`
  - replace data-blob table props with direct JSX composition in the route, using reusable section primitives like `CompareTableHead`, `CompareTableSection`, `CompareTableRow`, `CompareTableTextCell`, and boolean/check-label cell helpers
  - keep the section module responsible only for reusable pricing/table UI behavior and styling, not for decoding authored comparison content structures
- good outcome:
  - the route no longer defines `const Pricing = Object.assign(...)` / `const Plan = Object.assign(...)`
  - the route no longer passes giant semantic content blobs such as `rows={[...]}` and `columns={[...]}` into a generic renderer
  - reviewers can read the actual plan-table composition directly from `page.tsx`
  - the structure test explicitly locks both sides of the contract: direct primitive composition remains in the route, and the section module stays limited to exported UI primitives

Review rule for this kind of PR:
- ask whether the route becomes a clearer authoring surface after the change
- ask whether the shared section file becomes more UI-only rather than more magical
- reject the PR if it merely churns markup without improving route-local readability or primitive boundaries

Test rule for this kind of PR:
- add or update a narrow structure-oriented test so the route-local composition intent is explicit in the diff
- useful assertions include:
  - the route now renders the new primitive names directly
  - the section helper exports the new primitive building blocks
  - the route still owns the same visible copy after the primitive split
- this is especially valuable when the visual output changes little, because otherwise the PR can look like unnecessary markup churn during review

## Render-order preservation rule

For section-scoped route-local authoring work, preserving page section order is mandatory.

Important lesson from AI Crew PR 219 follow-up:
- a section can be "route-localized" correctly in isolation yet still be wrong if it is pulled out of a shared shell and reinserted at the wrong point in the page
- this commonly happens when the target section sits between two sections that are still owned by a temporary shared shell
- in that situation, extracting only the middle/later section can silently reorder the rendered page even if all copy and tests still look mostly correct

Practical rule:
- before extracting one section from a still-shared shell, map the live/latest-main rendered order explicitly
- identify which sections before and after the target are still owned by the shell
- do not move the target section outside that shell unless you also preserve its exact relative slot in the final `page.tsx`

Safe patterns:
1. extract sections in real page order from top to bottom when possible
2. if the target section is not the first remaining section inside a shared shell, split the shell first into before/after pieces so the target can be inserted in the correct slot
3. verify rendered order against latest `origin/main` or the specified live/stage reference before finalizing

Explicit failure case:
- if latest main renders `process -> platform -> use-cases -> results`, it is wrong to refactor only `use-cases` into route-local JSX as `process -> use-cases -> platform/results-shell`
- even though the target section's copy ownership moved into `page.tsx`, the PR is still incorrect because the page order changed

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

### Worktree freshness gate

Before editing in an existing PR or follow-up branch, explicitly verify whether the local worktree is still a trustworthy base.

Minimum checks:
```bash
git status -sb
git rev-parse HEAD origin/<branch>
git rev-list --left-right --count HEAD...origin/<branch>
```

Interpretation:
- if `HEAD` equals `origin/<branch>` and the worktree is clean, it is a valid starting point
- if the worktree is ahead/behind/diverged, do **not** continue editing there just because its directory name matches the branch
- if the worktree contains unrelated residue from prior attempts, prefer a fresh detached worktree from `origin/<branch>` or `origin/main`

Important lesson from AI Crew PR 190 follow-up:
- a stale local PR worktree can silently drag old experiments, outdated conflict resolutions, or mixed post-main history into the next follow-up
- when in doubt, recreate the worktree from the remote branch tip and verify the SHA before editing

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

### 1a. Decide early whether this is a normal section migration or a rewrite-on-main case

Before you start editing, classify the branch condition as one of two modes:

1. normal section migration
   - the branch is already based on a recent `origin/main`
   - the current PR/worktree does not contain stale structural history
   - you can safely implement the scoped refactor in place

2. rewrite-on-main
   - the open PR branch predates important merged main changes
   - the branch contains intermediate or experimental commits that no longer represent the user's desired final diff
   - the user is dissatisfied with the overall refactor direction, not just one bug
   - preserving old branch ancestry would make the PR harder to reason about than rebuilding the final intended file set on top of latest `origin/main`

When the second mode applies, prefer rebuilding the intended final state on top of a clean latest-main worktree rather than trying to salvage the old branch mechanically.

Important practical rule from AI Crew PR 190:
- if the user says the current PR is "not the expected level of refactoring" and the branch also trails `origin/main`, treat that as a strong rewrite-on-main signal
- in that case, inspect the old PR only to recover the intended outcome, then reconstruct that outcome cleanly on top of latest `origin/main`

### 2. Keep only the right extracted pieces

Good to keep extracted:
- small shared UI primitives
- isolated client-only interactive sections
- clearly reused visual helpers already shared by multiple pages
- tiny shared route constants files when the values are reused by multiple surfaces and are not a giant content registry
- a temporary shared page shell/orchestrator when you are intentionally migrating one section at a time and the shell still provides the surrounding layout for untouched sections
- section component files that have been reduced to UI-only structure/styling wrappers while the moved section's marketing copy now lives in `page.tsx`
- section-level primitives or semantic wrapper components under `src/components/sections/**` that are composed directly from `page.tsx`
- internal demo widgets under `src/components/sections/internal-demo/**` when they are intentionally rendered from a noindex internal route

Bad to keep extracted:
- UI component files colocated under `src/app/<route>/` merely because the route is "route-local"; route-local authoring does not mean route-adjacent component placement
- route-adjacent files such as `src/app/<route>/hero-section.tsx`, `src/app/<route>/faq.tsx`, or `src/app/internal/demo-sections/role-slides.tsx` unless they are explicitly approved exceptions
- one big `HomePageSections`/`AiCrewSections`-style wrapper that still owns the target section's marketing copy after the migration
- one big `homePageContent`/`<page>Content` object that still owns the target section's headings/body/CTA text after the migration
- a top-level content registry copied from the old module into `page.tsx` with only the file location changed
- the same giant registry merely split into many section-level top-level constants such as `const hero = { ... }`, `const roles = { ... }`, `const contact = { ... }` while the route still reads as `data blob first, JSX second`
- JSON-like or object/array-based marketing copy declarations inside `page.tsx`, such as `const section = { title, body, cta }` or giant heterogeneous `const items = [...]`, when the main purpose is to store visible page copy rather than tiny incidental labels
- prop-shaped copy APIs such as `intro={{ title: ..., body: ... }}`, `section={{ ... }}`, or large `items` arrays whose values are the real user-facing marketing sentences

Important exception learned from `/t/certifications` follow-up work:
- for a highly repetitive static grid of homogeneous cards, a small route-local JSON array can still be the more readable authoring surface than fully inlining dozens of near-identical JSX card bodies
- this is acceptable only when the route still clearly owns the visible content entries (for example `title`, short `description` lines, `src`, and `alt`) and the extracted section component owns the actual card rendering/UI
- do not let this exception regress into per-item presentation hacks in the route data; image sizing classes, width/height props, or variant-only-for-layout fields should move into a shared UI container inside the section component
- preferred pattern for card/image-heavy grids: keep semantic item data in `page.tsx`, render through a dedicated section/card component under `src/components/sections/**`, and normalize logo/image presentation with one shared container using `object-contain` or equivalent layout rules instead of per-item `className` tuning
- title/text emphasis that is inferred inside a section component by substring matching (for example detecting `AI Crew` and auto-wrapping it with highlight markup) instead of being authored explicitly at the route level
- an external page-specific wrapper merely moved into the route and renamed as a local helper such as `function AICrewSections()` or `function HomeSections()` while it still hides most of the authored page structure
- a large local section helper such as `function SupportSection()` or `function ReleaseFlowSection()` when it still owns that section's real headings, prose-heavy arrays, CTA text, and JSX structure together
- relocating a former top-level blob into `function SomeSection() { const items = [...] ... }` while the route body now only shows `<SomeSection />`
- passing a giant raw JSX section blob as a prop such as `contactSection={<section ...>...</section>}` or `aboutSection={<section ...>...</section>}` from `page.tsx` into a shared shell component

Important anti-regression rule from AI Dashi follow-up work:
- moving `const supportItems = [...]` or `const releaseFlow = [...]` out of file scope is **not** enough if the same prose-heavy data and section markup are merely re-hidden inside a local helper such as `function AIDashiSupportSection()`
- that reduces top-level clutter, but it does not yet make the route body the primary readable authoring surface
- if the default export body becomes less readable because the section collapsed to a single helper call, treat the refactor as still incomplete

Important rule:
Do not consider the refactor complete if you merely moved a giant object from `src/content/**` into the top of `page.tsx`.
The point is to make the route readable, not to preserve the same indirection in a different file.

Also do not consider the refactor complete if you only:
- break the old giant object into many section constants at the top of `page.tsx`, or
- copy the old page-specific wrapper into the same file as a large local `*Sections()` function, or
- move a whole section's implementation blob into a `page.tsx` prop passed to an old shell component.

Those are only location changes. They are not yet route-local authoring in the intended sense.

Explicit failure case:
- do not consider the refactor successful if a former top-level content blob is merely moved into a large local section helper inside `page.tsx`
- relocating `const cards = [...]`, `const supportItems = [...]`, or `const releaseFlow = [...]` into `function SomeSection()` is still an intermediate mechanical relocation unless the route body now clearly shows the section's authored copy/composition

Important staged-refactor rule from PRs 155–158:
- the existence of a temporary shared shell is **not** itself a failure
- it becomes a failure only if that shell still owns the migrated section's marketing copy
- if the target section's visible copy now lives in `page.tsx`, while the shell only places that section among other not-yet-migrated sections, that is an acceptable intermediate state
- however, even in this acceptable intermediate state, the migrated section's implementation should still live under `src/components/sections/**`; `page.tsx` should compose section components, not inject a giant raw JSX section blob into a shell prop

## UI drift prevention checklist

Use this checklist whenever the user asked for a refactor, migration, or authoring-location cleanup rather than a visual redesign.

Before coding:
- name the exact section whose visual output must remain unchanged
- identify the current file that is the visual source of truth for that section
- decide whether the task allows *any* visual implementation change; default is no unless the user explicitly asked

While editing:
- preserve the old wrapper element hierarchy unless a structural change is strictly required
- preserve the old class strings for box wrappers, borders, shadows, gradients, spacing, and hover behavior unless the user explicitly asked for a design change
- preserve the old icon set, icon positions, and icon absence; removing or adding icons is a visual change
- preserve text layout mechanics such as `whitespace-pre-line`, paragraph splitting, inline `<strong>` placement, and line-break strategy
- if you extract a section component, prefer moving the old JSX almost verbatim into the new component before making any abstraction decisions

Before pushing:
- compare the new section implementation against the old section JSX line by line
- search for newly introduced generic primitives such as `MarketingSurface`, `MarketingPill`, new button helpers, or new wrapper utilities that did not exist in the old section
- treat any such new primitive as suspicious unless it preserves the exact previous visual output
- if the preview URL is available, verify the actual deployed preview before declaring the refactor done

If the task is truly refactor-only, a good result is:
- route-local copy ownership changed
- file boundaries improved
- tests updated
- visual output stayed the same

### Visual-parity guardrail

When the old section already has acceptable UX, prefer this order:
1. copy the old section markup nearly verbatim into the new extracted section component
2. move copy ownership into `page.tsx` with the smallest possible API
3. verify visual parity
4. only then consider further abstraction in a separate PR

Do **not** combine all of these in one refactor-only PR:
- route-local authoring migration
- generalized visual primitive adoption
- button redesign
- icon redesign
- spacing cleanup based on taste

That combination is the fastest path to accidental UI drift.

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
- for highlighted keywords or gradient-emphasis title fragments, keep the emphasis decision explicit in `page.tsx` JSX rather than teaching a section component to detect and restyle a substring via `includes`, `split`, or other string-matching logic
- prefer semantic route authoring such as `...<strong>AI Crew</strong>...` when the intent is emphasis, and let the section wrapper/component style that semantic tag via wrapper-owned selectors such as `[&_strong]:...`
- in other words: the route owns the meaning of emphasis, while the section wrapper owns the visual treatment of that emphasis

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

Mandatory route-body readability check:
- inspect the default export's main route body in `page.tsx`, not just helper definitions above it
- ask: if I collapse all local helper functions and read only the route body, can I still see the migrated section's heading copy, main body copy, CTA labels, and composition clearly enough to review the page narrative?
- if the answer is no, the refactor is still incomplete even if the copy technically remains in the same file
- if replacing a section with `<LocalSectionHelper />` makes the route body less readable than before, that helper is too large for the intended route-local authoring standard

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
- inspect broader repo-level tests as well, not only the obvious section-structure test for the touched page
- explicitly search for CTA labels, route constants, or old content-registry strings that may still be asserted elsewhere in the test suite

Important practical finding from AI Crew PR 190:
- broader tests such as launch-readiness, CTA coverage, route-policy, or source-layout assertions can still encode the old source-of-truth location even after the section-specific structure test is updated
- when copy/CTA ownership moves from `src/content/**` into route-local JSX, update those broader tests in the same PR so they accept the new intended source shape
- if the repo is in an intentional staged transition, allow assertions that match either the old registry pattern or the new route-local markup only where that transition is still real; otherwise tighten directly to the final route-local form

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

Important safety rule from AI Crew PR 190:
- if you decide this is a rewrite-on-main case, do **not** perform the rewrite by staging changes in a stale PR worktree and then using `git reset --soft origin/main`
- on an old PR branch, that pattern can stage a large mixed diff that includes unrelated pre-main history or other stale branch residue
- instead, create a completely clean worktree from latest `origin/main`, reapply only the intended final file set, verify the scoped diff, commit once, and force-push that clean result back to the PR branch

Unless the user explicitly says otherwise, the task is not complete until:
- commit exists
- branch is pushed
- PR exists and is reviewable

## Common pitfalls

- planning from stale local `main` instead of latest `origin/main`
- editing the main checkout instead of a worktree
- continuing an old worktree without validating its current base
- trusting a PR-named worktree directory without checking whether `HEAD` still matches `origin/<branch>`
- trying to preserve a stale branch mechanically when the user actually wants a structure-level rewrite on top of latest main
- recreating the giant content object inside `page.tsx`
- changing a section's visual wrapper/classes/icons/spacing while doing a refactor-only authoring migration
- leaving the old content/orchestrator files in place after the move
- forgetting that tests may still read removed file paths directly
- updating only the obvious section-specific test while broader launch-readiness or CTA coverage tests still assume the old source-of-truth location
- widening scope into CMS/data-backed routes that the user did not authorize
- starting a local dev server even though CI/targeted checks are sufficient
- spending time on repeated installs in a fresh worktree when the existing environment can already run the relevant checks
- losing PR focus by partially refactoring neighboring sections after the user only asked for one section to be fully completed
- keeping earlier experimental extracts in the branch after deciding that only one section should remain as the showcased completed result
- mistaking "same file" for success when the real section copy/data/layout have simply been re-hidden inside a large local helper function
- allowing the route body to degrade from visible section narrative into a sequence of opaque helper calls such as `<SupportSection />`, `<FlowSection />`, or similar local wrappers
- using `git reset --soft origin/main` inside a stale PR worktree during a rewrite-on-main follow-up and accidentally staging unrelated branch history

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
