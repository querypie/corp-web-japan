import {
  getWhitepaperPublicationRecord,
  listWhitepaperPublicationIds,
  listWhitepaperPublicationParams,
  whitepaperPublicationRecords,
  type WhitepaperPublicationFrontmatter,
  type WhitepaperPublicationRecord,
} from "@/lib/publications/whitepaper-publication-records";
import { createGatedPublicationPostLoader } from "@/lib/publications/create-gated-publication-post-loader";
import { getPublicationHref } from "@/lib/publications/get-publication-href";

export { getWhitepaperPublicationRecord, listWhitepaperPublicationIds, listWhitepaperPublicationParams };

export const getWhitepaperPublicationPost = createGatedPublicationPostLoader<
  WhitepaperPublicationFrontmatter,
  WhitepaperPublicationRecord
>({
  category: "whitepaper",
  categoryLabel: "ホワイトペーパー",
  relatedTitle: "関連記事",
  defaultAuthorAvatarSrc: "/querypie-logo.svg",
  records: whitepaperPublicationRecords,
  getRecord: getWhitepaperPublicationRecord,
  getHref: getWhitepaperPublicationHref,
});

export function getWhitepaperPublicationHref(id: string, slug: string) {
  return getPublicationHref("whitepaper", id, slug);
}
