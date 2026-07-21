import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, stat, utimes, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { cleanupFailedWorktrees, durableEvidenceConfig, runProduction, runProductionCli } from "../../scripts/global-documentation-sync/production-run.mjs";

async function exists(file) { try { await stat(file); return true; } catch { return false; } }

function reviewArtifact(type, runId, sourceId) {
  return { schemaVersion: "global-documentation-sync/v1", artifactType: type, runId, sourceId, verdict: "pass", findings: [] };
}

async function initGitRepo(root, file = "README.md") {
  execFileSync("git", ["init"], { cwd: root, stdio: "ignore" });
  execFileSync("git", ["config", "user.name", "Test User"], { cwd: root, stdio: "ignore" });
  execFileSync("git", ["config", "user.email", "test@example.com"], { cwd: root, stdio: "ignore" });
  await writeFile(path.join(root, file), "seed\n");
  execFileSync("git", ["add", file], { cwd: root, stdio: "ignore" });
  execFileSync("git", ["commit", "-m", "seed"], { cwd: root, stdio: "ignore" });
  return execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
}

test("durable evidence config rejects missing blank invalid issue numbers and missing github repo", () => {
  assert.deepEqual(durableEvidenceConfig({ env: {} }), { evidenceIssueNumber: null, githubRepo: null, required: false });
  assert.throws(() => durableEvidenceConfig({ env: { DURABLE_EVIDENCE_REQUIRED: "1" }, githubRepo: "querypie/corp-web-japan" }), /valid EVIDENCE_ISSUE_NUMBER required/);
  assert.throws(() => durableEvidenceConfig({ env: { DURABLE_EVIDENCE_REQUIRED: "1", EVIDENCE_ISSUE_NUMBER: "   " }, githubRepo: "querypie/corp-web-japan" }), /valid EVIDENCE_ISSUE_NUMBER required/);
  assert.throws(() => durableEvidenceConfig({ env: { DURABLE_EVIDENCE_REQUIRED: "1", EVIDENCE_ISSUE_NUMBER: "abc" }, githubRepo: "querypie/corp-web-japan" }), /valid EVIDENCE_ISSUE_NUMBER required/);
  assert.throws(() => durableEvidenceConfig({ env: { DURABLE_EVIDENCE_REQUIRED: "1", EVIDENCE_ISSUE_NUMBER: "688" } }), /githubRepo required/);
  assert.deepEqual(durableEvidenceConfig({ env: { DURABLE_EVIDENCE_REQUIRED: "1", EVIDENCE_ISSUE_NUMBER: "688" }, githubRepo: "querypie/corp-web-japan" }), { evidenceIssueNumber: "688", githubRepo: "querypie/corp-web-japan", required: true });
});

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

