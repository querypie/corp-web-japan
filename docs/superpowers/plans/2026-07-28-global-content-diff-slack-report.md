# Global Content Diff Slack Report Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Send a complete, read-only weekday Slack report of production-published Global content that is not verified as present in the Japan site, with every item linked to its original Global URL.

**Architecture:** A new GitHub-hosted workflow checks out both public repositories, fetches the existing live publication evidence, and runs a deterministic Node CLI. Pure report functions build Global and Japan identity sets; a separate Slack renderer groups and paginates the resulting Global-only items. Existing translation, review, Draft PR, ignore, host timer, and publication-sync workflows remain behaviorally unchanged.

**Tech Stack:** Node.js 20 standard library, GitHub Actions, GitHub CLI REST pagination, Slack Incoming Webhook Block Kit, Node test runner.

## Global Constraints

- Canonical identity is `${sourceSection}:${sourceId}`.
- Report only production-published Global content proven by the current section-specific live evidence.
- Report every Global-only item; active ignore and unmerged Draft states annotate but never suppress an item.
- Every reported title links to the normalized original Global URL.
- Existing publication sync and PR behavior must not change.
- Schedule is `0 1 * * 1-5` and manual `workflow_dispatch` is supported.
- Workflow permissions are read-only; no content, branch, issue, or PR mutation is allowed.
- Use `GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL`; do not use reviewer mentions.
- Collapsible category container titles are text-only because Slack renders title emoji as literal shortcodes.
- No Ignore button, n8n integration, action endpoint, LLM, browser, Next build, or dependency installation.

---

### Task 1: Build deterministic Global and Japan inventories

**Files:**
- Modify: `scripts/global-documentation-sync/discovery.mjs`
- Create: `scripts/global-content-diff-report/report.mjs`
- Create: `tests/global-documentation-sync/global-content-diff-report.test.mjs`

**Interfaces:**
- Consumes: `SOURCE_FAMILIES`, `sourceRoots()`, `sourceFamily()`, `targetFamily()`, `sourceIdentityKey()`, `parseSyncMarker()`, `resolveLegacySourceSection()`, `validateDecisionManifest()`, and the existing production/source contract helpers.
- Produces:
  - `buildGlobalInventory({ globalRepo, sitemapXml, productionListHtmlByUrl }): Promise<GlobalItem[]>`
  - `buildJapanInventory({ targetRepo, prRecords }): Promise<{ present: Map<string, JapanMapping>, mappingDrift: Map<string, MappingDrift> }>`
  - `buildDispositionMap({ ignoreRecords, prRecords, globalItems, now }): Map<string, string>`
  - `buildGlobalOnlyReport(input): Promise<ContentDiffReport>`

- [ ] **Step 1: Export existing pure discovery helpers without changing their bodies or call sites**

Change only the declarations in `scripts/global-documentation-sync/discovery.mjs`:

```js
export async function readManifest(targetRepo, name) {
  // existing body unchanged
}

export async function enumerateSources(globalRepo) {
  // existing body unchanged
}

export function productionSets(sitemapXml, productionListHtmlByUrl = {}) {
  // existing body unchanged
}

export function shouldSkipDiscoveryContractFailure(source) {
  // existing body unchanged
}
```

This exposes the exact existing production-source rules to the independent report without changing candidate selection.

- [ ] **Step 2: Write failing inventory and diff tests**

In `tests/global-documentation-sync/global-content-diff-report.test.mjs`, create fixture helpers for Global `meta.json`, Japan manifests, target MDX files, and PR markers. Add tests equivalent to:

