import { NextResponse } from "next/server";
import {
  buildContactUsSalesforceBody,
  isContactUsFormValid,
  type ContactUsFormState,
} from "@/lib/contact-us";

type SubmitPayload = {
  form: ContactUsFormState;
  referrerUrl?: string;
};

const errorResponse = (message: string, status: number) =>
  NextResponse.json({ success: false, message }, { status });

export async function POST(request: Request) {
  let payload: SubmitPayload;

  try {
    payload = (await request.json()) as SubmitPayload;
  } catch {
    return errorResponse("リクエストデータを読み取れませんでした。", 400);
  }

  if (!payload?.form || !isContactUsFormValid(payload.form)) {
    return errorResponse("入力内容に不足または誤りがあります。", 400);
  }

  const endpoint = process.env.SALESFORCE_ENDPOINT;

  if (!endpoint) {
    return errorResponse(
      "現在この環境ではお問い合わせ送信が有効化されていません。設定完了後にご利用いただけます。",
      503,
    );
  }

  const body = buildContactUsSalesforceBody(
    payload.form,
    payload.referrerUrl ?? request.headers.get("referer") ?? "",
  );

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        charset: "utf-8",
      },
      body: JSON.stringify(body),
    });

    const json = (await response.json().catch(() => null)) as
      | { recordUUID?: string }
      | null;

    if (!response.ok || !json?.recordUUID) {
      return errorResponse("お問い合わせの送信に失敗しました。しばらくしてから再度お試しください。", 502);
    }

    return NextResponse.json({ success: true });
  } catch {
    return errorResponse("送信中にエラーが発生しました。しばらくしてから再度お試しください。", 502);
  }
}
