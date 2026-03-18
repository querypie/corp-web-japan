import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/ai/gemini";

export async function POST(request: NextRequest) {
  try {
    const { mode, prompt, count } = await request.json();

    const modeDescriptions: Record<string, string> = {
      creative:
        "창의적이고 독창적인 아이디어를 생성해주세요. 트렌드에 얽매이지 않고 자유롭게 발상해주세요.",
      search:
        "최신 트렌드와 검색 데이터를 고려한 실용적인 아이디어를 생성해주세요. 사람들이 실제로 관심있어할 주제로 만들어주세요.",
      knowledge:
        "전문적이고 교육적인 관점에서 깊이 있는 아이디어를 생성해주세요. 내부 지식과 전문성을 활용해주세요.",
    };

    const systemPrompt = `당신은 SNS 콘텐츠 마케팅 전문가입니다.
사용자의 요청에 맞는 SNS 콘텐츠 아이디어를 ${count}개 생성해주세요.

모드: ${modeDescriptions[mode] || modeDescriptions.creative}

${prompt ? `사용자 방향: ${prompt}` : "자유 주제로 아이디어를 생성해주세요."}

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요:
[
  {
    "title": "아이디어 제목 (한 줄)",
    "content": "아이디어 상세 설명 (2-3문장)",
    "hashtags": ["관련해시태그1", "관련해시태그2", "관련해시태그3"]
  }
]`;

    const result = await generateText(systemPrompt);

    // JSON 파싱 (마크다운 코드블록 제거)
    const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const ideas = JSON.parse(cleaned);

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("Ideas generation error:", error);
    return NextResponse.json(
      { error: "아이디어 생성에 실패했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
