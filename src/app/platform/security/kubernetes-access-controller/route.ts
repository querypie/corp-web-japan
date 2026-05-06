import { NextResponse } from "next/server";

const destination = "https://www.querypie.com/ja/solutions/acp/kubernetes-access-controller";

export function GET() {
  return NextResponse.redirect(destination, 307);
}

export const HEAD = GET;
