#!/usr/bin/env node
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

import { SOURCE_FAMILIES } from "./source-family-map.mjs";
import { sortSourceRecords, sourceIdentityKey } from "./sync-identity.mjs";

function args(argv) {
  const value = {};
  for (let i = 0; i < argv.length; i += 2) value[argv[i].slice(2)] = argv[i + 1];
  return value;
}

function frontmatter(source) {
  const block = /^---\n([\s\S]*?)\n---/.exec(source)?.[1] || "";
  const field = (name) => new RegExp(`^${name}:\\s*["']?([^"'\\n]+)["']?\\s*$`, "m").exec(block)?.[1]?.trim();
  return { id: Number(field("id")), slug: field("slug"), title: field("title"), hidden: /^hidden:\s*true\s*$/m.test(block), primaryLinks: [...source.matchAll(/<ButtonLink\s+href=["']([^"']+)["']/g)].map((match) => match[1]) };
}

function localeNeutralUrl(value) {
  try {
    const url = new URL(value);
    url.pathname = url.pathname.replace(/^\/(en|ja|ko)(?=\/|$)/, "/:locale");
    return `${url.origin}${url.pathname.replace(/\/$/, "")}`;
  } catch { return null; }
}

async function targetRecords(targetRepo, family) {
  const root = path.join(targetRepo, "src/content", family);
  const records = [];
  let names = [];
  try { names = await readdir(root); } catch (error) { if (error.code === "ENOENT") return records; throw error; }
  for (const name of names.filter((item) => item.endsWith(".mdx"))) {
    const meta = frontmatter(await readFile(path.join(root, name), "utf8"));
    if (Number.isInteger(meta.id) && meta.slug) records.push(meta);
  }
  return records;
}

async function sourceRecords(globalRepo, descriptor) {
  const root = path.join(globalRepo, descriptor.relativeRoot);
  let entries = [];
  try { entries = await readdir(root); } catch (error) { if (error.code === "ENOENT") return []; throw error; }
  const records = [];
  for (const sourceId of entries) {
    if (!/^cnt_\d+$/.test(sourceId)) continue;
    const directory = path.join(root, sourceId);
    const meta = JSON.parse(await readFile(path.join(directory, "meta.json"), "utf8"));
    records.push({ sourceId, meta });
  }
  records.sort((a, b) => a.sourceId.localeCompare(b.sourceId));
  return records;
}

function matchTargets(targets, meta) {
  const title = meta.title?.ja?.trim();
  let matches = [];
  if (meta.contentType === "outlink" && meta.externalUrl) {
    const external = localeNeutralUrl(meta.externalUrl);
    matches = targets.filter((target) => target.primaryLinks.some((link) => localeNeutralUrl(link) === external));
  }
  if (matches.length === 0) matches = targets.filter((target) => target.slug === meta.id);
  if (matches.length > 1 && title) {
    const titled = matches.filter((target) => target.title === title);
    if (titled.length) matches = titled;
  }
  if (matches.length === 0 && title) matches = targets.filter((target) => target.title === title);
  if (matches.length > 1) {
    const visible = matches.filter((target) => !target.hidden);
    if (visible.length) matches = visible;
  }
  return matches;
}

function baselineIdentity(record) {
  return sourceIdentityKey({ sourceSection: record.sourceSection, sourceId: record.sourceId });
}

function assertUniqueTargets(baseline) {
  const seenSource = new Set();
  const seenTarget = new Set();
  for (const record of baseline) {
    const sourceKey = baselineIdentity(record);
    if (seenSource.has(sourceKey)) throw new Error(`duplicate baseline source identity: ${sourceKey}`);
    seenSource.add(sourceKey);
    const targetKey = `${record.targetFamily}:${record.targetId}`;
    if (seenTarget.has(targetKey)) throw new Error(`duplicate baseline target identity: ${targetKey}`);
    seenTarget.add(targetKey);
  }
}

export function mergeBaselineRecords(existingBaseline, generatedBaseline) {
  const bySourceIdentity = new Map(existingBaseline.map((record) => [baselineIdentity({ ...record, sourceSection: record.sourceSection || SOURCE_FAMILIES.find((descriptor) => descriptor.sourceCategory === record.sourceCategory)?.sourceSection }), record]));
  for (const record of generatedBaseline) bySourceIdentity.set(baselineIdentity(record), record);
  const merged = [...bySourceIdentity.values()].sort(sortSourceRecords);
  assertUniqueTargets(merged.map((record) => ({ ...record, sourceSection: record.sourceSection || SOURCE_FAMILIES.find((descriptor) => descriptor.sourceCategory === record.sourceCategory)?.sourceSection })));
  return merged;
}

export async function generateBaseline(globalRepo, targetRepo) {
  const byFamily = new Map();
  const baseline = [];
  const ambiguous = [];
  for (const descriptor of SOURCE_FAMILIES) {
    const family = descriptor.targetFamily;
    if (!byFamily.has(family)) byFamily.set(family, await targetRecords(targetRepo, family));
    for (const { sourceId, meta } of await sourceRecords(globalRepo, descriptor)) {
      const matches = matchTargets(byFamily.get(family), meta);
      if (matches.length === 1) baseline.push({ sourceSection: descriptor.sourceSection, sourceId, sourceCategory: descriptor.sourceCategory, sourceSlug: meta.id, targetFamily: family, targetId: matches[0].id, targetSlug: matches[0].slug });
      else if (matches.length > 1) ambiguous.push({ sourceId, category: descriptor.sourceCategory, slug: meta.id, matches });
    }
  }
  baseline.sort(sortSourceRecords);
  assertUniqueTargets(baseline);
  return { baseline, ambiguous };
}

const options = args(process.argv.slice(2));
if (options["global-repo"] && options["target-repo"]) {
  const result = await generateBaseline(options["global-repo"], options["target-repo"]);
  if (result.ambiguous.length) throw new Error(`ambiguous baseline mappings: ${JSON.stringify(result.ambiguous)}`);
  const output = options.output || path.join(options["target-repo"], ".github/content-sync/baseline.json");
  const baselineLedger = path.join(options["target-repo"], ".github/content-sync/baseline.json");
  const existingBaseline = existsSync(baselineLedger) ? JSON.parse(await readFile(baselineLedger, "utf8")) : [];
  const mergedBaseline = mergeBaselineRecords(existingBaseline, result.baseline);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(mergedBaseline, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ output, count: mergedBaseline.length, generatedCount: result.baseline.length })}\n`);
}
