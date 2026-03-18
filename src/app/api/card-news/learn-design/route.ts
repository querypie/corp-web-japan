import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const images = formData.getAll("images") as File[];
    const customInstruction = formData.get("customInstruction") as string | null;

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "참고 이미지를 업로드해주세요." },
        { status: 400 }
      );
    }

    const imageParts = await Promise.all(
      images.slice(0, 5).map(async (file) => {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        return {
          inlineData: {
            mimeType: file.type || "image/jpeg",
            data: base64,
          },
        };
      })
    );

    const prompt = `You are a layout extraction expert. Analyze the image and extract its structure as an editable card/poster template.

${customInstruction ? `User instructions: ${customInstruction}\n` : ""}

## CRITICAL: TWO-PASS ANALYSIS

### PASS 1 — Identify image regions FIRST
Before extracting any text, scan the entire image and identify ALL regions that contain:
- App UI screenshots / software interfaces
- Product photos / lifestyle photos
- Illustrations / graphics
- Any complex visual that is NOT plain text on a colored background

These regions become IMAGE SLOTS. Write down their bounding boxes.

### PASS 2 — Extract only top-level elements
Now extract text and image elements, with these strict rules:

**RULE 1 — IGNORE text inside image regions**
Any text that appears INSIDE an app screenshot, product photo, or complex UI is part of the image slot. Do NOT create a separate text element for it.
✓ Large headline directly on background → TEXT element
✗ Text inside an app window/screenshot → part of IMAGE SLOT, ignore

**RULE 2 — Merge wrapping text into one element**
A sentence or paragraph that wraps across multiple lines = ONE element.
Only create a new element when there is a clear visual break: different section, different font size, extra spacing between blocks.
✓ "The quick brown fox\njumps over the lazy dog" → ONE heading element (one long sentence, same font)
✗ Split by line breaks → WRONG

**RULE 3 — Only extract meaningful text**
Skip navigation items, dates, URLs, metadata, tiny labels (< 12px equivalent), breadcrumbs.
Focus on: main headline, subheadline, key body copy.

**RULE 4 — Image slots span their full visual area**
An app screenshot that is 80% wide and 30% tall = one image slot with those dimensions.

## POSITION MEASUREMENT
For every element, measure its bounding box as % of total image size.

CRITICAL: y=0 is the TOP of the image, y=100 is the BOTTOM.
Elements that appear HIGHER on the card MUST have LOWER y values.
A subheading that appears ABOVE an image must have y < that image's y value.

Measurements:
- "x": left edge % of image width
- "y": top edge % of image height  ← measured from TOP (0=top, 100=bottom)
- "width": element width % of image width
- "height": element height % of image height

ALIGNMENT RULE: All elements (text AND image slots) that share the same left margin in the reference MUST have the same "x" value. If heading starts at x=4, image slots at the same indent MUST also use x=4 — not x=5 or any other value.

LAYOUT EXAMPLE (text-above-image card):
- Large heading at top 37%: { x: 4, y: 3, width: 90, height: 37 }
- Short subheading just below: { x: 4, y: 42, width: 85, height: 8 }
- Screenshot/image in lower half: { x: 4, y: 52, width: 90, height: 44 }

For text elements also provide:
- "fontSize": estimated px size in the image
- "fontSizePercent": fontSize / imageWidth * 100 (for proportional CSS rendering)

Respond ONLY with this JSON (no markdown, no explanation):
{
  "name": "Korean style name",
  "styleDescription": "2–3 sentence Korean description",
  "backgroundColor": "#HEX",
  "backgroundGradient": null,
  "colors": ["#HEX1", "#HEX2", "#HEX3"],
  "fontStyle": "Korean font description",
  "layoutPattern": "Korean layout description",
  "elements": [
    {
      "type": "text",
      "tag": "heading",
      "label": "메인 제목",
      "content": "Full exact text including all wrapped lines as one string",
      "color": "#000000",
      "fontSize": 90,
      "fontSizePercent": 9.0,
      "x": 4,
      "y": 5,
      "width": 90,
      "height": 55
    },
    {
      "type": "text",
      "tag": "subheading",
      "label": "서브 제목",
      "content": "Full exact subheading text as one string",
      "color": "#111111",
      "fontSize": 36,
      "fontSizePercent": 3.6,
      "x": 4,
      "y": 62,
      "width": 90,
      "height": 12
    },
    {
      "type": "image",
      "tag": "main",
      "label": "메인 이미지",
      "searchKeyword": "app ui dashboard screenshot",
      "x": 4,
      "y": 74,
      "width": 90,
      "height": 24
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [...imageParts, { text: prompt }],
        },
      ],
    });

    const result = response.text ?? "";
    const cleaned = result
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed = JSON.parse(cleaned);

    const template = {
      name: parsed.name,
      styleDescription: parsed.styleDescription,
      backgroundColor: parsed.backgroundColor || "#1a1a2e",
      backgroundGradient: parsed.backgroundGradient || null,
      colors: parsed.colors,
      fontStyle: parsed.fontStyle,
      layoutPattern: parsed.layoutPattern,
    };

    const elements = (parsed.elements || []).map(
      (
        el: {
          type: string;
          tag: string;
          label: string;
          content?: string;
          color?: string;
          fontSize?: number;
          fontSizePercent?: number;
          searchKeyword?: string;
          x?: number;
          y?: number;
          width?: number;
          height?: number;
        },
        i: number
      ) => ({
        id: `el-learn-${Date.now()}-${i}`,
        type: el.type,
        tag: el.tag,
        label: el.label,
        content: el.content || "",
        color: el.color || "#FFFFFF",
        fontSize: el.fontSize || undefined,
        fontSizePercent: el.fontSizePercent || undefined,
        searchKeyword: el.searchKeyword || "",
        xPercent: el.x ?? undefined,
        yPercent: el.y ?? undefined,
        widthPercent: el.width ?? undefined,
        heightPercent: el.height ?? undefined,
      })
    );

    return NextResponse.json({ template, elements });
  } catch (error) {
    console.error("Design learning error:", error);
    return NextResponse.json(
      { error: "디자인 분석에 실패했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
