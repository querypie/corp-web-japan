import { notFound, redirect } from "next/navigation";
import { getIntroductionDeckPublicationHref, getIntroductionDeckPublicationRecord, listIntroductionDeckPublicationParamsByCategory } from "@/lib/resources/introduction-deck-post-loader";

type PreviewDetailRedirectPageProps = {
  params: Promise<{ id: string; slug: string }>;
};

export function generateStaticParams() {
  return listIntroductionDeckPublicationParamsByCategory();
}

export default async function PreviewDetailRedirectPage({ params }: PreviewDetailRedirectPageProps) {
  const { id } = await params;
  const record = getIntroductionDeckPublicationRecord(id);

  if (!record) {
    notFound();
  }

  redirect(getIntroductionDeckPublicationHref(id, record.slug));
}
