# Repository Guidelines

This file is the working guide for AI agents such as Codex, Claude Code, and similar tools.
Humans can read it too, but it exists to support agent execution, safety, and consistency.

## Shared principles

These principles apply to both humans and AI agents.

- Keep changes small, focused, and easy to review.
- Prefer structured content in `src/content/` over inline copy when possible.
- Keep docs, implementation, and tests aligned.
- Verify changes with the lightest command that proves correctness.
- If something is ambiguous, choose the smallest change that satisfies the request.
- Write repository-internal documentation, guidance, comments, PR titles, and PR descriptions in English so they are readable for collaborators who work in English or Japanese.

## Project stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS v4
- npm

## Before you work

1. Read `README.md` for project context.
2. Identify whether the task is copy, layout, UI, or implementation work.
3. Check whether a relevant Skill applies, and load it before doing the work.
4. Confirm the active branch and worktree before editing.
5. Prefer a new worktree for branch-isolated work.

## Skill discovery

At the start of every user turn in this repository:

1. Discover available skills from these sources, in order:
   - Session-provided skill list, if present
   - Repo-local skills under `.agents/skills/<name>/SKILL.md`
   - Your built-in/system skill directories for the active agent runtime
2. Build a short in-memory registry with:
   - `name`
   - `description`
   - `path to SKILL.md`
3. Match the user task against that registry.
4. Load only the minimum `SKILL.md` and linked files needed.

Current rule: when this repository contains checked-in agent skills, treat `.agents/skills/` as the canonical repo-local skill root.
Use `.agents/skills/README.md` as the first local index, then load the specific skill directory you need.

## Trigger rules

- If the user names a skill explicitly, use that skill.
- If the task clearly matches a skill description, use that skill even without an explicit name.
- If the task is adding or updating public MDX publication content, check `.agents/skills/README.md` and load `mdx-publication-operations` first, then load the narrowest matching family wrapper (`blog-posting`, `whitepaper-posting`, `news-posting`, `events-posting`, `use-case-posting`, `aip-demo-posting`, `acp-demo-posting`, `introduction-deck-posting`, `glossary-posting`, or `manuals-posting`).
- If multiple skills match, use the minimum set and state the execution order briefly.
- Do not carry skill activation across turns unless re-triggered.

## Work rules

- Use a worktree for branch-isolated work.
- Make the smallest change that satisfies the request.
- Keep docs and implementation aligned.
- Prefer source content files over inline strings for copy changes.
- Do not make unrelated edits or opportunistic refactors.
- Verify the result before finishing.

## Copy / content tasks

- For copy updates, edit the actual file by default.
- Prefer `src/content/` instead of hardcoding strings in components when possible.
- Do not change design, layout, or implementation unless the user explicitly asks.
- If a requested copy change would require a code or design change, stop and ask for confirmation.

## UI / implementation tasks

- Follow surrounding file style and existing component patterns.
- Keep pages thin: route files should compose content and shared sections, while reusable logic stays in `src/lib/` or `src/components/`.
- Do not introduce `src/features/**` as a new implementation convention; use `src/lib/**`, `src/components/ui/**`,
  `src/components/sections/**`, or route-local `src/app/**` according to responsibility.
- Prefer the smallest wrapper surface that clearly expresses responsibility. Avoid overlapping wrapper layers unless each layer has a proven, distinct responsibility in current use.
- Do not split a layout into multiple always-paired wrappers like `LegalDocumentSection` + `LegalDocumentShell` unless the separation is truly necessary and materially simplifies reuse or variation.
- Favor clearer component/layer ownership and simpler `page.tsx` composition over speculative abstraction. If two wrappers are effectively inseparable, prefer a single component that owns the combined structure.
- For the current general code-location conventions, see `docs/code-location-conventions.md`.
- Use the existing stack and conventions already present in the repo.
- Notify the user before any non-text change if the request did not explicitly include it.
- Keep page-level default text color conventions consistent across the site: use `text-slate-950` on the route-level `main` wrapper by default, use `text-slate-600` for ordinary descriptive/body copy unless a component already owns a different shared style, and avoid route-local custom hex text colors unless the user explicitly asks for a visual exception or a shared token layer is being introduced.
- Apply cursor semantics consistently in UX work: interactive controls such as buttons, clickable cards, disclosure triggers, and menu toggles should show `cursor-pointer`, while static text, headings, and other non-interactive copy should keep the default arrow cursor unless editing or text selection is intentional.
- Prefer enforcing the cursor affordance contract in global CSS for standard semantics (`a[href]`, `button:not(:disabled)`, `summary`, `[role="button"]`, form text inputs, and editable text) so `.tsx` markup stays minimal and the browser behavior stays consistent.
- When a UI surface mixes controls and text, verify the cursor in the browser so hover behavior matches the interaction model (pointer for controls, arrow for titles and body copy).

