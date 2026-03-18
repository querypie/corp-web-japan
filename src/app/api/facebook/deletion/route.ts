import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Facebook Data Deletion Request Callback
// Facebook sends a signed request when a user removes the app
// https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const signedRequest = formData.get("signed_request") as string;

    if (!signedRequest) {
      return NextResponse.json(
        { error: "Missing signed_request" },
        { status: 400 }
      );
    }

    const data = parseSignedRequest(signedRequest);
    if (!data) {
      return NextResponse.json(
        { error: "Invalid signed_request" },
        { status: 400 }
      );
    }

    const userId = data.user_id;
    const confirmationCode = crypto.randomUUID();

    // In production, you would delete user data from your database here
    // For now, we acknowledge the request
    console.log(`[Facebook] Data deletion requested for user: ${userId}`);

    // Facebook expects this specific response format
    const statusUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/facebook/deletion-status?code=${confirmationCode}`;

    return NextResponse.json({
      url: statusUrl,
      confirmation_code: confirmationCode,
    });
  } catch (error) {
    console.error("[Facebook] Data deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function parseSignedRequest(
  signedRequest: string
): { user_id: string } | null {
  const [encodedSig, payload] = signedRequest.split(".");
  if (!encodedSig || !payload) return null;

  const secret = process.env.FACEBOOK_APP_SECRET;
  if (!secret) return null;

  const sig = base64UrlDecode(encodedSig);
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest();

  if (!crypto.timingSafeEqual(sig, expectedSig)) {
    console.error("[Facebook] Invalid signature in signed_request");
    return null;
  }

  const decoded = JSON.parse(base64UrlDecode(payload).toString("utf-8"));
  return decoded;
}

function base64UrlDecode(str: string): Buffer {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  return Buffer.from(base64, "base64");
}
