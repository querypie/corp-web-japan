import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { loadAllPullRequests } from "./github-state.mjs";
import { hasBlockingFindings, validateArtifact } from "./lib.mjs";
import { branchFor, legacyBranchFor, parseSyncBranch, parseSyncMarker, serializeSyncMarker, sourceIdentityKey } from "./sync-identity.mjs";

export { branchFor } from "./sync-identity.mjs";
export const publicationLabel = "Global publication";

function repoRelative(targetRepo, file) {
  const relative = path.relative(path.resolve(targetRepo), path.resolve(file));
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`allocated path escapes target repo: ${file}`);
  return relative.split(path.sep).join("/");
}

function markerIdentity(marker) {
  return sourceIdentityKey({ sourceSection: marker.sourceSection, sourceId: marker.sourceId });
}

function matchesIdentity(marker, { sourceId, sourceSection }) {
  return marker?.sourceId === sourceId && marker?.sourceSection === sourceSection;
}

function assertRetryBranchMatchesIdentity(branch, identity) {
  const parsed = parseSyncBranch(branch);
  if (!parsed || parsed.sourceId !== identity.sourceId) throw new Error(`invalid retry branch: ${branch}`);
  if (parsed.legacy) {
    if (branch !== legacyBranchFor(identity.sourceId)) throw new Error(`invalid retry branch: ${branch}`);
    return { ...parsed, identity: sourceIdentityKey(identity) };
  }
  if (parsed.identity !== sourceIdentityKey(identity)) throw new Error(`retry branch identity mismatch: ${branch}`);
  return parsed;
}

export function assertRetryAuthorizationCandidate({ candidate, authorization }) {
  const expectedIdentity = { sourceId: authorization.marker.sourceId, sourceSection: authorization.marker.sourceSection };
  if (!matchesIdentity(candidate, expectedIdentity)
    || candidate.targetFamily !== authorization.marker.targetFamily
    || Number(candidate.targetId) !== Number(authorization.marker.targetId)) {
    throw new Error("retry candidate identity no longer matches the closed PR marker");
  }
  assertRetryBranchMatchesIdentity(authorization.branch, expectedIdentity);
}

export async function assertAllocatedGitDiff({ targetRepo, candidate, allowStaleMdx = false, execute = defaultExecute }) {
  const raw = await execute("git", ["status", "--porcelain=v1", "-z", "--untracked-files=all"], targetRepo);
  const entries = raw.split("\0").filter(Boolean);
  const changed = [];
  for (const entry of entries) {
    const status = entry.slice(0, 2);
    if (/[RC]/.test(status)) throw new Error(`renames/copies are not allowed in generated publication diff: ${entry}`);
    changed.push(entry.slice(3));
  }
  if (!changed.length) throw new Error("generated publication diff is empty");
  const allowed = new Set([
    candidate.targetMdxPath, candidate.heroImagePath, ...(candidate.assets || []).map(({ targetPath }) => targetPath),
  ].filter(Boolean).map((file) => repoRelative(targetRepo, file)));
  const stalePattern = new RegExp(`^src/content/${candidate.targetFamily}/${candidate.targetId}-.+\\.mdx$`);
  const unexpected = changed.filter((file) => !allowed.has(file) && !(allowStaleMdx && stalePattern.test(file)));
  if (unexpected.length) throw new Error(`generated publication diff contains unallocated paths: ${JSON.stringify(unexpected)}`);
  const targetMdx = repoRelative(targetRepo, candidate.targetMdxPath);
  if (!changed.includes(targetMdx)) throw new Error("generated publication diff does not include allocated MDX");
  return changed;
}

