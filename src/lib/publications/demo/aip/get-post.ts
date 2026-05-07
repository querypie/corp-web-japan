import {
  aipDemoPublicationRecords,
  getAipDemoPublicationRecord,
  listAipDemoPublicationIds,
  listAipDemoPublicationParams,
  type AipDemoPublicationFrontmatter,
  type AipDemoPublicationRecord,
} from "@/lib/publications/demo/aip/records";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { createStandardPublicationPostLoader } from "@/lib/publications/create-standard-publication-post-loader";

export { getAipDemoPublicationRecord, listAipDemoPublicationIds, listAipDemoPublicationParams };

export const getAipDemoPublicationPost = createStandardPublicationPostLoader<
  AipDemoPublicationFrontmatter,
  AipDemoPublicationRecord
>({
  category: "aip-demo",
  categoryLabel: "AIP機能",
  relatedTitle: "関連AIP活用事例",
  defaultAuthorAvatarSrc: "/querypie-logo.svg",
  records: aipDemoPublicationRecords,
  getRecord: getAipDemoPublicationRecord,
  getHref: getAipDemoPublicationHref,
});

export function getAipDemoPublicationHref(id: string, slug: string) {
  return getPublicationHref("aip-demo", id, slug);
}
