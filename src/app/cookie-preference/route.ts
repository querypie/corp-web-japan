import { NextResponse } from "next/server";

const destination = "https://www.querypie.com/ja/cookie-preference";

export function GET() {
  return NextResponse.redirect(destination, 307);
}

export const HEAD = GET;