## URI path conventions

- Prefer a site-wide URI architecture, not one-off route naming decisions.
- Keep top-level marketing and solution pages on concise, human-readable paths.
- Keep collection pages clearly distinct from individual postings/articles.
- Favor natural user-facing nouns first, then choose singular vs. plural based on whether the path represents a collection page or an individual item.
- Avoid mixing singular and plural forms for the same collection at the same hierarchy level.
- Avoid introducing legacy-style catch-all content buckets when a clearer content-specific path is available.

### Site-wide content URI architecture

- Use `/` for the top page.
- Use `/solutions/{solution-name}` for solution landing pages.
- Use `/demo/{section-name}` for demo and showcase surfaces.
- Keep resource index pages at the top level when they act as user-facing content hubs.
- Prefer content-type-specific top-level indexes over generic content hubs.
- Deprecate unused or misleading local routes rather than keeping placeholder paths alive.

### Recommended final URI scheme

- Top page:
  - Home: `/`
- Solutions:
  - AI Crew: `/solutions/ai-crew`
  - AI Dashi: `/solutions/ai-dashi`
- Demo / redirect surfaces:
  - Use cases redirect: `/demo/use-cases`
- Resource indexes:
  - Blog index: `/blog`
  - Whitepaper index: `/whitepapers`
- Resource detail routes:
  - Blog detail: `/blog/:id/:slug`
  - Whitepaper detail: `/whitepapers/:id/:slug`
- Event surfaces:
  - Event detail: `/events/:id/:slug`
  - Event index: `/events` only when the page is intentionally unblocked for launch

### Resource-specific rules

- For resource index/list pages, prefer collection-style paths.
- Use `/blog` for the blog index. Treat `blog` as a collection noun; prefer `/blog` over `/blogs`.
- Use plural paths for resource collections whose singular form reads like an individual document or item.
- Prefer `/whitepapers` over `/whitepaper` for the whitepaper index.
- Prefer `/events` over `/event` for the events index.
- Keep index/list pages local when they serve as curated hubs for this website.
- If an index page remains local, keep the local index URI stable and update only the card/link destinations according to the chosen content model.

### Posting and article policy

- Blog detail pages are currently local canonical routes under `/blog/:id/:slug`.
- Whitepaper detail pages are currently local canonical routes under `/whitepapers/:id/:slug`.
- For every public detail route with an `id`, keep the `id` as the lookup key and redirect `/section/:id` or mismatched slugs to the canonical `/section/:id/:slug` route.
- Do not introduce or preserve generic `/posts/...` routes in `corp-web-japan`; use canonical resource detail routes such as `/blog/:id/:slug`, `/whitepapers/:id/:slug`, and `/events/:id/:slug`.
- Event content should use canonical `/events` routes rather than legacy `/posts/...` compatibility surfaces.

### ID-based detail route canonicalization

- Apply this rule to every public detail route that includes an `id` path segment.
- Use the `id` as the lookup key for the content record. Do not require the trailing slug to match in order to load the document.
- Treat the trailing slug as a canonical display segment, not as part of the primary lookup key.
- If the request is missing the slug and the route shape allows `/section/:id`, redirect to the canonical `/section/:id/:slug` URL.
- If the request includes a slug but it does not match the record's canonical slug, redirect to the canonical `/section/:id/:slug` URL.
- Support both `/section/:id` and `/section/:id/` as valid entry URLs when the canonical detail route is `/section/:id/:slug`.
- Only return `notFound()` when the `id` itself does not resolve to a record.

