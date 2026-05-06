import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const destinationPath = "/news";

export function GET(request: NextRequest) {
  const destination = new URL(destinationPath, request.url);

  destination.search = request.nextUrl.search;

  return NextResponse.redirect(destination, 307);
}

export const HEAD = GET;