```js
test("reports all listed Global-only identities and preserves cross-section IDs", async () => {
  const report = await buildGlobalOnlyReport(fixtureWith({
    global: [
      publishedDocumentation("cnt_000001", "doc-one"),
      publishedNews("cnt_000001", "news-one"),
      staleNews("cnt_000002", "not-listed"),
    ],
    japan: [baselineMapping("documentation", "cnt_000001", "blog", 1, "doc-one")],
  }));

  assert.deepEqual(report.items.map(({ identity }) => identity), ["news:cnt_000001"]);
  assert.equal(report.items[0].sourceUrl, "https://www.querypie.com/en/news/news-one");
});

test("counts baseline and merged marker mappings only when target MDX exists", async () => {
  const report = await buildGlobalOnlyReport(fixtureWith({
    global: [publishedNews("cnt_000212", "ai-pack")],
    mergedPulls: [legacyMergedMarker("cnt_000212", "news", 19)],
    targetFiles: ["src/content/news/19-ai-pack.mdx"],
  }));
  assert.equal(report.items.length, 0);
  assert.equal(report.counts.japanPresent, 1);
});

test("keeps ignored and closed Draft items in the diff with status", async () => {
  const report = await buildGlobalOnlyReport(fixtureWith({
    global: [publishedNews("cnt_000177", "real-madrid")],
    ignore: [ignored("news", "cnt_000177")],
    pulls: [closedDraftMarker("news", "cnt_000177", "news", 24)],
  }));
  assert.equal(report.items[0].status, "Ignored");
});

test("reports missing mapped targets as mapping drift instead of Japan-present", async () => {
  const report = await buildGlobalOnlyReport(fixtureWith({
    global: [publishedBlog("cnt_000010", "missing-target")],
    japan: [baselineMapping("documentation", "cnt_000010", "blog", 10, "missing-target")],
    targetFiles: [],
  }));
  assert.equal(report.items[0].status, "Mapping drift");
  assert.equal(report.counts.japanPresent, 0);
});
```

Also cover listed invalid source failure, outlink-without-sitemap inclusion, stale-source exclusion, duplicate merged mapping rejection, exact baseline target path, date-descending deterministic sorting, and title fallback order `en → ja → ko → sourceId`.

- [ ] **Step 3: Run the focused test and verify RED**

Run:

```bash
node --test tests/global-documentation-sync/global-content-diff-report.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/global-content-diff-report/report.mjs`.

- [ ] **Step 4: Implement the report module minimally**

Create `scripts/global-content-diff-report/report.mjs` with these data rules:

```js
export async function buildGlobalInventory({ globalRepo, sitemapXml, productionListHtmlByUrl }) {
  const production = productionSets(sitemapXml, productionListHtmlByUrl);
  const items = [];

  for (const source of await enumerateSources(globalRepo)) {
    if (shouldSkipDiscoveryContractFailure(source) || !source.sourceCanonicalUrl) continue;
    const descriptor = sourceFamily(source.category);
    const listUrl = normalizeUrl(descriptor.productionListUrl);
    const listed = (production.listByUrl.get(listUrl) || new Set()).has(source.sourceCanonicalUrl);
    if (!listed) continue;
    const sitemapped = production.sitemap.has(source.sourceCanonicalUrl);
    if (source.meta.contentType !== "outlink" && !sitemapped) continue;
    const failure = sourceContractFailure(source);
    if (failure) throw new Error(`${source.sourceSection}:${source.sourceId}: ${failure}`);

    items.push({
      identity: sourceIdentityKey(source),
      sourceSection: source.sourceSection,
      sourceId: source.sourceId,
      sourceCategory: source.category,
      targetFamily: targetFamily(source.category),
      title: localizedTitle(source.meta),
      dateIso: source.meta.dateIso || "",
      sourceUrl: source.sourceCanonicalUrl,
    });
  }

  return items.sort(compareGlobalItems);
}
```

Implement Japan mappings as follows:

```js
const baselinePath = ({ targetFamily, targetId, targetSlug }) =>
  path.join("src/content", targetFamily, `${targetId}-${targetSlug}.mdx`);

const mergedMarkerPath = async (targetRepo, marker) => {
  const directory = path.join(targetRepo, "src/content", marker.targetFamily);
  const matches = (await readdir(directory)).filter((name) =>
    name.startsWith(`${marker.targetId}-`) && name.endsWith(".mdx"));
  if (matches.length > 1) throw new Error(`ambiguous target mapping: ${marker.identity}`);
  return matches[0] ? path.join("src/content", marker.targetFamily, matches[0]) : null;
};
```

Validate baseline and ignore manifests with the existing validator. Merge baseline and merged-PR mappings by composite identity, allowing duplicates only when they resolve to the same target family and ID. Resolve legacy ignore section only against Global items. Status precedence is `Mapping drift`, `Ignored`, `Draft open`, `Draft closed`, then `Untracked`.

