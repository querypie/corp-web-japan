import { sourceFamily, targetFamilyDescriptor } from "./source-family-map.mjs";

const SOURCE_ID_PATTERN = /^cnt_\d+$/;
const SYNC_BRANCH_PATTERN = /^content-sync\/([a-z]+)-(cnt_\d+)$/;
const LEGACY_SYNC_BRANCH_PATTERN = /^content-sync\/(cnt_\d+)$/;
const IGNORE_BRANCH_PATTERN = /^content-sync-ignore\/([a-z]+)-(cnt_\d+)$/;
const LEGACY_IGNORE_BRANCH_PATTERN = /^content-sync-ignore\/(cnt_\d+)$/;
const MARKER_PATTERN = /<!--\s*global-documentation-sync:v1\s+(\{[^\n]*\})\s*-->/g;

function assertSourceIdentity({ sourceSection, sourceId }) {
  if (!sourceSection) throw new Error("sourceSection required");
  if (!SOURCE_ID_PATTERN.test(sourceId || "")) throw new Error(`invalid sourceId: ${sourceId}`);
  return { sourceSection, sourceId };
}

export function sourceIdentityKey({ sourceSection, sourceId }) {
  const value = assertSourceIdentity({ sourceSection, sourceId });
  return `${value.sourceSection}:${value.sourceId}`;
}

export function inferSourceSectionFromTargetFamily(targetFamily) {
  if (!targetFamily) return null;
  return targetFamily === "news" ? "news" : targetFamilyDescriptor(targetFamily).sourceSection;
}

export function inferSourceSectionFromCategory(sourceCategory) {
  if (!sourceCategory) return null;
  return sourceFamily(sourceCategory).sourceSection;
}

export function branchFor(sourceSectionOrIdentity, maybeSourceId) {
  const identity = typeof sourceSectionOrIdentity === "object"
    ? sourceSectionOrIdentity
    : maybeSourceId
      ? { sourceSection: sourceSectionOrIdentity, sourceId: maybeSourceId }
      : null;
  if (!identity) throw new Error("branchFor requires sourceSection and sourceId");
  const value = assertSourceIdentity(identity);
  return `content-sync/${value.sourceSection}-${value.sourceId}`;
}

export function ignoreBranchFor(sourceSectionOrIdentity, maybeSourceId) {
  const identity = typeof sourceSectionOrIdentity === "object"
    ? sourceSectionOrIdentity
    : maybeSourceId
      ? { sourceSection: sourceSectionOrIdentity, sourceId: maybeSourceId }
      : null;
  if (!identity) throw new Error("ignoreBranchFor requires sourceSection and sourceId");
  const value = assertSourceIdentity(identity);
  return `content-sync-ignore/${value.sourceSection}-${value.sourceId}`;
}

export function legacyBranchFor(sourceId) {
  if (!SOURCE_ID_PATTERN.test(sourceId || "")) throw new Error(`invalid sourceId: ${sourceId}`);
  return `content-sync/${sourceId}`;
}

function parseBranchMatch(name, explicitPattern, legacyPattern, kind) {
  const explicit = explicitPattern.exec(name);
  if (explicit) {
    const sourceSection = explicit[1];
    const sourceId = explicit[2];
    return { kind, branch: name, sourceSection, sourceId, identity: sourceIdentityKey({ sourceSection, sourceId }), legacy: false };
  }
  const legacy = legacyPattern.exec(name);
  if (legacy) return { kind, branch: name, sourceSection: null, sourceId: legacy[1], identity: null, legacy: true };
  return null;
}

export function parseSyncBranch(name) {
  return parseBranchMatch(name, SYNC_BRANCH_PATTERN, LEGACY_SYNC_BRANCH_PATTERN, "sync");
}

export function parseIgnoreBranch(name) {
  return parseBranchMatch(name, IGNORE_BRANCH_PATTERN, LEGACY_IGNORE_BRANCH_PATTERN, "ignore");
}

export function parseSyncMarker(body = "") {
  const matches = [...body.matchAll(MARKER_PATTERN)];
  if (matches.length === 0) return null;
  if (matches.length > 1) throw new Error("duplicate global-documentation-sync marker");
  const value = JSON.parse(matches[0][1]);
  for (const key of ["sourceId", "targetFamily", "targetId", "runId", "branch"]) if (value[key] === undefined) throw new Error(`PR marker missing ${key}`);
  const sourceSection = value.sourceSection ?? inferSourceSectionFromTargetFamily(value.targetFamily);
  if (!sourceSection) throw new Error("PR marker missing sourceSection");
  return { ...value, sourceSection, identity: sourceIdentityKey({ sourceSection, sourceId: value.sourceId }) };
}

export function serializeSyncMarker(value) {
  const marker = {
    sourceSection: value.sourceSection,
    sourceId: value.sourceId,
    sourceHash: value.sourceHash,
    targetFamily: value.targetFamily,
    targetId: value.targetId,
    runId: value.runId,
    branch: value.branch,
  };
  assertSourceIdentity(marker);
  return `<!-- global-documentation-sync:v1 ${JSON.stringify(marker)} -->`;
}

export function resolveLegacySourceSection({ record, sources }) {
  if (record?.sourceSection) return { status: "resolved", sourceSection: record.sourceSection };
  if (record?.sourceCategory) return { status: "resolved", sourceSection: inferSourceSectionFromCategory(record.sourceCategory) };
  const byId = sources.filter((source) => source.sourceId === record?.sourceId);
  const exact = record?.sourceCanonicalUrl ? byId.filter((source) => source.sourceCanonicalUrl === record.sourceCanonicalUrl) : byId;
  if (exact.length === 1) return { status: "resolved", sourceSection: exact[0].sourceSection };
  if (exact.length > 1) return { status: "ambiguous", sourceId: record?.sourceId };
  if (byId.length === 1) return { status: "resolved", sourceSection: byId[0].sourceSection };
  if (byId.length > 1) return { status: "ambiguous", sourceId: record?.sourceId };
  return { status: "missing", sourceId: record?.sourceId };
}

export function sortSourceRecords(left, right) {
  return String(left?.sourceId || "").localeCompare(String(right?.sourceId || ""))
    || String(left?.sourceSection || inferSourceSectionFromCategory(left?.sourceCategory) || "").localeCompare(String(right?.sourceSection || inferSourceSectionFromCategory(right?.sourceCategory) || ""));
}
