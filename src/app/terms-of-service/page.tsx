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

type TermsFrontmatter = {
  title: string;
  description: string;
  date: string;
};

const renderTermsOfServiceContent = cache(async function renderTermsOfServiceContent() {
  const sourcePath = join(process.cwd(), "src/app/terms-of-service/content.mdx");
  return renderLegalMdx<TermsFrontmatter>({ sourcePath });
});

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await renderTermsOfServiceContent();

  return {
    title: `${frontmatter.title} | QueryPie AI`,
    description: frontmatter.description,
    alternates: {
      canonical: "/terms-of-service",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function TermsOfServicePage() {
  const evaluation = await renderTermsOfServiceContent();
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
