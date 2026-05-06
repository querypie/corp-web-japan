import * as fs from "node:fs";
import * as path from "node:path";
import { parse as parseYaml } from "yaml";
import type { ResourceItem } from "@/content/resources";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { resolveRedirectablePublicationHref } from "@/lib/publications/resolve-redirectable-publication-href";

export type AipDemoPublicationFrontmatter = {
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

export type AipDemoPublicationRecord = AipDemoPublicationFrontmatter & {
  sourcePath: string;
};

export type AipDemoPublicationListItem = ResourceItem;

type AipDemoPublicationCache = {
  records: readonly AipDemoPublicationRecord[];
  recordsById: ReadonlyMap<string, AipDemoPublicationRecord>;
  listItems: readonly AipDemoPublicationListItem[];
};

const AIP_DEMO_POSTS_ROOT = path.join(process.cwd(), "src/content/demo/aip");
let aipDemoPublicationCache: Readonly<AipDemoPublicationCache> | null = null;

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

function parseAipDemoPublicationFrontmatter(
  source: string,
  sourcePath: string,
): AipDemoPublicationFrontmatter {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    throw new Error(`Missing frontmatter block in ${sourcePath}`);
  }

  return normalizeAipDemoPublicationFrontmatter(parseYaml(match[1]), sourcePath);
}

function loadAipDemoPublicationRecords(): AipDemoPublicationRecord[] {
  return fs
    .readdirSync(AIP_DEMO_POSTS_ROOT)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const sourcePath = path.join(AIP_DEMO_POSTS_ROOT, file);
      const source = fs.readFileSync(sourcePath, "utf8");
      const frontmatter = parseAipDemoPublicationFrontmatter(source, sourcePath);

      return {
        ...frontmatter,
        sourcePath,
      };
    })
    .sort((left, right) => Number(right.id) - Number(left.id));
}

function createAipDemoPublicationCache(): Readonly<AipDemoPublicationCache> {
  const records = Object.freeze(loadAipDemoPublicationRecords().map((record) => Object.freeze({ ...record })));
  const recordsById = new Map<string, AipDemoPublicationRecord>(records.map((record) => [record.id, record]));
  const visibleRecords = records.filter((record) => !record.hidden);
  const listItems = Object.freeze(
    visibleRecords.map((record) =>
      Object.freeze({
        id: record.id,
        href: resolveRedirectablePublicationHref(record.redirectUrl, getPublicationHref("aip-demo", record.id, record.slug)),
        imageSrc: record.heroImageSrc,
        badge: "AIP機能",
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

function getAipDemoPublicationCache(): Readonly<AipDemoPublicationCache> {
  if (aipDemoPublicationCache) {
    return aipDemoPublicationCache;
  }

  aipDemoPublicationCache = Object.freeze(createAipDemoPublicationCache());
  return aipDemoPublicationCache;
}

export const aipDemoPublicationRecords = getAipDemoPublicationCache().records;

export function listAipDemoPublicationItems(): readonly AipDemoPublicationListItem[] {
  return getAipDemoPublicationCache().listItems;
}

export function listAipDemoPublicationParams() {
  return getAipDemoPublicationCache().records.map(({ id, slug }) => ({ id, slug }));
}

export function listAipDemoPublicationIds() {
  return getAipDemoPublicationCache().records.map(({ id }) => ({ id }));
}

export function getAipDemoPublicationRecord(id: string) {
  return getAipDemoPublicationCache().recordsById.get(id) ?? null;
}
