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
  return listDocumentationPublicationIdsByCategory("glossary");
}

export default async function GlossaryDetailIdPage({ params }: DocumentationPreviewDetailIdPageProps) {
  const { id } = await params;
  const record = getDocumentationPublicationRecordById("glossary", id);

  if (!record) {
    notFound();
  }

  redirect(getDocumentationPublicationHref("glossary", id, record.slug));
}
