import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { chooseLocale, normalizeUrl, normalizeUrlPreservingQuery } from "./lib.mjs";
import { resolveLegacySourceSection, sortSourceRecords, sourceIdentityKey } from "./sync-identity.mjs";
import { SUPPORTED_SOURCE_SECTIONS, canonicalContentUrl, sourceFamily, sourceRoots } from "./source-family-map.mjs";

const supportedSourceSections = new Set(SUPPORTED_SOURCE_SECTIONS);
const safeKebabSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const utcTimestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
const productionListUrlBase = "https://www.querypie.com";
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

function resolveProductionListUrl(value, { preserveQuery = false } = {}) {
  const resolved = new URL(String(value).replaceAll("&amp;", "&"), productionListUrlBase).href;
  return (preserveQuery ? normalizeUrlPreservingQuery : normalizeUrl)(resolved);
}

export function canonicalSourceUrl(category, meta, { preserveQuery = false } = {}) {
  if (meta.contentType === "outlink") {
    let url;
    try {
      url = new URL(meta.externalUrl);
    } catch {
      throw new Error(`${meta.storageId}: invalid external URL`);
    }
    if (url.protocol !== "https:") throw new Error(`${meta.storageId}: outlink must use HTTPS`);
    return (preserveQuery ? normalizeUrlPreservingQuery : normalizeUrl)(url.href);
  }
  return normalizeUrl(canonicalContentUrl(category, meta.id));
}

function manifestIdentity(record, name) {
  const resolved = resolveLegacySourceSection({ record, sources: [] });
  if (resolved.status !== "resolved") throw new Error(`${name} record missing sourceSection`);
  if (!supportedSourceSections.has(resolved.sourceSection)) {
    throw new Error(`unsupported ${name} sourceSection: ${resolved.sourceSection}`);
  }
  return sourceIdentityKey({ sourceSection: resolved.sourceSection, sourceId: record.sourceId });
}

function assertPlainManifestRecord(record, name) {
  if (record === null || typeof record !== "object" || Array.isArray(record)) {
    throw new Error(`${name} record must be a plain object`);
  }
  const prototype = Object.getPrototypeOf(record);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new Error(`${name} record must be a plain object`);
  }
}

function assertStringField(record, key, name, { nonEmpty = false } = {}) {
  if (typeof record[key] !== "string" || (nonEmpty && record[key].length === 0)) {
    throw new Error(`${name} record has invalid ${key}`);
  }
}

function assertUtcTimestamp(value, key) {
  if (typeof value !== "string" || !utcTimestampPattern.test(value)) {
    throw new Error(`ignore record has invalid ${key}`);
  }
  const normalized = value.endsWith(".000Z") || /\.\d{3}Z$/.test(value)
    ? value
    : value.replace(/Z$/, ".000Z");
  if (Number.isNaN(Date.parse(value)) || new Date(value).toISOString() !== normalized) {
    throw new Error(`ignore record has invalid ${key}`);
  }
}

