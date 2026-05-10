import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";

export function CertificationsPageSection({ children }: { children: ReactNode }) {
  return <section className="mx-auto max-w-[1200px] pb-24 pt-[86px] lg:pb-28 lg:pt-[108px]">{children}</section>;
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

export function CertificationsTrustCenterSection({ children }: { children: ReactNode }) {
  return <section className="flex flex-col items-center px-6 pb-2 pt-20 text-center lg:px-0 lg:pt-24">{children}</section>;
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
