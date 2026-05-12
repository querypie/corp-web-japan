import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

export function AIDashiEnterpriseReadySection({ children }: { children: ReactNode }) {
  return (
    <section id="enterprise-ready" className="mx-auto max-w-[1920px] bg-white px-6 py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col items-center gap-12">{children}</div>
      </div>
    </section>
  );
}

export function AIDashiEnterpriseReadyIntro({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll variant="up" className="w-full max-w-[900px] text-center">
      {children}
    </RevealOnScroll>
  );
}

export function AIDashiEnterpriseReadyTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[34px] font-semibold leading-[1.24] tracking-[-0.03em] text-slate-950 sm:text-[42px] sm:leading-[54px] sm:tracking-[-0.04em]">
      {children}
    </h2>
  );
}

export function AIDashiEnterpriseReadyBody({ children }: { children: ReactNode }) {
  return <p className="mx-auto mt-5 max-w-[780px] text-left text-base leading-7 text-slate-500">{children}</p>;
}

export function AIDashiEnterpriseReadyCards({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll className="grid w-full gap-4 lg:grid-cols-3" variant="up" delayMs={120}>
      {children}
    </RevealOnScroll>
  );
}

export function AIDashiEnterpriseReadyCard({ children }: { children: ReactNode }) {
  return (
    <article className="flex h-full flex-col rounded-[1.8rem] border border-slate-200/80 bg-white p-6 shadow-[0_22px_56px_-44px_rgba(15,23,42,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-md">
      {children}
    </article>
  );
}

export function AIDashiEnterpriseReadyCardIcon({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-[16px] border border-slate-200 bg-[#f6f8fb] text-[#2f3a49] shadow-[0_16px_34px_-24px_rgba(15,23,42,0.18)]">
      {children}
    </div>
  );
}

export function AIDashiEnterpriseReadyCardTitle({ children }: { children: ReactNode }) {
  return <h3 className="mt-5 text-[22px] font-semibold leading-8 tracking-[-0.03em] text-slate-950">{children}</h3>;
}

export function AIDashiEnterpriseReadyCardBody({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-sm leading-7 text-slate-600">{children}</p>;
}
