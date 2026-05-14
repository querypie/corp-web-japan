import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { PlatformContentSection, PlatformCtaSection } from "@/components/sections/platform/page-primitives";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type ClassNameProps = {
  className?: string;
  style?: CSSProperties;
};

export function McpGatewayHeroSection({ children, className }: { children: ReactNode } & ClassNameProps) {
  return <section className={cx("w-full pb-[117px] pt-[75px]", className)}>{children}</section>;
}

export function McpGatewayHeroCopy({ children, className }: { children: ReactNode } & ClassNameProps) {
  return <div className={cx("mx-auto max-w-[1200px] px-10 pt-[155px] lg:px-10", className)}>{children}</div>;
}

export function McpGatewayHeroHeading({ children, className }: { children: ReactNode } & ClassNameProps) {
  return <h1 className={cx("mx-auto max-w-[620px] text-center text-[48px] font-normal leading-[56px] tracking-normal text-[#24292F] lg:text-[60px] lg:leading-[72px]", className)}>{children}</h1>;
}

export function McpGatewayHeroBody({ children, className }: { children: ReactNode } & ClassNameProps) {
  return <p className={cx("mx-auto mt-[18px] max-w-[743px] text-center text-[18px] font-light leading-[28px] tracking-normal text-[#57606A]", className)}>{children}</p>;
}

export function McpGatewayHeroVisual({ className = "", imageClassName = "" }: { className?: string; imageClassName?: string }) {
  return (
    <div className={cx("mt-[10px] flex justify-center", className)}>
      <div className="w-full max-w-[1200px]">
        <Image
          src="/solutions/aip/mcp-gateway/hero.svg"
          alt="MCP Gateway"
          width={1200}
          height={638}
          priority
          className={cx("h-auto w-full max-w-full", imageClassName)}
        />
      </div>
    </div>
  );
}

export function McpGatewayFeatureBand({
  children,
  muted = false,
  className,
  style,
}: { children: ReactNode; muted?: boolean } & ClassNameProps) {
  return (
    <PlatformContentSection
      className={cx("w-full py-[80px]", muted && "bg-[#F6F8FA]", className)}
      contentClassName="px-10 lg:px-10"
      paddingClassName=""
      style={style}
    >
      {children}
    </PlatformContentSection>
  );
}

export function McpGatewayFeatureLayout({
  children,
  reverse = false,
  className,
}: { children: ReactNode; reverse?: boolean } & ClassNameProps) {
  return (
    <div className={cx("flex flex-col items-center justify-between gap-[40px] lg:gap-[74px]", reverse ? "lg:flex-row-reverse" : "lg:flex-row", className)}>
      {children}
    </div>
  );
}

export function McpGatewayFeatureCopy({ children, className }: { children: ReactNode } & ClassNameProps) {
  return <div className={cx("w-full max-w-full shrink-0", className)}>{children}</div>;
}

export function McpGatewayFeatureTitle({ children, className }: { children: ReactNode } & ClassNameProps) {
  return <h4 className={cx("text-[32px] font-medium leading-[42px] tracking-normal text-[#24292F]", className)}>{children}</h4>;
}

export function McpGatewayFeatureDescription({ children, className }: { children: ReactNode } & ClassNameProps) {
  return <p className={cx("mt-[19px] text-[16px] font-light leading-[26px] tracking-normal text-[#57606A]", className)}>{children}</p>;
}

export function McpGatewayFeatureChecklist({ className }: ClassNameProps) {
  return <ul aria-hidden="true" className={cx("mt-[18px] min-h-[24px]", className)} />;
}

export function McpGatewayFeatureVisual({ children, className }: { children: ReactNode } & ClassNameProps) {
  return <div className={cx("w-full max-w-full shrink-0", className)}>{children}</div>;
}

export function McpGatewayFeatureImage({
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
  className?: string;
}) {
  return (
    <div className={cx("overflow-hidden rounded-none shadow-[0_22px_55px_-45px_rgba(15,23,42,0.45)]", className)}>
      <Image src={src} alt={alt} width={width} height={height} unoptimized className="h-auto w-full" />
    </div>
  );
}

export function McpGatewayCtaSection({ children, className }: { children: ReactNode } & ClassNameProps) {
  return <PlatformCtaSection className={className}>{children}</PlatformCtaSection>;
}

export function McpGatewayCtaContent({ children, className }: { children: ReactNode } & ClassNameProps) {
  return <div className={cx("mx-auto flex max-w-[1200px] flex-col items-center text-center", className)}>{children}</div>;
}

export function McpGatewayCtaCopy({ children, className }: { children: ReactNode } & ClassNameProps) {
  return <div className={cx("w-full max-w-[841px]", className)}>{children}</div>;
}

export function McpGatewayCtaTitle({ children, className }: { children: ReactNode } & ClassNameProps) {
  return <h2 className={cx("whitespace-nowrap text-[52px] font-normal leading-[62px] tracking-normal text-[#24292F]", className)}>{children}</h2>;
}

export function McpGatewayCtaDescription({ children, className }: { children: ReactNode } & ClassNameProps) {
  return <p className={cx("mt-[18.75px] text-[16px] font-light leading-[26px] tracking-normal text-[#24292F]", className)}>{children}</p>;
}

export function McpGatewayCtaActions({ children, className }: { children: ReactNode } & ClassNameProps) {
  return <div className={cx("mt-[40px] flex justify-center", className)}>{children}</div>;
}

export function McpGatewayCtaButton({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(
        "inline-flex min-h-[50px] items-center justify-center gap-[10px] rounded-[6px] bg-[linear-gradient(100deg,#0762D4_34.93%,#875AC5_76.81%,#C55A8C_99.98%)] px-[28px] py-[14px] text-[15px] font-normal leading-[16px] text-[#F6F6F6] transition hover:brightness-[1.04]",
        className,
      )}
    >
      <span className="block text-[15px] font-normal leading-[15px]">{children}</span>
      <span aria-hidden="true" className="inline-flex h-[12px] w-[12px] items-center justify-center text-[#F6F6F6]">
        <svg viewBox="0 0 7 12" className="h-[12px] w-[7px]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 6L0.865033 12L0 11.154L5.26381 6L0 0.846L0.865033 0L7 6Z" fill="currentColor" />
        </svg>
      </span>
    </Link>
  );
}
