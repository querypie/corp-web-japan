import fs from "node:fs";
import path from "node:path";
import { blogItems, eventItems, whitepaperItems } from "@/content/resources";

export type ResourcePostCategory = "blog" | "whitepaper" | "event";

export type ResourcePostSummary = {
  href: string;
  imageSrc: string;
  title: string;
  date: string;
};

export type ResourcePost = {
  category: ResourcePostCategory;
  categoryLabel: string;
  title: string;
  description: string;
  date: string;
  heroImageSrc: string;
  author: {
    avatarSrc: string;
    avatarAlt: string;
    name: string;
    role: string;
    bio: string;
    profileUrl?: string;
  } | null;
  bodyHtml: string;
  gatingHtml: string | null;
  gatedContentHtml: string | null;
  relatedTitle: string;
  relatedItems: ResourcePostSummary[];
  tocHtml: string;
};

export type ResourceDownloadPost = {
  categoryLabel: string;
  title: string;
  coverImageSrc: string;
  formDescription: string;
  successTitle: string;
  successTextHtml: string;
};

const POSTS_ROOT = path.join(process.cwd(), "content/source-posts");
const VALID_CATEGORIES = new Set<ResourcePostCategory>(["blog", "whitepaper", "event"]);
const STATIC_ROUTE_CATEGORIES: readonly ResourcePostCategory[] = ["blog", "event"];
const RESOURCE_IMAGE_BY_HREF: Map<string, string> = new Map(
  [...blogItems, ...whitepaperItems, ...eventItems].map((item) => [item.href, item.imageSrc]),
);

function stripHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchFirst(html: string, pattern: RegExp) {
  const match = html.match(pattern);
  return match?.[1]?.trim() ?? "";
}

function extractElement(html: string, token: string, tagName: string) {
  const start = html.indexOf(token);
  if (start === -1) return "";

  const openEnd = html.indexOf(">", start);
  if (openEnd === -1) return "";

  let cursor = openEnd + 1;
  let depth = 1;

  while (cursor < html.length) {
    const nextOpen = html.indexOf(`<${tagName}`, cursor);
    const nextClose = html.indexOf(`</${tagName}>`, cursor);

    if (nextClose === -1) return "";

    if (nextOpen !== -1 && nextOpen < nextClose) {
      const end = html.indexOf(">", nextOpen);
      if (end === -1) return "";
      depth += 1;
      cursor = end + 1;
      continue;
    }

    depth -= 1;
    cursor = nextClose + tagName.length + 3;
    if (depth === 0) {
      return html.slice(start, cursor);
    }
  }

  return "";
}

function extractInnerHtml(html: string, token: string, tagName: string) {
  const element = extractElement(html, token, tagName);
  if (!element) return "";

  const firstClose = element.indexOf(">");
  const lastOpen = element.lastIndexOf(`</${tagName}>`);
  if (firstClose === -1 || lastOpen === -1) return "";

  return element.slice(firstClose + 1, lastOpen).trim();
}

function normalizeSlug(slug: string) {
  return slug.replace(/\.html$/i, "");
}

function filePathFor(category: ResourcePostCategory, slug: string) {
  return path.join(POSTS_ROOT, category, `${normalizeSlug(slug)}.html`);
}

function getHtmlFor(category: ResourcePostCategory, slug: string) {
  const filePath = filePathFor(category, slug);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8");
}

function parseRelatedItems(html: string): ResourcePostSummary[] {
  return Array.from(
    html.matchAll(
      /<a href="([^"]+)" class="related-sidebar-card">[\s\S]*?<img src="([^"]+)"[^>]*alt="([^"]*)"[\s\S]*?<h3 class="related-sidebar-card-title">([\s\S]*?)<\/h3>[\s\S]*?<p class="related-sidebar-date">([\s\S]*?)<\/p>/g,
    ),
  ).map(([, href, imageSrc, , title, date]) => {
    const normalizedHref = href.replace(/\.html$/i, "");
    return {
      href: normalizedHref,
      imageSrc: RESOURCE_IMAGE_BY_HREF.get(normalizedHref) ?? imageSrc,
      title: stripHtml(title),
      date: stripHtml(date),
    };
  });
}

