import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { assertAllocatedGitDiff, authorizeClosedRetry, branchFor, buildPullRequestBody, createRunWorktree, publishDraft, publishRetry, reclaimUnpublishedBaseBranch, resumeBranchOnly } from "../../scripts/global-documentation-sync/git-pr.mjs";
import { parseSyncMarker } from "../../scripts/global-documentation-sync/discovery.mjs";

const candidate = { sourceId: "cnt_9", sourceHash: "sha256:x", targetFamily: "blog", targetId: 9, targetMdxPath: "/target/src/content/blog/9-nine.mdx", assets: [], meta: { id: "nine" }, production: { canonicalUrl: "https://www.querypie.com/en/blog/nine" }, runId: "run-9" };

const generatedDiffExecute = (calls) => async (command, args) => {
  calls.push([command, args]);
  if (command === "gh") return "https://github.com/querypie/corp-web-japan/pull/1\n";
  if (args[0] === "status") return "?? src/content/blog/9-nine.mdx\0";
  if (args[0] === "diff") return "src/content/blog/9-nine.mdx\0";
  return "";
};

test("uses deterministic branches and a machine-readable PR marker", () => {
  assert.equal(branchFor("cnt_9"), "content-sync/cnt_9");
  const body = buildPullRequestBody({ candidate, validation: { results: [] }, reviews: [] });
  const marker = parseSyncMarker(body);
  assert.equal(marker.sourceId, "cnt_9");
  assert.equal(marker.targetId, 9);
  assert.match(body, /Draft/);
});

test("creates an isolated branch worktree from current origin main", async () => {
  const calls = [];
  await createRunWorktree({ baseRepo: "/base", worktreePath: "/runs/run-9", sourceId: "cnt_9", execute: async (...args) => { calls.push(args); return ""; } });
  assert.deepEqual(calls.map(([command, args]) => [command, args.slice(0, 2)]), [
    ["git", ["fetch", "origin"]],
    ["git", ["for-each-ref", "--format=%(objectname)"]],
    ["git", ["worktree", "add"]],
  ]);
});

test("reclaims only an unpushed base-equivalent automation branch", async () => {
  const calls = [];
  const execute = async (command, args) => {
    calls.push([command, args]);
    if (args[0] === "for-each-ref") return "old-base-commit\n";
    if (args[0] === "ls-remote") return "";
    if (args[0] === "rev-parse") return "current-base-commit\n";
    if (args[0] === "merge-base") return "old-base-commit\n";
    if (args[0] === "worktree" && args[1] === "list") return "worktree /runs/old-run\nHEAD old-base-commit\nbranch refs/heads/content-sync/cnt_9\n\n";
    return "";
  };
  assert.equal(await reclaimUnpublishedBaseBranch({ baseRepo: "/base", worktreePath: "/runs/new-run", sourceId: "cnt_9", execute }), true);
  assert.ok(calls.some(([, args]) => args.join(" ") === "worktree remove --force /runs/old-run"));
  assert.ok(calls.some(([, args]) => args.join(" ") === "branch -D content-sync/cnt_9"));
});

test("blocks an unpublished branch with local commits", async () => {
  const execute = async (_command, args) => {
    if (args[0] === "for-each-ref") return "local-commit\n";
    if (args[0] === "ls-remote") return "";
    if (args[0] === "rev-parse" || args[0] === "merge-base") return "base-commit\n";
    throw new Error(`unexpected command: ${args.join(" ")}`);
  };
  await assert.rejects(() => reclaimUnpublishedBaseBranch({ baseRepo: "/base", worktreePath: "/runs/new-run", sourceId: "cnt_9", execute }), /local commits/);
});

test("dry-run cannot commit, push, or create a PR", async () => {
  let calls = 0;
  await assert.rejects(() => publishDraft({ dryRun: true, targetRepo: "/target", candidate, validation: { results: [] }, reviews: [], execute: async () => { calls += 1; } }), /dry-run/);
  assert.equal(calls, 0);
});

test("rejects generated side effects outside the allocated publication files", async () => {
  await assert.rejects(() => assertAllocatedGitDiff({
    targetRepo: "/target", candidate,
    execute: async () => "?? src/content/blog/9-nine.mdx\0?? scripts/injected.mjs\0",
  }), /unallocated paths/);
});

test("publishes one commit and Draft PR without merge", async () => {
  const calls = [];
  const execute = generatedDiffExecute(calls);
  const result = await publishDraft({ dryRun: false, targetRepo: "/target", candidate, validation: { results: [] }, reviews: [], execute });
  assert.equal(result.pullRequestUrl, "https://github.com/querypie/corp-web-japan/pull/1");
  assert.ok(calls.some(([command, args]) => command === "git" && args[0] === "commit"));
  assert.ok(calls.some(([command, args]) => command === "git" && args[0] === "push"));
  const create = calls.find(([command, args]) => command === "gh" && args[1] === "create");
  assert.ok(create[1].includes("--draft"));
  assert.ok(!calls.some(([command, args]) => command === "gh" && args.includes("merge")));
});

