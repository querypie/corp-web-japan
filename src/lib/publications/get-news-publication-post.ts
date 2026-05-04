import * as fs from "node:fs";
import { getDisplayableArticleAuthors, resolveArticleAuthors } from "@/lib/authors/resolve-authors";
import {
  getNewsPublicationRecord,
  listNewsPublicationIds,
  listNewsPublicationParams,
  newsPublicationRecords,
} from "@/lib/publications/news-publication-records";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { extractHeadingsFromMdx } from "@/lib/publications/mdx/headings";
import { renderPublicationMdx } from "@/lib/publications/mdx/renderer";
import type { PublicationPost, PublicationPostSummary } from "@/lib/publications/types";

function readNewsPublicationBodySource(sourcePath: string) {
  return fs.readFileSync(sourcePath, "utf8");
}

function stripLeadingNewsTitleHeading(source: string) {
  return source.replace(/^(---\n[\s\S]*?\n---\n+)(# .*\n+)/, "$1");
}

function buildRelatedItems(id: string, relatedIds: readonly string[]): PublicationPostSummary[] {
  const recordsById = new Map(newsPublicationRecords.map((record) => [record.id, record]));
  const preferredIds = relatedIds.length > 0 ? relatedIds : newsPublicationRecords.map((record) => record.id);

  return preferredIds
    .filter((relatedId) => relatedId !== id)
    .map((relatedId) => recordsById.get(relatedId) ?? null)
    .filter((record) => record !== null)
    .slice(0, 3)
    .map((record) => ({
      href: record.redirectUrl ?? getNewsPublicationHref(record.id, record.slug),
      imageSrc: record.heroImageSrc,
      title: record.title,
      date: record.date,
    }));
}

export { getNewsPublicationRecord, listNewsPublicationIds, listNewsPublicationParams };

export async function getNewsPublicationPost(id: string): Promise<PublicationPost | null> {
  const record = getNewsPublicationRecord(id);
  if (!record) {
    return null;
  }

  const bodySource = readNewsPublicationBodySource(record.sourcePath);
  const renderedSource = stripLeadingNewsTitleHeading(bodySource);
  const { content, frontmatter } = await renderPublicationMdx<{
    author?: string | string[];
    relatedIds?: readonly string[];
    title: string;
    description: string;
    date: string;
    heroImageSrc: string;
  }>(renderedSource);
  const resolvedAuthors = getDisplayableArticleAuthors(resolveArticleAuthors(frontmatter.author));
  const primaryAuthor = resolvedAuthors.find((author) => author.isRegistered) ?? null;

  return {
    category: "news",
    categoryLabel: "ニュース",
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
    bodyMdx: content,
    gatedBodyMdx: null,
    gating: null,
    relatedTitle: "関連ニュース",
    relatedItems: buildRelatedItems(id, frontmatter.relatedIds ?? record.relatedIds),
    toc: extractHeadingsFromMdx(renderedSource),
  };
}

export function getNewsPublicationHref(id: string, slug: string) {
  return getPublicationHref("news", id, slug);
}
