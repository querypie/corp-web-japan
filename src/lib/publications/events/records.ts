import * as path from "node:path";
import type { ResourceItem } from "@/content/resources";
import {
  createStandardPublicationRecordsRepository,
  type StandardPublicationRecord,
} from "@/lib/publications/create-standard-records-repository";
import { formatJapaneseDateFromIsoDate } from "@/lib/publications/format-japanese-date";

export type EventPublicationFrontmatter = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  eventDate?: string;
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
const EVENT_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseIsoCalendarDate(value: string) {
  if (!EVENT_DATE_PATTERN.test(value)) {
    return null;
  }

  const parsedDate = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString().slice(0, 10) === value ? value : null;
}

function getCurrentJstDate() {
  const formatter = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("Failed to derive the current JST date.");
  }

  return `${year}-${month}-${day}`;
}

function normalizeAsofDate(value?: string | string[]) {
  const candidate = Array.isArray(value) ? value.at(0) : value;
  const normalizedCandidate = candidate ? parseIsoCalendarDate(candidate) : null;

  if (normalizedCandidate) {
    return normalizedCandidate;
  }

  return getCurrentJstDate();
}

function normalizeUpcomingMode(value?: string | string[]) {
  const candidate = Array.isArray(value) ? value.at(0) : value;
  return candidate === "none" ? "none" : "show";
}

function getEffectiveEventDate(record: EventPublicationRecord) {
  return record.eventDate ?? record.date;
}

function isUpcomingEvent(record: EventPublicationRecord, asofDate: string) {
  return getEffectiveEventDate(record) >= asofDate;
}

function compareUpcomingEvents(left: EventPublicationRecord, right: EventPublicationRecord) {
  return getEffectiveEventDate(left).localeCompare(getEffectiveEventDate(right)) || Number(right.id) - Number(left.id);
}

function comparePastEvents(left: EventPublicationRecord, right: EventPublicationRecord) {
  return getEffectiveEventDate(right).localeCompare(getEffectiveEventDate(left)) || Number(right.id) - Number(left.id);
}

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
  const eventDateValue = frontmatter.eventDate;
  const eventLabelValue = frontmatter.eventLabel;
  const hideHeroImageOnDetailValue = frontmatter.hideHeroImageOnDetail;
  const redirectUrlValue = frontmatter.redirectUrl;

  if (typeof eventDateValue === "string" && !parseIsoCalendarDate(eventDateValue)) {
    throw new Error(`Invalid eventDate in ${sourcePath}: ${eventDateValue}`);
  }

  return {
    id: String(frontmatter.id ?? ""),
    slug: String(frontmatter.slug ?? ""),
    title: String(frontmatter.title ?? ""),
    description: String(frontmatter.description ?? ""),
    date: String(frontmatter.date ?? ""),
    eventDate: typeof eventDateValue === "string" ? eventDateValue : undefined,
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
  createListItem: (record, href) => ({
    id: record.id,
    href,
    imageSrc: record.heroImageSrc,
    badge: record.eventLabel ?? "イベント",
    title: record.title,
    description: record.description,
    date: formatJapaneseDateFromIsoDate(getEffectiveEventDate(record)),
  }),
});

const eventListItemsById = new Map(eventPublicationRepository.listItems.map((item) => [item.id, item]));

function getEventListItem(record: EventPublicationRecord): EventPublicationListItem {
  const item = eventListItemsById.get(record.id);

  if (!item) {
    throw new Error(`Missing event list item for event ${record.id}`);
  }

  return item;
}

function getVisibleEventRecords() {
  return eventPublicationRecords.filter((record) => !record.hidden);
}

export const eventPublicationRecords = eventPublicationRepository.records;

export function listEventPublicationItems(): readonly EventPublicationListItem[] {
  return eventPublicationRepository.listItems;
}

export function resolveEventTimeline(asof?: string | string[]) {
  const asofDate = normalizeAsofDate(asof);
  const visibleRecords = getVisibleEventRecords();
  const upcomingEvents = visibleRecords.filter((record) => isUpcomingEvent(record, asofDate)).sort(compareUpcomingEvents);
  const heroEvent = upcomingEvents.at(0) ? getEventListItem(upcomingEvents.at(0)!) : null;
  const pastEvents = visibleRecords
    .filter((record) => !isUpcomingEvent(record, asofDate))
    .sort(comparePastEvents)
    .map((record) => getEventListItem(record));

  return {
    asofDate,
    heroEvent,
    pastEvents,
  };
}

export function resolveInternalEventsDemoState(params?: {
  asof?: string | string[];
  upcoming?: string | string[];
}) {
  const { pastEvents } = resolveEventTimeline(params?.asof);
  const visibleRecords = getVisibleEventRecords().sort(comparePastEvents);
  const demoHeroEvent = visibleRecords.at(0) ? getEventListItem(visibleRecords.at(0)!) : null;
  const showUpcomingEvent = demoHeroEvent ? normalizeUpcomingMode(params?.upcoming) === "show" : false;
  const visiblePastEvents = demoHeroEvent ? pastEvents.filter((event) => event.id !== demoHeroEvent.id) : pastEvents;

  return {
    demoHeroEvent,
    showUpcomingEvent,
    visiblePastEvents,
  };
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
