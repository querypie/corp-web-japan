import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  MarketingIconFrame,
  MarketingPill,
  MarketingSurface,
} from "@/components/sections/marketing-section-primitives";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { cn } from "@/lib/utils";

export function AICrewContactSection({ children }: { children: ReactNode }) {
  return (
    <section id="contact" className="w-full bg-white px-6 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1120px] space-y-6">{children}</div>
    </section>
  );
}

export function AICrewContactShell({ children }: { children: ReactNode }) {
  return (
    <MarketingSurface className="rounded-[2rem] bg-[#f9f9fb] px-8 py-10 text-center shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)] hover:translate-y-0 hover:shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
      <div className="mx-auto flex max-w-[720px] flex-col items-center gap-6">{children}</div>
    </MarketingSurface>
  );
}

export function AICrewContactIntro({ children }: { children: ReactNode }) {
  return <div className="flex w-full flex-col items-center gap-4">{children}</div>;
}

export function AICrewContactTitle({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll variant="up">
      <h2 className="text-center text-[34px] font-semibold leading-[1.16] tracking-[-0.04em] text-[#101828] sm:text-[42px] sm:leading-[50px]">
        {children}
      </h2>
    </RevealOnScroll>
  );
}

export function AICrewContactBody({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll variant="up" delayMs={120}>
      <div className="w-full space-y-1 text-center text-base leading-7 text-slate-500">{children}</div>
    </RevealOnScroll>
  );
}

export function AICrewContactActionGroup({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll variant="up" delayMs={220}>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-[17px]">{children}</div>
    </RevealOnScroll>
  );
}

export function AICrewContactAction({
  href,
  primary = false,
  children,
}: {
  href: string;
  primary?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[12px] px-5 py-3 text-base font-semibold transition",
        primary
          ? "bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] text-white shadow-[0_22px_46px_-24px_rgba(23,78,166,0.72)] hover:brightness-[1.06] hover:shadow-[0_26px_58px_-26px_rgba(23,78,166,0.82)]"
          : "border border-[#C9D8F5] bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF4FF_100%)] text-[#163A7A] shadow-[0_18px_40px_-30px_rgba(15,42,95,0.34)] hover:border-[#B7CCEF] hover:bg-[linear-gradient(180deg,#FAFCFF_0%,#E8F0FF_100%)]",
      )}
    >
      {children}
    </Link>
  );
}

export function AICrewDashiPromo({ children }: { children: ReactNode }) {
  return (
    <MarketingSurface className="relative overflow-hidden rounded-[2rem] border-[#d7dee7] bg-[linear-gradient(135deg,#f8fafc_0%,#eef4fb_48%,#e8eef7_100%)] px-8 py-8 text-left shadow-[0_28px_90px_-50px_rgba(15,23,42,0.18)] hover:translate-y-0 hover:shadow-[0_28px_90px_-50px_rgba(15,23,42,0.18)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(47,58,73,0.10),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(71,84,103,0.10),transparent_30%)]" />
      <div className="absolute right-[-40px] top-[-40px] h-56 w-56 rounded-full border border-white/60 bg-white/25 blur-[2px]" />
      <div className="absolute bottom-[-70px] right-[18%] h-44 w-44 rounded-full border border-white/40 bg-white/20" />
      <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.04)_100%)] lg:block" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">{children}</div>
    </MarketingSurface>
  );
}

export function AICrewDashiPromoContent({ children }: { children: ReactNode }) {
  return <div className="max-w-[980px]">{children}</div>;
}

export function AICrewDashiPromoEyebrow({ children }: { children: ReactNode }) {
  return (
    <MarketingPill className="bg-white/80 text-xs tracking-[0.12em] text-[#475467]">
      {children}
    </MarketingPill>
  );
}

export function AICrewDashiPromoIcon({ children }: { children: ReactNode }) {
  return (
    <MarketingIconFrame className="mt-5 h-12 w-12 bg-[#2f3a49] text-white shadow-[0_16px_32px_-20px_rgba(15,23,42,0.45)]">
      {children}
    </MarketingIconFrame>
  );
}

export function AICrewDashiPromoTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-5 text-[30px] font-semibold leading-[1.35] tracking-[-0.03em] text-[#101828] xl:whitespace-nowrap">
      {children}
    </h3>
  );
}

export function AICrewDashiPromoBody({ children }: { children: ReactNode }) {
  return <div className="mt-4 max-w-[980px] text-left text-sm leading-7 text-[#475467]">{children}</div>;
}

export function AICrewDashiPromoAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#d0d5dd] bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#2f3a49] shadow-[0_16px_32px_-24px_rgba(15,23,42,0.25)] transition hover:bg-white"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function AICrewDashiPromoVisual({ children }: { children: ReactNode }) {
  return <div className="relative hidden h-[240px] lg:block">{children}</div>;
}

export function AICrewDashiPromoPanel({ children }: { children: ReactNode }) {
  return (
    <div className="absolute right-0 top-0 w-[260px] rounded-[1.6rem] border border-white/70 bg-white/72 p-5 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.18)] backdrop-blur-sm">
      {children}
    </div>
  );
}

export function AICrewDashiPromoPanelHeader({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-between">{children}</div>;
}

export function AICrewDashiPromoPanelLabel({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#98a2b3]">{children}</p>;
}

export function AICrewDashiPromoPanelStatusDot() {
  return <div className="h-2.5 w-2.5 rounded-full bg-[#2563EB]" />;
}

export function AICrewDashiPromoPanelList({ children }: { children: ReactNode }) {
  return <div className="mt-4 grid gap-3">{children}</div>;
}

export function AICrewDashiPromoPanelItem({
  tone = "default",
  children,
}: {
  tone?: "default" | "dashed" | "primary";
  children: ReactNode;
}) {
  const className =
    tone === "primary"
      ? "rounded-[14px] bg-[#2f3a49] px-4 py-3 text-[13px] font-semibold text-white"
      : tone === "dashed"
        ? "rounded-[14px] border border-dashed border-[#cbd5e1] px-4 py-3 text-[12px] font-medium text-[#667085]"
        : "rounded-[14px] bg-[#f5f7fb] px-4 py-3 text-[13px] font-medium text-[#344054]";

  return <div className={className}>{children}</div>;
}

export function AICrewDashiPromoVisualOrb() {
  return (
    <div className="absolute bottom-[10px] left-[8px] flex h-[72px] w-[72px] items-center justify-center rounded-[20px] border border-white/70 bg-white/72 text-[#2f3a49] shadow-[0_20px_40px_-24px_rgba(15,23,42,0.18)] backdrop-blur-sm">
      <div className="h-8 w-8 rounded-full bg-[#2f3a49]" />
    </div>
  );
}
