import { evaluate } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import { buildPublicationMdxComponents } from "@/lib/publications/mdx/components";

export async function renderPublicationMdx<TFrontmatter extends Record<string, unknown> = Record<string, unknown>>(
  source: string,
) {
  return evaluate<TFrontmatter>({
    source,
    components: buildPublicationMdxComponents(),
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });
}
