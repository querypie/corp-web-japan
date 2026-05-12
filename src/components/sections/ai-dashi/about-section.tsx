import type { ReactNode } from "react";
import Image from "next/image";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

export function AIDashiAboutSection({ children }: { children: ReactNode }) {
  return <section id="about-ai-dashi" className="mx-auto max-w-[1920px] bg-[#f8fafc] px-6 py-20 lg:px-10 lg:py-24">{children}</section>;
}

export function AIDashiAboutShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1120px]">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:justify-between lg:gap-10">{children}</div>
    </div>
  );
}

export function AIDashiAboutIntro({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll variant="up" className="flex flex-col">
      <div className="flex flex-col gap-5">{children}</div>
    </RevealOnScroll>
  );
}

export function AIDashiAboutTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[34px] font-semibold leading-[1.24] tracking-[-0.03em] text-slate-950 sm:text-[42px] sm:leading-[54px] sm:tracking-[-0.04em]">{children}</h2>;
}

export function AIDashiAboutBody({ children }: { children: ReactNode }) {
  return <div className="max-w-[640px] space-y-5 text-[15px] leading-8 text-slate-500">{children}</div>;
}

export function AIDashiAboutHighlight({ children }: { children: ReactNode }) {
  return <span className="bg-gradient-to-r from-[#E45A2A] via-[#ED602E] to-[#F08A3C] bg-clip-text text-transparent">{children}</span>;
}

export function AIDashiAboutVisual({ src, alt }: { src: string; alt: string }) {
  return (
    <RevealOnScroll variant="right" delayMs={160} className="relative h-[320px] w-full overflow-hidden rounded-[20px] bg-[#eceff3] shadow-[0_24px_70px_-50px_rgba(15,23,42,0.22)] lg:h-[430px] lg:w-full">
      <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
    </RevealOnScroll>
  );
}
