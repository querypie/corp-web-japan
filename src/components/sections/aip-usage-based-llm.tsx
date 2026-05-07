import Image from "next/image";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ClassNameProps = {
  className?: string;
};

export function AipUsageBasedLlmPageShell({ children }: { children: ReactNode }) {
  return <main className="relative overflow-x-hidden bg-white text-slate-950">{children}</main>;
}

export function AipUsageBasedLlmHeroSection({ children }: { children: ReactNode }) {
  return <section className="mx-auto max-w-[1200px] px-6 pb-[187px] pt-[76px] lg:px-0">{children}</section>;
}

export function AipUsageBasedLlmHeroTitle({ children }: { children: ReactNode }) {
  return <h1 className="mx-auto max-w-[738px] text-center text-[60px] font-normal leading-[67.5px] text-slate-950">{children}</h1>;
}

export function AipUsageBasedLlmHeroDescription({ children }: { children: ReactNode }) {
  return <p className="mx-auto mt-[18px] max-w-[895px] text-center text-[18px] font-light leading-[28px] text-[#57606A]">{children}</p>;
}

export function AipUsageBasedLlmHeroImage() {
  return (
    <section className="mx-auto mt-[75px] flex max-w-[1200px] justify-center">
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
    <div
      className={cn(
        "mx-auto grid max-w-[1200px] items-center gap-x-[75px] px-6 py-[75px] lg:min-h-[458px] lg:grid-cols-[1fr_1fr] lg:px-0",
        reverse && "lg:[&>*:first-child]:col-start-2 lg:[&>*:last-child]:row-start-1",
      )}
    >
      {children}
    </div>
  );
}

export function AipUsageBasedLlmFeatureCopy({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <div className={cn("max-w-[501px]", className)}>{children}</div>;
}

export function AipUsageBasedLlmFeatureTitle({ children }: { children: ReactNode }) {
  return <h4 className="text-[32px] font-medium leading-[42px] text-slate-950">{children}</h4>;
}

export function AipUsageBasedLlmFeatureBody({ children }: { children: ReactNode }) {
  return <p className="mt-[18px] text-[16px] font-light leading-[26px] text-[#57606A]">{children}</p>;
}

export function AipUsageBasedLlmFeatureImage({ src, alt, width, height, className = "" }: { src: string; alt: string; width: number; height: number } & ClassNameProps) {
  return (
    <div className={cn("flex justify-center", className)}>
      <Image src={src} alt={alt} width={width} height={height} unoptimized className="h-auto max-w-full" />
    </div>
  );
}

export function AipUsageBasedLlmComparisonSection({ children }: { children: ReactNode }) {
  return <section className="mx-auto max-w-[1200px] px-6 pb-[120px] pt-[94px] lg:px-0">{children}</section>;
}

export function AipUsageBasedLlmComparisonTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-center text-[52px] font-normal leading-[58.125px] text-slate-950">{children}</h2>;
}

export function AipUsageBasedLlmComparisonImage() {
  return (
    <div className="mt-[75px] flex justify-center">
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
