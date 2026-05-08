import { notFound, redirect } from "next/navigation";
import {
  getWhitepaperPublicationPdfHref,
  getWhitepaperPublicationRecord,
  listWhitepaperPublicationIds,
} from "@/lib/publications/whitepapers/get-post";

type WhitepaperDownloadIdPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return listWhitepaperPublicationIds();
}

export default async function WhitepaperDownloadIdPage({ params }: WhitepaperDownloadIdPageProps) {
  const { id } = await params;
  const record = getWhitepaperPublicationRecord(id);

  if (!record || !record.downloadCta) {
    notFound();
  }

  if (record.redirectUrl) {
    redirect(`${record.redirectUrl}/pdf`);
  }

  redirect(getWhitepaperPublicationPdfHref(id, record.slug));
}
