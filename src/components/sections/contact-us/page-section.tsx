import type { ReactNode } from "react";
import { companyBodyTextClassName } from "@/components/ui/text-tokens";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export function ContactUsChecklist({ children }: { children: ReactNode }) {
  return <ul {...componentNameDebugProps("ContactUsChecklist")} className={`list-disc space-y-3 pl-5 marker:text-slate-600 ${companyBodyTextClassName}`}>{children}</ul>;
}

export function ContactUsChecklistItem({ children }: { children: ReactNode }) {
  return <li {...componentNameDebugProps("ContactUsChecklistItem")}>{children}</li>;
}

export function ContactUsFormPanel({ children }: { children: ReactNode }) {
  return (
    <div {...componentNameDebugProps("ContactUsFormPanel")} className="rounded-[12px] border border-[#E5E7EB] bg-white px-6 py-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] lg:mt-[10px] lg:px-10 lg:py-9">
      {children}
    </div>
  );
}
