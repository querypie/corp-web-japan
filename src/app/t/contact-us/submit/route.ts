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
    return errorResponse("Invalid request body.", 400);
  }

  if (!payload?.form || !isContactUsFormValid(payload.form)) {
    return errorResponse("Required fields are missing or invalid.", 400);
  }

  const endpoint = process.env.SALESFORCE_ENDPOINT;

  if (!endpoint) {
    return errorResponse(
      "The contact-us submission endpoint is not configured in the current environment yet.",
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
      return errorResponse("Failed to submit the contact-us form to the upstream endpoint.", 502);
    }

    return NextResponse.json({ success: true });
  } catch {
    return errorResponse("Unexpected error occurred while submitting the contact-us form.", 502);
  }
}
