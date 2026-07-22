import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { assertIgnoreAppendAllowed } from "../../scripts/global-documentation-sync/ignore-workflow.mjs";
import { SOURCE_FAMILIES } from "../../scripts/global-documentation-sync/source-family-map.mjs";

const readWorkflow = (name) => readFile(`.github/workflows/${name}`, "utf8");
const DOCUMENTATION_TARGET_FAMILIES = SOURCE_FAMILIES.filter(({ sourceSection }) => sourceSection === "documentation").map(({ targetFamily }) => targetFamily);

function inferLegacySourceSection(targetFamily) {
  if (targetFamily === "news") return "news";
  if (DOCUMENTATION_TARGET_FAMILIES.includes(targetFamily)) return "documentation";
  throw new Error(`unsupported targetFamily: ${targetFamily}`);
}

function validateNormalizedHttpsSourceUrl(sourceUrl) {
  const url = new URL(sourceUrl);
  url.search = "";
  url.hash = "";
  url.hostname = url.hostname.toLowerCase();
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";
  const normalized = url.toString().replace(/\/$/, url.pathname === "/" ? "/" : "");
  if (url.protocol !== "https:" || normalized !== sourceUrl) throw new Error("source URL must be normalized HTTPS");
  return normalized;
}

test("ignore dispatch creates an auto-merge decision PR with a machine marker", async () => {
  const source = await readWorkflow("ignore-global-documentation-sync.yml");
  assert.match(source, /name: Ignore Global publication sync PR/);
  assert.match(source, /workflow_dispatch:/);
  assert.match(source, /sync_pr_number:/);
  assert.match(source, /global-documentation-sync-ignore:v1/);
  assert.match(source, /gh pr merge .*--auto --squash/);
  assert.match(source, /git config user\.name "QueryPie Global publication sync"/);
  assert.match(source, /gh pr view "\$PR_NUMBER" --repo "\$GITHUB_REPOSITORY" --json body,headRefName,state,isDraft,isCrossRepository,url/);
  assert.match(source, /sourceSection/);
  assert.match(source, /content-sync-ignore\/\$source_section-\$source_id/);
  assert.match(source, /sync marker mismatch/);
  assert.match(source, /not an open same-repository sync Draft PR/);
  assert.doesNotMatch(source, /git push origin HEAD:main/);
});

