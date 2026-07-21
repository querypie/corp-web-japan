#!/usr/bin/env node
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

import { redactSecrets } from "./redaction.mjs";

export const DURABLE_EVIDENCE_COMMENT_LIMIT_BYTES = 60 * 1024;
export const DURABLE_EVIDENCE_MARKER_PREFIX = "durable-global-documentation-sync-evidence:v1";
export const DURABLE_EVIDENCE_MAX_REVIEW_FINDINGS = 20;
export const DURABLE_EVIDENCE_MAX_BROWSER_RESULTS = 4;
export const DURABLE_EVIDENCE_MAX_BROWSER_FINDINGS = 20;
export const DURABLE_EVIDENCE_MAX_STRING_LENGTH = 280;
const TENCENT_METADATA_BASE = "http://metadata.tencentyun.com/latest/meta-data";
const UNAVAILABLE = "unavailable";

function defaultExecute(command, args, { cwd, input } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env: process.env, stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve(stdout) : reject(new Error(`${command} ${args.join(" ")} failed (${code}): ${stderr.slice(-4000)}`)));
    child.stdin.end(input || "");
  });
}

async function readJsonIfExists(file) {
  try { return JSON.parse(await readFile(file, "utf8")); }
  catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function fileExists(file) {
  try { await stat(file); return true; } catch { return false; }
}

async function listFiles(root, relative = "") {
  const directory = path.join(root, relative);
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const nextRelative = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(root, nextRelative));
    else if (entry.isFile()) files.push(nextRelative.split(path.sep).join("/"));
  }
  return files;
}

function stableStringify(value) {
  return JSON.stringify(value);
}

function stripSensitive(value) {
  if (Array.isArray(value)) return value.map(stripSensitive);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !/(?:credential|webhook)/i.test(key))
    .map(([key, item]) => [key, stripSensitive(item)]));
}

function sanitizeJson(value) {
  return stripSensitive(redactSecrets(value));
}

function compactJson(value) {
  return stableStringify(sanitizeJson(value));
}

function truncateString(value, maxLength = DURABLE_EVIDENCE_MAX_STRING_LENGTH) {
  if (typeof value !== "string") return null;
  const normalized = redactSecrets(value).replace(/\s+/g, " ").trim();
  if (!normalized) return null;
  return normalized.length <= maxLength ? normalized : `${normalized.slice(0, maxLength - 1)}…`;
}

function sanitizeFinding(finding) {
  if (typeof finding === "string") {
    const message = truncateString(finding);
    return message ? { message } : null;
  }
  if (!finding || typeof finding !== "object") return null;
  const severity = truncateString(finding.severity);
  const location = truncateString(finding.location);
  const message = truncateString(finding.message);
  if (!message) return null;
  return {
    ...(severity ? { severity } : {}),
    ...(location ? { location } : {}),
    message,
  };
}

function sanitizeReview(review) {
  if (!review || typeof review !== "object") return null;
  return {
    artifactType: truncateString(review.artifactType) || "unknown",
    verdict: truncateString(review.verdict) || "unknown",
    findings: Array.isArray(review.findings) ? review.findings.map(sanitizeFinding).filter(Boolean).slice(0, DURABLE_EVIDENCE_MAX_REVIEW_FINDINGS) : [],
  };
}

function sanitizeBrowserResults(browserResults) {
  if (!Array.isArray(browserResults?.results)) return [];
  return browserResults.results.slice(0, DURABLE_EVIDENCE_MAX_BROWSER_RESULTS).map((result) => ({
    viewport: {
      width: Number.isFinite(result?.viewport?.width) ? Math.max(0, Math.trunc(result.viewport.width)) : null,
      height: Number.isFinite(result?.viewport?.height) ? Math.max(0, Math.trunc(result.viewport.height)) : null,
    },
    status: truncateString(result?.status) || "unknown",
    findings: Array.isArray(result?.findings) ? result.findings.map(sanitizeFinding).filter(Boolean).slice(0, DURABLE_EVIDENCE_MAX_BROWSER_FINDINGS) : [],
  }));
}

function resolveTerminalSummary(artifacts) {
  const runSummary = artifacts.runSummary;
  const failureSummary = artifacts.failureSummary;
  const discoverySummary = artifacts.discoverySummary;
  const runStatus = artifacts.runStatus;
  return {
    runId: runSummary?.runId || failureSummary?.runId || discoverySummary?.runId || runStatus?.runId || null,
    sourceId: runSummary?.sourceId || failureSummary?.sourceId || artifacts.candidate?.sourceId || discoverySummary?.sourceId || runStatus?.sourceId || null,
    status: runSummary?.status || failureSummary?.status || discoverySummary?.status || runStatus?.result || runStatus?.state || "unknown",
    pullRequestUrl: runSummary?.pullRequestUrl || runStatus?.pullRequestUrl || null,
  };
}

