import * as fs from "node:fs";
import { getDisplayableArticleAuthors, resolveArticleAuthors } from "@/lib/authors/resolve-authors";
import { extractHeadingsFromMdx } from "@/lib/publications/mdx/headings";
import { renderPublicationMdx } from "@/lib/publications/mdx/renderer";
import { resolveRedirectablePublicationHref } from "@/lib/publications/resolve-redirectable-publication-href";
import type { PublicationCategory, PublicationPost, PublicationPostAuthor, PublicationPostSummary } from "@/lib/publications/types";

type StandardPublicationPostFrontmatter = {
  author?: string | string[];
  relatedIds?: readonly string[];
  title: string;
  description: string;
  date: string;
  heroImageSrc: string;
  hideHeroImageOnDetail?: boolean;
};

type StandardPublicationPostRecord = {
  id: string;
  slug: string;
  title: string;
  date: string;
  heroImageSrc: string;
  redirectUrl?: string;
  relatedIds: readonly string[];
  sourcePath: string;
};

type CreateStandardPublicationPostLoaderConfig<
  TFrontmatter extends StandardPublicationPostFrontmatter,
  TRecord extends StandardPublicationPostRecord,
> = {
  category: PublicationCategory;
  categoryLabel: string;
  relatedTitle: string;
  defaultAuthorAvatarSrc: string;
  records: readonly TRecord[];
  formatDate?: (value: string) => string;
  getRecord: (id: string) => TRecord | null;
  getHref: (id: string, slug: string) => string;
  fallbackToAllRecords?: boolean;
};

function buildPublicationAuthor(author: string | string[] | undefined, defaultAuthorAvatarSrc: string): PublicationPostAuthor | null {
  const resolvedAuthors = getDisplayableArticleAuthors(resolveArticleAuthors(author));
  const primaryAuthor = resolvedAuthors.find((candidate) => candidate.isRegistered) ?? null;

  if (!primaryAuthor) {
    return null;
  }

  return {
    avatarSrc: primaryAuthor.profileImageSrc ?? defaultAuthorAvatarSrc,
    avatarAlt: primaryAuthor.name,
    name: primaryAuthor.name,
    role: primaryAuthor.position ?? "",
    bio: primaryAuthor.description ?? "",
    profileUrl: primaryAuthor.links.find((link) => link.type === "linkedin")?.url,
  };
}

function buildRelatedItems<TRecord extends StandardPublicationPostRecord>(
  records: readonly TRecord[],
  id: string,
  relatedIds: readonly string[],
  getHref: (id: string, slug: string) => string,
  fallbackToAllRecords: boolean,
  formatDate?: (value: string) => string,
): PublicationPostSummary[] {
  const recordsById = new Map<string, TRecord>(records.map((record) => [record.id, record]));
  const preferredIds = relatedIds.length > 0 || !fallbackToAllRecords ? relatedIds : records.map((record) => record.id);

  return preferredIds
    .filter((relatedId) => relatedId != id)
    .map((relatedId) => recordsById.get(relatedId) ?? null)
    .filter((record): record is TRecord => record !== null)
    .slice(0, 3)
    .map((record) => ({
      href: resolveRedirectablePublicationHref(record.redirectUrl, getHref(record.id, record.slug)),
      imageSrc: record.heroImageSrc,
      title: record.title,
      date: formatDate ? formatDate(record.date) : record.date,
    }));
}

export function createStandardPublicationPostLoader<
  TFrontmatter extends StandardPublicationPostFrontmatter,
  TRecord extends StandardPublicationPostRecord,
>(config: CreateStandardPublicationPostLoaderConfig<TFrontmatter, TRecord>) {
  const bodySourceCache = new Map<string, string>();

  const readBodySource = (sourcePath: string) => {
    const cachedSource = bodySourceCache.get(sourcePath);
    if (cachedSource) {
      return cachedSource;
    }

    const source = fs.readFileSync(sourcePath, "utf8");
    bodySourceCache.set(sourcePath, source);
    return source;
  };

  return async function getStandardPublicationPost(id: string): Promise<PublicationPost | null> {
    const record = config.getRecord(id);
    if (!record) {
      return null;
    }

    const bodySource = readBodySource(record.sourcePath);
    const { content, frontmatter } = await renderPublicationMdx<TFrontmatter>(bodySource);

    return {
      category: config.category,
      categoryLabel: config.categoryLabel,
      title: frontmatter.title,
      description: frontmatter.description,
      date: config.formatDate ? config.formatDate(frontmatter.date) : frontmatter.date,
      heroImageSrc: frontmatter.heroImageSrc,
      hideHeroImageOnDetail: frontmatter.hideHeroImageOnDetail === true,
      author: buildPublicationAuthor(frontmatter.author, config.defaultAuthorAvatarSrc),
      bodyHtml: null,
      bodyMdx: content,
      gatedBodyMdx: null,
      gating: null,
      relatedTitle: config.relatedTitle,
      relatedItems: buildRelatedItems(
        config.records,
        id,
        frontmatter.relatedIds ?? record.relatedIds,
        config.getHref,
        config.fallbackToAllRecords === true,
        config.formatDate,
      ),
      toc: extractHeadingsFromMdx(bodySource),
    };
  };
}
