import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { companyBodyTextClassName } from "@/components/ui/text-tokens";

type CompanyPageSectionProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  contentWidthClassName?: string;
};

export function CompanyPageSection({
  children,
  className,
  contentClassName,
  contentWidthClassName = "max-w-[1200px]",
}: CompanyPageSectionProps) {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-[1920px] bg-white px-[30px] pb-[96px] pt-[100px] lg:pb-[120px] lg:pt-[130px]",
        className,
      )}
    >
      <div className={cn("mx-auto w-full", contentWidthClassName, contentClassName)}>{children}</div>
    </section>
  );
}

type CompanyPageIntroProps = {
  children: ReactNode;
  className?: string;
};

export function CompanyPageIntro({ children, className }: CompanyPageIntroProps) {
  return <div className={cn("flex flex-col gap-[50px] text-left", className)}>{children}</div>;
}

type CompanyPageTitleProps = {
  children: ReactNode;
  className?: string;
};

export function CompanyPageTitle({ children, className }: CompanyPageTitleProps) {
  return (
    <h1 className={cn("text-[40px] font-medium leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-[48px] lg:text-[52px]", className)}>
      {children}
    </h1>
  );
}

type CompanyPageLeadProps = {
  children: ReactNode;
  className?: string;
};

export function CompanyPageLead({ children, className }: CompanyPageLeadProps) {
  return <div className={cn(companyBodyTextClassName, className)}>{children}</div>;
}

type CompanyPageBodyLayoutProps = {
  children: ReactNode;
  columns?: 1 | 2;
  layoutPreset?: "single" | "equal" | "about-us";
  className?: string;
};

const bodyLayoutClassNames = {
  single: "flex w-full flex-col",
  equal: "grid w-full items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14",
  "about-us": "grid w-full items-start gap-16 lg:grid-cols-[504px_640px] lg:gap-14",
} satisfies Record<NonNullable<CompanyPageBodyLayoutProps["layoutPreset"]>, string>;

export function CompanyPageBodyLayout({
  children,
  columns = 1,
  layoutPreset = columns === 2 ? "equal" : "single",
  className,
}: CompanyPageBodyLayoutProps) {
  return <div className={cn(bodyLayoutClassNames[layoutPreset], className)}>{children}</div>;
}
