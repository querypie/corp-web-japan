import Link from "next/link";
import { isValidElement } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { slugifyHeadingText } from "@/lib/publications/mdx/headings";

type MarginTopSize = "xxl" | "xl" | "lg" | "md" | "sm" | "xs";

type TableProps = ComponentPropsWithoutRef<"table"> & {
  center?: boolean;
  width?: string;
  marginTopSize?: MarginTopSize;
  useMaxContent?: boolean;
  children?: ReactNode;
};

type TableCellProps = ComponentPropsWithoutRef<"td"> & {
  children?: ReactNode;
  cellBackgroundColor?: string;
  center?: boolean;
  width?: string | number;
};

type TableHeaderCellProps = ComponentPropsWithoutRef<"th"> & {
  children?: ReactNode;
  cellBackgroundColor?: string;
  center?: boolean;
  width?: string | number;
};

type BoxProps = {
  center?: boolean;
  marginTopSize?: string;
  children?: ReactNode;
};

type ButtonLinkProps = {
  href: string;
  children?: ReactNode;
  external?: boolean;
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

type StateColor = "gray" | "blue" | "purple" | "green" | "yellow" | "red";

type StateProps = {
  color?: StateColor;
  children?: ReactNode;
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

function getTableCellClass(cellBackgroundColor?: string, center?: boolean): string | undefined {
  const classes = [
    "min-w-[100px] border border-slate-200 px-[10px] py-[9px] align-top",
    center ? "text-center" : undefined,
    cellBackgroundColor === "gray" ? "bg-[#f9f9fb]" : undefined,
    cellBackgroundColor === "blue" ? "bg-[#e8f1ff]" : undefined,
    cellBackgroundColor === "purple" ? "bg-purple-100" : undefined,
    cellBackgroundColor === "green" ? "bg-emerald-100" : undefined,
    cellBackgroundColor === "yellow" ? "bg-amber-100" : undefined,
    cellBackgroundColor === "red" ? "bg-rose-100" : undefined,
  ].filter(Boolean);

  return classes.length > 0 ? classes.join(" ") : undefined;
}

function getTableMarginTopClass(marginTopSize: MarginTopSize = "sm"): string {
  const classMap: Record<MarginTopSize, string> = {
    xxl: "mt-12",
    xl: "mt-10",
    lg: "mt-8",
    md: "mt-6",
    sm: "mt-4",
    xs: "mt-2",
  };

  return classMap[marginTopSize];
}

function normalizePublicFilepath(filepath: string) {
  return filepath.replace(/^\/?public\//, "/");
}

function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}

const Table = Object.assign(
  ({ center, width, marginTopSize = "sm", useMaxContent, children, className, style, ...restProps }: TableProps) => (
    <div
      className={[
        getTableMarginTopClass(marginTopSize),
        center ? "flex justify-center overflow-x-auto" : "overflow-x-auto",
      ].join(" ")}
      style={width ? { width } : undefined}
    >
      <table
        className={[
          "border-collapse border border-slate-200",
          useMaxContent ? "w-max" : "min-w-full",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={style}
        {...restProps}
      >
        {children}
      </table>
    </div>
  ),
  {
    Thead: ({ children }: { children?: ReactNode }) => <thead>{children}</thead>,
    Tbody: ({ children }: { children?: ReactNode }) => <tbody>{children}</tbody>,
    Tr: ({ children }: { children?: ReactNode }) => <tr className="border border-slate-200">{children}</tr>,
    Th: ({ children, cellBackgroundColor = "gray", center, width, className, style, ...restProps }: TableHeaderCellProps) => (
      <th
        className={[getTableCellClass(cellBackgroundColor, center), className].filter(Boolean).join(" ")}
        style={width ? { ...style, width } : style}
        {...restProps}
      >
        {children}
      </th>
    ),
    Td: ({ children, cellBackgroundColor, center, width, className, style, ...restProps }: TableCellProps) => (
      <td
        className={[getTableCellClass(cellBackgroundColor, center), className].filter(Boolean).join(" ")}
        style={width ? { ...style, width } : style}
        {...restProps}
      >
        {children}
      </td>
    ),
  },
);

function Box({ center, children }: BoxProps) {
  return <div className={center ? "flex justify-center" : undefined}>{children}</div>;
}

function ButtonLink({ href, children, external = false }: ButtonLinkProps) {
  if (external || isExternalHref(href)) {
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

function getStateClass(color: StateColor = "blue") {
  const palette: Record<StateColor, string> = {
    gray: "bg-slate-100 text-slate-700",
    blue: "bg-[#e8f1ff] text-[#2458b9]",
    purple: "bg-purple-100 text-purple-700",
    green: "bg-emerald-100 text-emerald-700",
    yellow: "bg-amber-100 text-amber-700",
    red: "bg-rose-100 text-rose-700",
  };

  return palette[color];
}

function State({ color = "blue", children }: StateProps) {
  return (
    <span
      className={`mr-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-[0.02em] ${getStateClass(color)}`}
    >
      {children}
    </span>
  );
}

function BlueState({ children }: BlueStateProps) {
  return <State color="blue">{children}</State>;
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
    State,
    BlueState,
    User,
    GatingCut,
    ArticleGatingForm,
    ArticleYoutubeGatingForm,
    EmailLink,
  };
}
