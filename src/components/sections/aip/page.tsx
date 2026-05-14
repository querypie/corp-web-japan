import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { PlatformContentSection, PlatformFeatureSection, PlatformPageShell } from "@/components/sections/platform/page-primitives";

type FeatureSectionProps = {
  children: ReactNode;
  muted?: boolean;
};

type FeatureImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export function AipPageShell({ children }: { children: ReactNode }) {
  return <PlatformPageShell>{children}</PlatformPageShell>;
}

export function AipHeroSection({ children }: { children: ReactNode }) {
  return <PlatformContentSection className="pb-[120px] pt-[134px] lg:pt-[144px]">{children}</PlatformContentSection>;
}

export function AipHeroInner({ children }: { children: ReactNode }) {
  return <div className="flex w-full max-w-[1200px] flex-col items-center gap-[80px] text-center">{children}</div>;
}

export function AipHeroCopy({ children }: { children: ReactNode }) {
  return <div className="flex flex-col items-center gap-[20px]">{children}</div>;
}

export function AipHeroTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-[48px] font-normal leading-[56px] tracking-normal text-[#24292F] lg:text-[60px] lg:leading-[72px]">{children}</h1>;
}

export function AipHeroLead({ children }: { children: ReactNode }) {
  return <p className="max-w-[746px] text-[16px] font-light leading-[25px] tracking-[0.36px] text-[#57606A] lg:text-[18px] lg:leading-[28px]">{children}</p>;
}

export function AipHeroVideo() {
  return (
    <div className="mx-auto w-full max-w-[1024px] overflow-hidden rounded-[12px] shadow-[0_24px_80px_-55px_rgba(15,23,42,0.45)]">
      <div className="relative aspect-video w-full bg-black">
        <iframe
          src="https://www.youtube.com/embed/nJGSCd6itUE"
          title="QueryPie AIP - Secure Enterprise Agentic AI Platform"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  );
}

export function AipValueSection({ children }: { children: ReactNode }) {
  return (
    <PlatformContentSection className="bg-[linear-gradient(291deg,#C5D6E6_0%,#FFF_100%)] py-[120px]">
      {children}
    </PlatformContentSection>
  );
}

export function AipValueInner({ children }: { children: ReactNode }) {
  return <div className="flex w-full max-w-[1200px] flex-col gap-[40px]">{children}</div>;
}

export function AipValueIntro({ children }: { children: ReactNode }) {
  return <div className="flex flex-col items-center gap-[20px] text-center">{children}</div>;
}

export function AipValueTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[32px] font-normal leading-[40px] tracking-normal text-[#24292F] lg:text-[52px] lg:leading-[62px]">{children}</h2>;
}

export function AipValueDescription({ children }: { children: ReactNode }) {
  return <p className="text-[14px] font-light leading-[23px] tracking-[0.36px] text-[#57606A] lg:text-[16px] lg:leading-[26px]">{children}</p>;
}

export function AipValueGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-[40px] md:grid-cols-3 md:gap-[40px]">{children}</div>;
}

export function AipValueCard({ children }: { children: ReactNode }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_30px_30px_0_rgba(47,110,168,0.05)]">
      {children}
    </article>
  );
}

export function AipValueImage({ src, alt, children }: { src: string; alt: string; children: ReactNode }) {
  return (
    <div className="relative w-full">
      <Image src={src} alt={alt} width={373} height={188} className="h-auto w-full" />
      <div className="absolute inset-0 flex items-center justify-start px-[40px] text-left text-white">{children}</div>
    </div>
  );
}

export function AipValueCardTitle({ children }: { children: ReactNode }) {
  return <h3 className="whitespace-pre-line text-[20px] font-medium leading-[28px] tracking-normal lg:text-[32px] lg:leading-[42px]">{children}</h3>;
}

export function AipValueCardBody({ children }: { children: ReactNode }) {
  return <p className="px-[30px] pt-[40px] text-[14px] font-light leading-[23px] tracking-[0.36px] text-[#57606A] lg:text-[16px] lg:leading-[26px]">{children}</p>;
}

export function AipValueCardLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <div className="mt-auto flex items-center justify-start px-[40px] pb-[40px] pt-[20px]">
      <Link href={href} className="inline-flex text-[15px] font-normal leading-[16px] text-[#24292F] underline-offset-4 hover:underline">
        {children}
      </Link>
    </div>
  );
}

export function AipInlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="mt-[20px] inline-flex text-[15px] font-normal leading-[16px] text-[#24292F] underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}

export function AipFeatureSection({ children, muted = false }: FeatureSectionProps) {
  return <PlatformFeatureSection muted={muted}>{children}</PlatformFeatureSection>;
}

export function AipFeatureInner({ children }: { children: ReactNode }) {
  return <div className="flex w-full max-w-[1200px] flex-col gap-[80px]">{children}</div>;
}

export function AipFeatureHeader({ children }: { children: ReactNode }) {
  return <div className="flex justify-center">{children}</div>;
}

export function AipFeatureHeaderTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-center text-[32px] font-normal leading-[40px] tracking-normal text-[#24292F] lg:text-[52px] lg:leading-[62px]">{children}</h2>;
}

export function AipFeatureRow({ children, reverse = false }: { children: ReactNode; reverse?: boolean }) {
  return <div className={`flex w-full flex-col items-center justify-center gap-[40px] lg:gap-[80px] ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"}`}>{children}</div>;
}

export function AipFeatureCopy({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={["flex w-full flex-col gap-[20px]", className].filter(Boolean).join(" ")}>{children}</div>;
}

export function AipFeatureTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-[20px] font-medium leading-[28px] tracking-normal text-[#24292F] lg:text-[32px] lg:leading-[42px]">{children}</h3>;
}

export function AipFeatureBody({ children }: { children: ReactNode }) {
  return <p className="text-[14px] font-light leading-[23px] tracking-[0.36px] text-[#57606A] lg:text-[16px] lg:leading-[26px]">{children}</p>;
}

export function AipFeatureImage({ src, alt, width, height }: FeatureImageProps) {
  const featureImageStyle = { "--aip-feature-image-width": `${width}px` } as CSSProperties;

  return (
    <div
      className="w-full max-w-full flex-none overflow-hidden rounded-[8px] shadow-[0_8px_20px_rgba(0,0,0,0.15)] lg:w-[var(--aip-feature-image-width)]"
      style={featureImageStyle}
    >
      <Image src={src} alt={alt} width={width} height={height} unoptimized className="h-auto w-full" />
    </div>
  );
}

export function AipLineBreak() {
  return <br />;
}
