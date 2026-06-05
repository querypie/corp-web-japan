import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export function AIDashiHeroSection({ children }: { children: ReactNode }) {
  return (
    <section {...componentNameDebugProps("AIDashiHeroSection")} className="relative mx-auto max-w-[1920px] overflow-hidden bg-[#eceff3] px-6 py-14 lg:px-10 lg:py-[84px]">
      {children}
    </section>
  );
}

export function AIDashiHeroBackground({ children }: { children: ReactNode }) {
  return <div className="absolute inset-0">{children}</div>;
}

export function AIDashiHeroBackgroundImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-full w-full">
      <Image src={src} alt={alt} fill priority className="object-cover object-[50%_18%]" />
    </div>
  );
}

export function AIDashiHeroBackdrop() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,18,34,0.4)_0%,rgba(10,18,34,0.22)_30%,rgba(10,18,34,0.08)_58%,rgba(10,18,34,0.0)_100%)]" />
      <div className="absolute left-[8%] top-[12%] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(237,96,46,0.18)_0%,rgba(237,96,46,0.06)_38%,rgba(237,96,46,0)_72%)] blur-2xl" />
      <div className="absolute left-[22%] top-[24%] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_34%,rgba(255,255,255,0)_72%)] blur-3xl" />
    </>
  );
}

export function AIDashiHeroShell({ children }: { children: ReactNode }) {
  return <div className="relative mx-auto flex max-w-[1260px] items-center justify-start px-[30px] text-left">{children}</div>;
}

export function AIDashiHeroPanel({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full max-w-[790px] flex-col items-start gap-5 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,34,0.12)_0%,rgba(10,18,34,0.28)_100%)] px-6 py-7 shadow-[0_28px_72px_-46px_rgba(15,23,42,0.65)] backdrop-blur-[10px] sm:px-8 sm:py-8 lg:gap-5 lg:px-9 lg:py-10">
      {children}
    </div>
  );
}

export function AIDashiHeroEyebrow({ children }: { children: ReactNode }) {
  return <p className="hero-copy-enter inline-flex rounded-full border border-white/18 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/78 backdrop-blur">{children}</p>;
}

export function AIDashiHeroTitle({ children }: { children: ReactNode }) {
  return <h1 className="max-w-[760px] text-[34px] font-semibold leading-[1.12] tracking-[-0.04em] text-white md:text-[40px] md:leading-[1.12] lg:text-[54px] lg:leading-[1.16] lg:tracking-[-1.02px]">{children}</h1>;
}

export function AIDashiHeroTitleLine({ children, delayMs }: { children: ReactNode; delayMs?: number }) {
  return (
    <span className="hero-title-fragment block" style={delayMs ? ({ animationDelay: `${delayMs}ms` } as CSSProperties) : undefined}>
      {children}
    </span>
  );
}

export function AIDashiHeroTitleAccent({ children, delayMs }: { children: ReactNode; delayMs?: number }) {
  return (
    <span
      className="hero-title-fragment hero-highlight-sweep block bg-gradient-to-r from-[#ffffff] via-[#edf3ff] to-[#b8c9ff] bg-clip-text text-transparent drop-shadow-[0_12px_28px_rgba(159,182,255,0.22)]"
      style={delayMs ? ({ animationDelay: `${delayMs}ms` } as CSSProperties) : undefined}
    >
      {children}
    </span>
  );
}

export function AIDashiHeroLead({ children }: { children: ReactNode }) {
  return <p className="hero-copy-enter hero-copy-enter-1 max-w-[540px] text-[15px] leading-8 text-white/84 md:max-w-[620px] md:text-[16px] lg:max-w-[660px]">{children}</p>;
}

export function AIDashiHeroActions({ children }: { children: ReactNode }) {
  return <div className="hero-copy-enter hero-copy-enter-2 flex flex-col gap-3 sm:flex-row sm:items-center">{children}</div>;
}

export function AIDashiHeroPrimaryAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[10px] border border-white bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_36px_-24px_rgba(15,23,42,0.42)] transition hover:bg-slate-100">
      {children}
    </Link>
  );
}

export function AIDashiHeroSecondaryAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[10px] border border-white/24 bg-white/6 px-5 py-3 text-sm font-semibold text-white/92 backdrop-blur transition hover:bg-white/10">
      {children}
    </Link>
  );
}
