import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const strippedPath = request.nextUrl.pathname.replace(/^\/ja(?=\/|$)/, "") || "/";
  const redirectedUrl = new URL(strippedPath, request.url);

  redirectedUrl.search = request.nextUrl.search;

  return NextResponse.redirect(redirectedUrl, 307);
}

export const HEAD = GET;
