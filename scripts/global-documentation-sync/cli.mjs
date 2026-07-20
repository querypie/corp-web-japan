#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { inspectOwnedAsset } from "./asset-inspection.mjs";
import { publicationRoute } from "./browser-qa.mjs";
import { extractAllowedExternalMedia } from "./external-media.mjs";
import { fetchTextWithRetry } from "./fetch-retry.mjs";
import {
  SCHEMA_VERSION, allocateTargetId, chooseLocale, hasBlockingFindings,
  hasExactProductionEvidence, mapCategory, normalizeUrl, resolveOwnedAsset, validateArtifact,
} from "./lib.mjs";
import { discoverLive } from "./live-discovery.mjs";
import { resumeBranchOnly } from "./git-pr.mjs";
import { redactSecrets } from "./redaction.mjs";
import { revalidateRemoteBranch } from "./revalidate-branch.mjs";

export function parseArgs(argv) {
  const args = { dryRun: false, productionCheck: true };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--dry-run") args.dryRun = true;
    else if (token === "--skip-production-check") args.productionCheck = false;
    else if (token.startsWith("--")) args[token.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = argv[++index];
    else if (!args.command) args.command = token;
    else throw new Error(`unexpected argument: ${token}`);
  }
  return args;
}

async function writeJsonAtomic(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  await rename(temporary, file);
}

