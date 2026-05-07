import { notFound, redirect } from "next/navigation";
import {
  getUseCasePublicationHref,
  getUseCasePublicationRecord,
  listUseCasePublicationIds,
} from "@/lib/publications/get-use-case-publication-post";
import { shouldRedirectHumanVisitorFromRedirectablePublication } from "@/lib/publications/redirectable-publication-request";

type UseCaseDetailIdPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return listUseCasePublicationIds();
}

export default async function UseCaseDetailIdPage({ params }: UseCaseDetailIdPageProps) {
  const { id } = await params;
  const record = getUseCasePublicationRecord(id);

  if (!record) {
    notFound();
  }

  if (record.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication()) {
    redirect(record.redirectUrl);
  }

  redirect(getUseCasePublicationHref(id, record.slug));
}
