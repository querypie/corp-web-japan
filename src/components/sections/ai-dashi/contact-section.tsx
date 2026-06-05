import type { ReactNode } from "react";
import Link from "next/link";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export function AIDashiContactSection({ children }: { children: ReactNode }) {
  return <section {...componentNameDebugProps("AIDashiContactSection")} id="contact" className="w-full bg-[#f9f9fb] px-6 py-16 lg:px-10 lg:py-20">{children}</section>;
}

export function AIDashiContactShell({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AIDashiContactShell")} className="mx-auto flex max-w-[920px] flex-col items-center gap-8">{children}</div>;
}

export function AIDashiContactIntro({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll {...componentNameDebugProps("AIDashiContactIntro")} variant="up" className="flex flex-col items-center gap-4 text-center">
      {children}
    </RevealOnScroll>
  );
}

export function AIDashiContactTitle({ children }: { children: ReactNode }) {
  return <h2 {...componentNameDebugProps("AIDashiContactTitle")} className="text-[36px] font-semibold leading-[1.14] tracking-[-0.05em] text-[#15181d] sm:text-[46px] sm:leading-[58px]">{children}</h2>;
}

export function AIDashiContactHighlight({ children }: { children: ReactNode }) {
  return <span {...componentNameDebugProps("AIDashiContactHighlight")} className="bg-gradient-to-r from-[#E45A2A] via-[#ED602E] to-[#F08A3C] bg-clip-text text-transparent">{children}</span>;
}

export function AIDashiContactBody({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AIDashiContactBody")} className="max-w-[780px] text-base leading-7 text-slate-500">{children}</p>;
}

export function AIDashiContactActions({ children }: { children: ReactNode }) {
  return <RevealOnScroll {...componentNameDebugProps("AIDashiContactActions")} variant="up" delayMs={120} className="flex flex-col items-center gap-4">{children}</RevealOnScroll>;
}

export function AIDashiContactPrimaryAction({ href, children }: { href: string; children: ReactNode }) {
  return <Link {...componentNameDebugProps("AIDashiContactPrimaryAction")} href={href} className="inline-flex max-w-full items-center justify-center rounded-[8px] bg-[#15181d] px-4 py-2.5 text-center text-sm font-semibold leading-5 text-white transition hover:bg-[#0f1216] sm:whitespace-nowrap sm:text-base">{children}</Link>;
}
