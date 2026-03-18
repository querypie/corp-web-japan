import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateText(prompt: string, options?: { model?: string }) {
  const response = await ai.models.generateContent({
    model: options?.model ?? "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text ?? "";
}

export async function generateTextStream(prompt: string, options?: { model?: string }) {
  const response = await ai.models.generateContentStream({
    model: options?.model ?? "gemini-2.5-flash",
    contents: prompt,
  });
  return response;
}

export async function generateImage(
  prompt: string,
  options?: {
    aspectRatio?: string;
    negativePrompt?: string;
  }
) {
  const response = await ai.models.generateImages({
    model: "imagen-3.0-generate-002",
    prompt,
    config: {
      numberOfImages: 1,
      aspectRatio: options?.aspectRatio ?? "4:3",
      negativePrompt: options?.negativePrompt,
    },
  });

  const image = response.generatedImages?.[0]?.image;
  if (!image?.imageBytes) {
    throw new Error("이미지 생성에 실패했습니다.");
  }

  return {
    base64: image.imageBytes,
    mimeType: image.mimeType ?? "image/png",
  };
}
