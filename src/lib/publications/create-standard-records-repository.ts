import * as fs from "node:fs";
import * as path from "node:path";
import { parse as parseYaml } from "yaml";
import type { ResourceItem } from "@/content/resources";
import { formatJapaneseDateFromIsoDate } from "@/lib/publications/format-japanese-date";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { resolveRedirectablePublicationHref } from "@/lib/publications/resolve-redirectable-publication-href";
import type { PublicationCategory } from "@/lib/publications/types";

export type StandardPublicationFrontmatter = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  heroImageSrc: string;
  hidden?: boolean;
  redirectUrl?: string;
  relatedIds: readonly string[];
};

export type StandardPublicationRecord<TFrontmatter extends StandardPublicationFrontmatter> = TFrontmatter & {
  sourcePath: string;
};

type CreateStandardPublicationRecordsRepositoryConfig<
  TFrontmatter extends StandardPublicationFrontmatter,
  TRecord extends StandardPublicationRecord<TFrontmatter>,
  TListItem,
> = {
  contentRoot: string;
  category: PublicationCategory;
  badge: string;
  normalizeFrontmatter: (value: unknown, sourcePath: string) => TFrontmatter;
  createRecord?: (frontmatter: TFrontmatter, sourcePath: string) => TRecord;
  getListItemBadge?: (record: TRecord) => string;
  createListItem?: (record: TRecord, href: string) => TListItem;
  getListItemDescription?: (record: TRecord) => string;
};

type StandardPublicationRecordsRepository<
  TFrontmatter extends StandardPublicationFrontmatter,
  TRecord extends StandardPublicationRecord<TFrontmatter>,
  TListItem,
> = {
  records: readonly TRecord[];
  listItems: readonly TListItem[];
  listParams: () => Array<{ id: string; slug: string }>;
  listIds: () => Array<{ id: string }>;
  getRecord: (id: string) => TRecord | null;
};

export function createStandardPublicationRecordsRepository<
  TFrontmatter extends StandardPublicationFrontmatter,
  TRecord extends StandardPublicationRecord<TFrontmatter> = StandardPublicationRecord<TFrontmatter>,
  TListItem = ResourceItem,
>(
  config: CreateStandardPublicationRecordsRepositoryConfig<TFrontmatter, TRecord, TListItem>,
): StandardPublicationRecordsRepository<TFrontmatter, TRecord, TListItem> {
  const parseFrontmatter = (source: string, sourcePath: string) => {
    const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
    if (!match) {
      throw new Error(`Missing frontmatter block in ${sourcePath}`);
    }

    return config.normalizeFrontmatter(parseYaml(match[1]), sourcePath);
  };

  const records = Object.freeze(
    fs
      .readdirSync(config.contentRoot)
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => {
        const sourcePath = path.join(config.contentRoot, file);
        const source = fs.readFileSync(sourcePath, "utf8");
        const frontmatter = parseFrontmatter(source, sourcePath);

        if (config.createRecord) {
          return Object.freeze(config.createRecord(frontmatter, sourcePath));
        }

        return Object.freeze({
          ...frontmatter,
          sourcePath,
        } as TRecord);
      })
      .sort((left, right) => Number(right.id) - Number(left.id)),
  );

  const recordsById = new Map<string, TRecord>(records.map((record) => [record.id, record]));
  const visibleRecords = records.filter((record) => !record.hidden);
  const listItems = Object.freeze(
    visibleRecords.map((record) => {
      const href = resolveRedirectablePublicationHref(
        record.redirectUrl,
        getPublicationHref(config.category, record.id, record.slug),
      );

      if (config.createListItem) {
        return Object.freeze(config.createListItem(record, href));
      }

      return Object.freeze({
        id: record.id,
        href,
        imageSrc: record.heroImageSrc,
        badge: config.getListItemBadge?.(record) ?? config.badge,
        title: record.title,
        description: config.getListItemDescription?.(record) ?? record.description,
        date: formatJapaneseDateFromIsoDate(record.date),
      } as TListItem);
    }),
  );

  return {
    records,
    listItems,
    listParams() {
      return records.map(({ id, slug }) => ({ id, slug }));
    },
    listIds() {
      return records.map(({ id }) => ({ id }));
    },
    getRecord(id: string) {
      return recordsById.get(id) ?? null;
    },
  };
}
