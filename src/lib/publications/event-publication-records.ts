import * as fs from "node:fs";
import * as path from "node:path";
import { parse as parseYaml } from "yaml";
import { getPublicationHref } from "@/lib/publications/get-publication-href";

export type EventPublicationFrontmatter = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  heroImageSrc: string;
  eventLabel?: string;
  hideHeroImageOnDetail?: boolean;
  author?: string | string[];
  hidden?: boolean;
  redirectUrl?: string;
  relatedIds: readonly string[];
};

export type EventPublicationRecord = EventPublicationFrontmatter & {
  sourcePath: string;
};

export type EventPublicationListItem = {
  href: string;
  imageSrc: string;
  badge: string;
  title: string;
  description: string;
  date?: string;
};

type EventPublicationCache = {
  records: readonly EventPublicationRecord[];
  recordsById: ReadonlyMap<string, EventPublicationRecord>;
  listItems: readonly EventPublicationListItem[];
};

const EVENT_POSTS_ROOT = path.join(process.cwd(), "src/content/events");
let eventPublicationCache: Readonly<EventPublicationCache> | null = null;

function normalizeEventPublicationFrontmatter(value: unknown, sourcePath: string): EventPublicationFrontmatter {
  if (!value || typeof value !== "object") {
    throw new Error(`Missing event frontmatter in ${sourcePath}`);
  }

  const frontmatter = value as Record<string, unknown>;
  const relatedIdsValue = frontmatter.relatedIds;
  const relatedIds = Array.isArray(relatedIdsValue)
    ? relatedIdsValue.map((item) => String(item))
    : [];
  const authorValue = frontmatter.author;
  const eventLabelValue = frontmatter.eventLabel;
  const hideHeroImageOnDetailValue = frontmatter.hideHeroImageOnDetail;
  const redirectUrlValue = frontmatter.redirectUrl;

  return {
    id: String(frontmatter.id ?? ""),
    slug: String(frontmatter.slug ?? ""),
    title: String(frontmatter.title ?? ""),
    description: String(frontmatter.description ?? ""),
    date: String(frontmatter.date ?? ""),
    heroImageSrc: String(frontmatter.heroImageSrc ?? ""),
    eventLabel: typeof eventLabelValue === "string" ? eventLabelValue : undefined,
    hideHeroImageOnDetail: hideHeroImageOnDetailValue === true,
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

function parseEventPublicationFrontmatter(source: string, sourcePath: string): EventPublicationFrontmatter {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    throw new Error(`Missing frontmatter block in ${sourcePath}`);
  }

  return normalizeEventPublicationFrontmatter(parseYaml(match[1]), sourcePath);
}

function loadEventPublicationRecords(): EventPublicationRecord[] {
  return fs
    .readdirSync(EVENT_POSTS_ROOT)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const sourcePath = path.join(EVENT_POSTS_ROOT, file);
      const source = fs.readFileSync(sourcePath, "utf8");
      const frontmatter = parseEventPublicationFrontmatter(source, sourcePath);

      return {
        ...frontmatter,
        sourcePath,
      };
    })
    .sort((left, right) => Number(right.id) - Number(left.id));
}

function createEventPublicationCache(): Readonly<EventPublicationCache> {
  const records = Object.freeze(loadEventPublicationRecords().map((record) => Object.freeze({ ...record })));
  const recordsById = new Map<string, EventPublicationRecord>(records.map((record) => [record.id, record]));
  const visibleRecords = records.filter((record) => !record.hidden);
  const listItems = Object.freeze(
    visibleRecords.map((record) =>
      Object.freeze({
        href: getPublicationHref("event", record.id, record.slug),
        imageSrc: record.heroImageSrc,
        badge: record.eventLabel ?? "イベント",
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

function getEventPublicationCache(): Readonly<EventPublicationCache> {
  if (eventPublicationCache) {
    return eventPublicationCache;
  }

  eventPublicationCache = Object.freeze(createEventPublicationCache());
  return eventPublicationCache;
}

export const eventPublicationRecords = getEventPublicationCache().records;

export function listEventPublicationItems(): readonly EventPublicationListItem[] {
  return getEventPublicationCache().listItems;
}

export function listEventPublicationParams() {
  return getEventPublicationCache().records.map(({ id, slug }) => ({ id, slug }));
}

export function listEventPublicationIds() {
  return getEventPublicationCache().records.map(({ id }) => ({ id }));
}

export function getEventPublicationRecord(id: string) {
  return getEventPublicationCache().recordsById.get(id) ?? null;
}
