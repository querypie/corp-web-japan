import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";

export type CertificationItem = {
  id: string;
  title: string;
  description: readonly string[];
  src: string;
  alt: string;
  width: number;
  height: number;
};

export function CertificationsPageSection({ children }: { children: ReactNode }) {
  return <section className="mx-auto max-w-[1200px] pb-24 pt-[86px] lg:pb-28 lg:pt-[108px]">{children}</section>;
}

export function CertificationsIntroSection({ children }: { children: ReactNode }) {
  return <div className="text-left">{children}</div>;
}

export function CertificationsIntroDescription({ children }: { children: ReactNode }) {
  return <div className="mt-5 text-[16.875px] font-light leading-[26.25px] tracking-[0.3375px] text-slate-500">{children}</div>;
}

export function CertificationsGrid({ children }: { children: ReactNode }) {
  return <div className="mt-[44px] grid gap-x-7 gap-y-9 md:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

export function CertificationCard({ title, description, src, alt, width, height }: CertificationItem) {
  return (
    <article className="flex h-[375px] flex-col items-center justify-start rounded-[9.375px] bg-[#f5f7fa] px-8 pb-8 pt-10 text-center">
      <div className="flex min-h-[148px] items-center justify-center">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto max-h-[130px] w-auto max-w-[180px] object-contain sm:max-w-[238px]"
        />
      </div>
      <div className="mt-7 flex flex-1 flex-col items-center justify-start gap-[20px]">
        <h2 className="text-[18.75px] font-medium leading-[26.25px] text-slate-950">{title}</h2>
        <div className="space-y-0 text-[13.125px] font-light leading-[20.625px] tracking-[0.2625px] text-slate-950">
          {description.map((line) => (
            <p key={`${title}-${line}`}>{line}</p>
          ))}
        </div>
      </div>
    </article>
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

export function CertificationsTrialCtaContent({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex max-w-[1200px] flex-col items-center text-center">{children}</div>;
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
