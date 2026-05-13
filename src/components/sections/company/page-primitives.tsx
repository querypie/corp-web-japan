import type { ReactNode } from "react";
import { companyBodyTextClassName } from "@/components/ui/text-tokens";

type CompanyPageSectionPadding = "default" | "compactHero";

type CompanyPageSectionProps = {
  children: ReactNode;
  padding?: CompanyPageSectionPadding;
};

const companyPageSectionPaddingClassNames = {
  default: "pb-[50px] pt-[100px] lg:pb-[78px] lg:pt-[120px]",
  compactHero: "pb-[50px] pt-[100px] lg:pb-[84px] lg:pt-[120px]",
} satisfies Record<CompanyPageSectionPadding, string>;

export function CompanyPageSection({ children, padding = "default" }: CompanyPageSectionProps) {
  return (
    <section className={`mx-auto w-full max-w-[1920px] bg-white px-[30px] ${companyPageSectionPaddingClassNames[padding]}`}>
      <div className="mx-auto w-full max-w-[1200px]">{children}</div>
    </section>
  );
}

type CompanyPageIntroProps = {
  children: ReactNode;
};

export function CompanyPageIntro({ children }: CompanyPageIntroProps) {
  return <div className="flex flex-col gap-10 pt-[10px] text-left lg:gap-[50px] lg:pt-0">{children}</div>;
}

type CompanyPageTitleProps = {
  children: ReactNode;
};

export function CompanyPageTitle({ children }: CompanyPageTitleProps) {
  return <h1 className="text-[40px] font-medium leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-[48px] lg:text-[52px]">{children}</h1>;
}

type CompanyPageLeadProps = {
  children: ReactNode;
};

export function CompanyPageLead({ children }: CompanyPageLeadProps) {
  return <div className={companyBodyTextClassName}>{children}</div>;
}

type CompanyPageLayoutPreset = "single" | "equalColumns" | "aboutUsHero";

type CompanyPageLayoutProps = {
  children: ReactNode;
  preset?: CompanyPageLayoutPreset;
};

const companyPageLayoutClassNames = {
  single: "flex w-full flex-col",
  equalColumns: "grid w-full items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14",
  aboutUsHero: "grid w-full items-start gap-16 lg:grid-cols-[504px_640px] lg:gap-14",
} satisfies Record<CompanyPageLayoutPreset, string>;

export function CompanyPageLayout({ children, preset = "single" }: CompanyPageLayoutProps) {
  return <div className={companyPageLayoutClassNames[preset]}>{children}</div>;
}
