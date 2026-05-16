import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getUseCasePublicationHref, getUseCasePublicationRecord } from "@/lib/publications/use-cases/get-post";

type LegacyUseCaseSlugRouteContext = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export async function GET(request: NextRequest, { params }: LegacyUseCaseSlugRouteContext) {
  const { id } = await params;
  const record = getUseCasePublicationRecord(id);

  if (!record) {
    return new NextResponse(null, { status: 404 });
  }

  const destination = new URL(getUseCasePublicationHref(id, record.slug), request.url);
  destination.search = request.nextUrl.search;

  return NextResponse.redirect(destination, 308);
}

export const HEAD = GET;
