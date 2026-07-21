import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  buildDurableEvidenceComment,
  collectTencentHostMetadata,
  DURABLE_EVIDENCE_COMMENT_LIMIT_BYTES,
  DURABLE_EVIDENCE_MARKER_PREFIX,
  publishDurableEvidence,
} from "../../scripts/global-documentation-sync/durable-evidence.mjs";

async function createReportDir() {
  const reportsDir = await mkdtemp(path.join(os.tmpdir(), "durable-evidence-"));
  await mkdir(path.join(reportsDir, "nested"), { recursive: true });
  const runId = "run-123";
  const sourceId = "cnt_000211";
  const writeJson = (name, value) => writeFile(path.join(reportsDir, name), `${JSON.stringify(value, null, 2)}\n`);
  await Promise.all([
    writeJson("candidate.json", { schemaVersion: "global-documentation-sync/v1", artifactType: "candidate", runId, sourceId, sourceHash: `sha256:${"a".repeat(64)}`, sourceCategory: "blogs", sourceSection: "documentation", targetFamily: "blog", targetId: 21, sourceLocale: "ja", sourceHtmlPath: "/tmp/source.html", targetMdxPath: "/tmp/21-demo.mdx", targetAssetRoot: "/tmp/blog/21", targetRoute: "/blog/21/demo", meta: { id: "demo", contentType: "content" }, assets: [], externalMedia: [], production: { canonicalUrl: "https://www.querypie.com/en/blog/demo", listed: true, listUrl: "https://www.querypie.com/en/documentation", sitemap: true } }),
    writeJson("production-evidence.json", { sourceId, production: { canonicalUrl: "https://www.querypie.com/en/blog/demo", listed: true, listUrl: "https://www.querypie.com/en/documentation", sitemap: true }, target: { deployedGitCommit: "abc123def456" } }),
    writeJson("run-summary.json", { schemaVersion: "global-documentation-sync/v1", artifactType: "run-summary", runId, sourceId, status: "draft_pr_created", dryRun: false, committed: true, pushed: true, pullRequestUrl: "https://github.com/querypie/corp-web-japan/pull/99", branch: "content-sync/cnt_000211", commit: "abc123def456", startedAt: "2026-01-01T00:00:00Z", finishedAt: "2026-01-01T00:10:00Z" }),
    writeJson("validation-results.json", { schemaVersion: "global-documentation-sync/v1", artifactType: "validation-results", runId, sourceId, results: [{ command: "generated-publication-contract", code: 0 }, { command: "npm run test:ci", code: 0 }, { command: "next build", code: 0 }] }),
    writeJson("browser-results.json", { schemaVersion: "global-documentation-sync/v1", artifactType: "browser-results", runId, sourceId, results: [{ viewport: { width: 1440, height: 900 }, status: "passed", findings: [] }, { viewport: { width: 390, height: 844 }, status: "passed", findings: ["minor banner mismatch"] }] }),
    writeJson("fidelity-review.json", { schemaVersion: "global-documentation-sync/v1", artifactType: "fidelity-review", runId, sourceId, verdict: "pass", findings: [{ severity: "note", message: "kept heading order" }] }),
    writeJson("japanese-editorial-review.json", { schemaVersion: "global-documentation-sync/v1", artifactType: "japanese-editorial-review", runId, sourceId, verdict: "pass", findings: [{ severity: "note", message: "です・ます統一" }] }),
    writeJson("contract-review.json", { schemaVersion: "global-documentation-sync/v1", artifactType: "contract-review", runId, sourceId, verdict: "pass", findings: [{ severity: "note", message: "frontmatter ok" }] }),
    writeJson("branch-state.json", { branch: "content-sync/cnt_000211", commit: "abc123def456" }),
    writeFile(path.join(reportsDir, "raw-writer-attempt-1.json"), '{"token":"top-secret","body":"SHOULD-NOT-LEAK"}\n'),
    writeFile(path.join(reportsDir, "generated-body.md"), "SECRET GENERATED BODY\n"),
    writeFile(path.join(reportsDir, "candidate-body.md"), "SECRET CANDIDATE BODY\n"),
    writeFile(path.join(reportsDir, "slack-webhook.txt"), "https://hooks.slack.com/services/SECRET\n"),
    writeFile(path.join(reportsDir, "nested/extra.txt"), "nested data\n"),
  ]);
  return reportsDir;
}

