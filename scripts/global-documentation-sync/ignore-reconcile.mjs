import { validateDecisionManifest } from "./discovery.mjs";
import { parseSyncBranch, parseSyncMarker, sourceIdentityKey } from "./sync-identity.mjs";

function normalizePullRequest(record, index) {
  if (!record || typeof record !== "object") throw new Error(`pullRequests[${index}] must be an object`);
  if (!Number.isInteger(Number(record.number))) throw new Error(`pullRequests[${index}] missing number`);
  if (typeof record.headRefName !== "string") throw new Error(`pullRequests[${index}] missing headRefName`);
  return {
    number: Number(record.number),
    state: String(record.state || "").toUpperCase(),
    isDraft: record.isDraft === true,
    body: typeof record.body === "string" ? record.body : "",
    headRefName: record.headRefName,
    isCrossRepository: record.isCrossRepository === true,
  };
}

function activeIgnoredIdentities(ignoreManifest) {
  const now = Date.now();
  const identities = new Set();
  for (const record of validateDecisionManifest(ignoreManifest, "ignore")) {
    if (!record.sourceSection) continue;
    if (record.expiresAt && Date.parse(record.expiresAt) <= now) continue;
    identities.add(sourceIdentityKey({ sourceSection: record.sourceSection, sourceId: record.sourceId }));
  }
  return identities;
}

function parseProtectedSyncPullRequest(pullRequest) {
  const parsedBranch = parseSyncBranch(pullRequest.headRefName);
  if (!parsedBranch) return null;

  let marker;
  try {
    marker = parseSyncMarker(pullRequest.body);
  } catch (error) {
    throw new Error(`PR #${pullRequest.number}: ${error.message}`);
  }
  if (!marker) throw new Error(`PR #${pullRequest.number}: missing global-documentation-sync marker`);
  if (marker.branch !== pullRequest.headRefName) throw new Error(`PR #${pullRequest.number}: sync marker branch mismatch`);

  const parsedMarkerBranch = parseSyncBranch(marker.branch);
  if (!parsedMarkerBranch) throw new Error(`PR #${pullRequest.number}: sync marker branch mismatch`);
  if (parsedBranch.sourceId !== marker.sourceId) throw new Error(`PR #${pullRequest.number}: sync marker sourceId mismatch`);
  if (!parsedBranch.legacy && parsedBranch.identity !== marker.identity) throw new Error(`PR #${pullRequest.number}: sync marker identity mismatch`);
  if (parsedBranch.sourceSection && parsedBranch.sourceSection !== marker.sourceSection) throw new Error(`PR #${pullRequest.number}: sync marker sourceSection mismatch`);

  return {
    pullRequestNumber: pullRequest.number,
    branchToDelete: pullRequest.headRefName,
    sourceSection: marker.sourceSection,
    sourceId: marker.sourceId,
    identity: marker.identity,
  };
}

export function parseGitHubPullRequestList(value) {
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) throw new Error("GitHub PR list response must be an array");
  return parsed.map(normalizePullRequest);
}

export function planIgnoredSyncPullRequestReconciliation({ ignoreManifest, pullRequests }) {
  const ignoredIdentities = activeIgnoredIdentities(ignoreManifest);
  if (!Array.isArray(pullRequests)) throw new Error("pullRequests must be an array");

  const actionsByIdentity = new Map();
  for (const record of pullRequests.map(normalizePullRequest)) {
    if (record.state !== "OPEN" || record.isDraft !== true || record.isCrossRepository) continue;

    const action = parseProtectedSyncPullRequest(record);
    if (!action || !ignoredIdentities.has(action.identity)) continue;
    if (actionsByIdentity.has(action.identity)) throw new Error(`ambiguous ignored sync identity: ${action.identity}`);
    actionsByIdentity.set(action.identity, action);
  }

  return {
    actions: [...actionsByIdentity.values()].sort((left, right) => left.pullRequestNumber - right.pullRequestNumber),
  };
}
