import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PlatformContentSection, PlatformPageShell } from "@/components/sections/platform/page-primitives";
import { componentNameDebugProps } from "@/lib/component-name-debug";
export { AcpHeroCopy, AcpHeroLead, AcpHeroTitle } from "@/components/sections/acp/hero-primitives";

export function AcpServicePageShell({ children }: { children: ReactNode }) {
  return <PlatformPageShell {...componentNameDebugProps("AcpServicePageShell")}>{children}</PlatformPageShell>;
}

export function AcpHeroSection({ children }: { children: ReactNode }) {
  return <PlatformContentSection {...componentNameDebugProps("AcpHeroSection")} className="pb-[120px] pt-[134px] lg:pt-[144px]">{children}</PlatformContentSection>;
}

export function AcpHeroInner({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AcpHeroInner")} className="flex w-full max-w-[1200px] flex-col items-center gap-[80px] text-center">{children}</div>;
}


export function AcpHeroVideo() {
  return (
    <div {...componentNameDebugProps("AcpHeroVideo")} className="mx-auto w-full max-w-[1024px] overflow-hidden rounded-[20px] border border-slate-200 bg-[#15181d] shadow-[0_24px_80px_-55px_rgba(15,23,42,0.48)]">
      <video
        aria-label="QueryPie ACPの画面デモ"
        className="block h-auto w-full"
        loop
        muted
        playsInline
        autoPlay
        preload="metadata"
        src="https://www.querypie.com/assets/pages/home/features/Home-ACP.mp4#t=0.001"
      />
    </div>
  );
}

export function AcpGovernanceSection({ children }: { children: ReactNode }) {
  return <PlatformContentSection {...componentNameDebugProps("AcpGovernanceSection")} className="bg-[#F6F8FA] py-[100px]">{children}</PlatformContentSection>;
}

export function AcpGovernanceInner({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AcpGovernanceInner")} className="flex w-full max-w-[1200px] flex-col gap-10">{children}</div>;
}

export function AcpGovernanceIntro({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AcpGovernanceIntro")} className="mx-auto flex max-w-[820px] flex-col gap-5 text-center">{children}</div>;
}

export function AcpGovernanceGrid({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AcpGovernanceGrid")} className="grid gap-5 lg:grid-cols-2">{children}</div>;
}

export function AcpGovernanceCard({ children }: { children: ReactNode }) {
  return <article {...componentNameDebugProps("AcpGovernanceCard")} className="rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-[0_22px_56px_-46px_rgba(15,23,42,0.24)] sm:p-8">{children}</article>;
}

export function AcpGovernanceCardTitle({ children }: { children: ReactNode }) {
  return <h3 {...componentNameDebugProps("AcpGovernanceCardTitle")} className="text-[24px] font-semibold tracking-[-0.03em] text-slate-950">{children}</h3>;
}

export function AcpGovernanceList({ children }: { children: ReactNode }) {
  return <ul {...componentNameDebugProps("AcpGovernanceList")} className="mt-5 grid gap-2.5 text-[15px] leading-7 text-slate-600 sm:grid-cols-2">{children}</ul>;
}

export function AcpGovernanceListItem({ children }: { children: ReactNode }) {
  return <li {...componentNameDebugProps("AcpGovernanceListItem")} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#174EA6]" />{children}</li>;
}

export function AcpFeatureSection({ children }: { children: ReactNode }) {
  return <PlatformContentSection {...componentNameDebugProps("AcpFeatureSection")} className="pb-[80px]">{children}</PlatformContentSection>;
}

export function AcpFeatureInner({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AcpFeatureInner")} className="flex w-full max-w-[1200px] flex-col gap-[24px]">{children}</div>;
}

export function AcpFeatureIntro({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AcpFeatureIntro")} className="flex flex-col items-center gap-[20px] text-center">{children}</div>;
}

export function AcpSectionTitle({ children }: { children: ReactNode }) {
  return <h2 {...componentNameDebugProps("AcpSectionTitle")} className="text-[52px] font-normal leading-[62px] tracking-normal text-[#24292F]">{children}</h2>;
}

export function AcpSectionBody({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AcpSectionBody")} className="text-[16px] font-light leading-[26px] tracking-[0.36px] text-[#57606A]">{children}</p>;
}

export function AcpIntegrationsSection({ children }: { children: ReactNode }) {
  return <PlatformContentSection {...componentNameDebugProps("AcpIntegrationsSection")} className="bg-[#F6F8FA] py-[80px]">{children}</PlatformContentSection>;
}

export function AcpIntegrationsInner({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AcpIntegrationsInner")} className="grid w-full max-w-[1200px] items-center gap-[80px] lg:grid-cols-[1fr_640px]">{children}</div>;
}

export function AcpIntegrationsTitle({ children }: { children: ReactNode }) {
  return <h4 {...componentNameDebugProps("AcpIntegrationsTitle")} className="text-[30px] font-medium leading-[39.375px] tracking-normal text-[#24292F]">{children}</h4>;
}

export function AcpIntegrationsBody({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AcpIntegrationsBody")} className="mt-[20px] text-[16px] font-light leading-[26px] tracking-[0.36px] text-[#57606A]">{children}</p>;
}

export function AcpIntegrationsLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link {...componentNameDebugProps("AcpIntegrationsLink")} href={href} className="mt-[20px] inline-flex text-[15px] font-normal leading-normal text-[#24292F] underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}

export function AcpIntegrationsImage() {
  return <Image {...componentNameDebugProps("AcpIntegrationsImage")} src="/services/acp/integrations.png" alt="ACP Integrations" width={640} height={670} className="h-auto w-full" />;
}

export function AcpAiPackSection({ children }: { children: ReactNode }) {
  return <PlatformContentSection {...componentNameDebugProps("AcpAiPackSection")} className="bg-[#15181d] py-[100px] text-white">{children}</PlatformContentSection>;
}

export function AcpAiPackInner({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AcpAiPackInner")} className="flex w-full max-w-[1200px] flex-col gap-10">{children}</div>;
}

export function AcpAiPackIntro({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AcpAiPackIntro")} className="mx-auto flex max-w-[820px] flex-col gap-5 text-center">{children}</div>;
}

export function AcpAiPackTitle({ children }: { children: ReactNode }) {
  return <h2 {...componentNameDebugProps("AcpAiPackTitle")} className="text-[40px] font-semibold leading-[1.2] tracking-[-0.04em] sm:text-[52px]">{children}</h2>;
}

export function AcpAiPackBody({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AcpAiPackBody")} className="text-[16px] leading-7 text-slate-300">{children}</p>;
}

export function AcpAiPackContent({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AcpAiPackContent")} className="grid items-start gap-8 lg:grid-cols-[1fr_minmax(0,0.95fr)] lg:gap-[60px]">{children}</div>;
}

export function AcpAiPackCardGrid({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AcpAiPackCardGrid")} className="grid gap-3">{children}</div>;
}

export function AcpAiPackCard({ children }: { children: ReactNode }) {
  return <article {...componentNameDebugProps("AcpAiPackCard")} className="rounded-[1.2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">{children}</article>;
}

export function AcpAiPackCardTitle({ children }: { children: ReactNode }) {
  return <h3 {...componentNameDebugProps("AcpAiPackCardTitle")} className="text-[19px] font-semibold">{children}</h3>;
}

export function AcpAiPackCardBody({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AcpAiPackCardBody")} className="mt-2 text-[14px] leading-6 text-slate-300">{children}</p>;
}

export function AcpAiPackVideo() {
  return (
    <div {...componentNameDebugProps("AcpAiPackVideo")} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black">
      <video
        aria-label="ACP AI Packの画面デモ"
        className="block h-auto w-full"
        loop
        muted
        playsInline
        autoPlay
        preload="metadata"
        src="https://www.querypie.com/assets/pages/home/features/Home-ACP.mp4#t=0.001"
      />
    </div>
  );
}
