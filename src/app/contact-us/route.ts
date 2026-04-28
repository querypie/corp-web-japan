import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CONTACT_REDIRECT_TARGET } from "@/lib/contact";

export function GET(request: NextRequest) {
  const redirectedUrl = new URL(CONTACT_REDIRECT_TARGET);
  redirectedUrl.search = request.nextUrl.search;
  return NextResponse.redirect(redirectedUrl, 307);
}

export const HEAD = GET;
