import * as path from "node:path";
import type { ResourceItem } from "@/content/resources";
import {
  createStandardPublicationRecordsRepository,
  type StandardPublicationRecord,
} from "@/lib/publications/create-standard-records-repository";

export type WhitepaperPublicationFrontmatter = {
  id: string;
  slug: string;
  title: string;
  description: string;
  listDescription?: string;
  date: string;
  heroImageSrc: string;
  author?: string | string[];
  hidden?: boolean;
  redirectUrl?: string;
  relatedIds: readonly string[];
};

export type WhitepaperPublicationRecord = StandardPublicationRecord<WhitepaperPublicationFrontmatter>;

export type WhitepaperPublicationListItem = ResourceItem;

const WHITEPAPER_POSTS_ROOT = path.join(process.cwd(), "src/content/whitepapers");

function normalizeWhitepaperPublicationFrontmatter(
  value: unknown,
  sourcePath: string,
): WhitepaperPublicationFrontmatter {
  if (!value || typeof value !== "object") {
    throw new Error(`Missing whitepaper frontmatter in ${sourcePath}`);
  }

  const frontmatter = value as Record<string, unknown>;
  const relatedIdsValue = frontmatter.relatedIds;
  const relatedIds = Array.isArray(relatedIdsValue)
    ? relatedIdsValue.map((item) => String(item))
    : [];
  const authorValue = frontmatter.author;
  const redirectUrlValue = frontmatter.redirectUrl;

  return {
    id: String(frontmatter.id ?? ""),
    slug: String(frontmatter.slug ?? ""),
    title: String(frontmatter.title ?? ""),
    description: String(frontmatter.description ?? ""),
    listDescription:
      typeof frontmatter.listDescription === "string"
        ? frontmatter.listDescription
        : undefined,
    date: String(frontmatter.date ?? ""),
    heroImageSrc: String(frontmatter.heroImageSrc ?? ""),
    author:
      typeof authorValue === "string"
        ? authorValue
        : Array.isArray(authorValue)
          ? authorValue.map((item) => String(item))
          : undefined,
    hidden: frontmatter.hidden === true,
    redirectUrl: typeof redirectUrlValue === "string" ? redirectUrlValue : undefined,
    relatedIds,
  };
}

const whitepaperPublicationRepository = createStandardPublicationRecordsRepository<WhitepaperPublicationFrontmatter>({
  contentRoot: WHITEPAPER_POSTS_ROOT,
  category: "whitepaper",
  badge: "ホワイトペーパー",
  normalizeFrontmatter: normalizeWhitepaperPublicationFrontmatter,
  getListItemDescription: (record) => record.listDescription ?? record.description,
});

export const whitepaperPublicationRecords = whitepaperPublicationRepository.records;

export function listWhitepaperPublicationItems(): readonly WhitepaperPublicationListItem[] {
  return whitepaperPublicationRepository.listItems;
}

export function listWhitepaperPublicationParams() {
  return whitepaperPublicationRepository.listParams();
}

export function listWhitepaperPublicationIds() {
  return whitepaperPublicationRepository.listIds();
}

export function getWhitepaperPublicationRecord(id: string) {
  return whitepaperPublicationRepository.getRecord(id);
}
