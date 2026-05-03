import { NextResponse } from "next/server";
import {
  PREVIEW_NAVIGATION_COOKIE,
  isPreviewNavigationToggleVisible,
} from "@/lib/preview-navigation";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as { enabled?: boolean } | null;
  const enabled = payload?.enabled === true;

  const response = NextResponse.json({ ok: true, enabled });

  response.cookies.set(PREVIEW_NAVIGATION_COOKIE, enabled ? "on" : "off", {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    secure: true,
    maxAge: 60 * 60 * 24 * 365,
  });

  if (!isPreviewNavigationToggleVisible()) {
    response.cookies.set(PREVIEW_NAVIGATION_COOKIE, "off", {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      secure: true,
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}
