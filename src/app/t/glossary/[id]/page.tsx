import { notFound, redirect } from "next/navigation";
import { getGlossaryPublicationHref, getGlossaryPublicationRecordById, listGlossaryPublicationIdsByCategory } from "@/lib/resources/glossary-post-loader";

type ResourcePreviewDetailIdPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return listGlossaryPublicationIdsByCategory();
}

export default async function GlossaryDetailIdPage({ params }: ResourcePreviewDetailIdPageProps) {
  const { id } = await params;
  const record = getGlossaryPublicationRecordById(id);

  if (!record) {
    notFound();
  }

  redirect(getGlossaryPublicationHref(id, record.slug));
}
