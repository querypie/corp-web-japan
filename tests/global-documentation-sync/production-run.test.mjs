import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, stat, utimes, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { cleanupFailedWorktrees, runProduction, runProductionCli } from "../../scripts/global-documentation-sync/production-run.mjs";

async function exists(file) { try { await stat(file); return true; } catch { return false; } }

function reviewArtifact(type, runId, sourceId) {
  return { schemaVersion: "global-documentation-sync/v1", artifactType: type, runId, sourceId, verdict: "pass", findings: [] };
}

test("no-candidate discovery records a passed terminal run status", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "sync-no-candidate-"));
  const reportsRoot = path.join(root, "reports");
  const worktreesRoot = path.join(root, "worktrees");
  const runId = "run-no-candidate";
  const result = await runProduction({
    globalRepo: path.join(root, "global"), targetRepo: path.join(root, "target"),
    reportsRoot, worktreesRoot, piBin: "pi", provider: "test", model: "test", runId,
    runPreflight: async () => {}, discoverLive: async () => ({ status: "no_candidate" }),
  });
  assert.equal(result.status, "no_candidate");
  const status = JSON.parse(await readFile(path.join(reportsRoot, runId, "run-status.json"), "utf8"));
  assert.equal(status.state, "passed");
  assert.equal(status.stage, "complete");
  assert.equal(status.result, "no_candidate");
});

test("no-candidate durable evidence is a required terminal gate when enabled", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "sync-no-candidate-gate-"));
  const reportsRoot = path.join(root, "reports");
  const worktreesRoot = path.join(root, "worktrees");
  const runId = "run-no-candidate-gate";
  await assert.rejects(() => runProduction({
    globalRepo: path.join(root, "global"), targetRepo: path.join(root, "target"),
    reportsRoot, worktreesRoot, piBin: "pi", provider: "test", model: "test", runId,
    runPreflight: async () => {},
    discoverLive: async () => ({ status: "no_candidate" }),
    env: { EVIDENCE_ISSUE_NUMBER: "688", DURABLE_EVIDENCE_REQUIRED: "1" },
    githubRepo: "querypie/corp-web-japan",
    publishDurableEvidence: async () => { throw new Error("ledger offline"); },
  }), /ledger offline/);
  const status = JSON.parse(await readFile(path.join(reportsRoot, runId, "run-status.json"), "utf8"));
  assert.equal(status.stage, "durable-evidence");
  assert.equal(status.state, "running");
});

