import { NextResponse } from "next/server";
import {
  buildGatingCookieName,
  getGatingCookieMaxAgeSeconds,
} from "@/lib/publications/gating";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { contentKey?: unknown } | null;
  const contentKey = typeof body?.contentKey === "string" ? body.contentKey.trim() : "";

  if (!contentKey) {
    return NextResponse.json({ success: false, error: "Missing contentKey" }, { status: 400 });
  }

  const response = NextResponse.json({ success: true, mode: "dummy" });

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
