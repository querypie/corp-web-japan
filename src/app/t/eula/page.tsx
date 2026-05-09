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
import {
  CtaActions,
  CtaContent,
  CtaCopy,
  CtaDescription,
  CtaTitle,
  SimpleCtaSection,
} from "@/components/sections/simple-cta-section";
import { BrandGradientCtaButton } from "@/components/ui/brand-gradient-cta-button";
import { slugifyHeadingText } from "@/lib/publications/mdx/headings";

export const metadata: Metadata = {
  title: "QueryPie EULA",
  description: "Preview of the current QueryPie End User License Agreement for the Japan site.",
  alternates: {
    canonical: "/t/eula",
  },
  robots: {
    index: false,
    follow: false,
  },
};

type SharedChildrenProps = {
  children?: ReactNode;
  [key: string]: unknown;
};

type LinkProps = {
  href: string;
  children?: ReactNode;
  [key: string]: unknown;
};

type BoxProps = SharedChildrenProps & {
  direction?: "row" | "column";
  center?: boolean;
};

const legalBodyClassName = [
  "text-[15px] leading-[1.75] text-[#24292f]",
  "[&_a]:font-inherit [&_a]:text-slate-950 [&_a]:underline [&_a]:decoration-[1px] [&_a]:underline-offset-[3px] hover:[&_a]:text-slate-950",
  "[&_h2]:mt-20 [&_h2]:text-[32px] [&_h2]:font-normal [&_h2]:leading-[1.375] [&_h2]:tracking-[-0.01em] [&_h2]:text-slate-950",
  "[&_h3]:mt-10 [&_h3]:text-[22px] [&_h3]:font-normal [&_h3]:leading-[1.455] [&_h3]:tracking-[-0.01em] [&_h3]:text-slate-950",
  "[&_p]:mt-[1.3125rem] [&_p]:text-[15px] [&_p]:leading-[1.75] [&_p]:text-[#24292f]",
  "[&_strong]:font-medium [&_strong]:text-slate-950 [&_a_strong]:font-inherit [&_a_strong]:text-inherit",
].join(" ");

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

function Box({ children, direction = "column", center = false }: BoxProps) {
  return <div className={`${direction === "column" ? "flex flex-col" : "flex flex-row"}${center ? " items-center" : ""}`}>{children}</div>;
}

function CenterSection({ children }: SharedChildrenProps) {
  return <div className="mx-auto max-w-[920px] [&>*+*]:mt-8">{children}</div>;
}

function StaticH1({ children }: SharedChildrenProps) {
  return (
    <h1
      id={legalHeadingId(children)}
      className="text-[60px] font-normal leading-[1.2] tracking-[-0.02em] text-slate-950"
    >
      {children}
    </h1>
  );
}

function LegalSectionHeading({ children }: SharedChildrenProps) {
  return <h2 id={legalHeadingId(children)}>{children}</h2>;
}

function LegalSubsectionHeading({ children }: SharedChildrenProps) {
  return <h3 id={legalHeadingId(children)}>{children}</h3>;
}

function EulaMdxLink({ href, children }: LinkProps) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return <Link href={href}>{children}</Link>;
}

async function renderEulaPreviewMdx() {
  const sourcePath = join(process.cwd(), "src/app/t/eula/eula-content.mdx");
  const source = await readFile(sourcePath, "utf8");

  return evaluate({
    source,
    components: {
      Box,
      CenterSection,
      Link: EulaMdxLink,
      StaticH1,
      h1: LegalSectionHeading,
      h2: LegalSubsectionHeading,
    },
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });
}

export default async function PreviewEulaPage() {
  const evaluation = await renderEulaPreviewMdx();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <section className="bg-white px-[30px] pb-[200px] pt-20">
        <div className="mx-auto max-w-[920px]">
          <div className={legalBodyClassName}>{evaluation.content}</div>
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
