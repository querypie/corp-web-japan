import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const redirectedUrl = new URL("/contact-us", request.url);
  redirectedUrl.search = request.nextUrl.search;
  return NextResponse.redirect(redirectedUrl, 307);
}

export const HEAD = GET;
