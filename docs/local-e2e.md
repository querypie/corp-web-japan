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
- stable query prefill behavior
- submit flow against the current hosted environment behavior

### 2. Internal whitepaper gating demo on stage

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

## Base URL configuration

The local Playwright config reads only one base URL override:

- `LOCAL_E2E_BASE_URL`

Default when unset:
- `https://stage.querypie.ai`

Examples:

```bash
npm run e2e:local:whitepaper-gating:stage
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
