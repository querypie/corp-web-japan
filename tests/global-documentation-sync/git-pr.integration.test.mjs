import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { createRunWorktree, publishDraft, publishRetry } from "../../scripts/global-documentation-sync/git-pr.mjs";

function git(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8", env: { ...process.env, GIT_AUTHOR_NAME: "Sync Test", GIT_AUTHOR_EMAIL: "sync@example.test", GIT_COMMITTER_NAME: "Sync Test", GIT_COMMITTER_EMAIL: "sync@example.test" } });
}

test("actual local Git transaction pushes one deterministic branch, creates a Draft PR, and retries the same PR", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "sync-git-transaction-"));
  const remote = path.join(root, "remote.git");
  const base = path.join(root, "base");
  const firstWorktree = path.join(root, "first");
  const retryWorktree = path.join(root, "retry");
  await mkdir(base);
  git(["init", "--bare", remote], root);
  git(["init", "--initial-branch=main"], base);
  await writeFile(path.join(base, "README.md"), "base\n");
  git(["add", "README.md"], base);
  git(["commit", "-m", "Initial"], base);
  git(["remote", "add", "origin", remote], base);
  git(["push", "-u", "origin", "main"], base);

  const ghCalls = [];
  const execute = async (command, args, cwd) => {
    if (command === "gh") {
      ghCalls.push(args);
      return args[1] === "create" ? "https://github.com/querypie/corp-web-japan/pull/999\n" : "";
    }
    return git(args, cwd);
  };

  await createRunWorktree({ baseRepo: base, worktreePath: firstWorktree, sourceId: "cnt_000999", sourceSection: "documentation" });
  await writeFile(path.join(firstWorktree, "generated.mdx"), "first\n");
  const candidate = { sourceId: "cnt_000999", sourceSection: "documentation", sourceHash: "sha256:test", sourceLocale: "ja", runId: "integration", targetFamily: "blog", targetId: 999, targetMdxPath: path.join(firstWorktree, "generated.mdx"), assets: [], production: { canonicalUrl: "https://example.test/en/documentation/test" }, meta: { id: "test", title: { en: "Test" } } };
  const validation = { results: [] };
  const reviews = ["fidelity-review", "japanese-editorial-review", "contract-review"].map((artifactType) => ({ artifactType, verdict: "pass", findings: [] }));
  const published = await publishDraft({ targetRepo: firstWorktree, candidate, validation, reviews, execute });
  assert.equal(published.branch, "content-sync/documentation-cnt_000999");
  assert.equal(ghCalls[0].includes("--draft"), true);
  assert.equal(git(["ls-remote", "--heads", remote, published.branch], base).includes(published.commit), true);

  git(["worktree", "remove", "--force", firstWorktree], base);
  git(["fetch", "origin", published.branch], base);
  git(["worktree", "add", "--detach", retryWorktree, `origin/${published.branch}`], base);
  await writeFile(path.join(retryWorktree, "generated.mdx"), "corrected\n");
  const retryCandidate = { ...candidate, targetMdxPath: path.join(retryWorktree, "generated.mdx") };
  const retried = await publishRetry({ targetRepo: retryWorktree, candidate: retryCandidate, branch: published.branch, pullRequestNumber: 999, pullRequestBody: "updated marker", execute });
  assert.notEqual(retried.commit, published.commit);
  assert.equal(git(["ls-remote", "--heads", remote, published.branch], base).includes(retried.commit), true);
  assert.equal(ghCalls.some((args) => args[0] === "pr" && args[1] === "reopen" && args[2] === "999"), true);
  assert.equal(ghCalls.some((args) => args[0] === "pr" && args[1] === "edit" && args.includes("updated marker")), true);
});

test("actual local Git retry preserves a validated legacy remote branch", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "sync-git-legacy-retry-"));
  const remote = path.join(root, "remote.git");
  const base = path.join(root, "base");
  const retryWorktree = path.join(root, "retry");
  await mkdir(base);
  git(["init", "--bare", remote], root);
  git(["init", "--initial-branch=main"], base);
  await writeFile(path.join(base, "README.md"), "base\n");
  git(["add", "README.md"], base);
  git(["commit", "-m", "Initial"], base);
  git(["remote", "add", "origin", remote], base);
  git(["push", "-u", "origin", "main"], base);
  git(["checkout", "-b", "content-sync/cnt_000212"], base);
  await writeFile(path.join(base, "generated.mdx"), "legacy\n");
  git(["add", "generated.mdx"], base);
  git(["commit", "-m", "Legacy sync"], base);
  git(["push", "-u", "origin", "content-sync/cnt_000212"], base);
  git(["checkout", "main"], base);
  git(["worktree", "add", "--detach", retryWorktree, "origin/content-sync/cnt_000212"], base);
  await writeFile(path.join(retryWorktree, "generated.mdx"), "legacy retry\n");

  const ghCalls = [];
  const execute = async (command, args, cwd) => {
    if (command === "gh") {
      ghCalls.push(args);
      return "";
    }
    return git(args, cwd);
  };

  const candidate = {
    sourceId: "cnt_000212",
    sourceSection: "news",
    sourceHash: "sha256:test",
    sourceLocale: "ja",
    runId: "legacy-retry",
    targetFamily: "news",
    targetId: 212,
    targetMdxPath: path.join(retryWorktree, "generated.mdx"),
    assets: [],
    production: { canonicalUrl: "https://example.test/en/news/news-212" },
    meta: { id: "news-212", title: { en: "News 212" }, contentType: "content" },
  };
  const retried = await publishRetry({ targetRepo: retryWorktree, candidate, branch: "content-sync/cnt_000212", pullRequestNumber: 687, execute });
  assert.equal(retried.branch, "content-sync/cnt_000212");
  assert.equal(git(["ls-remote", "--heads", remote, "content-sync/cnt_000212"], base).includes(retried.commit), true);
  assert.equal(ghCalls.some((args) => args[0] === "pr" && args[1] === "reopen" && args[2] === "687"), true);
});
