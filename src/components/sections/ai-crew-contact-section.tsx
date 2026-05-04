import type { ReactNode } from "react";
import Link from "next/link";

export function AICrewContactSection({ children }: { children: ReactNode }) {
  return (
    <section id="contact" className="w-full bg-white px-6 py-16 text-center lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1120px] space-y-6">{children}</div>
    </section>
  );
}

export function AICrewContactShell({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[2rem] bg-[#f9f9fb] px-8 py-10 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
      <div className="mx-auto flex max-w-[720px] flex-col items-center gap-6">{children}</div>
    </div>
  );
}

export function AICrewContactIntro({ children }: { children: ReactNode }) {
  return <div className="flex w-full flex-col items-center gap-4">{children}</div>;
}

export function AICrewContactTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-center text-[34px] font-semibold leading-[1.16] tracking-[-0.04em] text-[#101828] sm:text-[42px] sm:leading-[50px]">
      {children}
    </h2>
  );
}

export function AICrewContactBody({ children }: { children: ReactNode }) {
  return <div className="w-full whitespace-pre-line text-center text-base leading-7 text-slate-500">{children}</div>;
}

export function AICrewContactActionGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-[17px]">{children}</div>;
}

export function AICrewContactPrimaryAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] px-5 py-3 text-base font-semibold text-white shadow-[0_22px_46px_-24px_rgba(23,78,166,0.72)] transition hover:brightness-[1.06] hover:shadow-[0_26px_58px_-26px_rgba(23,78,166,0.82)]"
    >
      {children}
    </Link>
  );
}

export function AICrewContactSecondaryAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#C9D8F5] bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF4FF_100%)] px-5 py-3 text-base font-semibold text-[#163A7A] shadow-[0_18px_40px_-30px_rgba(15,42,95,0.34)] transition hover:border-[#B7CCEF] hover:bg-[linear-gradient(180deg,#FAFCFF_0%,#E8F0FF_100%)]"
    >
      {children}
    </Link>
  );
}

export function AICrewDashiPromo({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#d7dee7] bg-[linear-gradient(135deg,#f8fafc_0%,#eef4fb_48%,#e8eef7_100%)] px-8 py-8 text-left shadow-[0_28px_90px_-50px_rgba(15,23,42,0.18)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(47,58,73,0.10),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(71,84,103,0.10),transparent_30%)]" />
      <div className="absolute right-[-40px] top-[-40px] h-56 w-56 rounded-full border border-white/60 bg-white/25 blur-[2px]" />
      <div className="absolute bottom-[-70px] right-[18%] h-44 w-44 rounded-full border border-white/40 bg-white/20" />
      <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.04)_100%)] lg:block" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">{children}</div>
    </div>
  );
}

export function AICrewDashiPromoContent({ children }: { children: ReactNode }) {
  return <div className="max-w-[980px]">{children}</div>;
}

export function AICrewDashiPromoEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex rounded-full border border-[#d0d5dd] bg-white/80 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-[#475467]">
      {children}
    </div>
  );
}

export function AICrewDashiPromoIcon({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#2f3a49] text-white shadow-[0_16px_32px_-20px_rgba(15,23,42,0.45)]">
      {children}
    </div>
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

export function AICrewDashiPromoVisualOrb({ children }: { children?: ReactNode }) {
  return (
    <div className="absolute bottom-[10px] left-[8px] flex h-[72px] w-[72px] items-center justify-center rounded-[20px] border border-white/70 bg-white/72 text-[#2f3a49] shadow-[0_20px_40px_-24px_rgba(15,23,42,0.18)] backdrop-blur-sm">
      {children}
    </div>
  );
}
