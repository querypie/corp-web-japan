import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type LegalDocumentSectionProps = {
  children?: ReactNode;
};

type LegalDocumentIntroProps = {
  children?: ReactNode;
  divider?: boolean;
  className?: string;
};

type LegalDocumentHeroProps = {
  title: ReactNode;
  meta?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  divider?: boolean;
  titleVariant?: "hero" | "compact";
  className?: string;
};

type LegalDocumentTitleProps = {
  children?: ReactNode;
  variant?: "hero" | "compact";
};

type LegalDocumentLayoutProps = {
  children?: ReactNode;
  className?: string;
};

type LegalDocumentBodyProps = {
  children?: ReactNode;
  className?: string;
};

export const legalDocumentBodyClassName = [
  "text-[16px] leading-[26px] text-slate-600",
  "[&_a]:font-inherit [&_a]:text-slate-950 [&_a]:underline [&_a]:decoration-[1px] [&_a]:underline-offset-[3px] hover:[&_a]:text-slate-950",
  "[&_h2]:mt-20 [&_h2]:text-[32px] [&_h2]:font-normal [&_h2]:leading-[1.375] [&_h2]:tracking-[-0.01em] [&_h2]:text-slate-950",
  "[&_h3]:mt-10 [&_h3]:text-[22px] [&_h3]:font-normal [&_h3]:leading-[1.455] [&_h3]:tracking-[-0.01em] [&_h3]:text-slate-950",
  "[&_h4]:mt-10 [&_h4]:text-[15px] [&_h4]:font-medium [&_h4]:leading-7 [&_h4]:text-slate-950",
  "[&_p]:mt-[1.3125rem] [&_p]:text-[16px] [&_p]:leading-[26px] [&_p]:text-slate-600",
  "[&_h2+_p]:mt-[1.3125rem] [&_h3+_p]:mt-[1.3125rem] [&_h4+_p]:mt-[1.3125rem]",
  "[&_ul]:mt-[1.3125rem] [&_ul]:list-disc [&_ul]:pl-4",
  "[&_ol]:mt-[1.3125rem] [&_ol]:list-decimal [&_ol]:pl-4",
  "[&_li]:mb-2 [&_li]:text-[15px] [&_li]:leading-7 [&_li]:text-slate-600",
  "[&_strong]:font-medium [&_strong]:text-slate-950 [&_a_strong]:font-inherit [&_a_strong]:text-inherit",
  "[&_blockquote]:my-[20px] [&_blockquote]:border-l [&_blockquote]:border-[#d1d5db] [&_blockquote]:pl-[30px]",
  "[&_blockquote_p]:mt-0 [&_blockquote_p]:text-[16px] [&_blockquote_p]:leading-[26px] [&_blockquote_p]:text-slate-600",
  "[&_blockquote_li]:text-[15px] [&_blockquote_li]:leading-7 [&_blockquote_li]:text-slate-600",
  "[&_table]:my-[34px] [&_table]:w-full [&_table]:border-collapse [&_table]:border-t [&_table]:border-b [&_table]:border-[#d1d5db] [&_table]:text-sm",
  "[&_th]:border-b [&_th]:border-[#d1d5db] [&_th]:bg-[#f9f9fb] [&_th]:px-5 [&_th]:py-[14px] [&_th]:text-left [&_th]:font-medium [&_th]:leading-[1.5] [&_th]:text-slate-950",
  "[&_td]:border-b [&_td]:border-[#e5e7eb] [&_td]:px-5 [&_td]:py-[14px] [&_td]:align-top [&_td]:leading-6 [&_td]:text-slate-600",
  "[&_tr:nth-child(even)_td]:bg-[#f6f8fa]",
  "[&_tr:last-child_td]:border-b-0",
  "[&_.article-content-btn]:mb-7 [&_.article-content-btn]:flex [&_.article-content-btn]:w-full [&_.article-content-btn]:items-center [&_.article-content-btn]:justify-center [&_.article-content-btn]:gap-2 [&_.article-content-btn]:rounded-[6px] [&_.article-content-btn]:bg-[#111827] [&_.article-content-btn]:px-8 [&_.article-content-btn]:py-[10px] [&_.article-content-btn]:text-base [&_.article-content-btn]:font-medium [&_.article-content-btn]:text-white [&_.article-content-btn]:no-underline hover:[&_.article-content-btn]:opacity-85 hover:[&_.article-content-btn]:text-white",
  "[&_p+_.article-content-btn]:mt-4 [&_ul+_.article-content-btn]:mt-4 [&_ol+_.article-content-btn]:mt-4",
  "[&_hr]:hidden",
  "[&>br]:hidden",
].join(" ");

export function LegalDocumentSection({ children }: LegalDocumentSectionProps) {
  return (
    <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[120px] pt-[112px] lg:px-[30px] lg:pb-[160px] lg:pt-[144px]">
      <div className="mx-auto max-w-[1200px]">{children}</div>
    </section>
  );
}

export function LegalDocumentIntro({ children, divider = false, className }: LegalDocumentIntroProps) {
  return (
    <header
      className={cn(divider ? "mb-12 border-b border-slate-200 pb-8" : "mb-8 lg:mb-10", className)}
    >
      {children}
    </header>
  );
}

export function LegalDocumentLayout({ children, className }: LegalDocumentLayoutProps) {
  return <div className={cn("flex w-full flex-col", className)}>{children}</div>;
}

export function LegalDocumentPageSection({ children }: LegalDocumentSectionProps) {
  return <LegalDocumentSection>{children}</LegalDocumentSection>;
}

export function LegalDocumentHeader({ children, divider = false, className }: LegalDocumentIntroProps) {
  return (
    <LegalDocumentIntro divider={divider} className={className}>
      {children}
    </LegalDocumentIntro>
  );
}

export function LegalDocumentHero({
  title,
  meta,
  description,
  children,
  divider = false,
  titleVariant = "hero",
  className,
}: LegalDocumentHeroProps) {
  return (
    <LegalDocumentIntro divider={divider} className={cn(children && "flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-3">
        {meta ? <LegalDocumentMeta>{meta}</LegalDocumentMeta> : null}
        <LegalDocumentTitle variant={titleVariant}>{title}</LegalDocumentTitle>
        {description ? <LegalDocumentLead>{description}</LegalDocumentLead> : null}
      </div>
      {children}
    </LegalDocumentIntro>
  );
}

export function LegalDocumentMeta({ children }: LegalDocumentSectionProps) {
  return <p className="text-sm leading-6 text-slate-500">{children}</p>;
}

export function LegalDocumentTitle({ children, variant = "hero" }: LegalDocumentTitleProps) {
  return (
    <h1
      className={
        variant === "compact"
          ? "text-[34px] font-normal leading-[1.2] text-slate-950 lg:text-[40px]"
          : "text-[60px] font-normal leading-[1.2] tracking-[-0.02em] text-slate-950"
      }
    >
      {children}
    </h1>
  );
}

export function LegalDocumentLead({ children }: LegalDocumentSectionProps) {
  return <p className="text-[15px] leading-7 text-slate-600">{children}</p>;
}

export function LegalDocumentDescription({ children }: LegalDocumentSectionProps) {
  return <LegalDocumentLead>{children}</LegalDocumentLead>;
}

export function LegalDocumentBody({ children, className }: LegalDocumentBodyProps) {
  return <div className={cn(legalDocumentBodyClassName, className)}>{children}</div>;
}
