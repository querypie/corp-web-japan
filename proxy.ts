import { NextResponse, type NextRequest } from "next/server";
import { STAGING_SITE_HOST } from "@/lib/site-url";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const requestHost = (request.headers.get("x-forwarded-host") ?? request.headers.get("host"))
    ?.split(",")[0]
    ?.trim()
    .split(":")[0];

  if (requestHost === STAGING_SITE_HOST) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
