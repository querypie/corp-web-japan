import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/platforms/acp/database-access-controller", request.url), 307);
}

export const HEAD = GET;
