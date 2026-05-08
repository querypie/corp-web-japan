import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const querypieOrigin = "https://www.querypie.com";

export function GET(request: NextRequest) {
  const querypieRedirectedUrl = new URL(request.nextUrl.pathname, querypieOrigin);

  querypieRedirectedUrl.search = request.nextUrl.search;

  return NextResponse.redirect(querypieRedirectedUrl, 307);
}

export const HEAD = GET;
