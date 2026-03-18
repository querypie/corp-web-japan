import { NextRequest, NextResponse } from "next/server";
import { generateText, generateImage } from "@/lib/ai/gemini";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

interface TemplateStyle {
  name: string;
  category: string;
  layout: string;
  imagePrompt: string;
}

// Unsplash에서 키워드로 이미지 검색
async function searchUnsplash(
  query: string,
  orientation: "portrait" | "landscape" = "portrait"
): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) return null;
  try {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", query);
    url.searchParams.set("per_page", "1");
    url.searchParams.set("orientation", orientation);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (data.results && data.results.length > 0) {
      // w=1080 품질로 가져오기
      return data.results[0].urls.regular;
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { topic, aspectRatio, slideCount, templateStyle } = await request.json() as {
      topic: string;
      aspectRatio?: string;
      slideCount?: number;
      templateStyle?: TemplateStyle;
    };

    if (!topic) {
      return NextResponse.json({ error: "주제를 입력해주세요." }, { status: 400 });
    }

    const count = slideCount || 2;
    const ratio = aspectRatio || "4:5";

    // 템플릿 스타일이 적용된 경우 추가 지시사항
    const templateInstruction = templateStyle
      ? `
디자인 스타일: "${templateStyle.name}" (${templateStyle.category})
레이아웃 패턴: ${templateStyle.layout}
- 이 템플릿의 톤 앤 매너에 맞춰 콘텐츠를 작성하세요.
- 제목은 해당 카테고리(${templateStyle.category})에 어울리는 스타일로 작성하세요.
- 각 슬라이드의 designNote에 이 템플릿 스타일에 맞는 구체적인 디자인 지시를 포함하세요.
`
      : "";

    const prompt = `당신은 인스타그램 카드뉴스 콘텐츠 전문가입니다.
아래 주제로 카드뉴스 슬라이드 ${count}장을 구성해주세요.
이미지 비율: ${ratio}
${templateInstruction}
주제: ${topic}

## 작성 규칙 (매우 중요!)
- heading: 후킹 문구! 호기심을 자극하는 짧고 강렬한 한 줄 (8자 이내)
  예시: "이거 실화?", "아직도 몰라?", "딱 3가지만", "지금 당장!", "숨은 맛집 발견"
- body: 후킹 서브카피! heading을 보완하는 짧은 문구 (10자 이내)
  예시: "알면 인생이 달라짐", "모르면 손해", "저장 필수", "끝까지 보세요"
- heading과 body 모두 궁금증을 유발하고 스크롤을 멈추게 하는 후킹 카피로 작성
- 설명조 금지! 짧고 임팩트 있게만 작성
- 쉼표(,) 사용 금지, 이모티콘/이모지 사용 금지, 특수문자 최소화
${count === 1
  ? `- 1번 슬라이드: 핵심 메시지를 담은 표지 (후킹 제목 + CTA)`
  : `- 1번 슬라이드: 표지 — 가장 강력한 후킹 제목
- 2~${count - 1}번 슬라이드: 본문 — 핵심 포인트 (후킹 카피 유지)
- ${count}번 슬라이드: 마무리/CTA — 팔로우 유도 또는 저장 유도`}
- 인스타그램 감성에 맞는 톤으로 작성
- imageKeyword: 각 슬라이드에 어울리는 영어 이미지 검색 키워드 (실사 사진용, 1~3단어)

반드시 아래 JSON 형식으로만 응답하세요:
{
  "title": "카드뉴스 전체 제목",
  "slides": [
    {
      "slideNumber": 1,
      "heading": "짧은 제목",
      "body": "짧은 본문",
      "designNote": "배경 색상, 레이아웃, 분위기 제안",
      "imageKeyword": "keyword for photo search"
    }
  ]
}`;

    // 텍스트 생성 + 템플릿 배경 이미지 생성을 병렬로 실행
    const textPromise = generateText(prompt);
    const imagePromise = templateStyle
      ? generateImage(templateStyle.imagePrompt, {
          aspectRatio: ratio === "4:5" ? "3:4" : ratio === "9:16" ? "9:16" : "4:3",
          negativePrompt: "text, words, letters, typography, watermark, signature, logo, blurry, low quality, ugly, deformed",
        }).catch(() => null)
      : Promise.resolve(null);

    const [result, coverImage] = await Promise.all([textPromise, imagePromise]);

    const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const cardNews = JSON.parse(cleaned);

    // Unsplash에서 각 슬라이드별 배경 이미지 검색
    const orientation = ratio === "16:9" ? "landscape" as const : "portrait" as const;
    const imagePromises = (cardNews.slides as Array<{ imageKeyword?: string }>).map(
      (slide) => slide.imageKeyword
        ? searchUnsplash(slide.imageKeyword, orientation)
        : Promise.resolve(null)
    );
    const unsplashImages = await Promise.all(imagePromises);

    // 각 슬라이드에 이미지 URL 삽입
    cardNews.slides = cardNews.slides.map(
      (slide: Record<string, unknown>, i: number) => ({
        ...slide,
        imageUrl: unsplashImages[i] || undefined,
      })
    );

    return NextResponse.json({
      cardNews,
      coverImage: coverImage
        ? { base64: coverImage.base64, mimeType: coverImage.mimeType }
        : null,
      templateApplied: !!templateStyle,
    });
  } catch (error) {
    console.error("Card news generation error:", error);
    return NextResponse.json(
      { error: "카드뉴스 생성에 실패했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
