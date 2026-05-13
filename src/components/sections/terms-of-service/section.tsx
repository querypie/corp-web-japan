import { join } from "node:path";
import { evaluate } from "next-mdx-remote-client/rsc";
import { cache } from "react";
import type { ReactNode } from "react";
import remarkGfm from "remark-gfm";
import {
  LegalDocumentBody,
  LegalDocumentHeader,
  LegalDocumentTitle,
} from "@/components/sections/legal/document";
import { buildLegalDocumentMdxComponents } from "@/components/sections/legal/mdx";
import { readCachedLegalMdxSource } from "@/lib/legal-mdx-source";

export type TermsFrontmatter = {
  title: string;
  description: string;
  date: string;
};

const renderTermsOfServiceContentCached = cache(async function renderTermsOfServiceContentCached() {
  const sourcePath = join(process.cwd(), "src/app/t/terms-of-service/content.mdx");
  const source = await readCachedLegalMdxSource(sourcePath);

  return evaluate<TermsFrontmatter>({
    source,
    components: buildLegalDocumentMdxComponents(),
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });
});

export async function renderTermsOfServiceContent() {
  return renderTermsOfServiceContentCached();
}

export function TermsOfServiceHero({ frontmatter }: { frontmatter: TermsFrontmatter }) {
  return (
    <LegalDocumentHeader divider>
      <LegalDocumentTitle>{frontmatter.title}</LegalDocumentTitle>
    </LegalDocumentHeader>
  );
}

export function TermsOfServiceBody({ content }: { content: ReactNode }) {
  return <LegalDocumentBody className="[&_h1:first-child]:mt-0">{content}</LegalDocumentBody>;
}
