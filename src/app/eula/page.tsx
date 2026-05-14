import { join } from "node:path";
import type { Metadata } from "next";
import { cache } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  LegalDocumentBody,
  LegalDocumentIntro,
  LegalDocumentLayout,
  LegalDocumentSection,
  LegalDocumentTitle,
} from "@/components/sections/legal/document";
import { AipFreeTrialCtaSection } from "@/components/sections/simple-cta-section";
import { renderLegalMdx } from "@/lib/legal-mdx-source";

type EulaFrontmatter = {
  title: string;
  description: string;
  effectiveDate: string;
};

const renderEulaMdx = cache(async function renderEulaMdx() {
  const sourcePath = join(process.cwd(), "src/app/eula/content.mdx");
  return renderLegalMdx<EulaFrontmatter>({ sourcePath });
});

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await renderEulaMdx();

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: {
      canonical: "/eula",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function EulaPage() {
  const evaluation = await renderEulaMdx();
  const { frontmatter } = evaluation;

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <LegalDocumentSection>
        <LegalDocumentIntro>
          <LegalDocumentTitle>{frontmatter.title}</LegalDocumentTitle>
        </LegalDocumentIntro>
        <LegalDocumentLayout>
          <LegalDocumentBody>{evaluation.content}</LegalDocumentBody>
        </LegalDocumentLayout>
      </LegalDocumentSection>
      <AipFreeTrialCtaSection />
      <SiteFooter />
    </main>
  );
}