export function validateDecisionManifest(records, name) {
  if (!Array.isArray(records)) throw new Error(`${name} manifest must be an array`);
  for (const record of records) assertPlainManifestRecord(record, name);

  const identities = [];
  if (name === "baseline") {
    for (const record of records) {
      for (const key of ["sourceSection", "sourceId", "sourceCategory", "sourceSlug", "targetFamily", "targetSlug"]) {
        assertStringField(record, key, name, { nonEmpty: true });
      }
      if (!supportedSourceSections.has(record.sourceSection)) {
        throw new Error(`unsupported baseline sourceSection: ${record.sourceSection}`);
      }
      if (!/^cnt_\d+$/.test(record.sourceId)) throw new Error("baseline record has invalid sourceId");
      if (!safeKebabSlugPattern.test(record.sourceSlug)) throw new Error("baseline record has unsafe sourceSlug");
      if (!Number.isInteger(record.targetId) || record.targetId <= 0) {
        throw new Error("baseline record targetId must be a positive integer number");
      }
      if (!safeKebabSlugPattern.test(record.targetSlug)) throw new Error("baseline record has unsafe targetSlug");

      const descriptor = sourceFamily(record.sourceCategory);
      if (record.sourceSection !== descriptor.sourceSection) {
        throw new Error(`baseline record sourceSection must equal descriptor section: ${descriptor.sourceSection}`);
      }
      if (record.targetFamily !== descriptor.targetFamily) {
        throw new Error(`baseline record targetFamily must equal descriptor target family: ${descriptor.targetFamily}`);
      }
      identities.push(manifestIdentity(record, name));
    }
    if (new Set(identities).size !== identities.length) throw new Error(`${name} manifest has duplicate source identity`);
    const targets = records.map(({ targetFamily, targetId }) => `${targetFamily}:${targetId}`);
    if (new Set(targets).size !== targets.length) throw new Error("baseline manifest has duplicate target identity");
  } else if (name === "ignore") {
    const reasonCodes = new Set(["not-for-japan", "duplicate", "superseded", "legal-hold", "launch-gated", "manual-publication", "source-quality", "other"]);
    for (const record of records) {
      for (const key of ["sourceId", "sourceCanonicalUrl", "reasonCode", "reason", "addedBy", "addedAt"]) {
        assertStringField(record, key, name, { nonEmpty: true });
      }
      if (hasOwn(record, "sourceSection")) {
        if (typeof record.sourceSection !== "string") {
          throw new Error("unsupported ignore sourceSection: value must be a string");
        }
        if (!supportedSourceSections.has(record.sourceSection)) {
          throw new Error(`unsupported ignore sourceSection: ${record.sourceSection}`);
        }
        identities.push(manifestIdentity(record, name));
      } else if (hasOwn(record, "sourceCategory")) {
        assertStringField(record, "sourceCategory", name, { nonEmpty: true });
        sourceFamily(record.sourceCategory);
      }
      if (!/^cnt_\d+$/.test(record.sourceId)) throw new Error("ignore record has invalid sourceId");
      if (!reasonCodes.has(record.reasonCode)) throw new Error(`ignore record has invalid reasonCode: ${record.reasonCode}`);
      assertUtcTimestamp(record.addedAt, "addedAt");
      if (hasOwn(record, "expiresAt")) assertUtcTimestamp(record.expiresAt, "expiresAt");
      if (normalizeUrl(record.sourceCanonicalUrl) !== record.sourceCanonicalUrl || !record.sourceCanonicalUrl.startsWith("https://")) {
        throw new Error("ignore record sourceCanonicalUrl must be normalized HTTPS");
      }
    }
    if (new Set(identities).size !== identities.length) throw new Error(`${name} manifest has duplicate source identity`);
  }

  if (records.some((record, index) => index > 0 && sortSourceRecords(records[index - 1], record) > 0)) {
    throw new Error(`${name} manifest must be sourceId-sorted`);
  }
  return records;
}

export async function readManifest(targetRepo, name) {
  const file = path.join(targetRepo, ".github/content-sync", `${name}.json`);
  return validateDecisionManifest(JSON.parse(await readFile(file, "utf8")), name);
}

function optionalHtml(directory, locale) {
  return readFile(path.join(directory, `${locale}.html`), "utf8").catch((error) => {
    if (error.code === "ENOENT") return "";
    throw error;
  });
}

export async function enumerateSources(globalRepo, { preserveQuery = false } = {}) {
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
      let sourceCanonicalError = null;
      let sourceEvidenceUrl = null;
      try {
        sourceCanonicalUrl = canonicalSourceUrl(descriptor.sourceCategory, meta, { preserveQuery });
      } catch (error) {
        sourceCanonicalError = error;
        if (meta.contentType === "outlink") {
          try {
            sourceEvidenceUrl = resolveProductionListUrl(meta.externalUrl, { preserveQuery });
          } catch {
            sourceEvidenceUrl = null;
          }
        }
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
        sourceCanonicalError,
        sourceEvidenceUrl,
      });
    }
  }
  return records;
}

export function productionSets(sitemapXml, productionListHtmlByUrl = {}, { preserveQuery = false } = {}) {
  const sitemap = new Set([...sitemapXml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((match) => normalizeUrl(match[1])));
  const listByUrl = new Map();
  for (const [listUrl, html] of Object.entries(productionListHtmlByUrl)) {
    listByUrl.set(
      normalizeUrl(listUrl),
      new Set([...String(html || "").matchAll(/href=["']([^"']+)["']/g)].map((match) =>
        resolveProductionListUrl(match[1], { preserveQuery }))),
    );
  }
  return { sitemap, listByUrl };
}

function outlinkLocale(meta) {
  return meta.title?.ja?.trim() || meta.summary?.ja?.trim() ? "ja" : "en";
}

function outlinkHasLocalizedTitleAndSummary(meta) {
  const locale = outlinkLocale(meta);
  return Boolean(meta.title?.[locale]?.trim() && meta.summary?.[locale]?.trim());
}

export function sourceContractFailure(source) {
  if (source.descriptor?.sourceSection === "news" && source.meta.section !== "news") {
    return `section must equal news: ${source.meta.section ?? ""}`;
  }
  if (source.meta.categorySlug !== source.category) {
    return `categorySlug must equal ${source.category}: ${source.meta.categorySlug ?? ""}`;
  }
  if (source.meta.status !== "published") return `status must equal published: ${source.meta.status ?? ""}`;
  if (!source.meta.contentType || !["content", "outlink"].includes(source.meta.contentType)) {
    return `contentType must be content or outlink: ${source.meta.contentType ?? ""}`;
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.meta.id || "")) return `unsafe source slug: ${source.meta.id}`;
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
  if (!source.selected?.html?.trim()) return "content requires non-empty ja.html or en.html";
  return null;
}
