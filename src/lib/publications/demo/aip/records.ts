import * as path from "node:path";
import type { ResourceItem } from "@/content/resources";
import {
  createStandardPublicationRecordsRepository,
  type StandardPublicationRecord,
} from "@/lib/publications/create-standard-records-repository";

export type AipDemoPublicationFrontmatter = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  heroImageSrc: string;
  openGraphImageSrc?: string;
  author?: string | string[];
  hideHeroImageOnDetail?: boolean;
  hidden?: boolean;
  redirectUrl?: string;
  relatedIds: readonly string[];
};

export type AipDemoPublicationRecord = StandardPublicationRecord<AipDemoPublicationFrontmatter>;
export type AipDemoPublicationListItem = ResourceItem;

function normalizeAipDemoPublicationFrontmatter(
  value: unknown,
  sourcePath: string,
): AipDemoPublicationFrontmatter {
  if (!value || typeof value !== "object") {
    throw new Error(`Missing AIP demo frontmatter in ${sourcePath}`);
  }

  const frontmatter = value as Record<string, unknown>;
  const relatedIdsValue = frontmatter.relatedIds;
  const relatedIds = Array.isArray(relatedIdsValue)
    ? relatedIdsValue.map((item) => String(item))
    : [];
  const authorValue = frontmatter.author;
  const hideHeroImageOnDetailValue = frontmatter.hideHeroImageOnDetail;
  const redirectUrlValue = frontmatter.redirectUrl;
  const openGraphImageSrcValue = frontmatter.openGraphImageSrc;

  return {
    id: String(frontmatter.id ?? ""),
    slug: String(frontmatter.slug ?? ""),
    title: String(frontmatter.title ?? ""),
    description: String(frontmatter.description ?? ""),
    date: String(frontmatter.date ?? ""),
    heroImageSrc: String(frontmatter.heroImageSrc ?? ""),
    openGraphImageSrc:
      typeof openGraphImageSrcValue === "string"
        ? openGraphImageSrcValue
        : undefined,
    author:
      typeof authorValue === "string"
        ? authorValue
        : Array.isArray(authorValue)
          ? authorValue.map((item) => String(item))
          : undefined,
    hideHeroImageOnDetail: hideHeroImageOnDetailValue === true,
    hidden: frontmatter.hidden === true,
    redirectUrl: typeof redirectUrlValue === "string" ? redirectUrlValue : undefined,
    relatedIds,
  };
}

const aipDemoPublicationRepository = createStandardPublicationRecordsRepository<AipDemoPublicationFrontmatter>({
  contentRoot: path.join(process.cwd(), "src/content/demo/aip"),
  category: "aip-demo",
  badge: "AIP機能",
  normalizeFrontmatter: normalizeAipDemoPublicationFrontmatter,
});

export const aipDemoPublicationRecords = aipDemoPublicationRepository.records;

export function listAipDemoPublicationItems(): readonly AipDemoPublicationListItem[] {
  return aipDemoPublicationRepository.listItems;
}

export function listAipDemoPublicationParams() {
  return aipDemoPublicationRepository.listParams();
}

export function listAipDemoPublicationIds() {
  return aipDemoPublicationRepository.listIds();
}

export function getAipDemoPublicationRecord(id: string) {
  return aipDemoPublicationRepository.getRecord(id);
}
