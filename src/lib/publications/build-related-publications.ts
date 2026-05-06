import { blogPostRecords, type BlogPostRecord } from "@/lib/publications/blog-publication-records";
import type { PublicationPostSummary } from "@/lib/publications/types";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { resolveRedirectablePublicationHref } from "@/lib/publications/resolve-redirectable-publication-href";

type RelatedPublicationSource = {
  id: string;
  relatedIds: readonly string[];
};

const visibleBlogRecords = blogPostRecords.filter((record) => !record.hidden);
const blogRecordById = new Map<string, BlogPostRecord>(visibleBlogRecords.map((record) => [record.id, record]));

function getBlogCardRoute(record: BlogPostRecord) {
  return resolveRedirectablePublicationHref(record.redirectUrl, getPublicationHref("blog", record.id, record.slug));
}

export function buildRelatedPublications(post: RelatedPublicationSource): PublicationPostSummary[] {
  const relatedItems: PublicationPostSummary[] = [];

  for (const relatedId of post.relatedIds) {
    const relatedRecord = blogRecordById.get(relatedId);
    if (!relatedRecord) continue;

    relatedItems.push({
      href: getBlogCardRoute(relatedRecord),
      imageSrc: relatedRecord.heroImageSrc,
      title: relatedRecord.title,
      date: relatedRecord.date,
    });
  }

  if (relatedItems.length > 0) {
    return relatedItems;
  }

  return visibleBlogRecords
    .filter((record) => post.id !== record.id)
    .slice(0, 3)
    .map((record) => ({
      href: getBlogCardRoute(record),
      imageSrc: record.heroImageSrc,
      title: record.title,
      date: record.date,
    }));
}
