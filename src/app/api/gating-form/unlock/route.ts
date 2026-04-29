import { NextResponse } from "next/server";
import {
  submitGatingForm,
  type GatingFormSubmitPayload,
} from "@/lib/gating-form-submit";
import {
  buildGatingCookieName,
  getGatingCookieMaxAgeSeconds,
} from "@/lib/publications/gating";

const errorResponse = (message: string, status: number) =>
  NextResponse.json({ success: false, message }, { status });

export async function POST(request: Request) {
  let payload: GatingFormSubmitPayload;

  try {
    payload = (await request.json()) as GatingFormSubmitPayload;
  } catch {
    return errorResponse("リクエストデータを読み取れませんでした。", 400);
  }

  const contentKey = payload?.contentKey?.trim();
  if (!contentKey) {
    return errorResponse("contentKey が指定されていません。", 400);
  }

  const result = await submitGatingForm(
    payload,
    request.headers.get("referer") ?? "",
  );

  if (!result.success) {
    return errorResponse(
      result.message ?? "限定コンテンツの送信処理に失敗しました。しばらくしてから再度お試しください。",
      result.status,
    );
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
