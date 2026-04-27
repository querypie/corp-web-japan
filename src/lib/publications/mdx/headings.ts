import type { PublicationTocItem } from "@/lib/publications/types";

export function slugifyHeadingText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function cleanHeadingText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .trim();
}

export function extractHeadingsFromMdx(mdxSource: string): PublicationTocItem[] {
  const result: PublicationTocItem[] = [];
  const stack: { level: number; heading: PublicationTocItem }[] = [];
  const headingRegex = /^(#{1,6})\s+(.*)$/;
  const codeBlockRegex = /^```/;
  let inCodeBlock = false;

  for (const line of mdxSource.split("\n")) {
    if (codeBlockRegex.test(line.trim())) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) continue;

    const match = headingRegex.exec(line);
    if (!match) continue;

    const level = match[1].length;
    const text = cleanHeadingText(match[2].trim());
    if (!text) continue;

    const heading: PublicationTocItem = {
      targetId: slugifyHeadingText(text),
      text,
    };

    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      result.push(heading);
    } else {
      const parent = stack[stack.length - 1].heading;
      parent.items = parent.items ?? [];
      parent.items.push(heading);
    }

    stack.push({ level, heading });
  }

  return result;
}
