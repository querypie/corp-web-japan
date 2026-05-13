import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LegalDocumentPageSection } from "@/components/sections/legal/document";
import { AipFreeTrialCtaSection } from "@/components/sections/simple-cta-section";
import {
  TermsOfServiceBody,
  TermsOfServiceHero,
  renderTermsOfServiceContent,
} from "@/components/sections/terms-of-service/section";

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

function TrialCtaSection() {
  return <AipFreeTrialCtaSection />;
}

export default async function TermsOfServicePage() {
  const evaluation = await renderTermsOfServiceContent();
  const { frontmatter } = evaluation;

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <LegalDocumentPageSection>
        <TermsOfServiceHero frontmatter={frontmatter} />
        <TermsOfServiceBody content={evaluation.content} />
      </LegalDocumentPageSection>
      <TrialCtaSection />
      <SiteFooter />
    </main>
  );
}
