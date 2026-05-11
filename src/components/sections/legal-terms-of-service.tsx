import { join } from "node:path";
import Link from "next/link";
import { evaluate } from "next-mdx-remote-client/rsc";
import { cache, isValidElement } from "react";
import type { ReactNode } from "react";
import remarkGfm from "remark-gfm";
import { publicationBodyClassName } from "@/components/sections/publication-post-page";
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
    <header className="mb-12 border-b border-slate-200 pb-8">
      <p className="text-sm leading-6 text-slate-500">{frontmatter.date}</p>
      <h1 className="mt-2 text-[34px] font-normal leading-[1.2] text-slate-950 lg:text-[40px]">{frontmatter.title}</h1>
      <p className="mt-4 max-w-[760px] text-base leading-7 text-slate-500">{frontmatter.description}</p>
    </header>
  );
}

export function TermsOfServiceBody({ content }: { content: ReactNode }) {
  return <div className={`${publicationBodyClassName} [&_h1:first-child]:mt-0`}>{content}</div>;
}
