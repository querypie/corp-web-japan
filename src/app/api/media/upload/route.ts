import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/quicktime",
];
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return NextResponse.json(
      { error: "파일이 없습니다." },
      { status: 400 }
    );
  }

  if (files.length > 10) {
    return NextResponse.json(
      { error: "최대 10개까지 업로드할 수 있습니다." },
      { status: 400 }
    );
  }

  const uploadedUrls: string[] = [];

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `지원하지 않는 파일 형식: ${file.type}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `파일이 너무 큽니다: ${file.name}` },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("post-media")
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "파일 업로드에 실패했습니다." },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from("post-media")
      .getPublicUrl(fileName);

    uploadedUrls.push(urlData.publicUrl);
  }

  return NextResponse.json({ urls: uploadedUrls });
}
