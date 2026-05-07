import * as fs from "node:fs";
import { getDisplayableArticleAuthors, resolveArticleAuthors } from "@/lib/authors/resolve-authors";
import { buildRelatedPublicationItems } from "@/lib/publications/build-related-publication-items";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { extractHeadingsFromMdx } from "@/lib/publications/mdx/headings";
import { renderPublicationMdx } from "@/lib/publications/mdx/renderer";
import type { PublicationPost } from "@/lib/publications/types";
import type { BlogPostFrontmatter, BlogPostRecord } from "@/lib/publications/blog-publication-records";
import { blogPostRecords, getBlogPublicationRecord } from "@/lib/publications/blog-publication-records";
export {
  getBlogPublicationRecord,
  listBlogPublicationIds,
  listBlogPublicationParams,
} from "@/lib/publications/blog-publication-records";

const blogPostBodySourceCache = new Map<string, string>();

function readBlogPostBodySource(post: BlogPostRecord) {
  const cachedSource = blogPostBodySourceCache.get(post.sourcePath);

  if (cachedSource) {
    return cachedSource;
  }

  const source = fs.readFileSync(post.sourcePath, "utf8");
  blogPostBodySourceCache.set(post.sourcePath, source);
  return source;
}

export async function getBlogPublicationPost(id: string): Promise<PublicationPost | null> {
  const post = getBlogPublicationRecord(id);
  if (!post) {
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
    gatedBodyMdx: null,
    gating: null,
    relatedTitle: "関連記事",
    relatedItems: buildRelatedPublicationItems({
      records: blogPostRecords,
      id,
      relatedIds: frontmatter.relatedIds ?? post.relatedIds,
      getHref: getBlogPublicationHref,
    }),
    toc: extractHeadingsFromMdx(bodySource),
  };
}

export function getBlogPublicationHref(id: string, slug: string) {
  return getPublicationHref("blog", id, slug);
}
