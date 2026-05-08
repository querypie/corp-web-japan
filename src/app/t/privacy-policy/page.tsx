import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { evaluate } from "next-mdx-remote-client/rsc";
import { isValidElement } from "react";
import type { ReactNode } from "react";
import remarkGfm from "remark-gfm";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CtaActions, CtaContent, CtaCopy, CtaDescription, CtaTitle, SimpleCtaSection } from "@/components/sections/simple-cta-section";
import { publicationBodyClassName } from "@/components/sections/publication-post-page";
import { LegalPrivacyPolicyVersionSelector } from "@/components/sections/legal-privacy-policy-version-selector";
import { BrandGradientCtaButton } from "@/components/ui/brand-gradient-cta-button";
import { buildPublicationMdxComponents } from "@/lib/publications/mdx/components";
import { slugifyHeadingText } from "@/lib/publications/mdx/headings";

export const metadata: Metadata = {
  title: "QueryPie Privacy Policy (Jan 15, 2026) | QueryPie AI",
  description: "Preview of the current QueryPie Privacy Policy for the Japan site.",
  alternates: {
    canonical: "/t/privacy-policy",
  },
  robots: {
    index: false,
    follow: false,
  },
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
  language: "en" | "ko" | "ja";
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

function CenterSection({ children }: { children?: ReactNode }) {
  return <div className="mx-auto max-w-[920px]">{children}</div>;
}

function StaticH3({ children }: StaticHeadingProps) {
  return (
    <h1 id={legalHeadingId(children)} className="text-[34px] font-normal leading-[1.2] text-slate-950 lg:text-[40px]">
      {children}
    </h1>
  );
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

async function renderPrivacyPolicyPreviewMdx() {
  const sourcePath = join(process.cwd(), "src/app/t/privacy-policy/privacy-policy-content.mdx");
  const source = await readFile(sourcePath, "utf8");

  return evaluate({
    source,
    components: {
      ...buildPublicationMdxComponents(),
      h1: LegalBodyH1,
      h2: LegalBodyH2,
      h3: LegalBodyH3,
      CenterSection,
      StaticH3,
      Link: PrivacyMdxLink,
      PrivacySelectorBox,
      PrivacyPolicyLanguageSelector,
      PrivacyPolicyVersionSelector: LegalPrivacyPolicyVersionSelector,
    },
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });
}

export default async function PreviewPrivacyPolicyPage() {
  const evaluation = await renderPrivacyPolicyPreviewMdx();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[120px] pt-[112px] lg:px-[30px] lg:pb-[160px] lg:pt-[144px]">
        <div className="mx-auto max-w-[920px]">
          <div className={`${publicationBodyClassName} [&_h1:first-child]:mt-0`}>{evaluation.content}</div>
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