test("resumes PR creation only when retained reports match the remote branch commit", async () => {
  const reportsDir = await mkdtemp(path.join(os.tmpdir(), "branch-resume-"));
  const sourceId = "cnt_9";
  const runId = "run-9";
  const validCandidate = { schemaVersion: "global-documentation-sync/v1", artifactType: "candidate", runId, sourceId, sourceHash: `sha256:${"a".repeat(64)}`, sourceCategory: "blogs", targetFamily: "blog", targetId: 9, sourceLocale: "ja", sourceHtmlPath: "/source", targetMdxPath: "/target", targetAssetRoot: "/assets", targetRoute: "/blog/9/nine", meta: { id: "nine", title: { en: "Nine" } }, assets: [], externalMedia: [], production: { canonicalUrl: "https://www.querypie.com/en/blog/nine" } };
  const review = (type) => ({ schemaVersion: validCandidate.schemaVersion, artifactType: type, runId, sourceId, verdict: "pass", findings: [] });
  await Promise.all([
    writeFile(path.join(reportsDir, "candidate.json"), JSON.stringify(validCandidate)),
    writeFile(path.join(reportsDir, "validation-results.json"), JSON.stringify({ schemaVersion: validCandidate.schemaVersion, artifactType: "validation-results", runId, sourceId, results: [{ command: "test", code: 0 }] })),
    ...["fidelity-review", "japanese-editorial-review", "contract-review"].map((type) => writeFile(path.join(reportsDir, `${type}.json`), JSON.stringify(review(type)))),
    writeFile(path.join(reportsDir, "branch-state.json"), JSON.stringify({ branch: branchFor(sourceId), commit: "a".repeat(40) })),
  ]);
  let remoteChecks = 0;
  const execute = async (command, args) => {
    if (command === "gh" && args[0] === "api") return "[[]]";
    if (command === "git") { remoteChecks += 1; return `${"a".repeat(40)}\trefs/heads/${branchFor(sourceId)}\n`; }
    if (command === "gh" && args[1] === "create") return "https://github.com/querypie/corp-web-japan/pull/9\n";
    return "";
  };
  let revalidated = false;
  const result = await resumeBranchOnly({ targetRepo: "/repo", sourceId, reportsDir, execute, revalidate: async () => { revalidated = true; return { schemaVersion: validCandidate.schemaVersion, artifactType: "validation-results", runId, sourceId, results: [{ command: "fresh-test", code: 0 }] }; } });
  assert.equal(revalidated, true);
  assert.equal(result.pullRequestUrl, "https://github.com/querypie/corp-web-japan/pull/9");
  assert.equal(remoteChecks, 2);
  await writeFile(path.join(reportsDir, "fidelity-review.json"), JSON.stringify({ ...review("fidelity-review"), verdict: "revise", findings: [{ severity: "major", message: "meaning drift" }] }));
  await assert.rejects(() => resumeBranchOnly({ targetRepo: "/repo", sourceId, reportsDir, execute, revalidate: async () => { throw new Error("must not run"); } }), /unresolved/);
});

test("manual retry requires the retry label and existing remote branch", async () => {
  const calls = [];
  const execute = async (command, args) => {
    calls.push([command, args]);
    if (command === "gh" && args[0] === "api") return JSON.stringify([[{ number: 7, state: "closed", merged_at: null, body: buildPullRequestBody({ candidate, validation: { results: [] }, reviews: [] }), labels: [{ name: "content-sync:retry" }], head: { ref: branchFor(candidate.sourceId) }, html_url: "url" }]]);
    if (args[0] === "ls-remote") return "hash\trefs/heads/content-sync/cnt_9\n";
    if (args[0] === "status") return "?? src/content/blog/9-nine.mdx\0";
    if (args[0] === "diff") return "src/content/blog/9-nine.mdx\0";
    return "";
  };
  const authorized = await authorizeClosedRetry({ targetRepo: "/target", sourceId: "cnt_9", githubRepo: "querypie/corp-web-japan", execute });
  assert.equal(authorized.pullRequestNumber, 7);
  assert.ok(!calls.some(([command, args]) => command === "gh" && args[1] === "reopen"));

  calls.length = 0;
  await publishRetry({ targetRepo: "/target", candidate, sourceId: "cnt_9", pullRequestNumber: 7, wasDraft: false, execute });
  assert.ok(calls.some(([command, args]) => command === "gh" && args[1] === "reopen" && args.includes("7")));
  assert.ok(calls.some(([command, args]) => command === "gh" && args[1] === "ready" && args.includes("--undo")));
  assert.ok(calls.some(([command, args]) => command === "git" && args[0] === "push"));
});
