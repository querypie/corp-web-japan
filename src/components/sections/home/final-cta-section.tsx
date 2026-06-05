import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export function FinalCtaSection({ children }: { children: ReactNode }) {
  return (
    <section {...componentNameDebugProps("FinalCtaSection")} id="contact" className="bg-[#0f172a] text-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">{children}</div>
    </section>
  );
}

export function FinalCtaShell({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("FinalCtaShell")} className="rounded-[2rem] border border-white/12 bg-white/5 px-6 py-8 shadow-[0_28px_100px_-60px_rgba(15,23,42,0.55)] backdrop-blur xl:px-10 xl:py-10">{children}</div>;
}

export function FinalCtaIntro({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("FinalCtaIntro")} className="mx-auto max-w-[880px] text-center">{children}</div>;
}

export function FinalCtaTitle({ children }: { children: ReactNode }) {
  return <RevealOnScroll {...componentNameDebugProps("FinalCtaTitle")} variant="up"><h2 className="text-[34px] font-semibold leading-[1.15] tracking-[-0.04em] sm:text-[46px]">{children}</h2></RevealOnScroll>;
}

export function FinalCtaBody({ children }: { children: ReactNode }) {
  return <RevealOnScroll {...componentNameDebugProps("FinalCtaBody")} variant="up" delayMs={120}><div className="mx-auto mt-5 max-w-[760px] text-sm leading-8 text-white/75 sm:text-[15px]">{children}</div></RevealOnScroll>;
}

export function FinalCtaActionGroup({ children }: { children: ReactNode }) {
  return <RevealOnScroll {...componentNameDebugProps("FinalCtaActionGroup")} variant="up" delayMs={220}><div id="download" className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:flex-wrap">{children}</div></RevealOnScroll>;
}

export function FinalCtaAction({ href, primary = false, children }: { href: string; primary?: boolean; children: ReactNode }) {
  return (
    <Link {...componentNameDebugProps("FinalCtaAction")} href={href} className={`flex min-h-[44px] w-full max-w-[220px] items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-center text-[13px] font-semibold transition sm:w-[220px] ${primary ? "border-white bg-white text-slate-950 hover:bg-slate-100" : "border-white/15 bg-white/5 text-white hover:bg-white/10"}`}>
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}