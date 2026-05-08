import { NextRequest, NextResponse } from "next/server";
import {
  getWhitepaperPublicationPdfHref,
  getWhitepaperPublicationRecord,
} from "@/lib/publications/whitepapers/get-post";

type WhitepaperLegacyDownloadRouteContext = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export async function GET(request: NextRequest, { params }: WhitepaperLegacyDownloadRouteContext) {
  const { id } = await params;
  const record = getWhitepaperPublicationRecord(id);
  const destinationPath = record ? getWhitepaperPublicationPdfHref(record.id, record.slug) : "/whitepapers";
  const destination = new URL(destinationPath, request.url);

  destination.search = request.nextUrl.search;

  return NextResponse.redirect(destination, 307);
}

export const HEAD = GET;
