import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { buildQueryPieContentRedirectUrl } from "@/lib/querypie-content-redirect";

export function GET(request: NextRequest) {
  const querypieContentRedirectUrl = buildQueryPieContentRedirectUrl(
    request.nextUrl.pathname,
    request.nextUrl.search,
  );

  if (querypieContentRedirectUrl) {
    return NextResponse.redirect(querypieContentRedirectUrl, 307);
  }

  const strippedPath = request.nextUrl.pathname.replace(/^\/ja(?=\/|$)/, "") || "/";
  const redirectedUrl = new URL(strippedPath, request.url);

  redirectedUrl.search = request.nextUrl.search;

  return NextResponse.redirect(redirectedUrl, 307);
}

export const HEAD = GET;
