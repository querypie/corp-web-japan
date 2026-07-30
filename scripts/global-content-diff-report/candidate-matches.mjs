import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import YAML from "yaml";

import { SOURCE_FAMILIES } from "./source-family-map.mjs";

const safeKebabSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const trackingParams = new Set([
  "guccounter",
  "guce_referrer",
  "guce_referrer_sig",
]);
const supportedTargetFamilies = Object.freeze([...new Set(SOURCE_FAMILIES.map(({ targetFamily }) => targetFamily))]);

function isTrackingParam(key) {
  return key.startsWith("utm_") || trackingParams.has(key);
}

function normalizePathname(pathname) {
  return pathname.replace(/\/+$/, "") || "/";
}

export function normalizeCandidateText(value) {
  return String(value || "").normalize("NFC").trim().replace(/\s+/g, " ");
}

export function normalizeCandidateUrl(value) {
  let url;
  try {
    url = new URL(String(value));
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  url.hash = "";
  url.hostname = url.hostname.toLowerCase();
  url.pathname = normalizePathname(url.pathname);

  const keptEntries = [...url.searchParams.entries()]
    .filter(([key]) => !isTrackingParam(key))
    .sort(([leftKey, leftValue], [rightKey, rightValue]) => leftKey.localeCompare(rightKey) || leftValue.localeCompare(rightValue));
  url.search = "";
  for (const [key, queryValue] of keptEntries) url.searchParams.append(key, queryValue);

  const href = url.toString();
  return url.pathname === "/" ? href : href.replace(/\/$/, "");
}

function parseYaml(source) {
  return YAML.parse(source);
}

async function extractFrontmatter(source, relativePath) {
  if (!source.startsWith("---\n") && !source.startsWith("---\r\n")) {
    throw new Error(`invalid MDX frontmatter: ${relativePath}`);
  }
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
  if (!match) throw new Error(`invalid MDX frontmatter: ${relativePath}`);
  try {
    const parsed = await parseYaml(match[1]);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("frontmatter must be an object");
    }
    return parsed;
  } catch (error) {
    throw new Error(`invalid MDX frontmatter: ${relativePath}: ${error.message}`);
  }
}

function assertValidRecord({ family, id, slug, relativePath }) {
  if (typeof id !== "string" || !/^[1-9]\d*$/.test(id)) {
    throw new Error(`invalid Japan target id: ${relativePath}`);
  }
  if (typeof slug !== "string" || !safeKebabSlugPattern.test(slug)) {
    throw new Error(`invalid Japan target slug: ${relativePath}`);
  }
  const contentRoot = `src/content/${family}/`;
  if (!relativePath.startsWith(contentRoot) || relativePath.split("/").includes("..") || !relativePath.endsWith(".mdx")) {
    throw new Error(`unsafe Japan target path: ${relativePath}`);
  }
}

function decodeHtmlUrlEntities(value) {
  return String(value).replace(/&amp;/gi, "&");
}

function trimUnmatchedClosingDelimiter(value, openDelimiter, closeDelimiter) {
  let balance = 0;
  for (const character of value) {
    if (character === openDelimiter) balance += 1;
    if (character === closeDelimiter) balance -= 1;
  }
  return balance < 0 && value.endsWith(closeDelimiter) ? value.slice(0, -1) : value;
}

function trimUnquotedUrlToken(value) {
  let token = String(value).trim();
  while (token) {
    const before = token;
    token = token.replace(/[.,!?;:]+$/u, "");
    token = trimUnmatchedClosingDelimiter(token, "(", ")");
    token = trimUnmatchedClosingDelimiter(token, "[", "]");
    token = trimUnmatchedClosingDelimiter(token, "{", "}");
    if (token === before) return token;
  }
  return token;
}

function extractMarkdownDestination(source, openIndex) {
  const start = openIndex + 2;
  if (!source.startsWith("https://", start)) return null;
  let depth = 0;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (character === "(") {
      depth += 1;
      continue;
    }
    if (character === ")") {
      if (depth === 0) return source.slice(start, index);
      depth -= 1;
      continue;
    }
    if (/\s/.test(character) && depth === 0) return source.slice(start, index);
  }
  return source.slice(start);
}

