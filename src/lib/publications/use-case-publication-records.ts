import * as fs from "node:fs";
import * as path from "node:path";
import { parse as parseYaml } from "yaml";
import type { ResourceItem } from "@/content/resources";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { resolveRedirectablePublicationHref } from "@/lib/publications/resolve-redirectable-publication-href";

export type UseCasePublicationFrontmatter = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  heroImageSrc: string;
  author?: string | string[];
  hideHeroImageOnDetail?: boolean;
  hidden?: boolean;
  redirectUrl?: string;
  relatedIds: readonly string[];
};

export type UseCasePublicationRecord = UseCasePublicationFrontmatter & {
  sourcePath: string;
};

export type UseCasePublicationListItem = ResourceItem;

type UseCasePublicationCache = {
  records: readonly UseCasePublicationRecord[];
  recordsById: ReadonlyMap<string, UseCasePublicationRecord>;
  listItems: readonly UseCasePublicationListItem[];
};

const USE_CASE_POSTS_ROOT = path.join(process.cwd(), "src/content/use-cases");
let useCasePublicationCache: Readonly<UseCasePublicationCache> | null = null;

function normalizeUseCasePublicationFrontmatter(
  value: unknown,
  sourcePath: string,
): UseCasePublicationFrontmatter {
  if (!value || typeof value !== "object") {
    throw new Error(`Missing use-case frontmatter in ${sourcePath}`);
  }

  const frontmatter = value as Record<string, unknown>;
  const relatedIdsValue = frontmatter.relatedIds;
  const relatedIds = Array.isArray(relatedIdsValue)
    ? relatedIdsValue.map((item) => String(item))
    : [];
  const authorValue = frontmatter.author;
  const hideHeroImageOnDetailValue = frontmatter.hideHeroImageOnDetail;
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
    hideHeroImageOnDetail: hideHeroImageOnDetailValue === true,
    hidden: frontmatter.hidden === true,
    redirectUrl: typeof redirectUrlValue === "string" ? redirectUrlValue : undefined,
    relatedIds,
  };
}

function parseUseCasePublicationFrontmatter(
  source: string,
  sourcePath: string,
): UseCasePublicationFrontmatter {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    throw new Error(`Missing frontmatter block in ${sourcePath}`);
  }

  return normalizeUseCasePublicationFrontmatter(parseYaml(match[1]), sourcePath);
}

function loadUseCasePublicationRecords(): UseCasePublicationRecord[] {
  return fs
    .readdirSync(USE_CASE_POSTS_ROOT)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const sourcePath = path.join(USE_CASE_POSTS_ROOT, file);
      const source = fs.readFileSync(sourcePath, "utf8");
      const frontmatter = parseUseCasePublicationFrontmatter(source, sourcePath);

      return {
        ...frontmatter,
        sourcePath,
      };
    })
    .sort((left, right) => Number(right.id) - Number(left.id));
}

function createUseCasePublicationCache(): Readonly<UseCasePublicationCache> {
  const records = Object.freeze(loadUseCasePublicationRecords().map((record) => Object.freeze({ ...record })));
  const recordsById = new Map<string, UseCasePublicationRecord>(records.map((record) => [record.id, record]));
  const visibleRecords = records.filter((record) => !record.hidden);
  const listItems = Object.freeze(
    visibleRecords.map((record) =>
      Object.freeze({
        id: record.id,
        href: resolveRedirectablePublicationHref(record.redirectUrl, getPublicationHref("use-case", record.id, record.slug)),
        imageSrc: record.heroImageSrc,
        badge: "活用事例",
        title: record.title,
        description: record.description,
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

function getUseCasePublicationCache(): Readonly<UseCasePublicationCache> {
  if (useCasePublicationCache) {
    return useCasePublicationCache;
  }

  useCasePublicationCache = Object.freeze(createUseCasePublicationCache());
  return useCasePublicationCache;
}

export const useCasePublicationRecords = getUseCasePublicationCache().records;

export function listUseCasePublicationItems(): readonly UseCasePublicationListItem[] {
  return getUseCasePublicationCache().listItems;
}

export function listUseCasePublicationParams() {
  return getUseCasePublicationCache().records.map(({ id, slug }) => ({ id, slug }));
}

export function listUseCasePublicationIds() {
  return getUseCasePublicationCache().records.map(({ id }) => ({ id }));
}

export function getUseCasePublicationRecord(id: string) {
  return getUseCasePublicationCache().recordsById.get(id) ?? null;
}
