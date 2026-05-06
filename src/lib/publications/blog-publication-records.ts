import * as fs from "node:fs";
import * as path from "node:path";
import { parse as parseYaml } from "yaml";
import type { ResourceItem } from "@/content/resources";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { resolveRedirectablePublicationHref } from "@/lib/publications/resolve-redirectable-publication-href";

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

export type BlogPostRecord = BlogPostFrontmatter & {
  sourcePath: string;
};

export type BlogPublicationListItem = ResourceItem;

type BlogPublicationCache = {
  records: readonly BlogPostRecord[];
  recordsById: ReadonlyMap<string, BlogPostRecord>;
  listItems: readonly BlogPublicationListItem[];
};

const BLOG_POSTS_ROOT = path.join(process.cwd(), "src/content/blog");
let blogPublicationCache: Readonly<BlogPublicationCache> | null = null;

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

function parseBlogPostFrontmatter(source: string, sourcePath: string): BlogPostFrontmatter {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    throw new Error(`Missing frontmatter block in ${sourcePath}`);
  }

  return normalizeBlogPostFrontmatter(parseYaml(match[1]), sourcePath);
}

function loadBlogPostRecords(): BlogPostRecord[] {
  return fs
    .readdirSync(BLOG_POSTS_ROOT)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const sourcePath = path.join(BLOG_POSTS_ROOT, file);
      const source = fs.readFileSync(sourcePath, "utf8");
      const frontmatter = parseBlogPostFrontmatter(source, sourcePath);

      return {
        ...frontmatter,
        sourcePath,
      };
    })
    .sort((left, right) => Number(right.id) - Number(left.id));
}

function createBlogPublicationCache(): Readonly<BlogPublicationCache> {
  const records = Object.freeze(loadBlogPostRecords().map((record) => Object.freeze({ ...record })));
  const recordsById = new Map<string, BlogPostRecord>(records.map((post) => [post.id, post]));
  const visibleRecords = records.filter((record) => !record.hidden);
  const listItems = Object.freeze(
    visibleRecords.map((record) =>
      Object.freeze({
        id: record.id,
        href: resolveRedirectablePublicationHref(record.redirectUrl, getPublicationHref("blog", record.id, record.slug)),
        imageSrc: record.heroImageSrc,
        badge: "ブログ",
        title: record.title,
        description: record.description,
        date: record.date,
      }),
    ),
  );

  return Object.freeze({
    records,
    recordsById,
    listItems,
  });
}

function getBlogPublicationCache(): Readonly<BlogPublicationCache> {
  if (blogPublicationCache) {
    return blogPublicationCache;
  }

  blogPublicationCache = Object.freeze(createBlogPublicationCache());
  return blogPublicationCache;
}

export const blogPostRecords = getBlogPublicationCache().records;

export function listBlogPublicationItems(): readonly BlogPublicationListItem[] {
  return getBlogPublicationCache().listItems;
}

export function listBlogPublicationParams() {
  return getBlogPublicationCache().records.map(({ id, slug }) => ({ id, slug }));
}

export function listBlogPublicationIds() {
  return getBlogPublicationCache().records.map(({ id }) => ({ id }));
}

export function getBlogPublicationRecord(id: string) {
  return getBlogPublicationCache().recordsById.get(id) ?? null;
}
