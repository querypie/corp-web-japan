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

export function buildPublicationMdxComponents(): MDXComponents {
  return {
    h1: ({ children }: { children?: ReactNode }) => <h1 id={slugifyHeading(children)}>{children}</h1>,
    h2: ({ children }: { children?: ReactNode }) => <h2 id={slugifyHeading(children)}>{children}</h2>,
    h3: ({ children }: { children?: ReactNode }) => <h3 id={slugifyHeading(children)}>{children}</h3>,
    h4: ({ children }: { children?: ReactNode }) => <h4 id={slugifyHeading(children)}>{children}</h4>,
    Table,
  };
}