test("success path gates completion on durable evidence publishing", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "sync-success-gate-"));
  const reportsRoot = path.join(root, "reports");
  const worktreesRoot = path.join(root, "worktrees");
  const targetRepo = path.join(root, "target");
  const reportsDir = path.join(reportsRoot, "run-success");
  const runId = "run-success";
  const sourceId = "cnt_000211";
  const fakeRun = async (command, args) => {
    if (command === "git" && args[0] === "rev-parse") return "base-commit\n";
    if (command === process.execPath) {
      await mkdir(reportsDir, { recursive: true });
      await Promise.all([
        writeFile(path.join(reportsDir, "candidate.json"), JSON.stringify({ schemaVersion: "global-documentation-sync/v1", artifactType: "candidate", runId, sourceId, sourceHash: `sha256:${"a".repeat(64)}`, sourceCategory: "blogs", sourceSection: "documentation", targetFamily: "blog", targetId: 21, sourceLocale: "ja", sourceHtmlPath: "/tmp/source.html", targetMdxPath: "/tmp/21-demo.mdx", targetAssetRoot: "/tmp/blog/21", targetRoute: "/blog/21/demo", meta: { id: "demo", contentType: "content" }, assets: [], externalMedia: [], production: { canonicalUrl: "https://www.querypie.com/en/blog/demo", listed: true, listUrl: "https://www.querypie.com/en/documentation", sitemap: true } })),
        writeFile(path.join(reportsDir, "run-summary.json"), JSON.stringify({ schemaVersion: "global-documentation-sync/v1", artifactType: "run-summary", runId, sourceId, status: "dry_run_passed", dryRun: true, committed: false, pushed: false, pullRequestUrl: null })),
        writeFile(path.join(reportsDir, "validation-results.json"), JSON.stringify({ schemaVersion: "global-documentation-sync/v1", artifactType: "validation-results", runId, sourceId, results: [{ command: "npm run test:ci", code: 0 }] })),
        writeFile(path.join(reportsDir, "fidelity-review.json"), JSON.stringify(reviewArtifact("fidelity-review", runId, sourceId))),
        writeFile(path.join(reportsDir, "japanese-editorial-review.json"), JSON.stringify(reviewArtifact("japanese-editorial-review", runId, sourceId))),
        writeFile(path.join(reportsDir, "contract-review.json"), JSON.stringify(reviewArtifact("contract-review", runId, sourceId))),
      ]);
      return "";
    }
    if (command === "git" && args[0] === "worktree" && args[1] === "remove") return "";
    throw new Error(`unexpected command: ${command} ${args.join(" ")}`);
  };
  const result = await runProduction({
    globalRepo: path.join(root, "global"),
    targetRepo,
    reportsRoot,
    worktreesRoot,
    piBin: "pi",
    provider: "test",
    model: "test",
    runId,
    githubRepo: "querypie/corp-web-japan",
    env: { EVIDENCE_ISSUE_NUMBER: "688", DURABLE_EVIDENCE_REQUIRED: "1" },
    runPreflight: async () => {},
    discoverLive: async () => ({ status: "candidate", source: { sourceId, production: { canonicalUrl: "https://www.querypie.com/en/blog/demo", listed: true, listUrl: "https://www.querypie.com/en/documentation", sitemap: true } }, reservedTargetIds: [] }),
    runCommand: fakeRun,
    createRunWorktree: async () => {},
    publishDraft: async ({ onPushed }) => {
      await onPushed({ branch: `content-sync/${sourceId}`, commit: "published-commit" });
      return { branch: `content-sync/${sourceId}`, commit: "published-commit", pullRequestUrl: "https://github.com/querypie/corp-web-japan/pull/99" };
    },
    publishDurableEvidence: async () => ({ issueCommented: true, prCommented: true }),
  });
  assert.equal(result.status, "draft_pr_created");
  assert.equal(result.pullRequestUrl, "https://github.com/querypie/corp-web-japan/pull/99");
  const durable = JSON.parse(await readFile(path.join(reportsDir, "durable-evidence-summary.json"), "utf8"));
  assert.equal(durable.issueCommented, true);
  assert.equal(durable.prCommented, true);
  const status = JSON.parse(await readFile(path.join(reportsDir, "run-status.json"), "utf8"));
  assert.equal(status.stage, "complete");
  assert.equal(status.state, "passed");
});

test("failure CLI path publishes durable evidence and fails closed when the ledger publish fails", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "sync-failure-gate-"));
  const reportsRoot = path.join(root, "reports");
  const runId = "run-failure";
  await assert.rejects(() => runProductionCli({
    reportsRoot,
    runId,
    env: { EVIDENCE_ISSUE_NUMBER: "688", DURABLE_EVIDENCE_REQUIRED: "1" },
    githubRepo: "querypie/corp-web-japan",
    publishDurableEvidence: async () => { throw new Error("gh unavailable"); },
  }, async () => { throw new Error("draft pr created but terminal gate failed"); }), /durable evidence publish failed: gh unavailable/);
  const failure = JSON.parse(await readFile(path.join(reportsRoot, runId, "failure-summary.json"), "utf8"));
  assert.match(failure.reason, /draft pr created/);
  const status = JSON.parse(await readFile(path.join(reportsRoot, runId, "run-status.json"), "utf8"));
  assert.equal(status.stage, "durable-evidence");
  assert.equal(status.state, "failed");
  assert.match(status.reason, /gh unavailable/);
});

test("stale cleanup removes only automation-owned worktree names", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "sync-cleanup-"));
  execFileSync("git", ["init"], { cwd: root, stdio: "ignore" });
  const automation = path.join(root, "sync-old-run");
  const retry = path.join(root, "retry-old-run");
  const human = path.join(root, "human-feature");
  await Promise.all([automation, retry, human].map((directory) => mkdir(directory)));
  const old = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
  await Promise.all([automation, retry, human].map((directory) => utimes(directory, old, old)));
  await cleanupFailedWorktrees(root, root);
  assert.equal(await exists(automation), false);
  assert.equal(await exists(retry), false);
  assert.equal(await exists(human), true);
});