test("builds a sanitized durable evidence comment within the size cap", async () => {
  const reportsDir = await createReportDir();
  const metadataResponses = new Map([
    ["instance-id", "ins-123"],
    ["placement/zone", "ap-seoul-1"],
    ["payment-mode", "postpaid"],
    ["instance/charge-type", "spot"],
  ]);
  const fetchImpl = async (url) => ({ ok: true, text: async () => metadataResponses.get(url.split("latest/meta-data/")[1]) || "missing" });
  const { comment, marker, bytes } = await buildDurableEvidenceComment({ reportsDir, evidenceIssueNumber: "688", fetchImpl });

  assert.match(marker, new RegExp(DURABLE_EVIDENCE_MARKER_PREFIX));
  assert.match(comment, /run-123/);
  assert.match(comment, /cnt_000211/);
  assert.match(comment, /draft_pr_created/);
  assert.match(comment, /https:\/\/github.com\/querypie\/corp-web-japan\/pull\/99/);
  assert.match(comment, /abc123def456/);
  assert.match(comment, /ins-123/);
  assert.match(comment, /ap-seoul-1/);
  assert.match(comment, /postpaid/);
  assert.match(comment, /spot/);
  assert.match(comment, /npm run test:ci/);
  assert.match(comment, /minor banner mismatch/);
  assert.match(comment, /raw-writer-attempt-1.json/);
  assert.match(comment, /generated-body.md/);
  assert.match(comment, /candidate-body.md/);
  assert.match(comment, /slack-webhook.txt/);
  assert.doesNotMatch(comment, /SHOULD-NOT-LEAK|SECRET GENERATED BODY|SECRET CANDIDATE BODY|hooks\.slack\.com\/services\/SECRET|top-secret/);
  assert.ok(bytes <= DURABLE_EVIDENCE_COMMENT_LIMIT_BYTES);
});

test("falls back to unavailable Tencent metadata on timeout or fetch failure", async () => {
  const metadata = await collectTencentHostMetadata({ fetchImpl: async () => { throw new Error("timeout"); } });
  assert.equal(metadata.instanceId, "unavailable");
  assert.equal(metadata.zone, "unavailable");
  assert.equal(metadata.paymentMode, "unavailable");
  assert.equal(metadata.chargeType, "unavailable");
});

test("publishes to issue and PR with idempotent marker checks", async () => {
  const reportsDir = await createReportDir();
  const calls = [];
  const execute = async (command, args, { input } = {}) => {
    calls.push({ command, args, input });
    if (args[0] === "issue" && args[1] === "view") return JSON.stringify({ comments: [] });
    if (args[0] === "pr" && args[1] === "view") return JSON.stringify({ comments: [{ body: input || "" }, { body: `<!-- ${DURABLE_EVIDENCE_MARKER_PREFIX} {\"runId\":\"run-123\",\"sourceId\":\"cnt_000211\",\"status\":\"draft_pr_created\",\"pullRequestUrl\":\"https://github.com/querypie/corp-web-japan/pull/99\"} -->` }] });
    return "ok\n";
  };
  const result = await publishDurableEvidence({
    reportsDir,
    githubRepo: "querypie/corp-web-japan",
    evidenceIssueNumber: "688",
    pullRequestUrl: "https://github.com/querypie/corp-web-japan/pull/99",
    execute,
    fetchImpl: async () => ({ ok: false, text: async () => "" }),
  });
  assert.equal(result.issueCommented, true);
  assert.equal(result.issueSkipped, false);
  assert.equal(result.prCommented, false);
  assert.equal(result.prSkipped, true);
  const issueComment = calls.find(({ args }) => args[0] === "issue" && args[1] === "comment");
  assert.deepEqual(issueComment.args.slice(0, 7), ["issue", "comment", "688", "--repo", "querypie/corp-web-japan", "--body-file", "-"]);
  assert.match(issueComment.input, new RegExp(DURABLE_EVIDENCE_MARKER_PREFIX));
});
