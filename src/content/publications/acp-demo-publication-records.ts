import * as fs from "node:fs";
import * as path from "node:path";
import { parse as parseYaml } from "yaml";
import type { ResourceItem } from "@/content/resources";
import { getPublicationHref } from "@/lib/publications/get-publication-href";

export type AcpDemoPublicationFrontmatter = {
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

export type AcpDemoPublicationRecord = AcpDemoPublicationFrontmatter & {
  sourcePath: string;
};

export type AcpDemoPublicationListItem = ResourceItem;

type AcpDemoPublicationCache = {
  records: readonly AcpDemoPublicationRecord[];
  recordsById: ReadonlyMap<string, AcpDemoPublicationRecord>;
  listItems: readonly AcpDemoPublicationListItem[];
};

const ACP_DEMO_POSTS_ROOT = path.join(process.cwd(), "src/content/demo/acp");
let acpDemoPublicationCache: Readonly<AcpDemoPublicationCache> | null = null;

function normalizeAcpDemoPublicationFrontmatter(
  value: unknown,
  sourcePath: string,
): AcpDemoPublicationFrontmatter {
  if (!value || typeof value !== "object") {
    throw new Error(`Missing ACP demo frontmatter in ${sourcePath}`);
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

function parseAcpDemoPublicationFrontmatter(
  source: string,
  sourcePath: string,
): AcpDemoPublicationFrontmatter {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    throw new Error(`Missing frontmatter block in ${sourcePath}`);
  }

  return normalizeAcpDemoPublicationFrontmatter(parseYaml(match[1]), sourcePath);
}

function loadAcpDemoPublicationRecords(): AcpDemoPublicationRecord[] {
  return fs
    .readdirSync(ACP_DEMO_POSTS_ROOT)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const sourcePath = path.join(ACP_DEMO_POSTS_ROOT, file);
      const source = fs.readFileSync(sourcePath, "utf8");
      const frontmatter = parseAcpDemoPublicationFrontmatter(source, sourcePath);

      return {
        ...frontmatter,
        sourcePath,
      };
    })
    .sort((left, right) => Number(right.id) - Number(left.id));
}

function createAcpDemoPublicationCache(): Readonly<AcpDemoPublicationCache> {
  const records = Object.freeze(loadAcpDemoPublicationRecords().map((record) => Object.freeze({ ...record })));
  const recordsById = new Map<string, AcpDemoPublicationRecord>(records.map((record) => [record.id, record]));
  const visibleRecords = records.filter((record) => !record.hidden);
  const listItems = Object.freeze(
    visibleRecords.map((record) =>
      Object.freeze({
        href: getPublicationHref("acp-demo", record.id, record.slug),
        imageSrc: record.heroImageSrc,
        badge: "ACP機能",
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

function getAcpDemoPublicationCache(): Readonly<AcpDemoPublicationCache> {
  if (acpDemoPublicationCache) {
    return acpDemoPublicationCache;
  }

  acpDemoPublicationCache = Object.freeze(createAcpDemoPublicationCache());
  return acpDemoPublicationCache;
}

export const acpDemoPublicationRecords = getAcpDemoPublicationCache().records;

export function listAcpDemoPublicationItems(): readonly AcpDemoPublicationListItem[] {
  return getAcpDemoPublicationCache().listItems;
}

export function listAcpDemoPublicationParams() {
  return getAcpDemoPublicationCache().records.map(({ id, slug }) => ({ id, slug }));
}

export function listAcpDemoPublicationIds() {
  return getAcpDemoPublicationCache().records.map(({ id }) => ({ id }));
}

export function getAcpDemoPublicationRecord(id: string) {
  return getAcpDemoPublicationCache().recordsById.get(id) ?? null;
}
