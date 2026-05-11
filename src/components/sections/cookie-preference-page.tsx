import Link from "next/link";
import type { ReactNode } from "react";

export function CookiePreferenceHeroSection({ children }: { children: ReactNode }) {
  return <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[112.5px] pt-[108px] lg:px-[30px] lg:pb-[150px] lg:pt-[132px]">{children}</section>;
}

export function CookiePreferenceHeroContent({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[1200px]">{children}</div>;
}

export function CookiePreferenceHeroTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-[56.25px] font-normal leading-[67.5px] text-[#24292F]">{children}</h1>;
}

export function CookiePreferenceHeroDescription({ children }: { children: ReactNode }) {
  return <div className="mt-[18.75px] max-w-[1200px] text-[15px] font-light leading-[24.375px] tracking-[0.3375px] text-[#57606A]">{children}</div>;
}

export function CookiePreferenceSettingsSection({ children }: { children: ReactNode }) {
  return <div className="mt-[52.5px] max-w-[1200px]">{children}</div>;
}

export function CookiePreferenceCtaSection({ children }: { children: ReactNode }) {
  return <section className="mx-auto max-w-[1920px] bg-[#F6F8FA] px-[22.5px] pb-[112.5px] pt-[112.5px] text-center lg:px-[22.5px]">{children}</section>;
}

export function CookiePreferenceCtaContent({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[841px]">{children}</div>;
}

export function CookiePreferenceCtaTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[47px] font-normal leading-[56.06px] text-[#24292F]">{children}</h2>;
}

export function CookiePreferenceCtaDescription({ children }: { children: ReactNode }) {
  return <p className="mt-[18.75px] text-[15px] font-light leading-[24.375px] tracking-[0.3375px] text-[#24292F]">{children}</p>;
}

export function CookiePreferenceCtaActions({ children }: { children: ReactNode }) {
  return <div className="mt-[38px] flex justify-center">{children}</div>;
}

export function CookiePreferenceCtaLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-[47px] items-center justify-center gap-[10px] rounded-[6px] bg-[linear-gradient(100deg,#0762D4_34.93%,#875AC5_76.81%,#C55A8C_99.98%)] px-[26.25px] py-[13.125px] text-[15px] font-normal leading-[15px] text-[#F6F6F6] transition hover:brightness-[1.04]"
    >
      <span className="block">{children}</span>
      <span aria-hidden="true" className="inline-flex h-[12px] w-[12px] items-center justify-center">
        <svg viewBox="0 0 7 12" className="h-[12px] w-[7px]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 6L0.865033 12L0 11.154L5.26381 6L0 0.846L0.865033 0L7 6Z" fill="currentColor" />
        </svg>
      </span>
    </Link>
  );
}
