import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const destinationUrl = "https://www.querypie.com/querypie/license/community/apply";

export function GET(request: NextRequest) {
  const destination = new URL(destinationUrl);
  destination.search = request.nextUrl.search;

  return NextResponse.redirect(destination, 307);
}

export const HEAD = GET;
