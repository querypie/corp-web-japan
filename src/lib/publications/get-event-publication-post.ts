import * as fs from "node:fs";
import { getDisplayableArticleAuthors, resolveArticleAuthors } from "@/lib/authors/resolve-authors";
import {
  eventPublicationRecords,
  getEventPublicationRecord,
  listEventPublicationIds,
  listEventPublicationParams,
} from "@/lib/publications/event-publication-records";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { extractHeadingsFromMdx } from "@/lib/publications/mdx/headings";
import { renderPublicationMdx } from "@/lib/publications/mdx/renderer";
import type { PublicationPost, PublicationPostSummary } from "@/lib/publications/types";

function readEventPublicationBodySource(sourcePath: string) {
  return fs.readFileSync(sourcePath, "utf8");
}

function buildRelatedItems(id: string, relatedIds: readonly string[]): PublicationPostSummary[] {
  const recordsById = new Map(eventPublicationRecords.map((record) => [record.id, record]));
  const preferredIds = relatedIds.length > 0 ? relatedIds : eventPublicationRecords.map((record) => record.id);

  return preferredIds
    .filter((relatedId) => relatedId !== id)
    .map((relatedId) => recordsById.get(relatedId) ?? null)
    .filter((record) => record !== null)
    .slice(0, 3)
    .map((record) => ({
      href: getEventPublicationHref(record.id, record.slug),
      imageSrc: record.heroImageSrc,
      title: record.title,
      date: record.date,
    }));
}

export { getEventPublicationRecord, listEventPublicationIds, listEventPublicationParams };

export async function getEventPublicationPost(id: string): Promise<PublicationPost | null> {
  const record = getEventPublicationRecord(id);
  if (!record) {
    return null;
  }

  const bodySource = readEventPublicationBodySource(record.sourcePath);
  const { content, frontmatter } = await renderPublicationMdx<{
    author?: string | string[];
    relatedIds?: readonly string[];
    title: string;
    description: string;
    date: string;
    heroImageSrc: string;
  }>(bodySource);
  const resolvedAuthors = getDisplayableArticleAuthors(resolveArticleAuthors(frontmatter.author));
  const primaryAuthor = resolvedAuthors.find((author) => author.isRegistered) ?? null;

  return {
    category: "event",
    categoryLabel: "イベント",
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
    relatedTitle: "関連イベント",
    relatedItems: buildRelatedItems(id, frontmatter.relatedIds ?? record.relatedIds),
    toc: extractHeadingsFromMdx(bodySource),
  };
}

export function getEventPublicationHref(id: string, slug: string) {
  return getPublicationHref("event", id, slug);
}
