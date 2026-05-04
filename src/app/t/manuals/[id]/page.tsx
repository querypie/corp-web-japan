import { notFound, redirect } from "next/navigation";
import { getManualPublicationHref, getManualPublicationRecordById, listManualPublicationIdsByCategory } from "@/lib/resources/manual-post-loader";

type ResourcePreviewDetailIdPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return listManualPublicationIdsByCategory();
}

export default async function ManualsDetailIdPage({ params }: ResourcePreviewDetailIdPageProps) {
  const { id } = await params;
  const record = getManualPublicationRecordById(id);

  if (!record) {
    notFound();
  }

  redirect(getManualPublicationHref(id, record.slug));
}
