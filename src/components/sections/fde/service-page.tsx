import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { PlatformContentSection, PlatformCtaSection, PlatformFeatureSection, PlatformPageShell } from "@/components/sections/platform/page-primitives";
import { componentNameDebugProps } from "@/lib/component-name-debug";

const headingBodyClass = "text-[16px] font-light leading-[26px] tracking-[0.36px] text-[#57606A]";

type ClassNameProps = {
  className?: string;
};

type FeatureSectionProps = {
  children: ReactNode;
  muted?: boolean;
};

type FeatureRowProps = {
  children: ReactNode;
  reverse?: boolean;
};

type FeatureImageFrameProps = {
  children: ReactNode;
  width: number;
};

export function ServiceFdePageShell({ children }: { children: ReactNode }) {
  return <PlatformPageShell {...componentNameDebugProps("ServiceFdePageShell")}>{children}</PlatformPageShell>;
}

export function ServiceFdeHeroSection({ children }: { children: ReactNode }) {
  return (
    <PlatformContentSection {...componentNameDebugProps("ServiceFdeHeroSection")} className="pb-[120px] pt-[134px] lg:pt-[144px]">
      {children}
    </PlatformContentSection>
  );
}

export function ServiceFdeHeroInner({ children }: { children: ReactNode }) {
  return <section {...componentNameDebugProps("ServiceFdeHeroInner")} className="flex w-full max-w-[1200px] flex-col items-center gap-[80px] text-center">{children}</section>;
}

export function ServiceFdeHeroCopy({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("ServiceFdeHeroCopy")} className="flex w-full max-w-[1200px] flex-col items-center gap-[20px] text-center">{children}</div>;
}

export function ServiceFdeHeroEyebrow({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("ServiceFdeHeroEyebrow")} className="text-[14px] font-medium tracking-[0.08em] text-[#0969DA]">{children}</p>;
}

export function ServiceFdeHeroTitle({ children }: { children: ReactNode }) {
  return <h1 {...componentNameDebugProps("ServiceFdeHeroTitle")} className="mx-auto max-w-[800px] text-[48px] font-normal leading-[56px] tracking-normal text-[#24292F] lg:text-[60px] lg:leading-[72px]">{children}</h1>;
}

export function ServiceFdeHeroLead({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("ServiceFdeHeroLead")} className="max-w-[1000px] text-[18px] font-light leading-[28px] tracking-[0.36px] text-[#57606A]">{children}</p>;
}

export function ServiceFdeHeroVisual() {
  return (
    <section {...componentNameDebugProps("ServiceFdeHeroVisual")} className="flex w-full self-stretch justify-center">
      <div className="mx-auto w-full max-w-[1200px]">
        <Image
          src="/services/fde/hero.svg"
          alt="Custom AI Agents"
          width={1200}
          height={624}
          priority
          className="h-auto w-full"
          unoptimized
        />
      </div>
    </section>
  );
}

export function ServiceFdeOverviewSection({ children }: { children: ReactNode }) {
  return <PlatformContentSection {...componentNameDebugProps("ServiceFdeOverviewSection")} className="bg-[#F6F8FA] py-[100px] lg:py-[120px]">{children}</PlatformContentSection>;
}

export function ServiceFdeOverviewHeader({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("ServiceFdeOverviewHeader")} className="mx-auto max-w-[800px] text-center">{children}</div>;
}

export function ServiceFdeSectionTitle({ children }: { children: ReactNode }) {
  return <h2 {...componentNameDebugProps("ServiceFdeSectionTitle")} className="text-[32px] font-normal leading-[40px] tracking-[-0.04em] text-[#24292F] lg:text-[48px] lg:leading-[1.2]">{children}</h2>;
}

export function ServiceFdeSectionLead({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("ServiceFdeSectionLead")} className="mt-5 text-[16px] font-light leading-[26px] text-[#57606A] lg:text-[18px] lg:leading-[28px]">{children}</p>;
}

export function ServiceFdeOverviewGrid({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("ServiceFdeOverviewGrid")} className="mt-12 grid gap-4 lg:grid-cols-3 lg:gap-5">{children}</div>;
}

export function ServiceFdeOverviewCard({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <article {...componentNameDebugProps("ServiceFdeOverviewCard")} className="flex min-h-[240px] flex-col rounded-[20px] bg-white p-6 lg:p-8">
      <p className="text-[14px] font-medium tracking-[0.08em] text-[#0969DA]">{number}</p>
      <h3 className="mt-5 text-[24px] font-medium leading-[1.35] tracking-[-0.03em] text-[#24292F]">{title}</h3>
      <p className="mt-auto pt-6 text-[15px] font-light leading-6 text-[#57606A]">{children}</p>
    </article>
  );
}

