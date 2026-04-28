import * as fs from "node:fs";
import { getDisplayableArticleAuthors, resolveArticleAuthors } from "@/lib/authors/resolve-authors";
import {
  getWhitepaperPublicationRecord,
  listWhitepaperPublicationIds,
  listWhitepaperPublicationParams,
  whitepaperPublicationRecords,
} from "@/content/publications/whitepapers";
import { buildGatingContentKey, splitMdxSourceAtGatingCut, stripFrontmatterBlock } from "@/lib/publications/gating";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { extractHeadingsFromMdx } from "@/lib/publications/mdx/headings";
import { renderPublicationMdx } from "@/lib/publications/mdx/renderer";
import type { PublicationPost, PublicationPostSummary } from "@/lib/publications/types";

function readWhitepaperPublicationBodySource(sourcePath: string) {
  return fs.readFileSync(sourcePath, "utf8");
}

function buildRelatedItems(id: string, relatedIds: readonly string[]): PublicationPostSummary[] {
  const recordsById = new Map(whitepaperPublicationRecords.map((record) => [record.id, record]));
  const preferredIds = relatedIds.length > 0 ? relatedIds : whitepaperPublicationRecords.map((record) => record.id);

  return preferredIds
    .filter((relatedId) => relatedId !== id)
    .map((relatedId) => recordsById.get(relatedId) ?? null)
    .filter((record) => record !== null)
    .slice(0, 3)
    .map((record) => ({
      href: getWhitepaperPublicationHref(record.id, record.slug),
      imageSrc: record.heroImageSrc,
      title: record.title,
      date: record.date,
    }));
}

export { getWhitepaperPublicationRecord, listWhitepaperPublicationIds, listWhitepaperPublicationParams };

export async function getWhitepaperPublicationPost(id: string): Promise<PublicationPost | null> {
  const record = getWhitepaperPublicationRecord(id);
  if (!record) {
    return null;
  }

  const bodySource = readWhitepaperPublicationBodySource(record.sourcePath);
  const splitSource = splitMdxSourceAtGatingCut(bodySource);
  const previewEvaluation = await renderPublicationMdx<{
    author?: string | string[];
    relatedIds?: readonly string[];
    title: string;
    description: string;
    date: string;
    heroImageSrc: string;
    gated?: boolean;
  }>(splitSource.previewSource);
  const frontmatter = previewEvaluation.frontmatter;
  const isGated = Boolean(frontmatter.gated);

  const fullEvaluation = !isGated && splitSource.gatedSource
    ? await renderPublicationMdx<{
        author?: string | string[];
        relatedIds?: readonly string[];
        title: string;
        description: string;
        date: string;
        heroImageSrc: string;
        gated?: boolean;
      }>(bodySource)
    : null;

  const gatedEvaluation = isGated && splitSource.gatedSource
    ? await renderPublicationMdx(stripFrontmatterBlock(splitSource.gatedSource), { parseFrontmatter: false })
    : null;

  if (isGated && !splitSource.gatedSource) {
    throw new Error(`Whitepaper ${id} is gated but missing <GatingCut /> in ${record.sourcePath}`);
  }

  const resolvedAuthors = getDisplayableArticleAuthors(resolveArticleAuthors(frontmatter.author));
  const primaryAuthor = resolvedAuthors.find((author) => author.isRegistered) ?? null;

  return {
    category: "whitepaper",
    categoryLabel: "ホワイトペーパー",
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    heroImageSrc: frontmatter.heroImageSrc,
    author: primaryAuthor
      ? {
          avatarSrc: primaryAuthor.profileImageSrc ?? "/querypie-logo.svg",
          avatarAlt: primaryAuthor.name,
          name: primaryAuthor.name,
          role: primaryAuthor.position ?? "",
          bio: primaryAuthor.description ?? "",
          profileUrl: primaryAuthor.links.find((link) => link.type === "linkedin")?.url,
        }
      : null,
    bodyHtml: null,
    bodyMdx: fullEvaluation?.content ?? previewEvaluation.content,
    gatedBodyMdx: gatedEvaluation?.content ?? null,
    gating: isGated
      ? {
          contentKey: buildGatingContentKey("whitepaper", id),
          initiallyUnlocked: false,
        }
      : null,
    relatedTitle: "関連記事",
    relatedItems: buildRelatedItems(id, frontmatter.relatedIds ?? record.relatedIds),
    toc: extractHeadingsFromMdx(isGated ? splitSource.previewSource : bodySource),
  };
}

export function getWhitepaperPublicationHref(id: string, slug: string) {
  return getPublicationHref("whitepaper", id, slug);
}
