import type { ResourceItem } from "@/content/resources";

export const DEFAULT_RESOURCE_LIST_CHUNK_SIZE = 8;

type ResourceItemWithId = Pick<ResourceItem, "id">;

function normalizeUntilId(untilId: string | string[] | undefined) {
  if (Array.isArray(untilId)) {
    return untilId.at(-1);
  }

  return untilId;
}

export function resolveResourceListVisibleCount(
  items: readonly ResourceItemWithId[],
  untilId: string | string[] | undefined,
  chunkSize = DEFAULT_RESOURCE_LIST_CHUNK_SIZE,
) {
  const defaultVisibleCount = Math.min(chunkSize, items.length);
  const normalizedUntilId = normalizeUntilId(untilId);

  if (!normalizedUntilId) {
    return defaultVisibleCount;
  }

  const itemIndex = items.findIndex((item) => item.id === normalizedUntilId);
  if (itemIndex < 0) {
    return defaultVisibleCount;
  }

  const rawVisibleCount = itemIndex + 1;
  const roundedVisibleCount = Math.ceil(rawVisibleCount / chunkSize) * chunkSize;

  return Math.min(items.length, Math.max(defaultVisibleCount, roundedVisibleCount));
}

export function getResourceListNextVisibleCount(
  currentVisibleCount: number,
  totalCount: number,
  chunkSize = DEFAULT_RESOURCE_LIST_CHUNK_SIZE,
) {
  return Math.min(currentVisibleCount + chunkSize, totalCount);
}

export function getResourceListLoadedRange(items: readonly ResourceItemWithId[], visibleCount: number) {
  if (items.length === 0 || visibleCount <= 0) {
    return null;
  }

  const safeVisibleCount = Math.min(visibleCount, items.length);
  const visibleItems = items.slice(0, safeVisibleCount);
  const newestItem = visibleItems[0];
  const oldestItem = visibleItems.at(-1);

  if (!newestItem || !oldestItem) {
    return null;
  }

  return {
    newestId: newestItem.id,
    oldestId: oldestItem.id,
  };
}
