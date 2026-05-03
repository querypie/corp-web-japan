import * as fs from "node:fs";
import { getDisplayableArticleAuthors, resolveArticleAuthors } from "@/lib/authors/resolve-authors";
import {
  acpDemoPublicationRecords,
  getAcpDemoPublicationRecord,
  listAcpDemoPublicationIds,
  listAcpDemoPublicationParams,
  type AcpDemoPublicationFrontmatter,
} from "@/content/publications/acp-demo-publication-records";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { extractHeadingsFromMdx } from "@/lib/publications/mdx/headings";
import { renderPublicationMdx } from "@/lib/publications/mdx/renderer";
import type { PublicationPost, PublicationPostSummary } from "@/lib/publications/types";

function readAcpDemoPublicationBodySource(sourcePath: string) {
  return fs.readFileSync(sourcePath, "utf8");
}

function buildRelatedItems(id: string, relatedIds: readonly string[]): PublicationPostSummary[] {
  const recordsById = new Map(acpDemoPublicationRecords.map((record) => [record.id, record]));

  return relatedIds
    .filter((relatedId) => relatedId !== id)
    .map((relatedId) => recordsById.get(relatedId) ?? null)
    .filter((record) => record !== null)
    .slice(0, 3)
    .map((record) => ({
      href: getAcpDemoPublicationHref(record.id, record.slug),
      imageSrc: record.heroImageSrc,
      title: record.title,
      date: record.date,
    }));
}

export { getAcpDemoPublicationRecord, listAcpDemoPublicationIds, listAcpDemoPublicationParams };

export async function getAcpDemoPublicationPost(id: string): Promise<PublicationPost | null> {
  const record = getAcpDemoPublicationRecord(id);
  if (!record) {
    return null;
  }

  const bodySource = readAcpDemoPublicationBodySource(record.sourcePath);
  const { content, frontmatter } = await renderPublicationMdx<AcpDemoPublicationFrontmatter>(bodySource);
  const resolvedAuthors = getDisplayableArticleAuthors(resolveArticleAuthors(frontmatter.author));
  const primaryAuthor = resolvedAuthors.find((author) => author.isRegistered) ?? null;

  return {
    category: "acp-demo",
    categoryLabel: "ACP機能",
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
    relatedTitle: "関連ACPデモ",
    relatedItems: buildRelatedItems(id, frontmatter.relatedIds ?? record.relatedIds),
    toc: extractHeadingsFromMdx(bodySource),
  };
}

export function getAcpDemoPublicationHref(id: string, slug: string) {
  return getPublicationHref("acp-demo", id, slug);
}
