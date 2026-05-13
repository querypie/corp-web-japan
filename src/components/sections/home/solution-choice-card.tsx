"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import Link from "next/link";
import { ArrowRight, Blocks, Users } from "lucide-react";
import {
  MarketingIconFrame,
  MarketingPill,
  MarketingSurface,
} from "@/components/sections/home/primitives";
import { cn } from "@/lib/utils";

type Tone = "crew" | "dashi";

type ToneContextValue = { tone: Tone };
const ToneContext = createContext<ToneContextValue | null>(null);

function useTone() {
  const value = useContext(ToneContext);
  if (!value) {
    throw new Error("SolutionChoiceCard subcomponents must be used within SolutionChoiceCard");
  }
  return value.tone;
}

function toneCardClass(tone: Tone) {
  return tone === "crew"
    ? "border-[#C9D8F5] bg-[linear-gradient(180deg,rgba(239,244,255,0.98)_0%,rgba(248,251,255,0.97)_100%)]"
    : "border-[#F3D2C1] bg-[linear-gradient(180deg,rgba(255,245,239,0.98)_0%,rgba(255,250,247,0.97)_100%)]";
}

function toneBadgeClass(tone: Tone) {
  return tone === "crew"
    ? "bg-[#174EA6] text-white shadow-[0_12px_26px_-18px_rgba(23,78,166,0.45)]"
    : "bg-[#ED602E] text-white shadow-[0_12px_26px_-18px_rgba(237,96,46,0.45)]";
}

function toneIconFrameClass(tone: Tone) {
  return tone === "crew"
    ? "border border-[#C9D8F5] bg-[#EEF4FF] text-[#174EA6] shadow-[0_12px_28px_-24px_rgba(23,78,166,0.28)]"
    : "border border-[#F0C8B7] bg-[#FFE6DA] text-[#B85733] shadow-[0_14px_30px_-22px_rgba(184,87,51,0.35)]";
}

function toneTitleClass(tone: Tone) {
  return tone === "crew" ? "text-[#163A7A]" : "text-[#B85733]";
}

function toneActionClass(tone: Tone) {
  return tone === "crew" ? "text-[#163A7A] hover:text-[#2563EB]" : "text-[#8c4a2f] hover:text-[#ED602E]";
}

type SolutionChoiceCardProps = {
  href: string;
  tone: Tone;
  children: ReactNode;
};

export function SolutionChoiceCard({ href, tone, children }: SolutionChoiceCardProps) {
  return (
    <ToneContext.Provider value={{ tone }}>
      <MarketingSurface
        as={Link}
        href={href}
        className={cn(
          "flex h-full flex-col rounded-[2rem] p-7 shadow-[0_22px_60px_-48px_rgba(15,23,42,0.18)] focus:outline-none focus:ring-2 focus:ring-[#2f3a49]/15 sm:p-8",
          toneCardClass(tone),
        )}
      >
        {children}
      </MarketingSurface>
    </ToneContext.Provider>
  );
}

type SolutionChoiceHeaderProps = {
  children: ReactNode;
};

export function SolutionChoiceHeader({ children }: SolutionChoiceHeaderProps) {
  const tone = useTone();
  const Icon = tone === "crew" ? Users : Blocks;

  return (
    <div className="flex items-start justify-between gap-4">
      {children}
      <MarketingIconFrame className={cn("flex-none shadow-[0_16px_34px_-24px_rgba(15,23,42,0.35)]", toneIconFrameClass(tone))}>
        <Icon className="h-5 w-5" />
      </MarketingIconFrame>
    </div>
  );
}

export function SolutionChoiceBadge({ children }: { children: ReactNode }) {
  const tone = useTone();
  return <MarketingPill className={cn("w-fit px-3 py-1 tracking-[0.12em]", toneBadgeClass(tone))}>{children}</MarketingPill>;
}

export function SolutionChoiceTitle({ children }: { children: ReactNode }) {
  const tone = useTone();
  return <h3 className={cn("text-[24px] font-semibold leading-[1.35] tracking-[-0.04em] sm:text-[28px]", toneTitleClass(tone))}>{children}</h3>;
}

export function SolutionChoiceSubtitle({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-[12px] font-semibold tracking-[0.12em] text-slate-500 sm:text-[13px]">{children}</p>;
}

export function SolutionChoiceDescription({ children }: { children: ReactNode }) {
  return <p className="mt-5 flex-1 text-[15px] leading-7 text-slate-600">{children}</p>;
}

export function SolutionChoiceAction({ children }: { children: ReactNode }) {
  const tone = useTone();
  return (
    <span className={cn("mt-8 inline-flex items-center gap-2 text-sm font-semibold transition", toneActionClass(tone))}>
      {children}
      <ArrowRight className="h-4 w-4" />
    </span>
  );
}
