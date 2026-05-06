import * as fs from "node:fs";
import { getDisplayableArticleAuthors, resolveArticleAuthors } from "@/lib/authors/resolve-authors";
import {
  getUseCasePublicationRecord,
  listUseCasePublicationIds,
  listUseCasePublicationParams,
  useCasePublicationRecords,
  type UseCasePublicationFrontmatter,
} from "@/lib/publications/use-case-publication-records";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { extractHeadingsFromMdx } from "@/lib/publications/mdx/headings";
import { renderPublicationMdx } from "@/lib/publications/mdx/renderer";
import { resolveRedirectablePublicationHref } from "@/lib/publications/resolve-redirectable-publication-href";
import type { PublicationPost, PublicationPostSummary } from "@/lib/publications/types";

function readUseCasePublicationBodySource(sourcePath: string) {
  return fs.readFileSync(sourcePath, "utf8");
}

function buildRelatedItems(id: string, relatedIds: readonly string[]): PublicationPostSummary[] {
  const recordsById = new Map(useCasePublicationRecords.map((record) => [record.id, record]));
  const preferredIds = relatedIds.length > 0 ? relatedIds : useCasePublicationRecords.map((record) => record.id);

  return preferredIds
    .filter((relatedId) => relatedId !== id)
    .map((relatedId) => recordsById.get(relatedId) ?? null)
    .filter((record) => record !== null)
    .slice(0, 3)
    .map((record) => ({
      href: resolveRedirectablePublicationHref(record.redirectUrl, getUseCasePublicationHref(record.id, record.slug)),
      imageSrc: record.heroImageSrc,
      title: record.title,
      date: record.date,
    }));
}

export { getUseCasePublicationRecord, listUseCasePublicationIds, listUseCasePublicationParams };

export async function getUseCasePublicationPost(id: string): Promise<PublicationPost | null> {
  const record = getUseCasePublicationRecord(id);
  if (!record) {
    return null;
  }

  const bodySource = readUseCasePublicationBodySource(record.sourcePath);
  const { content, frontmatter } = await renderPublicationMdx<UseCasePublicationFrontmatter>(bodySource);
  const resolvedAuthors = getDisplayableArticleAuthors(resolveArticleAuthors(frontmatter.author));
  const primaryAuthor = resolvedAuthors.find((author) => author.isRegistered) ?? null;

  return {
    category: "use-case",
    categoryLabel: "活用事例",
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    heroImageSrc: frontmatter.heroImageSrc,
    hideHeroImageOnDetail: frontmatter.hideHeroImageOnDetail === true,
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
    bodyMdx: content,
    gatedBodyMdx: null,
    gating: null,
    relatedTitle: "関連活用事例",
    relatedItems: buildRelatedItems(id, frontmatter.relatedIds ?? record.relatedIds),
    toc: extractHeadingsFromMdx(bodySource),
  };
}

export function getUseCasePublicationHref(id: string, slug: string) {
  return getPublicationHref("use-case", id, slug);
}