test("dry run publishes durable evidence before cleanup and restores terminal passed status", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "sync-dry-run-gate-"));
  const reportsRoot = path.join(root, "reports");
  const worktreesRoot = path.join(root, "worktrees");
  const targetRepo = path.join(root, "target");
  const runId = "run-dry-success";
  const reportsDir = path.join(reportsRoot, runId);
  const sourceId = "cnt_000211";
  const events = [];
  const durableCalls = [];
  const createWorktreeCalls = [];
  const dryRunArgs = [];
  const fakeRun = async (command, args) => {
    if (command === "git" && args[0] === "rev-parse") return "deadbeefcafebabe\n";
    if (command === process.execPath) {
      dryRunArgs.push(args);
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
    if (command === "git" && args[0] === "worktree" && args[1] === "remove") {
      events.push("cleanup");
      return "";
    }
    throw new Error(`unexpected command: ${command} ${args.join(" ")}`);
  };

  const result = await runProduction({
    dryRun: true,
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
    discoverLive: async () => ({ status: "candidate", source: { sourceId, sourceSection: "documentation", production: { canonicalUrl: "https://www.querypie.com/en/blog/demo", listed: true, listUrl: "https://www.querypie.com/en/documentation", sitemap: true } }, reservedTargetIds: [] }),
    runCommand: fakeRun,
    createRunWorktree: async (options) => { createWorktreeCalls.push(options); },
    publishDraft: async () => { throw new Error("publishDraft should not run for dry run"); },
    publishDurableEvidence: async (options) => {
      events.push("publish");
      durableCalls.push(options);
      return { issueCommented: true, issueSkipped: false, prCommented: false, prSkipped: false };
    },
  });

  assert.equal(result.status, "dry_run_passed");
  assert.deepEqual(events, ["publish", "cleanup"]);
  assert.equal(durableCalls.length, 1);
  assert.equal(createWorktreeCalls[0].sourceSection, "documentation");
  assert.ok(dryRunArgs[0].includes("--source-section"));
  assert.ok(dryRunArgs[0].includes("documentation"));
  const productionEvidence = JSON.parse(await readFile(path.join(reportsDir, "production-evidence.json"), "utf8"));
  assert.equal(productionEvidence.sourceSection, "documentation");
  assert.equal(durableCalls[0].sourceId, sourceId);
  assert.equal(durableCalls[0].status, "dry_run_passed");
  assert.equal(durableCalls[0].pullRequestUrl, null);
  assert.equal(durableCalls[0].targetCommitOverride, "deadbeefcafebabe");
  const durable = JSON.parse(await readFile(path.join(reportsDir, "durable-evidence-summary.json"), "utf8"));
  assert.equal(durable.sourceId, sourceId);
  assert.equal(durable.status, "dry_run_passed");
  assert.equal(durable.issueCommented, true);
  assert.equal(durable.prCommented, false);
  const status = JSON.parse(await readFile(path.join(reportsDir, "run-status.json"), "utf8"));
  assert.equal(status.stage, "complete");
  assert.equal(status.state, "passed");
  assert.equal(status.result, "dry_run_passed");
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
    if (command === "git" && args[0] === "rev-parse") return "deadbeefcafebabe\n";
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
    discoverLive: async () => ({ status: "candidate", source: { sourceId, sourceSection: "documentation", production: { canonicalUrl: "https://www.querypie.com/en/blog/demo", listed: true, listUrl: "https://www.querypie.com/en/documentation", sitemap: true } }, reservedTargetIds: [] }),
    runCommand: fakeRun,
    createRunWorktree: async () => {},
    publishDraft: async ({ onPushed }) => {
      await onPushed({ branch: `content-sync/documentation-${sourceId}`, commit: "published-commit" });
      return { branch: `content-sync/documentation-${sourceId}`, commit: "published-commit", pullRequestUrl: "https://github.com/querypie/corp-web-japan/pull/99" };
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

test("required durable evidence misconfig fails before no-candidate discovery", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "sync-no-candidate-misconfig-"));
  await assert.rejects(() => runProduction({
    globalRepo: path.join(root, "global"), targetRepo: path.join(root, "target"),
    reportsRoot: path.join(root, "reports"), worktreesRoot: path.join(root, "worktrees"),
    piBin: "pi", provider: "test", model: "test", runId: "run-misconfig",
    env: { DURABLE_EVIDENCE_REQUIRED: "1", EVIDENCE_ISSUE_NUMBER: " " },
    githubRepo: "querypie/corp-web-japan",
    runPreflight: async () => { throw new Error("preflight should not run"); },
    discoverLive: async () => { throw new Error("discovery should not run"); },
  }), /valid EVIDENCE_ISSUE_NUMBER required/);
});

test("failure CLI path leaves a failed terminal run status after durable evidence publishes", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "sync-failure-terminal-"));
  const targetRepo = path.join(root, "target");
  const reportsRoot = path.join(root, "reports");
  await mkdir(targetRepo, { recursive: true });
  const headCommit = await initGitRepo(targetRepo);
  const runId = "run-failure-terminal";
  const durableCalls = [];

  await assert.rejects(() => runProductionCli({
    globalRepo: path.join(root, "global"),
    targetRepo,
    reportsRoot,
    worktreesRoot: path.join(root, "worktrees"),
    piBin: "pi",
    provider: "test",
    model: "test",
    runId,
    env: { EVIDENCE_ISSUE_NUMBER: "688", DURABLE_EVIDENCE_REQUIRED: "1" },
    githubRepo: "querypie/corp-web-japan",
    runPreflight: async () => {},
    discoverLive: async () => ({ status: "blocked_source_contract", sourceId: "cnt_999", reason: "status must equal published: hidden" }),
    publishDurableEvidence: async (options) => {
      durableCalls.push(options);
      return { issueCommented: true, prCommented: false };
    },
  }), /discovery blocked: blocked_source_contract/);

  assert.equal(durableCalls.length, 1);
  assert.equal(durableCalls[0].targetCommitOverride, headCommit);
  const status = JSON.parse(await readFile(path.join(reportsRoot, runId, "run-status.json"), "utf8"));
  assert.equal(status.stage, "failed");
  assert.equal(status.state, "failed");
  assert.equal(status.result, "failed");
  const durable = JSON.parse(await readFile(path.join(reportsRoot, runId, "durable-evidence-summary.json"), "utf8"));
  assert.equal(durable.issueCommented, true);
  assert.equal(durable.prCommented, false);
  const failure = JSON.parse(await readFile(path.join(reportsRoot, runId, "failure-summary.json"), "utf8"));
  assert.match(failure.reason, /discovery blocked: blocked_source_contract/);
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

