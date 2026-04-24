import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const contactUsUrl = new URL("https://www.querypie.com/ja/company/contact-us");

export function GET(request: NextRequest) {
  const redirectedUrl = new URL(contactUsUrl);
  redirectedUrl.search = request.nextUrl.search;
  return NextResponse.redirect(redirectedUrl, 307);
}

export const HEAD = GET;
