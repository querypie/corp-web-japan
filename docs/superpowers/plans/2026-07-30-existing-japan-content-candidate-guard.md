# Existing Japan Content Candidate Guard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Detect deterministic existing-Japan candidates, show them without changing report authority, and prevent candidate or mapping-drift identities from entering Direct Ignore.

**Architecture:** A pure candidate scanner indexes Japan MDX once and attaches diagnostic `possibleJapanMatches` evidence to Global-only items. A pure `assessIgnoreEligibility` function is the single decision point for Direct Ignore and Ignore-PR validation. Baseline mappings remain the only Japan-present authority; reconciliation data changes ship in a separate PR after the guard is merged.

**Tech Stack:** Node.js ESM, `node:test`, YAML, GitHub Actions, GitHub CLI, OpenSpec, npm.

## Global Constraints

- Status remains exactly `Untracked` or `Ignored`.
- Candidate evidence never changes report membership, counts, or Japan-present authority.
- Report workflow remains read-only.
- No fuzzy/semantic matching and no automatic baseline mapping.
- URL query parameters remain unless included in the explicit tracking-parameter allowlist.
- Direct Ignore has no force, candidate-skip, or batch bypass.
- Every behavior change follows RED → GREEN → review.
- Candidate-guard implementation and manifest reconciliation use separate PRs.

---

### Task 1: Add candidate detector RED coverage

**Files:**
- Create: `tests/global-content-diff-report/candidate-matches.test.mjs`
- Create later: `scripts/global-content-diff-report/candidate-matches.mjs`

**Interfaces:**
- Produces test expectations for:
  - `normalizeCandidateText(value)`
  - `normalizeCandidateUrl(value)`
  - `indexJapanCandidateRecords({ targetRepo, targetFamilies? })`
  - `findPossibleJapanMatches({ globalItem, japanIndex })`

- [ ] **Step 1: Write the failing detector tests**

Cover:

```js
assert.deepEqual(matches, [{
  targetPath: "src/content/blog/33-what-is-forward-deployed-engineer-fde.mdx",
  targetId: 33,
  targetSlug: "what-is-forward-deployed-engineer-fde",
  signals: ["exact-slug"],
}]);
```

Also cover exact source URL, tracking allowlist removal, identity-bearing query preservation, exact original English title plus date, cross-family isolation, partial-match rejection, multiple candidates, malformed MDX, duplicate `targetFamily:targetId`, and duplicate target path.

- [ ] **Step 2: Run RED**

```bash
node --test tests/global-content-diff-report/candidate-matches.test.mjs
```

Expected: `ERR_MODULE_NOT_FOUND` for `candidate-matches.mjs`.

- [ ] **Step 3: Commit RED evidence**

```bash
git add tests/global-content-diff-report/candidate-matches.test.mjs
git commit -m "test: add Japan content candidate guard coverage"
```

---

### Task 2: Implement the deterministic candidate scanner

**Files:**
- Create: `scripts/global-content-diff-report/candidate-matches.mjs`
- Test: `tests/global-content-diff-report/candidate-matches.test.mjs`

**Interfaces:**
- `normalizeCandidateText(value): string`
- `normalizeCandidateUrl(value): string | null`
- `indexJapanCandidateRecords(...): Promise<{records, byTargetFamily}>`
- `findPossibleJapanMatches(...): PossibleJapanMatch[]`

`PossibleJapanMatch`:

```js
{
  targetPath: "src/content/news/5-querypie-supplies-ai-and-data-security-to-vessl-ai.mdx",
  targetId: 5,
  targetSlug: "querypie-supplies-ai-and-data-security-to-vessl-ai",
  signals: ["exact-source-url"],
}
```

- [ ] **Step 1: Implement URL normalization**

Rules:

```js
const TRACKING_PARAMS = new Set([
  "guccounter",
  "guce_referrer",
  "guce_referrer_sig",
]);
const isTracking = (key) => key.startsWith("utm_") || TRACKING_PARAMS.has(key);
```

