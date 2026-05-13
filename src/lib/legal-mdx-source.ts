import { readFile } from "node:fs/promises";
import { evaluate } from "next-mdx-remote-client/rsc";
import type { MDXComponents } from "mdx/types";
import remarkGfm from "remark-gfm";
import { buildLegalDocumentMdxComponents } from "@/components/sections/legal/mdx";

const legalMdxSourceCache = new Map<string, Promise<string>>();

export async function readCachedLegalMdxSource(sourcePath: string) {
  const cachedSource = legalMdxSourceCache.get(sourcePath);
  if (cachedSource) {
    return cachedSource;
  }

  const sourcePromise = readFile(sourcePath, "utf8").catch((error) => {
    legalMdxSourceCache.delete(sourcePath);
    throw error;
  });

  legalMdxSourceCache.set(sourcePath, sourcePromise);
  return sourcePromise;
}

type RenderLegalMdxOptions = {
  sourcePath: string;
  components?: MDXComponents;
};

export async function renderLegalMdx<Frontmatter extends Record<string, unknown>>({
  sourcePath,
  components = buildLegalDocumentMdxComponents(),
}: RenderLegalMdxOptions) {
  const source = await readCachedLegalMdxSource(sourcePath);

  return evaluate<Frontmatter>({
    source,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });
}
