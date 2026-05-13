"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type AcpFeatureBrowserItem = {
  imageSrc: string;
  learnMoreHref: string;
  title: string;
  bodyLines: string[];
};

export type AcpFeatureBrowserCategory = {
  label: string;
  items: AcpFeatureBrowserItem[];
};

export function AcpFeatureBrowserClient({ categories }: { categories: AcpFeatureBrowserCategory[] }) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const activeCategory = categories[activeCategoryIndex] ?? categories[0];
  const activeItem = activeCategory?.items[activeItemIndex] ?? activeCategory?.items[0];

  function selectCategory(index: number) {
    setActiveCategoryIndex(index);
    setActiveItemIndex(0);
  }

  function goPrev() {
    const count = activeCategory?.items.length ?? 1;
    setActiveItemIndex((index) => (index - 1 + count) % count);
  }

  function goNext() {
    const count = activeCategory?.items.length ?? 1;
    setActiveItemIndex((index) => (index + 1) % count);
  }

  if (!activeCategory || !activeItem) {
    return null;
  }

  return (
    <div className="grid w-full gap-[60px] lg:grid-cols-[380px_1fr]">
      <ul className="flex flex-col">
        {categories.map((category, index) => {
          const active = index === activeCategoryIndex;

          return (
            <li key={category.label} className="border-t border-[#D0D7DE]">
              <button
                type="button"
                onClick={() => selectCategory(index)}
                className={[
                  "flex w-full cursor-pointer py-[32px] text-left text-[20px] font-medium leading-[28px] transition",
                  active ? "text-[#0969DA]" : "text-[#24292F] hover:text-[#0969DA]",
                ].join(" ")}
              >
                {category.label}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="relative flex flex-col items-center rounded-[20px] bg-[#F6F8FA] px-[60px] pb-[88px] pt-[20px] max-lg:px-[20px] max-lg:pb-[78px]">
        <article className="flex w-full flex-col gap-[20px]">
          <div className="flex w-full justify-center">
            <Image
              src={activeItem.imageSrc}
              alt={activeItem.title}
              width={720}
              height={405}
              unoptimized
              className="h-auto max-h-[460px] w-auto max-w-full object-contain"
            />
          </div>

          <div className="flex flex-col items-center gap-[10px] text-center">
            <h6 className="text-[20px] font-medium leading-[28px] text-[#24292F]">{activeItem.title}</h6>
            <p className="text-[15px] font-light leading-[25px] tracking-[0.36px] text-[#57606A]">
              {activeItem.bodyLines.map((line, index) => (
                <span key={`${activeItem.title}-${index}`}>
                  {index > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </p>
            <Link
              href={activeItem.learnMoreHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-[15px] font-normal leading-[16px] text-[#24292F] underline-offset-4 hover:underline"
            >
              Learn More
            </Link>
          </div>
        </article>

        <div className="absolute bottom-[40px] flex h-[28px] justify-center gap-[4px] max-lg:bottom-[30px]">
          {activeCategory.items.map((item, index) => (
            <button
              key={item.title}
              type="button"
              aria-label={`Show feature ${index + 1}`}
              onClick={() => setActiveItemIndex(index)}
              className="flex h-[28px] w-[28px] cursor-pointer items-center justify-center p-[8px]"
            >
              <span
                className={[
                  "h-[12px] w-[12px] rounded-full bg-[#24292F] transition-opacity",
                  index === activeItemIndex ? "opacity-100" : "opacity-30",
                ].join(" ")}
              />
            </button>
          ))}
        </div>

        <div className="pointer-events-none absolute left-0 top-[200px] flex w-full justify-between px-[20px]">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous feature"
            className="pointer-events-auto inline-flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full bg-white text-[20px] text-[#24292F] shadow-[0_20px_30px_rgba(0,0,0,0.04)] transition hover:text-[#0969DA]"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next feature"
            className="pointer-events-auto inline-flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full bg-white text-[20px] text-[#24292F] shadow-[0_20px_30px_rgba(0,0,0,0.04)] transition hover:text-[#0969DA]"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
