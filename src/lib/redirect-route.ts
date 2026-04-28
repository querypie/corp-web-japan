import { NextResponse } from "next/server";

export function createRedirectHandlers(destination: string) {
  function GET() {
    return NextResponse.redirect(destination, 307);
  }

  return { GET, HEAD: GET };
}
