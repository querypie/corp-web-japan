import * as fs from "node:fs";
import * as path from "node:path";
import { parse as parseYaml } from "yaml";
import { getDisplayableArticleAuthors, resolveArticleAuthors } from "@/lib/authors/resolve-authors";
import { buildRelatedPublications } from "@/lib/publications/build-related-publications";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { extractHeadingsFromMdx } from "@/lib/publications/mdx/headings";
import { renderPublicationMdx } from "@/lib/publications/mdx/renderer";
import type { PublicationPost } from "@/lib/publications/types";

type BlogPostFrontmatter = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  heroImageSrc: string;
  author?: string | string[];
  relatedIds: readonly string[];
};

type BlogPostRecord = BlogPostFrontmatter & {
  sourcePath: string;
};

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

const blogPostRecords = loadBlogPostRecords();
const blogPostById = new Map<string, BlogPostRecord>(blogPostRecords.map((post) => [post.id, post]));

function readBlogPostBodySource(post: BlogPostRecord) {
  return fs.readFileSync(post.sourcePath, "utf8");
}

export function listBlogPublicationParams() {
  return blogPostRecords.map(({ id, slug }) => ({ id, slug }));
}

export function getBlogPublicationRecord(id: string) {
  return blogPostById.get(id) ?? null;
}

export async function getBlogPublicationPost(id: string, slug: string): Promise<PublicationPost | null> {
  const post = getBlogPublicationRecord(id);
  if (!post || post.slug !== slug) {
    return null;
  }

  const bodySource = readBlogPostBodySource(post);
  const { content, frontmatter } = await renderPublicationMdx<BlogPostFrontmatter>(bodySource);
  const resolvedAuthors = getDisplayableArticleAuthors(resolveArticleAuthors(frontmatter.author));
  const primaryAuthor = resolvedAuthors.find((author) => author.isRegistered) ?? null;

  return {
    category: "blog",
    categoryLabel: "ブログ",
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    heroImageSrc: frontmatter.heroImageSrc,
    author: primaryAuthor
      ? {
          avatarSrc: primaryAuthor.profileImageSrc ?? "/crew/authors/brant.png",
          avatarAlt: primaryAuthor.name,
          name: primaryAuthor.name,
          role: primaryAuthor.position ?? "",
          bio: primaryAuthor.description ?? "",
          profileUrl: primaryAuthor.links.find((link) => link.type === "linkedin")?.url,
        }
      : null,
    bodyHtml: null,
    bodyMdx: content,
    gatingHtml: null,
    gatedContentHtml: null,
    relatedTitle: "関連記事",
    relatedItems: buildRelatedPublications(frontmatter),
    toc: extractHeadingsFromMdx(bodySource),
  };
}

export function getBlogPublicationHref(id: string, slug: string) {
  return getPublicationHref("blog", id, slug);
}
