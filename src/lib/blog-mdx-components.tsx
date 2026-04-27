import Image from "next/image";
import Link from "next/link";
import { Children, isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { slugifyHeadingText } from "@/lib/blog-mdx-headings";

type HeadingProps = {
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
  if (cellBackgroundColor === "gray") return "bg-[#f9f9fb]";
  return undefined;
}

const Table = Object.assign(
  ({ center, children }: { center?: boolean; children?: ReactNode }) => (
    <div className={center ? "flex justify-center overflow-x-auto" : "overflow-x-auto"}>
      <table>{children}</table>
    </div>
  ),
  {
    Thead: ({ children }: { children?: ReactNode }) => <thead>{children}</thead>,
    Tbody: ({ children }: { children?: ReactNode }) => <tbody>{children}</tbody>,
    Tr: ({ children }: { children?: ReactNode }) => <tr>{children}</tr>,
    Th: ({
      cellBackgroundColor,
      children,
    }: {
      cellBackgroundColor?: string;
      children?: ReactNode;
    }) => <th className={getTableCellClass(cellBackgroundColor)}>{children}</th>,
    Td: ({
      cellBackgroundColor,
      children,
    }: {
      cellBackgroundColor?: string;
      children?: ReactNode;
    }) => <td className={getTableCellClass(cellBackgroundColor)}>{children}</td>,
  },
);

function MdxLink({ href, children }: { href?: string; children?: ReactNode }) {
  if (!href) return <>{children}</>;

  if (href.startsWith("/blog/")) {
    return (
      <Link href={href} className="text-[#2563EB] underline decoration-[1px] underline-offset-[3px] hover:text-[#1D4ED8]">
        {children}
      </Link>
    );
  }

  const external = href.startsWith("http://") || href.startsWith("https://");

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="text-[#2563EB] underline decoration-[1px] underline-offset-[3px] hover:text-[#1D4ED8]"
    >
      {children}
    </a>
  );
}

export function buildBlogMdxComponents(): MDXComponents {
  return {
    h1: ({ children }: HeadingProps) => <h1 id={slugifyHeading(children)}>{children}</h1>,
    h2: ({ children }: HeadingProps) => <h2 id={slugifyHeading(children)}>{children}</h2>,
    h3: ({ children }: HeadingProps) => <h3 id={slugifyHeading(children)}>{children}</h3>,
    h4: ({ children }: HeadingProps) => <h4 id={slugifyHeading(children)}>{children}</h4>,
    a: MdxLink,
    Box: ({ center, children }: { center?: boolean; children?: ReactNode }) => (
      <div className={center ? "flex justify-center" : undefined}>{children}</div>
    ),
    Table,
    ArticleFileImage: ({
      filepath,
      src,
      alt,
      caption,
    }: {
      filepath?: string;
      src?: string;
      alt?: string;
      caption?: string;
    }) => {
      const resolvedSrc = (filepath ?? src ?? "").replace(/^public\//, "/");
      if (!resolvedSrc) return null;

      return (
        <figure className="mx-auto my-0 flex max-w-full flex-col gap-3 text-center">
          <Image
            src={resolvedSrc}
            alt={alt ?? ""}
            width={1200}
            height={675}
            className="mx-auto block h-auto max-w-full rounded-[8px] border border-[#e5e7eb] bg-white"
          />
          {caption ? (
            <figcaption className="m-0 text-sm leading-6 text-slate-400">{caption}</figcaption>
          ) : null}
        </figure>
      );
    },
    Youtube: ({ src, title }: { src?: string; title?: string }) => (
      <div className="aspect-video w-full overflow-hidden rounded-[8px] border border-[#e5e7eb]">
        <iframe
          src={src}
          title={title ?? "YouTube video"}
          className="h-full w-full border-0"
          allowFullScreen
        />
      </div>
    ),
    pre: ({ children }: { children?: ReactNode }) => {
      const codeChild = Children.toArray(children).find(
        (child) => isValidElement(child) && child.type === "code",
      ) as ReactElement<{ children?: ReactNode }> | undefined;
      const code = typeof codeChild?.props.children === "string" ? codeChild.props.children : undefined;

      return (
        <pre className="mt-6 overflow-x-auto rounded-[8px] bg-[#111827] px-4 py-3 text-sm leading-6 text-white">
          {code ?? children}
        </pre>
      );
    },
  };
}
