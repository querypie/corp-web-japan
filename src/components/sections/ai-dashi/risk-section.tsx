import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export function AIDashiRiskSection({ children }: { children: ReactNode }) {
  return (
    <section {...componentNameDebugProps("AIDashiRiskSection")} className="mx-auto max-w-[1920px] bg-white px-6 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1120px]">
        <RevealOnScroll variant="up">
          <div className="mx-auto max-w-[980px] rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.95)_100%)] px-6 py-8 shadow-[0_22px_60px_-46px_rgba(15,23,42,0.16)] sm:px-8 lg:px-10 lg:py-10">
            <div className="max-w-[860px] border-l-4 border-[#ED602E] pl-5">{children}</div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export function AIDashiRiskLead({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AIDashiRiskLead")} className="text-[14px] font-semibold leading-7 tracking-[0.02em] text-[#8c4a2f] sm:text-[15px]">{children}</p>;
}

export function AIDashiRiskTitle({ children }: { children: ReactNode }) {
  return <h2 {...componentNameDebugProps("AIDashiRiskTitle")} className="mt-2 text-[28px] font-bold leading-[1.18] tracking-[-0.04em] text-slate-950 sm:text-[34px] lg:text-[38px] lg:whitespace-nowrap">{children}</h2>;
}

export function AIDashiRiskBody({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AIDashiRiskBody")} className="mt-6 space-y-5 text-[15px] leading-8 text-slate-600 [&_strong]:font-semibold [&_strong]:text-slate-800">{children}</div>;
}
