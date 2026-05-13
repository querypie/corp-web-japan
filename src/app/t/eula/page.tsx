import { join } from "node:path";
import type { Metadata } from "next";
import { evaluate } from "next-mdx-remote-client/rsc";
import { cache } from "react";
import remarkGfm from "remark-gfm";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  LegalDocumentBody,
  LegalDocumentHeader,
  LegalDocumentPageSection,
  LegalDocumentTitle,
} from "@/components/sections/legal/document";
import { buildLegalDocumentMdxComponents } from "@/components/sections/legal/mdx";
import {
  AipFreeTrialCtaSection,
} from "@/components/sections/simple-cta-section";
import { readCachedLegalMdxSource } from "@/lib/legal-mdx-source";

type EulaFrontmatter = {
  title: string;
  description: string;
};

const renderEulaMdx = cache(async function renderEulaMdx() {
  const sourcePath = join(process.cwd(), "src/app/t/eula/content.mdx");
  const source = await readCachedLegalMdxSource(sourcePath);

  return evaluate<EulaFrontmatter>({
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

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await renderEulaMdx();

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: {
      canonical: "/t/eula",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function EulaPage() {
  const evaluation = await renderEulaMdx();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <LegalDocumentPageSection>
        <LegalDocumentHeader>
          <LegalDocumentTitle>End User License Agreement</LegalDocumentTitle>
        </LegalDocumentHeader>
        <LegalDocumentBody>{evaluation.content}</LegalDocumentBody>
      </LegalDocumentPageSection>
      <AipFreeTrialCtaSection />
      <SiteFooter />
    </main>
  );
}
