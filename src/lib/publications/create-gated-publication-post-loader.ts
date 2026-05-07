import * as fs from "node:fs";
import { getDisplayableArticleAuthors, resolveArticleAuthors } from "@/lib/authors/resolve-authors";
import { buildRelatedPublicationItems } from "@/lib/publications/build-related-publication-items";
import { buildGatingContentKey, splitMdxSourceAtGatingCut, stripFrontmatterBlock } from "@/lib/publications/gating";
import { extractHeadingsFromMdx } from "@/lib/publications/mdx/headings";
import { renderPublicationMdx } from "@/lib/publications/mdx/renderer";
import type { PublicationCategory, PublicationPost, PublicationPostAuthor } from "@/lib/publications/types";

type GatedPublicationPostFrontmatter = {
  author?: string | string[];
  relatedIds?: readonly string[];
  title: string;
  description: string;
  date: string;
  heroImageSrc: string;
  gated?: boolean;
  hideHeroImageOnDetail?: boolean;
};

type GatedPublicationPostRecord = {
  id: string;
  slug: string;
  title: string;
  date: string;
  heroImageSrc: string;
  redirectUrl?: string;
  relatedIds: readonly string[];
  sourcePath: string;
};

type CreateGatedPublicationPostLoaderConfig<TRecord extends GatedPublicationPostRecord> = {
  category: PublicationCategory;
  categoryLabel: string;
  relatedTitle: string;
  defaultAuthorAvatarSrc: string;
  records: readonly TRecord[];
  getRecord: (id: string) => TRecord | null;
  getHref: (id: string, slug: string) => string;
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

export function createGatedPublicationPostLoader<
  TFrontmatter extends GatedPublicationPostFrontmatter,
  TRecord extends GatedPublicationPostRecord,
>(config: CreateGatedPublicationPostLoaderConfig<TRecord>) {
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

  return async function getGatedPublicationPost(id: string): Promise<PublicationPost | null> {
    const record = config.getRecord(id);
    if (!record) {
      return null;
    }

    const bodySource = readBodySource(record.sourcePath);
    const splitSource = splitMdxSourceAtGatingCut(bodySource);
    const previewEvaluation = await renderPublicationMdx<TFrontmatter>(splitSource.previewSource);
    const frontmatter = previewEvaluation.frontmatter;
    const isGated = Boolean(frontmatter.gated);

    const fullEvaluation = !isGated && splitSource.gatedSource
      ? await renderPublicationMdx<TFrontmatter>(bodySource)
      : null;

    const gatedEvaluation = isGated && splitSource.gatedSource
      ? await renderPublicationMdx(stripFrontmatterBlock(splitSource.gatedSource), { parseFrontmatter: false })
      : null;

    if (isGated && !splitSource.gatedSource) {
      throw new Error(`${config.categoryLabel} ${id} is gated but missing <GatingCut /> in ${record.sourcePath}`);
    }

    return {
      category: config.category,
      categoryLabel: config.categoryLabel,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      heroImageSrc: frontmatter.heroImageSrc,
      hideHeroImageOnDetail: frontmatter.hideHeroImageOnDetail === true,
      author: buildPublicationAuthor(frontmatter.author, config.defaultAuthorAvatarSrc),
      bodyHtml: null,
      bodyMdx: fullEvaluation?.content ?? previewEvaluation.content,
      gatedBodyMdx: gatedEvaluation?.content ?? null,
      gating: isGated
        ? {
            contentKey: buildGatingContentKey(config.category, id),
            initiallyUnlocked: false,
          }
        : null,
      relatedTitle: config.relatedTitle,
      relatedItems: buildRelatedPublicationItems({
        records: config.records,
        id,
        relatedIds: frontmatter.relatedIds ?? record.relatedIds,
        getHref: config.getHref,
      }),
      toc: extractHeadingsFromMdx(isGated ? splitSource.previewSource : bodySource),
    };
  };
}
