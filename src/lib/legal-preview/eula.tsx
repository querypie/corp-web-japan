import { readFile } from "node:fs/promises";
import { join } from "node:path";
import Link from "next/link";
import { evaluate } from "next-mdx-remote-client/rsc";
import { isValidElement } from "react";
import type { ReactNode } from "react";
import remarkGfm from "remark-gfm";
import { buildPublicationMdxComponents } from "@/lib/publications/mdx/components";
import { slugifyHeadingText } from "@/lib/publications/mdx/headings";

type StaticHeadingProps = {
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

function CenterSection({ children }: { children?: ReactNode }) {
  return <div className="mx-auto max-w-[920px]">{children}</div>;
}

function StaticH1({ children }: StaticHeadingProps) {
  return (
    <h2 id={legalHeadingId(children)} className="text-[34px] font-normal leading-[1.2] text-slate-950 lg:text-[40px]">
      {children}
    </h2>
  );
}

function LegalBodyH1({ children }: StaticHeadingProps) {
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

export async function renderEulaPreviewMdx() {
  const sourcePath = join(process.cwd(), "src/content/legal-preview/eula.mdx");
  const source = await readFile(sourcePath, "utf8");

  return evaluate({
    source,
    components: {
      ...buildPublicationMdxComponents(),
      h1: LegalBodyH1,
      CenterSection,
      StaticH1,
      Link: EulaMdxLink,
    },
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });
}
