import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { PlatformCtaSection, PlatformFeatureSection, PlatformHeroSection, PlatformPageShell } from "@/components/sections/platform/page-primitives";

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
  return <PlatformPageShell>{children}</PlatformPageShell>;
}

export function ServiceFdeHeroSection({ children }: { children: ReactNode }) {
  return <PlatformHeroSection>{children}</PlatformHeroSection>;
}

export function ServiceFdeHeroInner({ children }: { children: ReactNode }) {
  return <section className="flex w-full max-w-[1200px] flex-col items-center gap-[80px] text-center">{children}</section>;
}

export function ServiceFdeHeroCopy({ children }: { children: ReactNode }) {
  return <div className="flex w-full max-w-[1200px] flex-col items-center gap-[20px] text-center">{children}</div>;
}

export function ServiceFdeHeroTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-[60px] font-normal leading-[72px] tracking-normal text-[#24292F]">{children}</h1>;
}

export function ServiceFdeHeroLead({ children }: { children: ReactNode }) {
  return <p className="max-w-[746px] text-[18px] font-light leading-[28px] tracking-[0.36px] text-[#57606A]">{children}</p>;
}

export function ServiceFdeHeroVisual() {
  return (
    <section className="flex w-full self-stretch justify-center">
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

export function ServiceFdeFeatureSection({ children, muted = false }: FeatureSectionProps) {
  return <PlatformFeatureSection muted={muted}>{children}</PlatformFeatureSection>;
}

export function ServiceFdeFeatureInner({ children }: { children: ReactNode }) {
  return <div className="flex w-full flex-col">{children}</div>;
}

export function ServiceFdeFeatureRow({ children, reverse = false }: FeatureRowProps) {
  return <div className={`flex items-center justify-center gap-[80px] ${reverse ? "flex-row-reverse" : "flex-row"}`}>{children}</div>;
}

export function ServiceFdeFeatureCopy({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-[20px]">{children}</div>;
}

export function ServiceFdeFeatureTitle({ children }: { children: ReactNode }) {
  return <h4 className="text-[32px] font-medium leading-[42px] tracking-normal text-[#24292F]">{children}</h4>;
}

export function ServiceFdeFeatureBody({ children }: { children: ReactNode }) {
  return <p className={headingBodyClass}>{children}</p>;
}

export function ServiceFdeFeatureChecklist({ className = "" }: ClassNameProps) {
  return <ul className={`min-h-0 ${className}`.trim()} />;
}

export function ServiceFdeFeatureMedia({ children }: { children: ReactNode }) {
  return <div className="relative shrink-0 flex-[0_0_auto]">{children}</div>;
}

export function ServiceFdeFeatureImageFrame({ children, width }: FeatureImageFrameProps) {
  const style = { width: `${width}px`, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)" } satisfies CSSProperties;

  return (
    <div className="max-w-full overflow-hidden rounded-[8px]" style={style}>
      {children}
    </div>
  );
}

export function ServiceFdeFeatureImage({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} width={1000} height={612} className="h-auto w-full" />;
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
