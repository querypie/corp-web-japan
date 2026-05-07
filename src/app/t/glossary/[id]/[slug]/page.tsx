import { notFound, redirect } from "next/navigation";
import { getGlossaryPublicationHref, getGlossaryPublicationRecordById, listGlossaryPublicationParamsByCategory } from "@/lib/resources/glossary-post-loader";

type PreviewDetailRedirectPageProps = {
  params: Promise<{ id: string; slug: string }>;
};

export function generateStaticParams() {
  return listGlossaryPublicationParamsByCategory();
}

export default async function PreviewDetailRedirectPage({ params }: PreviewDetailRedirectPageProps) {
  const { id } = await params;
  const record = getGlossaryPublicationRecordById(id);

  if (!record) {
    notFound();
  }

  redirect(getGlossaryPublicationHref(id, record.slug));
}
