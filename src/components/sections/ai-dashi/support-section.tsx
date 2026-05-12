import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

export function AIDashiSupportSection({ children }: { children: ReactNode }) {
  return (
    <section id="ai-dashi-support" className="mx-auto max-w-[1920px] bg-white px-6 py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-[1120px]">{children}</div>
      </div>
    </section>
  );
}

export function AIDashiSupportIntro({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll variant="up" className="mx-auto max-w-[920px] text-center">
      {children}
    </RevealOnScroll>
  );
}

export function AIDashiSupportTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[34px] font-semibold leading-[1.24] tracking-[-0.03em] text-slate-950 sm:text-[42px] sm:leading-[54px] sm:tracking-[-0.04em]">{children}</h2>;
}

export function AIDashiSupportBody({ children }: { children: ReactNode }) {
  return <p className="mx-auto mt-5 max-w-[740px] text-left text-base leading-7 text-slate-500">{children}</p>;
}

export function AIDashiSupportCards({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll className="mx-auto mt-10 flex max-w-[1120px] flex-col gap-3" variant="up" delayMs={120}>
      {children}
    </RevealOnScroll>
  );
}

export function AIDashiSupportCard({ children }: { children: ReactNode }) {
  return <article className="rounded-[1.45rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.94)_100%)] px-4 py-3.5 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.14)] ring-1 ring-white/80 transition duration-300 hover:-translate-y-1 hover:shadow-md md:px-5 md:py-4">{children}</article>;
}

export function AIDashiSupportCardLayout({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 md:grid md:grid-cols-[minmax(0,500px)_minmax(0,1fr)] md:items-start md:gap-4">{children}</div>;
}

export function AIDashiSupportCardSummary({ children }: { children: ReactNode }) {
  return <div className="flex items-start gap-3.5">{children}</div>;
}

export function AIDashiSupportCardIcon({ children }: { children: ReactNode }) {
  return <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[12px] bg-[linear-gradient(180deg,#f3f6fa_0%,#e9eef5_100%)] text-[#15181d] md:h-11 md:w-11">{children}</div>;
}

export function AIDashiSupportCardCopy({ children }: { children: ReactNode }) {
  return <div className="min-w-0 flex-1 pt-0.5">{children}</div>;
}

export function AIDashiSupportCardTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-[19px] font-semibold leading-7 tracking-[-0.03em] text-slate-950 md:text-[21px] md:leading-7 md:tracking-[-0.04em] lg:whitespace-nowrap">{children}</h3>;
}

export function AIDashiSupportCardLead({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-[13px] font-medium leading-5 text-slate-700 lg:whitespace-nowrap">{children}</p>;
}

export function AIDashiSupportCardDetails({ children }: { children: ReactNode }) {
  return <div className="border-t border-slate-200/80 pt-3 md:border-t-0 md:border-l md:pl-4 md:pt-0">{children}</div>;
}

export function AIDashiSupportCardDetailLabel({ children }: { children: ReactNode }) {
  return <p className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-slate-500">{children}</p>;
}

export function AIDashiSupportCardPointList({ children }: { children: ReactNode }) {
  return <ul className="mt-2 grid gap-1.5 text-sm text-slate-600">{children}</ul>;
}

export function AIDashiSupportCardPoint({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2 rounded-[0.95rem] bg-slate-50/90 px-3 py-2 leading-5.5">
      <span className="mt-[0.45rem] h-1.5 w-1.5 flex-none rounded-full bg-[#ED602E]/70" />
      <span>{children}</span>
    </li>
  );
}
