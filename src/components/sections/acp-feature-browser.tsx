"use client";

import Image from "next/image";
import Link from "next/link";
import { Children, isValidElement, useMemo, useState, type ReactElement, type ReactNode } from "react";

type AcpFeatureItemProps = {
  title: string;
  imageSrc: string;
  learnMoreHref: string;
  children: ReactNode;
};

type AcpFeatureCategoryProps = {
  label: string;
  children: ReactNode;
};

function isAcpFeatureCategoryElement(node: ReactNode): node is ReactElement<AcpFeatureCategoryProps> {
  return (
    isValidElement(node) &&
    typeof node.props === "object" &&
    node.props !== null &&
    typeof (node.props as { label?: unknown }).label === "string"
  );
}

function isAcpFeatureItemElement(node: ReactNode): node is ReactElement<AcpFeatureItemProps> {
  return (
    isValidElement(node) &&
    typeof node.props === "object" &&
    node.props !== null &&
    typeof (node.props as { title?: unknown }).title === "string" &&
    typeof (node.props as { imageSrc?: unknown }).imageSrc === "string" &&
    typeof (node.props as { learnMoreHref?: unknown }).learnMoreHref === "string"
  );
}

export function AcpFeatureBrowser({ children }: { children: ReactNode }) {
  const categories = useMemo(() => Children.toArray(children).filter(isAcpFeatureCategoryElement), [children]);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const activeCategory = categories[activeCategoryIndex];
  const activeItems = useMemo(() => Children.toArray(activeCategory?.props.children).filter(isAcpFeatureItemElement), [activeCategory]);
  const activeItem = activeItems[activeItemIndex];
  const isFirst = activeItemIndex === 0;
  const isLast = activeItemIndex === activeItems.length - 1;

  const tabClassName = useMemo(
    () => "cursor-pointer rounded-full border px-[20px] py-[10px] text-[15px] font-medium leading-[20px] transition",
    [],
  );

  function selectCategory(index: number) {
    setActiveCategoryIndex(index);
    setActiveItemIndex(0);
  }

  function goPrev() {
    setActiveItemIndex((index) => Math.max(index - 1, 0));
  }

  function goNext() {
    setActiveItemIndex((index) => Math.min(index + 1, activeItems.length - 1));
  }

  return (
    <div className="flex flex-col gap-[60px]">
      <div className="flex flex-wrap justify-center gap-[12px]">
        {categories.map((category, index) => {
          const active = index === activeCategoryIndex;

          return (
            <button
              key={category.props.label}
              type="button"
              onClick={() => selectCategory(index)}
              className={[
                tabClassName,
                active ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              ].join(" ")}
            >
              {category.props.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-[40px]">
        <div className="w-[60px] shrink-0">
          <button
            type="button"
            onClick={goPrev}
            disabled={isFirst}
            aria-label="Previous feature"
            className="inline-flex h-[48px] w-[48px] items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-default disabled:opacity-40"
          >
            <span aria-hidden="true">←</span>
          </button>
        </div>

        <article className="grid w-full max-w-[1200px] items-center gap-[40px] lg:grid-cols-[1fr_651px]">
          <div className="order-2 lg:order-1">
            <h3 className="text-[32px] font-medium leading-[42px] tracking-normal text-[#24292F]">{activeItem?.props.title}</h3>
            <div className="mt-[20px] text-[16px] font-light leading-[26px] tracking-[0.36px] text-[#57606A]">{activeItem?.props.children}</div>
            <Link
              href={activeItem?.props.learnMoreHref ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-[20px] inline-flex items-center text-[15px] font-normal leading-[16px] text-[#24292F] underline-offset-4 hover:underline"
            >
              Learn More
            </Link>
          </div>

          <div className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-[8px] shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
              <Image
                src={activeItem?.props.imageSrc ?? "/services/acp/easy-use.png"}
                alt={activeItem?.props.title ?? ""}
                width={651}
                height={366}
                unoptimized
                className="h-auto w-full"
              />
            </div>
          </div>
        </article>

        <div className="flex w-[60px] shrink-0 justify-end">
          <button
            type="button"
            onClick={goNext}
            disabled={isLast}
            aria-label="Next feature"
            className="inline-flex h-[48px] w-[48px] items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:cursor-default disabled:opacity-40"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function AcpFeatureCategory(props: AcpFeatureCategoryProps) {
  void props;
  return null;
}

export function AcpFeatureItem(props: AcpFeatureItemProps) {
  void props;
  return null;
}
