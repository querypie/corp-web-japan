import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/platforms/aip/usage-based-llm", request.url), 307);
}

export const HEAD = GET;
