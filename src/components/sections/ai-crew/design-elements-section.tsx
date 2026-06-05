import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export function AICrewDesignElementsSection({ children }: { children: ReactNode }) {
  return (
    <section {...componentNameDebugProps("AICrewDesignElementsSection")} id="design-elements" className="mx-auto max-w-[1920px] bg-[#f6f8fb] px-6 py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1120px]">{children}</div>
    </section>
  );
}

export function AICrewDesignElementsTitle({ children }: { children: ReactNode }) {
  return (
    <h2 {...componentNameDebugProps("AICrewDesignElementsTitle")} className="mx-auto max-w-[800px] text-center text-[30px] font-semibold leading-[1.2] tracking-[-0.04em] text-[#101828] sm:text-[42px] sm:leading-[1.2] [&_strong]:bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_48%,#2563EB_78%,#93C5FD_100%)] [&_strong]:bg-clip-text [&_strong]:font-inherit [&_strong]:text-transparent [&_strong]:[animation:heroAccentGlow_3.2s_ease-in-out_infinite] motion-reduce:[&_strong]:animate-none">
      {children}
    </h2>
  );
}

export function AICrewDesignElementsGrid({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AICrewDesignElementsGrid")} className="mt-10 grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-5">{children}</div>;
}

export function AICrewDesignElementCard({ children, label }: { children: ReactNode; label: ReactNode }) {
  return (
    <article {...componentNameDebugProps("AICrewDesignElementCard")} className="flex h-full min-h-[212px] flex-col rounded-[1.35rem] border border-black/6 bg-white px-5 py-5 shadow-[0_18px_40px_-36px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#eef2f7] text-[#2f3a49]">
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#98a2b3]">{label}</p>
      </div>
      <div className="mt-4 flex flex-1 flex-col">{children}</div>
    </article>
  );
}

export function AICrewDesignElementHeading({ children }: { children: ReactNode }) {
  return <h3 {...componentNameDebugProps("AICrewDesignElementHeading")} className="text-[18px] font-semibold leading-[1.45] tracking-[-0.02em] text-[#101828]">{children}</h3>;
}

export function AICrewDesignElementBody({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AICrewDesignElementBody")} className="mt-2 text-[14px] leading-6 text-[#667085]">{children}</div>;
}