function extractAbsoluteHttpsUrls(source) {
  const urls = new Set();
  const addUrl = (value, { quoted = false } = {}) => {
    const candidate = quoted ? String(value).trim() : trimUnquotedUrlToken(value);
    if (!candidate.startsWith("https://")) return;
    const normalized = normalizeCandidateUrl(decodeHtmlUrlEntities(candidate));
    if (normalized) urls.add(normalized);
  };

  for (const match of source.matchAll(/\b(?:href|src)\s*=\s*(?:(['"])([\s\S]*?)\1|\{\s*(['"])([\s\S]*?)\3\s*\})/gi)) {
    addUrl(match[2] ?? match[4], { quoted: true });
  }

  for (const match of source.matchAll(/\]\(/g)) {
    const destination = extractMarkdownDestination(source, match.index);
    if (destination) addUrl(destination);
  }

  for (const match of source.matchAll(/<https:\/\/[^>\s]+>/g)) {
    addUrl(match[0].slice(1, -1));
  }

  for (const match of source.matchAll(/https:\/\/[^\s"'<>]+/g)) {
    addUrl(match[0]);
  }
  return urls;
}

function normalizeDateIso(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value !== "string") return "";
  return value.slice(0, 10);
}

async function readFamilyRecords({ targetRepo, family }) {
  const root = path.join(targetRepo, "src/content", family);
  const entries = await readdir(root, { withFileTypes: true });
  const records = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".mdx")) continue;
    const absolutePath = path.join(root, entry.name);
    const relativePath = path.relative(targetRepo, absolutePath).split(path.sep).join("/");
    const source = await readFile(absolutePath, "utf8");
    const frontmatter = await extractFrontmatter(source, relativePath);
    assertValidRecord({ family, id: frontmatter.id, slug: frontmatter.slug, relativePath });
    records.push({
      targetFamily: family,
      targetPath: relativePath,
      targetId: Number(frontmatter.id),
      targetSlug: frontmatter.slug,
      dateIso: normalizeDateIso(frontmatter.date),
      urls: extractAbsoluteHttpsUrls(source),
      normalizedSource: normalizeCandidateText(source),
    });
  }
  return records;
}

export async function indexJapanCandidateRecords({ targetRepo, targetFamilies } = {}) {
  if (!targetRepo) throw new Error("targetRepo is required");
  const families = targetFamilies || supportedTargetFamilies;
  const records = [];
  const byTargetFamily = new Map();
  const seenIdentities = new Set();
  const seenPaths = new Set();

  for (const family of families) {
    if (!supportedTargetFamilies.includes(family)) throw new Error(`unsupported target family: ${family}`);
    const familyRecords = await readFamilyRecords({ targetRepo, family });
    for (const record of familyRecords) {
      const identity = `${record.targetFamily}:${record.targetId}`;
      if (seenIdentities.has(identity)) throw new Error(`duplicate Japan target identity: ${identity}`);
      seenIdentities.add(identity);
      if (seenPaths.has(record.targetPath)) throw new Error(`duplicate Japan target path: ${record.targetPath}`);
      seenPaths.add(record.targetPath);
      records.push(record);
      if (!byTargetFamily.has(record.targetFamily)) byTargetFamily.set(record.targetFamily, []);
      byTargetFamily.get(record.targetFamily).push(record);
    }
  }

  records.sort(compareRecords);
  for (const familyRecords of byTargetFamily.values()) familyRecords.sort(compareRecords);
  return { records, byTargetFamily };
}

function compareRecords(left, right) {
  return String(left.targetPath).localeCompare(String(right.targetPath))
    || left.targetId - right.targetId
    || String(left.targetSlug).localeCompare(String(right.targetSlug));
}

function validateIndex(index) {
  if (!index || !Array.isArray(index.records) || !(index.byTargetFamily instanceof Map)) {
    throw new Error("invalid Japan candidate index");
  }
  const seenPaths = new Set();
  const seenIdentities = new Set();
  for (const record of index.records) {
    const identity = `${record.targetFamily}:${record.targetId}`;
    if (seenIdentities.has(identity)) throw new Error(`duplicate Japan target identity: ${identity}`);
    seenIdentities.add(identity);
    if (seenPaths.has(record.targetPath)) throw new Error(`duplicate Japan target path: ${record.targetPath}`);
    seenPaths.add(record.targetPath);
  }
}

export function findPossibleJapanMatches({ globalItem, japanIndex }) {
  validateIndex(japanIndex);
  const familyRecords = japanIndex.byTargetFamily.get(globalItem?.targetFamily) || [];
  const sourceSlug = String(globalItem?.sourceSlug || "");
  const sourceUrls = new Set((globalItem?.sourceUrls || []).map(normalizeCandidateUrl).filter(Boolean));
  const originalTitle = normalizeCandidateText(globalItem?.originalTitle || "");
  const dateIso = normalizeDateIso(globalItem?.dateIso || "");
  const matches = [];

  for (const record of familyRecords) {
    const signals = [];
    if (safeKebabSlugPattern.test(sourceSlug) && sourceSlug === record.targetSlug) signals.push("exact-slug");
    if ([...sourceUrls].some((url) => record.urls.has(url))) signals.push("exact-source-url");
    if (originalTitle && dateIso && record.dateIso === dateIso && record.normalizedSource.includes(originalTitle)) {
      signals.push("exact-original-title-and-date");
    }
    if (signals.length) {
      matches.push({
        targetPath: record.targetPath,
        targetId: record.targetId,
        targetSlug: record.targetSlug,
        signals: signals.sort(),
      });
    }
  }

  return matches.sort((left, right) => String(left.targetPath).localeCompare(String(right.targetPath)));
}
