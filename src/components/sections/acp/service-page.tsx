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

function HeroDiagramItem({ label, asset, compact = false, emphasizeIcon = false }: { label: string; asset: string; compact?: boolean; emphasizeIcon?: boolean }) {
  return (
    <div className={`flex w-full items-center gap-2.5 rounded-[14px] bg-[#F6F8FA] px-5 text-[#24292F] ${compact ? "py-3" : "py-5"}`}>
      <span className={`${emphasizeIcon ? "rounded-[8px] bg-[#174EA6] p-1.5" : ""} flex shrink-0 items-center justify-center`}>
        <img alt="" aria-hidden="true" className={`${compact ? "h-7 w-7" : "h-8 w-8"} object-contain`} src={`${heroDiagramAssetBase}/${asset}`} />
      </span>
      <span className="min-w-0 text-sm font-medium leading-5 text-[#24292F]">{label}</span>
    </div>
  );
}

function FlowPulse({ path, direction }: { path: string; direction: "inbound" | "outbound" }) {
  const inbound = direction === "inbound";

  return (
    <g opacity="0">
      <line x1="-9" x2="7" y1="0" y2="0" stroke="#0969DA" strokeLinecap="round" strokeWidth="6" opacity="0.38" />
      <line x1="-5" x2="5" y1="0" y2="0" stroke="#24292F" strokeLinecap="round" strokeWidth="2" />
      <animateMotion calcMode="linear" dur="4.8s" keyPoints={inbound ? "0;1;1" : "0;0;1;1"} keyTimes={inbound ? "0;0.46;1" : "0;0.56;0.96;1"} path={path} repeatCount="indefinite" rotate="auto" />
      <animate attributeName="opacity" dur="4.8s" keyTimes={inbound ? "0;0.04;0.43;0.48;1" : "0;0.56;0.6;0.94;1"} repeatCount="indefinite" values={inbound ? "0;1;1;0;0" : "0;0;1;1;0"} />
    </g>
  );
}

