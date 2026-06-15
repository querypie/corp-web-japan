import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { componentNameDebugProps } from "@/lib/component-name-debug";

type NamedComponentProps = {
  componentName?: string;
};

export function As400CobolPageShell({
  children,
  debugProps,
  componentName = "As400CobolPageShell",
}: {
  children: ReactNode;
  debugProps?: ReturnType<typeof componentNameDebugProps>;
} & NamedComponentProps) {
  const resolvedDebugProps =
    debugProps ??
    (componentName === "As400CobolPageShell"
      ? componentNameDebugProps("As400CobolPageShell")
      : componentNameDebugProps(componentName));

  return (
    <main
      {...resolvedDebugProps}
      className="relative overflow-x-hidden bg-white text-slate-950"
    >
      <SiteHeader />
      {children}
      <SiteFooter />
    </main>
  );
}

export function As400CobolHeroSection({
  children,
  visual,
}: {
  children: ReactNode;
  visual: ReactNode;
}) {
  return (
    <section
      {...componentNameDebugProps("As400CobolHeroSection")}
      className="px-6 pb-20 pt-[112px] lg:px-0 lg:pb-24 lg:pt-[136px]"
    >
      <div
        {...componentNameDebugProps("As400CobolHeroLayout")}
        className="mx-auto grid w-full max-w-[1120px] items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12"
      >
        {children}
        {visual}
      </div>
    </section>
  );
}

export function As400CobolHeroCopy({ children }: { children: ReactNode }) {
  return (
    <div {...componentNameDebugProps("As400CobolHeroCopy")} className="max-w-[620px]">
      {children}
    </div>
  );
}

export function As400CobolHeroEyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      {...componentNameDebugProps("As400CobolHeroEyebrow")}
      className="text-[13px] font-semibold uppercase leading-5 tracking-[0.12em] text-[#0f766e]"
    >
      {children}
    </p>
  );
}

export function As400CobolHeroTitle({ children }: { children: ReactNode }) {
  return (
    <h1
      {...componentNameDebugProps("As400CobolHeroTitle")}
      className="mt-4 text-[42px] font-semibold leading-[50px] tracking-normal text-slate-950 md:text-[56px] md:leading-[66px]"
    >
      {children}
    </h1>
  );
}

export function As400CobolHeroSubtitle({ children }: { children: ReactNode }) {
  return (
    <p
      {...componentNameDebugProps("As400CobolHeroSubtitle")}
      className="mt-5 text-[20px] font-semibold leading-8 text-slate-800"
    >
      {children}
    </p>
  );
}

export function As400CobolHeroDescription({ children }: { children: ReactNode }) {
  return (
    <p
      {...componentNameDebugProps("As400CobolHeroDescription")}
      className="mt-5 text-[16px] font-normal leading-8 text-slate-600"
    >
      {children}
    </p>
  );
}

export function As400CobolHeroActions({ children }: { children: ReactNode }) {
  return (
    <div {...componentNameDebugProps("As400CobolHeroActions")} className="mt-8">
      {children}
    </div>
  );
}

export function As400CobolBodyCopy({
  children,
  componentName = "As400CobolBodyCopy",
}: {
  children: ReactNode;
} & NamedComponentProps) {
  const debugProps =
    componentName === "As400CobolBodyCopy"
      ? componentNameDebugProps("As400CobolBodyCopy")
      : componentNameDebugProps(componentName);

  return (
    <div
      {...debugProps}
      className="mx-auto max-w-[860px] space-y-5 text-[16px] leading-8 text-slate-600"
    >
      {children}
    </div>
  );
}

export function As400CobolContactSection({ children }: { children: ReactNode }) {
  return (
    <section
      {...componentNameDebugProps("As400CobolContactSection")}
      className="bg-slate-50 px-6 py-20 text-center lg:px-0"
    >
      <div
        {...componentNameDebugProps("As400CobolContactContent")}
        className="mx-auto flex max-w-[880px] flex-col items-center"
      >
        {children}
      </div>
    </section>
  );
}

export function As400CobolContactEyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      {...componentNameDebugProps("As400CobolContactEyebrow")}
      className="text-[13px] font-semibold uppercase leading-5 tracking-[0.12em] text-[#0f766e]"
    >
      {children}
    </p>
  );
}

export function As400CobolContactTitle({ children }: { children: ReactNode }) {
  return (
    <h2
      {...componentNameDebugProps("As400CobolContactTitle")}
      className="mt-3 text-[34px] font-semibold leading-[44px] text-slate-950 md:text-[46px] md:leading-[56px]"
    >
      {children}
    </h2>
  );
}

export function As400CobolContactDescription({ children }: { children: ReactNode }) {
  return (
    <p
      {...componentNameDebugProps("As400CobolContactDescription")}
      className="mt-5 text-[16px] leading-8 text-slate-600"
    >
      {children}
    </p>
  );
}

export function As400CobolContactActions({ children }: { children: ReactNode }) {
  return (
    <div {...componentNameDebugProps("As400CobolContactActions")} className="mt-8">
      {children}
    </div>
  );
}
