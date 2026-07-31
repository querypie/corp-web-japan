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


const heroRoles = [
  ["AIエージェント", "role-ai-agents.png"],
  ["開発者", "role-developers.png"],
  ["管理者", "role-admin.png"],
  ["一般利用者", "role-general-user.png"],
] as const;

const heroControls = [
  ["アクセス制御", "access-control.svg"],
  ["申請・承認", "approval.svg"],
  ["監査ログ", "audit-logging.svg"],
  ["DLP", "dlp.svg"],
  ["ポリシー", "policy.svg"],
  ["セッション記録", "session-recording.svg"],
] as const;

const heroTargets = [
  ["データ", "target-data.svg"],
  ["システム", "target-system.svg"],
  ["Kubernetes", "target-kubernetes.svg"],
  ["Web/SaaS", "target-web.svg"],
  ["MCPツール", "target-mcp.svg"],
] as const;

const heroDiagramAssetBase = "https://www.querypie.com/assets/products/acp/diagram";

function HeroDiagramItem({ label, asset }: { label: string; asset: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-[14px] border border-slate-200 bg-white px-4 py-3 shadow-[0_18px_36px_-28px_rgba(15,23,42,0.42)]">
      <img alt="" aria-hidden="true" className="h-7 w-7 shrink-0 object-contain" src={`${heroDiagramAssetBase}/${asset}`} />
      <span className="min-w-0 text-sm font-medium leading-5 text-[#24292F]">{label}</span>
    </div>
  );
}

export function AcpHeroDiagram() {
  return (
    <figure {...componentNameDebugProps("AcpHeroDiagram")} aria-label="QueryPie ACPのアクセス統制フロー" className="mx-auto w-full max-w-[1080px]">
      <div className="relative hidden min-h-[480px] grid-cols-[190px_minmax(0,1fr)_190px] items-center gap-8 overflow-hidden lg:grid">
        <img alt="" aria-hidden="true" className="pointer-events-none absolute left-[18%] top-[21%] z-0 h-[58%] w-[64%] object-fill opacity-70" src={`${heroDiagramAssetBase}/connections.svg`} />
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1000 430" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="acp-flow" x1="0" x2="1">
              <stop stopColor="#0969DA" stopOpacity="0.18" />
              <stop offset="0.5" stopColor="#0969DA" stopOpacity="0.8" />
              <stop offset="1" stopColor="#0969DA" stopOpacity="0.18" />
            </linearGradient>
          </defs>
          {[72, 164, 256, 348].map((y) => (
            <path key={`role-${y}`} d={`M 165 ${y} C 320 ${y}, 315 215, 445 215`} stroke="url(#acp-flow)" strokeDasharray="7 13" strokeWidth="2">
              <animate attributeName="stroke-dashoffset" from="0" to="-80" dur="2.4s" repeatCount="indefinite" />
            </path>
          ))}
          {[54, 135, 215, 295, 376].map((y) => (
            <path key={`target-${y}`} d={`M 555 215 C 685 215, 680 ${y}, 835 ${y}`} stroke="url(#acp-flow)" strokeDasharray="7 13" strokeWidth="2">
              <animate attributeName="stroke-dashoffset" from="0" to="80" dur="2.4s" repeatCount="indefinite" />
            </path>
          ))}
        </svg>

        <div className="relative z-10 flex flex-col gap-3">
          <p className="mb-1 text-left text-xs font-semibold tracking-[0.12em] text-[#57606A]">利用する人・AI</p>
          {heroRoles.map(([label, asset]) => <HeroDiagramItem key={label} label={label} asset={asset} />)}
        </div>

        <div className="relative z-10 rounded-[20px] border border-[#B6D4FE] bg-[#EAF2FF] p-6 text-left shadow-[0_20px_44px_-34px_rgba(9,105,218,0.8)]">
          <p className="text-[24px] font-semibold tracking-[-0.04em] text-[#174EA6]">QueryPie ACP</p>
          <p className="mt-1 text-xs font-medium text-[#57606A]">Access Control Platform</p>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3">
            {heroControls.map(([label, asset]) => (
              <div key={label} className="flex items-center gap-2 text-[13px] font-medium leading-5 text-[#24292F]">
                <img alt="" aria-hidden="true" className="h-[18px] w-[18px] shrink-0" src={`${heroDiagramAssetBase}/${asset}`} />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-3">
          <p className="mb-1 text-left text-xs font-semibold tracking-[0.12em] text-[#57606A]">統制する対象</p>
          {heroTargets.map(([label, asset]) => <HeroDiagramItem key={label} label={label} asset={asset} />)}
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:hidden">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {heroRoles.map(([label, asset]) => <HeroDiagramItem key={label} label={label} asset={asset} />)}
        </div>
        <div className="rounded-[20px] border border-[#B6D4FE] bg-[#EAF2FF] p-5 text-left">
          <p className="text-[22px] font-semibold tracking-[-0.04em] text-[#174EA6]">QueryPie ACP</p>
          <p className="mt-1 text-xs font-medium text-[#57606A]">Access Control Platform</p>
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
            {heroControls.map(([label, asset]) => (
              <div key={label} className="flex items-center gap-2 text-[13px] font-medium leading-5 text-[#24292F]">
                <img alt="" aria-hidden="true" className="h-[18px] w-[18px] shrink-0" src={`${heroDiagramAssetBase}/${asset}`} />
                {label}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {heroTargets.map(([label, asset]) => <HeroDiagramItem key={label} label={label} asset={asset} />)}
        </div>
      </div>
      <figcaption className="mx-auto mt-10 max-w-[1080px]">
        <h2 className="text-center text-[32px] font-normal leading-[42px] tracking-[-0.03em] text-[#24292F] sm:text-[38px] sm:leading-[48px]">アクセス統制を、AI時代の共通基盤へ。</h2>
        <p className="mx-auto mt-5 max-w-[1000px] text-left text-[16px] font-light leading-[26px] tracking-[0.36px] text-[#57606A]">
          アクセスを許可・禁止するだけでは、複雑化するインフラとAI活用を守り切れません。
          <br />
          QueryPie ACPは、統制の仕組みと対象環境を一つの基盤に集約します。
        </p>
      </figcaption>
    </figure>
  );
}

export function AcpFeatureSection({ children }: { children: ReactNode }) {
  return <PlatformContentSection {...componentNameDebugProps("AcpFeatureSection")} className="py-[100px]">{children}</PlatformContentSection>;
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
