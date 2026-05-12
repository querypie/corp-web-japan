import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { BrandGradientCtaButton } from "@/components/ui/brand-gradient-cta-button";

type ClassNameProps = {
  className?: string;
  style?: CSSProperties;
};

type SectionWithContentProps = ClassNameProps & {
  contentClassName?: string;
};


export function SimpleCtaSection({
  children,
  className = "",
  contentClassName = "",
  style,
}: { children: ReactNode } & SectionWithContentProps) {
  return (
    <section
      className={`mx-auto max-w-[1920px] bg-[#F6F8FA] px-[22.5px] pb-[112.5px] pt-[112.5px] text-center lg:px-[22.5px] lg:pb-[112.5px] lg:pt-[112.5px] ${className}`.trim()}
      style={style}
    >
      <div className={`mx-auto max-w-[1200px] ${contentClassName}`.trim()}>{children}</div>
    </section>
  );
}

export function CtaContent({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <div className={`mx-auto flex max-w-[1200px] flex-col items-center gap-[37.5px] ${className}`.trim()}>{children}</div>;
}

export function CtaCopy({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <div className={`w-full ${className}`.trim()}>{children}</div>;
}

export function CtaBox({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return (
    <div className={`rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-6 py-8 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.24)] sm:px-8 sm:py-10 lg:px-12 lg:py-12 ${className}`.trim()}>
      {children}
    </div>
  );
}

export function CtaTitle({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <h2 className={`text-[52px] font-normal leading-[62px] tracking-normal text-slate-950 sm:text-[52px] ${className}`.trim()}>{children}</h2>;
}

export function CtaDescription({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <p className={`mt-[19.2px] max-w-full text-[16px] font-light leading-[26px] tracking-[0.36px] text-[#24292F] ${className}`.trim()}>{children}</p>;
}

export function CtaActions({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <div className={`flex justify-center ${className}`.trim()}>{children}</div>;
}

export function CtaButton({
  href,
  variant = "primary",
  children,
  className = "",
}: {
  href: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={
        (
          variant === "primary"
            ? "inline-flex min-h-[46px] items-center justify-center rounded-[10px] bg-[#15181d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            : "inline-flex min-h-[46px] items-center justify-center rounded-[10px] border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
        ) + ` ${className}`
      }
    >
      {children}
    </Link>
  );
}

export function FreeTrialCtaSection() {
  return (
    <SimpleCtaSection>
      <CtaContent>
        <CtaCopy>
          <CtaTitle>まずは小さく、失敗しないAXを始めよう</CtaTitle>
          <CtaDescription>簡単サインアップで、14日間の無料トライアルをお試しください</CtaDescription>
        </CtaCopy>
        <CtaActions>
          <BrandGradientCtaButton href="https://app.querypie.com/">無料で試してみる</BrandGradientCtaButton>
        </CtaActions>
      </CtaContent>
    </SimpleCtaSection>
  );
}
