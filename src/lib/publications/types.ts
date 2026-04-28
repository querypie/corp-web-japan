import type { ReactNode } from "react";

export type PublicationCategory = "blog" | "whitepaper" | "event";

export type PublicationPostSummary = {
  href: string;
  imageSrc: string;
  title: string;
  date: string;
};

export type PublicationPostAuthor = {
  avatarSrc: string;
  avatarAlt: string;
  name: string;
  role: string;
  bio: string;
  profileUrl?: string;
};

export type PublicationTocItem = {
  targetId: string;
  text: string;
  items?: PublicationTocItem[];
};

export type PublicationPost = {
  category: PublicationCategory;
  categoryLabel: string;
  title: string;
  description: string;
  date: string;
  heroImageSrc: string;
  author: PublicationPostAuthor | null;
  bodyHtml: string | null;
  bodyMdx: ReactNode | null;
  gatingHtml: string | null;
  gatedContentHtml: string | null;
  relatedTitle: string;
  relatedItems: PublicationPostSummary[];
  toc: PublicationTocItem[];
};
