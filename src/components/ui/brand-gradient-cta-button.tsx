import Link from "next/link";
import type { ReactNode } from "react";

type BrandGradientCtaButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  target?: "_blank" | "_self";
  rel?: string;
};

export function BrandGradientCtaButton({ href, children, className, target = "_blank", rel = "noopener noreferrer" }: BrandGradientCtaButtonProps) {
  const baseClassName =
    "inline-flex min-h-[46.875px] items-center justify-center gap-[9.375px] rounded-[5.625px] bg-[linear-gradient(100deg,#0762D4_34.93%,#875AC5_76.81%,#C55A8C_99.98%)] px-[26.25px] py-[13.125px] text-[15px] font-normal leading-[15px] text-[#F6F6F6] transition hover:brightness-[1.04]";
  const labelClassName = "block text-[14.0625px] font-normal leading-[20.625px]";
  const iconWrapClassName = "inline-flex h-[11.25px] w-[11.25px] items-center justify-center";
  const iconClassName = "h-[11.25px] w-[6.5625px]";

  return (
    <Link href={href} target={target} rel={rel} className={[baseClassName, className].filter(Boolean).join(" ")}>
      <span className={labelClassName}>{children}</span>
      <span aria-hidden="true" className={iconWrapClassName}>
        <svg viewBox="0 0 7 12" className={iconClassName} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 6L0.865033 12L0 11.154L5.26381 6L0 0.846L0.865033 0L7 6Z" fill="currentColor" />
        </svg>
      </span>
    </Link>
  );
}
