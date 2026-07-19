#!/usr/bin/env node
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { mapCategory } from "./lib.mjs";

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

export async function generateBaseline(globalRepo, targetRepo) {
  const sourceRoot = path.join(globalRepo, "src/content/documentation");
  const byFamily = new Map();
  const baseline = [];
  const ambiguous = [];
  for (const category of await readdir(sourceRoot)) {
    let family;
    try { family = mapCategory(category); } catch { continue; }
    if (!byFamily.has(family)) byFamily.set(family, await targetRecords(targetRepo, family));
    for (const sourceId of await readdir(path.join(sourceRoot, category))) {
      if (!/^cnt_\d+$/.test(sourceId)) continue;
      const meta = JSON.parse(await readFile(path.join(sourceRoot, category, sourceId, "meta.json"), "utf8"));
      const title = meta.title?.ja?.trim();
      let matches = [];
      if (meta.contentType === "outlink" && meta.externalUrl) {
        const external = localeNeutralUrl(meta.externalUrl);
        matches = byFamily.get(family).filter((target) => target.primaryLinks.some((link) => localeNeutralUrl(link) === external));
      }
      if (matches.length === 0) matches = byFamily.get(family).filter((target) => target.slug === meta.id);
      if (matches.length > 1 && title) {
        const titled = matches.filter((target) => target.title === title);
        if (titled.length) matches = titled;
      }
      if (matches.length > 1) {
        const visible = matches.filter((target) => !target.hidden);
        if (visible.length) matches = visible;
      }
      if (matches.length === 0 && title) matches = byFamily.get(family).filter((target) => target.title === title && !target.hidden);
      if (matches.length === 1) baseline.push({ sourceId, sourceCategory: category, sourceSlug: meta.id, targetFamily: family, targetId: matches[0].id, targetSlug: matches[0].slug });
      else if (matches.length > 1) ambiguous.push({ sourceId, category, slug: meta.id, matches });
    }
  }
  baseline.sort((a, b) => a.sourceId.localeCompare(b.sourceId));
  return { baseline, ambiguous };
}

const options = args(process.argv.slice(2));
if (options["global-repo"] && options["target-repo"]) {
  const result = await generateBaseline(options["global-repo"], options["target-repo"]);
  if (result.ambiguous.length) throw new Error(`ambiguous baseline mappings: ${JSON.stringify(result.ambiguous)}`);
  const output = options.output || path.join(options["target-repo"], ".github/content-sync/baseline.json");
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(result.baseline, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ output, count: result.baseline.length })}\n`);
}
