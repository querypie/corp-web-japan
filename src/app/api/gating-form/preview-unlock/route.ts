import { NextResponse } from "next/server";
import {
  buildGatingCookieName,
  getGatingCookieMaxAgeSeconds,
} from "@/lib/publications/gating";
import { isPreviewNavigationToggleVisible } from "@/lib/preview-navigation";

const errorResponse = (message: string, status: number) =>
  NextResponse.json({ success: false, message }, { status });

export async function POST(request: Request) {
  if (!isPreviewNavigationToggleVisible()) {
    return errorResponse("preview unlock is not available in production.", 403);
  }

  const payload = (await request.json().catch(() => null)) as { contentKey?: string } | null;
  const contentKey = payload?.contentKey?.trim();

  if (!contentKey) {
    return errorResponse("contentKey が指定されていません。", 400);
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: buildGatingCookieName(contentKey),
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    secure: request.url.startsWith("https://"),
    path: "/",
    maxAge: getGatingCookieMaxAgeSeconds(),
  });

  return response;
}
