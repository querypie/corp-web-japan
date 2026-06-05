import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export function AIDashiWallCardsSection({ children }: { children: ReactNode }) {
  return (
    <section {...componentNameDebugProps("AIDashiWallCardsSection")} id="why-ai-dashi" className="mx-auto max-w-[1920px] bg-[#f8fafc] px-6 py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col items-center gap-12">{children}</div>
      </div>
    </section>
  );
}

export function AIDashiWallCardsIntro({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll {...componentNameDebugProps("AIDashiWallCardsIntro")} variant="up" className="w-full max-w-[920px] text-center">
      {children}
    </RevealOnScroll>
  );
}

export function AIDashiWallCardsTitle({ children }: { children: ReactNode }) {
  return (
    <h2 {...componentNameDebugProps("AIDashiWallCardsTitle")} className="text-[34px] font-semibold leading-[1.24] tracking-[-0.03em] text-slate-950 sm:text-[42px] sm:leading-[54px] sm:tracking-[-0.04em]">
      {children}
    </h2>
  );
}

export function AIDashiWallCardsBody({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AIDashiWallCardsBody")} className="mx-auto mt-5 max-w-[710px] text-left text-base leading-7 text-slate-500">{children}</p>;
}

export function AIDashiWallCardsGrid({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll {...componentNameDebugProps("AIDashiWallCardsGrid")} className="grid w-full gap-4 lg:grid-cols-3 lg:gap-4" variant="up" delayMs={120}>
      {children}
    </RevealOnScroll>
  );
}

export function AIDashiWallCardsCard({ children }: { children: ReactNode }) {
  return (
    <article {...componentNameDebugProps("AIDashiWallCardsCard")} className="flex h-full flex-col rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_22px_56px_-44px_rgba(15,23,42,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-md">
      {children}
    </article>
  );
}

export function AIDashiWallCardsCardIcon({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AIDashiWallCardsCardIcon")} className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#eef1f4] text-[#15181d]">{children}</div>;
}

export function AIDashiWallCardsCardTitle({ children }: { children: ReactNode }) {
  return <h3 {...componentNameDebugProps("AIDashiWallCardsCardTitle")} className="mt-5 text-[22px] font-semibold leading-8 tracking-[-0.03em] text-slate-950">{children}</h3>;
}

export function AIDashiWallCardsCardBody({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AIDashiWallCardsCardBody")} className="mt-3 text-sm leading-7 text-slate-600">{children}</p>;
}