Require absolute HTTPS, lower-case hostname, strip hash and trailing slash, remove only allowlisted tracking params, sort remaining query params, and preserve values such as `no=169`.

- [ ] **Step 2: Implement strict MDX indexing**

Scan supported `src/content/<targetFamily>/*.mdx`, parse frontmatter with the installed `yaml` package, retain raw MDX for exact URL/title evidence, validate positive integer string `id`, kebab `slug`, safe path, unique family/id, and unique path. Same-family duplicate slugs remain separate candidates.

- [ ] **Step 3: Implement exact signals**

```js
const exactSlug = globalItem.sourceSlug === record.targetSlug;
const exactSourceUrl = globalItem.sourceUrls.some((url) => record.urls.has(url));
const exactOriginalTitleAndDate =
  globalItem.originalTitle
  && record.dateIso === globalItem.dateIso
  && record.normalizedSource.includes(globalItem.originalTitle);
```

Use normalized values, sort signals and matches deterministically, and never auto-select.

- [ ] **Step 4: Run GREEN**

```bash
node --test tests/global-content-diff-report/candidate-matches.test.mjs
```

Expected: all candidate tests pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/global-content-diff-report/candidate-matches.mjs tests/global-content-diff-report/candidate-matches.test.mjs
git commit -m "feat: detect existing Japan content candidates"
```

---

### Task 3: Integrate candidate evidence into report and Slack

**Files:**
- Modify: `scripts/global-content-diff-report/report.mjs`
- Modify: `scripts/global-content-diff-report/slack.mjs`
- Modify: `tests/global-content-diff-report/global-content-diff-report.test.mjs`

**Interfaces:**
- Global item adds `sourceSlug`, `originalTitle`, and normalized `sourceUrls`.
- Report item adds `possibleJapanMatches`.

- [ ] **Step 1: Write report and Slack RED tests**

Assert:

```js
assert.equal(item.status, "Untracked");
assert.equal(report.counts.globalOnly, 1);
assert.equal(item.possibleJapanMatches[0].targetId, 33);
```

Also assert active Ignore remains `Ignored`, counts do not change, scanner errors reject report creation, Slack shows at most three escaped candidates, and `+N omitted` appears.

- [ ] **Step 2: Run RED**

```bash
node --test tests/global-content-diff-report/global-content-diff-report.test.mjs
```

Expected: missing `possibleJapanMatches` and Slack evidence assertions fail.

- [ ] **Step 3: Implement report integration**

Index Japan MDX once in `buildGlobalOnlyReport`, calculate matches only for Global-only items, and attach evidence without changing `present`, `mappingDrift`, status, or counts.

- [ ] **Step 4: Implement bounded Slack evidence**

Render up to three candidate paths with signal labels and an omitted count. Use existing mrkdwn escaping and keep existing status containers.

- [ ] **Step 5: Run GREEN and commit**

```bash
node --test tests/global-content-diff-report/global-content-diff-report.test.mjs
git add scripts/global-content-diff-report/report.mjs scripts/global-content-diff-report/slack.mjs tests/global-content-diff-report/global-content-diff-report.test.mjs
git commit -m "feat: report possible Japan content matches"
```

---

### Task 4: Add the shared Ignore eligibility decision

**Files:**
- Create: `scripts/global-content-diff-report/ignore-eligibility.mjs`
- Create: `tests/global-content-diff-report/ignore-eligibility.test.mjs`

**Interfaces:**
- `assessIgnoreEligibility({ sourceIdentity, report, baseIgnoreRecords, now })`
- `formatIgnoreEligibilityResult(result, metadata)`

Allowed result:

```js
{ allowed: true, sourceIdentity, item }
```

Denied result:

```js
{
  allowed: false,
  sourceIdentity,
  reasonCode: "possible-japan-match",
  message: "...",
  details: { candidates: [...] },
}
```

- [ ] **Step 1: Write RED tests**

Cover invalid identity, missing/duplicate live item, non-`Untracked`, active base Ignore, mapping drift, malformed candidate evidence, one/multiple candidates, and eligible zero-candidate live item.

Include `news:cnt_000180` and `news:cnt_000181` as zero-deterministic-candidate fixtures to prove the function does not claim absence.

- [ ] **Step 2: Run RED**

```bash
node --test tests/global-content-diff-report/ignore-eligibility.test.mjs
```

Expected: module missing.

- [ ] **Step 3: Implement the pure decision function**

Use structured reason codes and deterministic evidence. Failure formatting must include both SHAs, identity, candidate paths/signals or drift path, and baseline/content PR remediation.

- [ ] **Step 4: Run GREEN and commit**

```bash
node --test tests/global-content-diff-report/ignore-eligibility.test.mjs
git add scripts/global-content-diff-report/ignore-eligibility.mjs tests/global-content-diff-report/ignore-eligibility.test.mjs
git commit -m "feat: centralize Direct Ignore eligibility"
```

---

### Task 5: Guard Direct Ignore and hand-edited Ignore PRs

**Files:**
- Create: `scripts/global-content-diff-report/validate-ignore-pr.mjs`
- Refactor: `scripts/global-content-diff-report/production-inputs.mjs`
- Modify: `scripts/global-content-diff-report/cli.mjs`
- Modify: `.github/workflows/ignore-global-content-diff.yml`
- Modify: `.github/workflows/ci.yml`
- Modify: `tests/global-content-diff-report/global-content-diff-workflow.test.mjs`
- Test: `tests/global-content-diff-report/ignore-eligibility.test.mjs`

**Interfaces:**
- `loadProductionInputs(fetchText)` and `validateProductionInputs(globalRepo, inputs)` move from `cli.mjs` into a shared module without behavior changes.
- `runValidateIgnorePrCli(argv, deps)` compares base/current Ignore manifests and calls `assessIgnoreEligibility` for every added row.

- [ ] **Step 1: Write workflow and validator RED tests**

Assert Direct Ignore:

- calls the shared eligibility function;
- rejects candidate and mapping drift before mutation;
- validates the changed manifest before push;
- has only `source_identity` input;
- adds only `actions: write` to existing write permissions;
- dispatches `ci.yml` on the generated branch.

Assert CI:

- checks out Global for Ignore-manifest changes;
- invokes `validate-ignore-pr.mjs` with a base Ignore snapshot;
- feeds the validator job into `CI result`;
- remains read-only.

- [ ] **Step 2: Run RED**

```bash
node --test \
  tests/global-content-diff-report/ignore-eligibility.test.mjs \
  tests/global-content-diff-report/global-content-diff-workflow.test.mjs