Return this stable report shape:

```js
{
  generatedAt,
  counts: { globalPublished, japanPresent, globalOnly },
  familyCounts: { news: 3, blog: 2 },
  items: [{ identity, sourceSection, sourceId, sourceCategory, targetFamily, title, dateIso, sourceUrl, status }],
  mappingDrift: [{ identity, expectedPath }],
}
```

- [ ] **Step 5: Run focused tests and existing discovery regression tests**

Run:

```bash
node --test \
  tests/global-documentation-sync/global-content-diff-report.test.mjs \
  tests/global-documentation-sync/discovery.test.mjs
```

Expected: PASS; existing candidate selection tests remain unchanged.

- [ ] **Step 6: Commit inventory implementation**

```bash
git add \
  scripts/global-documentation-sync/discovery.mjs \
  scripts/global-content-diff-report/report.mjs \
  tests/global-documentation-sync/global-content-diff-report.test.mjs
git commit -m "Add Global-only content inventory report"
```

---

### Task 2: Render complete Slack Block Kit payloads

**Files:**
- Create: `scripts/global-content-diff-report/slack.mjs`
- Modify: `tests/global-documentation-sync/global-content-diff-report.test.mjs`

**Interfaces:**
- Consumes: `ContentDiffReport` from Task 1 plus `{ globalSha, japanSha }`.
- Produces:
  - `buildSlackPayloads(report, metadata): SlackPayload[]`
  - `sendSlackPayloads({ webhookUrl, payloads, fetchImpl }): Promise<void>`

- [ ] **Step 1: Write failing Slack renderer tests**

Add tests equivalent to:

```js
test("renders text-only collapsible family containers and original links", () => {
  const [payload] = buildSlackPayloads(reportWithSevenItems(), {
    globalSha: "abc1234",
    japanSha: "def5678",
  });
  assert.equal(payload.blocks[0].text.text, "🌐 Global-only content report");
  const container = payload.blocks.find((block) => block.type === "container");
  assert.equal(container.title.text, "News · 3 items");
  assert.equal(container.default_collapsed, true);
  assert.match(container.child_blocks[0].text.text, /<https:\/\/finance\.yahoo\.com\/.+\|QueryPie selected/);
  assert.doesNotMatch(container.title.text, /:newspaper:|📰/);
  assert.doesNotMatch(JSON.stringify(payload), /button|ignore_content|<@/i);
});

test("paginates without dropping or duplicating identities", () => {
  const payloads = buildSlackPayloads(reportWithItems(83), metadata);
  const rendered = JSON.stringify(payloads);
  for (const item of reportWithItems(83).items) {
    assert.equal(rendered.split(item.identity).length - 1, 1);
  }
  assert.match(payloads[0].text, /Part 1 of/);
});

test("renders a compact zero-difference success", () => {
  const [payload] = buildSlackPayloads(emptyReport(), metadata);
  assert.match(payload.text, /No Global-only content/);
  assert.equal(payload.blocks.some(({ type }) => type === "container"), false);
});
```

Also test escaping of `&`, `<`, `>`, long-title truncation, family/date order preservation, and webhook failure propagation.

- [ ] **Step 2: Run focused test and verify RED**

Run:

```bash
node --test tests/global-documentation-sync/global-content-diff-report.test.mjs
```

Expected: FAIL with missing `slack.mjs` exports.

- [ ] **Step 3: Implement the Block Kit renderer and sender**

Create `scripts/global-content-diff-report/slack.mjs` with bounded constants:

```js
const ITEMS_PER_CONTAINER = 10;
const CONTAINERS_PER_PAYLOAD = 8;
const MAX_TITLE_LENGTH = 180;

const itemText = (item) => {
  const title = escapeMrkdwn(truncate(item.title, MAX_TITLE_LENGTH));
  const details = [item.identity, item.dateIso, item.status].filter(Boolean).join(" · ");
  return `*<${item.sourceUrl}|${title}>*\n${escapeMrkdwn(details)}`;
};

const familyContainer = (family, items, part) => ({
  type: "container",
  title: {
    type: "plain_text",
    text: `${familyLabel(family)} · ${items.length} item${items.length === 1 ? "" : "s"}${part ? ` · ${part}` : ""}`,
  },
  is_collapsible: true,
  default_collapsed: true,
  child_blocks: items.map((item) => ({
    type: "section",
    text: { type: "mrkdwn", text: itemText(item) },
  })),
});
```

