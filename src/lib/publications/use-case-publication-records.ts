import * as path from "node:path";
import type { ResourceItem } from "@/content/resources";
import {
  createStandardPublicationRecordsRepository,
  type StandardPublicationRecord,
} from "@/lib/publications/create-standard-publication-records-repository";

export type UseCasePublicationFrontmatter = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  heroImageSrc: string;
  author?: string | string[];
  hideHeroImageOnDetail?: boolean;
  hidden?: boolean;
  redirectUrl?: string;
  relatedIds: readonly string[];
};

export type UseCasePublicationRecord = StandardPublicationRecord<UseCasePublicationFrontmatter>;
export type UseCasePublicationListItem = ResourceItem;

function normalizeUseCasePublicationFrontmatter(
  value: unknown,
  sourcePath: string,
): UseCasePublicationFrontmatter {
  if (!value || typeof value !== "object") {
    throw new Error(`Missing use-case frontmatter in ${sourcePath}`);
  }

  const frontmatter = value as Record<string, unknown>;
  const relatedIdsValue = frontmatter.relatedIds;
  const relatedIds = Array.isArray(relatedIdsValue)
    ? relatedIdsValue.map((item) => String(item))
    : [];
  const authorValue = frontmatter.author;
  const hideHeroImageOnDetailValue = frontmatter.hideHeroImageOnDetail;
  const redirectUrlValue = frontmatter.redirectUrl;

  return {
    id: String(frontmatter.id ?? ""),
    slug: String(frontmatter.slug ?? ""),
    title: String(frontmatter.title ?? ""),
    description: String(frontmatter.description ?? ""),
    date: String(frontmatter.date ?? ""),
    heroImageSrc: String(frontmatter.heroImageSrc ?? ""),
    author:
      typeof authorValue === "string"
        ? authorValue
        : Array.isArray(authorValue)
          ? authorValue.map((item) => String(item))
          : undefined,
    hideHeroImageOnDetail: hideHeroImageOnDetailValue === true,
    hidden: frontmatter.hidden === true,
    redirectUrl: typeof redirectUrlValue === "string" ? redirectUrlValue : undefined,
    relatedIds,
  };
}

const useCasePublicationRepository = createStandardPublicationRecordsRepository<UseCasePublicationFrontmatter>({
  contentRoot: path.join(process.cwd(), "src/content/use-cases"),
  category: "use-case",
  badge: "活用事例",
  normalizeFrontmatter: normalizeUseCasePublicationFrontmatter,
});

export const useCasePublicationRecords = useCasePublicationRepository.records;

export function listUseCasePublicationItems(): readonly UseCasePublicationListItem[] {
  return useCasePublicationRepository.listItems;
}

export function listUseCasePublicationParams() {
  return useCasePublicationRepository.listParams();
}

export function listUseCasePublicationIds() {
  return useCasePublicationRepository.listIds();
}

export function getUseCasePublicationRecord(id: string) {
  return useCasePublicationRepository.getRecord(id);
}
