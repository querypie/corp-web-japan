import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { componentNameDebugProps } from "@/lib/component-name-debug";

type AcpFeatureCategoryProps = {
  id: string;
  englishLabel: string;
  children: ReactNode;
};

type AcpFeatureCategoryLabelProps = {
  children: ReactNode;
};

type AcpFeatureItemProps = {
  mediaSrc: string;
  mediaAlt: string;
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

type AcpFeatureBrowserCategory = {
  id: string;
  englishLabel: string;
  abbreviation: string;
  label: string;
  item: {
    mediaSrc: string;
    mediaAlt: string;
    title: string;
    bodyLines: string[];
  };
};

function parseCategories(children: ReactNode): AcpFeatureBrowserCategory[] {
  return Children.toArray(children)
    .filter(isAcpFeatureCategoryElement)
    .map((category) => {
      const categoryChildren = Children.toArray(category.props.children);
      const labelNode = categoryChildren.find(isAcpFeatureCategoryLabelElement)?.props.children ?? null;
      const [abbreviation, label] = toPlainText(labelNode).replace(/\s+/g, " ").trim().split("｜", 2);
      const item = categoryChildren.find(isAcpFeatureItemElement);
      const itemChildren = item ? Children.toArray(item.props.children) : [];
      const titleNode = itemChildren.find(isAcpFeatureItemTitleElement)?.props.children ?? null;
      const bodyNode = itemChildren.find(isAcpFeatureItemBodyElement)?.props.children ?? null;

      return item
        ? {
            id: category.props.id,
            englishLabel: category.props.englishLabel,
            abbreviation,
            label,
            item: {
              mediaSrc: item.props.mediaSrc,
              mediaAlt: item.props.mediaAlt,
              title: toPlainText(titleNode).replace(/\s+/g, " ").trim(),
              bodyLines: toBodyLines(bodyNode),
            },
          }
        : null;
    })
    .filter((category): category is AcpFeatureBrowserCategory => Boolean(category?.abbreviation && category.label && category.item.title));
}

export function AcpFeatureBrowser({ children }: { children: ReactNode }) {
  const categories = parseCategories(children);

  return (
    <div {...componentNameDebugProps("AcpFeatureBrowser")} className="flex w-full flex-col gap-[96px] md:gap-[140px]">
      {categories.map((category, index) => {
        const mediaFirstOnDesktop = index % 2 === 1;

        return (
          <article key={category.id} id={category.id} className="grid w-full items-center gap-8 md:grid-cols-2 md:gap-[60px]">
            <div className={`max-w-[440px] ${mediaFirstOnDesktop ? "md:order-2 md:justify-self-end" : undefined}`}>
              <p className="inline-flex rounded-full bg-[#EAF2FF] px-3 py-1 text-[13px] font-medium leading-5 text-[#174EA6]">{category.label}</p>
              <div className="mt-3 flex items-baseline gap-3">
                <p className="text-[26px] font-semibold leading-8 tracking-[-0.04em] text-[#0969DA]">{category.abbreviation}</p>
                <p className="text-[13px] font-light leading-5 tracking-[0.04em] text-[#6E7781]">{category.englishLabel}</p>
              </div>
              <h3 className="mt-4 text-[26px] font-medium leading-[1.35] tracking-[-0.04em] text-[#24292F] sm:text-[30px]">{category.item.title}</h3>
              <p className="mt-5 text-[16px] font-light leading-[26px] tracking-[0.2px] text-[#57606A]">
                {category.item.bodyLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>

            <div className={`overflow-hidden rounded-[20px] bg-[#F6F8FA] ${mediaFirstOnDesktop ? "md:order-1" : undefined}`}>
              <video
                aria-label={category.item.mediaAlt}
                className="block h-auto w-full"
                loop
                muted
                playsInline
                autoPlay
                preload="metadata"
                src={category.item.mediaSrc}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
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
