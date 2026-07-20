#!/usr/bin/env node
import { spawn } from "node:child_process";
import { mkdir, readFile, stat, symlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { authorizeClosedRetry, branchFor, buildPullRequestBody, createRunWorktree, publishRetry } from "./git-pr.mjs";
import { validateArtifact } from "./lib.mjs";
import { runPreflight } from "./preflight.mjs";
import { redactSecrets } from "./redaction.mjs";

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 2) result[argv[index].slice(2).replace(/-([a-z])/g, (_, character) => character.toUpperCase())] = argv[index + 1];
  return result;
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env: process.env, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout = `${stdout}${chunk}`.slice(-100_000); });
    child.stderr.on("data", (chunk) => { stderr = `${stderr}${chunk}`.slice(-100_000); });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve(stdout) : reject(new Error(redactSecrets(`${command} failed (${code}): ${stderr}`))));
  });
}

async function exists(file) { try { await stat(file); return true; } catch { return false; } }

export async function runRetry(options) {
  for (const key of ["sourceId", "globalRepo", "targetRepo", "reportsRoot", "worktreesRoot", "piBin", "provider", "model"]) if (!options[key]) throw new Error(`--${key} required`);
  await runPreflight({ globalRepo: options.globalRepo, targetRepo: options.targetRepo, worktreesRoot: options.worktreesRoot, piBin: options.piBin });
  const authorization = await authorizeClosedRetry({ targetRepo: options.targetRepo, sourceId: options.sourceId, githubRepo: options.githubRepo });
  const runId = options.runId || `retry-${new Date().toISOString().replace(/[-:.]/g, "")}`;
  const reportsDir = path.join(options.reportsRoot, runId);
  const worktreePath = path.join(options.worktreesRoot, `retry-${runId}`);
  await mkdir(reportsDir, { recursive: true });
  await run("git", ["fetch", "origin", branchFor(options.sourceId)], options.targetRepo);
  await createRunWorktree({ baseRepo: options.targetRepo, worktreePath, sourceId: options.sourceId, baseRef: `origin/${branchFor(options.sourceId)}` });
  if (await exists(path.join(options.targetRepo, "node_modules"))) await symlink(path.join(options.targetRepo, "node_modules"), path.join(worktreePath, "node_modules"), "dir");
  await run(process.execPath, [
    path.join(worktreePath, "scripts/global-documentation-sync/local-dry-run.mjs"), "--dry-run",
    "--source-id", options.sourceId, "--target-id", String(authorization.marker.targetId), "--reset-target", "true",
    "--global-repo", options.globalRepo, "--target-repo", worktreePath, "--reports-dir", reportsDir,
    "--pi-bin", options.piBin, "--provider", options.provider, "--model", options.model, "--run-id", runId,
  ], worktreePath);
  const candidate = JSON.parse(await readFile(path.join(reportsDir, "candidate.json"), "utf8"));
  if (candidate.sourceId !== options.sourceId || candidate.targetFamily !== authorization.marker.targetFamily || Number(candidate.targetId) !== Number(authorization.marker.targetId)) throw new Error("retry candidate identity no longer matches the closed PR marker");
  const validation = JSON.parse(await readFile(path.join(reportsDir, "validation-results.json"), "utf8"));
  const reviews = await Promise.all(["fidelity-review", "japanese-editorial-review", "contract-review"].map((type) => readFile(path.join(reportsDir, `${type}.json`), "utf8").then(JSON.parse)));
  const published = await publishRetry({ targetRepo: worktreePath, candidate, sourceId: options.sourceId, pullRequestNumber: authorization.pullRequestNumber, wasDraft: authorization.isDraft, pullRequestBody: buildPullRequestBody({ candidate, validation, reviews }), githubRepo: options.githubRepo });
  const summaryPath = path.join(reportsDir, "run-summary.json");
  const summary = JSON.parse(await readFile(summaryPath, "utf8"));
  Object.assign(summary, { status: "retry_pr_reopened", dryRun: false, committed: true, pushed: true, pullRequestUrl: `https://github.com/${options.githubRepo || "querypie/corp-web-japan"}/pull/${authorization.pullRequestNumber}`, branch: published.branch, commit: published.commit });
  validateArtifact("run-summary", summary);
  await writeFile(summaryPath, `${JSON.stringify(redactSecrets(summary), null, 2)}\n`, { mode: 0o600 });
  await run("git", ["worktree", "remove", "--force", worktreePath], options.targetRepo);
  return summary;
}

if (process.argv[1]?.endsWith("retry-run.mjs")) runRetry(parseArgs(process.argv.slice(2))).then((result) => process.stdout.write(`${JSON.stringify(result)}\n`)).catch((error) => { process.stderr.write(`${JSON.stringify({ event: "failed", message: redactSecrets(error.message) })}\n`); process.exitCode = 1; });
