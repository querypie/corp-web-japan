import Image from "next/image";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PlatformContentSection, PlatformPageShell } from "@/components/sections/platform/page-primitives";

type ClassNameProps = {
  className?: string;
};

export function AipUsageBasedLlmPageShell({ children }: { children: ReactNode }) {
  return <PlatformPageShell>{children}</PlatformPageShell>;
}

export function AipUsageBasedLlmHeroSection({ children }: { children: ReactNode }) {
  return (
    <PlatformContentSection className="pb-[120px] pt-[134px] lg:pt-[144px]" contentWidthClassName="max-w-[1200px]">
      {children}
    </PlatformContentSection>
  );
}

export function AipUsageBasedLlmHeroTitle({ children }: { children: ReactNode }) {
  return <h1 className="mx-auto max-w-[800px] text-center text-[48px] font-normal leading-[56px] text-[#24292F] lg:text-[60px] lg:leading-[72px]">{children}</h1>;
}

export function AipUsageBasedLlmHeroDescription({ children }: { children: ReactNode }) {
  return <p className="mx-auto mt-[20px] max-w-[1000px] text-center text-[18px] font-light leading-[28px] text-[#57606A]">{children}</p>;
}

export function AipUsageBasedLlmHeroFootnote({ children }: { children: ReactNode }) {
  return <small className="text-[10px] font-light leading-[28px] tracking-[0.36px] text-[#57606A]">{children}</small>;
}

export function AipUsageBasedLlmHeroImage() {
  return (
    <section className="mx-auto mt-[80px] flex max-w-[1200px] justify-center">
      <Image
        src="/solutions/aip/usage-based-llm/hero.svg"
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
  return <section className={cn(muted ? "bg-[#F6F8FA]" : "bg-white")}>{children}</section>;
}

export function AipUsageBasedLlmFeatureRow({ reverse = false, children }: { reverse?: boolean; children: ReactNode }) {
  return (
    <PlatformContentSection
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
  return <div className={cn("flex w-full max-w-full flex-col gap-[20px]", className)}>{children}</div>;
}

export function AipUsageBasedLlmFeatureTitle({ children }: { children: ReactNode }) {
  return <h4 className="text-[32px] font-medium leading-[42px] text-slate-950 max-[480px]:text-[20px] max-[480px]:leading-[28px]">{children}</h4>;
}

export function AipUsageBasedLlmFeatureBody({ children }: { children: ReactNode }) {
  return <p className="text-[16px] font-light leading-[26px] text-[#57606A]">{children}</p>;
}

export function AipUsageBasedLlmFeatureImage({ src, alt, width, height, className = "" }: { src: string; alt: string; width: number; height: number } & ClassNameProps) {
  const style = { "--usage-feature-image-width": `${width}px` } as CSSProperties;

  return (
    <div
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
    <PlatformContentSection className="py-[160px]" contentWidthClassName="max-w-[1200px]">
      {children}
    </PlatformContentSection>
  );
}

export function AipUsageBasedLlmComparisonTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-center text-[52px] font-normal leading-[62px] text-slate-950">{children}</h2>;
}

export function AipUsageBasedLlmComparisonImage() {
  return (
    <div className="mt-[80px] flex justify-center">
      <Image
        src="/solutions/aip/usage-based-llm/platform-comparison.svg"
        alt="Platform Comparison"
        width={1200}
        height={840}
        unoptimized
        className="h-auto w-full"
      />
    </div>
  );
}

export function AipUsageBasedLlmCtaDescription({ children }: { children: ReactNode }) {
  return <p className="mt-[19px] text-[16px] font-light leading-[26px] tracking-[0.36px] text-[#24292F]">{children}</p>;
}

export function AipUsageBasedLlmCtaButtonWrap({ children }: { children: ReactNode }) {
  return <div className="mt-[38px] flex justify-center">{children}</div>;
}

export function AipUsageBasedLlmLineBreak() {
  return <br className="hidden sm:block" />;
}

export type AipUsageBasedLlmImageProps = ComponentPropsWithoutRef<typeof Image>;