function ShieldBadge({ controller = false }: { controller?: boolean }) {
  return (
    <svg aria-hidden="true" className="pointer-events-none h-[46px] w-10 overflow-visible" fill="none" viewBox="0 0 40 46">
      <path d="M6.10351e-05 21.0833L2.8193e-05 7.66668C2.8193e-05 7.66668 7.87428 6.5489 10.9091 5.3077C14.1084 3.99922 20 0 20 0C20 0 25.8916 3.99922 29.0909 5.3077C32.1257 6.5489 40 7.66668 40 7.66668V21.0833C40 32.7876 31.4666 43.3428 20 46C8.53332 43.3428 6.10351e-05 32.7876 6.10351e-05 21.0833Z" fill={controller ? "#174EA6" : "#DDEEFF"}>
        <animate attributeName="fill" dur="4.8s" repeatCount="indefinite" values={controller ? "#174EA6;#174EA6;#0969DA;#174EA6;#174EA6" : "#DDEEFF;#DDEEFF;#8EC5FF;#DDEEFF;#DDEEFF"} />
      </path>
      {controller ? (
        <path clipRule="evenodd" d="M24.1421 14.7157C21.8545 12.4281 18.1455 12.4281 15.8579 14.7157L11.7157 18.8579C9.42809 21.1455 9.42809 24.8545 11.7157 27.1421L15.8579 31.2843C18.1455 33.5719 21.8545 33.5719 24.1421 31.2843L25.0463 30.3801L22.9837 28.3175L22.4853 28.816C21.1127 30.1886 18.8873 30.1886 17.5147 28.816L14.201 25.5023C12.8284 24.1297 12.8284 21.9043 14.201 20.5317L17.5147 17.218C18.8873 15.8454 21.1127 15.8454 22.4853 17.218L25.799 20.5317C27.1716 21.9043 27.1716 24.1297 25.799 25.5023L25.5519 25.7494L27.6144 27.812L28.2843 27.1421C30.5719 24.8545 30.5719 21.1455 28.2843 18.8579L24.1421 14.7157ZM21.218 20.0759C20.5317 19.3896 19.419 19.3896 18.7327 20.0759L17.0759 21.7327C16.3896 22.419 16.3896 23.5317 17.0759 24.218L18.7327 25.8749C19.419 26.5611 20.5317 26.5611 21.218 25.8749L22.8749 24.218C23.5611 23.5317 23.5611 22.419 22.8749 21.7327L21.218 20.0759Z" fill="white" fillRule="evenodd" />
      ) : (
        <path d="M16.1111 20.4V18C16.1111 16.9391 16.5208 15.9217 17.2501 15.1716C17.9794 14.4214 18.9686 14 20 14C21.0314 14 22.0206 14.4214 22.7499 15.1716C23.4792 15.9217 23.8889 16.9391 23.8889 18V20.4M20.7778 25.2C20.7778 25.6418 20.4296 26 20 26C19.5704 26 19.2222 25.6418 19.2222 25.2C19.2222 24.7582 19.5704 24.4 20 24.4C20.4296 24.4 20.7778 24.7582 20.7778 25.2ZM14.5556 20.4H25.4444C26.3036 20.4 27 21.1163 27 22V28.4C27 29.2837 26.3036 30 25.4444 30H14.5556C13.6964 30 13 29.2837 13 28.4V22C13 21.1163 13.6964 20.4 14.5556 20.4Z" stroke="#24292F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      )}
    </svg>
  );
}

export function AcpHeroDiagram() {
  return (
    <figure {...componentNameDebugProps("AcpHeroDiagram")} aria-label="QueryPie ACPのアクセス統制フロー" className="mx-auto w-full max-w-[1080px]">
      <div className="relative hidden h-[480px] w-full overflow-hidden xl:block">
        <div className="relative h-[480px] w-[1080px] origin-top-left">
          <div className="absolute left-0 top-0 flex h-[480px] w-[240px] flex-col items-center gap-5 overflow-hidden rounded-[16px] px-5 py-5">
            <div aria-hidden="true" className="absolute inset-0 z-0 bg-gradient-to-b from-white to-transparent" />
            <p className="relative z-20 text-center text-sm font-medium leading-5 text-[#24292F]">ユーザー</p>
            <div className="relative z-20 flex w-full flex-col gap-2.5">{heroRoles.map(([label, asset]) => <HeroDiagramItem key={label} label={label} asset={asset} />)}</div>
          </div>
          <img alt="" aria-hidden="true" className="absolute left-[220px] top-[88px] z-10 h-[264px] w-[640px]" src={`${heroDiagramAssetBase}/connections.svg`} />
          <svg aria-hidden="true" className="pointer-events-none absolute left-[220px] top-[88px] z-20 h-[264px] w-[640px] overflow-visible" fill="none" viewBox="0 0 640 266">
            <FlowPulse direction="inbound" path="M5.76576e-06 9L0.505293 9C22.5967 9 40.5053 26.9086 40.5053 49L40.5053 93.5053C40.5053 115.318 58.1877 133 80 133L180 133" />
            <FlowPulse direction="inbound" path="M-1.86364e-06 91L9.79973 91C24.4136 91 37.8643 98.9696 44.8836 111.787L45.2126 112.388C52.1725 125.098 65.5096 133 80 133L180 133" />
            <FlowPulse direction="inbound" path="M-1.86364e-06 175L9.79973 175C24.4136 175 37.8643 167.03 44.8836 154.213L45.2126 153.612C52.1725 140.902 65.5096 133 80 133L180 133" />
            <FlowPulse direction="inbound" path="M1.46468e-05 259L0.505302 259C22.5967 259 40.5053 241.091 40.5053 219L40.5053 172.495C40.5053 150.682 58.1877 133 80 133L180 133" />
            <FlowPulse direction="outbound" path="M460 133L560 133C581.812 133 599.495 115.318 599.495 93.5053L599.495 41C599.495 18.9086 617.403 0.999999 639.495 1L640 1" />
            <FlowPulse direction="outbound" path="M460 133L560 133L560.694 133C580.048 133 596.418 118.682 598.995 99.5C601.571 80.3177 617.941 66 637.296 66L640 66" />
            <FlowPulse direction="outbound" path="M460 133L640 133" />
            <FlowPulse direction="outbound" path="M460 133L560 133L560.694 133C580.048 133 596.418 147.318 598.995 166.5C601.571 185.682 617.941 200 637.296 200L640 200" />
            <FlowPulse direction="outbound" path="M460 133L560 133C581.812 133 599.495 150.682 599.495 172.495L599.495 225C599.495 247.091 617.403 265 639.495 265L640 265" />
          </svg>
          <div className="absolute left-[320px] top-[197px] z-30"><ShieldBadge /></div>
          <div className="absolute left-[720px] top-[197px] z-30"><ShieldBadge /></div>
          <div className="absolute left-[400px] top-0 flex h-[480px] w-[280px] flex-col items-center overflow-hidden rounded-[16px] px-9 pb-8 pt-10" style={{ background: `url(${heroDiagramAssetBase}/shield-mask.png) center/100% 100% no-repeat` }}>
            <div className="relative flex w-full flex-col items-center gap-10">
              <div className="flex w-full flex-col items-center gap-5">
                <ShieldBadge controller />
                <div className="flex w-full flex-col items-center gap-2.5">
                  <p className="whitespace-nowrap text-center text-lg font-medium leading-6 text-[#24292F]">QueryPie ACP</p>
                  <p className="rounded-full bg-[#F6F8FA] px-3 py-0.5 text-center text-xs font-light leading-[18px] text-[#24292F]">Access Control Platform</p>
                </div>
              </div>
              <div className="flex w-full flex-col gap-3.5">
                {heroControls.map(([label, asset]) => (
                  <div key={label} className="flex w-full items-center gap-2.5">
                    <img alt="" aria-hidden="true" className="h-[18px] w-[18px] shrink-0" src={`${heroDiagramAssetBase}/${asset}`} />
                    <span className="text-sm leading-5 text-[#24292F]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 flex h-[480px] w-[240px] flex-col items-center gap-5 overflow-hidden rounded-[16px] px-5 py-5">
            <div aria-hidden="true" className="absolute inset-0 z-0 bg-gradient-to-b from-white to-transparent" />
            <p className="relative z-20 text-center text-sm font-medium leading-5 text-[#24292F]">統制する対象</p>
            <div className="relative z-20 flex w-full flex-col gap-2.5">{heroTargets.map(([label, asset]) => <HeroDiagramItem key={label} label={label} asset={asset} compact emphasizeIcon />)}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 xl:hidden">
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
          {heroTargets.map(([label, asset]) => <HeroDiagramItem key={label} label={label} asset={asset} emphasizeIcon />)}
        </div>
      </div>
      <figcaption className="mx-auto mt-10 max-w-[1080px]">
        <div className="mx-auto max-w-[1000px] rounded-[16px] border border-[#B6D4FE] bg-[#EAF2FF] px-6 py-6 text-left sm:px-8">
          <p className="text-[19px] font-medium leading-[30px] tracking-[-0.02em] text-[#174EA6] sm:text-[21px] sm:leading-[32px]">
          アクセスを許可・禁止するだけでは、複雑化するインフラとAI活用を守り切れません。
          <br />
          QueryPie ACPは、統制の仕組みと対象環境を一つの基盤に集約します。
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

export function AcpFeatureSection({ children }: { children: ReactNode }) {
  return <PlatformContentSection {...componentNameDebugProps("AcpFeatureSection")} className="py-[100px]">{children}</PlatformContentSection>;
}

export function AcpFeatureInner({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AcpFeatureInner")} className="flex w-full max-w-[1200px] flex-col gap-[80px]">{children}</div>;
}

export function AcpFeatureIntro({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AcpFeatureIntro")} className="flex flex-col items-center gap-[20px] text-center">{children}</div>;
}

export function AcpSectionTitle({ children }: { children: ReactNode }) {
  return <h2 {...componentNameDebugProps("AcpSectionTitle")} className="text-[48px] font-normal leading-[56px] tracking-normal text-[#24292F] lg:text-[60px] lg:leading-[72px]">{children}</h2>;
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
  return <div {...componentNameDebugProps("AcpAiPackContent")} className="flex flex-col-reverse gap-8 lg:flex-row-reverse lg:items-start lg:gap-[60px]">{children}</div>;
}

export function AcpAiPackCardGrid({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AcpAiPackCardGrid")} className="grid w-full min-w-0 flex-1 gap-3">{children}</div>;
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
    <div {...componentNameDebugProps("AcpAiPackVideo")} className="w-full shrink-0 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black lg:w-[790px] lg:max-w-[65%]">
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
