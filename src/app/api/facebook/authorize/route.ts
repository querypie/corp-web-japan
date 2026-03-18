import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FACEBOOK_CONFIG, getFacebookRedirectUri } from "@/lib/facebook/config";
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
  cookieStore.set("facebook_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID!,
    redirect_uri: getFacebookRedirectUri(),
    scope: FACEBOOK_CONFIG.scopes.join(","),
    response_type: "code",
    state,
  });

  const authUrl = `${FACEBOOK_CONFIG.authorizationUrl}?${params.toString()}`;
  return NextResponse.redirect(authUrl);
}
