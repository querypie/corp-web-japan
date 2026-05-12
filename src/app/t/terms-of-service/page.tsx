import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
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
      <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[120px] pt-[112px] lg:px-[30px] lg:pb-[160px] lg:pt-[144px]">
        <div className="mx-auto max-w-[920px]">
          <TermsOfServiceHero frontmatter={frontmatter} />
          <TermsOfServiceBody content={evaluation.content} />
        </div>
      </section>
      <TrialCtaSection />
      <SiteFooter />
    </main>
  );
}
