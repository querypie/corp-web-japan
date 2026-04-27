import { blogItems } from "@/content/publications/blog";
import type { PublicationPostSummary } from "@/lib/publications/types";
import { getPublicationHref } from "@/lib/publications/get-publication-href";

type BlogCardItem = (typeof blogItems)[number];

type RelatedPublicationSource = {
  id: string;
  relatedIds: readonly string[];
};

const blogItemById = new Map<string, BlogCardItem>();
for (const item of blogItems) {
  const match = item.href.match(/\/blog\/(\d+)\/([^/]+)$/);
  if (!match) continue;
  blogItemById.set(match[1], item);
}

function getBlogCardRoute(item: BlogCardItem) {
  const match = item.href.match(/\/blog\/(\d+)\/([^/]+)$/);
  if (!match) return item.href;
  return getPublicationHref("blog", match[1], match[2]);
}

export function buildRelatedPublications(post: RelatedPublicationSource): PublicationPostSummary[] {
  const relatedItems: PublicationPostSummary[] = [];

  for (const relatedId of post.relatedIds) {
    const relatedCard = blogItemById.get(relatedId);
    if (!relatedCard) continue;

    relatedItems.push({
      href: getBlogCardRoute(relatedCard),
      imageSrc: relatedCard.imageSrc,
      title: relatedCard.title,
      date: relatedCard.date ?? "",
    });
  }

  if (relatedItems.length > 0) {
    return relatedItems;
  }

  return blogItems
    .filter((item) => {
      const match = item.href.match(/\/blog\/(\d+)\/([^/]+)$/);
      return match?.[1] !== post.id;
    })
    .slice(0, 3)
    .map((item) => ({
      href: getBlogCardRoute(item),
      imageSrc: item.imageSrc,
      title: item.title,
      date: item.date ?? "",
    }));
}
