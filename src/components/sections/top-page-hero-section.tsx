import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingPill } from "@/components/sections/marketing-section-primitives";
import { topPageHero } from "@/content/top-page";

type TopPageHero = typeof topPageHero;

type TopPageHeroSectionProps = {
  hero: TopPageHero;
  heroTitleFirst: string;
  heroTitleRest: string;
};

export function TopPageHeroSection({ hero, heroTitleFirst, heroTitleRest }: TopPageHeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
      <TopPageHeroBackground hero={hero} />

      <div className="relative mx-auto flex min-h-[760px] w-full max-w-[1260px] flex-col justify-between px-[30px] py-10 lg:py-12">
        <TopPageHeroProofPills items={hero.proofPills} />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,668px)_1fr] lg:items-start">
          <TopPageHeroPanel>
            <TopPageHeroEyebrow>{hero.tagline}</TopPageHeroEyebrow>
            <TopPageHeroHeadline firstLine={heroTitleFirst} secondLine={heroTitleRest} />
            <TopPageHeroSubcopy>{hero.subcopy}</TopPageHeroSubcopy>
            <TopPageHeroBody>{hero.body}</TopPageHeroBody>
            <TopPageHeroActions
              primaryHref={hero.primaryCta.href}
              primaryLabel={hero.primaryCta.label}
              secondaryHref={hero.secondaryCta.href}
              secondaryLabel={hero.secondaryCta.label}
            />
          </TopPageHeroPanel>

          <div className="relative hidden min-h-[520px] lg:block">
            <div className="absolute inset-0" />
          </div>
        </div>
      </div>
    </section>
  );
}

type TopPageHeroBackgroundProps = {
  hero: TopPageHero;
};

function TopPageHeroBackground({ hero }: TopPageHeroBackgroundProps) {
  return (
    <>
      <Image
        src={hero.image.src}
        alt={hero.image.alt}
        fill
        priority
        className="object-cover object-[58%_center]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.88)_0%,rgba(2,6,23,0.72)_34%,rgba(2,6,23,0.36)_60%,rgba(2,6,23,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.22),transparent_24%),radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.14),transparent_18%),linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(15,23,42,0.16)_62%,rgba(15,23,42,0.56)_100%)]" />
    </>
  );
}

type TopPageHeroProofPillsProps = {
  items: readonly string[];
};

function TopPageHeroProofPills({ items }: TopPageHeroProofPillsProps) {
  return (
    <div className="flex justify-start">
      <div className="hidden flex-wrap items-center gap-1.5 lg:flex">
        {items.map((item) => (
          <MarketingPill
            key={item}
            className="border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white/88 backdrop-blur"
          >
            {item}
          </MarketingPill>
        ))}
      </div>
    </div>
  );
}

type TopPageHeroPanelProps = {
  children: ReactNode;
};

function TopPageHeroPanel({ children }: TopPageHeroPanelProps) {
  return (
    <div className="-mt-3 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.05)_100%)] p-7 text-white shadow-[0_32px_120px_-60px_rgba(15,23,42,0.75)] backdrop-blur-xl sm:p-8 lg:-mt-14 lg:p-10">
      {children}
    </div>
  );
}

type TopPageHeroEyebrowProps = {
  children: ReactNode;
};

function TopPageHeroEyebrow({ children }: TopPageHeroEyebrowProps) {
  return <p className="hero-copy-enter text-[11px] font-semibold uppercase tracking-[0.18em] text-white/58">{children}</p>;
}

type TopPageHeroHeadlineProps = {
  firstLine: string;
  secondLine: string;
};

function TopPageHeroHeadline({ firstLine, secondLine }: TopPageHeroHeadlineProps) {
  return (
    <h1 className="mt-2 text-[42px] font-semibold leading-[1.07] tracking-[-0.065em] sm:max-w-[14ch] sm:text-[58px] lg:max-w-[15ch] lg:text-[72px]">
      <span className="hero-title-fragment block">{firstLine}</span>
      {secondLine ? <span className="hero-title-fragment hero-title-fragment-delay block">{secondLine}</span> : null}
    </h1>
  );
}

type TopPageHeroSubcopyProps = {
  children: ReactNode;
};

function TopPageHeroSubcopy({ children }: TopPageHeroSubcopyProps) {
  return (
    <p className="hero-copy-enter hero-copy-enter-1 mt-4 bg-gradient-to-r from-[#dce6ff] via-[#bfd0ff] to-[#9fb6ff] bg-clip-text text-[18px] font-semibold leading-[1.5] tracking-[0.12em] text-transparent drop-shadow-[0_10px_30px_rgba(15,23,42,0.32)] sm:text-[22px] sm:tracking-[0.14em] lg:text-[24px]">
      {children}
    </p>
  );
}

type TopPageHeroBodyProps = {
  children: ReactNode;
};

function TopPageHeroBody({ children }: TopPageHeroBodyProps) {
  return <p className="hero-copy-enter hero-copy-enter-2 mt-5 max-w-[628px] text-[15px] leading-[2.05] text-white/84 lg:text-base">{children}</p>;
}

type TopPageHeroActionsProps = {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

function TopPageHeroActions({ primaryHref, primaryLabel, secondaryHref, secondaryLabel }: TopPageHeroActionsProps) {
  return (
    <div className="hero-copy-enter hero-copy-enter-3 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
      <TopPageHeroPrimaryAction href={primaryHref}>{primaryLabel}</TopPageHeroPrimaryAction>
      <TopPageHeroSecondaryAction href={secondaryHref}>{secondaryLabel}</TopPageHeroSecondaryAction>
    </div>
  );
}

type TopPageHeroActionLinkProps = {
  href: string;
  children: ReactNode;
};

function TopPageHeroPrimaryAction({ href, children }: TopPageHeroActionLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function TopPageHeroSecondaryAction({ href, children }: TopPageHeroActionLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/16"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
