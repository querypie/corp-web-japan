import { notFound, redirect } from "next/navigation";
import {
  getNewsPublicationHref,
  getNewsPublicationRecord,
  listNewsPublicationIds,
} from "@/lib/publications/news/get-post";
import { shouldRedirectHumanVisitorFromRedirectablePublication } from "@/lib/publications/redirectable-publication-request";

type NewsIdPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return listNewsPublicationIds();
}

export default async function NewsIdPage({ params }: NewsIdPageProps) {
  const { id } = await params;
  const record = getNewsPublicationRecord(id);

  if (!record) {
    notFound();
  }

  if (record.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication()) {
    redirect(record.redirectUrl);
  }

  redirect(getNewsPublicationHref(id, record.slug));
}
