import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingPill } from "@/components/sections/marketing-section-primitives";

export function HeroSection({ imageSrc, imageAlt, children }: { imageSrc: string; imageAlt: string; children: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
      <Image src={imageSrc} alt={imageAlt} fill priority className="object-cover object-[58%_center]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.88)_0%,rgba(2,6,23,0.72)_34%,rgba(2,6,23,0.36)_60%,rgba(2,6,23,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.22),transparent_24%),radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.14),transparent_18%),linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(15,23,42,0.16)_62%,rgba(15,23,42,0.56)_100%)]" />
      <div className="relative mx-auto flex min-h-[760px] w-full max-w-[1260px] flex-col justify-between px-[30px] py-10 lg:py-12">
        {children}
      </div>
    </section>
  );
}

export function HeroProofPillGroup({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-start">
      <div className="hidden flex-wrap items-center gap-1.5 lg:flex">{children}</div>
    </div>
  );
}

export function HeroProofPill({ children }: { children: ReactNode }) {
  return (
    <MarketingPill className="border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white/88 backdrop-blur">
      {children}
    </MarketingPill>
  );
}

export function HeroPanel({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,668px)_1fr] lg:items-start">
      <div className="-mt-3 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.05)_100%)] p-7 text-white shadow-[0_32px_120px_-60px_rgba(15,23,42,0.75)] backdrop-blur-xl sm:p-8 lg:-mt-14 lg:p-10">
        {children}
      </div>
      <div className="relative hidden min-h-[520px] lg:block">
        <div className="absolute inset-0" />
      </div>
    </div>
  );
}

export function HeroEyebrow({ children }: { children: ReactNode }) {
  return <p className="hero-copy-enter text-[11px] font-semibold uppercase tracking-[0.18em] text-white/58">{children}</p>;
}

export function HeroTitle({ children }: { children: ReactNode }) {
  return <h1 className="mt-2 text-[42px] font-semibold leading-[1.07] tracking-[-0.065em] sm:max-w-[14ch] sm:text-[58px] lg:max-w-[15ch] lg:text-[72px]">{children}</h1>;
}

export function HeroTitleLine({ children, delayed = false }: { children: ReactNode; delayed?: boolean }) {
  return <span className={`hero-title-fragment ${delayed ? "hero-title-fragment-delay" : ""} block`}>{children}</span>;
}

export function HeroSubcopy({ children }: { children: ReactNode }) {
  return (
    <p className="hero-copy-enter hero-copy-enter-1 mt-4 bg-gradient-to-r from-[#dce6ff] via-[#bfd0ff] to-[#9fb6ff] bg-clip-text text-[18px] font-semibold leading-[1.5] tracking-[0.12em] text-transparent drop-shadow-[0_10px_30px_rgba(15,23,42,0.32)] sm:text-[22px] sm:tracking-[0.14em] lg:text-[24px]">
      {children}
    </p>
  );
}

export function HeroBody({ children }: { children: ReactNode }) {
  return <p className="hero-copy-enter hero-copy-enter-2 mt-5 max-w-[628px] text-[15px] leading-[2.05] text-white/84 lg:text-base">{children}</p>;
}

export function HeroActionGroup({ children }: { children: ReactNode }) {
  return <div className="hero-copy-enter hero-copy-enter-3 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">{children}</div>;
}

export function HeroPrimaryAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function HeroSecondaryAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/16">
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
