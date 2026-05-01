import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingPill, MarketingSurface } from "@/components/sections/marketing-section-primitives";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

export function WhitepaperSection({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto max-w-[1920px] bg-white px-6 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-[1120px]">{children}</div>
    </section>
  );
}

export function WhitepaperShell({ children }: { children: ReactNode }) {
  return <MarketingSurface className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(255,255,255,0.98)_100%)] px-6 py-8 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.14)] lg:px-8 lg:py-10">{children}</MarketingSurface>;
}

export function WhitepaperIntro({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[900px] text-center">
      <RevealOnScroll variant="up">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">Download</p>
        <div className="mt-2 space-y-4">{children}</div>
      </RevealOnScroll>
    </div>
  );
}

export function WhitepaperIntroTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[24px] leading-[1.3] tracking-[-0.03em] text-slate-950 sm:text-[30px]">{children}</h2>;
}

export function WhitepaperIntroBody({ children }: { children: ReactNode }) {
  return <p className="mx-auto max-w-[820px] text-left leading-7 text-slate-600">{children}</p>;
}

export function WhitepaperGrid({ children }: { children: ReactNode }) {
  return <RevealOnScroll className="mt-8 grid gap-5 lg:grid-cols-2" variant="up" delayMs={220}>{children}</RevealOnScroll>;
}

export function WhitepaperCard({ children }: { children: ReactNode }) {
  return <MarketingSurface as="article" className="overflow-hidden rounded-[1.8rem] bg-white shadow-[0_20px_54px_-44px_rgba(15,23,42,0.16)]">{children}</MarketingSurface>;
}

export function WhitepaperCardImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative min-h-[320px] bg-[#f5f7fb]">
      <Image src={src} alt={alt} fill unoptimized className="object-contain p-4" sizes="(min-width: 1024px) 50vw, 100vw" />
    </div>
  );
}

export function WhitepaperCardBody({ children }: { children: ReactNode }) {
  return <div className="p-6">{children}</div>;
}

export function WhitepaperCardTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-[21px] font-medium leading-[1.4] tracking-[-0.02em] text-slate-950">{children}</h3>;
}

export function WhitepaperTagGroup({ children }: { children: ReactNode }) {
  return <div className="mt-4 flex flex-wrap gap-2">{children}</div>;
}

export function WhitepaperTag({ children }: { children: ReactNode }) {
  return <MarketingPill className="bg-[#eef2f7] px-3 py-1 tracking-[0.04em] text-[#2f3a49]">{children}</MarketingPill>;
}

export function WhitepaperDescription({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-[14px] leading-7 text-slate-600">{children}</p>;
}

export function WhitepaperToc({ children }: { children: ReactNode }) {
  return (
    <details className="mt-4 rounded-[1rem] border border-slate-200 bg-slate-50/70 px-4 py-3">
      <summary className="cursor-pointer list-none text-sm font-semibold text-[#2f3a49] [&::-webkit-details-marker]:hidden">目次を見る</summary>
      <ul className="mt-3 space-y-2 text-[13px] leading-6 text-slate-600">{children}</ul>
    </details>
  );
}

export function WhitepaperTocItem({ children }: { children: ReactNode }) {
  return <li className="flex gap-2"><span className="mt-[0.45rem] h-1.5 w-1.5 flex-none rounded-full bg-[#2f3a49]/70" /><span>{children}</span></li>;
}

export function WhitepaperAction({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-[#2f3a49]">{children}<ArrowRight className="h-4 w-4" /></Link>;
}