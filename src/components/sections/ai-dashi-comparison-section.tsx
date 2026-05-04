import type { ReactNode } from "react";
import { Check, X } from "lucide-react";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

export function AIDashiComparisonSection({ children }: { children: ReactNode }) {
  return (
    <section id="ai-dashi-comparison" className="mx-auto max-w-[1920px] bg-[#f8fafc] px-6 py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="w-full">{children}</div>
      </div>
    </section>
  );
}

export function AIDashiComparisonIntro({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll variant="up" className="mx-auto max-w-[920px] text-center">
      {children}
    </RevealOnScroll>
  );
}

export function AIDashiComparisonTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[34px] font-semibold leading-[1.24] tracking-[-0.03em] text-slate-950 sm:text-[42px] sm:leading-[54px] sm:tracking-[-0.04em]">
      {children}
    </h2>
  );
}

export function AIDashiComparisonBody({ children }: { children: ReactNode }) {
  return <div className="mx-auto mt-5 max-w-[760px] text-left text-base leading-7 text-slate-500">{children}</div>;
}

export function AIDashiComparisonTable({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll
      className="mx-auto mt-12 max-w-[1000px] overflow-hidden rounded-[1.8rem] border border-black/6 bg-white shadow-[0_22px_56px_-44px_rgba(15,23,42,0.14)]"
      variant="up"
      delayMs={120}
    >
      <div className="overflow-hidden rounded-[1.8rem] bg-white">{children}</div>
    </RevealOnScroll>
  );
}

export function AIDashiComparisonHeaderRow() {
  return (
    <div className="grid w-full grid-cols-[118px_1fr_1fr] bg-white md:grid-cols-[150px_minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-[180px_minmax(0,1.02fr)_minmax(0,0.98fr)]">
      <div className="border-r border-b border-black/5 bg-white px-4 py-6" />
      <div className="relative flex items-center justify-center overflow-hidden bg-[#f8fafc] px-4 py-7 text-center shadow-[inset_0_0_0_1px_rgba(237,96,46,0.05)]">
        <span className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-[linear-gradient(180deg,#E45A2A_0%,#ED602E_45%,#F08A3C_100%)]" />
        <span className="pointer-events-none absolute inset-y-0 right-0 w-[3px] bg-[linear-gradient(180deg,#E45A2A_0%,#ED602E_45%,#F08A3C_100%)]" />
        <span className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#E45A2A_0%,#ED602E_45%,#F08A3C_100%)]" />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/5" />
        <div className="relative z-[1] flex items-start justify-center gap-3">
          <div className="mt-0.5 inline-flex h-fit rounded-full bg-[#ED602E] px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-white">
            おすすめ
          </div>
          <div className="flex max-w-fit flex-col items-center justify-center text-center">
            <p className="text-[22px] font-semibold leading-7 tracking-[-0.03em] text-slate-950">QueryPie AIP導入</p>
            <p className="mt-1 text-[13px] font-medium leading-5 text-slate-600">組み込みAI基盤</p>
          </div>
          <div className="invisible inline-flex h-fit rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.14em]">
            おすすめ
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center border-b border-black/5 bg-white px-4 py-7 text-center">
        <div className="flex max-w-fit flex-col items-center justify-center text-center">
          <p className="text-[22px] font-semibold leading-7 tracking-[-0.03em] text-slate-700">自社開発</p>
          <p className="mt-1 text-[13px] font-medium leading-5 text-slate-500">フルスクラッチ</p>
        </div>
      </div>
    </div>
  );
}

export function AIDashiComparisonRow({ children }: { children: ReactNode }) {
  return (
    <div className="grid w-full grid-cols-[118px_1fr_1fr] md:grid-cols-[150px_minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-[180px_minmax(0,1.02fr)_minmax(0,0.98fr)]">
      {children}
    </div>
  );
}

export function AIDashiComparisonLabelCell({ children, isLast = false }: { children: ReactNode; isLast?: boolean }) {
  return (
    <div
      className={`flex items-center whitespace-nowrap border-r border-black/5 bg-white px-3 py-5 text-[12px] font-semibold leading-5 tracking-[-0.01em] text-slate-700 md:px-4 md:text-[12px] lg:px-5 lg:text-[14px] ${
        isLast ? "" : "border-b"
      }`}
    >
      {children}
    </div>
  );
}

export function AIDashiComparisonPreferredCell({ title, body, isLast = false }: { title: ReactNode; body: ReactNode; isLast?: boolean }) {
  return (
    <div className="relative flex min-h-[118px] items-center justify-center overflow-hidden bg-[#f8fafc] px-4 py-5 text-center md:px-5 lg:px-6">
      <span className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-[linear-gradient(180deg,#E45A2A_0%,#ED602E_45%,#F08A3C_100%)]" />
      <span className="pointer-events-none absolute inset-y-0 right-0 w-[3px] bg-[linear-gradient(180deg,#E45A2A_0%,#ED602E_45%,#F08A3C_100%)]" />
      {isLast ? (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-[linear-gradient(90deg,#E45A2A_0%,#ED602E_45%,#F08A3C_100%)]" />
      ) : (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/5" />
      )}
      <div className="relative z-[1] flex w-full max-w-[380px] flex-col items-center justify-center gap-2 text-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#ED602E] shadow-[0_10px_24px_-18px_rgba(15,23,42,0.28)]">
          <Check className="h-4 w-4 stroke-[2.5]" />
        </div>
        <p className="max-w-full text-[15px] font-bold leading-6 text-slate-950 md:text-base">{title}</p>
        <p className="mx-auto max-w-[380px] text-[11px] font-medium leading-5 text-slate-700 md:text-[12px]">{body}</p>
      </div>
    </div>
  );
}

export function AIDashiComparisonLegacyCell({ title, body, isLast = false }: { title: ReactNode; body: ReactNode; isLast?: boolean }) {
  return (
    <div
      className={`flex min-h-[118px] items-center justify-center bg-white px-4 py-5 text-center md:px-5 lg:px-6 ${
        isLast ? "" : "border-b border-black/5"
      }`}
    >
      <div className="flex w-full max-w-[340px] flex-col items-center justify-center gap-2 text-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.12)]">
          <X className="h-4 w-4 stroke-[2.5]" />
        </div>
        <p className="max-w-full text-[15px] font-semibold leading-6 text-slate-700 md:text-base">{title}</p>
        <p className="max-w-[340px] text-[11px] font-medium leading-5 text-slate-500 md:text-[12px]">{body}</p>
      </div>
    </div>
  );
}

export function AIDashiComparisonNote({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll variant="up" delayMs={220}>
      <p className="mt-4 text-center text-xs leading-5 text-slate-500">{children}</p>
    </RevealOnScroll>
  );
}

export function AIDashiComparisonCallout({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll className="mx-auto mt-6 max-w-[980px] border-t border-slate-200 px-2 pt-5 text-center" variant="up" delayMs={280}>
      <div className="mx-auto max-w-[820px] text-center">{children}</div>
    </RevealOnScroll>
  );
}
