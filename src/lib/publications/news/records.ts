import * as path from "node:path";
import { formatJapaneseDateFromIsoDate } from "@/lib/publications/format-japanese-date";
import {
  createStandardPublicationRecordsRepository,
  type StandardPublicationRecord,
} from "@/lib/publications/create-standard-records-repository";

export type NewsPublicationFrontmatter = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  heroImageSrc: string;
  openGraphImageSrc?: string;
  author?: string | string[];
  sourceLabel?: string;
  hidden?: boolean;
  redirectUrl?: string;
  relatedIds: readonly string[];
};

export type NewsPublicationRecord = StandardPublicationRecord<NewsPublicationFrontmatter>;

export type NewsPublicationListItem = {
  id: string;
  href: string;
  imageSrc: string;
  badge: string;
  title: string;
  description: string;
  date?: string;
  sourceLabel: string;
  opensExternal: boolean;
};

const NEWS_POSTS_ROOT = path.join(process.cwd(), "src/content/news");

function normalizeNewsPublicationFrontmatter(value: unknown, sourcePath: string): NewsPublicationFrontmatter {
  if (!value || typeof value !== "object") {
    throw new Error(`Missing news frontmatter in ${sourcePath}`);
  }

  const frontmatter = value as Record<string, unknown>;
  const relatedIdsValue = frontmatter.relatedIds;
  const relatedIds = Array.isArray(relatedIdsValue)
    ? relatedIdsValue.map((item) => String(item))
    : [];
  const authorValue = frontmatter.author;
  const redirectUrlValue = frontmatter.redirectUrl;
  const sourceLabelValue = frontmatter.sourceLabel;
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
    sourceLabel: typeof sourceLabelValue === "string" ? sourceLabelValue : undefined,
    hidden: frontmatter.hidden === true,
    redirectUrl: typeof redirectUrlValue === "string" ? redirectUrlValue : undefined,
    relatedIds,
  };
}

const newsPublicationRepository = createStandardPublicationRecordsRepository<
  NewsPublicationFrontmatter,
  NewsPublicationRecord,
  NewsPublicationListItem
>({
  contentRoot: NEWS_POSTS_ROOT,
  category: "news",
  badge: "ニュース",
  normalizeFrontmatter: normalizeNewsPublicationFrontmatter,
  createListItem: (record, href) => ({
    id: record.id,
    href,
    imageSrc: record.heroImageSrc,
    badge: "ニュース",
    title: record.title,
    description: record.description,
    date: formatJapaneseDateFromIsoDate(record.date),
    sourceLabel: record.sourceLabel ?? (record.redirectUrl ? "メディア掲載" : "公式発表"),
    opensExternal: false,
  }),
});

export const newsPublicationRecords = newsPublicationRepository.records;

export function listNewsPublicationItems(): readonly NewsPublicationListItem[] {
  return newsPublicationRepository.listItems;
}

export function listNewsPublicationParams() {
  return newsPublicationRepository.listParams();
}

export function listNewsPublicationIds() {
  return newsPublicationRepository.listIds();
}

export function getNewsPublicationRecord(id: string) {
  return newsPublicationRepository.getRecord(id);
}