async function stageAllocatedDiff({ targetRepo, candidate, allowStaleMdx, execute }) {
  const changed = await assertAllocatedGitDiff({ targetRepo, candidate, allowStaleMdx, execute });
  await execute("git", ["add", "--all", "--", ...changed], targetRepo);
  const staged = (await execute("git", ["diff", "--cached", "--name-only", "-z"], targetRepo)).split("\0").filter(Boolean).sort();
  if (JSON.stringify(staged) !== JSON.stringify([...changed].sort())) throw new Error("staged diff does not exactly match validated allocated paths");
  return changed;
}

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
    sourceSection: candidate.sourceSection,
    sourceId: candidate.sourceId,
    sourceHash: candidate.sourceHash,
    targetFamily: candidate.targetFamily,
    targetId: candidate.targetId,
    runId: candidate.runId,
    branch: branchFor(candidate),
  };
  const reviewLines = reviews.map((review) => `- ${review.artifactType}: ${review.verdict}; ${review.findings.length} finding(s)`).join("\n") || "- none";
  const validationLines = validation.results.map(({ command, code }) => `- \`${command}\`: ${code === 0 ? "passed" : `failed (${code})`}`).join("\n") || "- none";
  return [
    "## Draft publication sync", "", "This Draft PR was generated automatically and must be reviewed and merged manually.", "",
    `- Source: ${candidate.production.canonicalUrl || candidate.meta.externalUrl}`,
    `- Source identity: \`${candidate.sourceSection}/${candidate.sourceId}\``,
    `- Source ID: \`${candidate.sourceId}\``,
    `- Source hash: \`${candidate.sourceHash}\``,
    `- Locale: \`${candidate.sourceLocale}\``,
    `- Target: \`${candidate.targetFamily}/${candidate.targetId}/${candidate.meta.id}\``, "",
    "## Reviews", "", reviewLines, "", "## Validation", "", validationLines, "",
    serializeSyncMarker(marker), "",
  ].join("\n");
}

function parseWorktreeList(raw) {
  return raw.trim().split("\n\n").filter(Boolean).map((entry) => Object.fromEntries(entry.split("\n").map((line) => {
    const [key, ...value] = line.split(" ");
    return [key, value.join(" ")];
  })));
}

export async function reclaimUnpublishedBaseBranch({ baseRepo, worktreePath, sourceId, sourceSection, baseRef = "origin/main", execute = defaultExecute }) {
  const branch = branchFor(sourceSection, sourceId);
  const localCommit = (await execute("git", ["for-each-ref", "--format=%(objectname)", `refs/heads/${branch}`], baseRepo)).trim();
  if (!localCommit) return false;
  const remote = await execute("git", ["ls-remote", "--heads", "origin", `refs/heads/${branch}`], baseRepo);
  if (remote.trim()) throw new Error(`unpublished sync branch has a remote ref: ${branch}`);
  const baseCommit = (await execute("git", ["rev-parse", baseRef], baseRepo)).trim();
  const mergeBase = (await execute("git", ["merge-base", localCommit, baseCommit], baseRepo)).trim();
  if (localCommit !== mergeBase) throw new Error(`unpublished sync branch has local commits: ${branch}`);

  const root = path.dirname(path.resolve(worktreePath));
  const worktrees = parseWorktreeList(await execute("git", ["worktree", "list", "--porcelain"], baseRepo));
  for (const worktree of worktrees.filter(({ branch: ref }) => ref === `refs/heads/${branch}`)) {
    const relative = path.relative(root, path.resolve(worktree.worktree));
    if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`unpublished sync branch is checked out outside the automation worktree root: ${branch}`);
    await execute("git", ["worktree", "remove", "--force", worktree.worktree], baseRepo);
  }
  await execute("git", ["branch", "-D", branch], baseRepo);
  return true;
}

export async function createRunWorktree({ baseRepo, worktreePath, sourceId, sourceSection, baseRef = "origin/main", execute = defaultExecute }) {
  const branch = branchFor(sourceSection, sourceId);
  await execute("git", ["fetch", "origin", "main"], baseRepo);
  await reclaimUnpublishedBaseBranch({ baseRepo, worktreePath, sourceId, sourceSection, baseRef, execute });
  await execute("git", ["worktree", "add", "--detach", worktreePath, baseRef], baseRepo);
  return { branch, worktreePath };
}

