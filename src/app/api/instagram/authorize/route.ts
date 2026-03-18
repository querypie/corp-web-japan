import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { INSTAGRAM_CONFIG, getRedirectUri } from "@/lib/instagram/config";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // CSRF state token
  const state = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set("instagram_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  const params = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID!,
    redirect_uri: getRedirectUri(),
    scope: INSTAGRAM_CONFIG.scopes.join(","),
    response_type: "code",
    state,
  });

  const authUrl = `${INSTAGRAM_CONFIG.authorizationUrl}?${params.toString()}`;
  return NextResponse.redirect(authUrl);
}
