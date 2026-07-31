"use client";

import Image from "next/image";
import { useState, type ComponentPropsWithoutRef } from "react";

export type AcpFeatureBrowserItem = {
  mediaSrc: string;
  mediaAlt: string;
  title: string;
  bodyLines: string[];
};

export type AcpFeatureBrowserCategory = {
  label: string;
  items: AcpFeatureBrowserItem[];
};

export function AcpFeatureBrowserClient({ categories, ...props }: { categories: AcpFeatureBrowserCategory[] } & Omit<ComponentPropsWithoutRef<"div">, "children">) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const activeCategory = categories[activeCategoryIndex] ?? categories[0];
  const activeItem = activeCategory?.items[0];
  const activeMediaIsVideo = activeItem?.mediaSrc.includes(".mp4") ?? false;

  function selectCategory(index: number) {
    setActiveCategoryIndex(index);
  }

  function goPrev() {
    setActiveCategoryIndex((index) => (index - 1 + categories.length) % categories.length);
  }

  function goNext() {
    setActiveCategoryIndex((index) => (index + 1) % categories.length);
  }

  if (!activeCategory || !activeItem) {
    return null;
  }

  return (
    <div {...props} className="grid w-full gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-10">
      <section className="flex min-h-full flex-col rounded-[20px] border border-[#D0D7DE] bg-white p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.12em] text-[#57606A]">ACCESS CONTROL</p>

        <article aria-live="polite" className="mt-5">
          <p className="text-[15px] font-semibold leading-6 text-[#0969DA]">{activeCategory.label}</p>
          <h3 className="mt-2 text-[27px] font-medium leading-[36px] tracking-[-0.03em] text-[#24292F]">{activeItem.title}</h3>
          <p className="mt-4 text-[16px] font-light leading-[26px] tracking-[0.2px] text-[#57606A]">
            {activeItem.bodyLines.map((line, index) => (
              <span key={`${activeItem.title}-${index}`} className="block">
                {line}
              </span>
            ))}
          </p>
        </article>

        <nav aria-label="アクセス制御の種類" className="mt-8 border-t border-[#D0D7DE] pt-5">
          <p className="mb-3 text-xs font-semibold tracking-[0.1em] text-[#57606A]">製品を選択</p>
          <ul className="grid gap-2">
            {categories.map((category, index) => {
              const active = index === activeCategoryIndex;

              return (
                <li key={category.label}>
                  <button
                    type="button"
                    onClick={() => selectCategory(index)}
                    aria-pressed={active}
                    className={[
                      "flex w-full cursor-pointer items-center rounded-[10px] px-3 py-2.5 text-left text-[14px] font-medium leading-5 transition",
                      active ? "bg-[#EAF2FF] text-[#0969DA]" : "text-[#24292F] hover:bg-[#F6F8FA] hover:text-[#0969DA]",
                    ].join(" ")}
                  >
                    <span className="mr-3 text-xs font-semibold tabular-nums text-[#57606A]">{String(index + 1).padStart(2, "0")}</span>
                    {category.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </section>

      <section className="relative flex flex-col rounded-[20px] bg-[#F6F8FA] px-6 py-6 sm:px-10 sm:py-8">
        <div className="flex min-h-[300px] flex-1 items-center justify-center sm:min-h-[380px]">
          <div className="flex w-full justify-center">
            {activeMediaIsVideo ? (
              <video
                aria-label={activeItem.mediaAlt}
                className="h-auto max-h-[460px] w-auto max-w-full object-contain"
                loop
                muted
                playsInline
                autoPlay
                preload="metadata"
                src={activeItem.mediaSrc}
              />
            ) : (
              <Image
                src={activeItem.mediaSrc}
                alt={activeItem.mediaAlt}
                width={720}
                height={405}
                unoptimized
                className="h-auto max-h-[460px] w-auto max-w-full object-contain"
              />
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#D0D7DE] pt-4">
          <span className="text-sm font-medium tabular-nums text-[#57606A]">{String(activeCategoryIndex + 1).padStart(2, "0")} / {String(categories.length).padStart(2, "0")}</span>
          <div className="flex h-[28px] justify-center gap-[4px]">
            {categories.map((category, index) => (
              <button
                key={category.label}
                type="button"
                aria-label={`${category.label}を表示`}
                onClick={() => selectCategory(index)}
                className="flex h-[28px] w-[28px] cursor-pointer items-center justify-center p-[8px]"
              >
                <span
                  className={[
                    "h-[10px] w-[10px] rounded-full bg-[#24292F] transition-opacity",
                    index === activeCategoryIndex ? "opacity-100" : "opacity-30",
                  ].join(" ")}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute left-3 top-1/2 flex w-[calc(100%-24px)] -translate-y-1/2 justify-between sm:left-5 sm:w-[calc(100%-40px)]">
          <button
            type="button"
            onClick={goPrev}
            aria-label="前のアクセス制御を表示"
            className="pointer-events-auto inline-flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full bg-white text-[20px] text-[#24292F] shadow-[0_20px_30px_rgba(0,0,0,0.04)] transition hover:text-[#0969DA]"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="次のアクセス制御を表示"
            className="pointer-events-auto inline-flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full bg-white text-[20px] text-[#24292F] shadow-[0_20px_30px_rgba(0,0,0,0.04)] transition hover:text-[#0969DA]"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </div>
  );
}
