import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import type { ReactNode } from "react";
import { cache } from "react";
import { evaluate } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import { blogItems } from "@/content/resources";
import { extractHeadingsFromMdx } from "@/lib/blog-mdx-headings";
import { buildBlogMdxComponents } from "@/lib/blog-mdx-components";

export type BlogPostHeading = {
  targetId: string;
  text: string;
  items?: BlogPostHeading[];
};

export type BlogPostAuthor = {
  name: string;
  role: string;
  bio: string;
  avatarSrc: string;
  avatarAlt?: string;
  profileUrl?: string;
};

export type BlogPostSummary = {
  id: string;
  slug: string;
  href: string;
  title: string;
  description: string;
  date: string;
  imageSrc: string;
};

export type BlogPostPageData = BlogPostSummary & {
  content: ReactNode;
  headings: BlogPostHeading[];
  author?: BlogPostAuthor;
  relatedItems: BlogPostSummary[];
};

type BlogPostFrontmatter = {
  layout: "Article";
  category: string;
  slug: string;
  title: string;
  description?: string;
  date: string;
  author?: string | string[];
  relatedPosts?: string[];
};

type BlogCard = BlogPostSummary;

const blogContentDir = path.join(process.cwd(), "src/content/blog");

const authorMap: Record<string, BlogPostAuthor> = {
  brant: {
    name: "Brant Hwang",
    role: "CEO, Founder",
    bio: "QueryPieの創業者兼CEOであるBrantは、AIを活用した特権アクセス管理（PAM）ソリューションを提供しています。",
    avatarSrc: "/crew/brant.png",
    avatarAlt: "Brant Hwang",
    profileUrl: "https://www.linkedin.com/in/ishwang/",
  },
  kenny: {
    name: "Kenny Park",
    role: "CISO",
    bio: "ケニーは、QueryPieのCISOおよびグローバルディレクターで、情報セキュリティとクラウド運営における20年以上の経験を有しています。",
    avatarSrc: "/crew/kenny.png",
    avatarAlt: "Kenny Park",
    profileUrl: "https://www.linkedin.com/in/kwansoonpark/",
  },
};

function localBlogHref(id: string, slug: string): string {
  return `/blog/${id}/${slug}`;
}

function parseIdAndSlugFromHref(href: string): { id: string; slug: string } | null {
  const match = href.match(/\/blog\/(\d+)\/([^/?#]+)/) ??
    href.match(/\/features\/documentation\/blog\/(\d+)\/([^/?#]+)/) ??
    href.match(/^\/ja\/blog\/(\d+)(?:\/([^/?#]+))?$/);

  if (!match) return null;
  return { id: match[1], slug: match[2] ?? "" };
}

function normalizeSourceLinks(source: string, cards: Map<string, BlogCard>): string {
  let normalized = source.replace(
    /https:\/\/www\.querypie\.com\/ja\/features\/documentation\/blog\/(\d+)\/([^\s)"']+)/g,
    (_, id: string, slug: string) => {
      const card = cards.get(id);
      return card ? card.href : `https://www.querypie.com/ja/features/documentation/blog/${id}/${slug}`;
    },
  );

  normalized = normalized.replace(/([("'])\/ja\/blog\/(\d+)(?:\/([^\s)"']+))?/g, (_, prefix: string, id: string) => {
    const card = cards.get(id);
    return `${prefix}${card ? card.href : `https://www.querypie.com/ja/blog/${id}`}`;
  });

  normalized = normalized.replace(/([("'])\/ja\//g, "$1https://www.querypie.com/ja/");
  return normalized;
}

const getBlogCards = cache(async (): Promise<Map<string, BlogCard>> => {
  const map = new Map<string, BlogCard>();
  for (const item of blogItems) {
    const parsed = parseIdAndSlugFromHref(item.href);
    if (!parsed) continue;
    map.set(parsed.id, {
      id: parsed.id,
      slug: parsed.slug,
      href: localBlogHref(parsed.id, parsed.slug),
      title: item.title,
      description: item.description,
      date: item.date ?? "",
      imageSrc: item.imageSrc,
    });
  }
  return map;
});

const getBlogPosts = cache(async (): Promise<Map<string, BlogPostPageData>> => {
  const cards = await getBlogCards();
  const entries = await fs.readdir(blogContentDir, { withFileTypes: true });
  const posts = new Map<string, BlogPostPageData>();

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.mdx')) continue;
    const id = entry.name.replace(/\.mdx$/i, "");
    const card = cards.get(id);
    if (!card) continue;

    const sourcePath = path.join(blogContentDir, entry.name);
    const rawSource = await fs.readFile(sourcePath, "utf8");
    const source = normalizeSourceLinks(rawSource, cards);
    const evaluated = await evaluate<BlogPostFrontmatter>({
      source,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
      components: buildBlogMdxComponents(),
    });

    if (evaluated.error) {
      throw evaluated.error;
    }

    const frontmatter = evaluated.frontmatter;
    const authorKey = Array.isArray(frontmatter.author)
      ? frontmatter.author[0]
      : typeof frontmatter.author === "string" && frontmatter.author.trim()
        ? frontmatter.author.trim()
        : undefined;

    const relatedItems = (frontmatter.relatedPosts ?? [])
      .map((href) => {
        const parsed = parseIdAndSlugFromHref(href);
        return parsed ? cards.get(parsed.id) : null;
      })
      .filter((item): item is BlogCard => Boolean(item));

    posts.set(id, {
      ...card,
      content: evaluated.content,
      headings: extractHeadingsFromMdx(source),
      author: authorKey ? authorMap[authorKey] : undefined,
      relatedItems,
    });
  }

  return posts;
});

export async function getBlogPost(id: string, slug?: string): Promise<BlogPostPageData | null> {
  const posts = await getBlogPosts();
  const post = posts.get(id);
  if (!post) return null;
  if (slug && post.slug !== slug) return null;
  return post;
}

export async function listBlogPostParams(): Promise<Array<{ id: string; slug: string }>> {
  const cards = await getBlogCards();
  return [...cards.values()].map(({ id, slug }) => ({ id, slug }));
}

export async function listBlogPostSummaries(): Promise<BlogPostSummary[]> {
  const cards = await getBlogCards();
  return [...cards.values()];
}
