import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { serializeSyncMarker, parseSyncMarker } from "./discovery.mjs";
import { loadAllPullRequests } from "./github-state.mjs";
import { hasBlockingFindings, validateArtifact } from "./lib.mjs";

export const branchFor = (sourceId) => `content-sync/${sourceId}`;

async function defaultExecute(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env: process.env, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve(stdout) : reject(new Error(`${command} ${args.join(" ")} failed (${code}): ${stderr.slice(-4000)}`)));
  });
}

export function buildPullRequestBody({ candidate, validation, reviews }) {
  const marker = {
    sourceId: candidate.sourceId,
    sourceHash: candidate.sourceHash,
    targetFamily: candidate.targetFamily,
    targetId: candidate.targetId,
    runId: candidate.runId,
    branch: branchFor(candidate.sourceId),
  };
  const reviewLines = reviews.map((review) => `- ${review.artifactType}: ${review.verdict}; ${review.findings.length} finding(s)`).join("\n") || "- none";
  const validationLines = validation.results.map(({ command, code }) => `- \`${command}\`: ${code === 0 ? "passed" : `failed (${code})`}`).join("\n") || "- none";
  return [
    "## Draft publication sync", "", "This Draft PR was generated automatically and must be reviewed and merged manually.", "",
    `- Source: ${candidate.production.canonicalUrl || candidate.meta.externalUrl}`,
    `- Source ID: \`${candidate.sourceId}\``,
    `- Source hash: \`${candidate.sourceHash}\``,
    `- Locale: \`${candidate.sourceLocale}\``,
    `- Target: \`${candidate.targetFamily}/${candidate.targetId}/${candidate.meta.id}\``, "",
    "## Reviews", "", reviewLines, "", "## Validation", "", validationLines, "",
    serializeSyncMarker(marker), "",
  ].join("\n");
}

export async function createRunWorktree({ baseRepo, worktreePath, sourceId, baseRef = "origin/main", execute = defaultExecute }) {
  const branch = branchFor(sourceId);
  await execute("git", ["fetch", "origin", "main"], baseRepo);
  await execute("git", ["worktree", "add", "--detach", worktreePath, baseRef], baseRepo);
  return { branch, worktreePath };
}

export async function publishDraft({ dryRun, targetRepo, candidate, validation, reviews, githubRepo = "querypie/corp-web-japan", execute = defaultExecute, onPushed = async () => {} }) {
  if (dryRun) throw new Error("dry-run forbids commit, push, and PR creation");
  const branch = branchFor(candidate.sourceId);
  const current = (await execute("git", ["branch", "--show-current"], targetRepo)).trim();
  if (current && current !== branch) throw new Error(`unexpected publication branch: ${current}`);
  if (!current) await execute("git", ["switch", "-c", branch], targetRepo);
  await execute("git", ["add", "--all"], targetRepo);
  await execute("git", ["commit", "-m", `content: sync Global documentation ${candidate.sourceId}`], targetRepo);
  await execute("git", ["push", "--set-upstream", "origin", branch], targetRepo);
  const commit = (await execute("git", ["rev-parse", "HEAD"], targetRepo)).trim();
  await onPushed({ branch, commit });
  const title = `Sync Global documentation: ${candidate.meta.title?.en || candidate.meta.id}`;
  const body = buildPullRequestBody({ candidate, validation, reviews });
  const pullRequestUrl = (await execute("gh", ["pr", "create", "--repo", githubRepo, "--draft", "--base", "main", "--head", branch, "--title", title, "--body", body], targetRepo)).trim();
  return { branch, commit, pullRequestUrl };
}

export async function authorizeClosedRetry({ targetRepo, sourceId, githubRepo = "querypie/corp-web-japan", execute = defaultExecute }) {
  const records = await loadAllPullRequests({ githubRepo, cwd: targetRepo, execute });
  const matches = records.filter(({ body }) => parseSyncMarker(body)?.sourceId === sourceId);
  if (matches.length !== 1) throw new Error(`retry requires exactly one historical PR for ${sourceId}`);
  const pull = matches[0];
  if (pull.state !== "CLOSED" || !pull.labels.some(({ name }) => name === "content-sync:retry")) throw new Error("retry requires a closed unmerged PR with content-sync:retry label");
  const branch = branchFor(sourceId);
  const remote = await execute("git", ["ls-remote", "--heads", "origin", `refs/heads/${branch}`], targetRepo);
  if (!remote.trim()) throw new Error(`retry branch is missing: ${branch}`);
  return { pullRequestNumber: pull.number, branch, marker: parseSyncMarker(pull.body), isDraft: pull.isDraft };
}

