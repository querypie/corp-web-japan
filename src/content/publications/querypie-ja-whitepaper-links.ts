import type { ResourceItem } from "@/content/resources";
import { whitepaperPublicationRecords } from "@/lib/publications/whitepaper-publication-records";

const QUERYPIE_JAPAN_WHITEPAPER_BASE_URL = "https://www.querypie.com/ja/features/documentation/white-paper";

function getQueryPieJapanWhitepaperHref(id: string, slug: string) {
  return `${QUERYPIE_JAPAN_WHITEPAPER_BASE_URL}/${id}/${slug}`;
}

export const querypieJapanWhitepaperItems: readonly ResourceItem[] = whitepaperPublicationRecords
  .filter((record) => !record.hidden)
  .map((record) => ({
    href: getQueryPieJapanWhitepaperHref(record.id, record.slug),
    imageSrc: record.heroImageSrc,
    badge: "ホワイトペーパー",
    title: record.title,
    description: record.listDescription ?? record.description,
    date: record.date,
  }));
