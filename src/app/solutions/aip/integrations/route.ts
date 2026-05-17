import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { logRuntimeRedirect } from "@/lib/runtime-redirect-log";

const destinationPath = "/platforms/aip/integrations";

export function GET(request: NextRequest) {
  const destination = new URL(destinationPath, request.url);
  destination.search = request.nextUrl.search;

  logRuntimeRedirect({
    requestedPath: request.nextUrl.pathname,
    redirectTarget: destination,
    requestUrl: request.url,
    host: request.nextUrl.host,
    referer: request.headers.get("referer"),
    userAgent: request.headers.get("user-agent"),
  });

  return NextResponse.redirect(destination, 307);
}

export const HEAD = GET;
