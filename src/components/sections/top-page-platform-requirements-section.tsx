import type { ReactNode } from "react";
import Image from "next/image";
import { MarketingPill, MarketingSectionIntro, MarketingSurface } from "@/components/sections/marketing-section-primitives";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

export function PlatformRequirementsSection({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto max-w-[1920px] bg-white px-6 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-[1120px]">{children}</div>
    </section>
  );
}

export function PlatformRequirementsIntro({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1280px] text-center">
      <RevealOnScroll variant="up">
        <MarketingSectionIntro className="max-w-[1280px]" titleClassName="mx-auto max-w-[38ch] text-balance" bodyClassName="max-w-[758px] text-left leading-[1.85]" title={title} body={<p>{children}</p>} />
      </RevealOnScroll>
    </div>
  );
}

export function PlatformRequirementsBlockList({ children }: { children: ReactNode }) {
  return <RevealOnScroll className="mt-12 space-y-5" variant="up" delayMs={220}>{children}</RevealOnScroll>;
}

export function PlatformRequirementsBlock({ reverse = false, children }: { reverse?: boolean; children: ReactNode }) {
  return (
    <MarketingSurface as="article" className="overflow-hidden rounded-[1.6rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.95)_100%)] shadow-[0_20px_54px_-44px_rgba(15,23,42,0.16)]">
      <div className={`flex flex-col lg:flex-row ${reverse ? "lg:flex-row-reverse" : ""}`}>{children}</div>
    </MarketingSurface>
  );
}

export function PlatformRequirementsBlockContent({ children }: { children: ReactNode }) {
  return <div className="p-6 lg:basis-2/3 lg:p-7">{children}</div>;
}

export function PlatformRequirementsBlockLabel({ children }: { children: ReactNode }) {
  return <MarketingPill className="bg-[#eef2f7] px-3 py-1 tracking-[0.08em] text-[#2f3a49]">{children}</MarketingPill>;
}

export function PlatformRequirementsBlockTitle({ children }: { children: ReactNode }) {
  return <h3 className="mt-4 text-[26px] font-semibold leading-[1.28] tracking-[-0.04em] text-slate-950">{children}</h3>;
}

export function PlatformRequirementsBlockBody({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-[15px] leading-7 text-slate-600">{children}</p>;
}

export function PlatformRequirementsBlockImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative min-h-[220px] lg:min-h-0 lg:basis-1/3">
      <div className="relative h-full w-full">
        <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
      </div>
    </div>
  );
}

export function PlatformRequirementsVideo({ src }: { src: string }) {
  return (
    <RevealOnScroll className="mx-auto mt-10 max-w-[960px] overflow-hidden rounded-[1.8rem] border border-slate-200/80 bg-slate-950 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.28)]" variant="up" delayMs={320}>
      <div className="relative aspect-video w-full">
        <iframe className="h-full w-full" src={src} title="QueryPie AI overview video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
      </div>
    </RevealOnScroll>
  );
}
