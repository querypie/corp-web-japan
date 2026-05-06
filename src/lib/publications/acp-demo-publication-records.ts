import * as path from "node:path";
import type { ResourceItem } from "@/content/resources";
import {
  createStandardPublicationRecordsRepository,
  type StandardPublicationRecord,
} from "@/lib/publications/create-standard-publication-records-repository";

export type AcpDemoPublicationFrontmatter = {
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

export type AcpDemoPublicationRecord = StandardPublicationRecord<AcpDemoPublicationFrontmatter>;
export type AcpDemoPublicationListItem = ResourceItem;

function normalizeAcpDemoPublicationFrontmatter(
  value: unknown,
  sourcePath: string,
): AcpDemoPublicationFrontmatter {
  if (!value || typeof value !== "object") {
    throw new Error(`Missing ACP demo frontmatter in ${sourcePath}`);
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

const acpDemoPublicationRepository = createStandardPublicationRecordsRepository<AcpDemoPublicationFrontmatter>({
  contentRoot: path.join(process.cwd(), "src/content/demo/acp"),
  category: "acp-demo",
  badge: "ACP機能",
  normalizeFrontmatter: normalizeAcpDemoPublicationFrontmatter,
});

export const acpDemoPublicationRecords = acpDemoPublicationRepository.records;

export function listAcpDemoPublicationItems(): readonly AcpDemoPublicationListItem[] {
  return acpDemoPublicationRepository.listItems;
}

export function listAcpDemoPublicationParams() {
  return acpDemoPublicationRepository.listParams();
}

export function listAcpDemoPublicationIds() {
  return acpDemoPublicationRepository.listIds();
}

export function getAcpDemoPublicationRecord(id: string) {
  return acpDemoPublicationRepository.getRecord(id);
}
