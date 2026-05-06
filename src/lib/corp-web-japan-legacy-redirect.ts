import { getWhitepaperPublicationRecord } from "@/lib/publications/whitepaper-publication-records";

const legacyWhitepaperPathPatterns = [
  /^\/resources\/discover\/whitepapers\/(?<id>\d+)\/[^/]+$/,
  /^\/resources\/discover\/white-paper\/(?<id>\d+)\/[^/]+$/,
] as const;

export function buildCorpWebJapanLegacyRedirectPath(pathname: string) {
  for (const pattern of legacyWhitepaperPathPatterns) {
    const match = pathname.match(pattern);
    const id = match?.groups?.id;

    if (!id) {
      continue;
    }

    const record = getWhitepaperPublicationRecord(id);

    if (!record) {
      return null;
    }

    return `/whitepapers/${record.id}/${record.slug}`;
  }

  return null;
}
