import * as fs from "node:fs";
import * as path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { evaluate } from "next-mdx-remote-client/rsc";
import { isValidElement } from "react";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import remarkGfm from "remark-gfm";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { publicationBodyClassName } from "@/components/sections/publication-post-page";
import { buildPublicationMdxComponents } from "@/lib/publications/mdx/components";
import { slugifyHeadingText } from "@/lib/publications/mdx/headings";

export const metadata: Metadata = {
  title: "QueryPie Terms of Service | QueryPie AI",
  description: "QueryPie Terms of Service",
  alternates: {
    canonical: "/t/terms-of-service",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const sourcePath = path.join(process.cwd(), "src/app/t/terms-of-service/content.mdx");


function getTermsOfServiceSource() {
  return fs.readFileSync(sourcePath, "utf8");
}

type StaticHeadingProps = {
  children?: ReactNode;
  [key: string]: unknown;
};

type StaticHeaderProps = {
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

function StaticH1({ children }: StaticHeadingProps) {
  return (
    <h1 id={legalHeadingId(children)} className="text-[34px] font-normal leading-[1.2] text-slate-950 lg:text-[40px]">
      {children}
    </h1>
  );
}

function LegalBodyH1({ children }: StaticHeadingProps) {
  return <h2 id={legalHeadingId(children)}>{children}</h2>;
}

function StaticHeader({ children }: StaticHeaderProps) {
  return <p className="text-base leading-7 text-slate-500">{children}</p>;
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
    <section className="bg-[#f5f7fa] px-6 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center text-center">
        <h2 className="text-[32px] font-medium leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[40px]">
          まずは小さく、失敗しないAXを始めよう
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-500">
          簡単サインアップで、14日間の無料トライアルをお試しください
        </p>
        <Link
          href="https://app.querypie.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-[5.625px] bg-[linear-gradient(90deg,#2563eb_0%,#7c3aed_100%)] px-[26.25px] py-[13.125px] text-[15px] font-normal leading-[15px] text-white transition hover:opacity-95"
        >
          無料で試してみる
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

async function renderTermsOfServiceContent() {
  return evaluate({
    source: getTermsOfServiceSource(),
    components: {
      ...buildPublicationMdxComponents(),
      h1: LegalBodyH1,
      CenterSection,
      StaticH1,
      StaticHeader,
      Link: TermsMdxLink,
    },
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });
}

export default async function PreviewTermsOfServicePage() {
  const evaluation = await renderTermsOfServiceContent();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[120px] pt-[112px] lg:px-[30px] lg:pb-[160px] lg:pt-[144px]">
        <div className={`${publicationBodyClassName} [&_h1:first-child]:mt-0`}>{evaluation.content}</div>
      </section>
      <TrialCtaSection />
      <SiteFooter />
    </main>
  );
}
