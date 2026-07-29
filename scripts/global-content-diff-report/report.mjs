import { stat } from "node:fs/promises";
import path from "node:path";

import {
  enumerateSources,
  productionSets,
  readManifest,
  sourceContractFailure,
  validateDecisionManifest,
} from "./discovery.mjs";
import { normalizeUrl } from "./lib.mjs";
import { sourceFamily, sourceRoots, targetFamily, targetFamilyDescriptor } from "./source-family-map.mjs";
import { resolveLegacySourceSection, sourceIdentityKey } from "./sync-identity.mjs";

const safeKebabSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const baselinePath = ({ targetFamily, targetId, targetSlug }) =>
  path.join("src/content", targetFamily, `${targetId}-${targetSlug}.mdx`);

function validateReportBaselineRecord(record, targetRepo) {
  const descriptor = sourceFamily(record.sourceCategory);
  if (record.sourceSection !== descriptor.sourceSection) {
    throw new Error(`baseline record sourceSection must equal descriptor section: ${descriptor.sourceSection}`);
  }
  const targetDescriptor = targetFamilyDescriptor(record.targetFamily);
  if (targetDescriptor.targetFamily !== descriptor.targetFamily || record.targetFamily !== descriptor.targetFamily) {
    throw new Error(`baseline record targetFamily must equal descriptor target family: ${descriptor.targetFamily}`);
  }
  if (!Number.isInteger(record.targetId) || record.targetId <= 0) {
    throw new Error("baseline record targetId must be a positive integer number");
  }
  if (!safeKebabSlugPattern.test(record.sourceSlug)) throw new Error("baseline record has unsafe sourceSlug");
  if (!safeKebabSlugPattern.test(record.targetSlug)) throw new Error("baseline record has unsafe targetSlug");

  const expectedPath = baselinePath(record);
  const contentRoot = path.resolve(targetRepo, "src/content", descriptor.targetFamily);
  const resolvedPath = path.resolve(targetRepo, expectedPath);
  if (!resolvedPath.startsWith(`${contentRoot}${path.sep}`)) {
    throw new Error("baseline record target path escapes supported content family root");
  }
  return expectedPath;
}

function localizedTitle(meta, sourceId) {
  for (const locale of ["en", "ja", "ko"]) {
    const value = meta?.title?.[locale]?.trim();
    if (value) return value;
  }
  return sourceId;
}

function compareGlobalItems(left, right) {
  return String(right.dateIso || "").localeCompare(String(left.dateIso || ""))
    || String(left.identity).localeCompare(String(right.identity))
    || String(left.sourceUrl).localeCompare(String(right.sourceUrl));
}

