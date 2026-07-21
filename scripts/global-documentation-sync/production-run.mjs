#!/usr/bin/env node
import { spawn } from "node:child_process";
import { mkdir, readFile, readdir, rename, rm, stat, symlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { discoverLive } from "./live-discovery.mjs";
import { createRunWorktree, publishDraft } from "./git-pr.mjs";
import { SCHEMA_VERSION, validateArtifact } from "./lib.mjs";
import { runPreflight } from "./preflight.mjs";
import { redactSecrets } from "./redaction.mjs";
import { updateRunStatus } from "./runtime-status.mjs";

function parseArgs(argv) {
  const result = { dryRun: false };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--dry-run") result.dryRun = true;
    else result[token.slice(2).replace(/-([a-z])/g, (_, char) => char.toUpperCase())] = argv[++index];
  }
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
    child.on("close", (code) => code === 0 ? resolve(stdout) : reject(new Error(`${command} ${args.join(" ")} failed (${code}): ${stderr}`)));
  });
}

async function atomicJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(redactSecrets(value), null, 2)}\n`, { mode: 0o600 });
  await rename(temporary, file);
}

async function exists(file) { try { await stat(file); return true; } catch { return false; } }

export async function cleanupFailedWorktrees(baseRepo, root, now = Date.now()) {
  let entries = [];
  try { entries = await readdir(root, { withFileTypes: true }); } catch (error) { if (error.code === "ENOENT") return; throw error; }
  for (const entry of entries.filter((item) => item.isDirectory() && /^(?:sync|retry)-/.test(item.name))) {
    const worktree = path.join(root, entry.name);
    const age = now - (await stat(worktree)).mtimeMs;
    if (age < 7 * 24 * 60 * 60 * 1000) continue;
    try { await run("git", ["worktree", "remove", "--force", worktree], baseRepo); }
    catch { await rm(worktree, { recursive: true, force: true }); await run("git", ["worktree", "prune"], baseRepo); }
  }
}

export async function runProduction(options) {
  for (const key of ["globalRepo", "targetRepo", "reportsRoot", "worktreesRoot", "piBin", "provider", "model"]) if (!options[key]) throw new Error(`--${key} required`);
  await (options.runPreflight || runPreflight)({ globalRepo: options.globalRepo, targetRepo: options.targetRepo, worktreesRoot: options.worktreesRoot, piBin: options.piBin });
  const runId = options.runId || new Date().toISOString().replace(/[-:.]/g, "").replace("Z", "Z");
  const reportsDir = path.join(options.reportsRoot, runId);
  await mkdir(reportsDir, { recursive: true });
  await updateRunStatus({ reportsDir, runId, stage: "discovery" });
  await cleanupFailedWorktrees(options.targetRepo, options.worktreesRoot);
  const discovery = await (options.discoverLive || discoverLive)({ globalRepo: options.globalRepo, targetRepo: options.targetRepo, githubRepo: options.githubRepo });
  if (discovery.status !== "candidate") {
    await atomicJson(path.join(reportsDir, "discovery-summary.json"), { schemaVersion: SCHEMA_VERSION, runId, status: discovery.status, ...discovery });
    if (discovery.status === "no_candidate") {
      await updateRunStatus({ reportsDir, runId, stage: "complete", state: "passed", result: discovery.status });
      return discovery;
    }
    throw new Error(`discovery blocked: ${discovery.status}`);
  }

  const productionEvidenceFile = path.join(reportsDir, "production-evidence.json");
  await updateRunStatus({ reportsDir, runId, sourceId: discovery.source.sourceId, stage: "local-validation" });
  await atomicJson(productionEvidenceFile, { sourceId: discovery.source.sourceId, production: discovery.source.production });
  const worktreePath = path.join(options.worktreesRoot, `sync-${runId}`);
  await mkdir(options.worktreesRoot, { recursive: true });
  await createRunWorktree({ baseRepo: options.targetRepo, worktreePath, sourceId: discovery.source.sourceId, baseRef: options.baseRef || "origin/main" });
  const dependencyRoot = path.join(options.targetRepo, "node_modules");
  if (await exists(dependencyRoot)) await symlink(dependencyRoot, path.join(worktreePath, "node_modules"), "dir");

  const args = [
    path.join(worktreePath, "scripts/global-documentation-sync/local-dry-run.mjs"), "--dry-run",
    "--source-id", discovery.source.sourceId,
    "--global-repo", options.globalRepo, "--target-repo", worktreePath,
    "--reports-dir", reportsDir, "--pi-bin", options.piBin,
    "--provider", options.provider, "--model", options.model,
    "--run-id", runId,
    "--production-evidence-file", productionEvidenceFile,
  ];
  if (discovery.reservedTargetIds.length) args.push("--reserved-target-ids", discovery.reservedTargetIds.join(","));
  if (options.port) args.push("--port", String(options.port));
  await run(process.execPath, args, worktreePath);

  const candidate = JSON.parse(await readFile(path.join(reportsDir, "candidate.json"), "utf8"));
  const dryRunSummary = validateArtifact("run-summary", JSON.parse(await readFile(path.join(reportsDir, "run-summary.json"), "utf8")));
  const validation = validateArtifact("validation-results", JSON.parse(await readFile(path.join(reportsDir, "validation-results.json"), "utf8")));
  const reviews = await Promise.all(["fidelity-review", "japanese-editorial-review", "contract-review"].map(async (type) => validateArtifact(type, JSON.parse(await readFile(path.join(reportsDir, `${type}.json`), "utf8")))));
  if (options.dryRun) {
    await run("git", ["worktree", "remove", "--force", worktreePath], options.targetRepo);
    return dryRunSummary;
  }

  await updateRunStatus({ reportsDir, runId, sourceId: candidate.sourceId, stage: "publish" });
  const published = await publishDraft({
    dryRun: false, targetRepo: worktreePath, candidate, validation, reviews,
    githubRepo: options.githubRepo,
    onPushed: (state) => atomicJson(path.join(reportsDir, "branch-state.json"), state),
  });
  const summary = {
    ...dryRunSummary,
    status: "draft_pr_created", dryRun: false, committed: true, pushed: true,
    pullRequestUrl: published.pullRequestUrl,
    branch: published.branch, commit: published.commit,
    finishedAt: new Date().toISOString(),
  };
  validateArtifact("run-summary", summary);
  await atomicJson(path.join(reportsDir, "run-summary.json"), summary);
  await updateRunStatus({ reportsDir, runId, sourceId: candidate.sourceId, stage: "complete", state: "passed", pullRequestUrl: published.pullRequestUrl });
  await run("git", ["worktree", "remove", "--force", worktreePath], options.targetRepo);
  return summary;
}

if (process.argv[1]?.endsWith("production-run.mjs")) {
  const options = parseArgs(process.argv.slice(2));
  options.runId ||= new Date().toISOString().replace(/[-:.]/g, "");
  runProduction(options).then((result) => process.stdout.write(`${JSON.stringify(result)}\n`)).catch(async (error) => {
    const failure = { schemaVersion: SCHEMA_VERSION, runId: options.runId, status: "failed", exitCode: 1, failedAt: new Date().toISOString(), reason: redactSecrets(error.message) };
    if (options.reportsRoot) {
      const reportsDir = path.join(options.reportsRoot, options.runId);
      await atomicJson(path.join(reportsDir, "failure-summary.json"), failure).catch(() => {});
      await updateRunStatus({ reportsDir, runId: options.runId, stage: "failed", state: "failed", reason: failure.reason }).catch(() => {});
    }
    process.stderr.write(`${JSON.stringify({ event: "failed", message: failure.reason, report: options.reportsRoot ? path.join(options.reportsRoot, options.runId, "failure-summary.json") : null })}\n`);
    process.exitCode = 1;
  });
}
