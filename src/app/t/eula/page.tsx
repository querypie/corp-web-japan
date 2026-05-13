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
  LegalDocumentBody,
  LegalDocumentHeader,
  LegalDocumentPageSection,
  LegalDocumentTitle,
} from "@/components/sections/legal/document";
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
      <LegalDocumentPageSection>
        <LegalDocumentHeader>
          <LegalDocumentTitle>End User License Agreement</LegalDocumentTitle>
        </LegalDocumentHeader>
        <LegalDocumentBody>{evaluation.content}</LegalDocumentBody>
      </LegalDocumentPageSection>
      <AipFreeTrialCtaSection />
      <SiteFooter />
    </main>
  );
}
