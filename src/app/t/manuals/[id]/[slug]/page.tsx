import { notFound, redirect } from "next/navigation";
import { getManualPublicationHref, getManualPublicationRecordById, listManualPublicationParamsByCategory } from "@/lib/resources/manual-post-loader";

type PreviewDetailRedirectPageProps = {
  params: Promise<{ id: string; slug: string }>;
};

export function generateStaticParams() {
  return listManualPublicationParamsByCategory();
}

export default async function PreviewDetailRedirectPage({ params }: PreviewDetailRedirectPageProps) {
  const { id } = await params;
  const record = getManualPublicationRecordById(id);

  if (!record) {
    notFound();
  }

  redirect(getManualPublicationHref(id, record.slug));
}
