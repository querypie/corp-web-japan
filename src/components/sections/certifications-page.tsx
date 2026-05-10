import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";

export function CertificationsPageSection({ children }: { children: ReactNode }) {
  return <section className="mx-auto max-w-[1200px] pb-24 pt-[86px] lg:pb-28 lg:pt-[108px]">{children}</section>;
}

export function CertificationsIntroSection({ children }: { children: ReactNode }) {
  return <div className="text-left">{children}</div>;
}

export function CertificationsPageTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-[44px] font-medium leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-[52px] sm:leading-[1.15]">{children}</h1>;
}

export function CertificationsPageDescription({ children }: { children: ReactNode }) {
  return <div className="mt-5 text-[16.875px] font-light leading-[26.25px] tracking-[0.3375px] text-slate-500">{children}</div>;
}

export function CertificationsGrid({ children }: { children: ReactNode }) {
  return <div className="mt-[44px] grid gap-x-7 gap-y-9 md:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

export function CertificationCard({ children }: { children: ReactNode }) {
  return <article className="flex h-[375px] flex-col items-center justify-start rounded-[9.375px] bg-[#f5f7fa] px-8 pb-8 pt-10 text-center">{children}</article>;
}

export function CertificationCardImage({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
}) {
  return (
    <div className="flex min-h-[148px] items-center justify-center">
      <Image src={src} alt={alt} width={width} height={height} className={className} />
    </div>
  );
}

export function CertificationCardContent({ children }: { children: ReactNode }) {
  return <div className="mt-7 flex flex-1 flex-col items-center justify-start gap-[20px]">{children}</div>;
}

export function CertificationCardTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[18.75px] font-medium leading-[26.25px] text-slate-950">{children}</h2>;
}

export function CertificationCardDescription({ children }: { children: ReactNode }) {
  return <div className="space-y-0 text-[13.125px] font-light leading-[20.625px] tracking-[0.2625px] text-slate-950">{children}</div>;
}

export function CertificationCardDescriptionLine({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function CertificationsTrustCenterSection({ children }: { children: ReactNode }) {
  return <section className="flex flex-col items-center px-6 pb-2 pt-20 text-center lg:px-0 lg:pt-24">{children}</section>;
}

export function CertificationsTrustCenterTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[37.5px] font-normal leading-[45px] text-slate-950">{children}</h2>;
}

export function CertificationsTrustCenterAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-8 inline-flex items-center justify-center gap-2 rounded-[5.625px] border border-[#afb8c1] bg-white px-[26.25px] py-[13.125px] text-[15px] font-normal leading-[15px] text-slate-950 transition hover:bg-slate-50"
    >
      {children}
      <ExternalLink className="h-4 w-4" />
    </Link>
  );
}

export function CertificationsTrialCtaSection({ children }: { children: ReactNode }) {
  return <section className="bg-[#f5f7fa] px-6 py-16 lg:px-10 lg:py-20">{children}</section>;
}

export function CertificationsTrialCtaContent({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex max-w-[1200px] flex-col items-center text-center">{children}</div>;
}

export function CertificationsTrialCtaTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[32px] font-medium leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[40px]">{children}</h2>;
}

export function CertificationsTrialCtaDescription({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-base leading-7 text-slate-500">{children}</p>;
}

export function CertificationsTrialCtaAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-8 inline-flex items-center justify-center gap-2 rounded-[5.625px] bg-[linear-gradient(90deg,#2563eb_0%,#7c3aed_100%)] px-[26.25px] py-[13.125px] text-[15px] font-normal leading-[15px] text-white transition hover:opacity-95"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
