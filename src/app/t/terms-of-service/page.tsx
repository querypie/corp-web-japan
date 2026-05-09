import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CtaActions, CtaContent, CtaCopy, CtaDescription, CtaTitle, SimpleCtaSection } from "@/components/sections/simple-cta-section";
import {
  TermsOfServiceBody,
  TermsOfServiceHero,
  renderTermsOfServiceContent,
} from "@/components/sections/legal-terms-of-service";
import { BrandGradientCtaButton } from "@/components/ui/brand-gradient-cta-button";

const trialHref = "https://app.querypie.com/";

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
  return (
    <SimpleCtaSection>
      <CtaContent>
        <CtaCopy>
          <CtaTitle>まずは小さく、失敗しないAXを始めよう</CtaTitle>
          <CtaDescription>簡単サインアップで、14日間の無料トライアルをお試しください</CtaDescription>
        </CtaCopy>
        <CtaActions>
          <BrandGradientCtaButton href={trialHref}>無料で試してみる</BrandGradientCtaButton>
        </CtaActions>
      </CtaContent>
    </SimpleCtaSection>
  );
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
