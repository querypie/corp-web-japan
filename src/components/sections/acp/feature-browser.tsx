import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { AcpFeatureBrowserClient, type AcpFeatureBrowserCategory } from "./feature-browser-client";

type AcpFeatureCategoryProps = {
  children: ReactNode;
};

type AcpFeatureCategoryLabelProps = {
  children: ReactNode;
};

type AcpFeatureItemProps = {
  imageSrc: string;
  learnMoreHref: string;
  children: ReactNode;
};

type AcpFeatureItemTitleProps = {
  children: ReactNode;
};

type AcpFeatureItemBodyProps = {
  children: ReactNode;
};

function isAcpFeatureCategoryElement(node: ReactNode): node is ReactElement<AcpFeatureCategoryProps> {
  return isValidElement(node) && node.type === AcpFeatureCategory;
}

function isAcpFeatureCategoryLabelElement(node: ReactNode): node is ReactElement<AcpFeatureCategoryLabelProps> {
  return isValidElement(node) && node.type === AcpFeatureCategoryLabel;
}

function isAcpFeatureItemElement(node: ReactNode): node is ReactElement<AcpFeatureItemProps> {
  return isValidElement(node) && node.type === AcpFeatureItem;
}

function isAcpFeatureItemTitleElement(node: ReactNode): node is ReactElement<AcpFeatureItemTitleProps> {
  return isValidElement(node) && node.type === AcpFeatureItemTitle;
}

function isAcpFeatureItemBodyElement(node: ReactNode): node is ReactElement<AcpFeatureItemBodyProps> {
  return isValidElement(node) && node.type === AcpFeatureItemBody;
}

function toPlainText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(toPlainText).join("");
  }

  if (isValidElement(node)) {
    const elementType = node.type;

    if (typeof elementType === "string" && elementType.toLowerCase() === "br") {
      return "\n";
    }

    return toPlainText((node.props as { children?: ReactNode }).children ?? null);
  }

  return "";
}

function toBodyLines(node: ReactNode): string[] {
  return toPlainText(node)
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function parseCategories(children: ReactNode): AcpFeatureBrowserCategory[] {
  return Children.toArray(children)
    .filter(isAcpFeatureCategoryElement)
    .map((category) => {
      const categoryChildren = Children.toArray(category.props.children);
      const labelNode = categoryChildren.find(isAcpFeatureCategoryLabelElement)?.props.children ?? null;
      const label = toPlainText(labelNode).replace(/\s+/g, " ").trim();
      const items = categoryChildren.filter(isAcpFeatureItemElement).map((item) => {
        const itemChildren = Children.toArray(item.props.children);
        const titleNode = itemChildren.find(isAcpFeatureItemTitleElement)?.props.children ?? null;
        const bodyNode = itemChildren.find(isAcpFeatureItemBodyElement)?.props.children ?? null;

        return {
          imageSrc: item.props.imageSrc,
          learnMoreHref: item.props.learnMoreHref,
          title: toPlainText(titleNode).replace(/\s+/g, " ").trim(),
          bodyLines: toBodyLines(bodyNode),
        };
      });

      return { label, items };
    })
    .filter((category) => category.label && category.items.length > 0);
}

export function AcpFeatureBrowser({ children }: { children: ReactNode }) {
  const categories = parseCategories(children);

  return <AcpFeatureBrowserClient categories={categories} />;
}

export function AcpFeatureCategory(props: AcpFeatureCategoryProps) {
  void props;
  return null;
}

export function AcpFeatureCategoryLabel(props: AcpFeatureCategoryLabelProps) {
  void props;
  return null;
}

export function AcpFeatureItem(props: AcpFeatureItemProps) {
  void props;
  return null;
}

export function AcpFeatureItemTitle(props: AcpFeatureItemTitleProps) {
  void props;
  return null;
}

export function AcpFeatureItemBody(props: AcpFeatureItemBodyProps) {
  void props;
  return null;
}
