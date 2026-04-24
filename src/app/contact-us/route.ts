import { NextRequest, NextResponse } from "next/server";

const destination = new URL("https://www.querypie.com/ja/company/contact-us");

export function GET(request: NextRequest) {
  const redirectedUrl = new URL(destination);

  redirectedUrl.search = request.nextUrl.search;

  return NextResponse.redirect(redirectedUrl, 307);
}

export const HEAD = GET;
