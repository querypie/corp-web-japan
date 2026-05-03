import { notFound, redirect } from "next/navigation";
import {
  getUseCasePublicationHref,
  getUseCasePublicationRecord,
  listUseCasePublicationIds,
} from "@/lib/publications/get-use-case-publication-post";

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

  if (record.redirectUrl) {
    redirect(record.redirectUrl);
  }

  redirect(getUseCasePublicationHref(id, record.slug));
}
