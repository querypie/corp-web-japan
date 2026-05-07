import { NextResponse } from "next/server";
import { getWhitepaperPublicationRecord } from "@/lib/publications/whitepapers/records";

type LegacyWhitepaperRouteContext = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export async function GET(request: Request, { params }: LegacyWhitepaperRouteContext) {
  const { id } = await params;
  const record = getWhitepaperPublicationRecord(id);
  const destinationPath = record ? `/whitepapers/${record.id}/${record.slug}` : "/whitepapers";
  const destination = new URL(destinationPath, request.url);

  return NextResponse.redirect(destination, 307);
}
