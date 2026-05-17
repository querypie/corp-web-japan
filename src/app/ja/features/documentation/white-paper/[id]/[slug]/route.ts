import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { logRuntimeRedirect } from "@/lib/runtime-redirect-log";

type LegacyWhitepaperRouteContext = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export async function GET(request: NextRequest, { params }: LegacyWhitepaperRouteContext) {
  const { id, slug } = await params;
  const destination = new URL(`/whitepapers/${id}/${slug}`, request.url);
  destination.search = request.nextUrl.search;
  const statusCode = 307;

  logRuntimeRedirect(request, destination, statusCode);

  return NextResponse.redirect(destination, statusCode);
}

export const HEAD = GET;