## Missing-path redirect and 404 handling

- Treat `src/app/[...missing]/page.tsx` plus `src/lib/querypie-content-redirect.ts` as the source of truth for unmatched-path behavior.
- Only redirect missing paths that match the maintained QueryPie allowlist categories: exact validated paths, sitemap-backed file-like paths, or approved content namespaces.
- Preserve the incoming query string when building an allowed redirect target.
- Do not add speculative broad redirects for unmatched paths that have not been explicitly validated.
- If a path is not on the allowlist, keep the local not-found flow and runtime logging intact.

## Publication MDX content rules

Use these rules when editing local blog or whitepaper content.

- Blog source lives under `src/content/blog/*.mdx`.
- Whitepaper source lives under `src/content/whitepapers/*.mdx`.
- Keep required frontmatter aligned with the current loaders: `id`, `slug`, `title`, `description`, `date`, `heroImageSrc`, and `relatedIds`.
- Whitepapers may additionally use `listDescription` and `gated: true` when the current whitepaper flow requires them.
- Blog list items are derived from MDX frontmatter through `src/lib/publications/blog/records.ts`.
- Whitepaper list items are derived from MDX frontmatter through `src/lib/publications/whitepapers/records.ts`.
- Whitepaper gating uses frontmatter `gated: true` plus the `<GatingCut />` marker instead of wrapper-style gated components.
- Shared gating helpers live in `src/lib/publications/gating.ts`, and the current internal reference route is `/internal/whitepaper-gating-demo`.
- For local-only browser verification of contact-us and whitepaper gating flows, see `docs/local-e2e.md`.
- Blog and whitepaper detail metadata currently set `robots.index = false` and `robots.follow = false`; keep doc changes aligned with that implementation unless the user explicitly changes the indexing policy.
- For AI-agent execution, load `.agents/skills/mdx-publication-operations/SKILL.md` first for public MDX publication maintenance.
- Then load the narrowest matching family wrapper from `.agents/skills/` for the target content root.

## Contact-us redirect query-prefill contract

Use this contract when wiring any CTA, button, banner, or in-page action through `https://querypie.ai/contact-us` or a local `/contact-us` endpoint that redirects to `https://www.querypie.com/ja/company/contact-us`.

### Purpose

- Keep CTA URLs locale-independent and stable.
- Let the redirect preserve prefill intent into the upstream Japan contact form.
- Follow the stable query-string API introduced in `querypie/corp-web-app` PR #612:
  - https://github.com/querypie/corp-web-app/pull/612

### Redirect behavior

- The redirect target is `https://www.querypie.com/ja/company/contact-us`.
- The redirect must preserve the incoming query string exactly.
- Do not translate, rename, or drop supported prefill params during the redirect.
- Unknown params may pass through unchanged, but only the documented prefill params below are part of the supported contract.

### Supported query params

- `inquiry=<stable-key>`
  - single-value param for the visible inquiry / objective select
- `product=<stable-key>`
  - repeatable param for the visible product multi-select
  - example: `?product=ai-dashi&product=aip`

Do not use Salesforce field names such as `Objective__c` or localized Japanese labels as the public query API.

### Supported `inquiry` keys

Use only these stable keys:

- `ai-consulting`
- `download`
- `demo-request`
- `quote-request`
- `technical-question`
- `partnership`
- `other`

Expected mapping on the Japan contact form:

- `ai-consulting` -> `AI導入・活用について相談`
- `download` -> `資料ダウンロード`
- `demo-request` -> `デモを依頼`
- `quote-request` -> `お見積もり依頼`
- `technical-question` -> `技術的な質問`
- `partnership` -> `パートナーシップ`
- `other` -> `その他`

### Supported `product` keys

Use only these stable keys:

- `ai-crew`
- `ai-dashi`
- `aip`
- `acp`
- `fde`
- `partnership`

Expected mapping on the Japan contact form:

- `ai-crew` -> `社内業務効率化｜AI Crew`
- `ai-dashi` -> `自社サービスAI化｜AI Dashi`
- `aip` -> `AIプラットフォーム QueryPie AIP`
- `acp` -> `アクセス制御プラットフォーム QueryPie ACP`
- `fde` -> `AI専門家伴走 (FDE) サービス`
- `partnership` -> `パートナーシップ`

