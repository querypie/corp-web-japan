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
import { BrandGradientCtaButton } from "@/components/ui/brand-gradient-cta-button";
import { buildPublicationMdxComponents } from "@/lib/publications/mdx/components";
import { slugifyHeadingText } from "@/lib/publications/mdx/headings";

type TermsFrontmatter = {
  title: string;
  description: string;
  date: string;
};

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

type StaticHeadingProps = {
  children?: ReactNode;
  [key: string]: unknown;
};

type TermsLinkProps = {
  href: string;
  children?: ReactNode;
  [key: string]: unknown;
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

function LegalBodyH1({ children }: StaticHeadingProps) {
  return <h2 id={legalHeadingId(children)}>{children}</h2>;
}

function TermsMdxLink({ href, children }: TermsLinkProps) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return <Link href={href}>{children}</Link>;
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
          <BrandGradientCtaButton href="https://app.querypie.com/">無料で試してみる</BrandGradientCtaButton>
        </CtaActions>
      </CtaContent>
    </SimpleCtaSection>
  );
}

async function renderTermsOfServiceContent() {
  const sourcePath = join(process.cwd(), "src/app/t/terms-of-service/content.mdx");
  const source = await readFile(sourcePath, "utf8");

  return evaluate<TermsFrontmatter>({
    source,
    components: {
      ...buildPublicationMdxComponents(),
      h1: LegalBodyH1,
      CenterSection,
      Link: TermsMdxLink,
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });
}

export default async function PreviewTermsOfServicePage() {
  const evaluation = await renderTermsOfServiceContent();
  const { frontmatter } = evaluation;

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[120px] pt-[112px] lg:px-[30px] lg:pb-[160px] lg:pt-[144px]">
        <div className="mx-auto max-w-[920px]">
          <header className="mb-12 border-b border-slate-200 pb-8">
            <p className="text-sm leading-6 text-slate-500">{frontmatter.date}</p>
            <h1 className="mt-2 text-[34px] font-normal leading-[1.2] text-slate-950 lg:text-[40px]">{frontmatter.title}</h1>
            <p className="mt-4 max-w-[760px] text-base leading-7 text-slate-500">{frontmatter.description}</p>
          </header>
          <div className={`${publicationBodyClassName} [&_h1:first-child]:mt-0`}>{evaluation.content}</div>
        </div>
      </section>
      <TrialCtaSection />
      <SiteFooter />
    </main>
  );
}
