# Local E2E Checks

This repository includes local-only Playwright checks for stage-facing browser flows.
These checks are intentionally separate from the standard CI workflow.

## Purpose

Use these checks when a task needs real browser interaction against a hosted environment such as stage.
Typical examples:
- form submission behavior
- gated/unlocked content flows
- cookie persistence
- query-prefill behavior
- browser-only regressions that source-level tests cannot prove

## Current local E2E inventory

### 1. Contact Us stage flow

- Test file: `tests-local/src/app/contact-us/page.e2e.mjs`
- npm script: `npm run e2e:local:contact-us:stage`
- Target page: `/contact-us` on the configured base URL

Current coverage:
- page render and core required fields
- stable query prefill behavior for valid values
- invalid inquiry/product prefills are ignored and duplicate valid product params are deduplicated
- query-prefilled fields still require the remaining mandatory inputs before submit becomes enabled
- free-email validation blocks submit until a business or educational address is provided
- submit flow against the current hosted environment behavior

### 2. Internal whitepaper gating demo on stage

### 3. News stage flow

- Test file: `tests-local/src/app/t/news/page.e2e.mjs`
- Test file: `tests-local/src/app/news/page.e2e.mjs`
- npm scripts:
  - `npm run e2e:local:news-list:stage`
  - `npm run e2e:local:news-detail:stage`
- Requested target base URL for this flow: `https://stage.querypie.com`
- Representative target page: `/t/news`

Current coverage intent:
- `/t/news` renders the news list page and local `/news/:id/:slug` card hrefs
- redirect-backed local news detail URIs (for example news 12) resolve to their configured external targets
- local-body news detail URIs (news 13 and news 14) render the local MDX body instead of redirecting away


- Test file: `tests-local/src/app/internal/whitepaper-gating-demo/page.e2e.mjs`
- npm script: `npm run e2e:local:whitepaper-gating:stage`
- Target page: `/internal/whitepaper-gating-demo` on the configured base URL

Current coverage:
- preview content is visible before unlock
- gated content remains hidden by default
- required gating fields enable submit when completed
- unlock succeeds against stage
- unlock cookie is issued
- unlocked content remains visible after reload because of cookie persistence

### 3. Blog pages on stage

- Test file: `tests-local/src/app/blog/page.e2e.mjs`
- npm script: `npm run e2e:local:blog:stage`
- Target pages: `/blog`, `/blog/:id`, and `/blog/:id/:slug` on the configured base URL

Current coverage:
- blog list renders the canonical page chrome and a representative visible card
- blog hidden entries remain absent from the list surface
- blog id-only routes redirect to the canonical slug URL
- blog mismatched slug routes redirect to the canonical slug URL
- visible blog detail renders title, author metadata, body heading, and related posts section
- hidden blog detail remains directly reachable while still excluded from the list

### 4. Whitepaper pages on stage

- Test file: `tests-local/src/app/whitepapers/page.e2e.mjs`
- npm script: `npm run e2e:local:whitepapers:stage`
- Target pages: `/whitepapers`, `/whitepapers/:id`, `/whitepapers/:id/:slug`, and redirecting hidden shadow routes on the configured base URL

Current coverage:
- whitepaper list renders the canonical page chrome and keeps the expected upstream card href contract
- whitepaper hidden shadow/redirect records remain absent from the list surface
- whitepaper id-only routes redirect to the canonical slug URL
- whitepaper mismatched slug routes redirect to the canonical slug URL
- gated whitepaper preview state renders title, author metadata, CTA, preview copy, and locked-state form affordances
- gated whitepaper hidden content appears only after form submit
- gated whitepaper unlock cookie persists the unlocked state across reload
- hidden redirect whitepaper shadow records resolve to the canonical local whitepaper detail route

## Base URL configuration

The local Playwright config reads only one base URL override:

- `LOCAL_E2E_BASE_URL`

Default when unset:
- `https://stage.querypie.ai`

Examples:

```bash
npm run e2e:local:whitepaper-gating:stage
npm run e2e:local:blog:stage
npm run e2e:local:whitepapers:stage
LOCAL_E2E_BASE_URL=https://stage.querypie.ai npm run e2e:local:contact-us:stage
```

## First-run setup

If Playwright browsers are missing locally, install Chromium once:

```bash
npx playwright install chromium
```

If `@playwright/test` is missing from the root dependency install, add it at the repository root before running the local E2E commands.

## CI relationship

These checks are local-only by design.

- They are not part of `npm run test:ci`.
- They are not run by the default GitHub Actions CI workflow.
- Keep them local unless the user explicitly asks to promote a flow into CI.

## When to use

Prefer these checks when the task depends on actual hosted browser behavior and a source-level test would be incomplete.

Examples:
- verifying a real stage form response
- verifying cookie-backed gating persistence
- checking a real redirect or query-prefill flow in the browser

For repository-wide PR verification, continue to use:

```bash
npm run test:ci
```
