import { notFound, redirect } from "next/navigation";
import {
  getAipDemoPublicationHref,
  getAipDemoPublicationRecord,
  listAipDemoPublicationIds,
} from "@/lib/publications/get-aip-demo-publication-post";
import { shouldRedirectHumanVisitorFromRedirectablePublication } from "@/lib/publications/redirectable-publication-request";

type AipDemoDetailIdPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return listAipDemoPublicationIds();
}

export default async function AipDemoDetailIdPage({ params }: AipDemoDetailIdPageProps) {
  const { id } = await params;
  const record = getAipDemoPublicationRecord(id);

  if (!record) {
    notFound();
  }

  if (record.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication()) {
    redirect(record.redirectUrl);
  }

  redirect(getAipDemoPublicationHref(id, record.slug));
}
