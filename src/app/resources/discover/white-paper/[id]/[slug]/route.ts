import { NextResponse } from "next/server";
import { getWhitepaperPublicationRecord } from "@/lib/publications/whitepaper-publication-records";

type LegacyWhitepaperRouteContext = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export async function GET(_request: Request, { params }: LegacyWhitepaperRouteContext) {
  const { id } = await params;
  const record = getWhitepaperPublicationRecord(id);

  if (!record) {
    return NextResponse.redirect("/whitepapers", 307);
  }

  return NextResponse.redirect(`/whitepapers/${record.id}/${record.slug}`, 307);
}
