import { NextResponse } from "next/server";

const destination = "https://www.querypie.com/ja/solutions/aip/mcp-gateway";

export function GET() {
  return NextResponse.redirect(destination, 307);
}

export const HEAD = GET;