Generate every payload before sending. Include `Part N of M` in fallback text and context. Only the first payload contains the complete count summary; continuation payloads retain category and part context. Never emit a button or mention.

Implement bounded delivery:

```js
export async function sendSlackPayloads({ webhookUrl, payloads, fetchImpl = fetch }) {
  if (!webhookUrl?.startsWith("https://hooks.slack.com/services/")) {
    throw new Error("GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL must be a Slack Incoming Webhook URL");
  }
  for (const payload of payloads) {
    const response = await fetchImpl(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok || (await response.text()) !== "ok") {
      throw new Error(`Slack rejected Global content diff payload: HTTP ${response.status}`);
    }
  }
}
```

- [ ] **Step 4: Run focused tests**

Run:

```bash
node --test tests/global-documentation-sync/global-content-diff-report.test.mjs
```

Expected: PASS with no omitted or duplicate identity in pagination tests.

- [ ] **Step 5: Commit Slack rendering**

```bash
git add \
  scripts/global-content-diff-report/slack.mjs \
  tests/global-documentation-sync/global-content-diff-report.test.mjs
git commit -m "Add paginated Slack content diff report"
```

---

### Task 3: Add the independent CLI and scheduled workflow

**Files:**
- Create: `scripts/global-content-diff-report/cli.mjs`
- Create: `.github/workflows/global-content-diff-report.yml`
- Create: `tests/global-documentation-sync/global-content-diff-workflow.test.mjs`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: Task 1 report builders, Task 2 Slack functions, existing `fetchTextWithRetry()`, `loadAllPullRequests()`, and `SOURCE_FAMILIES`.
- Produces: CLI flags `--global-repo`, `--target-repo`, and `--dry-run`; scheduled/manual GitHub workflow.

- [ ] **Step 1: Write failing CLI/workflow contract tests**

Create `tests/global-documentation-sync/global-content-diff-workflow.test.mjs` with assertions equivalent to:

```js
test("workflow is independent, read-only, scheduled for weekdays at 10 KST, and manually runnable", async () => {
  const source = await readFile(".github/workflows/global-content-diff-report.yml", "utf8");
  assert.match(source, /cron: ["']0 1 \* \* 1-5["']/);
  assert.match(source, /workflow_dispatch:/);
  assert.match(source, /runs-on: ubuntu-latest/);
  assert.match(source, /contents: read/);
  assert.match(source, /pull-requests: read/);
  assert.match(source, /repository: querypie\/corp-web-v2/);
  assert.match(source, /GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL/);
  assert.match(source, /if: failure\(\)/);
  assert.match(source, /Global content diff report failed/);
  assert.doesNotMatch(source, /CONTENT_SYNC_SLACK_WEBHOOK_URL|ALERT_WEBHOOK_URL/);
  assert.doesNotMatch(source, /pull_request_target|git push|gh pr create|n8n|<@/);
});

test("CLI dry-run emits complete JSON without requiring or calling Slack", async () => {
  const result = await runCliFixture(["--dry-run"]);
  const output = JSON.parse(result.stdout);
  assert.equal(output.report.counts.globalOnly, output.report.items.length);
  assert.ok(output.payloads.length >= 1);
  assert.equal(result.slackRequests.length, 0);
});
```

Verify `.github/workflows/ci.yml` includes the new workflow and script directory in the `cross_cutting` paths filter.

- [ ] **Step 2: Run workflow test and verify RED**

Run:

```bash
node --test tests/global-documentation-sync/global-content-diff-workflow.test.mjs
```

Expected: FAIL because the CLI and workflow do not exist.

- [ ] **Step 3: Implement the CLI**

Create `scripts/global-content-diff-report/cli.mjs` to:

1. parse required repository paths and `--dry-run`;
2. fetch sitemap and every distinct `SOURCE_FAMILIES.productionListUrl` via `fetchTextWithRetry`;
3. load all Japan PRs through `loadAllPullRequests`;
4. call `buildGlobalOnlyReport`;
5. read both checkout SHAs with `git rev-parse HEAD`;
6. pre-build all Slack payloads;
7. print one bounded JSON summary in dry-run mode, otherwise send every payload.

