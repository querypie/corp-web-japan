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
  DURABLE_EVIDENCE_MAX_BROWSER_FINDINGS,
  DURABLE_EVIDENCE_MAX_REVIEW_FINDINGS,
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

test("builds a strict bounded durable evidence projection within the size cap", async () => {
  const reportsDir = await createReportDir();
  const largeSecret = `Bearer ${"x".repeat(6000)}`;
  const writeJson = (name, value) => writeFile(path.join(reportsDir, name), `${JSON.stringify(value, null, 2)}\n`);
  await Promise.all([
    writeJson("fidelity-review.json", {
      schemaVersion: "global-documentation-sync/v1",
      artifactType: "fidelity-review",
      runId: "run-123",
      sourceId: "cnt_000211",
      verdict: "revise",
      sourceHtml: `<div>${"SECRET_HTML".repeat(400)}</div>`,
      findings: Array.from({ length: DURABLE_EVIDENCE_MAX_REVIEW_FINDINGS + 5 }, (_, index) => ({
        severity: index % 2 === 0 ? "major" : "note",
        location: `section ${index} ${"L".repeat(600)}`,
        message: `keep this finding ${index} ${largeSecret} ${"M".repeat(600)}`,
        suggestion: `drop me ${"S".repeat(600)}`,
        excerpt: `drop excerpt ${"E".repeat(600)}`,
        sourceHtml: `<p>${"HTML".repeat(600)}</p>`,
        webhookUrl: "https://hooks.slack.com/services/SECRET",
      })),
      arbitrary: { nested: "SECRET_NESTED" },
    }),
    writeJson("browser-results.json", {
      schemaVersion: "global-documentation-sync/v1",
      artifactType: "browser-results",
      runId: "run-123",
      sourceId: "cnt_000211",
      results: [
        {
          viewport: { width: 1440, height: 900, scale: 99 },
          status: "failed",
          url: "https://secret.example.com/?token=hunter2",
          findings: [
            "minor banner mismatch",
            ...Array.from({ length: DURABLE_EVIDENCE_MAX_BROWSER_FINDINGS + 3 }, (_, index) => ({
              severity: "minor",
              location: `hero ${index} ${"B".repeat(600)}`,
              message: `browser finding ${index} ${largeSecret} ${"C".repeat(600)}`,
              excerpt: `remove excerpt ${"X".repeat(600)}`,
              sourceHtml: `<div>${"Y".repeat(600)}</div>`,
              unknown: "DROP_UNKNOWN",
            })),
          ],
          metrics: { sourceHtml: "LEAK" },
        },
      ],
    }),
  ]);
  const metadataResponses = new Map([
    ["instance-id", "ins-123"],
    ["placement/zone", "ap-seoul-1"],
    ["payment-mode", "postpaid"],
    ["payment/charge-type", "SPOT"],
  ]);
  const metadataUrls = [];
  const fetchImpl = async (url) => {
    metadataUrls.push(url);
    return { ok: true, text: async () => metadataResponses.get(url.split("latest/meta-data/")[1]) || "missing" };
  };
  const { comment, marker, bytes } = await buildDurableEvidenceComment({ reportsDir, evidenceIssueNumber: "688", fetchImpl });

  assert.match(marker, new RegExp(DURABLE_EVIDENCE_MARKER_PREFIX));
  assert.match(comment, /run-123/);
  assert.match(comment, /cnt_000211/);
  assert.match(comment, /sourceSection: `documentation`/);
  assert.match(comment, /sourceCategory: `blogs`/);
  assert.match(comment, /targetFamily: `blog`/);
  assert.match(comment, /targetId: `21`/);
  assert.match(comment, /targetRoute: `\/blog\/21\/demo`/);
  assert.match(comment, /draft_pr_created/);
  assert.match(comment, /https:\/\/github.com\/querypie\/corp-web-japan\/pull\/99/);
  assert.match(comment, /abc123def456/);
  assert.match(comment, /ins-123/);
  assert.match(comment, /ap-seoul-1/);
  assert.match(comment, /postpaid/);
  assert.match(comment, /SPOT/);
  assert.ok(metadataUrls.some((url) => url.endsWith("/payment/charge-type")));
  assert.match(comment, /npm run test:ci/);
  assert.match(comment, /minor banner mismatch/);
  assert.match(comment, /raw-writer-attempt-1.json/);
  assert.match(comment, /generated-body.md/);
  assert.match(comment, /candidate-body.md/);
  assert.match(comment, /slack-webhook.txt/);
  assert.match(comment, /"artifactType":"fidelity-review"/);
  assert.match(comment, /"verdict":"revise"/);
  assert.match(comment, /"status":"failed"/);
  assert.doesNotMatch(comment, /suggestion|excerpt|sourceHtml|arbitrary|unknown|DROP_UNKNOWN|SECRET_NESTED|SECRET_HTML|LEAK/);
  assert.doesNotMatch(comment, /SHOULD-NOT-LEAK|SECRET GENERATED BODY|SECRET CANDIDATE BODY|hooks\.slack\.com\/services\/SECRET|top-secret/);
  assert.doesNotMatch(comment, /Bearer x{30,}|token=hunter2/);
  assert.equal((comment.match(/keep this finding/g) || []).length, DURABLE_EVIDENCE_MAX_REVIEW_FINDINGS);
  assert.equal((comment.match(/browser finding/g) || []).length, DURABLE_EVIDENCE_MAX_BROWSER_FINDINGS - 1);
  assert.ok(bytes <= DURABLE_EVIDENCE_COMMENT_LIMIT_BYTES);
});