export async function publishDraft({ dryRun, targetRepo, candidate, validation, reviews, githubRepo = "querypie/corp-web-japan", execute = defaultExecute, onPushed = async () => {} }) {
  if (dryRun) throw new Error("dry-run forbids commit, push, and PR creation");
  const branch = branchFor(candidate);
  const current = (await execute("git", ["branch", "--show-current"], targetRepo)).trim();
  if (current && current !== branch) throw new Error(`unexpected publication branch: ${current}`);
  if (!current) await execute("git", ["switch", "-c", branch], targetRepo);
  await stageAllocatedDiff({ targetRepo, candidate, allowStaleMdx: false, execute });
  await execute("git", ["commit", "-m", `content: sync ${publicationLabel} ${candidate.sourceSection}/${candidate.sourceId}`], targetRepo);
  await execute("git", ["push", "--set-upstream", "origin", branch], targetRepo);
  const commit = (await execute("git", ["rev-parse", "HEAD"], targetRepo)).trim();
  await onPushed({ branch, commit });
  const title = `Sync ${publicationLabel}: ${candidate.meta.title?.en || candidate.meta.id}`;
  const body = buildPullRequestBody({ candidate, validation, reviews });
  const pullRequestUrl = (await execute("gh", ["pr", "create", "--repo", githubRepo, "--draft", "--base", "main", "--head", branch, "--title", title, "--body", body], targetRepo)).trim();
  return { branch, commit, pullRequestUrl };
}

export async function authorizeClosedRetry({ targetRepo, sourceId, sourceSection, githubRepo = "querypie/corp-web-japan", execute = defaultExecute }) {
  const records = await loadAllPullRequests({ githubRepo, cwd: targetRepo, execute });
  const markers = records.map((pull) => ({ pull, marker: parseSyncMarker(pull.body) })).filter(({ marker }) => marker?.sourceId === sourceId);
  const matchingSection = sourceSection
    ? markers.filter(({ marker }) => marker.sourceSection === sourceSection)
    : markers;
  if (!sourceSection) {
    const sections = new Set(markers.map(({ marker }) => marker.sourceSection));
    if (sections.size > 1) throw new Error(`sourceSection required for duplicate sourceId: ${sourceId}`);
  }
  if (matchingSection.length !== 1) throw new Error(`retry requires exactly one historical PR for ${sourceSection ? `${sourceSection}/${sourceId}` : sourceId}`);
  const pull = matchingSection[0].pull;
  if (pull.state !== "CLOSED" || !pull.labels.some(({ name }) => name === "content-sync:retry")) throw new Error("retry requires a closed unmerged PR with content-sync:retry label");
  const marker = matchingSection[0].marker;
  if (pull.headRefName !== marker.branch) throw new Error("retry branch does not match the closed PR marker");
  assertRetryBranchMatchesIdentity(pull.headRefName, { sourceId: marker.sourceId, sourceSection: marker.sourceSection });
  const remote = await execute("git", ["ls-remote", "--heads", "origin", `refs/heads/${pull.headRefName}`], targetRepo);
  if (!remote.trim()) throw new Error(`retry branch is missing: ${pull.headRefName}`);
  return { pullRequestNumber: pull.number, branch: pull.headRefName, marker, isDraft: pull.isDraft };
}

