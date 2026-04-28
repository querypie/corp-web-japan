import { listBlogPublicationItems } from "@/lib/publications/blog-publication-records";
import type { PublicationPostSummary } from "@/lib/publications/types";
import { getPublicationHref } from "@/lib/publications/get-publication-href";

type RelatedPublicationSource = {
  id: string;
  relatedIds: readonly string[];
};

const blogItems = listBlogPublicationItems();
const blogItemById = new Map<string, (typeof blogItems)[number]>();
for (const item of blogItems) {
  const match = item.href.match(/\/blog\/(\d+)\/([^/]+)$/);
  if (!match) continue;
  blogItemById.set(match[1], item);
}

function getBlogCardRoute(item: (typeof blogItems)[number]) {
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
    .filter((item) => post.id !== item.href.match(/\/blog\/(\d+)\/([^/]+)$/)?.[1])
    .slice(0, 3)
    .map((item) => ({
      href: getBlogCardRoute(item),
      imageSrc: item.imageSrc,
      title: item.title,
      date: item.date ?? "",
    }));
}
