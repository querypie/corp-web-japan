export const SITE_NOTICE_SPOTLIGHT_STORAGE_KEY = "querypie:site-notice:spotlight:v1";
export const SITE_NOTICE_SPOTLIGHT_VISIBILITY_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type SiteNoticeSpotlightDisposition = "viewed" | "dismissed";

export type SiteNoticeSpotlightVisibilityRecord = {
  disposition: SiteNoticeSpotlightDisposition;
  updatedAt: string;
  expiresAt: string;
};

export type SiteNoticeSpotlightVisibilityState = Record<string, SiteNoticeSpotlightVisibilityRecord>;

export type ParsedSiteNoticeSpotlightRecord = SiteNoticeSpotlightVisibilityRecord & {
  id: string;
  isExpired: boolean;
};

const siteNoticeKeyMarkers = ["site-notice", "floating-spotlight", "spotlight"];
const validDispositions = new Set<SiteNoticeSpotlightDisposition>(["viewed", "dismissed"]);

export function getSiteNoticeBrowserLocalStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function assertTimestamp(value: unknown, fieldName: string, recordId: string): string {
  if (typeof value !== "string" || !Number.isFinite(Date.parse(value))) {
    throw new Error(`Invalid ${fieldName} timestamp for ${recordId}`);
  }

  return value;
}

function normalizeVisibilityRecord(
  id: string,
  candidate: unknown,
  now: Date,
): ParsedSiteNoticeSpotlightRecord {
  if (!isObject(candidate)) {
    throw new Error(`Expected spotlight visibility record for ${id} to be an object`);
  }

  const disposition = candidate.disposition;

  if (typeof disposition !== "string" || !validDispositions.has(disposition as SiteNoticeSpotlightDisposition)) {
    throw new Error(`Invalid disposition for ${id}`);
  }

  const updatedAt = assertTimestamp(candidate.updatedAt, "updatedAt", id);
  const expiresAt = assertTimestamp(candidate.expiresAt, "expiresAt", id);

  return {
    disposition: disposition as SiteNoticeSpotlightDisposition,
    expiresAt,
    id,
    isExpired: Date.parse(expiresAt) <= now.getTime(),
    updatedAt,
  };
}

function persistVisibilityState(storage: Storage, state: SiteNoticeSpotlightVisibilityState) {
  if (Object.keys(state).length === 0) {
    storage.removeItem(SITE_NOTICE_SPOTLIGHT_STORAGE_KEY);
    return;
  }

  storage.setItem(SITE_NOTICE_SPOTLIGHT_STORAGE_KEY, JSON.stringify(state));
}

export function isSiteNoticeLocalStorageKey(key: string) {
  const normalizedKey = key.toLowerCase();

  return siteNoticeKeyMarkers.some((marker) => normalizedKey.includes(marker));
}

export function parseSiteNoticeSpotlightVisibilityRecords(
  rawValue: string,
  now: Date = new Date(),
): ParsedSiteNoticeSpotlightRecord[] {
  const parsedValue: unknown = JSON.parse(rawValue);

  if (!isObject(parsedValue)) {
    throw new Error("Expected spotlight visibility state to be an object map");
  }

  return Object.entries(parsedValue)
    .map(([id, candidate]) => normalizeVisibilityRecord(id, candidate, now))
    .sort((left, right) => left.id.localeCompare(right.id));
}

export function readSiteNoticeSpotlightVisibilityState(
  storage: Storage,
  now: Date = new Date(),
): SiteNoticeSpotlightVisibilityState {
  try {
    const rawValue = storage.getItem(SITE_NOTICE_SPOTLIGHT_STORAGE_KEY);

    if (!rawValue) {
      return {};
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    if (!isObject(parsedValue)) {
      try {
        storage.removeItem(SITE_NOTICE_SPOTLIGHT_STORAGE_KEY);
      } catch {
        // Storage cleanup is best effort; the component can still render from an empty state.
      }

      return {};
    }

    const nextState: SiteNoticeSpotlightVisibilityState = {};
    let shouldPersistPrunedState = false;

    for (const [id, candidate] of Object.entries(parsedValue)) {
      try {
        const record = normalizeVisibilityRecord(id, candidate, now);

        if (record.isExpired) {
          shouldPersistPrunedState = true;
          continue;
        }

        nextState[id] = {
          disposition: record.disposition,
          expiresAt: record.expiresAt,
          updatedAt: record.updatedAt,
        };
      } catch {
        shouldPersistPrunedState = true;
      }
    }

    if (shouldPersistPrunedState) {
      try {
        persistVisibilityState(storage, nextState);
      } catch {
        // Pruning failure must not block visibility decisions.
      }
    }

    return nextState;
  } catch {
    return {};
  }
}

export function writeSiteNoticeSpotlightVisibilityRecord(
  storage: Storage,
  id: string,
  disposition: SiteNoticeSpotlightDisposition,
  now: Date = new Date(),
) {
  try {
    const updatedAt = now.toISOString();
    const expiresAt = new Date(now.getTime() + SITE_NOTICE_SPOTLIGHT_VISIBILITY_TTL_MS).toISOString();
    const nextState = {
      ...readSiteNoticeSpotlightVisibilityState(storage, now),
      [id]: {
        disposition,
        expiresAt,
        updatedAt,
      },
    };

    storage.setItem(SITE_NOTICE_SPOTLIGHT_STORAGE_KEY, JSON.stringify(nextState));

    return true;
  } catch {
    return false;
  }
}
