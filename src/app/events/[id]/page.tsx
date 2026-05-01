import { notFound, redirect } from "next/navigation";
import {
  getEventPublicationHref,
  getEventPublicationRecord,
  listEventPublicationIds,
} from "@/lib/publications/get-event-publication-post";

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

  redirect(getEventPublicationHref(id, record.slug));
}