export async function publishRetry({ targetRepo, sourceId, pullRequestNumber, pullRequestBody, wasDraft = true, githubRepo = "querypie/corp-web-japan", execute = defaultExecute }) {
  const branch = branchFor(sourceId);
  await execute("git", ["checkout", "-B", branch, `origin/${branch}`], targetRepo);
  await execute("git", ["add", "--all"], targetRepo);
  await execute("git", ["commit", "-m", `content: retry Global documentation ${sourceId}`], targetRepo);
  await execute("git", ["push", "origin", branch], targetRepo);
  const commit = (await execute("git", ["rev-parse", "HEAD"], targetRepo)).trim();
  await execute("gh", ["pr", "reopen", String(pullRequestNumber), "--repo", githubRepo], targetRepo);
  if (!wasDraft) await execute("gh", ["pr", "ready", String(pullRequestNumber), "--repo", githubRepo, "--undo"], targetRepo);
  const editArgs = ["pr", "edit", String(pullRequestNumber), "--repo", githubRepo, "--remove-label", "content-sync:retry"];
  if (pullRequestBody) editArgs.push("--body", pullRequestBody);
  await execute("gh", editArgs, targetRepo);
  return { branch, commit, pullRequestNumber };
}

export async function resumeBranchOnly({ targetRepo, sourceId, reportsDir, githubRepo = "querypie/corp-web-japan", execute = defaultExecute, revalidate }) {
  const records = await loadAllPullRequests({ githubRepo, cwd: targetRepo, execute });
  if (records.some(({ body }) => parseSyncMarker(body)?.sourceId === sourceId)) throw new Error(`pull request already exists for ${sourceId}`);
  const candidate = validateArtifact("candidate", JSON.parse(await readFile(path.join(reportsDir, "candidate.json"), "utf8")));
  if (candidate.sourceId !== sourceId) throw new Error("branch-only candidate sourceId mismatch");
  const assertIdentity = (artifact) => {
    if (artifact.runId !== candidate.runId || artifact.sourceId !== candidate.sourceId) throw new Error(`${artifact.artifactType}: candidate identity mismatch`);
    return artifact;
  };
  let validation = assertIdentity(validateArtifact("validation-results", JSON.parse(await readFile(path.join(reportsDir, "validation-results.json"), "utf8"))));
  const reviews = await Promise.all(
    ["fidelity-review", "japanese-editorial-review", "contract-review"].map(async (type) =>
      assertIdentity(validateArtifact(type, JSON.parse(await readFile(path.join(reportsDir, `${type}.json`), "utf8")))),
    ),
  );
  if (reviews.some(hasBlockingFindings)) throw new Error("retained reviews contain blocking findings");
  const state = JSON.parse(await readFile(path.join(reportsDir, "branch-state.json"), "utf8"));
  const branch = branchFor(sourceId);
  if (state.branch !== branch || !/^[a-f0-9]{40,64}$/.test(state.commit || "")) throw new Error("invalid retained branch state");
  const remote = await execute("git", ["ls-remote", "--heads", "origin", `refs/heads/${branch}`], targetRepo);
  const remoteCommit = remote.trim().split(/\s+/)[0];
  if (remoteCommit !== state.commit) throw new Error("remote branch no longer matches validated commit");
  if (typeof revalidate !== "function") throw new Error("branch-only resume requires fresh revalidation");
  validation = assertIdentity(validateArtifact("validation-results", await revalidate({ branch, commit: state.commit, candidate, reportsDir })));
  const title = `Sync Global documentation: ${candidate.meta.title?.en || candidate.meta.id}`;
  const body = buildPullRequestBody({ candidate, validation, reviews });
  const pullRequestUrl = (await execute("gh", ["pr", "create", "--repo", githubRepo, "--draft", "--base", "main", "--head", branch, "--title", title, "--body", body], targetRepo)).trim();
  return { branch, commit: state.commit, pullRequestUrl };
}
