import { join } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { evaluate } from "next-mdx-remote-client/rsc";
import { cache, isValidElement } from "react";
import type { ReactNode } from "react";
import remarkGfm from "remark-gfm";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  CtaActions,
  CtaContent,
  CtaCopy,
  CtaDescription,
  CtaTitle,
  SimpleCtaSection,
} from "@/components/sections/simple-cta-section";
import { BrandGradientCtaButton } from "@/components/ui/brand-gradient-cta-button";
import { readCachedLegalMdxSource } from "@/lib/legal-mdx-source";
import { hasPrivacyPolicySlug, listPrivacyPolicySlugs } from "@/lib/privacy-policy/records";
import { buildPublicationMdxComponents } from "@/lib/publications/mdx/components";
import { slugifyHeadingText } from "@/lib/publications/mdx/headings";
import { publicationBodyClassName } from "./publication-post-page";
import { PrivacyPolicyVersionSelector } from "./privacy-policy-version-selector";

type PrivacyPolicyFrontmatter = {
  title: string;
  description: string;
  date: string;
  version: string;
};

type StaticHeadingProps = {
  children?: ReactNode;
  [key: string]: unknown;
};

type LinkProps = {
  href: string;
  children?: ReactNode;
  [key: string]: unknown;
};

type PrivacyLanguageProps = {
  language: "en" | "ko";
};

function childrenToText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(childrenToText).join("");
  if (isValidElement(children)) {
    const props = children.props as { children?: ReactNode };
    return childrenToText(props.children);
  }
  return "";
}

function legalHeadingId(children: ReactNode) {
  return slugifyHeadingText(childrenToText(children));
}

function LegalBodyH1({ children }: StaticHeadingProps) {
  return <h2 id={legalHeadingId(children)}>{children}</h2>;
}

function LegalBodyH2({ children }: StaticHeadingProps) {
  return <h3 id={legalHeadingId(children)}>{children}</h3>;
}

function LegalBodyH3({ children }: StaticHeadingProps) {
  return <h4 id={legalHeadingId(children)} className="mt-6 text-[15px] font-medium leading-[1.5] text-slate-950">{children}</h4>;
}

function PrivacyMdxLink({ href, children }: LinkProps) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return <Link href={href}>{children}</Link>;
}

function PrivacySelectorBox({ children }: { children?: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3 rounded-[10px] bg-[#f9f9fb] px-4 py-3">{children}</div>;
}

function PrivacyPolicyLanguageSelector({ language }: PrivacyLanguageProps) {
  return (
    <div className="text-sm text-slate-500">
      <a
        href="https://www.querypie.com/ja/privacy-policy-ko"
        className={language === "ko" ? "font-medium text-slate-950" : undefined}
      >
        Korean
      </a>
      <span className="px-2">/</span>
      <a
        href="https://www.querypie.com/ja/privacy-policy-en"
        className={language === "en" ? "font-medium text-slate-950" : undefined}
      >
        English
      </a>
    </div>
  );
}

const renderPrivacyPolicyVersion = cache(async function renderPrivacyPolicyVersion(slug: string) {
  const versionExists = await hasPrivacyPolicySlug(slug);
  if (!versionExists) {
    notFound();
  }

  const sourcePath = join(process.cwd(), "src/content/privacy-policy", `${slug}.mdx`);
  const source = await readCachedLegalMdxSource(sourcePath);

  return evaluate<PrivacyPolicyFrontmatter>({
    source,
    components: {
      ...buildPublicationMdxComponents(),
      h1: LegalBodyH1,
      h2: LegalBodyH2,
      h3: LegalBodyH3,
      Link: PrivacyMdxLink,
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });
});

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

export async function PrivacyPolicyDocumentPage({ slug }: { slug: string }) {
  const [evaluation, slugs] = await Promise.all([renderPrivacyPolicyVersion(slug), listPrivacyPolicySlugs()]);
  const { frontmatter } = evaluation;

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[120px] pt-[112px] lg:px-[30px] lg:pb-[160px] lg:pt-[144px]">
        <div className="mx-auto max-w-[920px]">
          <div className="mb-8 flex flex-col gap-4 lg:mb-10">
            <div className="flex flex-col gap-3">
              <p className="text-sm text-slate-500">Effective date: {frontmatter.date}</p>
              <h1 className="text-[34px] font-normal leading-[1.2] text-slate-950 lg:text-[40px]">{frontmatter.title}</h1>
              <p className="text-[15px] leading-7 text-slate-600">{frontmatter.description}</p>
            </div>
            <PrivacySelectorBox>
              <PrivacyPolicyLanguageSelector language="en" />
              <PrivacyPolicyVersionSelector currentSlug={frontmatter.version} slugs={slugs} />
            </PrivacySelectorBox>
          </div>
          <div className={`${publicationBodyClassName} [&_h2:first-child]:mt-0`}>{evaluation.content}</div>
        </div>
      </section>
      <SimpleCtaSection>
        <CtaContent>
          <CtaCopy>
            <CtaTitle>まずは小さく、失敗しないAXを始めよう</CtaTitle>
            <CtaDescription>簡単サインアップで、14日間の無料トライアルをお試しください</CtaDescription>
          </CtaCopy>
          <CtaActions>
            <BrandGradientCtaButton href="https://app.querypie.com/">無料で試してみる</BrandGradientCtaButton>
          </CtaActions>
        </CtaContent>
      </SimpleCtaSection>
      <SiteFooter />
    </main>
  );
}
