import { notFound, redirect } from "next/navigation";
import {
  getAcpDemoPublicationHref,
  getAcpDemoPublicationRecord,
  listAcpDemoPublicationIds,
} from "@/lib/publications/get-acp-demo-publication-post";
import { shouldRedirectHumanVisitorFromRedirectablePublication } from "@/lib/publications/redirectable-publication-request";

type AcpDemoDetailIdPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return listAcpDemoPublicationIds();
}

export default async function AcpDemoDetailIdPage({ params }: AcpDemoDetailIdPageProps) {
  const { id } = await params;
  const record = getAcpDemoPublicationRecord(id);

  if (!record) {
    notFound();
  }

  if (record.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication()) {
    redirect(record.redirectUrl);
  }

  redirect(getAcpDemoPublicationHref(id, record.slug));
}