test("ignore dispatch accepts any normalized HTTPS source URL and rejects non-HTTPS", async () => {
  const source = await readWorkflow("ignore-global-documentation-sync.yml");
  assert.match(source, /source URL must be normalized HTTPS/);
  assert.match(source, /url\.protocol !== "https:"/);
  assert.match(source, /normalized !== sourceUrl/);
  assert.doesNotMatch(source, /https:\/\/www\.querypie\.com\//);
  assert.equal(validateNormalizedHttpsSourceUrl("https://media.example/news-one"), "https://media.example/news-one");
  assert.equal(validateNormalizedHttpsSourceUrl("https://www.querypie.com/en/news/outlink"), "https://www.querypie.com/en/news/outlink");
  assert.throws(() => validateNormalizedHttpsSourceUrl("http://media.example/news-one"), /normalized HTTPS/);
  assert.throws(() => validateNormalizedHttpsSourceUrl("https://media.example/news-one/"), /normalized HTTPS/);
  assert.throws(() => validateNormalizedHttpsSourceUrl("https://media.example/news-one?utm_source=test"), /normalized HTTPS/);
});

test("ignore dispatch keeps safe JSON manifest handling", async () => {
  const source = await readWorkflow("ignore-global-documentation-sync.yml");
  const helper = await readFile("scripts/global-documentation-sync/ignore-workflow.mjs", "utf8");
  assert.match(source, /invalid ignore manifest JSON/);
  assert.match(source, /assertIgnoreAppendAllowed/);
  assert.match(source, /JSON\.parse\(readFileSync\(file, "utf8"\)\)/);
  assert.match(helper, /ignore manifest must be an array/);
  assert.match(helper, /already ignored: \$\{sourceSection\}\/\$\{sourceId\}/);
  assert.match(helper, /legacy ignore row cannot be resolved safely/);
});

test("workflow legacy targetFamily inference stays aligned with source-family map", async () => {
  const ignoreWorkflow = await readWorkflow("ignore-global-documentation-sync.yml");
  const closeWorkflow = await readWorkflow("close-ignored-sync-pr.yml");
  for (const workflowSource of [ignoreWorkflow, closeWorkflow]) {
    assert.match(workflowSource, /new Set\(\["blog", "whitepapers", "use-cases", "manuals", "events", "glossary", "introduction-deck"\]\)/);
    assert.match(workflowSource, /unsupported sourceSection/);
  }
  assert.deepEqual(DOCUMENTATION_TARGET_FAMILIES, ["blog", "whitepapers", "use-cases", "manuals", "events", "glossary", "introduction-deck"]);
  for (const targetFamily of DOCUMENTATION_TARGET_FAMILIES) assert.equal(inferLegacySourceSection(targetFamily), "documentation");
  assert.equal(inferLegacySourceSection("news"), "news");
  assert.throws(() => inferLegacySourceSection("newz"), /unsupported targetFamily: newz/);
});

test("hostile legacy markers with unsupported targetFamily fail closed before side effects", () => {
  assert.throws(() => inferLegacySourceSection("manual"), /unsupported targetFamily: manual/);
  assert.throws(() => inferLegacySourceSection("blogs"), /unsupported targetFamily: blogs/);
  assert.throws(() => inferLegacySourceSection(""), /unsupported targetFamily/);
});

test("legacy ignore row for cnt_000051 still blocks duplicate append", () => {
  assert.throws(() => assertIgnoreAppendAllowed({
    values: [{
      sourceId: "cnt_000051",
      sourceCanonicalUrl: "https://www.querypie.com/en/events/querypie-side-kick-teaser-ko",
      reasonCode: "other",
      reason: "legacy row",
      addedBy: "owner",
      addedAt: "2026-07-20T12:53:42Z",
    }],
    sourceId: "cnt_000051",
    sourceSection: "documentation",
    sourceCanonicalUrl: "https://www.querypie.com/en/events/querypie-side-kick-teaser-ko",
  }), /already ignored: documentation\/cnt_000051/);
});

test("hostile legacy ignore rows fail closed when section cannot be inferred safely", () => {
  assert.throws(() => assertIgnoreAppendAllowed({
    values: [{ sourceId: "cnt_000212", reasonCode: "other", reason: "legacy row", addedBy: "owner", addedAt: "2026-07-20T12:53:42Z" }],
    sourceId: "cnt_000212",
    sourceSection: "news",
    sourceCanonicalUrl: "https://www.querypie.com/en/news/news-212",
  }), /legacy ignore row cannot be resolved safely: cnt_000212/);
  assert.throws(() => assertIgnoreAppendAllowed({
    values: [{ sourceId: "cnt_000212", sourceCanonicalUrl: "https://www.querypie.com/en/manual/manual-212", reasonCode: "other", reason: "legacy row", addedBy: "owner", addedAt: "2026-07-20T12:53:42Z" }],
    sourceId: "cnt_000212",
    sourceSection: "news",
    sourceCanonicalUrl: "https://www.querypie.com/en/news/news-212",
  }), /legacy ignore row cannot be resolved safely: cnt_000212/);
});

test("legacy ignore row with exact sourceCategory inference can allow another composite identity", () => {
  assert.doesNotThrow(() => assertIgnoreAppendAllowed({
    values: [{ sourceId: "cnt_000212", sourceCategory: "manuals", reasonCode: "other", reason: "legacy row", addedBy: "owner", addedAt: "2026-07-20T12:53:42Z" }],
    sourceId: "cnt_000212",
    sourceSection: "news",
    sourceCanonicalUrl: "https://www.querypie.com/en/news/news-212",
  }));
});

test("close reconciler keeps fast paths and adds scheduled fallback from main ignore manifest", async () => {
  const source = await readWorkflow("close-ignored-sync-pr.yml");
  assert.match(source, /name: Close ignored Global publication sync PR/);
  assert.match(source, /schedule:/);
  assert.match(source, /cron: '\*\/15 \* \* \* \*'/);
  assert.match(source, /workflow_run:/);
  assert.match(source, /pull_request_review:/);
  assert.match(source, /workflow_dispatch:/);
  assert.match(source, /github\.event_name == 'schedule'/);
  assert.match(source, /github\.event\.review\.state == 'approved'/);
  assert.match(source, /startsWith\(github\.event\.pull_request\.head\.ref, 'content-sync-ignore\/'\)/);
  assert.match(source, /uses: actions\/checkout@v4/);
  assert.match(source, /ref: \$\{\{ github\.event\.repository\.default_branch \}\}/);
  assert.match(source, /\.github\/content-sync\/ignore\.json/);
  assert.match(source, /open-pull-requests\.json/);
  assert.match(source, /ignored-sync-plan\.json/);
  assert.match(source, /parseGitHubPullRequestList/);
  assert.match(source, /planIgnoredSyncPullRequestReconciliation/);
  assert.match(source, /gh pr list --repo "\$REPOSITORY" --state open --limit 1000 --json number,state,isDraft,body,headRefName,isCrossRepository/);
  assert.match(source, /planned source PR is no longer an open same-repository Draft sync PR/);
  assert.match(source, /contents: write/);
  assert.match(source, /pull-requests: write/);
  assert.match(source, /gh pr view "\$ignore_pr" --repo "\$REPOSITORY" --json state,headRefName,body,isCrossRepository/);
  assert.match(source, /ignore marker missing sourceSection, sourceId, or syncPr/);
  assert.match(source, /gh pr view "\$source_pr" --repo "\$REPOSITORY" --json state,isDraft,headRefName,body,isCrossRepository/);
  assert.match(source, /source marker mismatch/);
  assert.match(source, /branchToDelete/);
  assert.match(source, /gh pr close/);
  assert.match(source, /git\/refs\/heads\/\$branch_to_delete/);
});
