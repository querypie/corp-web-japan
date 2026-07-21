import { createHash } from "node:crypto";
import { readdir, readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";

import { sourceFamily, targetFamily } from "./source-family-map.mjs";

export const SCHEMA_VERSION = "global-documentation-sync/v1";
export const SEVERITIES = new Set(["critical", "major", "minor", "note"]);

export function mapCategory(category) {
  return targetFamily(category);
}

export function chooseLocale({ jaHtml, enHtml }) {
  if (jaHtml?.trim()) return { locale: "ja", html: jaHtml.trim() };
  if (enHtml?.trim()) return { locale: "en", html: enHtml.trim() };
  throw new Error("missing Japanese and English locale body");
}

export function normalizeUrl(value) {
  const url = new URL(value);
  url.search = "";
  url.hash = "";
  url.hostname = url.hostname.toLowerCase();
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";
  return url.toString().replace(/\/$/, url.pathname === "/" ? "/" : "");
}

export function hasExactProductionEvidence({ sitemapXml, productionListHtml, expectedUrl }) {
  const expected = normalizeUrl(expectedUrl);
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((match) => normalizeUrl(match[1]));
  const listUrls = [...productionListHtml.matchAll(/href=["']([^"']+)["']/g)].map((match) => normalizeUrl(new URL(match[1], "https://www.querypie.com").href));
  return sitemapUrls.includes(expected) && listUrls.includes(expected);
}

export function validateArtifact(type, value) {
  if (!value || typeof value !== "object") throw new Error(`${type}: object required`);
  for (const key of ["schemaVersion", "artifactType", "runId", "sourceId"]) {
    if (!value[key]) throw new Error(`${type}: ${key} required`);
  }
  if (value.schemaVersion !== SCHEMA_VERSION) throw new Error(`${type}: invalid schemaVersion`);
  if (value.artifactType !== type) throw new Error(`${type}: artifactType mismatch`);
  if (type === "candidate") {
    for (const key of ["sourceHash", "sourceCategory", "sourceSection", "targetFamily", "targetId", "sourceLocale", "sourceHtmlPath", "targetMdxPath", "targetAssetRoot", "targetRoute", "meta", "assets", "externalMedia", "production"]) {
      if (value[key] === undefined || value[key] === null) throw new Error(`${type}: ${key} required`);
    }
    if (!/^sha256:[a-f0-9]{64}$/.test(value.sourceHash)) throw new Error(`${type}: sourceHash must be sha256-prefixed`);
    if (!Array.isArray(value.assets)) throw new Error(`${type}: assets must be an array`);
    if (value.production?.skipped !== true) {
      for (const key of ["canonicalUrl", "listUrl", "listed", "sitemap"]) {
        if (value.production?.[key] === undefined) throw new Error(`${type}: production.${key} required`);
      }
      if (value.production.listed !== true) throw new Error(`${type}: production.listed must be true`);
      if (typeof value.production.listUrl !== "string") throw new Error(`${type}: production.listUrl required`);
      const descriptor = sourceFamily(value.sourceCategory);
      if (normalizeUrl(value.production.listUrl) !== normalizeUrl(descriptor.productionListUrl)) throw new Error(`${type}: production.listUrl mismatch`);
      const expectsSitemap = value.meta?.contentType === "content";
      if (value.production.sitemap !== expectsSitemap) throw new Error(`${type}: production.sitemap must be ${expectsSitemap}`);
    }
    if (value.targetFamily === "news") {
      if (typeof value.resolvedSourceLabel !== "string" || !value.resolvedSourceLabel) throw new Error(`${type}: resolvedSourceLabel required`);
      const expectsRedirect = value.meta?.contentType === "outlink";
      if (expectsRedirect && typeof value.resolvedRedirectUrl !== "string") throw new Error(`${type}: resolvedRedirectUrl required`);
      if (!expectsRedirect && value.resolvedRedirectUrl !== null) throw new Error(`${type}: resolvedRedirectUrl must be null`);
    }
  }
  if (type === "generation-report") {
    if (!Array.isArray(value.targetFiles) || !value.inventories || !Array.isArray(value.intentionalTransformations)) throw new Error(`${type}: targetFiles, inventories, and intentionalTransformations required`);
  }
  if (type.endsWith("review")) {
    if (!["pass", "revise"].includes(value.verdict) || !Array.isArray(value.findings)) throw new Error(`${type}: verdict and findings required`);
    for (const finding of value.findings) {
      if (!SEVERITIES.has(finding.severity)) throw new Error(`${type}: invalid severity`);
      if (!finding.message) throw new Error(`${type}: finding message required`);
    }
  }
  if (type === "validation-results") {
    if (!Array.isArray(value.results) || value.results.some(({ code }) => code !== 0)) throw new Error(`${type}: every validation command must pass`);
  }
  if (type === "browser-results") {
    if (!Array.isArray(value.results) || value.results.length !== 2 || value.results.some(({ status }) => status !== "passed")) throw new Error(`${type}: desktop and mobile must pass`);
  }
  if (type === "run-summary") {
    const validDryRun = value.dryRun === true && value.committed === false && value.pushed === false && value.pullRequestUrl === null;
    const validPublished = value.dryRun === false && value.committed === true && value.pushed === true && /^https:\/\//.test(value.pullRequestUrl || "");
    if (!validDryRun && !validPublished) throw new Error(`${type}: invalid mutation flags`);
  }
  return value;
}

export function hasBlockingFindings(review) {
  return review.findings.some(({ severity }) => severity === "critical" || severity === "major");
}

export function assertDryRunOperation(operation) {
  throw new Error(`dry-run forbids ${operation}`);
}

const MIME = new Map([
  [".webp", "image/webp"], [".png", "image/png"], [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"], [".gif", "image/gif"], [".pdf", "application/pdf"],
  [".mp4", "video/mp4"], [".webm", "video/webm"],
]);

export async function resolveOwnedAsset(globalRepo, href) {
  const urlPath = decodeURIComponent(new URL(href, "https://source.invalid").pathname);
  if (urlPath.split("/").includes("..")) {
    throw new Error(`unsafe source asset path: ${href}`);
  }
  const extension = path.extname(urlPath).toLowerCase();
  if (!MIME.has(extension)) throw new Error(`unsupported asset type: ${extension}`);
  const publicRoot = await realpath(path.join(globalRepo, "public"));
  const candidate = path.join(globalRepo, "public", urlPath);
  let resolved;
  try {
    resolved = await realpath(candidate);
  } catch {
    throw new Error(`missing source asset: ${href}`);
  }
  if (resolved !== publicRoot && !resolved.startsWith(`${publicRoot}${path.sep}`)) {
    throw new Error(`asset resolves outside Global public root: ${href}`);
  }
  const bytes = await readFile(resolved);
  return {
    href: urlPath,
    sourcePath: resolved,
    fileName: path.basename(resolved),
    bytes: bytes.length,
    mime: MIME.get(extension),
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
}

export async function allocateTargetId(targetRepo, targetFamily, reservedIds = []) {
  const directory = path.join(targetRepo, "src/content", targetFamily);
  let names = [];
  try { names = await readdir(directory); } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  let maximum = reservedIds.reduce((value, id) => Math.max(value, Number(id) || 0), 0);
  for (const name of names.filter((item) => item.endsWith(".mdx"))) {
    const match = /^(\d+)-/.exec(name);
    if (match) maximum = Math.max(maximum, Number(match[1]));
    else {
      const body = await readFile(path.join(directory, name), "utf8");
      const id = /^id:\s*(\d+)\s*$/m.exec(body);
      if (id) maximum = Math.max(maximum, Number(id[1]));
    }
  }
  return maximum + 1;
}

export async function fileExists(file) {
  try { await stat(file); return true; } catch { return false; }
}
