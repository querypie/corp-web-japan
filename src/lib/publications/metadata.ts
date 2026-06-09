import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site-url";

export type PublicationOpenGraphImageSource = {
  heroImageSrc: string;
  openGraphImageSrc?: string | null;
};

type BuildPublicationOpenGraphMetadataParams = {
  title: string;
  description: string;
  canonicalUrl: string;
  imageAlt: string;
  imageSrc: string | null | undefined;
};

const OPEN_GRAPH_PNG_IMAGE_PATTERN = /\.png(?:[?#].*)?$/i;

export function resolvePublicationOpenGraphImageSrc(source: PublicationOpenGraphImageSource) {
  return source.openGraphImageSrc ?? source.heroImageSrc;
}

export function isPublicationOpenGraphImageSrc(value: string | null | undefined): value is string {
  return Boolean(value && OPEN_GRAPH_PNG_IMAGE_PATTERN.test(value));
}

export function buildPublicationOpenGraphMetadata({
  title,
  description,
  canonicalUrl,
  imageAlt,
  imageSrc,
}: BuildPublicationOpenGraphMetadataParams): Pick<Metadata, "openGraph" | "twitter"> {
  const openGraphImageSrc = isPublicationOpenGraphImageSrc(imageSrc) ? imageSrc : null;
  const openGraphImageUrl = openGraphImageSrc ? absoluteUrl(openGraphImageSrc, canonicalUrl) : null;

  return {
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: openGraphImageUrl
        ? [{ url: openGraphImageUrl, width: 1280, height: 720, alt: imageAlt }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: openGraphImageUrl ? [openGraphImageUrl] : [],
    },
  };
}
