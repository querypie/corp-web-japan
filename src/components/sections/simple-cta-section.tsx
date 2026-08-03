import Link from "next/link";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { componentNameDebugProps } from "@/lib/component-name-debug";

type ClassNameProps = {
  className?: string;
  style?: CSSProperties;
};

type SectionWithContentProps = ClassNameProps & {
  contentClassName?: string;
  background?: "muted" | "white";
} & Omit<ComponentPropsWithoutRef<"section">, "children" | "className" | "style">;

const simpleCtaBackgroundClass = {
  muted: "bg-[#F6F8FA]",
  white: "bg-white",
} as const;


export function SimpleCtaSection({
  children,
  background = "muted",
  className = "",
  contentClassName = "",
  style,
  ...props
}: { children: ReactNode } & SectionWithContentProps) {
  return (
    <section {...componentNameDebugProps("SimpleCtaSection")}
      className={`mx-auto max-w-[1920px] ${simpleCtaBackgroundClass[background]} px-[22.5px] pb-[112.5px] pt-[112.5px] text-center lg:px-[22.5px] lg:pb-[112.5px] lg:pt-[112.5px] ${className}`.trim()}
      style={style}
    >
      <div {...props} className={`mx-auto max-w-[1200px] ${contentClassName}`.trim()}>{children}</div>
    </section>
  );
}

export function CtaContent({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <div {...componentNameDebugProps("CtaContent")} className={`mx-auto flex max-w-[1200px] flex-col items-center gap-[37.5px] ${className}`.trim()}>{children}</div>;
}

export function CtaCopy({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <div {...componentNameDebugProps("CtaCopy")} className={`w-full ${className}`.trim()}>{children}</div>;
}

export function CtaBox({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return (
    <div className={`rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-6 py-8 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.24)] sm:px-8 sm:py-10 lg:px-12 lg:py-12 ${className}`.trim()}>
      {children}
    </div>
  );
}

export function CtaTitle({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <h2 {...componentNameDebugProps("CtaTitle")} className={`text-[52px] font-normal leading-[62px] tracking-normal text-slate-950 sm:text-[52px] ${className}`.trim()}>{children}</h2>;
}

export function CtaDescription({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <p {...componentNameDebugProps("CtaDescription")} className={`mt-[19.2px] max-w-full text-[16px] font-light leading-[26px] tracking-[0.36px] text-[#24292F] ${className}`.trim()}>{children}</p>;
}

export function CtaActions({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <div {...componentNameDebugProps("CtaActions")} className={`flex justify-center gap-3 ${className}`.trim()}>{children}</div>;
}

export function CtaButton({
  href,
  variant = "primary",
  children,
  className = "",
  target,
  rel,
}: {
  href: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
  className?: string;
  target?: "_blank" | "_self";
  rel?: string;
}) {
  return (
    <Link
      {...componentNameDebugProps("CtaButton")}
      href={href}
      target={target}
      rel={rel}
      className={
        (
          variant === "primary"
            ? "inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[10px] bg-[#15181d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            : "inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[10px] border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
        ) + ` ${className}`
      }
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
    </Link>
  );
}

export function AipFreeTrialCtaSection({ background = "muted" }: Pick<SectionWithContentProps, "background">) {
  return (
    <SimpleCtaSection {...componentNameDebugProps("AipFreeTrialCtaSection")} background={background}>
      <CtaContent>
        <CtaCopy>
          <CtaTitle>まずは日常業務から、AI活用を始めよう。</CtaTitle>
          <CtaDescription>情報収集や文書作成など、日々の業務から。14日間無料でQueryPie AIPをお試しいただけます。</CtaDescription>
        </CtaCopy>
        <CtaActions className="flex-col sm:flex-row">
          <CtaButton href="https://app.querypie.com/" target="_blank" rel="noopener noreferrer">14日間無料で始める</CtaButton>
          <CtaButton href="/introduction-deck/1/querypie-aip" variant="secondary">資料をダウンロード</CtaButton>
        </CtaActions>
      </CtaContent>
    </SimpleCtaSection>
  );
}
