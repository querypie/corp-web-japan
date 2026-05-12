import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

const aiCrewAccentTextClass =
  "bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_48%,#2563EB_78%,#93C5FD_100%)] bg-clip-text text-transparent [animation:heroAccentGlow_3.2s_ease-in-out_infinite] motion-reduce:animate-none";

const aiCrewPrimaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] px-5 py-3 text-base font-semibold text-white shadow-[0_22px_46px_-24px_rgba(23,78,166,0.72)] transition hover:brightness-[1.06] hover:shadow-[0_26px_58px_-26px_rgba(23,78,166,0.82)]";

const aiCrewSecondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#C9D8F5] bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF4FF_100%)] px-5 py-3 text-base font-semibold text-[#163A7A] shadow-[0_18px_40px_-30px_rgba(15,42,95,0.34)] transition hover:border-[#B7CCEF] hover:bg-[linear-gradient(180deg,#FAFCFF_0%,#E8F0FF_100%)]";

export function AICrewHeroSection({ children }: { children: ReactNode }) {
  return <section id="hero" className="mx-auto max-w-[1260px] px-6 py-14 lg:px-0 lg:py-[72px]">{children}</section>;
}

export function AICrewHeroShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 mx-auto overflow-hidden rounded-[2.2rem] border border-[#D6E2F6] bg-[linear-gradient(135deg,#FBFDFF_0%,#EEF4FF_46%,#F8FBFF_100%)] px-6 py-8 shadow-[0_28px_90px_-56px_rgba(15,42,95,0.22)] sm:px-8 lg:px-[30px] lg:py-10">
      <div className="absolute left-[-80px] top-[-72px] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.22)_0%,rgba(96,165,250,0)_72%)]" />
      <div className="absolute bottom-[-110px] right-[-30px] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.16)_0%,rgba(37,99,235,0)_72%)]" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(500px,590px)] lg:items-center lg:gap-7">{children}</div>
    </div>
  );
}

export function AICrewHeroContent({ children }: { children: ReactNode }) {
  return <div className="max-w-[620px] lg:pl-4">{children}</div>;
}

export function AICrewHeroEyebrow({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll>
      <div className="inline-flex rounded-full border border-[#C9D8F5] bg-white/90 px-4 py-2 text-[12px] font-semibold tracking-[0.12em] text-[#163A7A] shadow-[0_14px_36px_-24px_rgba(15,42,95,0.28)] backdrop-blur-sm">
        {children}
      </div>
    </RevealOnScroll>
  );
}

export function AICrewHeroTitle({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll delayMs={40}>
      <h1 className="mt-5 text-left text-[42px] font-bold leading-[1.08] tracking-[-0.05em] text-slate-950 sm:text-[52px] lg:text-[66px] lg:leading-[74px]">
        {children}
      </h1>
    </RevealOnScroll>
  );
}

export function AICrewHeroTitleLine({
  children,
  accent = false,
  delayMs = 0,
}: {
  children: ReactNode;
  accent?: boolean;
  delayMs?: number;
}) {
  return (
    <span
      className={`block [animation:heroHeadlineRise_760ms_ease-out_both] motion-reduce:animate-none ${accent ? aiCrewAccentTextClass : "text-slate-950"}`}
      style={{ animationDelay: `${delayMs}ms` } as CSSProperties}
    >
      {children}
    </span>
  );
}

export function AICrewHeroSubcopy({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll delayMs={70}>
      <p className="mt-4 text-left">
        <span className="inline-block bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] bg-clip-text text-[18px] font-bold leading-[1.55] tracking-[0.06em] text-transparent sm:text-[20px]">
          {children}
        </span>
      </p>
    </RevealOnScroll>
  );
}

export function AICrewHeroBody({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll delayMs={90}>
      <div className="mt-5 max-w-[35rem] text-left text-[15px] leading-[1.95] tracking-[-0.01em] text-slate-600 sm:text-base">
        {children}
      </div>
    </RevealOnScroll>
  );
}

export function AICrewHeroActions({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll delayMs={140}>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">{children}</div>
    </RevealOnScroll>
  );
}

export function AICrewHeroPrimaryAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={aiCrewPrimaryButtonClass}>
      {children}
    </Link>
  );
}

export function AICrewHeroSecondaryAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={aiCrewSecondaryButtonClass}>
      {children}
    </Link>
  );
}

export function AICrewHeroVisual({ src, alt }: { src: string; alt: string }) {
  return (
    <RevealOnScroll variant="scale" delayMs={160}>
      <div className="relative">
        <figure className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[#D7E5FB] shadow-[0_34px_96px_-48px_rgba(15,42,95,0.30)]">
          <div className="absolute inset-0 z-10 bg-[linear-gradient(135deg,rgba(15,42,95,0.14)_0%,rgba(15,42,95,0.02)_38%,rgba(15,42,95,0.18)_100%)]" />
          <div className="relative aspect-[16/9.35]">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 560px, 100vw"
              priority
            />
          </div>
        </figure>
      </div>
    </RevealOnScroll>
  );
}