function parseAuthor(html: string) {
  const block = extractElement(html, '<div class="article-author">', "div");
  if (!block) return null;

  let avatarSrc = matchFirst(block, /<img class="article-author-avatar[^"]*" src="([^"]+)"/);
  if (avatarSrc.includes("qp-logo-icon")) {
    avatarSrc = "/assets/images/wp28/qp-logo-icon.png";
  }

  return {
    avatarSrc,
    avatarAlt: matchFirst(block, /<img class="article-author-avatar[^"]*"[^>]*alt="([^"]*)"/),
    name: stripHtml(matchFirst(block, /<p class="article-author-name">([\s\S]*?)<\/p>/)),
    role: stripHtml(matchFirst(block, /<p class="article-author-role">([\s\S]*?)<\/p>/)),
    bio: stripHtml(matchFirst(block, /<p class="article-author-bio">([\s\S]*?)<\/p>/)),
    profileUrl: matchFirst(block, /<a href="([^"]+)"[^>]*class="article-author-sns-link"/) || undefined,
  };
}

function normalizeGatingHtml(html: string) {
  return html.replace(
    /<\/select>/g,
    '</select><span class="gating-select-icon" aria-hidden="true">⌄</span>',
  );
}

export function isResourcePostCategory(value: string): value is ResourcePostCategory {
  return VALID_CATEGORIES.has(value as ResourcePostCategory);
}

export function listResourcePostParams() {
  return STATIC_ROUTE_CATEGORIES.flatMap((category) => {
    const categoryDir = path.join(POSTS_ROOT, category);

    if (!fs.existsSync(categoryDir)) return [];

    return fs
      .readdirSync(categoryDir)
      .filter(
        (file) =>
          file.endsWith(".html") &&
          !file.includes("template") &&
          !file.includes("basic") &&
          !file.includes("gated") &&
          !file.includes("download"),
      )
      .map((file) => ({
        category,
        slug: file,
      }));
  });
}

export function getResourcePost(category: ResourcePostCategory, slug: string): ResourcePost | null {
  const html = getHtmlFor(category, slug);
  if (!html) return null;
  const title = stripHtml(matchFirst(html, /<h1 class="article-title">([\s\S]*?)<\/h1>/));

  return {
    category,
    categoryLabel: stripHtml(matchFirst(html, /<span class="article-category">([\s\S]*?)<\/span>/)),
    title,
    description: matchFirst(html, /<meta name="description" content="([^"]+)"/),
    date: stripHtml(matchFirst(html, /<span class="article-date">([\s\S]*?)<\/span>/)),
    heroImageSrc: matchFirst(
      html,
      /<div class="article-hero-img">[\s\S]*?<img src="([^"]+)"/,
    ),
    author: parseAuthor(html),
    bodyHtml: extractInnerHtml(html, '<div class="article-content">', "div"),
    gatingHtml:
      normalizeGatingHtml(extractElement(html, '<div class="gating-wall"', "div")) || null,
    gatedContentHtml:
      extractInnerHtml(html, '<div class="article-gated-content"', "div") || null,
    relatedTitle: stripHtml(matchFirst(html, /<h2 class="related-sidebar-title">([\s\S]*?)<\/h2>/)),
    relatedItems: parseRelatedItems(html),
    tocHtml: extractElement(html, '<ul class="sidebar-toc-list">', "ul"),
  };
}

export function getResourceDownloadPost(
  category: ResourcePostCategory,
  slug: string,
): ResourceDownloadPost | null {
  const html = getHtmlFor(category, slug);
  if (!html) return null;
  if (!html.includes("wp-dl-wrap")) return null;

  return {
    categoryLabel: stripHtml(matchFirst(html, /<span class="wp-dl-category">([\s\S]*?)<\/span>/)),
    title: stripHtml(matchFirst(html, /<h1 class="wp-dl-doc-title">([\s\S]*?)<\/h1>/)),
    coverImageSrc: matchFirst(
      html,
      /<div class="wp-dl-cover-img-wrap">[\s\S]*?<img src="([^"]+)"/,
    ),
    formDescription: stripHtml(matchFirst(html, /<p class="wp-dl-form-desc">([\s\S]*?)<\/p>/)),
    successTitle: stripHtml(matchFirst(html, /<h2 class="wp-dl-success-title">([\s\S]*?)<\/h2>/)),
    successTextHtml: matchFirst(html, /<p class="wp-dl-success-text">([\s\S]*?)<\/p>/),
  };
}
