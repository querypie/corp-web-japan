import {
  eventPublicationRecords,
  getEventPublicationRecord,
  listEventPublicationIds,
  listEventPublicationParams,
  type EventPublicationFrontmatter,
  type EventPublicationRecord,
} from "@/lib/publications/event-publication-records";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { createStandardPublicationPostLoader } from "@/lib/publications/create-standard-publication-post-loader";

export { getEventPublicationRecord, listEventPublicationIds, listEventPublicationParams };

export const getEventPublicationPost = createStandardPublicationPostLoader<
  EventPublicationFrontmatter,
  EventPublicationRecord
>({
  category: "event",
  categoryLabel: "イベント",
  relatedTitle: "関連イベント",
  defaultAuthorAvatarSrc: "/querypie-logo.svg",
  records: eventPublicationRecords,
  getRecord: getEventPublicationRecord,
  getHref: getEventPublicationHref,
  fallbackToAllRecords: true,
});

export function getEventPublicationHref(id: string, slug: string) {
  return getPublicationHref("event", id, slug);
}
