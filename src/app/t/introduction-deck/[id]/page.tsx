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
  return listDocumentationPublicationIdsByCategory("introduction-deck");
}

export default async function IntroductionDeckDetailIdPage({ params }: DocumentationPreviewDetailIdPageProps) {
  const { id } = await params;
  const record = getDocumentationPublicationRecordById("introduction-deck", id);

  if (!record) {
    notFound();
  }

  redirect(getDocumentationPublicationHref("introduction-deck", id, record.slug));
}