function durableMarker(summary) {
  return `<!-- ${DURABLE_EVIDENCE_MARKER_PREFIX} ${stableStringify({ runId: summary.runId, sourceId: summary.sourceId, status: summary.status, pullRequestUrl: summary.pullRequestUrl || null })} -->`;
}

export async function collectTencentHostMetadata({ fetchImpl = fetch, timeoutMs = 1200 } = {}) {
  const readMetadata = async (relativePath) => {
    try {
      const response = await fetchImpl(`${TENCENT_METADATA_BASE}/${relativePath}`, { signal: AbortSignal.timeout(timeoutMs) });
      if (!response.ok) return UNAVAILABLE;
      const text = (await response.text()).trim();
      return text || UNAVAILABLE;
    } catch {
      return UNAVAILABLE;
    }
  };
  return {
    provider: "Tencent CVM",
    instanceId: await readMetadata("instance-id"),
    zone: await readMetadata("placement/zone"),
    paymentMode: await readMetadata("payment-mode"),
    chargeType: await readMetadata("instance/charge-type"),
  };
}

async function buildManifest(reportsDir) {
  const manifest = [];
  for (const relativePath of await listFiles(reportsDir)) {
    const absolutePath = path.join(reportsDir, relativePath);
    const bytes = await readFile(absolutePath);
    manifest.push({
      path: relativePath,
      size: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    });
  }
  return manifest;
}

function buildSections({ summary, evidenceIssueNumber, targetCommit, hostMetadata, reviews, validationResults, browserResults, manifest, excludedEmbeddedFiles }) {
  const commands = (validationResults?.results || []).map(({ command, code }) => ({ command: truncateString(command) || "unknown", code }));
  const browser = sanitizeBrowserResults(browserResults);
  return [
    durableMarker(summary),
    "# Durable sanitized Spot-CVM sync evidence",
    "",
    `- runId: \`${summary.runId || "unknown"}\``,
    `- sourceId: \`${summary.sourceId || "unknown"}\``,
    `- status: \`${summary.status}\``,
    `- pullRequestUrl: ${summary.pullRequestUrl || "none"}`,
    `- evidenceIssue: \`${evidenceIssueNumber || "unset"}\``,
    `- deployedTargetGitCommit: \`${targetCommit || UNAVAILABLE}\``,
    "",
    "## Host metadata",
    "",
    `- provider: ${hostMetadata.provider}`,
    `- instanceId: ${hostMetadata.instanceId}`,
    `- zone: ${hostMetadata.zone}`,
    `- paymentMode: ${hostMetadata.paymentMode}`,
    `- chargeType: ${hostMetadata.chargeType}`,
    "",
    "## Final review JSON",
    "",
    `- fidelity: \`${reviews.fidelity ? "present" : "missing"}\``,
    `- japanese: \`${reviews.japanese ? "present" : "missing"}\``,
    `- contract: \`${reviews.contract ? "present" : "missing"}\``,
    "",
    "```json",
    compactJson({
      fidelity: sanitizeReview(reviews.fidelity),
      japanese: sanitizeReview(reviews.japanese),
      contract: sanitizeReview(reviews.contract),
    }),
    "```",
    "",
    "## Validation commands",
    "",
    "```json",
    compactJson(commands),
    "```",
    "",
    "## Browser QA",
    "",
    "```json",
    compactJson(browser),
    "```",
    "",
    "## Excluded embedded bodies",
    "",
    "```json",
    compactJson(excludedEmbeddedFiles),
    "```",
    "",
    "## File manifest",
    "",
    "```json",
    compactJson(manifest),
    "```",
    "",
  ].join("\n");
}

