import * as path from "node:path";
import type { ResourceItem } from "@/content/resources";
import {
  createStandardPublicationRecordsRepository,
  type StandardPublicationRecord,
} from "@/lib/publications/create-standard-records-repository";

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

export type EventPublicationRecord = StandardPublicationRecord<EventPublicationFrontmatter>;

export type EventPublicationListItem = ResourceItem;

const EVENT_POSTS_ROOT = path.join(process.cwd(), "src/content/events");

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

const eventPublicationRepository = createStandardPublicationRecordsRepository<EventPublicationFrontmatter>({
  contentRoot: EVENT_POSTS_ROOT,
  category: "event",
  badge: "イベント",
  normalizeFrontmatter: normalizeEventPublicationFrontmatter,
  getListItemBadge: (record) => record.eventLabel ?? "イベント",
});

export const eventPublicationRecords = eventPublicationRepository.records;

export function listEventPublicationItems(): readonly EventPublicationListItem[] {
  return eventPublicationRepository.listItems;
}

export function listEventPublicationParams() {
  return eventPublicationRepository.listParams();
}

export function listEventPublicationIds() {
  return eventPublicationRepository.listIds();
}

export function getEventPublicationRecord(id: string) {
  return eventPublicationRepository.getRecord(id);
}
