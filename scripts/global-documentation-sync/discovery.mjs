import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { chooseLocale, normalizeUrl } from "./lib.mjs";
import {
  branchFor,
  parseSyncBranch,
  parseSyncMarker,
  resolveLegacySourceSection,
  serializeSyncMarker,
  sortSourceRecords,
  sourceIdentityKey,
} from "./sync-identity.mjs";
import { canonicalContentUrl, sourceFamily, sourceRoots, targetFamily } from "./source-family-map.mjs";

export { branchFor, parseSyncMarker, serializeSyncMarker } from "./sync-identity.mjs";

export function canonicalSourceUrl(category, meta) {
  if (meta.contentType === "outlink") {
    let url;
    try {
      url = new URL(meta.externalUrl);
    } catch {
      throw new Error(`${meta.storageId}: invalid external URL`);
    }
    if (url.protocol !== "https:") throw new Error(`${meta.storageId}: outlink must use HTTPS`);
    return normalizeUrl(url.href);
  }
  return normalizeUrl(canonicalContentUrl(category, meta.id));
}

function manifestIdentity(record, name) {
  const resolved = resolveLegacySourceSection({ record, sources: [] });
  if (resolved.status !== "resolved") throw new Error(`${name} record missing sourceSection`);
  return sourceIdentityKey({ sourceSection: resolved.sourceSection, sourceId: record.sourceId });
}

export function validateDecisionManifest(records, name) {
  if (!Array.isArray(records)) throw new Error(`${name} manifest must be an array`);
  const identities = [];
  if (records.some((record, index) => index > 0 && sortSourceRecords(records[index - 1], record) > 0)) {
    throw new Error(`${name} manifest must be sourceId-sorted`);
  }
  if (name === "baseline") {
    for (const record of records) {
      for (const key of ["sourceId", "sourceCategory", "sourceSlug", "targetFamily", "targetId", "targetSlug"]) if (record[key] === undefined || record[key] === "") throw new Error(`baseline record missing ${key}`);
      if (!/^cnt_\d+$/.test(record.sourceId) || !Number.isInteger(Number(record.targetId))) throw new Error("baseline record has invalid identity");
      identities.push(manifestIdentity(record, name));
    }
    if (new Set(identities).size !== identities.length) throw new Error(`${name} manifest has duplicate source identity`);
    const targets = records.map(({ targetFamily, targetId }) => `${targetFamily}:${targetId}`);
    if (new Set(targets).size !== targets.length) throw new Error("baseline manifest has duplicate target identity");
  } else if (name === "ignore") {
    const reasonCodes = new Set(["not-for-japan", "duplicate", "superseded", "legal-hold", "launch-gated", "manual-publication", "source-quality", "other"]);
    for (const record of records) {
      for (const key of ["sourceId", "sourceCanonicalUrl", "reasonCode", "reason", "addedBy", "addedAt"]) if (!record[key]) throw new Error(`ignore record missing ${key}`);
      if (!/^cnt_\d+$/.test(record.sourceId) || Number.isNaN(Date.parse(record.addedAt)) || (record.expiresAt && Number.isNaN(Date.parse(record.expiresAt)))) throw new Error("ignore record has invalid identity or date");
      if (!reasonCodes.has(record.reasonCode)) throw new Error(`ignore record has invalid reasonCode: ${record.reasonCode}`);
      if (normalizeUrl(record.sourceCanonicalUrl) !== record.sourceCanonicalUrl || !record.sourceCanonicalUrl.startsWith("https://")) throw new Error("ignore record sourceCanonicalUrl must be normalized HTTPS");
      if (record.sourceSection) identities.push(`${record.sourceSection}:${record.sourceId}`);
    }
    if (new Set(identities).size !== identities.length) throw new Error(`${name} manifest has duplicate source identity`);
  }
  return records;
}

async function readManifest(targetRepo, name) {
  const file = path.join(targetRepo, ".github/content-sync", `${name}.json`);
  return validateDecisionManifest(JSON.parse(await readFile(file, "utf8")), name);
}

function optionalHtml(directory, locale) {
  return readFile(path.join(directory, `${locale}.html`), "utf8").catch((error) => {
    if (error.code === "ENOENT") return "";
    throw error;
  });
}

