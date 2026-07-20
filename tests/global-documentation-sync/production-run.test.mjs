import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, stat, utimes } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { cleanupFailedWorktrees } from "../../scripts/global-documentation-sync/production-run.mjs";

async function exists(file) { try { await stat(file); return true; } catch { return false; } }

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
