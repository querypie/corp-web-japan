import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { logRuntimeRedirect } from "@/lib/runtime-redirect-log";

const destinationPath = "/privacy-policy";

export function GET(request: NextRequest) {
  const destination = new URL(destinationPath, request.url);
  destination.search = request.nextUrl.search;

  logRuntimeRedirect(request, destination, 307);

  return NextResponse.redirect(destination, 307);
}

export const HEAD = GET;
