import * as fs from "node:fs";
import { buildPublicationAuthor } from "@/lib/publications/build-publication-author";
import { buildRelatedPublicationItems } from "@/lib/publications/build-related-publication-items";
import { extractHeadingsFromMdx } from "@/lib/publications/mdx/headings";
import { formatJapaneseDateFromIsoDate } from "@/lib/publications/format-japanese-date";
import { renderPublicationMdx } from "@/lib/publications/mdx/renderer";
import type { PublicationCategory, PublicationPost } from "@/lib/publications/types";

type StandardPublicationPostFrontmatter = {
  author?: string | string[];
  relatedIds?: readonly string[];
  title: string;
  description: string;
  date: string;
  heroImageSrc: string;
  hideHeroImageOnDetail?: boolean;
  hideTocOnDetail?: boolean;
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

type CreateStandardPublicationPostLoaderConfig<TRecord extends StandardPublicationPostRecord> = {
  category: PublicationCategory;
  categoryLabel: string;
  relatedTitle: string;
  defaultAuthorAvatarSrc: string;
  records: readonly TRecord[];
  formatDate?: (value: string) => string;
  getRecord: (id: string) => TRecord | null;
  getHref: (id: string, slug: string) => string;
};

export function createStandardPublicationPostLoader<
  TFrontmatter extends StandardPublicationPostFrontmatter,
  TRecord extends StandardPublicationPostRecord,
>(config: CreateStandardPublicationPostLoaderConfig<TRecord>) {
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
    const formatDate = config.formatDate ?? formatJapaneseDateFromIsoDate;

    return {
      category: config.category,
      categoryLabel: config.categoryLabel,
      title: frontmatter.title,
      description: frontmatter.description,
      date: formatDate(frontmatter.date),
      heroImageSrc: frontmatter.heroImageSrc,
      hideHeroImageOnDetail: frontmatter.hideHeroImageOnDetail === true,
      author: buildPublicationAuthor(frontmatter.author, config.defaultAuthorAvatarSrc),
      bodyHtml: null,
      bodyMdx: content,
      gatedBodyMdx: null,
      gating: null,
      downloadCta: null,
      relatedTitle: config.relatedTitle,
      relatedItems: buildRelatedPublicationItems({
        records: config.records,
        id,
        relatedIds: frontmatter.relatedIds ?? record.relatedIds,
        getHref: config.getHref,
        formatDate,
      }),
      toc: frontmatter.hideTocOnDetail === true ? [] : extractHeadingsFromMdx(bodySource),
    };
  };
}
