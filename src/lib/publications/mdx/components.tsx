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

type MdxLinkProps = {
  href: string;
  children?: ReactNode;
  external?: boolean;
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

type YoutubeProps = {
  src: string;
  title?: string;
  center?: boolean;
};

type BlueStateProps = {
  children?: ReactNode;
};

type UserProps = {
  children?: ReactNode;
};

type ArticleYoutubeGatingFormProps = {
  src: string;
  title?: string;
};

type EmailLinkProps = {
  email: string;
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

function MdxLink({ href, children, external = false }: MdxLinkProps) {
  if (external || isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return <Link href={href}>{children}</Link>;
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

function Youtube({ src, title = "YouTube video", center = false }: YoutubeProps) {
  return (
    <div className={center ? "my-8 flex justify-center" : "my-8"}>
      <div className="w-full overflow-hidden rounded-[8px] border border-[#e5e7eb] bg-slate-950 shadow-sm">
        <div className="relative aspect-video w-full">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

function BlueState({ children }: BlueStateProps) {
  return (
    <span className="mr-2 inline-flex rounded-full bg-[#e8f1ff] px-3 py-1 text-xs font-semibold tracking-[0.02em] text-[#2458b9]">
      {children}
    </span>
  );
}

function User({ children }: UserProps) {
  return <span className="font-semibold text-slate-950">{children}</span>;
}

function GatingCut() {
  return null;
}

function ArticleGatingForm({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

function ArticleYoutubeGatingForm({ src, title = "YouTube video" }: ArticleYoutubeGatingFormProps) {
  return <Youtube src={src} title={title} />;
}

function EmailLink({ email, children }: EmailLinkProps) {
  return <a href={`mailto:${email}`}>{children ?? email}</a>;
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
    Link: MdxLink,
    ArticleFileImage,
    InfoNote,
    Youtube,
    BlueState,
    User,
    GatingCut,
    ArticleGatingForm,
    ArticleYoutubeGatingForm,
    EmailLink,
  };
}
