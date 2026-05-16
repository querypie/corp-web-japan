import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const destination = new URL("/use-cases", request.url);
  destination.search = request.nextUrl.search;

  return NextResponse.redirect(destination, 308);
}

export const HEAD = GET;
