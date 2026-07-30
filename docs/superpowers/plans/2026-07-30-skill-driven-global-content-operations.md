# Skill-driven Global Content Operations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace GitHub Actions Direct Ignore automation with repo-local publication and Ignore PR skills.

**Architecture:** Keep the Global-only report read-only. Remove Direct Ignore workflow/validator code and document two skills that read a fresh report, make reviewed manifest or content changes, and open normal PRs without auto-merge.

**Tech Stack:** GitHub Actions YAML, Node.js tests, Markdown skills, JSON manifests.

## Global Constraints

- Global SSOT remains `corp-web-v2 → corp-web-japan`.
- Identity is `${sourceSection}:${sourceId}`; bare `cnt_*` is invalid.
- `baseline.json` is the only Japan-present authority.
- Skills never auto-merge.
- Candidate evidence and mapping drift fail closed for Ignore PR creation.

---

### Task 1: Remove Direct Ignore automation

**Files:**
- Delete: `.github/workflows/ignore-global-content-diff.yml`
- Delete: `scripts/global-content-diff-report/direct-ignore-pr.mjs`
- Delete: `scripts/global-content-diff-report/ignore-eligibility.mjs`
- Delete: `scripts/global-content-diff-report/ignore-workflow.mjs`
- Delete: `scripts/global-content-diff-report/validate-ignore-pr.mjs`
- Modify: `.github/workflows/ci.yml`
- Modify: `tests/global-content-diff-report/global-content-diff-workflow.test.mjs`
- Delete: Direct-Ignore-only tests

- [ ] Delete the workflow and unused helper modules.
- [ ] Remove `ignore_manifest` detection, validator job, and its CI result dependency.
- [ ] Replace workflow contract tests with assertions that the read-only report workflow remains and Direct Ignore automation is absent.
- [ ] Run `node --test tests/global-content-diff-report/*.test.mjs`.

### Task 2: Add repo-local skills and docs

**Files:**
- Create: `.agents/skills/global-to-japan-publication/SKILL.md`
- Create: `.agents/skills/global-content-ignore/SKILL.md`
- Modify: `.agents/skills/README.md`
- Modify: `.github/content-sync/README.md`
- Modify: `scripts/global-content-diff-report/README.md`
- Modify: `README.md`
- Modify: `openspec/specs/contract-global-content-diff-report/spec.md`

- [ ] Write the publication skill with Composite identity input, content-family loading, exact baseline mapping, normal PR, and no auto-merge.
- [ ] Write the batch Ignore skill with fresh report selection, explicit exclusions, candidate/mapping-drift stop conditions, deterministic JSON update, normal PR, and no auto-merge.
- [ ] Register both skills in the root skill index.
- [ ] Replace Direct Ignore docs and OpenSpec requirements with skill-driven operation contracts.
- [ ] Run `npm run test:ci` and `git diff --check`.

### Task 3: Final verification

**Files:**
- Verify all changed and deleted paths.

- [ ] Confirm no Direct Ignore workflow, validator CI, or deleted helper imports remain.
- [ ] Confirm skill YAML frontmatter passes repository metadata tests.
- [ ] Run focused and full CI-equivalent tests.
- [ ] Commit, push, open a normal PR, and wait for CI. Do not auto-merge.
