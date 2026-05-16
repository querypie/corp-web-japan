import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PlatformContentSection, PlatformPageShell } from "@/components/sections/platform/page-primitives";

export function AcpServicePageShell({ children }: { children: ReactNode }) {
  return <PlatformPageShell>{children}</PlatformPageShell>;
}

export function AcpHeroSection({ children }: { children: ReactNode }) {
  return <PlatformContentSection className="pb-[120px] pt-[134px] lg:pt-[144px]">{children}</PlatformContentSection>;
}

export function AcpHeroInner({ children }: { children: ReactNode }) {
  return <div className="flex w-full max-w-[1200px] flex-col items-center gap-[80px] text-center">{children}</div>;
}

export function AcpHeroCopy({ children }: { children: ReactNode }) {
  return <div className="flex max-w-[1200px] flex-col items-center gap-[20px] text-center">{children}</div>;
}

export function AcpHeroTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-[48px] font-normal leading-[56px] tracking-normal text-[#24292F] lg:text-[60px] lg:leading-[72px]">{children}</h1>;
}

export function AcpHeroLead({ children }: { children: ReactNode }) {
  return <p className="max-w-[760px] text-[18px] font-light leading-[28px] tracking-[0.36px] text-[#57606A]">{children}</p>;
}

export function AcpHeroVideo() {
  return (
    <div className="mx-auto w-full max-w-[1024px]">
      <div className="relative aspect-video w-full">
        <iframe
          src="https://www.youtube.com/embed/AWnknC76Jpo?si=5M5QNi83zyyHD2V3&modestbranding=0"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  );
}

export function AcpEasyUseSection({ children }: { children: ReactNode }) {
  return <PlatformContentSection className="pb-[160px]">{children}</PlatformContentSection>;
}

export function AcpEasyUseInner({ children }: { children: ReactNode }) {
  return <div className="flex w-full max-w-[1200px] flex-col gap-[80px]">{children}</div>;
}

export function AcpFeatureSection({ children }: { children: ReactNode }) {
  return <PlatformContentSection className="pb-[80px]">{children}</PlatformContentSection>;
}

export function AcpFeatureInner({ children }: { children: ReactNode }) {
  return <div className="flex w-full max-w-[1200px] flex-col gap-[24px]">{children}</div>;
}

export function AcpFeatureIntro({ children }: { children: ReactNode }) {
  return <div className="flex flex-col items-center gap-[20px] text-center">{children}</div>;
}

export function AcpSectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[52px] font-normal leading-[62px] tracking-normal text-[#24292F]">{children}</h2>;
}

export function AcpSectionBody({ children }: { children: ReactNode }) {
  return <p className="text-[16px] font-light leading-[26px] tracking-[0.36px] text-[#57606A]">{children}</p>;
}

export function AcpEasyUseImage() {
  return (
    <div className="mx-auto max-w-[1000px]">
      <Image src="/services/acp/easy-use.png" alt="Easy Installation, Easy Use" width={1000} height={440} className="h-auto w-full" />
    </div>
  );
}

export function AcpIntegrationsSection({ children }: { children: ReactNode }) {
  return <PlatformContentSection className="bg-[#F6F8FA] py-[80px]">{children}</PlatformContentSection>;
}

export function AcpIntegrationsInner({ children }: { children: ReactNode }) {
  return <div className="grid w-full max-w-[1200px] items-center gap-[80px] lg:grid-cols-[1fr_640px]">{children}</div>;
}

export function AcpIntegrationsTitle({ children }: { children: ReactNode }) {
  return <h4 className="text-[30px] font-medium leading-[39.375px] tracking-normal text-[#24292F]">{children}</h4>;
}

export function AcpIntegrationsBody({ children }: { children: ReactNode }) {
  return <p className="mt-[20px] text-[16px] font-light leading-[26px] tracking-[0.36px] text-[#57606A]">{children}</p>;
}

export function AcpIntegrationsLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="mt-[20px] inline-flex text-[15px] font-normal leading-normal text-[#24292F] underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}

export function AcpIntegrationsImage() {
  return <Image src="/services/acp/integrations.png" alt="ACP Integrations" width={640} height={670} className="h-auto w-full" />;
}
