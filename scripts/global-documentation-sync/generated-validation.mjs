import { createHash } from "node:crypto";
import { readFile, realpath } from "node:fs/promises";
import path from "node:path";

import { externalMediaIdentity } from "./external-media.mjs";

async function exists(file) { try { await realpath(file); return true; } catch { return false; } }

export async function validateGeneratedPublication(candidate, generationReport, targetRepo = candidate.targetRepo) {
  if (!targetRepo) throw new Error("targetRepo required for generated validation");
  const mdx = await readFile(candidate.targetMdxPath, "utf8");
  if (/\/documentation\//.test(mdx)) throw new Error("unresolved /documentation/ source path");
  const allowsKorean = generationReport.intentionalTransformations?.some((item) => /korean/i.test(typeof item === "string" ? item : JSON.stringify(item)));
  if (!allowsKorean && /[\uac00-\ud7af]/u.test(mdx)) throw new Error("unresolved Korean characters");
  const frontmatter = /^---\n([\s\S]*?)\n---/.exec(mdx)?.[1];
  if (!frontmatter) throw new Error("MDX frontmatter is required");
  const field = (name) => new RegExp(`^${name}:\\s*["']?([^"'\\n]+)["']?\\s*$`, "m").exec(frontmatter)?.[1]?.trim();
  const frontmatterId = field("id");
  const frontmatterSlug = field("slug");
  if (Number(frontmatterId) !== Number(candidate.targetId)) throw new Error(`frontmatter id must equal allocated targetId ${candidate.targetId}`);
  if (frontmatterSlug !== candidate.meta.id) throw new Error(`frontmatter slug must equal source slug ${candidate.meta.id}`);
  for (const required of ["title", "description", "heroImageSrc"]) if (!field(required)) throw new Error(`frontmatter ${required} is required`);
  if (["blog", "whitepapers", "events", "use-cases"].includes(candidate.targetFamily) && !/^\d{4}-\d{2}-\d{2}$/.test(field("date") || "")) throw new Error("publication frontmatter date must be ISO YYYY-MM-DD");
  const author = field("author");
  const authorListBlock = /^author:\s*\n((?:\s+-[^\n]+\n?)*)/m.exec(frontmatter)?.[1] || "";
  const authorList = [...authorListBlock.matchAll(/^\s+-\s*["']?([^"'\n]+)["']?\s*$/gm)].map((match) => match[1].trim());
  if (Array.isArray(candidate.resolvedAuthor)) {
    if (JSON.stringify(authorList) !== JSON.stringify(candidate.resolvedAuthor)) throw new Error(`frontmatter author list must equal resolved authors ${candidate.resolvedAuthor.join(", ")}`);
  } else if (candidate.resolvedAuthor && author !== candidate.resolvedAuthor) throw new Error(`frontmatter author must equal resolved author ${candidate.resolvedAuthor}`);
  if (!candidate.resolvedAuthor && (author || authorList.length)) throw new Error(`author is unsupported for ${candidate.targetFamily}`);
  if (/^hideHeroImage:/m.test(frontmatter)) throw new Error("unsupported hideHeroImage field; use hideHeroImageOnDetail");
  if (candidate.meta.hideHeroImage === true && ["blog", "whitepapers", "events", "use-cases"].includes(candidate.targetFamily) && !/^hideHeroImageOnDetail:\s*true\s*$/m.test(frontmatter)) throw new Error("source hidden-hero behavior requires hideHeroImageOnDetail: true");
  if ((candidate.meta.relatedIds || []).length === 0) {
    if (/^relatedIds:\s*\n\s+-/m.test(frontmatter) || /^relatedItems:\s*\n\s+-/m.test(frontmatter)) throw new Error("source has no related items; target must not infer them");
  }
  const hero = /^heroImageSrc:\s*["']?([^"'\n]+)["']?\s*$/m.exec(mdx)?.[1];
  if (!hero?.endsWith(".png")) throw new Error("effective heroImageSrc must be PNG");
  if (hero !== candidate.heroImagePublicPath) throw new Error(`heroImageSrc is not the allocated hero: ${hero}`);
  if (!await exists(path.join(targetRepo, "public", hero.replace(/^\//, "")))) throw new Error(`missing hero asset: ${hero}`);
  const allowedMedia = new Set((candidate.externalMedia || []).map(({ identity }) => identity));
  for (const match of mdx.matchAll(/<(?:iframe|video|source|Youtube)[^>]+src=["']([^"']+)["']/g)) {
    if (!/^https:\/\//.test(match[1])) continue;
    const identity = externalMediaIdentity(match[1]);
    if (!allowedMedia.has(identity)) throw new Error(`external media is not source-approved: ${match[1]}`);
    const url = new URL(match[1]);
    if (/youtube\.com$/.test(url.hostname) && !url.pathname.startsWith("/embed/")) throw new Error(`YouTube iframe must use embed URL: ${match[1]}`);
  }
  const imageTags = [...mdx.matchAll(/<(?:img|Image|ArticleFileImage)\b[\s\S]*?>/gi)].map((match) => match[0]);
  if (imageTags.some((tag) => /https:\/\//i.test(tag)) || /!\[[^\]]*\]\(\s*https:\/\//i.test(mdx) || /url\(\s*["']?https:\/\//i.test(mdx) || /\bposter\s*=\s*(?:\{\s*)?["']https:\/\//i.test(mdx)) throw new Error("remote images are not allowed; copy source-owned media locally");
  const prefix = `/${candidate.targetFamily}/${candidate.targetId}/`;
  const allowedAssets = new Set([candidate.heroImagePublicPath, ...candidate.assets.map(({ targetPublicPath }) => targetPublicPath)].filter(Boolean));
  const references = [...new Set([...mdx.matchAll(/(?:\/|public\/)[A-Za-z0-9._/-]+\.(?:png|jpe?g|gif|webp|svg|pdf|mp4|webm)/gi)].map((match) => match[0].replace(/^public\//, "/")))];
  for (const reference of references) {
    if (!reference.startsWith(prefix)) throw new Error(`cross-publication asset reference is not allowed: ${reference}`);
    if (!allowedAssets.has(reference)) throw new Error(`local asset is not source-allocated: ${reference}`);
    if (!await exists(path.join(targetRepo, "public", reference.slice(1)))) throw new Error(`missing local asset: ${reference}`);
  }
  for (const asset of candidate.assets) {
    const bytes = await readFile(asset.targetPath);
    const hash = createHash("sha256").update(bytes).digest("hex");
    if (hash !== asset.sha256) throw new Error(`copied asset hash mismatch: ${asset.targetPath}`);
  }
  return { status: "passed", references, koreanException: allowsKorean };
}
