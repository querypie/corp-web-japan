import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const destinationPath = "/solutions/as400-cobol";

export function GET(request: NextRequest) {
  const destination = new URL(destinationPath, request.url);
  destination.search = request.nextUrl.search;

  return NextResponse.redirect(destination, 307);
}

export const HEAD = GET;
