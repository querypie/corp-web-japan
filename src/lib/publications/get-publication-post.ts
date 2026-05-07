import {
  blogPostRecords,
  getBlogPublicationRecord,
  type BlogPostFrontmatter,
  type BlogPostRecord,
} from "@/lib/publications/blog-publication-records";
import { getPublicationHref } from "@/lib/publications/get-publication-href";
import { createStandardPublicationPostLoader } from "@/lib/publications/create-standard-publication-post-loader";

export {
  getBlogPublicationRecord,
  listBlogPublicationIds,
  listBlogPublicationParams,
} from "@/lib/publications/blog-publication-records";

export const getBlogPublicationPost = createStandardPublicationPostLoader<
  BlogPostFrontmatter,
  BlogPostRecord
>({
  category: "blog",
  categoryLabel: "ブログ",
  relatedTitle: "関連記事",
  defaultAuthorAvatarSrc: "/crew/authors/brant.png",
  records: blogPostRecords,
  getRecord: getBlogPublicationRecord,
  getHref: getBlogPublicationHref,
});

export function getBlogPublicationHref(id: string, slug: string) {
  return getPublicationHref("blog", id, slug);
}
