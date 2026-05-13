import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

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

export function AipServicePageShell({ children }: { children: ReactNode }) {
  return <main className="relative overflow-x-hidden bg-white text-slate-950">{children}</main>;
}

export function AipServiceHeroSection({ children }: { children: ReactNode }) {
  return <section className="flex justify-center px-6 pb-[120px] pt-[80px] lg:px-0">{children}</section>;
}

export function AipServiceHeroInner({ children }: { children: ReactNode }) {
  return <div className="flex w-full max-w-[1200px] flex-col items-center gap-[80px] text-center">{children}</div>;
}

export function AipServiceHeroCopy({ children }: { children: ReactNode }) {
  return <div className="flex flex-col items-center gap-[20px]">{children}</div>;
}

export function AipServiceHeroTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-[60px] font-normal leading-[72px] tracking-normal text-[#24292F]">{children}</h1>;
}

export function AipServiceHeroLead({ children }: { children: ReactNode }) {
  return <p className="max-w-[746px] text-[18px] font-light leading-[28px] tracking-[0.36px] text-[#57606A]">{children}</p>;
}

export function AipServiceHeroVideo() {
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

export function AipServiceValueSection({ children }: { children: ReactNode }) {
  return (
    <section className="flex justify-center bg-[linear-gradient(291deg,#C5D6E6_0%,#FFF_100%)] px-6 py-[120px] lg:px-0">
      {children}
    </section>
  );
}

export function AipServiceValueInner({ children }: { children: ReactNode }) {
  return <div className="flex w-full max-w-[1200px] flex-col gap-[40px]">{children}</div>;
}

export function AipServiceValueIntro({ children }: { children: ReactNode }) {
  return <div className="flex flex-col items-center gap-[20px] text-center">{children}</div>;
}

export function AipServiceValueTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[52px] font-normal leading-[62px] tracking-normal text-[#24292F]">{children}</h2>;
}

export function AipServiceValueDescription({ children }: { children: ReactNode }) {
  return <p className="text-[16px] font-light leading-[26px] tracking-[0.36px] text-[#57606A]">{children}</p>;
}

export function AipServiceValueGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-[40px] md:grid-cols-3 md:gap-[40px]">{children}</div>;
}

export function AipServiceValueCard({ children }: { children: ReactNode }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_30px_30px_0_rgba(47,110,168,0.05)]">
      {children}
    </article>
  );
}

export function AipServiceValueImage({ src, alt, children }: { src: string; alt: string; children: ReactNode }) {
  return (
    <div className="relative w-full">
      <Image src={src} alt={alt} width={373} height={188} className="h-auto w-full" />
      <div className="absolute inset-0 flex items-center justify-start px-[40px] text-left text-white">{children}</div>
    </div>
  );
}

export function AipServiceValueCardTitle({ children }: { children: ReactNode }) {
  return <h3 className="whitespace-pre-line text-[32px] font-medium leading-[42px] tracking-normal">{children}</h3>;
}

export function AipServiceValueCardBody({ children }: { children: ReactNode }) {
  return <p className="px-[30px] pt-[40px] text-[16px] font-light leading-[26px] tracking-[0.36px] text-[#57606A]">{children}</p>;
}

export function AipServiceValueCardLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <div className="mt-auto flex items-center justify-start px-[40px] pb-[40px] pt-[20px]">
      <Link href={href} className="inline-flex text-[15px] font-normal leading-[16px] text-[#24292F] underline-offset-4 hover:underline">
        {children}
      </Link>
    </div>
  );
}

export function AipServiceInlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="mt-[20px] inline-flex text-[15px] font-normal leading-[16px] text-[#24292F] underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}

export function AipServiceFeatureSection({ children, muted = false }: FeatureSectionProps) {
  return <section className={`flex justify-center px-6 py-[80px] lg:px-0${muted ? " bg-[#F6F8FA]" : " bg-white"}`}>{children}</section>;
}

export function AipServiceFeatureInner({ children }: { children: ReactNode }) {
  return <div className="flex w-full max-w-[1200px] flex-col gap-[80px]">{children}</div>;
}

export function AipServiceFeatureHeader({ children }: { children: ReactNode }) {
  return <div className="flex justify-center">{children}</div>;
}

export function AipServiceFeatureHeaderTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-center text-[52px] font-normal leading-[62px] tracking-normal text-[#24292F]">{children}</h2>;
}

export function AipServiceFeatureRow({ children, reverse = false }: { children: ReactNode; reverse?: boolean }) {
  return <div className={`flex items-center justify-center gap-[80px] ${reverse ? "flex-row-reverse" : "flex-row"}`}>{children}</div>;
}

export function AipServiceFeatureCopy({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={["flex flex-col gap-[20px]", className].filter(Boolean).join(" ")}>{children}</div>;
}

export function AipServiceFeatureTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-[32px] font-medium leading-[42px] tracking-normal text-[#24292F]">{children}</h3>;
}

export function AipServiceFeatureBody({ children }: { children: ReactNode }) {
  return <p className="text-[16px] font-light leading-[26px] tracking-[0.36px] text-[#57606A]">{children}</p>;
}

export function AipServiceFeatureImage({ src, alt, width, height }: FeatureImageProps) {
  return (
    <div className="max-w-full flex-none overflow-hidden rounded-[8px] shadow-[0_8px_20px_rgba(0,0,0,0.15)]" style={{ width }}>
      <Image src={src} alt={alt} width={width} height={height} unoptimized className="h-auto w-full" />
    </div>
  );
}

export function AipServiceLineBreak() {
  return <br />;
}
