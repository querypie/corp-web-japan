import { NextResponse } from "next/server";

const destination = "/whitepapers";

export function GET() {
  return NextResponse.redirect(destination, 307);
}