async function fileExists(file, statFile = stat) {
  try {
    return (await statFile(file)).isFile();
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function registerMapping({ present, mappingDrift, targetOwners, identity, mapping, expectedPath }) {
  const targetIdentity = `${mapping.targetFamily}:${mapping.targetId}`;
  const owner = targetOwners.get(targetIdentity);
  if (owner && owner !== identity) {
    throw new Error(`target mapping conflict: ${targetIdentity} is claimed by ${owner} and ${identity}`);
  }
  targetOwners.set(targetIdentity, identity);

  const existing = present.get(identity) || mappingDrift.get(identity);
  if (existing && (existing.targetFamily !== mapping.targetFamily || existing.targetId !== mapping.targetId)) {
    throw new Error(`duplicate baseline mapping: ${identity}`);
  }
  if (present.has(identity)) return;
  if (expectedPath) {
    if (!mappingDrift.has(identity)) mappingDrift.set(identity, { ...mapping, expectedPath });
    return;
  }
  mappingDrift.delete(identity);
  present.set(identity, mapping);
}

function globalSourceViews(globalItems) {
  return globalItems.map((item) => ({
    sourceId: item.sourceId,
    sourceSection: item.sourceSection,
    sourceCanonicalUrl: item.sourceUrl,
  }));
}

export async function assertSupportedSourceRoots(globalRepo) {
  for (const descriptor of sourceRoots(globalRepo)) {
    let rootStat;
    try {
      rootStat = await stat(descriptor.root);
    } catch (error) {
      if (error.code === "ENOENT") {
        throw new Error(`supported Global source root must be a directory: ${descriptor.relativeRoot}`);
      }
      throw error;
    }
    if (!rootStat.isDirectory()) {
      throw new Error(`supported Global source root must be a directory: ${descriptor.relativeRoot}`);
    }
  }
}

export async function buildGlobalInventory({ globalRepo, sitemapXml, productionListHtmlByUrl }) {
  await assertSupportedSourceRoots(globalRepo);
  const production = productionSets(sitemapXml, productionListHtmlByUrl, { preserveQuery: true });
  const itemsByIdentity = new Map();

  for (const source of await enumerateSources(globalRepo, { preserveQuery: true })) {
    if (!source.sourceCanonicalUrl) continue;
    const descriptor = sourceFamily(source.category);
    const listUrl = normalizeUrl(descriptor.productionListUrl);
    const listed = (production.listByUrl.get(listUrl) || new Set()).has(source.sourceCanonicalUrl);
    if (!listed) continue;
    const sitemapped = production.sitemap.has(source.sourceCanonicalUrl);
    if (source.meta.contentType !== "outlink" && !sitemapped) continue;
    const failure = sourceContractFailure(source);
    if (failure) throw new Error(`${source.sourceSection}:${source.sourceId}: ${failure}`);

    const identity = sourceIdentityKey(source);
    if (itemsByIdentity.has(identity)) throw new Error(`duplicate Global identity: ${identity}`);
    const sourcePath = path.relative(globalRepo, source.directory).split(path.sep).join("/");
    if (!sourcePath.startsWith("src/content/") || sourcePath.split("/").includes("..")) {
      throw new Error(`invalid Global source path: ${identity}`);
    }
    itemsByIdentity.set(identity, {
      identity,
      sourceSection: source.sourceSection,
      sourceId: source.sourceId,
      sourceCategory: source.category,
      targetFamily: targetFamily(source.category),
      title: localizedTitle(source.meta, source.sourceId),
      dateIso: source.meta.dateIso || "",
      sourceUrl: source.sourceCanonicalUrl,
      sourcePath,
    });
  }

  return [...itemsByIdentity.values()].sort(compareGlobalItems);
}

export async function buildJapanInventory({ targetRepo, statFile = stat }) {
  const baseline = await readManifest(targetRepo, "baseline");
  const present = new Map();
  const mappingDrift = new Map();
  const targetOwners = new Map();

  for (const record of baseline) {
    const identity = sourceIdentityKey({ sourceSection: record.sourceSection, sourceId: record.sourceId });
    const expectedPath = validateReportBaselineRecord(record, targetRepo);
    registerMapping({
      present,
      mappingDrift,
      targetOwners,
      identity,
      mapping: {
        identity,
        sourceSection: record.sourceSection,
        sourceId: record.sourceId,
        targetFamily: record.targetFamily,
        targetId: record.targetId,
        targetPath: expectedPath,
      },
      expectedPath: await fileExists(path.join(targetRepo, expectedPath), statFile) ? null : expectedPath,
    });
  }

  return { present, mappingDrift };
}

export function buildDispositionMap({ ignoreRecords, globalItems, now }) {
  const dispositions = new Map();
  const sourceViews = globalSourceViews(globalItems);
  const activeIgnore = validateDecisionManifest(ignoreRecords, "ignore")
    .filter(({ expiresAt }) => !expiresAt || Date.parse(expiresAt) > Date.parse(now));

  for (const record of activeIgnore) {
    const resolved = resolveLegacySourceSection({ record, sources: sourceViews });
    if (resolved.status === "ambiguous") throw new Error(`ambiguous legacy ignore identity: ${record.sourceId}`);
    if (resolved.status !== "resolved") continue;
    dispositions.set(sourceIdentityKey({ sourceSection: resolved.sourceSection, sourceId: record.sourceId }), "Ignored");
  }

  return dispositions;
}

export async function buildGlobalOnlyReport({
  globalRepo,
  targetRepo,
  sitemapXml,
  productionListHtmlByUrl,
  now = new Date().toISOString(),
}) {
  const globalItems = await buildGlobalInventory({ globalRepo, sitemapXml, productionListHtmlByUrl });
  const ignoreRecords = await readManifest(targetRepo, "ignore");
  const { present, mappingDrift } = await buildJapanInventory({ targetRepo });
  const dispositions = buildDispositionMap({ ignoreRecords, globalItems, now });
  const items = [];

  for (const item of globalItems) {
    if (present.has(item.identity)) continue;
    items.push({
      ...item,
      status: dispositions.get(item.identity) || "Untracked",
    });
  }

  const familyCounts = {};
  for (const item of items) {
    familyCounts[item.targetFamily] = (familyCounts[item.targetFamily] || 0) + 1;
  }

  return {
    generatedAt: new Date(now).toISOString(),
    counts: {
      globalPublished: globalItems.length,
      japanPresent: present.size,
      globalOnly: items.length,
    },
    familyCounts,
    items,
    mappingDrift: [...mappingDrift.values()].map(({ identity, expectedPath }) => ({ identity, expectedPath })),
  };
}
