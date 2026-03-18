import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureValidToken } from "@/lib/facebook/token";
import {
  publishTextPost,
  publishPhotoPost,
  publishMultiPhotoPost,
} from "@/lib/facebook/publish";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { accountId, content, mediaUrls } = await request.json();

  if (!accountId || !content) {
    return NextResponse.json(
      { error: "accountId, content는 필수입니다." },
      { status: 400 }
    );
  }

  // Fetch account from DB
  const { data: account, error: accountError } = await supabase
    .from("sns_accounts")
    .select("*")
    .eq("id", accountId)
    .eq("user_id", user.id)
    .eq("platform", "facebook")
    .single();

  if (accountError || !account) {
    return NextResponse.json(
      { error: "계정을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  try {
    const accessToken = await ensureValidToken(
      account.id,
      account.access_token,
      account.refresh_token,
      account.token_expires_at
    );

    const pageId = account.platform_user_id;
    let platformPostId: string;

    if (!mediaUrls || mediaUrls.length === 0) {
      // Text-only post
      platformPostId = await publishTextPost(pageId, accessToken, content);
    } else if (mediaUrls.length === 1) {
      // Single photo post
      platformPostId = await publishPhotoPost(
        pageId,
        accessToken,
        mediaUrls[0],
        content
      );
    } else {
      // Multi-photo post
      platformPostId = await publishMultiPhotoPost(
        pageId,
        accessToken,
        mediaUrls,
        content
      );
    }

    return NextResponse.json({
      success: true,
      platformPostId,
    });
  } catch (err) {
    console.error("Facebook publish error:", err);
    const message =
      err instanceof Error
        ? err.message
        : "Facebook 발행 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
