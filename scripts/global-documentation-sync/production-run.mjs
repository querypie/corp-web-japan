#!/usr/bin/env node
import { spawn } from "node:child_process";
import { mkdir, readFile, readdir, rename, rm, stat, symlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { publishDurableEvidence } from "./durable-evidence.mjs";
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

const VALID_EVIDENCE_ISSUE_NUMBER = /^[1-9]\d*$/;

export class DurableEvidencePublishError extends Error {
  constructor(message) {
    super(message);
    this.name = "DurableEvidencePublishError";
  }
}

export function durableEvidenceConfig(options = {}) {
  const env = options.env || process.env;
  const required = options.durableEvidenceRequired === true || env.DURABLE_EVIDENCE_REQUIRED === "1";
  const evidenceIssueNumber = String(options.evidenceIssueNumber ?? env.EVIDENCE_ISSUE_NUMBER ?? "").trim();
  const githubRepo = String(options.githubRepo ?? "").trim();
  if (!required) return { evidenceIssueNumber: evidenceIssueNumber || null, githubRepo: githubRepo || null, required: false };
  if (!VALID_EVIDENCE_ISSUE_NUMBER.test(evidenceIssueNumber)) {
    throw new Error("valid EVIDENCE_ISSUE_NUMBER required when DURABLE_EVIDENCE_REQUIRED=1");
  }
  if (!githubRepo) throw new Error("githubRepo required when DURABLE_EVIDENCE_REQUIRED=1");
  return { evidenceIssueNumber, githubRepo, required: true };
}

async function resolveTargetRepoHead(targetRepo, runCommand = run) {
  if (!targetRepo) return null;
  try {
    const commit = redactSecrets((await runCommand("git", ["rev-parse", "HEAD"], targetRepo)).trim());
    return /^[0-9a-f]{7,40}$/i.test(commit) ? commit : null;
  } catch {
    return null;
  }
}

async function maybePublishDurableEvidence({ options, reportsDir, runId, sourceId, pullRequestUrl, status, targetCommitOverride = null }) {
  const config = durableEvidenceConfig(options);
  if (!config.required) return null;
  await updateRunStatus({ reportsDir, runId, sourceId, stage: "durable-evidence", state: "running", result: status, pullRequestUrl: pullRequestUrl || null });
  try {
    const published = await (options.publishDurableEvidence || publishDurableEvidence)({
      reportsDir,
      githubRepo: config.githubRepo,
      evidenceIssueNumber: config.evidenceIssueNumber,
      sourceId: sourceId || null,
      pullRequestUrl,
      status,
      targetCommitOverride,
    });
    await atomicJson(path.join(reportsDir, "durable-evidence-summary.json"), { runId, sourceId: sourceId || null, status, pullRequestUrl: pullRequestUrl || null, ...published });
    return published;
  } catch (error) {
    throw new DurableEvidencePublishError(redactSecrets(error.message));
  }
}

async function recordFailureArtifacts({ options, reportsDir, failure }) {
  await atomicJson(path.join(reportsDir, "failure-summary.json"), failure).catch(() => {});
  await updateRunStatus({ reportsDir, runId: failure.runId, stage: "failed", state: "failed", reason: failure.reason }).catch(() => {});
}

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
  durableEvidenceConfig(options);
  const runCommand = options.runCommand || run;
  const createWorktree = options.createRunWorktree || createRunWorktree;
  const publishDraftImpl = options.publishDraft || publishDraft;
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
      await maybePublishDurableEvidence({
        options,
        reportsDir,
        runId,
        sourceId: null,
        pullRequestUrl: null,
        status: discovery.status,
        targetCommitOverride: await resolveTargetRepoHead(options.targetRepo, runCommand),
      });
      await updateRunStatus({ reportsDir, runId, stage: "complete", state: "passed", result: discovery.status });
      return discovery;
    }
    throw new Error(`discovery blocked: ${discovery.status}`);
  }

  const productionEvidenceFile = path.join(reportsDir, "production-evidence.json");
  await updateRunStatus({ reportsDir, runId, sourceId: discovery.source.sourceId, stage: "local-validation" });
  const baseRef = options.baseRef || "origin/main";
  await atomicJson(productionEvidenceFile, {
    sourceId: discovery.source.sourceId,
    sourceSection: discovery.source.sourceSection,
    production: discovery.source.production,
    target: { baseRef, deployedGitCommit: redactSecrets((await runCommand("git", ["rev-parse", baseRef], options.targetRepo)).trim()) },
  });
  const worktreePath = path.join(options.worktreesRoot, `sync-${runId}`);
  await mkdir(options.worktreesRoot, { recursive: true });
  await createWorktree({ baseRepo: options.targetRepo, worktreePath, sourceId: discovery.source.sourceId, sourceSection: discovery.source.sourceSection, baseRef });
  const dependencyRoot = path.join(options.targetRepo, "node_modules");
  if (await exists(dependencyRoot)) await symlink(dependencyRoot, path.join(worktreePath, "node_modules"), "dir");

  const args = [
    path.join(worktreePath, "scripts/global-documentation-sync/local-dry-run.mjs"), "--dry-run",
    "--source-id", discovery.source.sourceId,
    "--source-section", discovery.source.sourceSection,
    "--global-repo", options.globalRepo, "--target-repo", worktreePath,
    "--reports-dir", reportsDir, "--pi-bin", options.piBin,
    "--provider", options.provider, "--model", options.model,
    "--run-id", runId,
    "--production-evidence-file", productionEvidenceFile,
  ];
  if (discovery.reservedTargetIds.length) args.push("--reserved-target-ids", discovery.reservedTargetIds.join(","));
  if (options.port) args.push("--port", String(options.port));
  await runCommand(process.execPath, args, worktreePath);

  const candidate = JSON.parse(await readFile(path.join(reportsDir, "candidate.json"), "utf8"));
  const dryRunSummary = validateArtifact("run-summary", JSON.parse(await readFile(path.join(reportsDir, "run-summary.json"), "utf8")));
  const validation = validateArtifact("validation-results", JSON.parse(await readFile(path.join(reportsDir, "validation-results.json"), "utf8")));
  const reviews = await Promise.all(["fidelity-review", "japanese-editorial-review", "contract-review"].map(async (type) => validateArtifact(type, JSON.parse(await readFile(path.join(reportsDir, `${type}.json`), "utf8")))));
  if (options.dryRun) {
    await maybePublishDurableEvidence({
      options,
      reportsDir,
      runId,
      sourceId: candidate.sourceId,
      pullRequestUrl: null,
      status: dryRunSummary.status,
      targetCommitOverride: await resolveTargetRepoHead(options.targetRepo, runCommand),
    });
    await updateRunStatus({ reportsDir, runId, sourceId: candidate.sourceId, stage: "complete", state: "passed", result: dryRunSummary.status });
    await runCommand("git", ["worktree", "remove", "--force", worktreePath], options.targetRepo);
    return dryRunSummary;
  }

  await updateRunStatus({ reportsDir, runId, sourceId: candidate.sourceId, stage: "publish" });
  const published = await publishDraftImpl({
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
  await maybePublishDurableEvidence({ options, reportsDir, runId, sourceId: candidate.sourceId, pullRequestUrl: published.pullRequestUrl, status: summary.status });
  await updateRunStatus({ reportsDir, runId, sourceId: candidate.sourceId, stage: "complete", state: "passed", pullRequestUrl: published.pullRequestUrl });
  await runCommand("git", ["worktree", "remove", "--force", worktreePath], options.targetRepo);
  return summary;
}

export async function runProductionCli(options, runProductionImpl = runProduction) {
  const configured = { ...options };
  configured.runId ||= new Date().toISOString().replace(/[-:.]/g, "");
  durableEvidenceConfig(configured);
  try {
    return await runProductionImpl(configured);
  } catch (error) {
    const failure = { schemaVersion: SCHEMA_VERSION, runId: configured.runId, status: "failed", exitCode: 1, failedAt: new Date().toISOString(), reason: redactSecrets(error.message) };
    if (configured.reportsRoot) {
      const reportsDir = path.join(configured.reportsRoot, configured.runId);
      await recordFailureArtifacts({ options: configured, reportsDir, failure });
      if (error instanceof DurableEvidencePublishError) {
        await updateRunStatus({ reportsDir, runId: configured.runId, stage: "durable-evidence", state: "failed", reason: failure.reason }).catch(() => {});
        throw new Error(failure.reason);
      }
      try {
        await maybePublishDurableEvidence({
          options: configured,
          reportsDir,
          runId: configured.runId,
          sourceId: null,
          pullRequestUrl: null,
          status: failure.status,
          targetCommitOverride: await resolveTargetRepoHead(configured.targetRepo, configured.runCommand || configured.runCommandImpl || run),
        });
        await updateRunStatus({ reportsDir, runId: configured.runId, stage: "failed", state: "failed", result: failure.status, reason: failure.reason }).catch(() => {});
      } catch (publishError) {
        const combinedReason = redactSecrets(`${failure.reason}; durable evidence publish failed: ${publishError.message}`);
        await updateRunStatus({ reportsDir, runId: configured.runId, stage: "durable-evidence", state: "failed", reason: combinedReason }).catch(() => {});
        throw new Error(combinedReason);
      }
    }
    throw new Error(failure.reason);
  }
}

if (process.argv[1]?.endsWith("production-run.mjs")) {
  const options = parseArgs(process.argv.slice(2));
  runProductionCli(options).then((result) => process.stdout.write(`${JSON.stringify(result)}\n`)).catch((error) => {
    process.stderr.write(`${JSON.stringify({ event: "failed", message: redactSecrets(error.message), report: options.reportsRoot ? path.join(options.reportsRoot, options.runId || "", "failure-summary.json") : null })}\n`);
    process.exitCode = 1;
  });
}
