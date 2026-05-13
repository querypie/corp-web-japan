import { join } from "node:path";
import Link from "next/link";
import { evaluate } from "next-mdx-remote-client/rsc";
import { cache, isValidElement } from "react";
import type { ReactNode } from "react";
import remarkGfm from "remark-gfm";
import {
  LegalDocumentBody,
  LegalDocumentHeader,
  LegalDocumentTitle,
} from "@/components/sections/legal/document";
import { readCachedLegalMdxSource } from "@/lib/legal-mdx-source";
import { buildPublicationMdxComponents } from "@/lib/publications/mdx/components";
import { slugifyHeadingText } from "@/lib/publications/mdx/headings";

export type TermsFrontmatter = {
  title: string;
  description: string;
  date: string;
};

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

const renderTermsOfServiceContentCached = cache(async function renderTermsOfServiceContentCached() {
  const sourcePath = join(process.cwd(), "src/app/t/terms-of-service/content.mdx");
  const source = await readCachedLegalMdxSource(sourcePath);

  return evaluate<TermsFrontmatter>({
    source,
    components: {
      ...buildPublicationMdxComponents(),
      h1: LegalBodyH1,
      Link: TermsMdxLink,
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });
});

export async function renderTermsOfServiceContent() {
  return renderTermsOfServiceContentCached();
}

export function TermsOfServiceHero({ frontmatter }: { frontmatter: TermsFrontmatter }) {
  return (
    <LegalDocumentHeader divider>
      <LegalDocumentTitle>{frontmatter.title}</LegalDocumentTitle>
    </LegalDocumentHeader>
  );
}

export function TermsOfServiceBody({ content }: { content: ReactNode }) {
  return <LegalDocumentBody className="[&_h1:first-child]:mt-0">{content}</LegalDocumentBody>;
}
