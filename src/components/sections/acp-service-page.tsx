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

export function AcpServicePageShell({ children }: { children: ReactNode }) {
  return <main className="relative overflow-x-hidden bg-white text-slate-950">{children}</main>;
}

export function AcpHeroSection({ children }: { children: ReactNode }) {
  return <section className="flex justify-center px-6 pb-[120px] pt-[80px] lg:px-0">{children}</section>;
}

export function AcpHeroInner({ children }: { children: ReactNode }) {
  return <div className="flex w-full max-w-[1200px] flex-col items-center gap-[80px] text-center">{children}</div>;
}

export function AcpHeroCopy({ children }: { children: ReactNode }) {
  return <div className="flex max-w-[1200px] flex-col items-center gap-[20px] text-center">{children}</div>;
}

export function AcpHeroTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-[60px] font-normal leading-[72px] tracking-normal text-[#24292F]">{children}</h1>;
}

export function AcpHeroLead({ children }: { children: ReactNode }) {
  return <p className="max-w-[760px] text-[18px] font-light leading-[28px] tracking-[0.36px] text-[#57606A]">{children}</p>;
}

export function AcpHeroVideo() {
  return (
    <div className="mx-auto w-full max-w-[1024px] overflow-hidden rounded-[12px] shadow-[0_24px_80px_-55px_rgba(15,23,42,0.45)]">
      <div className="relative aspect-video w-full bg-black">
        <iframe
          src="https://www.youtube.com/embed/AWnknC76Jpo?si=5M5QNi83zyyHD2V3"
          title="QueryPie Web DAC Quick Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  );
}

export function AcpEasyUseSection({ children }: { children: ReactNode }) {
  return <section className="flex justify-center px-6 pb-[160px] lg:px-0">{children}</section>;
}

export function AcpEasyUseInner({ children }: { children: ReactNode }) {
  return <div className="flex w-full max-w-[1200px] flex-col gap-[80px]">{children}</div>;
}

export function AcpSectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[52px] font-normal leading-[62px] tracking-normal text-[#24292F]">{children}</h2>;
}

export function AcpSectionBody({ children }: { children: ReactNode }) {
  return <p className="text-[16px] font-light leading-[26px] tracking-[0.36px] text-[#57606A]">{children}</p>;
}

export function AcpEasyUseImage() {
  return (
    <div className="mx-auto max-w-[1000px]">
      <Image src="/services/acp/easy-use.png" alt="Easy Installation, Easy Use" width={1000} height={440} className="h-auto w-full" />
    </div>
  );
}

export function AcpFeatureBrowser({ categories }: AcpFeatureBrowserProps) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const activeCategory = categories[activeCategoryIndex];
  const activeItem = activeCategory.items[activeItemIndex];
  const isFirst = activeItemIndex === 0;
  const isLast = activeItemIndex === activeCategory.items.length - 1;

  const tabClassName = useMemo(
    () =>
      "cursor-pointer rounded-full border px-[20px] py-[10px] text-[15px] font-medium leading-[20px] transition",
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
      <div className="flex justify-center">
        <h2 className="text-[52px] font-normal leading-[62px] tracking-normal text-[#24292F]">QueryPie ACPができること</h2>
      </div>

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

export function AcpIntegrationsSection({ children }: { children: ReactNode }) {
  return <section className="flex justify-center bg-[#F6F8FA] px-6 py-[80px] lg:px-0">{children}</section>;
}

export function AcpIntegrationsInner({ children }: { children: ReactNode }) {
  return <div className="grid w-full max-w-[1200px] items-center gap-[80px] lg:grid-cols-[1fr_640px]">{children}</div>;
}

export function AcpIntegrationsTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-[30px] font-medium leading-[39.375px] tracking-normal text-[#24292F]">{children}</h3>;
}

export function AcpIntegrationsBody({ children }: { children: ReactNode }) {
  return <p className="mt-[20px] text-[16px] font-light leading-[26px] tracking-[0.36px] text-[#57606A]">{children}</p>;
}

export function AcpIntegrationsImage() {
  return <Image src="/services/acp/integrations.png" alt="ACP Integrations" width={640} height={670} className="h-auto w-full" />;
}
