import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { chooseLocale, mapCategory, normalizeUrl } from "./lib.mjs";

const SOURCE_SECTIONS = {
  blogs: "blog", "white-papers": "white-paper", events: "events", manuals: "manual",
  glossary: "glossary", voc: "customer-story", introduction: "introduction",
};

export function canonicalSourceUrl(category, meta) {
  if (meta.contentType === "outlink") {
    const url = new URL(meta.externalUrl);
    if (url.protocol !== "https:") throw new Error(`${meta.storageId}: outlink must use HTTPS`);
    return normalizeUrl(url.href);
  }
  const section = SOURCE_SECTIONS[category];
  if (!section) throw new Error(`unsupported source category: ${category}`);
  return normalizeUrl(`https://www.querypie.com/en/${section}/${meta.id}`);
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
    for (const record of records) {
      for (const key of ["sourceId", "reason", "addedBy", "addedAt"]) if (!record[key]) throw new Error(`ignore record missing ${key}`);
      if (!/^cnt_\d+$/.test(record.sourceId) || Number.isNaN(Date.parse(record.addedAt))) throw new Error("ignore record has invalid identity or date");
    }
  }
  return records;
}

async function readManifest(targetRepo, name) {
  const file = path.join(targetRepo, ".github/content-sync", `${name}.json`);
  return validateDecisionManifest(JSON.parse(await readFile(file, "utf8")), name);
}

async function enumerateSources(globalRepo) {
  const root = path.join(globalRepo, "src/content/documentation");
  const records = [];
  for (const category of await readdir(root)) {
    if (!SOURCE_SECTIONS[category]) continue;
    const categoryRoot = path.join(root, category);
    for (const sourceId of await readdir(categoryRoot)) {
      if (!/^cnt_\d+$/.test(sourceId)) continue;
      const directory = path.join(categoryRoot, sourceId);
      const meta = JSON.parse(await readFile(path.join(directory, "meta.json"), "utf8"));
      if (meta.storageId !== sourceId) throw new Error(`${sourceId}: storageId mismatch`);
      let selected = null;
      if (meta.contentType === "content") {
        const optional = async (locale) => { try { return await readFile(path.join(directory, `${locale}.html`), "utf8"); } catch (error) { if (error.code === "ENOENT") return ""; throw error; } };
        try { selected = chooseLocale({ jaHtml: await optional("ja"), enHtml: await optional("en") }); } catch { selected = null; }
      }
      records.push({ sourceId, category, directory, meta, selected });
    }
  }
  return records;
}

function productionSets(sitemapXml, documentationListHtml) {
  const sitemap = new Set([...sitemapXml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((match) => normalizeUrl(match[1])));
  const list = new Set([...documentationListHtml.matchAll(/href=["']([^"']+)["']/g)].map((match) => normalizeUrl(new URL(match[1], "https://www.querypie.com").href)));
  return { sitemap, list };
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

export async function discoverNextCandidate({ globalRepo, targetRepo, sitemapXml, documentationListHtml, prRecords = [], branchNames = [] }) {
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

  const handled = new Set([
    ...baseline.map(({ sourceId }) => sourceId), ...ignore.map(({ sourceId }) => sourceId),
    ...markerIds, ...syncBranches.map((name) => name.slice("content-sync/".length)),
    ...(await mappedSourceIds(targetRepo)),
  ]);
  const production = productionSets(sitemapXml, documentationListHtml);
  const sources = (await enumerateSources(globalRepo)).sort((a, b) => (b.meta.dateIso || "").localeCompare(a.meta.dateIso || "") || a.sourceId.localeCompare(b.sourceId));
  for (const source of sources) {
    if (handled.has(source.sourceId) || source.meta.status !== "published") continue;
    if (!["content", "outlink"].includes(source.meta.contentType)) continue;
    let url;
    try { url = canonicalSourceUrl(source.category, source.meta); } catch { continue; }
    const listed = production.list.has(url);
    const eligible = source.meta.contentType === "outlink"
      ? listed
      : listed && production.sitemap.has(url) && source.selected;
    if (!eligible) continue;
    return {
      status: "candidate",
      source: {
        sourceId: source.sourceId, sourceCategory: source.category,
        sourceSlug: source.meta.id, targetFamily: mapCategory(source.category),
        canonicalUrl: url, sourceLocale: source.selected?.locale || (source.meta.title?.ja ? "ja" : "en"),
        sourceDirectory: source.directory, meta: source.meta,
        production: { canonicalUrl: url, sitemap: source.meta.contentType === "content", documentationList: true },
      },
      reservedTargetIds: markers.filter(({ targetFamily }) => targetFamily === mapCategory(source.category)).map(({ targetId }) => targetId),
    };
  }
  return { status: "no_candidate" };
}
