import { notFound, redirect } from "next/navigation";
import {
  getNewsPublicationHref,
  getNewsPublicationRecord,
  listNewsPublicationIds,
} from "@/lib/publications/get-news-publication-post";

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

  if (record.redirectUrl) {
    redirect(record.redirectUrl);
  }

  redirect(getNewsPublicationHref(id, record.slug));
}
