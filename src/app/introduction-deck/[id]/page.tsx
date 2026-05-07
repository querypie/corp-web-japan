import { notFound, redirect } from "next/navigation";
import { getIntroductionDeckPublicationHref, getIntroductionDeckPublicationRecord, listIntroductionDeckPublicationIdsByCategory } from "@/lib/resources/introduction-deck-post-loader";

type IntroductionDeckDetailIdPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return listIntroductionDeckPublicationIdsByCategory();
}

export default async function IntroductionDeckDetailIdPage({ params }: IntroductionDeckDetailIdPageProps) {
  const { id } = await params;
  const record = getIntroductionDeckPublicationRecord(id);

  if (!record) {
    notFound();
  }

  redirect(getIntroductionDeckPublicationHref(id, record.slug));
}
