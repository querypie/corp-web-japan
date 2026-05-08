import {
  getWhitepaperPublicationRecord,
  listWhitepaperPublicationIds,
  listWhitepaperPublicationParams,
  whitepaperPublicationRecords,
  type WhitepaperPublicationFrontmatter,
  type WhitepaperPublicationRecord,
} from "@/lib/publications/whitepapers/records";
import { createGatedPublicationPostLoader } from "@/lib/publications/create-gated-publication-post-loader";
import { getPublicationHref } from "@/lib/publications/get-publication-href";

export { getWhitepaperPublicationRecord, listWhitepaperPublicationIds, listWhitepaperPublicationParams };

const getWhitepaperPublicationPostBase = createGatedPublicationPostLoader<
  WhitepaperPublicationFrontmatter,
  WhitepaperPublicationRecord
>({
  category: "whitepaper",
  categoryLabel: "ホワイトペーパー",
  relatedTitle: "関連記事",
  defaultAuthorAvatarSrc: "/querypie-logo.svg",
  records: whitepaperPublicationRecords,
  getRecord: getWhitepaperPublicationRecord,
  getHref: getWhitepaperPublicationHref,
});

export async function getWhitepaperPublicationPost(id: string) {
  const record = getWhitepaperPublicationRecord(id);
  if (!record) {
    return null;
  }

  const post = await getWhitepaperPublicationPostBase(id);
  if (!post) {
    return null;
  }

  if (post.downloadCta) {
    post.downloadCta = {
      ...post.downloadCta,
      href: getWhitepaperPublicationPdfHref(id, record.slug),
      external: false,
    };
  }

  return post;
}

export function getWhitepaperPublicationHref(id: string, slug: string) {
  return getPublicationHref("whitepaper", id, slug);
}

export function getWhitepaperPublicationPdfHref(id: string, slug: string) {
  return `${getWhitepaperPublicationHref(id, slug)}/pdf`;
}

export function listWhitepaperPublicationPdfParams() {
  return whitepaperPublicationRecords
    .filter((record) => Boolean(record.downloadCta) && !record.redirectUrl)
    .map(({ id, slug }) => ({ id, slug }));
}
