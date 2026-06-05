import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export function AICrewLostSection({ children }: { children: ReactNode }) {
  return (
    <section {...componentNameDebugProps("AICrewLostSection")} id="lost" className="mx-auto max-w-[1920px] bg-white px-6 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1120px]">{children}</div>
    </section>
  );
}

export function AICrewLostProblemCard({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll {...componentNameDebugProps("AICrewLostProblemCard")} variant="up">
      <div className="mx-auto max-w-[980px] rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.95)_100%)] px-6 py-8 shadow-[0_22px_60px_-46px_rgba(15,23,42,0.16)] sm:px-8 lg:px-10 lg:py-10">
        {children}
      </div>
    </RevealOnScroll>
  );
}

export function AICrewLostProblemContent({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AICrewLostProblemContent")} className="max-w-[880px] border-l-4 border-[#2563EB] pl-5">{children}</div>;
}

export function AICrewLostProblemTitle({ children }: { children: ReactNode }) {
  return <h2 {...componentNameDebugProps("AICrewLostProblemTitle")} className="text-[28px] font-bold leading-[1.18] tracking-[-0.04em] text-slate-950 sm:text-[34px] lg:text-[38px]">{children}</h2>;
}

export function AICrewLostProblemBody({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AICrewLostProblemBody")} className="mt-6 space-y-5 text-[15px] leading-8 text-slate-600">{children}</div>;
}

export function AICrewLostWhitepaperCard({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll {...componentNameDebugProps("AICrewLostWhitepaperCard")} variant="up" delayMs={140}>
      <div className="relative mx-auto mt-8 max-w-[980px] overflow-hidden rounded-[1.8rem] border border-[#d7e4fb] bg-[linear-gradient(135deg,#f8fbff_0%,#eef4ff_54%,#f7faff_100%)] px-6 py-6 text-left shadow-[0_22px_60px_-48px_rgba(15,42,95,0.18)] sm:px-8">
        <Image
          src="/solutions/ai-crew/whitepaper-background.svg"
          alt=""
          fill
          className="pointer-events-none object-cover opacity-100"
          sizes="980px"
        />
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">{children}</div>
      </div>
    </RevealOnScroll>
  );
}

export function AICrewLostWhitepaperContent({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AICrewLostWhitepaperContent")} className="max-w-[630px]">{children}</div>;
}

export function AICrewLostWhitepaperEyebrow({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AICrewLostWhitepaperEyebrow")} className="inline-flex rounded-full border border-[#C9D8F5] bg-white/90 px-4 py-2 text-[12px] font-semibold tracking-[0.12em] text-[#163A7A] shadow-[0_14px_36px_-24px_rgba(15,42,95,0.28)]">{children}</div>;
}

export function AICrewLostWhitepaperTitle({ children }: { children: ReactNode }) {
  return <h3 {...componentNameDebugProps("AICrewLostWhitepaperTitle")} className="mt-4 text-[24px] font-semibold leading-[1.35] tracking-[-0.03em] text-white sm:text-[28px]">{children}</h3>;
}

export function AICrewLostWhitepaperBody({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AICrewLostWhitepaperBody")} className="mt-3 text-[14px] leading-7 text-white/82">{children}</p>;
}

export function AICrewLostWhitepaperAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a {...componentNameDebugProps("AICrewLostWhitepaperAction")}
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#C9D8F5] bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF4FF_100%)] px-5 py-3 text-base font-semibold text-[#163A7A] shadow-[0_18px_40px_-30px_rgba(15,42,95,0.34)] transition hover:border-[#B7CCEF] hover:bg-[linear-gradient(180deg,#FAFCFF_0%,#E8F0FF_100%)] whitespace-nowrap"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}
