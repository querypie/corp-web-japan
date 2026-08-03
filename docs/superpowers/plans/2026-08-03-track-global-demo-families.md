# Track Global Demo Families Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Include every Global demo menu family in Global/Japan content reconciliation and baseline-map the 24 production-published Global use cases to their existing Japan MDX records.

**Architecture:** Extend the existing `SOURCE_FAMILIES` SSOT with demo descriptors, including optional empty source roots and nested Japan target roots. Keep production evidence authoritative: use cases enter the report because `/en/demo` links all 24; ACP/AIP remain excluded until their production list evidence exists. Add a skill preflight that compares latest Global menu categories, source roots, and Japan target menu paths before every report.

**Tech Stack:** Node.js ESM, JSON manifests, Node test runner, OpenSpec, repo-local agent skills.

## Global Constraints

- Canonical identity remains `${sourceSection}:${sourceId}`.
- Production list evidence remains mandatory.
- Baseline mappings require exact existing target MDX files.
- AI semantic review is required before adding baseline mappings.
- Ignore decisions remain user-approved only.
- Normal human-reviewed PR; no auto-merge.

---

### Task 1: Lock demo-family behavior with failing tests

**Files:**
- Modify: `tests/global-content-diff-report/core.test.mjs`
- Modify: `tests/global-content-diff-report/global-content-diff-report.test.mjs`
- Modify: `tests/global-content-diff-report/skill-driven-operations.test.mjs`

**Interfaces:**
- Consumes: existing `SOURCE_FAMILIES`, `sourceRoots`, report builder, and skill contract.
- Produces: regression coverage for demo mappings, optional roots, nested targets, and menu parity preflight.

- [ ] Add expected descriptors for `demo/use-cases`, `demo/acp-features`, and optional `demo/aip-features`.
- [ ] Add a fixture proving missing optional AIP root is accepted while missing required roots fail closed.
- [ ] Add a fixture proving nested target path `src/content/demo/acp/<id>-<slug>.mdx` is valid.
- [ ] Add skill assertions for latest-menu/source/target parity inspection.
- [ ] Run focused tests and confirm failures are caused by missing behavior.

### Task 2: Implement demo source and target support

**Files:**
- Modify: `scripts/global-content-diff-report/source-family-map.mjs`
- Modify: `scripts/global-content-diff-report/discovery.mjs`
- Modify: `scripts/global-content-diff-report/report.mjs`
- Modify: `scripts/global-content-diff-report/slack.mjs`

**Interfaces:**
- Consumes: descriptors with `optionalRoot`, `productionListUrl`, `canonicalSegment`, and nested `targetFamily`.
- Produces: production-evidenced demo inventory and safe nested Japan candidate/baseline paths.

- [ ] Add the three demo descriptors.
- [ ] Skip absent optional source roots and retain fail-closed behavior for required roots.
- [ ] Remove the invalid one-target-to-one-source descriptor assumption.
- [ ] Add plain Slack labels for nested demo targets.
- [ ] Run focused tests and confirm green.

### Task 3: Reconcile production use cases

**Files:**
- Modify: `.github/content-sync/baseline.json`

**Interfaces:**
- Consumes: fresh report candidate evidence and full Global/Japan source content.
- Produces: reviewed `demo:cnt_*` baseline mappings to existing `src/content/use-cases/*.mdx` records.

- [ ] Generate a fresh report from latest Global/Japan `main` snapshots.
- [ ] Review all 24 production use cases for title, summary, full body, date, slug, source, media, outline, claims, examples, products, conclusion, and ownership conflicts.
- [ ] Add only single unambiguous `Equivalent` mappings.
- [ ] Rerun the report and require zero newly introduced Untracked demo use cases.

### Task 4: Synchronize skill and durable contract

**Files:**
- Modify: `.agents/skills/global-content-operations/SKILL.md`
- Modify: `scripts/global-content-diff-report/README.md`
- Modify: `openspec/specs/contract-global-content-diff-report/spec.md`

**Interfaces:**
- Consumes: implemented menu/source/target mapping behavior.
- Produces: durable menu-family parity and optional-root operating contract.

- [ ] Require latest Global menu, source-root, Japan menu, and `SOURCE_FAMILIES` parity before report generation.
- [ ] Document production-evidence behavior for empty/unpublished demo families.
- [ ] Add testable OpenSpec scenarios for missing menu mappings and optional empty roots.

### Task 5: Validate and open a reviewed PR

**Files:**
- Review all modified files.

**Interfaces:**
- Consumes: Tasks 1–4.
- Produces: normal human-reviewed PR with no auto-merge.

- [ ] Run Global content focused tests.
- [ ] Run `npm run test:ci`.
- [ ] Run `git diff --check`.
- [ ] Run a fresh latest-main dry-run and record Global/Japan SHAs and final counts.
- [ ] Review the diff for unrelated changes and residual risk.
- [ ] Commit, push, and open the PR without merging it.
