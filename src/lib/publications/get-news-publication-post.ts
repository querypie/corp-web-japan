import {
  getNewsPublicationRecord,
  listNewsPublicationIds,
  listNewsPublicationParams,
  newsPublicationRecords,
  type NewsPublicationFrontmatter,
  type NewsPublicationRecord,
} from "@/lib/publications/news-publication-records";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { createStandardPublicationPostLoader } from "@/lib/publications/create-standard-publication-post-loader";

export { getNewsPublicationRecord, listNewsPublicationIds, listNewsPublicationParams };

export const getNewsPublicationPost = createStandardPublicationPostLoader<
  NewsPublicationFrontmatter,
  NewsPublicationRecord
>({
  category: "news",
  categoryLabel: "ニュース",
  relatedTitle: "関連ニュース",
  defaultAuthorAvatarSrc: "/querypie-logo.svg",
  records: newsPublicationRecords,
  getRecord: getNewsPublicationRecord,
  getHref: getNewsPublicationHref,
});

export function getNewsPublicationHref(id: string, slug: string) {
  return getPublicationHref("news", id, slug);
}
