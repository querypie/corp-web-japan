import type { ReactNode } from "react";
import {
  Brain,
  Cable,
  ScanSearch,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

const aiCrewPlatformAccentTextClass =
  "bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_48%,#2563EB_78%,#93C5FD_100%)] bg-clip-text text-transparent [animation:heroAccentGlow_3.2s_ease-in-out_infinite] motion-reduce:animate-none";

const platformCardPositions = {
  top: "lg:left-1/2 lg:top-0 lg:-translate-x-1/2",
  right: "lg:right-[72px] lg:top-1/2 lg:-translate-y-1/2",
  bottom: "lg:left-1/2 lg:bottom-0 lg:-translate-x-1/2",
  left: "lg:left-[72px] lg:top-1/2 lg:-translate-y-1/2",
} as const;

const platformCardIcons = {
  brain: Brain,
  connect: Cable,
  knowledge: ScanSearch,
  governance: Shield,
} as const;

type AICrewPlatformSectionProps = {
  children: ReactNode;
};

type AICrewPlatformCardProps = {
  children: ReactNode;
  position: keyof typeof platformCardPositions;
};

type AICrewPlatformCardIconProps = {
  icon: keyof typeof platformCardIcons;
};

type AICrewPlatformCardTitleProps = {
  children: ReactNode;
  subtitle?: ReactNode;
};

export function AICrewPlatformSection({ children }: AICrewPlatformSectionProps) {
  return (
    <section id="platform" className="mx-auto max-w-[1920px] bg-[#f6f8fb] px-6 py-20 lg:px-10">
      {children}
    </section>
  );
}

export function AICrewPlatformHeader({ children }: AICrewPlatformSectionProps) {
  return <div className="mx-auto max-w-[1120px] text-center">{children}</div>;
}

export function AICrewPlatformTitle({ children }: AICrewPlatformSectionProps) {
  return (
    <RevealOnScroll>
      <h2 className="text-[34px] font-semibold leading-[1.24] tracking-[-0.03em] text-slate-950 sm:text-[42px] sm:leading-[54px] sm:tracking-[-0.04em]">
        {children}
      </h2>
    </RevealOnScroll>
  );
}

export function AICrewPlatformBody({ children }: AICrewPlatformSectionProps) {
  return (
    <RevealOnScroll delayMs={80}>
      <p className="mx-auto mt-5 w-full max-w-[760px] text-left text-base leading-7 text-slate-500">
        {children}
      </p>
    </RevealOnScroll>
  );
}

export function AICrewPlatformAccent({ children }: AICrewPlatformSectionProps) {
  return <span className={aiCrewPlatformAccentTextClass}>{children}</span>;
}

export function AICrewPlatformDiagram({ children }: AICrewPlatformSectionProps) {
  return (
    <RevealOnScroll className="mx-auto mt-12 max-w-[1120px]" variant="scale" delayMs={140}>
      <div className="relative overflow-hidden rounded-[2.4rem] border border-[#dbe5f4] bg-[linear-gradient(135deg,#ffffff_0%,#f7faff_48%,#eef4ff_100%)] p-5 shadow-[0_30px_90px_-58px_rgba(15,42,95,0.22)] sm:p-7 lg:h-[640px] lg:p-10">
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.13)_0%,rgba(37,99,235,0.07)_30%,rgba(37,99,235,0.025)_56%,rgba(37,99,235,0)_76%)] blur-[2px] lg:block" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2563EB]/10 lg:block" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2563EB]/8 lg:block" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.16)_0%,rgba(37,99,235,0.06)_52%,rgba(37,99,235,0)_76%)] lg:block" />

        <div className="relative z-10 grid gap-4 md:grid-cols-2 lg:block lg:h-full">{children}</div>
      </div>
    </RevealOnScroll>
  );
}

export function AICrewPlatformCore({ children }: AICrewPlatformSectionProps) {
  return (
    <div className="flex min-h-[210px] flex-col items-center justify-center rounded-[2rem] border border-[#c9d8f5]/80 bg-white/90 px-8 py-9 text-center shadow-[0_24px_70px_-50px_rgba(15,42,95,0.24)] backdrop-blur-sm md:col-span-2 lg:absolute lg:left-1/2 lg:top-1/2 lg:h-[218px] lg:w-[218px] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-full lg:px-6">
      {children}
    </div>
  );
}

export function AICrewPlatformCoreEyebrow({ children }: AICrewPlatformSectionProps) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B86B5]">
      {children}
    </p>
  );
}

export function AICrewPlatformCoreTitle({ children }: AICrewPlatformSectionProps) {
  return (
    <p className="mt-2 pb-1 bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] bg-clip-text text-[26px] font-bold leading-[1.18] tracking-[-0.04em] text-transparent">
      {children}
    </p>
  );
}

export function AICrewPlatformCoreBody({ children }: AICrewPlatformSectionProps) {
  return <p className="mt-2 text-[12px] font-medium leading-5 text-slate-600">{children}</p>;
}

export function AICrewPlatformCard({ children, position }: AICrewPlatformCardProps) {
  return (
    <article
      className={`rounded-[1.4rem] border border-black/6 bg-white/92 p-4 text-left shadow-[0_20px_54px_-48px_rgba(15,42,95,0.18)] backdrop-blur-sm lg:absolute lg:min-h-[146px] lg:w-[300px] ${platformCardPositions[position] ?? ""}`}
    >
      {children}
    </article>
  );
}

export function AICrewPlatformCardHeader({ children }: { children: ReactNode }) {
  return <div className="flex items-start gap-3">{children}</div>;
}

export function AICrewPlatformCardIcon({ icon }: AICrewPlatformCardIconProps) {
  const Icon = platformCardIcons[icon] ?? ShieldCheck;

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#eef2f7] text-[#2f3a49]">
      <Icon className="h-[18px] w-[18px]" />
    </div>
  );
}

export function AICrewPlatformCardText({ children }: { children: ReactNode }) {
  return <div className="min-w-0">{children}</div>;
}

export function AICrewPlatformCardTitle({ children, subtitle }: AICrewPlatformCardTitleProps) {
  return (
    <h3 className="flex min-w-0 items-end gap-1.5 tracking-[-0.03em] text-slate-900">
      <span className="text-[21px] font-semibold">{children}</span>
      {subtitle ? (
        <span className="pb-0.5 text-[12px] font-medium tracking-[-0.01em] text-slate-400">
          {subtitle}
        </span>
      ) : null}
    </h3>
  );
}

export function AICrewPlatformCardStat({ children }: AICrewPlatformSectionProps) {
  return (
    <div className="mt-1.5 inline-flex rounded-full bg-[#2f3a49] px-3 py-1 text-[11px] font-semibold text-white">
      {children}
    </div>
  );
}

export function AICrewPlatformCardBody({ children }: AICrewPlatformSectionProps) {
  return <div className="mt-2.5 space-y-1.5">{children}</div>;
}

export function AICrewPlatformCardBullet({ children }: AICrewPlatformSectionProps) {
  return (
    <p className="flex gap-2 text-[12px] font-medium leading-5 text-slate-700">
      <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
      <span>{children}</span>
    </p>
  );
}
