import type { ReactNode } from "react";

export function ContactUsSection({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-20 pt-[112px] lg:pb-[120px] lg:pt-[144px]">
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
        {children}
      </div>
    </section>
  );
}

export function ContactUsIntro({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

export function ContactUsTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="mb-6 text-[34px] font-medium leading-[1.25] tracking-[-0.03em] text-slate-950 lg:text-[44px]">
      {children}
    </h1>
  );
}

export function ContactUsLead({ children }: { children: ReactNode }) {
  return <p className="max-w-[680px] text-base leading-7 text-slate-500">{children}</p>;
}

export function ContactUsChecklist({ children }: { children: ReactNode }) {
  return <ul className="mt-8 grid gap-3 text-sm leading-6 text-slate-500">{children}</ul>;
}

export function ContactUsChecklistItem({ children }: { children: ReactNode }) {
  return <li>• {children}</li>;
}

export function ContactUsFormPanel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white px-6 py-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] lg:px-10 lg:py-9">
      {children}
    </div>
  );
}
