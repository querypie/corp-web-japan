import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readWorkflow = (name) => readFile(`.github/workflows/${name}`, "utf8");

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
  assert.match(source, /jq -r \.isCrossRepository <<<"\$pr"\)" == false/);
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
  assert.match(source, /invalid ignore manifest JSON/);
  assert.match(source, /ignore manifest must be an array/);
  assert.match(source, /JSON\.parse\(readFileSync\(file, "utf8"\)\)/);
});

test("close reconciler handles both CI completion and delayed approval", async () => {
  const source = await readWorkflow("close-ignored-sync-pr.yml");
  assert.match(source, /name: Close ignored Global publication sync PR/);
  assert.match(source, /workflow_run:/);
  assert.match(source, /pull_request_review:/);
  assert.match(source, /github\.event\.review\.state == 'approved'/);
  assert.match(source, /startsWith\(github\.event\.pull_request\.head\.ref, 'content-sync-ignore\/'\)/);
  assert.match(source, /contents: write/);
  assert.match(source, /pull-requests: write/);
  assert.match(source, /gh pr view "\$ignore_pr" --repo "\$REPOSITORY" --json state,headRefName,body,isCrossRepository/);
  assert.match(source, /jq -r \.isCrossRepository <<<"\$ignore"\)" == false/);
  assert.match(source, /ignore PR is not a merged same-repository sync-ignore PR/);
  assert.match(source, /gh pr view "\$source_pr" --repo "\$REPOSITORY" --json state,isDraft,headRefName,body,isCrossRepository/);
  assert.match(source, /jq -r \.isCrossRepository <<<"\$source"\)" == false/);
  assert.match(source, /source PR is not same-repository or does not match sync marker/);
  assert.match(source, /gh pr close/);
  assert.match(source, /git\/refs\/heads\/content-sync\/\$source_id/);
});
