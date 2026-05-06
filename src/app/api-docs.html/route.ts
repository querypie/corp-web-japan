import { NextResponse } from "next/server";

const destination = "https://docs.querypie.com/ja/api-reference";

export function GET() {
  return NextResponse.redirect(destination, 307);
}

export const HEAD = GET;
