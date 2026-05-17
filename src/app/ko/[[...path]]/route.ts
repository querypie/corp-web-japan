import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { logRuntimeRedirect } from "@/lib/runtime-redirect-log";

const querypieOrigin = "https://www.querypie.com";

export function GET(request: NextRequest) {
  const querypieRedirectedUrl = new URL(request.nextUrl.pathname, querypieOrigin);
  const statusCode = 307;

  querypieRedirectedUrl.search = request.nextUrl.search;

  logRuntimeRedirect(request, querypieRedirectedUrl, statusCode);

  return NextResponse.redirect(querypieRedirectedUrl, statusCode);
}

export const HEAD = GET;
