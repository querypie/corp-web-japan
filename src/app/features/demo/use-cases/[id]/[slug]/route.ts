import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { logRuntimeRedirect } from "@/lib/runtime-redirect-log";

type LegacyUseCaseRouteContext = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export async function GET(request: NextRequest, { params }: LegacyUseCaseRouteContext) {
  const { id, slug } = await params;
  const destination = new URL(`/use-cases/${id}/${slug}`, request.url);
  destination.search = request.nextUrl.search;

  logRuntimeRedirect({
    requestedPath: request.nextUrl.pathname,
    redirectTarget: destination,
    requestUrl: request.url,
    host: request.nextUrl.host,
    referer: request.headers.get("referer"),
    userAgent: request.headers.get("user-agent"),
  });

  return NextResponse.redirect(destination, 307);
}

export const HEAD = GET;
