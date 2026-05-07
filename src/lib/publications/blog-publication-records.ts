import * as path from "node:path";
import type { ResourceItem } from "@/content/resources";
import {
  createStandardPublicationRecordsRepository,
  type StandardPublicationRecord,
} from "@/lib/publications/create-standard-records-repository";

export type BlogPostFrontmatter = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  heroImageSrc: string;
  author?: string | string[];
  hidden?: boolean;
  redirectUrl?: string;
  relatedIds: readonly string[];
};

export type BlogPostRecord = StandardPublicationRecord<BlogPostFrontmatter>;

export type BlogPublicationListItem = ResourceItem;

const BLOG_POSTS_ROOT = path.join(process.cwd(), "src/content/blog");

function normalizeBlogPostFrontmatter(value: unknown, sourcePath: string): BlogPostFrontmatter {
  if (!value || typeof value !== "object") {
    throw new Error(`Missing blog post frontmatter in ${sourcePath}`);
  }

  const frontmatter = value as Record<string, unknown>;
  const relatedIdsValue = frontmatter.relatedIds;
  const relatedIds = Array.isArray(relatedIdsValue)
    ? relatedIdsValue.map((item) => String(item))
    : [];
  const authorValue = frontmatter.author;
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
    hidden: frontmatter.hidden === true,
    redirectUrl: typeof redirectUrlValue === "string" ? redirectUrlValue : undefined,
    relatedIds,
  };
}

const blogPublicationRepository = createStandardPublicationRecordsRepository<BlogPostFrontmatter>({
  contentRoot: BLOG_POSTS_ROOT,
  category: "blog",
  badge: "ブログ",
  normalizeFrontmatter: normalizeBlogPostFrontmatter,
});

export const blogPostRecords = blogPublicationRepository.records;

export function listBlogPublicationItems(): readonly BlogPublicationListItem[] {
  return blogPublicationRepository.listItems;
}

export function listBlogPublicationParams() {
  return blogPublicationRepository.listParams();
}

export function listBlogPublicationIds() {
  return blogPublicationRepository.listIds();
}

export function getBlogPublicationRecord(id: string) {
  return blogPublicationRepository.getRecord(id);
}
