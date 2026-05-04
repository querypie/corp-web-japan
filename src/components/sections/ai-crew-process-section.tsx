import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

export function AICrewProcessSection({ children }: { children: ReactNode }) {
  return (
    <section id="process" className="mx-auto max-w-[1920px] px-6 py-20 lg:px-10">
      {children}
    </section>
  );
}

export function AICrewProcessIntro({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[1120px] text-center">{children}</div>;
}

export function AICrewProcessTitle({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll>
      <h2 className="text-[34px] font-semibold leading-[1.24] tracking-[-0.03em] text-slate-950 sm:text-[42px] sm:leading-[54px] sm:tracking-[-0.04em]">
        {children}
      </h2>
    </RevealOnScroll>
  );
}

export function AICrewProcessBody({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll delayMs={80}>
      <p className="mx-auto mt-5 w-full max-w-[900px] whitespace-pre-line text-left text-base leading-7 text-slate-500 lg:pl-[30px]">
        {children}
      </p>
    </RevealOnScroll>
  );
}

export function AICrewProcessGrid({ children }: { children: ReactNode }) {
  return <div className="mx-auto mt-12 grid max-w-[1120px] gap-4 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function AICrewProcessStepCard({
  delayMs,
  children,
}: {
  delayMs: number;
  children: ReactNode;
}) {
  return (
    <RevealOnScroll className="h-full" delayMs={delayMs}>
      <article className="relative flex h-full min-h-[288px] flex-col overflow-hidden rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-md lg:p-7">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-white/0 via-white/70 to-white/0" />
        {children}
      </article>
    </RevealOnScroll>
  );
}

export function AICrewProcessStepHeader({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-between gap-3">{children}</div>;
}

export function AICrewProcessStepBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#2f3a49] px-3 py-1.5 text-[12px] font-semibold tracking-[0.08em] text-white">
      {children}
    </span>
  );
}

export function AICrewProcessStepIcon({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#f2f4f7] text-[#344054]">
      {children}
    </div>
  );
}

export function AICrewProcessStepTitle({ children }: { children: ReactNode }) {
  return <h3 className="mt-6 text-[20px] font-semibold leading-[1.45] tracking-[-0.02em] text-slate-800">{children}</h3>;
}

export function AICrewProcessStepBody({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-[15px] leading-[1.95] text-slate-600">{children}</p>;
}

export function AICrewProcessCtaCard({
  delayMs,
  children,
}: {
  delayMs: number;
  children: ReactNode;
}) {
  return (
    <RevealOnScroll className="h-full" delayMs={delayMs}>
      <article className="relative flex h-full min-h-[288px] flex-col overflow-hidden rounded-[1.8rem] border border-[#d7e4fb] bg-[linear-gradient(135deg,#f8fbff_0%,#eef4ff_52%,#f7faff_100%)] p-6 shadow-[0_24px_70px_-50px_rgba(15,42,95,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-md lg:p-7">
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgba(37,99,235,0)_0%,rgba(37,99,235,0.45)_50%,rgba(37,99,235,0)_100%)]" />
        {children}
      </article>
    </RevealOnScroll>
  );
}

export function AICrewProcessCtaHeader({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-3">{children}</div>;
}

export function AICrewProcessCtaIcon({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] text-white shadow-[0_18px_36px_-24px_rgba(23,78,166,0.65)]">
      {children}
    </div>
  );
}

export function AICrewProcessCtaBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-[#C9D8F5] bg-white/90 px-4 py-2 text-[12px] font-semibold tracking-[0.12em] text-[#163A7A] shadow-[0_14px_36px_-24px_rgba(15,42,95,0.28)]">
      {children}
    </span>
  );
}

export function AICrewProcessCtaLead({ children }: { children: ReactNode }) {
  return <p className="mt-6 bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] bg-clip-text text-[16px] font-semibold leading-6 tracking-[-0.01em] text-transparent">{children}</p>;
}

export function AICrewProcessActionGroup({ children }: { children: ReactNode }) {
  return <div className="mt-auto flex flex-col gap-3 pt-5">{children}</div>;
}

export function AICrewProcessPrimaryAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] px-5 py-3 text-base font-semibold text-white shadow-[0_22px_46px_-24px_rgba(23,78,166,0.72)] transition hover:brightness-[1.06] hover:shadow-[0_26px_58px_-26px_rgba(23,78,166,0.82)]"
    >
      {children}
    </Link>
  );
}

export function AICrewProcessSecondaryAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#C9D8F5] bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF4FF_100%)] px-5 py-3 text-base font-semibold text-[#163A7A] shadow-[0_18px_40px_-30px_rgba(15,42,95,0.34)] transition hover:border-[#B7CCEF] hover:bg-[linear-gradient(180deg,#FAFCFF_0%,#E8F0FF_100%)]"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