export async function publishRetry({ targetRepo, candidate, branch, pullRequestNumber, pullRequestBody, wasDraft = true, githubRepo = "querypie/corp-web-japan", execute = defaultExecute }) {
  assertRetryBranchMatchesIdentity(branch, { sourceId: candidate.sourceId, sourceSection: candidate.sourceSection });
  await execute("git", ["checkout", "-B", branch, `origin/${branch}`], targetRepo);
  await stageAllocatedDiff({ targetRepo, candidate, allowStaleMdx: true, execute });
  await execute("git", ["commit", "-m", `content: retry ${publicationLabel} ${candidate.sourceSection}/${candidate.sourceId}`], targetRepo);
  await execute("git", ["push", "origin", branch], targetRepo);
  const commit = (await execute("git", ["rev-parse", "HEAD"], targetRepo)).trim();
  await execute("gh", ["pr", "reopen", String(pullRequestNumber), "--repo", githubRepo], targetRepo);
  if (!wasDraft) await execute("gh", ["pr", "ready", String(pullRequestNumber), "--repo", githubRepo, "--undo"], targetRepo);
  const editArgs = ["pr", "edit", String(pullRequestNumber), "--repo", githubRepo, "--remove-label", "content-sync:retry"];
  if (pullRequestBody) editArgs.push("--body", pullRequestBody);
  await execute("gh", editArgs, targetRepo);
  return { branch, commit, pullRequestNumber };
}

export async function resumeBranchOnly({ targetRepo, sourceId, sourceSection, reportsDir, githubRepo = "querypie/corp-web-japan", execute = defaultExecute, revalidate }) {
  const candidate = validateArtifact("candidate", JSON.parse(await readFile(path.join(reportsDir, "candidate.json"), "utf8")));
  if (candidate.sourceId !== sourceId) throw new Error("branch-only candidate sourceId mismatch");
  if (sourceSection && candidate.sourceSection !== sourceSection) throw new Error("branch-only candidate sourceSection mismatch");
  const candidateIdentity = { sourceId: candidate.sourceId, sourceSection: candidate.sourceSection };
  const records = await loadAllPullRequests({ githubRepo, cwd: targetRepo, execute });
  if (records.some(({ body }) => matchesIdentity(parseSyncMarker(body), candidateIdentity))) throw new Error(`pull request already exists for ${candidate.sourceSection}/${sourceId}`);
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
  if (reviews.some((review) => review.verdict !== "pass" || review.findings.some(({ severity }) => severity !== "note") || hasBlockingFindings(review))) throw new Error("retained reviews contain unresolved actionable findings");
  const state = JSON.parse(await readFile(path.join(reportsDir, "branch-state.json"), "utf8"));
  const branch = branchFor(candidate);
  if (state.branch !== branch || !/^[a-f0-9]{40,64}$/.test(state.commit || "")) throw new Error("invalid retained branch state");
  const parsedBranch = parseSyncBranch(branch);
  if (!parsedBranch || parsedBranch.identity !== markerIdentity({ sourceId: candidate.sourceId, sourceSection: candidate.sourceSection })) throw new Error("invalid retained branch identity");
  const remote = await execute("git", ["ls-remote", "--heads", "origin", `refs/heads/${branch}`], targetRepo);
  const remoteCommit = remote.trim().split(/\s+/)[0];
  if (remoteCommit !== state.commit) throw new Error("remote branch no longer matches validated commit");
  if (typeof revalidate !== "function") throw new Error("branch-only resume requires fresh revalidation");
  validation = assertIdentity(validateArtifact("validation-results", await revalidate({ branch, commit: state.commit, candidate, reportsDir })));
  const remoteAfterValidation = await execute("git", ["ls-remote", "--heads", "origin", `refs/heads/${branch}`], targetRepo);
  if (remoteAfterValidation.trim().split(/\s+/)[0] !== state.commit) throw new Error("remote branch changed during fresh revalidation");
  const title = `Sync ${publicationLabel}: ${candidate.meta.title?.en || candidate.meta.id}`;
  const body = buildPullRequestBody({ candidate, validation, reviews });
  const pullRequestUrl = (await execute("gh", ["pr", "create", "--repo", githubRepo, "--draft", "--base", "main", "--head", branch, "--title", title, "--body", body], targetRepo)).trim();
  return { branch, commit: state.commit, pullRequestUrl };
}
