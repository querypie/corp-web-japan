import {
  eventPublicationRecords,
  listEventPublicationItems,
  type EventPublicationRecord,
} from "@/lib/publications/events/records";

export type EventPostRecord = EventPublicationRecord;

export function getEventPostHref(id: string, slug: string) {
  return "/events/" + id + "/" + slug;
}

export const eventPostRecords: readonly EventPostRecord[] = eventPublicationRecords;
export const eventItems = listEventPublicationItems();
