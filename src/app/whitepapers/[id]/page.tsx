import { notFound, redirect } from "next/navigation";
import {
  getWhitepaperPublicationHref,
  getWhitepaperPublicationRecord,
  listWhitepaperPublicationIds,
} from "@/lib/publications/get-whitepaper-publication-post";

type WhitepaperDetailIdPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return listWhitepaperPublicationIds();
}

export default async function WhitepaperDetailIdPage({ params }: WhitepaperDetailIdPageProps) {
  const { id } = await params;
  const record = getWhitepaperPublicationRecord(id);

  if (!record) {
    notFound();
  }

  redirect(getWhitepaperPublicationHref(id, record.slug));
}