async function findSource(globalRepo, sourceId) {
  const root = path.join(globalRepo, "src/content/documentation");
  for (const category of await readdir(root)) {
    const directory = path.join(root, category, sourceId);
    try {
      const meta = JSON.parse(await readFile(path.join(directory, "meta.json"), "utf8"));
      return { category, directory, meta };
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  throw new Error(`source not found: ${sourceId}`);
}

function canonicalUrl(category, meta) {
  if (meta.contentType === "outlink") {
    const external = new URL(meta.externalUrl);
    if (external.protocol !== "https:") throw new Error("outlink must use HTTPS");
    return external.href;
  }
  const section = {
    blogs: "blog", "white-papers": "white-paper", events: "events",
    manuals: "manual", glossary: "glossary", voc: "customer-story",
    introduction: "introduction",
  }[category];
  return `https://www.querypie.com/en/${section}/${meta.id}`;
}

async function verifyProduction(category, meta) {
  const expected = normalizeUrl(canonicalUrl(category, meta));
  const [sitemap, list] = await Promise.all([
    fetchTextWithRetry("https://www.querypie.com/sitemap.xml"),
    fetchTextWithRetry("https://www.querypie.com/en/documentation"),
  ]);
  const listUrls = [...list.matchAll(/href=["']([^"']+)["']/g)].map((match) => normalizeUrl(new URL(match[1], "https://www.querypie.com").href));
  if (meta.contentType === "outlink") {
    if (!listUrls.includes(expected)) throw new Error(`exact production list evidence missing for ${expected}`);
    return { canonicalUrl: expected, sitemap: false, documentationList: true };
  }
  if (!hasExactProductionEvidence({ sitemapXml: sitemap, documentationListHtml: list, expectedUrl: expected })) throw new Error(`exact production evidence missing for ${expected}`);
  return { canonicalUrl: expected, sitemap: true, documentationList: true };
}

async function resolveAuthor(targetRepo, family, authorName) {
  if (!["blog", "whitepapers", "events"].includes(family)) return null;
  if (!authorName?.trim()) return family === "events" ? "querypie" : null;
  const source = await readFile(path.join(targetRepo, "src/content/authors/ja.yaml"), "utf8");
  const authors = [...source.matchAll(/^- id:\s*([^\s]+)\n\s+name:\s*(.+)$/gm)].map((match) => ({ id: match[1].trim(), name: match[2].trim().replace(/^['"]|['"]$/g, "") }));
  const names = authorName.split(",").map((name) => name.trim()).filter(Boolean);
  const resolved = names.map((name) => {
    const matches = authors.filter((author) => author.name === name || author.name.startsWith(`${name} `));
    if (matches.length !== 1) throw new Error(`author must resolve exactly once: ${name}`);
    return matches[0].id;
  });
  return resolved.length === 1 ? resolved[0] : resolved;
}

export function assetHrefs(meta, html) {
  const values = [
    meta.imageSrc, meta.downloadCoverImageSrc, meta.downloadPdfSrc,
    ...Object.values(meta.downloadPdfSrcByLocale || {}),
  ];
  for (const match of html.matchAll(/(?:src|href|poster)=["']([^"']+)["']/g)) values.push(match[1]);
  for (const match of html.matchAll(/srcset=["']([^"']+)["']/g)) {
    for (const source of match[1].split(",")) values.push(source.trim().split(/\s+/)[0]);
  }
  return [...new Set(values.filter((value) => typeof value === "string" && /^\/[^?#]+\.(?:webp|png|jpe?g|gif|pdf|mp4|webm)(?:[?#].*)?$/i.test(value)))];
}

export async function prepare(options) {
  if (!options.dryRun) throw new Error("first implementation supports --dry-run only");
  for (const key of ["sourceId", "globalRepo", "targetRepo", "reportsDir"]) if (!options[key]) throw new Error(`--${key} required`);
  if (!/^cnt_\d+$/.test(options.sourceId)) throw new Error("invalid sourceId");
  const { category, directory, meta } = await findSource(options.globalRepo, options.sourceId);
  if (meta.storageId !== options.sourceId || meta.categorySlug !== category || meta.status !== "published" || !["content", "outlink"].includes(meta.contentType)) throw new Error("source metadata is not eligible");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.id || "")) throw new Error("source slug is unsafe");
  const readOptional = async (name) => { try { return await readFile(path.join(directory, name), "utf8"); } catch (error) { if (error.code === "ENOENT") return ""; throw error; } };
  let selected;
  let sourceHtmlPath;
  if (meta.contentType === "outlink") {
    const locale = meta.title?.ja?.trim() || meta.summary?.ja?.trim() ? "ja" : "en";
    const title = meta.title?.[locale]?.trim();
    const summary = meta.summary?.[locale]?.trim();
    if (!title || !summary || !/^https:\/\//.test(meta.externalUrl || "")) throw new Error("outlink requires localized title/summary and HTTPS externalUrl");
    selected = { locale, html: `<h1>${title}</h1>\n<p>${summary}</p>\n<a href="${meta.externalUrl}">${title}</a>` };
    sourceHtmlPath = path.join(options.reportsDir, "source.html");
  } else {
    selected = chooseLocale({ jaHtml: await readOptional("ja.html"), enHtml: await readOptional("en.html") });
    sourceHtmlPath = path.join(directory, `${selected.locale}.html`);
  }
  if ((meta.contentType === "outlink" && redactSecrets(selected.html) !== selected.html) || JSON.stringify(redactSecrets(meta)) !== JSON.stringify(meta)) throw new Error("source metadata contains secret-like values and requires manual curation");
  if (meta.contentType === "outlink") {
    await mkdir(options.reportsDir, { recursive: true });
    await writeFile(sourceHtmlPath, `${selected.html}\n`, { mode: 0o600 });
  }
  const family = mapCategory(category);
  const reservedTargetIds = options.reservedTargetIds ? options.reservedTargetIds.split(",").filter(Boolean).map(Number) : [];
  const targetId = options.targetId ? Number(options.targetId) : await allocateTargetId(options.targetRepo, family, reservedTargetIds);
  if (!Number.isInteger(targetId) || targetId <= 0) throw new Error("targetId must be a positive integer");
  let production;
  if (options.productionEvidenceFile) {
    const evidence = JSON.parse(await readFile(options.productionEvidenceFile, "utf8"));
    if (evidence.sourceId !== options.sourceId || evidence.production?.canonicalUrl !== normalizeUrl(canonicalUrl(category, meta)) || !evidence.production.documentationList || (meta.contentType === "content" && !evidence.production.sitemap)) throw new Error("production discovery evidence mismatch");
    production = evidence.production;
  } else production = options.productionCheck ? await verifyProduction(category, meta) : { skipped: true };
  const resolvedAuthor = await resolveAuthor(options.targetRepo, family, meta.authorName);
  const targetContentRoot = path.join(options.targetRepo, "src/content", family);
  const targetAssetRoot = path.join(options.targetRepo, "public", family, String(targetId));
  if (options.resetTarget === "true") {
    await rm(targetAssetRoot, { recursive: true, force: true });
    for (const file of await readdir(targetContentRoot)) if (new RegExp(`^${targetId}-.+\\.mdx$`).test(file)) await rm(path.join(targetContentRoot, file));
  }
  await mkdir(targetAssetRoot, { recursive: true });
  const assets = [];
  const targetNames = new Map();
  for (const href of assetHrefs(meta, selected.html)) {
    const asset = await inspectOwnedAsset(await resolveOwnedAsset(options.globalRepo, href));
    const previousHash = targetNames.get(asset.fileName);
    if (previousHash && previousHash !== asset.sha256) throw new Error(`asset basename collision: ${asset.fileName}`);
    targetNames.set(asset.fileName, asset.sha256);
    const targetPath = path.join(targetAssetRoot, asset.fileName);
    await copyFile(asset.sourcePath, targetPath);
    assets.push({ ...asset, targetPath, targetPublicPath: `/${family}/${targetId}/${asset.fileName}` });
  }
  let heroImagePath = null;
  if (meta.imageSrc) {
    const hero = assets.find(({ href }) => href === meta.imageSrc);
    if (!hero) throw new Error("hero image is missing from copied asset manifest");
    heroImagePath = path.join(targetAssetRoot, "thumbnail.png");
    const ffmpeg = spawnSync("ffmpeg", ["-loglevel", "error", "-y", "-i", hero.sourcePath, heroImagePath], { encoding: "utf8" });
    if (ffmpeg.status !== 0) {
      const sips = spawnSync("sips", ["-s", "format", "png", hero.sourcePath, "--out", heroImagePath], { encoding: "utf8" });
      if (sips.status !== 0) throw new Error(`hero PNG conversion failed: ${ffmpeg.stderr || sips.stderr}`);
    }
  }
  const sourceHash = `sha256:${createHash("sha256").update(JSON.stringify({ meta, html: selected.html, assets: assets.map(({ href, sha256 }) => ({ href, sha256 })) })).digest("hex")}`;
  const runId = options.runId || `local-${Date.now()}`;
  const candidate = {
    schemaVersion: SCHEMA_VERSION, artifactType: "candidate", runId,
    startedAt: new Date().toISOString(),
    sourceId: options.sourceId, sourceHash, sourceCategory: category,
    targetFamily: family, targetId, sourceLocale: selected.locale,
    sourceHtmlPath,
    targetMdxPath: path.join(targetContentRoot, `${targetId}-${meta.id}.mdx`),
    targetAssetRoot, heroImagePath,
    heroImagePublicPath: heroImagePath ? `/${family}/${targetId}/thumbnail.png` : null,
    production, meta, resolvedAuthor, assets,
    externalMedia: extractAllowedExternalMedia(selected.html),
  };
  candidate.targetRoute = publicationRoute(candidate);
  validateArtifact("candidate", candidate);
  const candidatePath = path.join(options.reportsDir, "candidate.json");
  await writeJsonAtomic(candidatePath, candidate);
  return { candidate, candidatePath };
}

export async function finalize({ reportsDir }) {
  const candidate = JSON.parse(await readFile(path.join(reportsDir, "candidate.json"), "utf8"));
  validateArtifact("candidate", candidate);
  const artifacts = {};
  for (const type of ["generation-report", "fidelity-review", "japanese-editorial-review", "contract-review", "validation-results", "browser-results"]) {
    const value = JSON.parse(await readFile(path.join(reportsDir, `${type}.json`), "utf8"));
    validateArtifact(type, value);
    if (value.runId !== candidate.runId || value.sourceId !== candidate.sourceId) throw new Error(`${type}: candidate identity mismatch`);
    if (type.endsWith("review") && (value.verdict !== "pass" || value.findings.some(({ severity }) => severity !== "note") || hasBlockingFindings(value))) throw new Error(`${type} has unresolved actionable findings`);
    artifacts[type] = value;
  }
  const finishedAt = new Date().toISOString();
  const summary = {
    schemaVersion: SCHEMA_VERSION, artifactType: "run-summary", runId: candidate.runId,
    sourceId: candidate.sourceId, targetFamily: candidate.targetFamily, targetId: candidate.targetId,
    status: "dry_run_passed", dryRun: true, committed: false, pushed: false, pullRequestUrl: null,
    exitCode: 0, startedAt: candidate.startedAt, finishedAt,
    durationMs: Math.max(0, Date.parse(finishedAt) - Date.parse(candidate.startedAt)),
    commands: artifacts["validation-results"].results.map(({ command, code }) => ({ command, code })),
    changedFiles: [...new Set([candidate.targetMdxPath, candidate.heroImagePath, ...candidate.assets.map(({ targetPath }) => targetPath)].filter(Boolean))],
    reviews: ["fidelity-review", "japanese-editorial-review", "contract-review"].map((type) => ({ type, verdict: artifacts[type].verdict, findings: artifacts[type].findings.length })),
    browser: artifacts["browser-results"].results.map(({ viewport, status, findings }) => ({ viewport, status, findings })),
  };
  validateArtifact("run-summary", summary);
  await writeJsonAtomic(path.join(reportsDir, "run-summary.json"), summary);
  return summary;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const result = options.command === "discover" ? await discoverLive({ globalRepo: options.globalRepo, targetRepo: options.targetRepo, githubRepo: options.githubRepo })
    : options.command === "resume-branch-only" ? await resumeBranchOnly({
        targetRepo: options.targetRepo, sourceId: options.sourceId, reportsDir: options.reportsDir, githubRepo: options.githubRepo,
        revalidate: ({ branch, candidate, reportsDir }) => revalidateRemoteBranch({ baseRepo: options.targetRepo, branch, worktreesRoot: options.worktreesRoot, reportsDir, candidate, port: Number(options.port || 43159) }),
      })
      : options.command === "prepare" ? await prepare(options)
      : options.command === "finalize" ? await finalize(options)
        : (() => { throw new Error("command must be discover, resume-branch-only, prepare, or finalize"); })();
  process.stdout.write(`${JSON.stringify({ event: options.command, result })}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((error) => {
  process.stderr.write(`${JSON.stringify({ event: "failed", message: redactSecrets(error.message) })}\n`);
  process.exitCode = 1;
});
