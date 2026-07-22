import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const workflow = path.resolve(".github/workflows/content-sync-slack.yml");
const DOCUMENTATION_TARGET_FAMILIES = new Set(["blog", "whitepapers", "use-cases", "manuals", "events", "glossary", "introduction-deck"]);
const execFileAsync = promisify(execFile);

function extractWorkflowRunScript(workflowSource) {
  const match = workflowSource.match(/- name: Send Slack notification\n(?: {8}.+\n)*? {8}run: \|\n((?: {10}.*\n?)*)/);
  assert.ok(match, "expected Send Slack notification run block");
  return match[1]
    .split("\n")
    .map((line) => line.startsWith("          ") ? line.slice(10) : line)
    .join("\n")
    .trim();
}

function extractSlackSource({ branch, body }) {
  const markerMatch = body.match(/<!--\s*global-documentation-sync:v1\s+(\{[^\n]*\})\s*-->/);
  if (markerMatch) {
    const marker = JSON.parse(markerMatch[1]);
    const sourceSection = marker.sourceSection ?? (marker.targetFamily === "news"
      ? "news"
      : DOCUMENTATION_TARGET_FAMILIES.has(marker.targetFamily)
        ? "documentation"
        : null);
    if (sourceSection && marker.sourceId) return `${sourceSection}/${marker.sourceId}`;
  }
  const explicitBranch = /^content-sync\/([a-z]+)-(cnt_\d+)$/.exec(branch);
  if (explicitBranch) return `${explicitBranch[1]}/${explicitBranch[2]}`;
  const legacyBranch = /^content-sync\/(cnt_\d+)$/.exec(branch);
  return legacyBranch ? legacyBranch[1] : branch.replace(/^content-sync\//, "");
}

test("Slack workflow shell parses with bash -n", async () => {
  const source = await readFile(workflow, "utf8");
  const runScript = extractWorkflowRunScript(source);
  const tempScript = path.join(os.tmpdir(), `content-sync-slack-${process.pid}.sh`);
  await writeFile(tempScript, `${runScript}\n`, "utf8");
  await execFileAsync("bash", ["-n", tempScript]);
});

test("Slack workflow notifies only same-repository content-sync Draft PRs", async () => {
  const source = await readFile(workflow, "utf8");
  assert.match(source, /name: Notify Global publication sync Draft PR/);
  assert.match(source, /pull_request_target:/);
  assert.match(source, /types: \[opened, reopened\]/);
  assert.match(source, /workflow_dispatch:/);
  assert.match(source, /github\.event\.pull_request\.draft/);
  assert.match(source, /github\.event\.pull_request\.head\.repo\.full_name == github\.repository/);
  assert.match(source, /startsWith\(github\.event\.pull_request\.head\.ref, 'content-sync\/'\)/);
  assert.match(source, /secrets\.CONTENT_SYNC_SLACK_WEBHOOK_URL/);
  assert.match(source, /vars\.CONTENT_SYNC_SLACK_MENTION/);
  assert.match(source, /vars\.CONTENT_SYNC_SLACK_CHANNEL_ID/);
  assert.match(source, /Global publication sync Slack notification test/);
  assert.match(source, /Global publication Draft PR is ready for review/);
  assert.match(source, /PR_BODY/);
  assert.match(source, /sourceSection && marker\.sourceId/);
  assert.match(source, /content-sync\\\/\(\[a-z\]\+\)-\(cnt_\\d\+\)/);
  assert.doesNotMatch(source, /actions\/checkout/);
});

test("Slack source extraction prefers marker composite identity and preserves legacy fallbacks", () => {
  assert.equal(extractSlackSource({
    branch: "content-sync/news-cnt_000212",
    body: '<!-- global-documentation-sync:v1 {"sourceSection":"news","sourceId":"cnt_000212","targetFamily":"news","targetId":212,"runId":"r","branch":"content-sync/news-cnt_000212"} -->',
  }), "news/cnt_000212");
  assert.equal(extractSlackSource({
    branch: "content-sync/documentation-cnt_000009",
    body: '<!-- global-documentation-sync:v1 {"sourceId":"cnt_000009","targetFamily":"manuals","targetId":9,"runId":"r","branch":"content-sync/cnt_000009"} -->',
  }), "documentation/cnt_000009");
  assert.equal(extractSlackSource({
    branch: "content-sync/documentation-cnt_000009",
    body: '',
  }), "documentation/cnt_000009");
  assert.equal(extractSlackSource({
    branch: "content-sync/cnt_000009",
    body: '',
  }), "cnt_000009");
  assert.equal(extractSlackSource({
    branch: "content-sync/news-cnt_000212",
    body: '<!-- global-documentation-sync:v1 {"sourceId":"cnt_000212","targetFamily":"newz","targetId":212,"runId":"r","branch":"content-sync/news-cnt_000212"} -->',
  }), "news/cnt_000212");
});
