import { notFound, redirect } from "next/navigation";
import {
  getEventPublicationHref,
  getEventPublicationRecord,
  listEventPublicationIds,
} from "@/lib/publications/get-event-publication-post";
import { shouldRedirectHumanVisitorFromRedirectablePublication } from "@/lib/publications/redirectable-publication-request";

type EventIdPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return listEventPublicationIds();
}

export default async function EventIdPage({ params }: EventIdPageProps) {
  const { id } = await params;
  const record = getEventPublicationRecord(id);

  if (!record) {
    notFound();
  }

  if (record.redirectUrl && await shouldRedirectHumanVisitorFromRedirectablePublication()) {
    redirect(record.redirectUrl);
  }

  redirect(getEventPublicationHref(id, record.slug));
}
