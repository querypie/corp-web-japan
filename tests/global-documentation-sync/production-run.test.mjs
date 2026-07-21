import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, stat, utimes } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { cleanupFailedWorktrees, runProduction } from "../../scripts/global-documentation-sync/production-run.mjs";

async function exists(file) { try { await stat(file); return true; } catch { return false; } }

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