test("dry run durable evidence failure keeps worktree for retry diagnosis and marks status failed", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "sync-dry-fail-"));
  const reportsRoot = path.join(root, "reports");
  const worktreesRoot = path.join(root, "worktrees");
  const targetRepo = path.join(root, "target");
  const runId = "run-dry-failure";
  const sourceId = "cnt_000211";
  let cleanupAttempts = 0;
  await assert.rejects(() => runProductionCli({
    dryRun: true,
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
    discoverLive: async () => ({ status: "candidate", source: { sourceId, sourceSection: "documentation", production: { canonicalUrl: "https://www.querypie.com/en/blog/demo", listed: true, listUrl: "https://www.querypie.com/en/documentation", sitemap: true } }, reservedTargetIds: [] }),
    runCommand: async (command, args) => {
      if (command === "git" && args[0] === "rev-parse") return "deadbeefcafebabe\n";
      if (command === process.execPath) {
        const reportsDir = path.join(reportsRoot, runId);
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
      if (command === "git" && args[0] === "worktree" && args[1] === "remove") {
        cleanupAttempts += 1;
        return "";
      }
      throw new Error(`unexpected command: ${command} ${args.join(" ")}`);
    },
    createRunWorktree: async () => {},
    publishDurableEvidence: async () => { throw new Error("issue 688 unavailable"); },
  }), /issue 688 unavailable/);

  assert.equal(cleanupAttempts, 0);
  const status = JSON.parse(await readFile(path.join(reportsRoot, runId, "run-status.json"), "utf8"));
  assert.equal(status.stage, "durable-evidence");
  assert.equal(status.state, "failed");
  assert.match(status.reason, /issue 688 unavailable/);
});

test("durable evidence failure does not trigger a recursive republish loop", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "sync-durable-loop-"));
  const reportsRoot = path.join(root, "reports");
  const worktreesRoot = path.join(root, "worktrees");
  const targetRepo = path.join(root, "target");
  const runId = "run-loop";
  const sourceId = "cnt_000211";
  let durablePublishAttempts = 0;
  let publishDraftAttempts = 0;
  await assert.rejects(() => runProductionCli({
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
    discoverLive: async () => ({ status: "candidate", source: { sourceId, sourceSection: "documentation", production: { canonicalUrl: "https://www.querypie.com/en/blog/demo", listed: true, listUrl: "https://www.querypie.com/en/documentation", sitemap: true } }, reservedTargetIds: [] }),
    runCommand: async (command, args) => {
      if (command === "git" && args[0] === "rev-parse") return "deadbeefcafebabe\n";
      if (command === process.execPath) {
        const reportsDir = path.join(reportsRoot, runId);
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
    },
    createRunWorktree: async () => {},
    publishDraft: async ({ onPushed }) => {
      publishDraftAttempts += 1;
      await onPushed({ branch: `content-sync/documentation-${sourceId}`, commit: "published-commit" });
      return { branch: `content-sync/documentation-${sourceId}`, commit: "published-commit", pullRequestUrl: "https://github.com/querypie/corp-web-japan/pull/99" };
    },
    publishDurableEvidence: async () => {
      durablePublishAttempts += 1;
      throw new Error("pr comment failed");
    },
  }), /pr comment failed/);
  assert.equal(publishDraftAttempts, 1);
  assert.equal(durablePublishAttempts, 1);
  const status = JSON.parse(await readFile(path.join(reportsRoot, runId, "run-status.json"), "utf8"));
  assert.equal(status.stage, "durable-evidence");
  assert.equal(status.state, "failed");
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