### Public URL examples

- `https://querypie.ai/contact-us?inquiry=demo-request`
- `https://querypie.ai/contact-us?inquiry=ai-consulting&product=ai-dashi`
- `https://querypie.ai/contact-us?inquiry=download&product=aip`
- `https://querypie.ai/contact-us?inquiry=demo-request&product=ai-crew&product=aip`

### CTA authoring rules

- Prefer the stable keys above for all new CTA links.
- Keep user-facing labels in Japanese, but keep query params in stable English keys.
- Use repeated `product` params when multiple products should be preselected.
- Ignore unsupported or unknown keys rather than guessing a fallback mapping.
- If the CTA intent is a true direct file download rather than a contact-form prefill, link to the real download destination instead of forcing `/contact-us`.

## Verification

- Run the relevant checks before considering the work complete.
- Use `npm run test:ci` for PR-style verification when applicable.
- Run `npm run build` when the change affects production rendering, metadata, routing, or deployment candidates.
- Check the real browser when layout, spacing, or visual hierarchy changes.
- For local-only hosted browser checks that already exist in this repo, see `docs/local-e2e.md` before adding a new ad-hoc browser workflow.
- Prefer CI or hosted preview validation over starting a new local dev server.
- Do not start `npm run dev` unless the user explicitly requests a local preview or no other practical verification path exists.
- When adding a new public page, removing a public page, or changing a public page URI, update the corresponding entry in `src/app/sitemap.ts` in the same change unless the route is intentionally non-indexed or launch-gated.
- When a page change affects the canonical public URL, keep the page metadata and `src/app/sitemap.ts` aligned.

## Pull request workflow

If the user wants a PR, perform the full workflow automatically:

1. create a new branch
2. make the requested changes
3. run the relevant checks (`npm run test:ci`)
4. create a commit
5. push the branch
6. open a pull request

Branch names, commit messages, and PR title/body must be written in English.
Do not ask for step-by-step confirmation unless credentials, permissions, or repository access are missing.

## Local preview

Local preview is optional in this repository.

- Do not start `npm run dev` by default.
- Use CI, preview deployments, static inspection, and targeted checks first.
- Start a local development server only when the user explicitly asks for it or when a visual/browser-only issue cannot be verified another way.

## Chikako mode

If the user says `"Chikako"` or identifies themselves as Chikako, enter Chikako mode immediately.

### Purpose

Chikako mode is for copywriting and content updates.
Interpret Chikako requests as execution requests by default, not brainstorming requests.
Chikako requests must be handled as implementation tasks unless the user explicitly asks for proposals only.

### Default rule

Copy and text content changes are the default scope.
Code, layout, styling, components, and design changes are allowed when requested.

If a request involves changes beyond text/copy, explicitly notify the user what non-text changes will be made before proceeding.
Do not make unrelated edits.
Do not refactor implementation.
Do not make opportunistic improvements outside the requested scope.
Do not stop at suggestions or alternative phrasing unless the user explicitly asks for options only.
When the user provides text and asks Chikako to improve or revise it, update the actual file by default.
Suggestion-only responses are not allowed unless the user explicitly asks for suggestions, options, alternatives, or brainstorming.
After applying the change, do not add unsolicited alternative copy suggestions.
Report the completed edit directly and concisely.

### Copy editing rule

Prefer updating source content files over inline strings whenever possible.
Apply the selected or most natural copy directly to the relevant files.
When the user provides a sentence and asks Chikako to improve it, revise it, shorten it, strengthen it, clarify it, or make it more natural, update the actual file immediately by default.
Do not answer with copy proposals only when a direct file edit is possible.
If multiple alternatives are possible, choose the most natural option and apply it unless the user explicitly asks to compare options.
If the user provides a sentence and asks Chikako to make it more natural, clearer, shorter, stronger, or more readable, treat that as a direct file-edit request unless the user explicitly asks for proposals only.

### Safety rule

When a request is ambiguous, choose the smallest change that fulfills the request.
If non-text changes are needed, always notify the user before applying them.
