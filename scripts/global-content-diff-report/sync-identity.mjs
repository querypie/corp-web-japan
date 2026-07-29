import { sourceFamily } from "./source-family-map.mjs";

const SOURCE_ID_PATTERN = /^cnt_\d+$/;

function assertSourceIdentity({ sourceSection, sourceId }) {
  if (!sourceSection) throw new Error("sourceSection required");
  if (!SOURCE_ID_PATTERN.test(sourceId || "")) throw new Error(`invalid sourceId: ${sourceId}`);
  return { sourceSection, sourceId };
}

export function sourceIdentityKey({ sourceSection, sourceId }) {
  const value = assertSourceIdentity({ sourceSection, sourceId });
  return `${value.sourceSection}:${value.sourceId}`;
}

export function inferSourceSectionFromCategory(sourceCategory) {
  if (!sourceCategory) return null;
  return sourceFamily(sourceCategory).sourceSection;
}

export function resolveLegacySourceSection({ record, sources, allowSourceIdFallback = true }) {
  if (record?.sourceSection) return { status: "resolved", sourceSection: record.sourceSection };
  if (record?.sourceCategory) return { status: "resolved", sourceSection: inferSourceSectionFromCategory(record.sourceCategory) };
  const byId = sources.filter((source) => source.sourceId === record?.sourceId);
  const exact = record?.sourceCanonicalUrl
    ? byId.filter((source) => source.sourceCanonicalUrl === record.sourceCanonicalUrl)
    : allowSourceIdFallback ? byId : [];
  if (exact.length === 1) return { status: "resolved", sourceSection: exact[0].sourceSection };
  if (exact.length > 1) return { status: "ambiguous", sourceId: record?.sourceId };
  if (!allowSourceIdFallback) return { status: "missing", sourceId: record?.sourceId };
  if (byId.length === 1) return { status: "resolved", sourceSection: byId[0].sourceSection };
  if (byId.length > 1) return { status: "ambiguous", sourceId: record?.sourceId };
  return { status: "missing", sourceId: record?.sourceId };
}

export function sortSourceRecords(left, right) {
  return String(left?.sourceId || "").localeCompare(String(right?.sourceId || ""))
    || String(left?.sourceSection || inferSourceSectionFromCategory(left?.sourceCategory) || "")
      .localeCompare(String(right?.sourceSection || inferSourceSectionFromCategory(right?.sourceCategory) || ""));
}
