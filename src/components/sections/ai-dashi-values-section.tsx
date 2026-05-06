import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { ZoomableFigure } from "@/components/sections/zoomable-figure";

export function AIDashiValuesSection({ children }: { children: ReactNode }) {
  return <section id="ai-dashi-values" className="mx-auto max-w-[1920px] bg-white px-6 py-20 lg:px-10 lg:py-24">{children}</section>;
}

export function AIDashiValuesShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1120px]">
      <div className="flex flex-col items-center gap-12">{children}</div>
    </div>
  );
}

export function AIDashiValuesIntro({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll variant="up" className="w-full max-w-[920px] text-center">
      {children}
    </RevealOnScroll>
  );
}

export function AIDashiValuesTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[34px] font-semibold leading-[1.24] tracking-[-0.03em] text-slate-950 sm:text-[42px] sm:leading-[54px] sm:tracking-[-0.04em]">{children}</h2>;
}

export function AIDashiValuesGrid({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll className="grid w-full gap-4 lg:grid-cols-3" variant="up" delayMs={120}>
      {children}
    </RevealOnScroll>
  );
}

export function AIDashiValueCard({ children }: { children: ReactNode }) {
  return <article className="rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_22px_56px_-44px_rgba(15,23,42,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-md">{children}</article>;
}

export function AIDashiValueCardHeader({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-3">{children}</div>;
}

export function AIDashiValueNumber({ children }: { children: ReactNode }) {
  return <div className="text-[32px] font-semibold tracking-[-0.06em] text-slate-300">{children}</div>;
}

export function AIDashiValueBadge({ children }: { children: ReactNode }) {
  return <div className="inline-flex rounded-full bg-[#eef2f7] px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#2f3a49]">{children}</div>;
}

export function AIDashiValueCardTitle({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return <h3 className={compact ? "mt-5 text-[20px] font-semibold leading-7 tracking-[-0.045em] text-slate-950" : "mt-5 text-[21px] font-semibold leading-7 tracking-[-0.03em] text-slate-950"}>{children}</h3>;
}

export function AIDashiValueHighlight({ children }: { children: ReactNode }) {
  return <span className="text-[#ED602E]">{children}</span>;
}

export function AIDashiValueCardBody({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-sm leading-7 text-slate-600">{children}</p>;
}

export function AIDashiValuesDiagram() {
  return (
    <RevealOnScroll className="w-full max-w-[820px]" variant="up" delayMs={220}>
      <ZoomableFigure
        src="/solutions/ai-dashi/value-diagram.webp"
        modalSrc="/solutions/ai-dashi/value-diagram.webp"
        modalImageWidth={2469}
        modalImageHeight={2160}
        alt="AI Dashi の3つの価値を示す図解"
        caption=""
        sizes="(min-width: 1024px) 680px, 100vw"
        modalScale={1.25}
      />
    </RevealOnScroll>
  );
}