```

Expected: validator and workflow contract assertions fail.

- [ ] **Step 3: Extract production evidence helpers**

Move existing functions unchanged, update imports, and rerun current CLI tests before adding validator behavior.

- [ ] **Step 4: Implement validator CLI**

Compare newly added active Ignore rows against the base manifest. Build a production-equivalent report using the base Ignore decisions so the new row remains assessable as `Untracked`. Call `assessIgnoreEligibility`; any denial exits non-zero.

- [ ] **Step 5: Update Direct Ignore**

Replace inline eligibility logic with the shared module. Validate before mutation and after changing the manifest. Add `actions: write`; after PR creation run:

```bash
gh workflow run ci.yml --ref "$branch"
```

- [ ] **Step 6: Update CI**

For changed `.github/content-sync/ignore.json`, obtain the PR base version, checkout `querypie/corp-web-v2@main`, run the validator, and include the job in `CI result`.

- [ ] **Step 7: Run GREEN and commit**

```bash
node --test \
  tests/global-content-diff-report/ignore-eligibility.test.mjs \
  tests/global-content-diff-report/global-content-diff-workflow.test.mjs
git add scripts/global-content-diff-report .github/workflows tests/global-content-diff-report
git commit -m "ci: guard Global content Ignore decisions"
```

---

### Task 6: Align OpenSpec and operator docs

**Files:**
- Modify: `openspec/specs/contract-global-content-diff-report/spec.md`
- Modify: `.github/content-sync/README.md`
- Modify: `scripts/global-content-diff-report/README.md`
- Modify: `README.md`
- Modify: `docs/superpowers/specs/2026-07-30-existing-japan-content-candidate-guard-design.md`
- Modify: `tests/global-content-diff-report/global-content-diff-workflow.test.mjs`

- [ ] **Step 1: Add durable Requirements and Scenarios**

Specify diagnostic-only exact candidates, unchanged authority/status/counts, query-preserving URL evidence, candidate/drift Ignore rejection, shared eligibility SSOT, hand-edited PR validation, bot CI dispatch, no bypass, and zero-candidate uncertainty.

- [ ] **Step 2: Update operator guidance**

Explain `Possible Japan match`, remediation through a reviewed baseline/content PR, manual review for zero-candidate items, and current repository-rule stale-branch risk.

- [ ] **Step 3: Convert design doc to historical bridge**

Point to OpenSpec as canonical after implementation.

- [ ] **Step 4: Run docs/workflow tests and commit**

```bash
node --test tests/global-content-diff-report/global-content-diff-workflow.test.mjs
git diff --check
git add README.md .github/content-sync/README.md scripts/global-content-diff-report/README.md openspec docs tests/global-content-diff-report/global-content-diff-workflow.test.mjs
git commit -m "docs: define existing Japan candidate safeguards"
```

---

### Task 7: Validate, review, merge, and prove the incident

**Files:**
- No new production files expected.
- Evidence: PR body/check output.

- [ ] **Step 1: Run focused suites**

```bash
node --test tests/global-content-diff-report/*.test.mjs
node scripts/ci/run-node-tests.mjs crossCutting
node scripts/ci/assert-test-groups.mjs
git diff --check
```

Expected: all pass.

- [ ] **Step 2: Run OpenSpec validation**

```bash
openspec validate --all
```

Expected: pass; if CLI unavailable, record that exact blocker.

- [ ] **Step 3: Run PR-style validation**

```bash
npm run test:ci
npm run build
```

Expected: pass.

- [ ] **Step 4: Run production-equivalent incident check**

Use detached worktrees at:

- Global `29a92275d3cb05be70e44aa4967b94688faa91ca`
- Japan `814a2c65154962ec8343b05462b0ca44d1b09025`

Run the new dry-run and assert FDE remains `Untracked`, includes Blog 33 in `possibleJapanMatches`, Direct Ignore eligibility is denied, and baseline-only counts stay unchanged.

- [ ] **Step 5: Obtain independent code/spec review**

Block merge on any Major or Blocker.

- [ ] **Step 6: Push, open PR, wait for `CI result`, and merge**

Re-enable Direct Ignore only after guarded workflow exists on `main` and a production-equivalent validation passes.

---

### Task 8: Reconcile the current report in a separate PR

**Files:**
- Modify: `.github/content-sync/baseline.json`
- Modify: `.github/content-sync/ignore.json`

**Dependencies:** Guard PR merged and Direct Ignore still disabled.

- [ ] **Step 1: Add reviewed mappings**

Add mappings for FDE Blog 33 and all eleven existing Japan News items. Record manual source/body evidence for `news:cnt_000180` and `news:cnt_000181`; do not represent them as deterministic detector matches.

- [ ] **Step 2: Remove incorrect Ignore decisions**

Remove:

```text
news:cnt_000177
news:cnt_000178
news:cnt_000179
news:cnt_000180
news:cnt_000181
```

Retain `documentation:cnt_000051`.

- [ ] **Step 3: Run manifest/report validation**

```bash
node --test tests/global-content-diff-report/*.test.mjs
npm run test:ci
git diff --check
```

Then run a current production dry-run. Expected Global-only result: only the intentionally ignored Event item, unless newer Global production content appeared during implementation.

- [ ] **Step 4: Independent review, PR, CI, merge**

Review every source identity and target path. Merge only after CI passes.

- [ ] **Step 5: Re-enable Direct Ignore and verify state**

Confirm guarded workflow is active, no unsafe PR remains, and the next report is correctly classified.
