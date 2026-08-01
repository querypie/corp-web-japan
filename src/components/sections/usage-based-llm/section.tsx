import Image from "next/image";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PlatformContentSection, PlatformPageShell } from "@/components/sections/platform/page-primitives";
import { componentNameDebugProps } from "@/lib/component-name-debug";

type ClassNameProps = {
  className?: string;
};

export function AipUsageBasedLlmPageShell({ children }: { children: ReactNode }) {
  return <PlatformPageShell {...componentNameDebugProps("AipUsageBasedLlmPageShell")}>{children}</PlatformPageShell>;
}

export function AipUsageBasedLlmHeroSection({ children }: { children: ReactNode }) {
  return (
    <PlatformContentSection {...componentNameDebugProps("AipUsageBasedLlmHeroSection")} className="pb-[120px] pt-[134px] lg:pt-[144px]" contentWidthClassName="max-w-[1200px]">
      {children}
    </PlatformContentSection>
  );
}

export function AipUsageBasedLlmHeroTitle({ children }: { children: ReactNode }) {
  return <h1 {...componentNameDebugProps("AipUsageBasedLlmHeroTitle")} className="w-full text-left text-[36px] font-normal leading-[46px] tracking-[-0.04em] text-[#24292F] sm:text-[40px] sm:leading-[50px] lg:text-[44px] lg:leading-[56px]">{children}</h1>;
}

export function AipUsageBasedLlmHeroDescription({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AipUsageBasedLlmHeroDescription")} className="mt-5 max-w-[600px] text-left text-[16px] font-light leading-[26px] tracking-[0.36px] text-[#57606A]">{children}</p>;
}

export function AipUsageBasedLlmHeroFootnote({ children }: { children: ReactNode }) {
  return <small {...componentNameDebugProps("AipUsageBasedLlmHeroFootnote")} className="text-[10px] font-light leading-[28px] tracking-[0.36px] text-[#57606A]">{children}</small>;
}

export function AipUsageBasedLlmHeroImage() {
  return (
    <section {...componentNameDebugProps("AipUsageBasedLlmHeroImage")} className="mx-auto mt-[80px] flex max-w-[1200px] justify-center">
      <Image
        src="https://www.querypie.com/assets/products/aip/usage-based-llm/usage-based-llm.svg"
        alt="Usage-based LLM Deployment"
        width={1200}
        height={682}
        priority
        unoptimized
        className="h-auto w-full"
      />
    </section>
  );
}

export function AipUsageBasedLlmFeatureBand({ muted = false, children }: { muted?: boolean; children: ReactNode }) {
  return <section {...componentNameDebugProps("AipUsageBasedLlmFeatureBand")} className={cn(muted ? "bg-[#F6F8FA]" : "bg-white")}>{children}</section>;
}

export function AipUsageBasedLlmFeatureRow({ reverse = false, children }: { reverse?: boolean; children: ReactNode }) {
  return (
    <PlatformContentSection {...componentNameDebugProps("AipUsageBasedLlmFeatureRow")}
      as="div"
      className="py-[80px]"
      contentClassName={cn(
        "flex flex-col items-center justify-center gap-[60px] lg:gap-[80px]",
        reverse ? "lg:flex-row-reverse" : "lg:flex-row",
      )}
    >
      {children}
    </PlatformContentSection>
  );
}

export function AipUsageBasedLlmFeatureCopy({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <div {...componentNameDebugProps("AipUsageBasedLlmFeatureCopy")} className={cn("flex w-full max-w-full flex-col gap-[20px]", className)}>{children}</div>;
}

export function AipUsageBasedLlmFeatureTitle({ children }: { children: ReactNode }) {
  return <h4 {...componentNameDebugProps("AipUsageBasedLlmFeatureTitle")} className="text-[32px] font-medium leading-[42px] text-slate-950 max-[480px]:text-[20px] max-[480px]:leading-[28px]">{children}</h4>;
}

export function AipUsageBasedLlmFeatureBody({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AipUsageBasedLlmFeatureBody")} className="text-[16px] font-light leading-[26px] text-[#57606A]">{children}</p>;
}

export function AipUsageBasedLlmFeatureImage({ src, alt, width, height, className = "" }: { src: string; alt: string; width: number; height: number } & ClassNameProps) {
  const style = { "--usage-feature-image-width": `${width}px` } as CSSProperties;

  return (
    <div {...componentNameDebugProps("AipUsageBasedLlmFeatureImage")}
      className={cn(
        "w-full max-w-full overflow-hidden rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] lg:w-[var(--usage-feature-image-width)] lg:shadow-[0_8px_20px_rgba(0,0,0,0.15)]",
        className,
      )}
      style={style}
    >
      <Image src={src} alt={alt} width={width} height={height} unoptimized className="h-auto w-full" />
    </div>
  );
}

export function AipUsageBasedLlmComparisonSection({ children }: { children: ReactNode }) {
  return (
    <PlatformContentSection {...componentNameDebugProps("AipUsageBasedLlmComparisonSection")} className="bg-[#F6F8FA] py-[100px] lg:py-[120px]" contentWidthClassName="max-w-[1200px]">
      {children}
    </PlatformContentSection>
  );
}

export function AipUsageBasedLlmComparisonTitle({ children }: { children: ReactNode }) {
  return <h2 {...componentNameDebugProps("AipUsageBasedLlmComparisonTitle")} className="text-center text-[32px] font-normal leading-[40px] tracking-[-0.04em] text-slate-950 lg:text-[48px] lg:leading-[1.2]">{children}</h2>;
}

type ComparisonColumn = { label: string; featured?: boolean };
type ComparisonRow = { label: string; values: readonly ReactNode[] };

export function AipUsageBasedLlmComparisonTable({ columns, rows }: { columns: readonly ComparisonColumn[]; rows: readonly ComparisonRow[] }) {
  return (
    <div {...componentNameDebugProps("AipUsageBasedLlmComparisonTable")} className="mt-12 w-full overflow-x-auto">
      <div className="min-w-[1040px] overflow-hidden rounded-[20px] border border-[#D8DEE4] bg-white">
        <div className="grid grid-cols-[180px_repeat(5,minmax(0,1fr))] border-b border-[#D8DEE4] bg-[#F6F8FA] text-center text-[14px] font-medium leading-5 text-[#24292F]">
          <div className="px-5 py-5 text-left">比較項目</div>
          {columns.map((column) => <div key={column.label} className={cn("border-l border-[#D8DEE4] px-4 py-5", column.featured && "bg-[#0969DA] text-white")}>{column.label}</div>)}
        </div>
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[180px_repeat(5,minmax(0,1fr))] border-b border-[#D8DEE4] last:border-b-0">
            <div className="flex items-start bg-[#F6F8FA] px-5 py-5 text-[14px] font-medium leading-5 text-[#24292F]">{row.label}</div>
            {row.values.map((value, index) => <div key={`${row.label}-${columns[index]?.label ?? index}`} className={cn("border-l border-[#D8DEE4] px-4 py-5 text-[13px] font-light leading-5 text-[#57606A]", columns[index]?.featured && "bg-[#F4F8FF] text-[#24292F]")}>{value}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AipUsageBasedLlmCtaDescription({ children }: { children: ReactNode }) {
  return <p className="mt-[19px] text-[16px] font-light leading-[26px] tracking-[0.36px] text-[#24292F]">{children}</p>;
}

export function AipUsageBasedLlmCtaButtonWrap({ children }: { children: ReactNode }) {
  return <div className="mt-[38px] flex justify-center">{children}</div>;
}

export type AipUsageBasedLlmImageProps = ComponentPropsWithoutRef<typeof Image>;
