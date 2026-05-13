import { join } from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  buildPrivacyPolicyDocumentComponents,
} from "@/components/sections/privacy-policy/document-body-components";
import {
  PrivacyPolicyLanguageSelector,
  PrivacySelectorBox,
} from "@/components/sections/privacy-policy/document-header-controls";
import { PrivacyPolicyVersionSelector } from "@/components/sections/privacy-policy/version-selector";
import {
  LegalDocumentBody,
  LegalDocumentHero,
  LegalDocumentPageSection,
} from "@/components/sections/legal/document";
import { AipFreeTrialCtaSection } from "@/components/sections/simple-cta-section";
import { renderLegalMdx } from "@/lib/legal-mdx-source";
import {
  hasPrivacyPolicySlug,
  listPrivacyPolicySlugs,
} from "@/lib/privacy-policy/records";

type PrivacyPolicyVersionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type PrivacyPolicyFrontmatter = {
  title: string;
  description: string;
  date: string;
  version: string;
};

const renderPrivacyPolicyVersion = cache(async function renderPrivacyPolicyVersion(slug: string) {
  const versionExists = await hasPrivacyPolicySlug(slug);
  if (!versionExists) {
    notFound();
  }

  const sourcePath = join(process.cwd(), "src/content/privacy-policy", `${slug}.mdx`);
  return renderLegalMdx<PrivacyPolicyFrontmatter>({
    sourcePath,
    components: buildPrivacyPolicyDocumentComponents(),
  });
});

export async function generateStaticParams() {
  const slugs = await listPrivacyPolicySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generatePrivacyPolicyMetadata({
  canonicalPath,
  slug,
}: {
  canonicalPath: string;
  slug: string;
}): Promise<Metadata> {
  const { frontmatter } = await renderPrivacyPolicyVersion(slug);

  return {
    title: `${frontmatter.title} | QueryPie AI`,
    description: frontmatter.description,
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export async function renderPrivacyPolicyVersionPage(slug: string) {
  const [evaluation, slugs] = await Promise.all([
    renderPrivacyPolicyVersion(slug),
    listPrivacyPolicySlugs(),
  ]);
  const { frontmatter } = evaluation;

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <LegalDocumentPageSection>
        <LegalDocumentHero
          meta={`Effective date: ${frontmatter.date}`}
          title={frontmatter.title}
          titleVariant="compact"
          description={frontmatter.description}
        >
          <PrivacySelectorBox>
            <PrivacyPolicyLanguageSelector language="en" />
            <PrivacyPolicyVersionSelector currentSlug={frontmatter.version} slugs={slugs} />
          </PrivacySelectorBox>
        </LegalDocumentHero>
        <LegalDocumentBody className="[&_h2:first-child]:mt-0">{evaluation.content}</LegalDocumentBody>
      </LegalDocumentPageSection>
      <AipFreeTrialCtaSection />
      <SiteFooter />
    </main>
  );
}

export async function generateMetadata({ params }: PrivacyPolicyVersionPageProps): Promise<Metadata> {
  const { slug } = await params;

  return generatePrivacyPolicyMetadata({
    canonicalPath: `/t/privacy-policy/${slug}`,
    slug,
  });
}

export default async function PrivacyPolicyVersionPage({ params }: PrivacyPolicyVersionPageProps) {
  const { slug } = await params;

  return renderPrivacyPolicyVersionPage(slug);
}
