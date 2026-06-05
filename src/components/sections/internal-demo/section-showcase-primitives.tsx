import type { ReactNode } from "react";
import { componentNameDebugProps } from "@/lib/component-name-debug";

type SectionShowcaseSectionProps = {
  children: ReactNode;
  bordered?: boolean;
  compactBottom?: boolean;
};

export function SectionShowcaseSection({ children, bordered = false, compactBottom = false }: SectionShowcaseSectionProps) {
  const paddingClass = compactBottom ? "pb-8 pt-20 lg:pb-10 lg:pt-24" : bordered ? "py-18" : "pb-18";

  return (
    <section {...componentNameDebugProps("SectionShowcaseSection")} className={`${bordered ? "border-t border-slate-200 " : ""}px-6 ${paddingClass} sm:px-10 lg:px-16`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionShowcaseIntro({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("SectionShowcaseIntro")} className="mb-8 max-w-3xl">{children}</div>;
}

export function SectionShowcaseEyebrow({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <p {...componentNameDebugProps("SectionShowcaseEyebrow")} className={`text-sm font-semibold uppercase text-slate-500 ${wide ? "tracking-[0.24em]" : "tracking-[0.18em]"}`}>
      {children}
    </p>
  );
}

export function SectionShowcaseTitle({ children, level = 2 }: { children: ReactNode; level?: 1 | 2 | 3 }) {
  if (level === 1) {
    return <h1 {...componentNameDebugProps("SectionShowcaseTitle")} className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{children}</h1>;
  }

  if (level === 3) {
    return <h3 {...componentNameDebugProps("SectionShowcaseTitle")} className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{children}</h3>;
  }

  return <h2 {...componentNameDebugProps("SectionShowcaseTitle")} className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{children}</h2>;
}

export function SectionShowcaseBody({ children, lead = false }: { children: ReactNode; lead?: boolean }) {
  if (lead) {
    return <p {...componentNameDebugProps("SectionShowcaseBody")} className="mt-6 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">{children}</p>;
  }

  return <p {...componentNameDebugProps("SectionShowcaseBody")} className="mt-4 text-[15px] leading-7 text-slate-600">{children}</p>;
}

export function SectionShowcaseNotice({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("SectionShowcaseNotice")} className="mt-6 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">{children}</div>;
}

export function SectionShowcaseCardGrid({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("SectionShowcaseCardGrid")} className="grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">{children}</div>;
}

export function SectionShowcaseCard({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return (
    <article {...componentNameDebugProps("SectionShowcaseCard")} className={`rounded-[28px] border border-slate-200 ${muted ? "bg-slate-50" : "bg-white"} p-6 shadow-sm sm:p-8`}>
      {children}
    </article>
  );
}

export function SectionShowcaseCardHeader({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("SectionShowcaseCardHeader")} className="mb-8 max-w-2xl">{children}</div>;
}

export function SectionShowcaseSplitHeader({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("SectionShowcaseSplitHeader")} className="flex items-start justify-between gap-6">{children}</div>;
}

export function SectionShowcaseAvatarFrame({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("SectionShowcaseAvatarFrame")} className="shrink-0 rounded-[24px] bg-white p-4 shadow-sm">{children}</div>;
}

export function SectionShowcaseAvatarSwatches({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("SectionShowcaseAvatarSwatches")} className="mt-8 grid grid-cols-2 gap-4 rounded-[22px] bg-white p-5">{children}</div>;
}

export function SectionShowcaseAvatarSwatch({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <div {...componentNameDebugProps("SectionShowcaseAvatarSwatch")} className={`flex min-h-36 items-center justify-center rounded-[18px] ${dark ? "bg-slate-900" : "bg-slate-100"}`}>{children}</div>;
}
