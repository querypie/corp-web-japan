import * as fs from "node:fs";
import * as path from "node:path";
import { parse as parseYaml } from "yaml";
import { getPublicationHref } from "@/lib/publications/get-publication-href";

export type NewsPublicationFrontmatter = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  heroImageSrc: string;
  author?: string | string[];
  hidden?: boolean;
  redirectUrl?: string;
  relatedIds: readonly string[];
};

export type NewsPublicationRecord = NewsPublicationFrontmatter & {
  sourcePath: string;
};

export type NewsPublicationListItem = {
  href: string;
  imageSrc: string;
  badge: string;
  title: string;
  description: string;
  date?: string;
  sourceLabel: string;
  opensExternal: boolean;
};

type NewsPublicationCache = {
  records: readonly NewsPublicationRecord[];
  recordsById: ReadonlyMap<string, NewsPublicationRecord>;
  listItems: readonly NewsPublicationListItem[];
};

const NEWS_POSTS_ROOT = path.join(process.cwd(), "src/content/news");
let newsPublicationCache: Readonly<NewsPublicationCache> | null = null;

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

  return {
    id: String(frontmatter.id ?? ""),
    slug: String(frontmatter.slug ?? ""),
    title: String(frontmatter.title ?? ""),
    description: String(frontmatter.description ?? ""),
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

function parseNewsPublicationFrontmatter(source: string, sourcePath: string): NewsPublicationFrontmatter {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    throw new Error(`Missing frontmatter block in ${sourcePath}`);
  }

  return normalizeNewsPublicationFrontmatter(parseYaml(match[1]), sourcePath);
}

function loadNewsPublicationRecords(): NewsPublicationRecord[] {
  return fs
    .readdirSync(NEWS_POSTS_ROOT)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const sourcePath = path.join(NEWS_POSTS_ROOT, file);
      const source = fs.readFileSync(sourcePath, "utf8");
      const frontmatter = parseNewsPublicationFrontmatter(source, sourcePath);

      return {
        ...frontmatter,
        sourcePath,
      };
    })
    .sort((left, right) => Number(right.id) - Number(left.id));
}

function createNewsPublicationCache(): Readonly<NewsPublicationCache> {
  const records = Object.freeze(loadNewsPublicationRecords().map((record) => Object.freeze({ ...record })));
  const recordsById = new Map<string, NewsPublicationRecord>(records.map((record) => [record.id, record]));
  const visibleRecords = records.filter((record) => !record.hidden);
  const listItems = Object.freeze(
    visibleRecords.map((record) =>
      Object.freeze({
        href: record.redirectUrl ?? getPublicationHref("news", record.id, record.slug),
        imageSrc: record.heroImageSrc,
        badge: "ニュース",
        title: record.title,
        description: record.description,
        date: record.date,
        sourceLabel: record.redirectUrl ? "メディア掲載" : "公式発表",
        opensExternal: Boolean(record.redirectUrl),
      }),
    ),
  );

  return Object.freeze({
    records,
    recordsById,
    listItems,
  });
}

function getNewsPublicationCache(): Readonly<NewsPublicationCache> {
  if (newsPublicationCache) {
    return newsPublicationCache;
  }

  newsPublicationCache = Object.freeze(createNewsPublicationCache());
  return newsPublicationCache;
}

export const newsPublicationRecords = getNewsPublicationCache().records;

export function listNewsPublicationItems(): readonly NewsPublicationListItem[] {
  return getNewsPublicationCache().listItems;
}

export function listNewsPublicationParams() {
  return getNewsPublicationCache().records.map(({ id, slug }) => ({ id, slug }));
}

export function listNewsPublicationIds() {
  return getNewsPublicationCache().records.map(({ id }) => ({ id }));
}

export function getNewsPublicationRecord(id: string) {
  return getNewsPublicationCache().recordsById.get(id) ?? null;
}
