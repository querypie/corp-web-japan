import {
  getUseCasePublicationRecord,
  listUseCasePublicationIds,
  listUseCasePublicationParams,
  useCasePublicationRecords,
  type UseCasePublicationFrontmatter,
  type UseCasePublicationRecord,
} from "@/lib/publications/use-cases/records";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { createStandardPublicationPostLoader } from "@/lib/publications/create-standard-publication-post-loader";

export { getUseCasePublicationRecord, listUseCasePublicationIds, listUseCasePublicationParams };

export const getUseCasePublicationPost = createStandardPublicationPostLoader<
  UseCasePublicationFrontmatter,
  UseCasePublicationRecord
>({
  category: "use-case",
  categoryLabel: "活用事例",
  relatedTitle: "関連活用事例",
  defaultAuthorAvatarSrc: "/querypie-logo.svg",
  records: useCasePublicationRecords,
  getRecord: getUseCasePublicationRecord,
  getHref: getUseCasePublicationHref,
});

export function getUseCasePublicationHref(id: string, slug: string) {
  return getPublicationHref("use-case", id, slug);
}
