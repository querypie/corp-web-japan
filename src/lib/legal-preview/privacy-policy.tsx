import { readFile } from "node:fs/promises";
import { join } from "node:path";
import Link from "next/link";
import { evaluate } from "next-mdx-remote-client/rsc";
import { isValidElement } from "react";
import type { ReactNode } from "react";
import remarkGfm from "remark-gfm";
import { LegalPrivacyPolicyVersionSelector } from "@/components/sections/legal-privacy-policy-version-selector";
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
    <h2 id={legalHeadingId(children)} className="text-[28px] font-normal leading-[1.3] text-slate-950 lg:text-[32px]">
      {children}
    </h2>
  );
}

function LegalBodyH1({ children }: StaticHeadingProps) {
  return <h3 id={legalHeadingId(children)}>{children}</h3>;
}

function LegalBodyH2({ children }: StaticHeadingProps) {
  return <h4 id={legalHeadingId(children)}>{children}</h4>;
}

function LegalBodyH3({ children }: StaticHeadingProps) {
  return <h5 id={legalHeadingId(children)} className="mt-6 text-[15px] font-medium leading-[1.5] text-slate-950">{children}</h5>;
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
      <Link href="/privacy-policy-ko" className={language === "ko" ? "font-medium text-slate-950" : undefined}>
        Korean
      </Link>
      <span className="px-2">/</span>
      <Link
        href="/privacy-policy-en/26-01-15"
        className={language === "en" ? "font-medium text-slate-950" : undefined}
      >
        English
      </Link>
    </div>
  );
}

export async function renderPrivacyPolicyPreviewMdx() {
  const sourcePath = join(process.cwd(), "src/content/legal-preview/privacy-policy.mdx");
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
