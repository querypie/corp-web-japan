import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

export function AIDashiReleaseFlowSection({ children }: { children: ReactNode }) {
  return (
    <section id="ai-dashi-flow" className="mx-auto max-w-[1920px] bg-[#f8fafc] px-6 py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-10">{children}</div>
      </div>
    </section>
  );
}

export function AIDashiReleaseFlowIntro({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll variant="up" className="w-full max-w-[920px] text-center">
      {children}
    </RevealOnScroll>
  );
}

export function AIDashiReleaseFlowTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[34px] font-semibold leading-[1.24] tracking-[-0.03em] text-slate-950 sm:text-[42px] sm:leading-[54px] sm:tracking-[-0.04em] [&_strong]:bg-gradient-to-r [&_strong]:from-[#E45A2A] [&_strong]:via-[#ED602E] [&_strong]:to-[#F08A3C] [&_strong]:bg-clip-text [&_strong]:font-inherit [&_strong]:text-transparent">
      {children}
    </h2>
  );
}

export function AIDashiReleaseFlowBody({ children }: { children: ReactNode }) {
  return <p className="mx-auto mt-5 max-w-[760px] text-left text-base leading-7 text-slate-500">{children}</p>;
}

export function AIDashiReleaseFlowGrid({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll className="grid w-full gap-4 lg:grid-cols-2" variant="up" delayMs={120}>
      {children}
    </RevealOnScroll>
  );
}

export function AIDashiReleaseFlowCard({ children }: { children: ReactNode }) {
  return (
    <article className="flex h-full flex-col rounded-[1.6rem] border border-black/6 bg-white p-5 shadow-[0_22px_56px_-44px_rgba(15,23,42,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-md lg:p-6">
      {children}
    </article>
  );
}

export function AIDashiReleaseFlowCardHeader({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-between gap-3">{children}</div>;
}

export function AIDashiReleaseFlowStepBadge({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex rounded-full border border-[#2f3a49]/20 bg-[#2f3a49] px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-white shadow-[0_12px_24px_-18px_rgba(15,23,42,0.38)]">
      {children}
    </div>
  );
}

export function AIDashiReleaseFlowPeriodBadge({ children }: { children: ReactNode }) {
  return <div className="inline-flex rounded-full bg-[#fff4ee] px-3 py-1 text-[12px] font-semibold text-[#b85733]">{children}</div>;
}

export function AIDashiReleaseFlowCardTitle({ children }: { children: ReactNode }) {
  return <h3 className="mt-5 text-[21px] font-semibold leading-7 tracking-[-0.03em] text-slate-950 md:text-[22px] md:leading-8 md:tracking-[-0.04em]">{children}</h3>;
}

export function AIDashiReleaseFlowCardBody({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 flex-1 border-t border-black/6 pt-4">
      <p className="text-sm leading-7 text-slate-600">{children}</p>
    </div>
  );
}