Use this command contract:

```bash
node scripts/global-content-diff-report/cli.mjs \
  --global-repo /path/to/corp-web-v2 \
  --target-repo /path/to/corp-web-japan \
  --dry-run
```

The non-dry run requires `GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL` and `GH_TOKEN` in the environment. Do not mutate either checkout.

- [ ] **Step 4: Implement the independent workflow**

Create `.github/workflows/global-content-diff-report.yml`:

```yaml
name: Report Global-only content to Slack

on:
  schedule:
    - cron: "0 1 * * 1-5"
  workflow_dispatch:

permissions:
  contents: read
  pull-requests: read

concurrency:
  group: global-content-diff-report
  cancel-in-progress: false

jobs:
  report:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: Checkout Japan repository
        uses: actions/checkout@v4
        with:
          path: japan

      - name: Checkout Global repository
        uses: actions/checkout@v4
        with:
          repository: querypie/corp-web-v2
          path: global

      - name: Build and send Global-only report
        env:
          GH_TOKEN: ${{ github.token }}
          GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL: ${{ secrets.GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL }}
        run: >-
          node japan/scripts/global-content-diff-report/cli.mjs
          --global-repo "$GITHUB_WORKSPACE/global"
          --target-repo "$GITHUB_WORKSPACE/japan"

      - name: Notify report failure
        if: failure()
        continue-on-error: true
        env:
          WEBHOOK_URL: ${{ secrets.GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL }}
          RUN_URL: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
        run: |
          payload="$(RUN_URL="$RUN_URL" node --input-type=module -e '
            process.stdout.write(JSON.stringify({
              text: "Global content diff report failed",
              blocks: [
                {
                  type: "header",
                  text: { type: "plain_text", text: "Global content diff report failed" },
                },
                {
                  type: "section",
                  text: { type: "mrkdwn", text: `The complete report was not delivered. <${process.env.RUN_URL}|Open workflow run>` },
                },
              ],
            }));
          ')"
          curl --fail --silent --show-error --max-time 15 \
            -H 'Content-Type: application/json' \
            --data-binary "$payload" \
            "$WEBHOOK_URL"
```

Do not add an interactive button or mutation permission. The original job failure remains visible because the notification step is best-effort. A Slack delivery rejection fails the report step; the failure notification may independently retry the same webhook without hiding the original error.

- [ ] **Step 5: Add the new paths to cross-cutting CI detection**

In `.github/workflows/ci.yml`, add:

```yaml
- '.github/workflows/global-content-diff-report.yml'
- 'scripts/global-content-diff-report/**'
```

under the existing `cross_cutting` path filter. Existing publication-sync workflow entries remain unchanged.

- [ ] **Step 6: Run workflow and focused regression tests**

Run:

```bash
node --test \
  tests/global-documentation-sync/global-content-diff-report.test.mjs \
  tests/global-documentation-sync/global-content-diff-workflow.test.mjs \
  tests/global-documentation-sync/discovery.test.mjs \
  tests/global-documentation-sync/slack-workflow.test.mjs
```

Expected: PASS; the old Slack workflow tests prove the current PR notification path remains unchanged.

- [ ] **Step 7: Commit CLI and workflow**

```bash
git add \
  .github/workflows/global-content-diff-report.yml \
  .github/workflows/ci.yml \
  scripts/global-content-diff-report/cli.mjs \
  tests/global-documentation-sync/global-content-diff-workflow.test.mjs
git commit -m "Schedule Global-only content Slack reports"
```

---

### Task 4: Document the contract and verify production readiness

**Files:**
- Create: `scripts/global-content-diff-report/README.md`
- Create: `openspec/specs/contract-global-content-diff-report/spec.md`
- Modify: `openspec/specs/README.md`
- Modify: `docs/superpowers/specs/2026-07-28-global-content-diff-slack-report-design.md` only if implementation evidence requires a factual correction.

**Interfaces:**
- Consumes: final CLI/workflow behavior from Tasks 1–3.
- Produces: operator instructions and durable OpenSpec contract.

- [ ] **Step 1: Write operator documentation**

Document exactly:

