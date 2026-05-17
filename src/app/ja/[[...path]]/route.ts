import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isCorpWebJapanInternalContentPath } from "@/lib/corp-web-japan-internal-content-path";
import { logRuntimeRedirect } from "@/lib/runtime-redirect-log";

const querypieOrigin = "https://www.querypie.com";

export function GET(request: NextRequest) {
  const strippedPath = request.nextUrl.pathname.replace(/^\/ja(?=\/|$)/, "") || "/";
  const statusCode = 307;

  if (strippedPath === "/company/news") {
    const redirectedUrl = new URL("/news", request.url);

    redirectedUrl.search = request.nextUrl.search;

    logRuntimeRedirect(request, redirectedUrl, statusCode);

    return NextResponse.redirect(redirectedUrl, statusCode);
  }

  if (isCorpWebJapanInternalContentPath(strippedPath)) {
    const redirectedUrl = new URL(strippedPath, request.url);

    redirectedUrl.search = request.nextUrl.search;

    logRuntimeRedirect(request, redirectedUrl, statusCode);

    return NextResponse.redirect(redirectedUrl, statusCode);
  }

  const querypieRedirectedUrl = new URL(request.nextUrl.pathname, querypieOrigin);

  querypieRedirectedUrl.search = request.nextUrl.search;

  logRuntimeRedirect(request, querypieRedirectedUrl, statusCode);

  return NextResponse.redirect(querypieRedirectedUrl, statusCode);
}

export const HEAD = GET;
