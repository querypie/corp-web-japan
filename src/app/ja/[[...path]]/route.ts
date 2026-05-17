import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isCorpWebJapanInternalContentPath } from "@/lib/corp-web-japan-internal-content-path";
import { logRuntimeRedirect } from "@/lib/runtime-redirect-log";

const querypieOrigin = "https://www.querypie.com";

export function GET(request: NextRequest) {
  const strippedPath = request.nextUrl.pathname.replace(/^\/ja(?=\/|$)/, "") || "/";

  if (strippedPath === "/company/news") {
    const redirectedUrl = new URL("/news", request.url);

    redirectedUrl.search = request.nextUrl.search;

    logRuntimeRedirect(request, redirectedUrl, 307);

    return NextResponse.redirect(redirectedUrl, 307);
  }

  if (isCorpWebJapanInternalContentPath(strippedPath)) {
    const redirectedUrl = new URL(strippedPath, request.url);

    redirectedUrl.search = request.nextUrl.search;

    logRuntimeRedirect(request, redirectedUrl, 307);

    return NextResponse.redirect(redirectedUrl, 307);
  }

  const querypieRedirectedUrl = new URL(request.nextUrl.pathname, querypieOrigin);

  querypieRedirectedUrl.search = request.nextUrl.search;

  logRuntimeRedirect(request, querypieRedirectedUrl, 307);

  return NextResponse.redirect(querypieRedirectedUrl, 307);
}

export const HEAD = GET;
