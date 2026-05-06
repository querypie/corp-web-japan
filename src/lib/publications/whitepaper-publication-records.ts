import * as fs from "node:fs";
import * as path from "node:path";
import { parse as parseYaml } from "yaml";
import type { ResourceItem } from "@/content/resources";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { resolveRedirectablePublicationHref } from "@/lib/publications/resolve-redirectable-publication-href";

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

export type WhitepaperPublicationRecord = WhitepaperPublicationFrontmatter & {
  sourcePath: string;
};

export type WhitepaperPublicationListItem = ResourceItem;

type WhitepaperPublicationCache = {
  records: readonly WhitepaperPublicationRecord[];
  recordsById: ReadonlyMap<string, WhitepaperPublicationRecord>;
  listItems: readonly WhitepaperPublicationListItem[];
};

const WHITEPAPER_POSTS_ROOT = path.join(process.cwd(), "src/content/whitepapers");
let whitepaperPublicationCache: Readonly<WhitepaperPublicationCache> | null = null;

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

function parseWhitepaperPublicationFrontmatter(
  source: string,
  sourcePath: string,
): WhitepaperPublicationFrontmatter {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    throw new Error(`Missing frontmatter block in ${sourcePath}`);
  }

  return normalizeWhitepaperPublicationFrontmatter(parseYaml(match[1]), sourcePath);
}

function loadWhitepaperPublicationRecords(): WhitepaperPublicationRecord[] {
  return fs
    .readdirSync(WHITEPAPER_POSTS_ROOT)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const sourcePath = path.join(WHITEPAPER_POSTS_ROOT, file);
      const source = fs.readFileSync(sourcePath, "utf8");
      const frontmatter = parseWhitepaperPublicationFrontmatter(source, sourcePath);

      return {
        ...frontmatter,
        sourcePath,
      };
    })
    .sort((left, right) => Number(right.id) - Number(left.id));
}

function createWhitepaperPublicationCache(): Readonly<WhitepaperPublicationCache> {
  const records = Object.freeze(loadWhitepaperPublicationRecords().map((record) => Object.freeze({ ...record })));
  const recordsById = new Map<string, WhitepaperPublicationRecord>(records.map((record) => [record.id, record]));
  const visibleRecords = records.filter((record) => !record.hidden);
  const listItems = Object.freeze(
    visibleRecords.map((record) =>
      Object.freeze({
        id: record.id,
        href: resolveRedirectablePublicationHref(record.redirectUrl, getPublicationHref("whitepaper", record.id, record.slug)),
        imageSrc: record.heroImageSrc,
        badge: "ホワイトペーパー",
        title: record.title,
        description: record.listDescription ?? record.description,
        date: record.date,
      }),
    ),
  );

  return Object.freeze({
    records,
    recordsById,
    listItems,
  });
}

function getWhitepaperPublicationCache(): Readonly<WhitepaperPublicationCache> {
  if (whitepaperPublicationCache) {
    return whitepaperPublicationCache;
  }

  whitepaperPublicationCache = Object.freeze(createWhitepaperPublicationCache());
  return whitepaperPublicationCache;
}

export const whitepaperPublicationRecords = getWhitepaperPublicationCache().records;

export function listWhitepaperPublicationItems(): readonly WhitepaperPublicationListItem[] {
  return getWhitepaperPublicationCache().listItems;
}

export function listWhitepaperPublicationParams() {
  return getWhitepaperPublicationCache().records.map(({ id, slug }) => ({ id, slug }));
}

export function listWhitepaperPublicationIds() {
  return getWhitepaperPublicationCache().records.map(({ id }) => ({ id }));
}

export function getWhitepaperPublicationRecord(id: string) {
  return getWhitepaperPublicationCache().recordsById.get(id) ?? null;
}
