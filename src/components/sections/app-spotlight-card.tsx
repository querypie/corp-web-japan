import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { componentNameDebugProps } from "@/lib/component-name-debug";

type AppSpotlightCardProps = {
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  ctaLabel: ReactNode;
  href: string;
  className?: string;
  flushX?: boolean;
};

export function AppSpotlightCard({
  eyebrow,
  title,
  description,
  ctaLabel,
  href,
  className,
  flushX = false,
}: AppSpotlightCardProps) {
  return (
    <section
      {...componentNameDebugProps("AppSpotlightCard")}
      className={`mx-auto w-full max-w-[1200px] ${flushX ? "px-0" : "px-6 lg:px-0"} py-16 lg:py-24 ${className ?? ""}`}
    >
      <div className="flex flex-col gap-8 rounded-[28px] border border-[#d9d9d9] bg-[linear-gradient(135deg,#e9e2ff_0%,#dff2ff_54%,#f4e8f2_100%)] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:p-12">
        <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start">
          <Image
            src="https://www.querypie.com/assets/pages/home/features/icon-lingo.png"
            alt=""
            width={128}
            height={128}
            unoptimized
            className="h-16 w-16 shrink-0 rounded-[14px]"
          />
          <div>
            <p className="text-sm font-medium text-slate-600">{eyebrow}</p>
            <h2 className="mt-2 text-[28px] font-medium leading-[1.25] tracking-[-0.02em] text-slate-950 lg:text-[36px]">
              {title}
            </h2>
            <p className="mt-4 max-w-[680px] text-base leading-7 text-slate-700">
              {description}
            </p>
          </div>
        </div>
        <Link
          href={href}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {ctaLabel} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
