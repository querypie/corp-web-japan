import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/ai/gemini";

export async function POST(request: NextRequest) {
  try {
    const { imagePrompt, aspectRatio } = await request.json();

    if (!imagePrompt) {
      return NextResponse.json(
        { error: "이미지 프롬프트가 필요합니다." },
        { status: 400 }
      );
    }

    const result = await generateImage(imagePrompt, {
      aspectRatio: aspectRatio || "9:16",
      negativePrompt: "text, words, letters, typography, watermark, signature, logo, blurry, low quality, ugly, deformed, cartoon, illustration, drawing, painting, anime",
    });

    return NextResponse.json({
      image: {
        base64: result.base64,
        mimeType: result.mimeType,
      },
    });
  } catch (error) {
    console.error("Template preview generation error:", error);
    return NextResponse.json(
      { error: "프리뷰 이미지 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
