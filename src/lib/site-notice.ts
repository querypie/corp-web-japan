import * as fs from "node:fs";
import * as path from "node:path";
import { parse } from "yaml";

export type SiteNoticeFeaturedItem = {
  id: string;
  href: string;
  imageAlt: string;
  imageSrc: string;
  title: string;
  meta: string;
  indicatorLabel: string;
  spotlightMeta: string;
  visibleUntil: string;
};

export type ActiveSiteNoticeFeaturedItem = Omit<SiteNoticeFeaturedItem, "visibleUntil">;

export type SiteNoticeFeaturedContent = {
  ariaLabel: string;
  badgeLabel: string;
  items: readonly SiteNoticeFeaturedItem[];
  nextLabel: string;
  previousLabel: string;
  spotlightCtaLabel: string;
  spotlightDismissLabel: string;
  spotlightLabel: string;
  viewAllHref: string;
  viewAllLabel: string;
};

export type ActiveSiteNoticeFeaturedContent = Omit<SiteNoticeFeaturedContent, "items"> & {
  items: readonly ActiveSiteNoticeFeaturedItem[];
};

export type LoadSiteNoticeFeaturedOptions = {
  contentRoot?: string;
  today?: string;
};

const defaultContentRoot = path.join(process.cwd(), "src/content/site-notice");
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)+$/;

const contentFields = [
  "ariaLabel",
  "badgeLabel",
  "nextLabel",
  "previousLabel",
  "spotlightCtaLabel",
  "spotlightDismissLabel",
  "spotlightLabel",
  "viewAllHref",
  "viewAllLabel",
] as const;

const itemFields = [
  "id",
  "href",
  "imageAlt",
  "imageSrc",
  "title",
  "meta",
  "indicatorLabel",
  "spotlightMeta",
  "visibleUntil",
] as const;

const allowedContentFields = new Set<string>([...contentFields, "items"]);
const allowedItemFields = new Set<string>(itemFields);

function assertDateString(value: string, sourcePath: string, fieldName: string) {
  if (!datePattern.test(value)) {
    throw new Error(`Expected ${fieldName} in ${sourcePath} to use YYYY-MM-DD format`);
  }
}

function todayInTokyo() {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Tokyo",
    year: "numeric",
  }).format(new Date());
}

function assertRecord(value: unknown, sourcePath: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Expected site notice featured content object in ${sourcePath}`);
  }

  return value as Record<string, unknown>;
}

function assertAllowedKeys(record: Record<string, unknown>, allowedFields: Set<string>, sourcePath: string) {
  const unknownFields = Object.keys(record).filter((fieldName) => !allowedFields.has(fieldName));

  if (unknownFields.length > 0) {
    throw new Error(`Unexpected site notice field(s) in ${sourcePath}: ${unknownFields.join(", ")}`);
  }
}

function readString(record: Record<string, unknown>, fieldName: string, sourcePath: string) {
  const value = record[fieldName];

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Expected non-empty string field "${fieldName}" in ${sourcePath}`);
  }

  return value;
}

function normalizeItem(value: unknown, sourcePath: string, index: number): SiteNoticeFeaturedItem {
  const record = assertRecord(value, `${sourcePath} item ${index + 1}`);
  assertAllowedKeys(record, allowedItemFields, `${sourcePath} item ${index + 1}`);

  const item: SiteNoticeFeaturedItem = {
    href: readString(record, "href", sourcePath),
    id: readString(record, "id", sourcePath),
    imageAlt: readString(record, "imageAlt", sourcePath),
    imageSrc: readString(record, "imageSrc", sourcePath),
    indicatorLabel: readString(record, "indicatorLabel", sourcePath),
    meta: readString(record, "meta", sourcePath),
    spotlightMeta: readString(record, "spotlightMeta", sourcePath),
    title: readString(record, "title", sourcePath),
    visibleUntil: readString(record, "visibleUntil", sourcePath),
  };

  assertDateString(item.visibleUntil, sourcePath, `items[${index}].visibleUntil`);

  if (!idPattern.test(item.id)) {
    throw new Error(`Expected items[${index}].id in ${sourcePath} to be a specific kebab-case key`);
  }

  return item;
}

function stripVisibilityDate(item: SiteNoticeFeaturedItem): ActiveSiteNoticeFeaturedItem {
  return {
    href: item.href,
    id: item.id,
    imageAlt: item.imageAlt,
    imageSrc: item.imageSrc,
    indicatorLabel: item.indicatorLabel,
    meta: item.meta,
    spotlightMeta: item.spotlightMeta,
    title: item.title,
  };
}

export function loadSiteNoticeFeaturedContent(
  options: LoadSiteNoticeFeaturedOptions = {},
): SiteNoticeFeaturedContent {
  const sourcePath = path.join(options.contentRoot ?? defaultContentRoot, "featured.ja.yaml");
  const source = fs.readFileSync(sourcePath, "utf8");
  const record = assertRecord(parse(source), sourcePath);

  assertAllowedKeys(record, allowedContentFields, sourcePath);

  if (!Array.isArray(record.items)) {
    throw new Error(`Expected site notice featured content items array in ${sourcePath}`);
  }

  return {
    ariaLabel: readString(record, "ariaLabel", sourcePath),
    badgeLabel: readString(record, "badgeLabel", sourcePath),
    items: record.items.map((item, index) => normalizeItem(item, sourcePath, index)),
    nextLabel: readString(record, "nextLabel", sourcePath),
    previousLabel: readString(record, "previousLabel", sourcePath),
    spotlightCtaLabel: readString(record, "spotlightCtaLabel", sourcePath),
    spotlightDismissLabel: readString(record, "spotlightDismissLabel", sourcePath),
    spotlightLabel: readString(record, "spotlightLabel", sourcePath),
    viewAllHref: readString(record, "viewAllHref", sourcePath),
    viewAllLabel: readString(record, "viewAllLabel", sourcePath),
  };
}

export function getActiveSiteNoticeFeaturedContent(
  options: LoadSiteNoticeFeaturedOptions = {},
): ActiveSiteNoticeFeaturedContent | null {
  const today = options.today ?? todayInTokyo();
  assertDateString(today, "site notice featured content options", "today");

  const content = loadSiteNoticeFeaturedContent(options);
  const items = content.items.filter((item) => item.visibleUntil >= today).map(stripVisibilityDate);

  if (items.length === 0) {
    return null;
  }

  return {
    ...content,
    items,
  };
}
