import { notFound, redirect } from "next/navigation";
import {
  getBlogPublicationHref,
  getBlogPublicationRecord,
  listBlogPublicationIds,
} from "@/lib/publications/get-publication-post";
import { shouldRedirectHumanVisitorFromRedirectablePublication } from "@/lib/publications/redirectable-publication-request";

type BlogDetailCanonicalRedirectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return listBlogPublicationIds();
}

export default async function BlogDetailCanonicalRedirectPage({ params }: BlogDetailCanonicalRedirectPageProps) {
  const { id } = await params;
  const record = getBlogPublicationRecord(id);

  if (!record) {
    notFound();
  }

  if (record.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication()) {
    redirect(record.redirectUrl);
  }

  redirect(getBlogPublicationHref(id, record.slug));
}
