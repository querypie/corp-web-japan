import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureValidToken } from "@/lib/instagram/token";
import {
  createMediaContainer,
  createCarouselContainer,
  waitForContainerReady,
  publishContainer,
} from "@/lib/instagram/publish";

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

  if (!mediaUrls?.length) {
    return NextResponse.json(
      { error: "Instagram은 최소 1개의 이미지가 필요합니다." },
      { status: 400 }
    );
  }

  // Fetch account from DB
  const { data: account, error: accountError } = await supabase
    .from("sns_accounts")
    .select("*")
    .eq("id", accountId)
    .eq("user_id", user.id)
    .eq("platform", "instagram")
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
      account.token_expires_at
    );

    const igUserId = account.platform_user_id;

    // Create container
    let containerId: string;
    if (mediaUrls.length === 1) {
      containerId = await createMediaContainer(
        igUserId,
        accessToken,
        mediaUrls[0],
        content
      );
    } else {
      containerId = await createCarouselContainer(
        igUserId,
        accessToken,
        mediaUrls,
        content
      );
    }

    // Wait for container to be ready
    await waitForContainerReady(containerId, accessToken);

    // Publish
    const platformPostId = await publishContainer(
      igUserId,
      accessToken,
      containerId
    );

    return NextResponse.json({
      success: true,
      platformPostId,
    });
  } catch (err) {
    console.error("Instagram publish error:", err);
    const message =
      err instanceof Error
        ? err.message
        : "Instagram 발행 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