export async function buildDurableEvidenceComment({ reportsDir, evidenceIssueNumber, fetchImpl = fetch } = {}) {
  if (!reportsDir) throw new Error("reportsDir required");
  if (!await fileExists(reportsDir)) throw new Error(`report directory not found: ${reportsDir}`);
  const artifacts = {
    candidate: await readJsonIfExists(path.join(reportsDir, "candidate.json")),
    discoverySummary: await readJsonIfExists(path.join(reportsDir, "discovery-summary.json")),
    runStatus: await readJsonIfExists(path.join(reportsDir, "run-status.json")),
    productionEvidence: await readJsonIfExists(path.join(reportsDir, "production-evidence.json")),
    runSummary: await readJsonIfExists(path.join(reportsDir, "run-summary.json")),
    failureSummary: await readJsonIfExists(path.join(reportsDir, "failure-summary.json")),
    branchState: await readJsonIfExists(path.join(reportsDir, "branch-state.json")),
    validationResults: await readJsonIfExists(path.join(reportsDir, "validation-results.json")),
    browserResults: await readJsonIfExists(path.join(reportsDir, "browser-results.json")),
    fidelityReview: await readJsonIfExists(path.join(reportsDir, "fidelity-review.json")),
    japaneseEditorialReview: await readJsonIfExists(path.join(reportsDir, "japanese-editorial-review.json")),
    contractReview: await readJsonIfExists(path.join(reportsDir, "contract-review.json")),
  };
  const summary = resolveTerminalSummary(artifacts);
  const hostMetadata = await collectTencentHostMetadata({ fetchImpl });
  const manifest = await buildManifest(reportsDir);
  const targetCommit = artifacts.productionEvidence?.target?.deployedGitCommit || artifacts.branchState?.commit || artifacts.runSummary?.commit || UNAVAILABLE;
  const excludedEmbeddedFiles = manifest.map(({ path: filePath }) => filePath).filter((filePath) => /(^|\/)(?:raw-|generated-body|candidate-body|.*credential.*|.*webhook.*)/i.test(filePath));
  const comment = buildSections({
    summary,
    evidenceIssueNumber,
    targetCommit,
    hostMetadata,
    reviews: {
      fidelity: artifacts.fidelityReview,
      japanese: artifacts.japaneseEditorialReview,
      contract: artifacts.contractReview,
    },
    validationResults: artifacts.validationResults,
    browserResults: artifacts.browserResults,
    manifest,
    excludedEmbeddedFiles,
  });
  const bytes = Buffer.byteLength(comment, "utf8");
  if (bytes > DURABLE_EVIDENCE_COMMENT_LIMIT_BYTES) throw new Error(`durable evidence comment exceeds ${DURABLE_EVIDENCE_COMMENT_LIMIT_BYTES} bytes: ${bytes}`);
  return { comment, summary, marker: durableMarker(summary), bytes };
}

async function loadCommentBodies(kind, target, githubRepo, cwd, execute) {
  const args = kind === "issue"
    ? ["issue", "view", String(target), "--repo", githubRepo, "--json", "comments"]
    : ["pr", "view", String(target), "--repo", githubRepo, "--json", "comments"];
  const output = await execute("gh", args, { cwd });
  const parsed = JSON.parse(output || "{}");
  return Array.isArray(parsed.comments) ? parsed.comments.map(({ body }) => body || "") : [];
}

async function postComment(kind, target, githubRepo, body, cwd, execute) {
  const args = kind === "issue"
    ? ["issue", "comment", String(target), "--repo", githubRepo, "--body-file", "-"]
    : ["pr", "comment", String(target), "--repo", githubRepo, "--body-file", "-"];
  return execute("gh", args, { cwd, input: body });
}

export async function publishDurableEvidence({ reportsDir, githubRepo, evidenceIssueNumber, pullRequestUrl, cwd = reportsDir, execute = defaultExecute, fetchImpl = fetch } = {}) {
  if (!githubRepo) throw new Error("githubRepo required");
  if (!evidenceIssueNumber) throw new Error("evidenceIssueNumber required");
  const { comment, marker, summary, bytes } = await buildDurableEvidenceComment({ reportsDir, evidenceIssueNumber, fetchImpl });
  const result = { summary, bytes, issueCommented: false, issueSkipped: false, prCommented: false, prSkipped: false };
  const issueBodies = await loadCommentBodies("issue", evidenceIssueNumber, githubRepo, cwd, execute);
  if (issueBodies.some((body) => body.includes(marker))) result.issueSkipped = true;
  else {
    await postComment("issue", evidenceIssueNumber, githubRepo, comment, cwd, execute);
    result.issueCommented = true;
  }
  const prTarget = pullRequestUrl || summary.pullRequestUrl;
  if (prTarget) {
    const prBodies = await loadCommentBodies("pr", prTarget, githubRepo, cwd, execute);
    if (prBodies.some((body) => body.includes(marker))) result.prSkipped = true;
    else {
      await postComment("pr", prTarget, githubRepo, comment, cwd, execute);
      result.prCommented = true;
    }
  }
  return result;
}
