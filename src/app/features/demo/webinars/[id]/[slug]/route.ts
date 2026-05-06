import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getEventPublicationHref, getEventPublicationRecord } from "@/lib/publications/get-event-publication-post";

type LegacyWebinarSlugRouteContext = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export async function GET(request: NextRequest, { params }: LegacyWebinarSlugRouteContext) {
  const { id } = await params;
  const record = getEventPublicationRecord(id);

  if (!record) {
    return new NextResponse(null, { status: 404 });
  }

  const destinationPath = record.redirectUrl ?? getEventPublicationHref(id, record.slug);
  const destination = new URL(destinationPath, request.url);
  destination.search = request.nextUrl.search;

  return NextResponse.redirect(destination, 307);
}

export const HEAD = GET;