export function ServiceFdeChallengeSection({ children }: { children: ReactNode }) {
  return <PlatformContentSection {...componentNameDebugProps("ServiceFdeChallengeSection")} className="py-[100px] lg:py-[120px]">{children}</PlatformContentSection>;
}

export function ServiceFdeChallengeContent({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("ServiceFdeChallengeContent")} className="mx-auto max-w-[920px]">{children}</div>;
}

export function ServiceFdeChallengeList({ children }: { children: ReactNode }) {
  return <ul {...componentNameDebugProps("ServiceFdeChallengeList")} className="mt-10 grid gap-x-10 gap-y-5 border-y border-[#D8DEE4] py-8 text-[18px] font-normal leading-[28px] text-[#24292F] lg:grid-cols-2">{children}</ul>;
}

export function ServiceFdeChallengeItem({ children }: { children: ReactNode }) {
  return <li {...componentNameDebugProps("ServiceFdeChallengeItem")} className="flex gap-3 before:mt-[11px] before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-[#0969DA]">{children}</li>;
}

export function ServiceFdeFeatureSection({ children, muted = false }: FeatureSectionProps) {
  return <PlatformFeatureSection {...componentNameDebugProps("ServiceFdeFeatureSection")} muted={muted}>{children}</PlatformFeatureSection>;
}

export function ServiceFdeFeatureInner({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("ServiceFdeFeatureInner")} className="flex w-full flex-col">{children}</div>;
}

export function ServiceFdeFeatureRow({ children, reverse = false }: FeatureRowProps) {
  return <div {...componentNameDebugProps("ServiceFdeFeatureRow")} className={`flex flex-col items-center justify-center gap-[60px] lg:gap-[80px] ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"}`}>{children}</div>;
}

export function ServiceFdeFeatureCopy({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("ServiceFdeFeatureCopy")} className="flex w-full max-w-full flex-col gap-[20px]">{children}</div>;
}

export function ServiceFdeFeatureTitle({ children }: { children: ReactNode }) {
  return <h4 {...componentNameDebugProps("ServiceFdeFeatureTitle")} className="text-[32px] font-medium leading-[42px] tracking-normal text-[#24292F] max-[480px]:text-[20px] max-[480px]:leading-[28px]">{children}</h4>;
}

export function ServiceFdeFeatureBody({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("ServiceFdeFeatureBody")} className={headingBodyClass}>{children}</p>;
}

export function ServiceFdeFeatureChecklist({ className = "" }: ClassNameProps) {
  return <ul {...componentNameDebugProps("ServiceFdeFeatureChecklist")} className={`min-h-0 ${className}`.trim()} />;
}

export function ServiceFdeFeatureMedia({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("ServiceFdeFeatureMedia")} className="relative shrink-0 flex-[0_0_auto]">{children}</div>;
}

export function ServiceFdeFeatureImageFrame({ children, width }: FeatureImageFrameProps) {
  const style = { "--fde-feature-image-width": `${width}px` } as CSSProperties;

  return (
    <div {...componentNameDebugProps("ServiceFdeFeatureImageFrame")} className="w-full max-w-full overflow-hidden rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] lg:w-[var(--fde-feature-image-width)] lg:shadow-[0_8px_20px_rgba(0,0,0,0.15)]" style={style}>
      {children}
    </div>
  );
}

export function ServiceFdeFeatureImage({ src, alt }: { src: string; alt: string }) {
  return <Image {...componentNameDebugProps("ServiceFdeFeatureImage")} src={src} alt={alt} width={1000} height={612} className="h-auto w-full" />;
}

export function ServiceFdeCtaSection({ children }: { children: ReactNode }) {
  return <PlatformCtaSection>{children}</PlatformCtaSection>;
}

export function ServiceFdeCtaCopy({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-[20px] text-center">{children}</div>;
}

export function ServiceFdeCtaTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[52px] font-normal leading-[62px] tracking-normal text-[#24292F]">{children}</h2>;
}

export function ServiceFdeCtaDescription({ children }: { children: ReactNode }) {
  return <p className={headingBodyClass}>{children}</p>;
}

export function ServiceFdeCtaActions({ children }: { children: ReactNode }) {
  return <div className="flex justify-center">{children}</div>;
}
