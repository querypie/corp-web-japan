import * as fs from "node:fs";
import { extractHeadingsFromMdx } from "@/lib/publications/mdx/headings";
import { renderPublicationMdx } from "@/lib/publications/mdx/renderer";
import { buildGatingContentKey, splitMdxSourceAtGatingCut, stripFrontmatterBlock } from "@/lib/publications/gating";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import type { PublicationPost } from "@/lib/publications/types";
import type { BaseResourcePublicationRepository } from "@/lib/resources/base-resource-publication";
import type { ResourcePublicationFrontmatter, ResourcePublicationRecord } from "@/lib/resources/types";

export abstract class BaseResourcePublicationPostLoader {
  private bodySourceCache = new Map<string, string>();

  protected abstract readonly repository: BaseResourcePublicationRepository;

  private readBodySource(record: ResourcePublicationRecord) {
    const cachedSource = this.bodySourceCache.get(record.sourcePath);
    if (cachedSource) {
      return cachedSource;
    }

    const source = fs.readFileSync(record.sourcePath, "utf8");
    this.bodySourceCache.set(record.sourcePath, source);
    return source;
  }

  getHref(id: string, slug: string) {
    return getPublicationHref(this.repository.getCategory(), id, slug);
  }

  getRecord(id: string) {
    return this.repository.getRecord(id);
  }

  listParams() {
    return this.repository.listParams();
  }

  listIds() {
    return this.repository.listIds();
  }

  async getPost(id: string): Promise<PublicationPost | null> {
    const record = this.repository.getRecord(id);
    if (!record) {
      return null;
    }

    const bodySource = this.readBodySource(record);
    const isGated = record.gated === true;
    const category = this.repository.getCategory();
    const badge = this.repository.getBadge();

    if (isGated) {
      const splitSource = splitMdxSourceAtGatingCut(bodySource);
      if (!splitSource.gatedSource) {
        throw new Error(`Resource publication ${category}/${id} is gated but missing <GatingCut /> in ${record.sourcePath}`);
      }

      const previewEvaluation = await renderPublicationMdx<ResourcePublicationFrontmatter>(splitSource.previewSource);
      const gatedEvaluation = await renderPublicationMdx(stripFrontmatterBlock(splitSource.gatedSource), {
        parseFrontmatter: false,
      });

      return {
        category,
        categoryLabel: badge,
        title: previewEvaluation.frontmatter.title,
        description: previewEvaluation.frontmatter.description,
        date: previewEvaluation.frontmatter.date ?? "",
        heroImageSrc: previewEvaluation.frontmatter.heroImageSrc,
        author: null,
        bodyHtml: null,
        bodyMdx: previewEvaluation.content,
        gatedBodyMdx: gatedEvaluation.content,
        gating: {
          contentKey: buildGatingContentKey(category, id),
          initiallyUnlocked: false,
        },
        relatedTitle: "関連リソース",
        relatedItems: previewEvaluation.frontmatter.relatedItems?.map((item) => ({
          href: item.href,
          imageSrc: item.imageSrc,
          title: item.title,
          date: item.date ?? "",
        })) ?? [],
        toc: extractHeadingsFromMdx(splitSource.previewSource),
      };
    }

    const evaluation = await renderPublicationMdx<ResourcePublicationFrontmatter>(bodySource);

    return {
      category,
      categoryLabel: badge,
      title: evaluation.frontmatter.title,
      description: evaluation.frontmatter.description,
      date: evaluation.frontmatter.date ?? "",
      heroImageSrc: evaluation.frontmatter.heroImageSrc,
      author: null,
      bodyHtml: null,
      bodyMdx: evaluation.content,
      gatedBodyMdx: null,
      gating: null,
      relatedTitle: "関連リソース",
      relatedItems: evaluation.frontmatter.relatedItems?.map((item) => ({
        href: item.href,
        imageSrc: item.imageSrc,
        title: item.title,
        date: item.date ?? "",
      })) ?? [],
      toc: extractHeadingsFromMdx(bodySource),
    };
  }
}