test("renders unavailable for malformed identity fields instead of leaking payloads", async () => {
  const reportsDir = await createReportDir();
  await Promise.all([
    writeFile(path.join(reportsDir, "candidate.json"), JSON.stringify({
      schemaVersion: "global-documentation-sync/v1",
      artifactType: "candidate",
      runId: "run-123",
      sourceId: "cnt_000211",
      sourceHash: `sha256:${"a".repeat(64)}`,
      sourceCategory: "https://evil.example/category?token=hunter2",
      sourceSection: "documentation\nleak",
      targetFamily: "blog<script>",
      targetId: "0",
      sourceLocale: "ja",
      sourceHtmlPath: "/tmp/source.html",
      targetMdxPath: "/tmp/21-demo.mdx",
      targetAssetRoot: "/tmp/blog/21",
      targetRoute: "https://evil.example/blog/21/demo?token=hunter2",
      meta: { id: "demo", contentType: "content" },
      assets: [],
      externalMedia: [],
      production: { canonicalUrl: "https://www.querypie.com/en/blog/demo", listed: true, listUrl: "https://www.querypie.com/en/documentation", sitemap: true },
    })),
    writeFile(path.join(reportsDir, "run-summary.json"), JSON.stringify({
      schemaVersion: "global-documentation-sync/v1",
      artifactType: "run-summary",
      runId: "run-123",
      sourceId: "cnt_000211",
      sourceCategory: "DROP_ME",
      sourceSection: "DROP_ME",
      targetFamily: "DROP_ME",
      targetId: -7,
      targetRoute: "/blog/0/demo?token=hunter2",
      status: "draft_pr_created",
      dryRun: false,
      committed: true,
      pushed: true,
      pullRequestUrl: "https://github.com/querypie/corp-web-japan/pull/99",
    })),
  ]);

  const { comment } = await buildDurableEvidenceComment({
    reportsDir,
    evidenceIssueNumber: "688",
    fetchImpl: async () => ({ ok: false, text: async () => "" }),
  });

  assert.match(comment, /sourceSection: `unavailable`/);
  assert.match(comment, /sourceCategory: `unavailable`/);
  assert.match(comment, /targetFamily: `unavailable`/);
  assert.match(comment, /targetId: `unavailable`/);
  assert.match(comment, /targetRoute: `unavailable`/);
  assert.doesNotMatch(comment, /DROP_ME|evil\.example|hunter2|<script>|documentation\\nleak/);
});

