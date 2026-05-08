import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";

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

export function AipFdeServicesPageShell({ children }: { children: ReactNode }) {
  return <main className="relative overflow-x-hidden bg-white text-slate-950">{children}</main>;
}

export function AipFdeHeroSection({ children }: { children: ReactNode }) {
  return <section className="flex justify-center px-6 pb-[120px] pt-[80px] lg:px-0">{children}</section>;
}

export function AipFdeHeroInner({ children }: { children: ReactNode }) {
  return <section className="flex w-full max-w-[1200px] flex-col items-center gap-[80px] text-center">{children}</section>;
}

export function AipFdeHeroCopy({ children }: { children: ReactNode }) {
  return <div className="flex w-full max-w-[1200px] flex-col items-center gap-[20px] text-center">{children}</div>;
}

export function AipFdeHeroTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-[60px] font-normal leading-[72px] tracking-normal text-[#24292F]">{children}</h1>;
}

export function AipFdeHeroLead({ children }: { children: ReactNode }) {
  return <p className="max-w-[746px] text-[18px] font-light leading-[28px] tracking-[0.36px] text-[#57606A]">{children}</p>;
}

export function AipFdeHeroVisual() {
  return (
    <section className="flex w-full self-stretch justify-center">
      <div className="mx-auto w-full max-w-[1200px]">
        <Image
          src="/solutions/aip/fde-services/hero.svg"
          alt="Custom AI Agents"
          width={1200}
          height={624}
          priority
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}

export function AipFdeFeatureSection({ children, muted = false }: FeatureSectionProps) {
  return <section className={`flex justify-center px-6 py-[80px] lg:px-0${muted ? " bg-[#F6F8FA]" : " bg-white"}`}>{children}</section>;
}

export function AipFdeFeatureInner({ children }: { children: ReactNode }) {
  return <div className="flex w-full flex-col">{children}</div>;
}

export function AipFdeFeatureRow({ children, reverse = false }: FeatureRowProps) {
  return <div className={`flex items-center justify-center gap-[80px] ${reverse ? "flex-row-reverse" : "flex-row"}`}>{children}</div>;
}

export function AipFdeFeatureCopy({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-[20px]">{children}</div>;
}

export function AipFdeFeatureTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[32px] font-medium leading-[42px] tracking-normal text-[#24292F]">{children}</h2>;
}

export function AipFdeFeatureBody({ children }: { children: ReactNode }) {
  return <p className={headingBodyClass}>{children}</p>;
}

export function AipFdeFeatureChecklist({ className = "" }: ClassNameProps) {
  return <ul className={`min-h-0 ${className}`.trim()} />;
}

export function AipFdeFeatureMedia({ children }: { children: ReactNode }) {
  return <div className="relative shrink-0 flex-[0_0_auto]">{children}</div>;
}

export function AipFdeFeatureImageFrame({ children, width }: FeatureImageFrameProps) {
  const style = { width: `${width}px`, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)" } satisfies CSSProperties;

  return (
    <div className="max-w-full overflow-hidden rounded-[8px]" style={style}>
      {children}
    </div>
  );
}

export function AipFdeFeatureImage({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} width={1000} height={612} className="h-auto w-full" />;
}

export function AipFdeCtaSection({ children }: { children: ReactNode }) {
  return <section className="flex w-full flex-col items-center gap-[40px] bg-[#F6F8FA] px-[24px] py-[120px]">{children}</section>;
}

export function AipFdeCtaCopy({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-[20px] text-center">{children}</div>;
}

export function AipFdeCtaTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[52px] font-normal leading-[62px] tracking-normal text-[#24292F]">{children}</h2>;
}

export function AipFdeCtaDescription({ children }: { children: ReactNode }) {
  return <p className={headingBodyClass}>{children}</p>;
}

export function AipFdeCtaActions({ children }: { children: ReactNode }) {
  return <div className="flex justify-center">{children}</div>;
}
