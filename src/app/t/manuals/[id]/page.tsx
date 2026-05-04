import { notFound, redirect } from "next/navigation";
import {
  getDocumentationPublicationHref,
  getDocumentationPublicationRecordById,
  listDocumentationPublicationIdsByCategory,
} from "@/lib/get-documentation-publication-post";

type DocumentationPreviewDetailIdPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return listDocumentationPublicationIdsByCategory("manuals");
}

export default async function ManualsDetailIdPage({ params }: DocumentationPreviewDetailIdPageProps) {
  const { id } = await params;
  const record = getDocumentationPublicationRecordById("manuals", id);

  if (!record) {
    notFound();
  }

  redirect(getDocumentationPublicationHref("manuals", id, record.slug));
}
