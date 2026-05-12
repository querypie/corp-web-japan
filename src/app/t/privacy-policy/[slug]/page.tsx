import { join } from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { evaluate } from "next-mdx-remote-client/rsc";
import { cache } from "react";
import remarkGfm from "remark-gfm";
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
import { publicationBodyClassName } from "@/components/sections/publication-post-page";
import { AipFreeTrialCtaSection } from "@/components/sections/simple-cta-section";
import { readCachedLegalMdxSource } from "@/lib/legal-mdx-source";
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
  const source = await readCachedLegalMdxSource(sourcePath);

  return evaluate<PrivacyPolicyFrontmatter>({
    source,
    components: buildPrivacyPolicyDocumentComponents(),
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
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
      <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[120px] pt-[112px] lg:px-[30px] lg:pb-[160px] lg:pt-[144px]">
        <div className="mx-auto max-w-[920px]">
          <div className="mb-8 flex flex-col gap-4 lg:mb-10">
            <div className="flex flex-col gap-3">
              <p className="text-sm text-slate-500">Effective date: {frontmatter.date}</p>
              <h1 className="text-[34px] font-normal leading-[1.2] text-slate-950 lg:text-[40px]">
                {frontmatter.title}
              </h1>
              <p className="text-[15px] leading-7 text-slate-600">{frontmatter.description}</p>
            </div>
            <PrivacySelectorBox>
              <PrivacyPolicyLanguageSelector language="en" />
              <PrivacyPolicyVersionSelector currentSlug={frontmatter.version} slugs={slugs} />
            </PrivacySelectorBox>
          </div>
          <div className={`${publicationBodyClassName} [&_h2:first-child]:mt-0`}>
            {evaluation.content}
          </div>
        </div>
      </section>
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
