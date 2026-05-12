import Link from "next/link";
import { isValidElement } from "react";
import type { ReactNode } from "react";
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

export function LegalBodyH1({ children }: StaticHeadingProps) {
  return <h2 id={legalHeadingId(children)}>{children}</h2>;
}

export function LegalBodyH2({ children }: StaticHeadingProps) {
  return <h3 id={legalHeadingId(children)}>{children}</h3>;
}

export function LegalBodyH3({ children }: StaticHeadingProps) {
  return (
    <h4
      id={legalHeadingId(children)}
      className="mt-6 text-[15px] font-medium leading-[1.5] text-slate-950"
    >
      {children}
    </h4>
  );
}

export function PrivacyMdxLink({ href, children }: LinkProps) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return <Link href={href}>{children}</Link>;
}

export function buildPrivacyPolicyDocumentComponents() {
  return {
    ...buildPublicationMdxComponents(),
    h1: LegalBodyH1,
    h2: LegalBodyH2,
    h3: LegalBodyH3,
    Link: PrivacyMdxLink,
  };
}
