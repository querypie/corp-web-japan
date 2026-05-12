import type { ReactNode } from "react";
import { MarketingIconFrame, MarketingPill, MarketingSurface } from "@/components/sections/marketing-section-primitives";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

export function CoreValueSection({ children }: { children: ReactNode }) {
  return (
    <section id="about" className="mx-auto max-w-[1920px] px-6 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-[1120px]">{children}</div>
    </section>
  );
}

export function CoreValueIntro({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[900px] text-center">
      <RevealOnScroll variant="up">
        <div className="mx-auto max-w-[900px]">{children}</div>
      </RevealOnScroll>
    </div>
  );
}

export function CoreValueTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[30px] font-semibold leading-[1.2] tracking-[-0.04em] text-slate-950 sm:text-[42px]">{children}</h2>;
}

export function CoreValueBody({ children }: { children: ReactNode }) {
  return <p className="mx-auto mt-5 max-w-[760px] text-center text-[15px] leading-7 text-slate-600">{children}</p>;
}

export function CoreValueGrid({ children }: { children: ReactNode }) {
  return <RevealOnScroll className="mt-10 grid items-stretch gap-4 lg:grid-cols-3" variant="up" delayMs={220}>{children}</RevealOnScroll>;
}

export function CoreValueCard({ children }: { children: ReactNode }) {
  return (
    <MarketingSurface as="article" className="flex h-full flex-col rounded-[1.8rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.95)_100%)] px-5 py-6 shadow-[0_20px_54px_-44px_rgba(15,23,42,0.18)] sm:px-6">
      {children}
    </MarketingSurface>
  );
}

export function CoreValueCardHeader({ children }: { children: ReactNode }) {
  return <div className="flex items-start justify-between gap-4">{children}</div>;
}

export function CoreValueCardBadge({ children }: { children: ReactNode }) {
  return <MarketingPill className="bg-[#2f3a49] px-3 py-1 tracking-[0.08em] text-white shadow-[0_12px_24px_-18px_rgba(15,23,42,0.42)]">{children}</MarketingPill>;
}

export function CoreValueCardIcon({ children }: { children: ReactNode }) {
  return <MarketingIconFrame className="bg-[#eef2f7] text-[#2f3a49]">{children}</MarketingIconFrame>;
}

export function CoreValueCardTitle({ children }: { children: ReactNode }) {
  return <h3 className="mt-2 text-[24px] font-semibold tracking-[0.02em] text-slate-950">{children}</h3>;
}

export function CoreValueCardTitleWrap({ children }: { children: ReactNode }) {
  return <div className="mt-5">{children}</div>;
}

export function CoreValueBulletList({ children }: { children: ReactNode }) {
  return <ul className="mt-4 flex-1 space-y-2.5 text-[15px] leading-7 text-slate-600">{children}</ul>;
}

export function CoreValueBullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="mt-[0.55rem] h-1.5 w-1.5 flex-none rounded-full bg-[#2f3a49]/75" />
      <span>{children}</span>
    </li>
  );
}
