import * as fs from "node:fs";
import { getDisplayableArticleAuthors, resolveArticleAuthors } from "@/lib/authors/resolve-authors";
import {
  aipDemoPublicationRecords,
  getAipDemoPublicationRecord,
  listAipDemoPublicationIds,
  listAipDemoPublicationParams,
  type AipDemoPublicationFrontmatter,
} from "@/lib/publications/aip-demo-publication-records";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { extractHeadingsFromMdx } from "@/lib/publications/mdx/headings";
import { renderPublicationMdx } from "@/lib/publications/mdx/renderer";
import type { PublicationPost, PublicationPostSummary } from "@/lib/publications/types";

function readAipDemoPublicationBodySource(sourcePath: string) {
  return fs.readFileSync(sourcePath, "utf8");
}

function buildRelatedItems(id: string, relatedIds: readonly string[]): PublicationPostSummary[] {
  const recordsById = new Map(aipDemoPublicationRecords.map((record) => [record.id, record]));

  return relatedIds
    .filter((relatedId) => relatedId !== id)
    .map((relatedId) => recordsById.get(relatedId) ?? null)
    .filter((record) => record !== null)
    .slice(0, 3)
    .map((record) => ({
      href: getAipDemoPublicationHref(record.id, record.slug),
      imageSrc: record.heroImageSrc,
      title: record.title,
      date: record.date,
    }));
}

export { getAipDemoPublicationRecord, listAipDemoPublicationIds, listAipDemoPublicationParams };

export async function getAipDemoPublicationPost(id: string): Promise<PublicationPost | null> {
  const record = getAipDemoPublicationRecord(id);
  if (!record) {
    return null;
  }

  const bodySource = readAipDemoPublicationBodySource(record.sourcePath);
  const { content, frontmatter } = await renderPublicationMdx<AipDemoPublicationFrontmatter>(bodySource);
  const resolvedAuthors = getDisplayableArticleAuthors(resolveArticleAuthors(frontmatter.author));
  const primaryAuthor = resolvedAuthors.find((author) => author.isRegistered) ?? null;

  return {
    category: "aip-demo",
    categoryLabel: "AIP機能",
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
    relatedTitle: "関連AIP活用事例",
    relatedItems: buildRelatedItems(id, frontmatter.relatedIds ?? record.relatedIds),
    toc: extractHeadingsFromMdx(bodySource),
  };
}

export function getAipDemoPublicationHref(id: string, slug: string) {
  return getPublicationHref("aip-demo", id, slug);
}
