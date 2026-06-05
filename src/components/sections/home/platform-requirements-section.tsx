import type { ReactNode } from "react";
import Image from "next/image";
import { MarketingPill, MarketingSurface } from "@/components/sections/home/primitives";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export function PlatformRequirementsSection({ children }: { children: ReactNode }) {
  return (
    <section {...componentNameDebugProps("PlatformRequirementsSection")} className="mx-auto max-w-[1920px] bg-white px-6 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-[1120px]">{children}</div>
    </section>
  );
}

export function PlatformRequirementsIntro({ children }: { children: ReactNode }) {
  return (
    <div {...componentNameDebugProps("PlatformRequirementsIntro")} className="mx-auto max-w-[1280px] text-center">
      <RevealOnScroll className="mx-auto max-w-[1280px]" variant="up">
        {children}
      </RevealOnScroll>
    </div>
  );
}

export function PlatformRequirementsTitle({ children }: { children: ReactNode }) {
  return (
    <h2 {...componentNameDebugProps("PlatformRequirementsTitle")} className="mx-auto max-w-[38ch] text-balance text-[30px] font-semibold leading-[1.2] tracking-[-0.04em] text-slate-950 sm:text-[42px]">
      {children}
    </h2>
  );
}

export function PlatformRequirementsBody({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("PlatformRequirementsBody")} className="mx-auto mt-5 max-w-[758px] text-left text-[15px] leading-[1.85] text-slate-600">{children}</p>;
}

export function PlatformRequirementsBlockList({ children }: { children: ReactNode }) {
  return <RevealOnScroll {...componentNameDebugProps("PlatformRequirementsBlockList")} className="mt-12 space-y-5" variant="up" delayMs={220}>{children}</RevealOnScroll>;
}

export function PlatformRequirementsBlock({ reverse = false, children }: { reverse?: boolean; children: ReactNode }) {
  return (
    <MarketingSurface {...componentNameDebugProps("PlatformRequirementsBlock")} as="article" className="overflow-hidden rounded-[1.6rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.95)_100%)] shadow-[0_20px_54px_-44px_rgba(15,23,42,0.16)]">
      <div className={`flex flex-col lg:flex-row ${reverse ? "lg:flex-row-reverse" : ""}`}>{children}</div>
    </MarketingSurface>
  );
}

export function PlatformRequirementsBlockContent({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("PlatformRequirementsBlockContent")} className="p-6 lg:basis-2/3 lg:p-7">{children}</div>;
}

export function PlatformRequirementsBlockLabel({ children }: { children: ReactNode }) {
  return <MarketingPill {...componentNameDebugProps("PlatformRequirementsBlockLabel")} className="bg-[#eef2f7] px-3 py-1 tracking-[0.08em] text-[#2f3a49]">{children}</MarketingPill>;
}

export function PlatformRequirementsBlockTitle({ children }: { children: ReactNode }) {
  return <h3 {...componentNameDebugProps("PlatformRequirementsBlockTitle")} className="mt-4 text-[26px] font-semibold leading-[1.28] tracking-[-0.04em] text-slate-950">{children}</h3>;
}

export function PlatformRequirementsBlockBody({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("PlatformRequirementsBlockBody")} className="mt-4 text-[15px] leading-7 text-slate-600">{children}</p>;
}

export function PlatformRequirementsBlockImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div {...componentNameDebugProps("PlatformRequirementsBlockImage")} className="relative min-h-[220px] lg:min-h-0 lg:basis-1/3">
      <div className="relative h-full w-full">
        <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
      </div>
    </div>
  );
}

export function PlatformRequirementsVideo({ src }: { src: string }) {
  return (
    <RevealOnScroll {...componentNameDebugProps("PlatformRequirementsVideo")} className="mx-auto mt-10 max-w-[960px] overflow-hidden rounded-[1.8rem] border border-slate-200/80 bg-slate-950 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.28)]" variant="up" delayMs={320}>
      <div className="relative aspect-video w-full">
        <iframe className="h-full w-full" src={src} title="QueryPie AI overview video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
      </div>
    </RevealOnScroll>
  );
}
