import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { chooseLocale, normalizeUrl } from "./lib.mjs";
import { canonicalContentUrl, sourceFamily, sourceRoots, targetFamily } from "./source-family-map.mjs";

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

export function parseSyncMarker(body = "") {
  const matches = [...body.matchAll(/<!--\s*global-documentation-sync:v1\s+(\{[^\n]*\})\s*-->/g)];
  if (matches.length === 0) return null;
  if (matches.length > 1) throw new Error("duplicate global-documentation-sync marker");
  const value = JSON.parse(matches[0][1]);
  for (const key of ["sourceId", "targetFamily", "targetId", "runId", "branch"]) if (value[key] === undefined) throw new Error(`PR marker missing ${key}`);
  return value;
}

export function serializeSyncMarker(value) {
  return `<!-- global-documentation-sync:v1 ${JSON.stringify(value)} -->`;
}

export function validateDecisionManifest(records, name) {
  if (!Array.isArray(records)) throw new Error(`${name} manifest must be an array`);
  const ids = records.map(({ sourceId }) => sourceId);
  if (new Set(ids).size !== ids.length) throw new Error(`${name} manifest has duplicate sourceId`);
  if (ids.some((id, index) => index > 0 && ids[index - 1].localeCompare(id) > 0)) throw new Error(`${name} manifest must be sourceId-sorted`);
  if (name === "baseline") {
    for (const record of records) {
      for (const key of ["sourceId", "sourceCategory", "sourceSlug", "targetFamily", "targetId", "targetSlug"]) if (record[key] === undefined || record[key] === "") throw new Error(`baseline record missing ${key}`);
      if (!/^cnt_\d+$/.test(record.sourceId) || !Number.isInteger(Number(record.targetId))) throw new Error("baseline record has invalid identity");
    }
    const targets = records.map(({ targetFamily, targetId }) => `${targetFamily}:${targetId}`);
    if (new Set(targets).size !== targets.length) throw new Error("baseline manifest has duplicate target identity");
  } else if (name === "ignore") {
    const reasonCodes = new Set(["not-for-japan", "duplicate", "superseded", "legal-hold", "launch-gated", "manual-publication", "source-quality", "other"]);
    for (const record of records) {
      for (const key of ["sourceId", "sourceCanonicalUrl", "reasonCode", "reason", "addedBy", "addedAt"]) if (!record[key]) throw new Error(`ignore record missing ${key}`);
      if (!/^cnt_\d+$/.test(record.sourceId) || Number.isNaN(Date.parse(record.addedAt)) || (record.expiresAt && Number.isNaN(Date.parse(record.expiresAt)))) throw new Error("ignore record has invalid identity or date");
      if (!reasonCodes.has(record.reasonCode)) throw new Error(`ignore record has invalid reasonCode: ${record.reasonCode}`);
      if (normalizeUrl(record.sourceCanonicalUrl) !== record.sourceCanonicalUrl || !record.sourceCanonicalUrl.startsWith("https://")) throw new Error("ignore record sourceCanonicalUrl must be normalized HTTPS");
    }
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
      records.push({ sourceId, category: descriptor.sourceCategory, directory, meta, selected, descriptor });
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

async function mappedSourceIds(targetRepo) {
  const root = path.join(targetRepo, "src/content");
  const ids = new Set();
  async function visit(directory) {
    let entries = [];
    try { entries = await readdir(directory, { withFileTypes: true }); } catch (error) { if (error.code === "ENOENT") return; throw error; }
    for (const entry of entries) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(file);
      else if (entry.name.endsWith(".mdx")) {
        const source = await readFile(file, "utf8");
        const match = /^sourceId:\s*["']?(cnt_\d+)["']?\s*$/m.exec(source);
        if (match) ids.add(match[1]);
      }
    }
  }
  await visit(root);
  return ids;
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

export async function discoverNextCandidate({ globalRepo, targetRepo, sitemapXml, productionListHtmlByUrl, prRecords = [], branchNames = [] }) {
  const baseline = await readManifest(targetRepo, "baseline");
  const ignore = await readManifest(targetRepo, "ignore");
  const parsedPulls = prRecords.map((pull) => ({ pull, marker: parseSyncMarker(pull.body) }));
  const invalidSyncPull = parsedPulls.find(({ pull, marker }) => pull.headRefName?.startsWith("content-sync/") && !marker);
  if (invalidSyncPull) return { status: "blocked_invalid_pr_marker", pullRequest: invalidSyncPull.pull.number, sourceId: invalidSyncPull.pull.headRefName.slice("content-sync/".length) };
  const markers = parsedPulls.map(({ marker }) => marker).filter(Boolean);
  const markerIds = new Set(markers.map(({ sourceId }) => sourceId));
  const syncBranches = branchNames.filter((name) => name.startsWith("content-sync/"));
  const orphan = syncBranches.find((name) => !markerIds.has(name.slice("content-sync/".length)));
  if (orphan) return { status: "blocked_branch_only", branch: orphan };

  const activeIgnore = new Map(ignore.filter(({ expiresAt }) => !expiresAt || Date.parse(expiresAt) > Date.now()).map((record) => [record.sourceId, record]));
  const handled = new Set([
    ...baseline.map(({ sourceId }) => sourceId),
    ...markerIds, ...syncBranches.map((name) => name.slice("content-sync/".length)),
    ...(await mappedSourceIds(targetRepo)),
  ]);
  const production = productionSets(sitemapXml, productionListHtmlByUrl);
  const sources = (await enumerateSources(globalRepo)).sort((a, b) => (b.meta.dateIso || "").localeCompare(a.meta.dateIso || "") || a.sourceId.localeCompare(b.sourceId));
  for (const [sourceId, ignored] of activeIgnore) {
    const source = sources.find((record) => record.sourceId === sourceId);
    if (!source) continue;
    let currentUrl;
    try { currentUrl = canonicalSourceUrl(source.category, source.meta); } catch { continue; }
    if (ignored.sourceCanonicalUrl !== currentUrl) return { status: "blocked_ignore_url_drift", sourceId, expectedUrl: ignored.sourceCanonicalUrl, actualUrl: currentUrl };
  }
  for (const source of sources) {
    if (shouldSkipDiscoveryContractFailure(source)) continue;
    const contractFailure = sourceContractFailure(source);
    if (contractFailure) return { status: "blocked_source_contract", sourceId: source.sourceId, reason: contractFailure };
    let url;
    try { url = canonicalSourceUrl(source.category, source.meta); } catch { continue; }
    if (activeIgnore.has(source.sourceId)) continue;
    if (handled.has(source.sourceId)) continue;
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
      reservedTargetIds: markers.filter(({ targetFamily: family }) => family === targetFamily(source.category)).map(({ targetId }) => targetId),
    };
  }
  return { status: "no_candidate" };
}
