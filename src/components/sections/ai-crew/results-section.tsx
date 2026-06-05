import type { ReactNode } from "react";
import { BriefcaseBusiness, type LucideIcon } from "lucide-react";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { componentNameDebugProps } from "@/lib/component-name-debug";

const aiCrewAccentTextClass =
  "bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_48%,#2563EB_78%,#93C5FD_100%)] bg-clip-text text-transparent [animation:heroAccentGlow_3.2s_ease-in-out_infinite] motion-reduce:animate-none";

export function AICrewResultsSection({ children }: { children: ReactNode }) {
  return (
    <section {...componentNameDebugProps("AICrewResultsSection")} id="results" className="mx-auto max-w-[1920px] bg-[#f6f8fb] px-6 py-20 lg:px-10">
      {children}
    </section>
  );
}

export function AICrewResultsIntro({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AICrewResultsIntro")} className="mx-auto max-w-[1280px] text-center">{children}</div>;
}

export function AICrewResultsTitle({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll {...componentNameDebugProps("AICrewResultsTitle")}>
      <h2 className="text-[34px] font-semibold leading-[1.24] tracking-[-0.03em] text-slate-950 sm:text-[42px] sm:leading-[54px] sm:tracking-[-0.04em] xl:whitespace-nowrap">
        {children}
      </h2>
    </RevealOnScroll>
  );
}

export function AICrewResultsHighlight({ children }: { children: ReactNode }) {
  return <span {...componentNameDebugProps("AICrewResultsHighlight")} className={aiCrewAccentTextClass}>{children}</span>;
}

export function AICrewResultsBody({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll {...componentNameDebugProps("AICrewResultsBody")} delayMs={80}>
      <p className="mx-auto mt-5 max-w-[1280px] text-center text-[15px] leading-7 text-slate-500 xl:whitespace-nowrap">
        {children}
      </p>
    </RevealOnScroll>
  );
}

export function AICrewResultsCards({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AICrewResultsCards")} className="mx-auto mt-12 grid max-w-[1120px] gap-4 md:grid-cols-2 xl:grid-cols-4">{children}</div>;
}

export function AICrewResultsCard({
  children,
  icon: Icon,
  delayMs = 0,
}: {
  children: ReactNode;
  icon?: LucideIcon;
  delayMs?: number;
}) {
  const CardIcon = Icon ?? BriefcaseBusiness;

  return (
    <RevealOnScroll {...componentNameDebugProps("AICrewResultsCard")} className="h-full" delayMs={delayMs}>
      <article className="flex h-full flex-col rounded-[1.8rem] border border-black/8 bg-white px-7 py-7 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-md">
        <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#eef2f7] text-[#2f3a49]">
          <CardIcon className="h-5 w-5" />
        </div>
        {children}
      </article>
    </RevealOnScroll>
  );
}

export function AICrewResultsCardBody({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AICrewResultsCardBody")} className="mt-5 flex-1 text-[14px] leading-7 tracking-[-0.01em] text-slate-700">{children}</p>;
}

export function AICrewResultsCardMeta({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AICrewResultsCardMeta")} className="mt-6 flex items-center gap-3 pt-1">{children}</div>;
}

export function AICrewResultsCardBrand({ children }: { children: ReactNode }) {
  return (
    <div {...componentNameDebugProps("AICrewResultsCardBrand")} className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#f9f9fb] text-[11px] font-semibold text-slate-700">
      {children}
    </div>
  );
}

export function AICrewResultsCardIdentity({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AICrewResultsCardIdentity")} className="text-left">{children}</div>;
}

export function AICrewResultsCardName({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AICrewResultsCardName")} className="whitespace-nowrap text-[14px] font-medium tracking-[-0.02em] text-slate-900">{children}</p>;
}

export function AICrewResultsCardCompany({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AICrewResultsCardCompany")} className="whitespace-nowrap text-[11px] leading-5 tracking-[-0.01em] text-slate-500">{children}</p>;
}

export function AICrewResultsPricing({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll {...componentNameDebugProps("AICrewResultsPricing")}
      className="mx-auto mt-16 max-w-[1120px] rounded-[2rem] border border-black/6 bg-white p-8 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]"
      variant="up"
    >
      {children}
    </RevealOnScroll>
  );
}

export function AICrewResultsPricingHeader({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AICrewResultsPricingHeader")} className="max-w-none">{children}</div>;
}

export function AICrewResultsPricingIcon({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AICrewResultsPricingIcon")} className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#eef2f7] text-[#2f3a49]">{children}</div>;
}

export function AICrewResultsPricingTitle({ children }: { children: ReactNode }) {
  return <h3 {...componentNameDebugProps("AICrewResultsPricingTitle")} className="mt-5 text-[30px] font-semibold leading-[1.35] tracking-[-0.03em] text-slate-950">{children}</h3>;
}

export function AICrewResultsPricingBody({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AICrewResultsPricingBody")} className="mt-5 space-y-1 text-base leading-7 text-slate-600">{children}</div>;
}

export function AICrewResultsPricingBodyLine({ children, nowrap = false }: { children: ReactNode; nowrap?: boolean }) {
  return <p {...componentNameDebugProps("AICrewResultsPricingBodyLine")} className={nowrap ? "xl:whitespace-nowrap" : ""}>{children}</p>;
}

export function AICrewResultsPricingGrid({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AICrewResultsPricingGrid")} className="mt-8 grid gap-4 md:grid-cols-2">{children}</div>;
}

export function AICrewResultsPricingCard({ children }: { children: ReactNode }) {
  return <article {...componentNameDebugProps("AICrewResultsPricingCard")} className="rounded-[1.5rem] border border-black/6 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-md">{children}</article>;
}

export function AICrewResultsPricingCardTitle({ children }: { children: ReactNode }) {
  return <h4 {...componentNameDebugProps("AICrewResultsPricingCardTitle")} className="text-[20px] font-semibold tracking-[-0.03em] text-slate-950">{children}</h4>;
}

export function AICrewResultsPricingCardBody({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AICrewResultsPricingCardBody")} className="mt-3 text-sm leading-7 text-slate-600">{children}</p>;
}