test("uses explicit target commit override when production evidence is absent", async () => {
  const reportsDir = await createReportDir();
  await Promise.all([
    writeFile(path.join(reportsDir, "run-summary.json"), JSON.stringify({ schemaVersion: "global-documentation-sync/v1", artifactType: "run-summary", runId: "run-123", sourceId: "cnt_000211", status: "failed", dryRun: false, committed: false, pushed: false, pullRequestUrl: null })),
    writeFile(path.join(reportsDir, "failure-summary.json"), JSON.stringify({ schemaVersion: "global-documentation-sync/v1", runId: "run-123", status: "failed", reason: "discovery blocked" })),
  ]);
  await writeFile(path.join(reportsDir, "production-evidence.json"), "null\n", { flag: "w" });
  const { comment } = await buildDurableEvidenceComment({
    reportsDir,
    evidenceIssueNumber: "688",
    targetCommitOverride: "deadbeefcafebabe",
    fetchImpl: async () => ({ ok: false, text: async () => "" }),
  });
  assert.match(comment, /deployedTargetGitCommit: `deadbeefcafebabe`/);
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

test("retries PR-only after issue comment already succeeded", async () => {
  const reportsDir = await createReportDir();
  const calls = [];
  let marker = "";
  const execute = async (command, args, { input } = {}) => {
    calls.push({ command, args, input });
    if (args[0] === "issue" && args[1] === "view") return JSON.stringify({ comments: marker ? [{ body: marker }] : [] });
    if (args[0] === "issue" && args[1] === "comment") {
      marker = input.match(/<!-- durable-global-documentation-sync-evidence:v1 [\s\S]+?-->/)[0];
      return "ok\n";
    }
    if (args[0] === "pr" && args[1] === "view") return JSON.stringify({ comments: [] });
    if (args[0] === "pr" && args[1] === "comment") {
      if (!marker || calls.filter(({ args: loggedArgs }) => loggedArgs[0] === "pr" && loggedArgs[1] === "comment").length === 1) {
        throw new Error("pr comment failed");
      }
      return "ok\n";
    }
    throw new Error(`unexpected gh call: ${args.join(" ")}`);
  };

  await assert.rejects(() => publishDurableEvidence({
    reportsDir,
    githubRepo: "querypie/corp-web-japan",
    evidenceIssueNumber: "688",
    pullRequestUrl: "https://github.com/querypie/corp-web-japan/pull/99",
    execute,
    fetchImpl: async () => ({ ok: false, text: async () => "" }),
  }), /pr comment failed/);

  const retryResult = await publishDurableEvidence({
    reportsDir,
    githubRepo: "querypie/corp-web-japan",
    evidenceIssueNumber: "688",
    pullRequestUrl: "https://github.com/querypie/corp-web-japan/pull/99",
    execute,
    fetchImpl: async () => ({ ok: false, text: async () => "" }),
  });

  assert.equal(retryResult.issueCommented, false);
  assert.equal(retryResult.issueSkipped, true);
  assert.equal(retryResult.prCommented, true);
  assert.equal(retryResult.prSkipped, false);
  assert.equal(calls.filter(({ args }) => args[0] === "issue" && args[1] === "comment").length, 1);
  assert.equal(calls.filter(({ args }) => args[0] === "pr" && args[1] === "comment").length, 2);
});


test("fails before gh when required durable evidence still exceeds 60KB", async () => {
  const reportsDir = await createReportDir();
  await Promise.all(Array.from({ length: 1800 }, (_, index) => writeFile(path.join(reportsDir, `nested/${String(index).padStart(4, "0")}-${"x".repeat(40)}.txt`), "x\n")));
  let ghCalls = 0;
  await assert.rejects(() => publishDurableEvidence({
    reportsDir,
    githubRepo: "querypie/corp-web-japan",
    evidenceIssueNumber: "688",
    pullRequestUrl: "https://github.com/querypie/corp-web-japan/pull/99",
    execute: async () => { ghCalls += 1; throw new Error("gh should not run"); },
    fetchImpl: async () => ({ ok: false, text: async () => "" }),
  }), /durable evidence comment exceeds/);
  assert.equal(ghCalls, 0);
});
