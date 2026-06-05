import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export function AIDashiWhitepaperSection({ children }: { children: ReactNode }) {
  return <section {...componentNameDebugProps("AIDashiWhitepaperSection")} className="mx-auto max-w-[1920px] bg-[#f8fafc] px-6 py-20 lg:px-10 lg:py-24">{children}</section>;
}

export function AIDashiWhitepaperShell({ children }: { children: ReactNode }) {
  return (
    <div {...componentNameDebugProps("AIDashiWhitepaperShell")} className="mx-auto max-w-[1120px]">
      <div className="rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(255,255,255,0.98)_100%)] px-6 py-8 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.14)] lg:px-8 lg:py-10">
        <div className="flex flex-col items-center gap-10">{children}</div>
      </div>
    </div>
  );
}

export function AIDashiWhitepaperIntro({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll {...componentNameDebugProps("AIDashiWhitepaperIntro")} variant="up" className="w-full max-w-[860px] text-center">
      {children}
    </RevealOnScroll>
  );
}

export function AIDashiWhitepaperEyebrow({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AIDashiWhitepaperEyebrow")} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">{children}</p>;
}

export function AIDashiWhitepaperTitle({ children }: { children: ReactNode }) {
  return <h2 {...componentNameDebugProps("AIDashiWhitepaperTitle")} className="mt-2 text-[24px] font-semibold leading-[1.3] tracking-[-0.03em] text-slate-950 sm:text-[30px]">{children}</h2>;
}

export function AIDashiWhitepaperBody({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AIDashiWhitepaperBody")} className="mx-auto mt-4 max-w-[760px] text-left text-base leading-7 text-slate-500">{children}</p>;
}

export function AIDashiWhitepaperCard({ href, children }: { href: string; children: ReactNode }) {
  return (
    <RevealOnScroll {...componentNameDebugProps("AIDashiWhitepaperCard")} variant="up" delayMs={120} className="w-full max-w-[980px]">
      <Link href={href} className="group grid overflow-hidden rounded-[1.8rem] border border-black/6 bg-white shadow-[0_22px_56px_-44px_rgba(15,23,42,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-md md:grid-cols-[280px_minmax(0,1fr)]">
        {children}
      </Link>
    </RevealOnScroll>
  );
}

export function AIDashiWhitepaperCover({ src, alt }: { src: string; alt: string }) {
  return (
    <div {...componentNameDebugProps("AIDashiWhitepaperCover")} className="relative min-h-[260px] bg-[#f5f7fb] p-6 md:min-h-full">
      <Image src={src} alt={alt} fill className="object-contain p-6" sizes="(min-width: 768px) 280px, 100vw" />
    </div>
  );
}

export function AIDashiWhitepaperCardBodyLayout({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AIDashiWhitepaperCardBodyLayout")} className="flex flex-col justify-between gap-5 px-6 py-6 md:px-8 md:py-8">{children}</div>;
}

export function AIDashiWhitepaperTags({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AIDashiWhitepaperTags")} className="flex flex-wrap gap-2">{children}</div>;
}

export function AIDashiWhitepaperTag({ children }: { children: ReactNode }) {
  return <span {...componentNameDebugProps("AIDashiWhitepaperTag")} className="inline-flex rounded-full bg-[#eef2f7] px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#2f3a49]">{children}</span>;
}

export function AIDashiWhitepaperCardTitle({ children }: { children: ReactNode }) {
  return <h3 {...componentNameDebugProps("AIDashiWhitepaperCardTitle")} className="mt-5 text-[24px] font-semibold leading-[1.4] tracking-[-0.03em] text-slate-950">{children}</h3>;
}

export function AIDashiWhitepaperCardDescription({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AIDashiWhitepaperCardDescription")} className="mt-4 text-[15px] leading-7 text-slate-600">{children}</p>;
}

export function AIDashiWhitepaperAction({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AIDashiWhitepaperAction")} className="inline-flex items-center gap-2 text-sm font-semibold text-[#ED602E] transition group-hover:gap-2.5">{children}</div>;
}
