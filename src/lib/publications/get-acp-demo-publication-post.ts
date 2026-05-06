import {
  acpDemoPublicationRecords,
  getAcpDemoPublicationRecord,
  listAcpDemoPublicationIds,
  listAcpDemoPublicationParams,
  type AcpDemoPublicationFrontmatter,
  type AcpDemoPublicationRecord,
} from "@/lib/publications/acp-demo-publication-records";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { createStandardPublicationPostLoader } from "@/lib/publications/create-standard-publication-post-loader";

export { getAcpDemoPublicationRecord, listAcpDemoPublicationIds, listAcpDemoPublicationParams };

export const getAcpDemoPublicationPost = createStandardPublicationPostLoader<
  AcpDemoPublicationFrontmatter,
  AcpDemoPublicationRecord
>({
  category: "acp-demo",
  categoryLabel: "ACP機能",
  relatedTitle: "関連ACPデモ",
  defaultAuthorAvatarSrc: "/querypie-logo.svg",
  records: acpDemoPublicationRecords,
  getRecord: getAcpDemoPublicationRecord,
  getHref: getAcpDemoPublicationHref,
});

export function getAcpDemoPublicationHref(id: string, slug: string) {
  return getPublicationHref("acp-demo", id, slug);
}
