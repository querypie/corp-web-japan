import { resolveRedirectablePublicationHref } from "@/lib/publications/resolve-redirectable-publication-href";
import type { PublicationPostSummary } from "@/lib/publications/types";

type RelatedPublicationRecord = {
  id: string;
  slug: string;
  title: string;
  date: string;
  heroImageSrc: string;
  redirectUrl?: string;
};

type BuildRelatedPublicationItemsParams<TRecord extends RelatedPublicationRecord> = {
  records: readonly TRecord[];
  id: string;
  relatedIds: readonly string[];
  getHref: (id: string, slug: string) => string;
  formatDate?: (value: string) => string;
};

export function buildRelatedPublicationItems<TRecord extends RelatedPublicationRecord>({
  records,
  id,
  relatedIds,
  getHref,
  formatDate,
}: BuildRelatedPublicationItemsParams<TRecord>): PublicationPostSummary[] {
  const recordsById = new Map<string, TRecord>(records.map((record) => [record.id, record]));

  const toSummary = (record: TRecord): PublicationPostSummary => ({
    href: resolveRedirectablePublicationHref(record.redirectUrl, getHref(record.id, record.slug)),
    imageSrc: record.heroImageSrc,
    title: record.title,
    date: formatDate ? formatDate(record.date) : record.date,
  });

  if (relatedIds.length > 0) {
    return relatedIds
      .filter((relatedId) => relatedId !== id)
      .map((relatedId) => recordsById.get(relatedId) ?? null)
      .filter((record): record is TRecord => record !== null)
      .map(toSummary);
  }

  return records
    .filter((record) => record.id !== id)
    .slice(0, 3)
    .map(toSummary);
}
