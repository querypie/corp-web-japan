const sourceIdentityPattern = /^(documentation|news):cnt_\d+$/;
const candidatePathPattern = /^src\/content\/[a-z0-9]+(?:-[a-z0-9]+)*\/[1-9]\d*-[a-z0-9]+(?:-[a-z0-9]+)*\.mdx$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const candidateSignals = new Set(["exact-slug", "exact-source-url", "exact-original-title-and-date"]);

function deny(sourceIdentity, reasonCode, message, details = {}) {
  return { allowed: false, sourceIdentity, reasonCode, message, details };
}

function isActive(record, now) {
  return !record?.expiresAt || Date.parse(record.expiresAt) > Date.parse(now);
}

function validateCandidates(value) {
  if (!Array.isArray(value)) return false;
  return value.every((candidate) => (
    candidate && typeof candidate === "object"
    && candidatePathPattern.test(candidate.targetPath)
    && Number.isInteger(candidate.targetId) && candidate.targetId > 0
    && slugPattern.test(candidate.targetSlug)
    && Array.isArray(candidate.signals) && candidate.signals.length > 0
    && candidate.signals.every((signal) => candidateSignals.has(signal))
    && new Set(candidate.signals).size === candidate.signals.length
  ));
}

export function assessIgnoreEligibility({ sourceIdentity, report, baseIgnoreRecords, now }) {
  if (!sourceIdentityPattern.test(sourceIdentity)) {
    return deny(sourceIdentity, "invalid-source-identity", "Invalid source identity; expected documentation:cnt_N or news:cnt_N.");
  }
  if (!report || !Array.isArray(report.items) || !Array.isArray(report.mappingDrift) || !Array.isArray(baseIgnoreRecords)) {
    return deny(sourceIdentity, "malformed-evidence", "Ignore eligibility evidence is malformed.");
  }

  const drift = report.mappingDrift.filter((entry) => entry?.identity === sourceIdentity);
  if (drift.length > 0) {
    const expectedPath = drift.length === 1 && typeof drift[0].expectedPath === "string"
      ? drift[0].expectedPath
      : null;
    return deny(sourceIdentity, "mapping-drift", "A baseline mapping exists but its Japan target is missing.", { expectedPath });
  }

  const matchingItems = report.items.filter((entry) => entry?.identity === sourceIdentity);
  if (matchingItems.length !== 1) {
    return deny(sourceIdentity, "live-item-count", `Expected exactly one live report item; found ${matchingItems.length}.`, { count: matchingItems.length });
  }
  const item = matchingItems[0];
  if (!validateCandidates(item.possibleJapanMatches)) {
    return deny(sourceIdentity, "malformed-candidate-evidence", "Possible Japan match evidence is malformed.");
  }
  if (item.possibleJapanMatches.length > 0) {
    return deny(sourceIdentity, "possible-japan-match", "Possible existing Japan content must be reconciled before Ignore.", {
      candidates: item.possibleJapanMatches,
    });
  }
  if (item.status !== "Untracked") {
    return deny(sourceIdentity, "not-untracked", `Live report item is ${String(item.status)}, not Untracked.`, { status: item.status });
  }

  const [sourceSection, sourceId] = sourceIdentity.split(":");
  const activeBaseRows = baseIgnoreRecords.filter((record) => (
    record?.sourceSection === sourceSection && record?.sourceId === sourceId && isActive(record, now)
  ));
  if (activeBaseRows.length > 0) {
    return deny(sourceIdentity, "active-base-ignore", "An active Ignore decision already exists in the base manifest.", {
      count: activeBaseRows.length,
    });
  }

  return { allowed: true, sourceIdentity, item };
}

export function formatIgnoreEligibilityResult(result, { globalSha, japanSha } = {}) {
  const lines = [
    `Ignore eligibility: ${result.allowed ? "allowed" : `denied (${result.reasonCode})`}`,
    `Identity: ${result.sourceIdentity}`,
    `Global SHA: ${globalSha || "unknown"}`,
    `Japan SHA: ${japanSha || "unknown"}`,
  ];
  if (result.message) lines.push(`Reason: ${result.message}`);
  if (result.details?.expectedPath) lines.push(`Mapping drift path: ${result.details.expectedPath}`);
  for (const candidate of result.details?.candidates || []) {
    lines.push(`Candidate: ${candidate.targetPath} [${candidate.signals.join(", ")}]`);
  }
  if (!result.allowed) {
    lines.push("Remediation: reconcile through a normal human-reviewed baseline/content PR; do not add an Ignore row.");
  }
  return lines.join("\n");
}
