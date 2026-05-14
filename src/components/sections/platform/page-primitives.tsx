import type { ReactNode } from "react";

const joinClassNames = (...classNames: Array<string | false | null | undefined>) => classNames.filter(Boolean).join(" ");

type ChildrenProps = {
  children: ReactNode;
};

type PlatformPageSectionProps = ChildrenProps & {
  className?: string;
};

type PlatformFeatureSectionProps = ChildrenProps & {
  muted?: boolean;
};

export function PlatformPageShell({ children }: ChildrenProps) {
  return <main className="relative overflow-x-hidden bg-white text-slate-950">{children}</main>;
}

export function PlatformPageSection({ children, className }: PlatformPageSectionProps) {
  return <section className={joinClassNames("flex justify-center px-6 lg:px-0", className)}>{children}</section>;
}

export function PlatformHeroSection({ children }: ChildrenProps) {
  return <PlatformPageSection className="pb-[120px] pt-[80px]">{children}</PlatformPageSection>;
}

export function PlatformFeatureSection({ children, muted = false }: PlatformFeatureSectionProps) {
  return <PlatformPageSection className={joinClassNames("py-[80px]", muted ? "bg-[#F6F8FA]" : "bg-white")}>{children}</PlatformPageSection>;
}

export function PlatformCtaSection({ children }: ChildrenProps) {
  return <section className="flex w-full flex-col items-center gap-[40px] bg-[#F6F8FA] px-[24px] py-[120px]">{children}</section>;
}
