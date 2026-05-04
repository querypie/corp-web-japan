import type { PublicationCategory } from "@/lib/publications/types";

const publicationDetailPrefixes: Record<PublicationCategory, string> = {
  blog: "/blog",
  whitepaper: "/whitepapers",
  event: "/events",
  news: "/news",
  "use-case": "/use-cases",
  "aip-demo": "/demo/aip",
  "acp-demo": "/demo/acp",
};

export function getPublicationHref(category: PublicationCategory, id: string, slug: string) {
  return `${publicationDetailPrefixes[category]}/${id}/${slug}`;
}
