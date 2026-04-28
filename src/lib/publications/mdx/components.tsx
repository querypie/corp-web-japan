import Link from "next/link";
import { isValidElement } from "react";
import type { ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { slugifyHeadingText } from "@/lib/publications/mdx/headings";

type TableProps = {
  center?: boolean;
  width?: string;
  children?: ReactNode;
};

type TableCellProps = {
  children?: ReactNode;
  cellBackgroundColor?: string;
};

type BoxProps = {
  center?: boolean;
  marginTopSize?: string;
  children?: ReactNode;
};

type ButtonLinkProps = {
  href: string;
  children?: ReactNode;
};

type ArticleFileImageProps = {
  filepath: string;
  alt?: string;
  caption?: string;
};

type InfoNoteProps = {
  hideIcon?: boolean;
  children?: ReactNode;
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

function slugifyHeading(children: ReactNode): string {
  return slugifyHeadingText(childrenToText(children));
}

function getTableCellClass(cellBackgroundColor?: string): string | undefined {
  if (cellBackgroundColor === "gray") {
    return "bg-[#f9f9fb]";
  }

  return undefined;
}

function normalizePublicFilepath(filepath: string) {
  return filepath.replace(/^\/?public\//, "/");
}

function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}

const Table = Object.assign(
  ({ center, width, children }: TableProps) => (
    <div
      className={center ? "flex justify-center overflow-x-auto" : "overflow-x-auto"}
      style={width ? { width } : undefined}
    >
      <table>{children}</table>
    </div>
  ),
  {
    Thead: ({ children }: { children?: ReactNode }) => <thead>{children}</thead>,
    Tbody: ({ children }: { children?: ReactNode }) => <tbody>{children}</tbody>,
    Tr: ({ children }: { children?: ReactNode }) => <tr>{children}</tr>,
    Th: ({ children, cellBackgroundColor }: TableCellProps) => (
      <th className={getTableCellClass(cellBackgroundColor)}>{children}</th>
    ),
    Td: ({ children, cellBackgroundColor }: TableCellProps) => (
      <td className={getTableCellClass(cellBackgroundColor)}>{children}</td>
    ),
  },
);

function Box({ center, children }: BoxProps) {
  return <div className={center ? "flex justify-center" : undefined}>{children}</div>;
}

function ButtonLink({ href, children }: ButtonLinkProps) {
  if (isExternalHref(href)) {
    return (
      <a href={href} className="article-content-btn" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className="article-content-btn">
      {children}
    </Link>
  );
}

function ArticleFileImage({ filepath, alt = "", caption }: ArticleFileImageProps) {
  const src = normalizePublicFilepath(filepath);

  return (
    <figure className="wp-figure">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="wp-figure_img" src={src} alt={alt} />
      {caption ? <figcaption className="wp-figure_figcaption">{caption}</figcaption> : null}
    </figure>
  );
}

function InfoNote({ hideIcon = false, children }: InfoNoteProps) {
  return (
    <div className="my-4 rounded-[8px] border border-[#e5e7eb] bg-[#f9f9fb] px-5 py-4 text-sm leading-6 text-slate-600">
      <div className="flex gap-3">
        {hideIcon ? null : <span aria-hidden="true">ℹ️</span>}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

function ArticleGatingForm({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export function buildPublicationMdxComponents(): MDXComponents {
  return {
    h1: ({ children }: { children?: ReactNode }) => <h1 id={slugifyHeading(children)}>{children}</h1>,
    h2: ({ children }: { children?: ReactNode }) => <h2 id={slugifyHeading(children)}>{children}</h2>,
    h3: ({ children }: { children?: ReactNode }) => <h3 id={slugifyHeading(children)}>{children}</h3>,
    h4: ({ children }: { children?: ReactNode }) => <h4 id={slugifyHeading(children)}>{children}</h4>,
    Table,
    Box,
    ButtonLink,
    ArticleFileImage,
    InfoNote,
    ArticleGatingForm,
  };
}
