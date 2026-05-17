import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { logRuntimeRedirect } from "@/lib/runtime-redirect-log";

const destinationPath = "/about-us";

export function GET(request: NextRequest) {
  const destination = new URL(destinationPath, request.url);
  destination.search = request.nextUrl.search;
  const statusCode = 307;

  logRuntimeRedirect(request, destination, statusCode);

  return NextResponse.redirect(destination, statusCode);
}

export const HEAD = GET;
