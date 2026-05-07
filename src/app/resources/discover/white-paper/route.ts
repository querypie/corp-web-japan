import { NextResponse } from "next/server";

export function GET(request: Request) {
  const destination = new URL("/whitepapers", request.url);

  return NextResponse.redirect(destination, 307);
}
