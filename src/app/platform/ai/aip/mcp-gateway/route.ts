import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PREVIEW_NAVIGATION_COOKIE, isPreviewNavigationEnabled } from "@/lib/preview-navigation";

const internalDestinationPath = "/t/solutions/aip/mcp-gateway";
const productionDestination = "https://www.querypie.com/ja/solutions/aip/mcp-gateway";

export function GET(request: NextRequest) {
  const previewCookieValue = request.cookies.get(PREVIEW_NAVIGATION_COOKIE)?.value;

  if (isPreviewNavigationEnabled(previewCookieValue)) {
    const destination = new URL(internalDestinationPath, request.url);

    destination.search = request.nextUrl.search;

    return NextResponse.redirect(destination, 307);
  }

  const destination = new URL(productionDestination);

  destination.search = request.nextUrl.search;

  return NextResponse.redirect(destination, 307);
}

export const HEAD = GET;
