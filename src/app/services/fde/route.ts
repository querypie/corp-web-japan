import { NextResponse } from "next/server";

const destination = "https://www.querypie.ai/solutions/aip/fde-services";

export function GET() {
  return NextResponse.redirect(destination, 307);
}

export const HEAD = GET;
