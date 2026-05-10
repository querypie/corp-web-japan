import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

const sectionHeadingClass =
  "text-[48.75px] font-normal leading-[58.125px] tracking-[-0.035em] text-slate-950";
const bodyCopyClass = "text-base font-light leading-[1.95] text-slate-600";
const secondaryCopyClass = "text-base font-light leading-[1.95] text-slate-600";

export function AboutUsBodyCopy({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`${bodyCopyClass}${className ? ` ${className}` : ""}`}>{children}</p>;
}

export function AboutUsHeroSection({ children }: { children: ReactNode }) {
  return <section className="mx-auto max-w-[1440px] bg-white px-[30px] pb-[84px] pt-[92px] lg:pb-[84px] lg:pt-[116px]">{children}</section>;
}

export function AboutUsHeroHeading({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-[44px] font-medium leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-[52px] lg:text-[60px]">
      {children}
    </h1>
  );
}

export function AboutUsHeroLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto mt-[56px] grid max-w-[1200px] items-start gap-16 lg:grid-cols-[504px_640px] lg:gap-14">{children}</div>;
}

export function AboutUsHeroCopy({ children }: { children: ReactNode }) {
  return <div className="max-w-[504px] space-y-6">{children}</div>;
}

export function AboutUsHeroImage() {
  return (
    <div className="relative h-[360px] w-full lg:w-[640px]">
      <Image src="/about-us/hero-game-changer.png" alt="Game Changer" fill priority className="object-cover" />
    </div>
  );
}

export function AboutUsSection({ children, muted = false, className = "" }: { children: ReactNode; muted?: boolean; className?: string }) {
  const backgroundClass = muted ? "bg-[#F6F8FA]" : "bg-white";

  return <section className={`${backgroundClass}${className ? ` ${className}` : ""}`}>{children}</section>;
}

export function AboutUsSectionInner({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[1200px] px-6 lg:px-0${className ? ` ${className}` : ""}`}>{children}</div>;
}

export function AboutUsSectionHeading({ children }: { children: ReactNode }) {
  return <h2 className={sectionHeadingClass}>{children}</h2>;
}

export function AboutUsSectionIntro({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mt-4${className ? ` ${className}` : ""}`}>{children}</div>;
}

export function AboutUsInvestorLogoRow({ children }: { children: ReactNode }) {
  return <div className="mt-[72px] flex flex-wrap items-center justify-center gap-x-[169px] gap-y-8">{children}</div>;
}

export function AboutUsInvestorLogo({
  name,
  logoSrc,
  width,
  height,
}: {
  name: string;
  logoSrc: string;
  width: number;
  height: number;
}) {
  return (
    <div className="flex min-h-[80px] items-center justify-center">
      <Image
        src={logoSrc}
        alt={name}
        width={width}
        height={height}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="max-w-full object-contain"
      />
    </div>
  );
}

export function AboutUsTimeline({ children }: { children: ReactNode }) {
  return <div className="mt-[90px] space-y-6">{children}</div>;
}

export function AboutUsTimelineItem({ year, children }: { year: string; children: ReactNode }) {
  return (
    <div className="grid gap-4 px-[29px] py-[6px] md:grid-cols-[94px_minmax(0,1fr)] md:gap-[56px]">
      <h3 className="text-[30px] font-medium leading-[39.375px] tracking-[-0.03em] text-slate-950">{year}</h3>
      <div className="border-l border-slate-200 pl-[28px]">
        <ul className={`list-none space-y-1 pl-0 ${secondaryCopyClass}`}>{children}</ul>
      </div>
    </div>
  );
}

export function AboutUsLeaderGrid({ children }: { children: ReactNode }) {
  return <div className="mt-[36px] grid gap-x-10 gap-y-[42px] md:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

export function AboutUsLeaderCard({
  imageSrc,
  imageAlt,
  linkedinUrl,
  children,
}: {
  imageSrc: string;
  imageAlt: string;
  linkedinUrl: string;
  children: ReactNode;
}) {
  return (
    <article className="flex h-full flex-col">
      <div className="relative aspect-square w-full overflow-hidden rounded-[24px] bg-[#F6F8FA]">
        <Image src={imageSrc} alt={imageAlt} fill sizes="(min-width: 1280px) 320px, (min-width: 768px) 50vw, 100vw" className="object-cover object-top" />
      </div>
      <div className="w-full pt-[19px]">
        {children}
        <Link
          href={linkedinUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${imageAlt} LinkedIn`}
          className={`mt-4 flex w-full justify-end ${secondaryCopyClass} transition hover:text-slate-950`}
        >
          <Image src="/about-us/linkedin.svg" alt="LinkedIn" width={34} height={34} className="h-[34px] w-[34px]" />
        </Link>
      </div>
    </article>
  );
}

export function AboutUsLeaderName({ children }: { children: ReactNode }) {
  return <h3 className="text-[18.75px] font-medium leading-[26.25px] tracking-[-0.02em] text-slate-950">{children}</h3>;
}

export function AboutUsLeaderRole({ children }: { children: ReactNode }) {
  return <p className={`mt-1 text-[13.125px] leading-[20.625px] ${secondaryCopyClass}`}>{children}</p>;
}

export function AboutUsLocationGrid({ children }: { children: ReactNode }) {
  return <div className="mt-[31px] grid gap-x-[36px] gap-y-10 md:grid-cols-2 xl:grid-cols-4">{children}</div>;
}

export function AboutUsLocationCard({
  iconSrc,
  iconAlt,
  children,
}: {
  iconSrc: string;
  iconAlt: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="inline-flex w-fit self-start items-center justify-center border border-slate-200/70 bg-white leading-none">
        <Image src={iconSrc} alt={iconAlt} width={23} height={17} className="block h-[17px] w-[23px]" />
      </div>
      {children}
    </div>
  );
}

export function AboutUsLocationName({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4">
      <h3 className="text-[18.75px] font-medium leading-[26.25px] tracking-[-0.02em] text-slate-950">{children}</h3>
    </div>
  );
}

export function AboutUsLocationAddress({ children }: { children: ReactNode }) {
  return <div className={`mt-4 space-y-0 ${secondaryCopyClass}`}>{children}</div>;
}
