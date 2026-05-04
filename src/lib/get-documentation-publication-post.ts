import * as fs from "node:fs";
import { extractHeadingsFromMdx } from "@/lib/publications/mdx/headings";
import { renderPublicationMdx } from "@/lib/publications/mdx/renderer";
import type { PublicationPost } from "@/lib/publications/types";
import {
  getDocumentationPublicationRecord,
  listDocumentationPublicationIds,
  listDocumentationPublicationParams,
  type DocumentationPublicationCategory,
  type DocumentationPublicationFrontmatter,
  type DocumentationPublicationRecord,
} from "@/lib/documentation-publications";
import {
  buildGatingContentKey,
  splitMdxSourceAtGatingCut,
  stripFrontmatterBlock,
} from "@/lib/publications/gating";
import { getPublicationHref } from "@/lib/publications/get-publication-href";

const documentationBodySourceCache = new Map<string, string>();

function readBodySource(record: DocumentationPublicationRecord) {
  const cachedSource = documentationBodySourceCache.get(record.sourcePath);
  if (cachedSource) {
    return cachedSource;
  }

  const source = fs.readFileSync(record.sourcePath, "utf8");
  documentationBodySourceCache.set(record.sourcePath, source);
  return source;
}

const CATEGORY_LABELS: Record<DocumentationPublicationCategory, string> = {
  "introduction-deck": "紹介資料",
  glossary: "用語集",
  manuals: "マニュアル",
};

export function getDocumentationPublicationHref(
  category: DocumentationPublicationCategory,
  id: string,
  slug: string,
) {
  return getPublicationHref(category, id, slug);
}

export function getDocumentationPublicationRecordById(
  category: DocumentationPublicationCategory,
  id: string,
) {
  return getDocumentationPublicationRecord(category, id);
}

export function listDocumentationPublicationParamsByCategory(category: DocumentationPublicationCategory) {
  return listDocumentationPublicationParams(category);
}

export function listDocumentationPublicationIdsByCategory(category: DocumentationPublicationCategory) {
  return listDocumentationPublicationIds(category);
}

export async function getDocumentationPublicationPost(
  category: DocumentationPublicationCategory,
  id: string,
): Promise<PublicationPost | null> {
  const record = getDocumentationPublicationRecord(category, id);
  if (!record) {
    return null;
  }

  const bodySource = readBodySource(record);
  const isGated = record.gated === true;

  if (isGated) {
    const splitSource = splitMdxSourceAtGatingCut(bodySource);
    if (!splitSource.gatedSource) {
      throw new Error(`Documentation post ${category}/${id} is gated but missing <GatingCut /> in ${record.sourcePath}`);
    }

    const previewEvaluation = await renderPublicationMdx<DocumentationPublicationFrontmatter>(
      splitSource.previewSource,
    );
    const gatedEvaluation = await renderPublicationMdx(stripFrontmatterBlock(splitSource.gatedSource), {
      parseFrontmatter: false,
    });

    return {
      category,
      categoryLabel: CATEGORY_LABELS[category],
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
      relatedItems:
        previewEvaluation.frontmatter.relatedItems?.map((item) => ({
          href: item.href,
          imageSrc: item.imageSrc,
          title: item.title,
          date: item.date ?? "",
        })) ?? [],
      toc: extractHeadingsFromMdx(splitSource.previewSource),
    };
  }

  const evaluation = await renderPublicationMdx<DocumentationPublicationFrontmatter>(bodySource);

  return {
    category,
    categoryLabel: CATEGORY_LABELS[category],
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
    relatedItems:
      evaluation.frontmatter.relatedItems?.map((item) => ({
        href: item.href,
        imageSrc: item.imageSrc,
        title: item.title,
        date: item.date ?? "",
      })) ?? [],
    toc: extractHeadingsFromMdx(bodySource),
  };
}
