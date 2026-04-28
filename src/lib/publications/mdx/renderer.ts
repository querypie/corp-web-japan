import { evaluate } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import { buildPublicationMdxComponents } from "@/lib/publications/mdx/components";

type RenderPublicationMdxOptions = {
  parseFrontmatter?: boolean;
};

export async function renderPublicationMdx<TFrontmatter extends Record<string, unknown> = Record<string, unknown>>(
  source: string,
  { parseFrontmatter = true }: RenderPublicationMdxOptions = {},
) {
  return evaluate<TFrontmatter>({
    source,
    components: buildPublicationMdxComponents(),
    options: {
      parseFrontmatter,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });
}
