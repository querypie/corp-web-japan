import { createHash } from "node:crypto";
import { readFile, realpath } from "node:fs/promises";
import path from "node:path";

import { externalMediaIdentity } from "./external-media.mjs";

function frontmatterBlock(mdx) {
  const block = /^---\n([\s\S]*?)\n---/.exec(mdx)?.[1];
  if (!block) throw new Error("MDX frontmatter is required");
  return block;
}

function frontmatterScalar(frontmatter, name) {
  return new RegExp(`^${name}:\\s*["']?([^"'\\n]+)["']?\\s*$`, "m").exec(frontmatter)?.[1]?.trim();
}

function frontmatterList(frontmatter, name) {
  const block = new RegExp(`^${name}:\\s*\\n((?:\\s+-[^\\n]+\\n?)*)`, "m").exec(frontmatter)?.[1] || "";
  return [...block.matchAll(/^\s+-\s*["']?([^"'\n]+)["']?\s*$/gm)].map((match) => match[1].trim());
}

async function exists(file) { try { await realpath(file); return true; } catch { return false; } }

export async function validateGeneratedPublication(candidate, generationReport, targetRepo = candidate.targetRepo) {
  if (!targetRepo) throw new Error("targetRepo required for generated validation");
  const mdx = await readFile(candidate.targetMdxPath, "utf8");
  if (/\/documentation\//.test(mdx)) throw new Error("unresolved /documentation/ source path");
  const allowsKorean = generationReport.intentionalTransformations?.some((item) => /korean/i.test(typeof item === "string" ? item : JSON.stringify(item)));
  if (!allowsKorean && /[\uac00-\ud7af]/u.test(mdx)) throw new Error("unresolved Korean characters");
  const frontmatter = frontmatterBlock(mdx);
  const frontmatterId = frontmatterScalar(frontmatter, "id");
  const frontmatterSlug = frontmatterScalar(frontmatter, "slug");
  if (Number(frontmatterId) !== Number(candidate.targetId)) throw new Error(`frontmatter id must equal allocated targetId ${candidate.targetId}`);
  if (frontmatterSlug !== candidate.meta.id) throw new Error(`frontmatter slug must equal source slug ${candidate.meta.id}`);
  for (const required of ["title", "description", "heroImageSrc"]) if (!frontmatterScalar(frontmatter, required)) throw new Error(`frontmatter ${required} is required`);
  if (["blog", "whitepapers", "news", "events", "use-cases"].includes(candidate.targetFamily) && !/^\d{4}-\d{2}-\d{2}$/.test(frontmatterScalar(frontmatter, "date") || "")) throw new Error("publication frontmatter date must be ISO YYYY-MM-DD");
  const author = frontmatterScalar(frontmatter, "author");
  const authorList = frontmatterList(frontmatter, "author");
  if (Array.isArray(candidate.resolvedAuthor)) {
    if (JSON.stringify(authorList) !== JSON.stringify(candidate.resolvedAuthor)) throw new Error(`frontmatter author list must equal resolved authors ${candidate.resolvedAuthor.join(", ")}`);
  } else if (candidate.resolvedAuthor && author !== candidate.resolvedAuthor) throw new Error(`frontmatter author must equal resolved author ${candidate.resolvedAuthor}`);
  if (!candidate.resolvedAuthor && (author || authorList.length)) throw new Error(`author is unsupported for ${candidate.targetFamily}`);
  if (/^hideHeroImage:/m.test(frontmatter)) throw new Error("unsupported hideHeroImage field; use hideHeroImageOnDetail");
  if (candidate.meta.hideHeroImage === true && ["blog", "whitepapers", "events", "use-cases"].includes(candidate.targetFamily) && !/^hideHeroImageOnDetail:\s*true\s*$/m.test(frontmatter)) throw new Error("source hidden-hero behavior requires hideHeroImageOnDetail: true");
  const relatedIds = frontmatterList(frontmatter, "relatedIds");
  const expectedRelatedIds = (candidate.meta.relatedIds || []).map((value) => String(value));
  if (expectedRelatedIds.length === 0) {
    if (relatedIds.length > 0 || /^relatedItems:\s*\n\s+-/m.test(frontmatter)) throw new Error("source has no related items; target must not infer them");
  } else if (JSON.stringify(relatedIds) !== JSON.stringify(expectedRelatedIds)) throw new Error(`frontmatter relatedIds must equal resolved related IDs ${expectedRelatedIds.join(", ")}`);
  if (candidate.targetFamily === "news") {
    const sourceLabel = frontmatterScalar(frontmatter, "sourceLabel");
    if (sourceLabel !== candidate.resolvedSourceLabel) throw new Error(`frontmatter sourceLabel must equal resolved sourceLabel ${candidate.resolvedSourceLabel}`);
    const redirectUrl = frontmatterScalar(frontmatter, "redirectUrl");
    if (candidate.resolvedRedirectUrl === null) {
      if (redirectUrl) throw new Error("redirectUrl must be omitted for non-outlink News");
    } else {
      if (!redirectUrl) throw new Error(`frontmatter redirectUrl must equal resolved redirectUrl ${candidate.resolvedRedirectUrl}`);
      if (!/^https:\/\//.test(redirectUrl)) throw new Error("redirectUrl must use HTTPS");
      if (redirectUrl !== candidate.resolvedRedirectUrl) throw new Error(`frontmatter redirectUrl must equal resolved redirectUrl ${candidate.resolvedRedirectUrl}`);
    }
  }
  const hero = frontmatterScalar(frontmatter, "heroImageSrc");
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
