import { NextResponse } from "next/server";
import {
  submitContactUsForm,
  type ContactUsSubmitPayload,
} from "@/lib/contact-us-submit";

const errorResponse = (message: string, status: number) =>
  NextResponse.json({ success: false, message }, { status });

export async function POST(request: Request) {
  let payload: ContactUsSubmitPayload;

  try {
    payload = (await request.json()) as ContactUsSubmitPayload;
  } catch {
    return errorResponse("リクエストデータを読み取れませんでした。", 400);
  }

  const result = await submitContactUsForm(
    payload,
    request.headers.get("referer") ?? "",
  );

  if (!result.success) {
    return errorResponse(
      result.message ?? "お問い合わせの送信に失敗しました。しばらくしてから再度お試しください。",
      result.status,
    );
  }

  return NextResponse.json({ success: true });
}
