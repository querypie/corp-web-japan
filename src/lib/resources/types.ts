import type { ResourceItem } from "@/content/resources";

export type ResourcePublicationCategory = "introduction-deck" | "glossary" | "manuals";

export type ResourcePublicationFrontmatter = {
  id: string;
  slug: string;
  title: string;
  description: string;
  heroImageSrc: string;
  date?: string;
  gated?: boolean;
  relatedItems?: readonly {
    href: string;
    imageSrc: string;
    title: string;
    date?: string;
  }[];
};

export type ResourcePublicationRecord = ResourcePublicationFrontmatter & {
  sourcePath: string;
  category: ResourcePublicationCategory;
};

export type ResourcePublicationListItem = ResourceItem;
