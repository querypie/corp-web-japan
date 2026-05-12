import { join } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { evaluate } from "next-mdx-remote-client/rsc";
import { cache, isValidElement } from "react";
import type { ReactNode } from "react";
import remarkGfm from "remark-gfm";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  AipFreeTrialCtaSection,
} from "@/components/sections/simple-cta-section";
import { readCachedLegalMdxSource } from "@/lib/legal-mdx-source";
import { slugifyHeadingText } from "@/lib/publications/mdx/headings";

type EulaFrontmatter = {
  title: string;
  description: string;
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

const legalBodyClassName = [
  "mt-[26px] text-[15px] leading-[1.75] text-[#24292f]",
  "[&_a]:font-inherit [&_a]:text-slate-950 [&_a]:underline [&_a]:decoration-[1px] [&_a]:underline-offset-[3px] hover:[&_a]:text-slate-950",
  "[&_h2]:mt-20 [&_h2]:text-[32px] [&_h2]:font-normal [&_h2]:leading-[1.375] [&_h2]:tracking-[-0.01em] [&_h2]:text-slate-950",
  "[&_h3]:mt-10 [&_h3]:text-[22px] [&_h3]:font-normal [&_h3]:leading-[1.455] [&_h3]:tracking-[-0.01em] [&_h3]:text-slate-950",
  "[&_h4]:mt-10 [&_h4]:text-[15px] [&_h4]:font-medium [&_h4]:leading-[1.75] [&_h4]:text-slate-950",
  "[&_p]:mt-[1.3125rem] [&_p]:text-[15px] [&_p]:leading-[1.75] [&_p]:text-[#24292f]",
  "[&_h2+_p]:mt-[1.3125rem] [&_h3+_p]:mt-[1.3125rem] [&_h4+_p]:mt-[1.3125rem]",
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

function LegalPageTitle({ children }: SharedChildrenProps) {
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

function LegalClauseHeading({ children }: SharedChildrenProps) {
  return <h4 id={legalHeadingId(children)}>{children}</h4>;
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

const renderEulaMdx = cache(async function renderEulaMdx() {
  const sourcePath = join(process.cwd(), "src/app/t/eula/content.mdx");
  const source = await readCachedLegalMdxSource(sourcePath);

  return evaluate<EulaFrontmatter>({
    source,
    components: {
      Link: EulaMdxLink,
      h1: LegalSectionHeading,
      h2: LegalSubsectionHeading,
      h3: LegalClauseHeading,
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });
});

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await renderEulaMdx();

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: {
      canonical: "/t/eula",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function EulaPage() {
  const evaluation = await renderEulaMdx();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <section className="bg-white px-[30px] pb-[200px] pt-20">
        <div className="mx-auto max-w-[920px]">
          <LegalPageTitle>End User License Agreement</LegalPageTitle>
          <div className={legalBodyClassName}>{evaluation.content}</div>
        </div>
      </section>
      <AipFreeTrialCtaSection />
      <SiteFooter />
    </main>
  );
}