```text
Purpose: read-only complete Global-only report
Schedule: weekdays at 10:00 KST; manual workflow_dispatch
Secret: GLOBAL_CONTENT_DIFF_SLACK_WEBHOOK_URL
Dry run: node scripts/global-content-diff-report/cli.mjs --global-repo ... --target-repo ... --dry-run
Identity: sourceSection:sourceId
Present rules: verified baseline or merged sync marker plus existing target MDX
Not present rules: ignored, open Draft, and closed-unmerged Draft remain reportable
No actions: no Ignore button, n8n, mutation, or PR creation
```

- [ ] **Step 2: Write the OpenSpec contract**

Create `openspec/specs/contract-global-content-diff-report/spec.md` with MUST/SHALL scenarios for:

- production-only Global inventory;
- composite identity;
- verified Japan-present mappings;
- complete non-suppressed difference results;
- original URL links;
- deterministic grouping and pagination;
- read-only permissions and independent workflow;
- weekday 10:00 KST and manual execution;
- zero state and fail-closed behavior;
- absence of interactive Ignore actions.

Each requirement includes at least one `#### Scenario:` with `WHEN` and `THEN` clauses. Register `contract-global-content-diff-report` in `openspec/specs/README.md` with a one-line description and link so the new accepted spec is discoverable.

- [ ] **Step 3: Run a real no-send snapshot**

Use the existing sibling Global checkout:

```bash
GH_TOKEN="$(gh auth token)" node scripts/global-content-diff-report/cli.mjs \
  --global-repo /Users/kelly/w/corp-web-v2 \
  --target-repo "$PWD" \
  --dry-run > /tmp/global-content-diff-report.json
```

Verify:

```bash
jq '{counts: .report.counts, familyCounts: .report.familyCounts, payloads: (.payloads | length)}' \
  /tmp/global-content-diff-report.json
jq -e '.report.items | all(.sourceUrl | startswith("https://"))' \
  /tmp/global-content-diff-report.json
```

Expected: both commands exit 0, every item has an HTTPS Global URL, and payload count is at least one.

- [ ] **Step 4: Run full repository validation**

If the worktree has no `node_modules`, link the root checkout dependency tree without installing:

```bash
ln -s /Users/kelly/w/corp-web-japan/node_modules node_modules
```

Run:

```bash
npm run test:ci
npm run build
```

Expected: both exit 0.

- [ ] **Step 5: Review the final diff for isolation and secrets**

Run:

```bash
git diff origin/main...HEAD --check
git diff origin/main...HEAD --name-only
rg -n 'hooks\.slack\.com/services/|<@[A-Z0-9]+>|n8n|ignore_content' \
  .github/workflows/global-content-diff-report.yml \
  scripts/global-content-diff-report \
  tests/global-documentation-sync/global-content-diff-*.test.mjs
```

Expected: no webhook URL, mention, n8n reference, or Ignore action in executable files; changed paths are limited to the design/plan, new report workflow/module/tests/docs/OpenSpec, helper exports, and cross-cutting CI path entries.

- [ ] **Step 6: Commit documentation**

```bash
git add \
  scripts/global-content-diff-report/README.md \
  openspec/specs/contract-global-content-diff-report/spec.md \
  openspec/specs/README.md \
  docs/superpowers/specs/2026-07-28-global-content-diff-slack-report-design.md
git commit -m "Document Global content diff reporting contract"
```

- [ ] **Step 7: Push and open the implementation PR**

```bash
git push -u origin 260728-global-content-diff-report
gh pr create \
  --repo querypie/corp-web-japan \
  --base main \
  --head 260728-global-content-diff-report \
  --title "Report Global-only content to Slack" \
  --body-file /tmp/global-content-diff-report-pr-body.md
```

The PR body must summarize the read-only architecture, exact diff semantics, test commands, dry-run counts, Slack preview decision, and explicitly state that existing publication-sync behavior is unchanged.

- [ ] **Step 8: Verify PR checks and manually test after merge**

Wait for required PR checks to pass. After human merge, run:

```bash
gh workflow run global-content-diff-report.yml --repo querypie/corp-web-japan
```

Verify the workflow succeeds and the test Slack channel receives the full report with text-only category titles. Do not merge the PR automatically unless the user explicitly asks.
