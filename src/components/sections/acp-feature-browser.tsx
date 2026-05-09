"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

type AcpFeatureItem = {
  title: string;
  description: ReactNode;
  imageSrc: string;
  learnMoreHref: string;
};

type AcpFeatureCategory = {
  label: string;
  items: readonly AcpFeatureItem[];
};

type AcpFeatureBrowserProps = {
  categories: readonly AcpFeatureCategory[];
};

export function AcpFeatureBrowser({ categories }: AcpFeatureBrowserProps) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const activeCategory = categories[activeCategoryIndex];
  const activeItem = activeCategory.items[activeItemIndex];
  const isFirst = activeItemIndex === 0;
  const isLast = activeItemIndex === activeCategory.items.length - 1;

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
    setActiveItemIndex((index) => Math.min(index + 1, activeCategory.items.length - 1));
  }

  return (
    <div className="flex flex-col gap-[60px]">
      <div className="flex flex-wrap justify-center gap-[12px]">
        {categories.map((category, index) => {
          const active = index === activeCategoryIndex;

          return (
            <button
              key={category.label}
              type="button"
              onClick={() => selectCategory(index)}
              className={[
                tabClassName,
                active ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              ].join(" ")}
            >
              {category.label}
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
            <h3 className="text-[32px] font-medium leading-[42px] tracking-normal text-[#24292F]">{activeItem.title}</h3>
            <div className="mt-[20px] text-[16px] font-light leading-[26px] tracking-[0.36px] text-[#57606A]">{activeItem.description}</div>
            <Link
              href={activeItem.learnMoreHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-[20px] inline-flex items-center text-[15px] font-normal leading-[16px] text-[#24292F] underline-offset-4 hover:underline"
            >
              Learn More
            </Link>
          </div>

          <div className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-[8px] shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
              <Image src={activeItem.imageSrc} alt={activeItem.title} width={651} height={366} unoptimized className="h-auto w-full" />
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
