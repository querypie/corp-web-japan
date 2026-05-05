import Link from "next/link";
import type { ReactNode } from "react";

type BrandGradientCtaButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  geometryClassName?: string;
  labelClassName?: string;
  iconWrapClassName?: string;
  iconClassName?: string;
  target?: "_blank" | "_self";
  rel?: string;
};

export function BrandGradientCtaButton({
  href,
  children,
  className,
  geometryClassName,
  labelClassName,
  iconWrapClassName,
  iconClassName,
  target = "_blank",
  rel = "noopener noreferrer",
}: BrandGradientCtaButtonProps) {
  const baseClassName = "inline-flex items-center justify-center text-[#F6F6F6] transition hover:brightness-[1.04]";
  const resolvedGeometryClassName =
    geometryClassName ??
    "min-h-[52px] gap-[9.375px] rounded-[5.625px] bg-[linear-gradient(100deg,#0762D4_34.93%,#875AC5_76.81%,#C55A8C_99.98%)] px-[26.25px] py-[13.125px] text-[15px] font-medium";
  const resolvedLabelClassName = labelClassName ?? "block";
  const resolvedIconWrapClassName = iconWrapClassName ?? "inline-flex h-3 w-[7px] items-center justify-center";
  const resolvedIconClassName = iconClassName ?? "h-3 w-[7px]";

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={[baseClassName, resolvedGeometryClassName, className].filter(Boolean).join(" ")}
    >
      <span className={resolvedLabelClassName}>{children}</span>
      <span aria-hidden="true" className={resolvedIconWrapClassName}>
        <svg viewBox="0 0 7 12" className={resolvedIconClassName} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 6L0.865033 12L0 11.154L5.26381 6L0 0.846L0.865033 0L7 6Z" fill="currentColor" />
        </svg>
      </span>
    </Link>
  );
}