async function enumerateSources(globalRepo) {
  const records = [];
  for (const descriptor of sourceRoots(globalRepo)) {
    let entries = [];
    try {
      entries = await readdir(descriptor.root);
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    for (const sourceId of entries) {
      if (!/^cnt_\d+$/.test(sourceId)) continue;
      const directory = path.join(descriptor.root, sourceId);
      const meta = JSON.parse(await readFile(path.join(directory, "meta.json"), "utf8"));
      if (meta.storageId !== sourceId) throw new Error(`${sourceId}: storageId mismatch`);
      let selected = null;
      if (meta.contentType === "content") {
        try {
          selected = chooseLocale({
            jaHtml: await optionalHtml(directory, "ja"),
            enHtml: await optionalHtml(directory, "en"),
          });
        } catch {
          selected = null;
        }
      }
      let sourceCanonicalUrl = null;
      try {
        sourceCanonicalUrl = canonicalSourceUrl(descriptor.sourceCategory, meta);
      } catch {
        sourceCanonicalUrl = null;
      }
      records.push({
        sourceId,
        category: descriptor.sourceCategory,
        sourceSection: descriptor.sourceSection,
        directory,
        meta,
        selected,
        descriptor,
        sourceCanonicalUrl,
      });
    }
  }
  return records;
}

function productionSets(sitemapXml, productionListHtmlByUrl = {}) {
  const sitemap = new Set([...sitemapXml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((match) => normalizeUrl(match[1])));
  const listByUrl = new Map();
  for (const [listUrl, html] of Object.entries(productionListHtmlByUrl)) {
    listByUrl.set(
      normalizeUrl(listUrl),
      new Set([...String(html || "").matchAll(/href=["']([^"']+)["']/g)].map((match) => normalizeUrl(new URL(match[1], "https://www.querypie.com").href))),
    );
  }
  return { sitemap, listByUrl };
}

async function mappedSourceIdentities(targetRepo) {
  const root = path.join(targetRepo, "src/content");
  const identities = new Set();
  async function visit(directory) {
    let entries = [];
    try { entries = await readdir(directory, { withFileTypes: true }); } catch (error) { if (error.code === "ENOENT") return; throw error; }
    for (const entry of entries) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(file);
      else if (entry.name.endsWith(".mdx")) {
        const source = await readFile(file, "utf8");
        const sourceId = /^sourceId:\s*["']?(cnt_\d+)["']?\s*$/m.exec(source)?.[1];
        const sourceSection = /^sourceSection:\s*["']?([a-z]+)["']?\s*$/m.exec(source)?.[1];
        if (sourceId && sourceSection) identities.add(sourceIdentityKey({ sourceSection, sourceId }));
      }
    }
  }
  await visit(root);
  return identities;
}

function outlinkLocale(meta) {
  return meta.title?.ja?.trim() || meta.summary?.ja?.trim() ? "ja" : "en";
}

function outlinkHasLocalizedTitleAndSummary(meta) {
  const locale = outlinkLocale(meta);
  return Boolean(meta.title?.[locale]?.trim() && meta.summary?.[locale]?.trim());
}

function contentHasSelectedBody(source) {
  return Boolean(source.selected?.html?.trim());
}

export function sourceContractFailure(source) {
  if (source.descriptor?.sourceSection === "news" && source.meta.section !== "news") {
    return `section must equal news: ${source.meta.section ?? ""}`;
  }
  if (source.meta.categorySlug !== source.category) {
    return `categorySlug must equal ${source.category}: ${source.meta.categorySlug ?? ""}`;
  }
  if (source.meta.status !== "published") {
    return `status must equal published: ${source.meta.status ?? ""}`;
  }
  if (!source.meta.contentType || !["content", "outlink"].includes(source.meta.contentType)) {
    return `contentType must be content or outlink: ${source.meta.contentType ?? ""}`;
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.meta.id || "")) {
    return `unsafe source slug: ${source.meta.id}`;
  }
  if (source.meta.contentType === "outlink") {
    let external;
    try {
      external = new URL(source.meta.externalUrl);
    } catch {
      return `invalid external URL: ${source.meta.externalUrl}`;
    }
    if (external.protocol !== "https:") return `non-HTTPS external URL: ${source.meta.externalUrl}`;
    if (!outlinkHasLocalizedTitleAndSummary(source.meta)) return "outlink requires localized title/summary and HTTPS externalUrl";
    return null;
  }
  if (!contentHasSelectedBody(source)) return "content requires non-empty ja.html or en.html";
  return null;
}

function shouldSkipDiscoveryContractFailure(source) {
  return source.descriptor?.sourceSection !== "news"
    && (source.meta.status !== "published"
      || (source.meta.contentType && !["content", "outlink"].includes(source.meta.contentType)));
}

function identityForSource(source) {
  return sourceIdentityKey({ sourceSection: source.sourceSection, sourceId: source.sourceId });
}

function resolveIgnoreRecord(record, sources) {
  const resolved = resolveLegacySourceSection({ record, sources });
  if (resolved.status === "missing") return null;
  if (resolved.status !== "resolved") return { status: "blocked_ambiguous_legacy_identity", sourceId: record.sourceId };
  return {
    ...record,
    sourceSection: resolved.sourceSection,
    identity: sourceIdentityKey({ sourceSection: resolved.sourceSection, sourceId: record.sourceId }),
  };
}

function resolveBranchIdentity(branch, sources) {
  const parsed = parseSyncBranch(branch);
  if (!parsed) return null;
  if (!parsed.legacy) return parsed;
  const resolved = resolveLegacySourceSection({ record: { sourceId: parsed.sourceId }, sources });
  if (resolved.status === "resolved") return { ...parsed, sourceSection: resolved.sourceSection, identity: sourceIdentityKey({ sourceSection: resolved.sourceSection, sourceId: parsed.sourceId }) };
  return { ...parsed, blockedStatus: "blocked_ambiguous_legacy_identity" };
}

export async function discoverNextCandidate({ globalRepo, targetRepo, sitemapXml, productionListHtmlByUrl, prRecords = [], branchNames = [] }) {
  const baseline = await readManifest(targetRepo, "baseline");
  const ignore = await readManifest(targetRepo, "ignore");
  const production = productionSets(sitemapXml, productionListHtmlByUrl);
  const sources = (await enumerateSources(globalRepo)).sort((left, right) => (right.meta.dateIso || "").localeCompare(left.meta.dateIso || "") || sortSourceRecords(left, right));
  const sourceViews = sources.filter((source) => source.sourceCanonicalUrl).map((source) => ({
    sourceId: source.sourceId,
    sourceSection: source.sourceSection,
    sourceCanonicalUrl: source.sourceCanonicalUrl,
  }));

  const baselineIdentities = new Set(baseline.map((record) => sourceIdentityKey({ sourceSection: record.sourceSection || sourceFamily(record.sourceCategory).sourceSection, sourceId: record.sourceId })));
  const activeIgnore = new Map();
  for (const record of ignore.filter(({ expiresAt }) => !expiresAt || Date.parse(expiresAt) > Date.now())) {
    const resolved = resolveIgnoreRecord(record, sourceViews);
    if (resolved?.status) return resolved;
    if (resolved) activeIgnore.set(resolved.identity, resolved);
  }

  const parsedPulls = [];
  for (const pull of prRecords) {
    if (!pull.headRefName?.startsWith("content-sync/")) continue;
    let marker;
    try {
      marker = parseSyncMarker(pull.body);
    } catch {
      return { status: "blocked_invalid_pr_marker", pullRequest: pull.number, branch: pull.headRefName };
    }
    if (!marker) return { status: "blocked_invalid_pr_marker", pullRequest: pull.number, branch: pull.headRefName };
    parsedPulls.push({ pull, marker });
  }
  const markersByIdentity = new Map();
  for (const entry of parsedPulls) {
    const list = markersByIdentity.get(entry.marker.identity) || [];
    list.push(entry);
    markersByIdentity.set(entry.marker.identity, list);
  }
  const duplicateMarkerGroup = [...markersByIdentity.entries()].find(([, list]) => list.length > 1);
  if (duplicateMarkerGroup) {
    return {
      status: "blocked_duplicate_pr_identity",
      sourceIdentity: duplicateMarkerGroup[0],
      pullRequests: duplicateMarkerGroup[1].map(({ pull }) => pull.number),
    };
  }

  const syncBranches = branchNames.filter((name) => name.startsWith("content-sync/"));
  for (const branch of syncBranches) {
    if (parsedPulls.some(({ marker }) => marker.branch === branch)) continue;
    const parsed = resolveBranchIdentity(branch, sourceViews);
    if (parsed?.blockedStatus) return { status: parsed.blockedStatus, branch };
    if (parsed) return { status: "blocked_branch_only", branch };
  }

  const handled = new Set([
    ...baselineIdentities,
    ...markersByIdentity.keys(),
    ...(await mappedSourceIdentities(targetRepo)),
  ]);

  for (const ignored of activeIgnore.values()) {
    const source = sources.find((record) => identityForSource(record) === ignored.identity);
    if (!source) continue;
    if (ignored.sourceCanonicalUrl !== source.sourceCanonicalUrl) {
      return {
        status: "blocked_ignore_url_drift",
        sourceId: source.sourceId,
        sourceSection: source.sourceSection,
        expectedUrl: ignored.sourceCanonicalUrl,
        actualUrl: source.sourceCanonicalUrl,
      };
    }
  }

  for (const source of sources) {
    if (shouldSkipDiscoveryContractFailure(source)) continue;
    const contractFailure = sourceContractFailure(source);
    if (contractFailure) return { status: "blocked_source_contract", sourceId: source.sourceId, sourceSection: source.sourceSection, reason: contractFailure };
    const url = source.sourceCanonicalUrl;
    if (!url) continue;
    const identity = identityForSource(source);
    if (activeIgnore.has(identity)) continue;
    if (handled.has(identity)) continue;
    const descriptor = sourceFamily(source.category);
    const listUrl = normalizeUrl(descriptor.productionListUrl);
    const list = production.listByUrl.get(listUrl) || new Set();
    const listed = list.has(url);
    const sitemap = production.sitemap.has(url);
    const eligible = source.meta.contentType === "outlink"
      ? listed
      : listed && sitemap && source.selected;
    if (!eligible) continue;
    return {
      status: "candidate",
      source: {
        sourceId: source.sourceId,
        sourceCategory: source.category,
        sourceSection: descriptor.sourceSection,
        sourceSlug: source.meta.id,
        targetFamily: targetFamily(source.category),
        canonicalUrl: url,
        sourceLocale: source.selected?.locale || outlinkLocale(source.meta),
        sourceDirectory: source.directory,
        meta: source.meta,
        production: { canonicalUrl: url, listed, listUrl, sitemap },
      },
      reservedTargetIds: parsedPulls.filter(({ marker }) => marker.targetFamily === targetFamily(source.category)).map(({ marker }) => marker.targetId),
    };
  }
  return { status: "no_candidate" };
}
