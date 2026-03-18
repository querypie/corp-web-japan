import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/ai/gemini";

export async function POST(request: NextRequest) {
  try {
    const { instruction, currentHeading, currentBody } = await request.json() as {
      instruction: string;
      currentHeading: string;
      currentBody: string;
    };

    if (!instruction) {
      return NextResponse.json({ error: "수정 요청을 입력해주세요." }, { status: 400 });
    }

    const prompt = `당신은 인스타그램 카드뉴스 카피라이터입니다.
사용자가 현재 슬라이드의 텍스트 수정을 요청했습니다.

## 현재 슬라이드 내용
- heading (제목): "${currentHeading}"
- body (본문): "${currentBody}"

## 사용자 수정 요청
"${instruction}"

## 중요 규칙
1. 사용자가 요청한 부분만 수정하세요!
   - "제목" 관련 요청이면 heading만 수정하고 body는 그대로 유지
   - "본문" 관련 요청이면 body만 수정하고 heading은 그대로 유지
   - 둘 다 수정 요청이면 둘 다 수정
2. heading: 8자 이내, 후킹 문구 스타일
3. body: 10자 이내, 짧고 임팩트 있게
4. 쉼표(,) 사용 금지, 이모티콘/이모지 사용 금지

반드시 아래 JSON 형식으로만 응답하세요:
{
  "heading": "수정된 또는 기존 제목",
  "body": "수정된 또는 기존 본문"
}`;

    const result = await generateText(prompt);
    const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      heading: parsed.heading || currentHeading,
      body: parsed.body || currentBody,
    });
  } catch (error) {
    console.error("Card news edit error:", error);
    return NextResponse.json(
      { error: "수정에 실패했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
