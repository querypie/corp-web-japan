import { join } from "node:path";
import type { Metadata } from "next";
import { cache } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  LegalDocumentBody,
  LegalDocumentHero,
  LegalDocumentPageSection,
} from "@/components/sections/legal/document";
import { AipFreeTrialCtaSection } from "@/components/sections/simple-cta-section";
import { renderLegalMdx } from "@/lib/legal-mdx-source";

type TermsFrontmatter = {
  title: string;
  description: string;
  date: string;
};

const renderTermsOfServiceContent = cache(async function renderTermsOfServiceContent() {
  const sourcePath = join(process.cwd(), "src/app/t/terms-of-service/content.mdx");
  return renderLegalMdx<TermsFrontmatter>({ sourcePath });
});

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await renderTermsOfServiceContent();

  return {
    title: `${frontmatter.title} | QueryPie AI`,
    description: frontmatter.description,
    alternates: {
      canonical: "/t/terms-of-service",
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
      <LegalDocumentPageSection>
        <LegalDocumentHero title={frontmatter.title} divider />
        <LegalDocumentBody className="[&_h1:first-child]:mt-0">{evaluation.content}</LegalDocumentBody>
      </LegalDocumentPageSection>
      <AipFreeTrialCtaSection />
      <SiteFooter />
    </main>
  );
}
