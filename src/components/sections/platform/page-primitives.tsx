import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

const joinClassNames = (...classNames: Array<string | false | null | undefined>) => classNames.filter(Boolean).join(" ");

type ChildrenProps = {
  children: ReactNode;
};

type PlatformPageShellProps = ChildrenProps & Omit<ComponentPropsWithoutRef<"main">, "children" | "className">;

type PlatformContentSectionProps<T extends ElementType = "section"> = ChildrenProps & {
  as?: T;
  className?: string;
  contentClassName?: string;
  contentWidthClassName?: string;
  paddingClassName?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

type PlatformFeatureSectionProps = ChildrenProps & {
  muted?: boolean;
};

type PlatformCtaSectionProps = ChildrenProps & {
  className?: string;
};

export function PlatformPageShell({ children, ...props }: PlatformPageShellProps) {
  return <main className="relative overflow-x-hidden bg-white text-slate-950" {...props}>{children}</main>;
}

export function PlatformContentSection<T extends ElementType = "section">({
  as,
  children,
  className,
  contentClassName,
  contentWidthClassName,
  paddingClassName = "px-6 lg:px-0",
  ...props
}: PlatformContentSectionProps<T>) {
  const Component = (as ?? "section") as ElementType;
  const contentClassNames = joinClassNames("w-full", contentWidthClassName ?? "max-w-[1200px]", contentClassName);

  return (
    <Component className={joinClassNames("flex justify-center", paddingClassName, className)} {...props}>
      {contentClassName || contentWidthClassName ? <div className={contentClassNames}>{children}</div> : children}
    </Component>
  );
}

export function PlatformPageSection({ children }: ChildrenProps) {
  return <PlatformContentSection className="pb-[120px] pt-[120px] lg:pt-[144px]">{children}</PlatformContentSection>;
}

export function PlatformHeroSection({ children }: ChildrenProps) {
  return <PlatformPageSection>{children}</PlatformPageSection>;
}

export function PlatformFeatureSection({ children, muted = false }: PlatformFeatureSectionProps) {
  return <PlatformContentSection className={joinClassNames("py-[80px]", muted ? "bg-[#F6F8FA]" : "bg-white")}>{children}</PlatformContentSection>;
}

export function PlatformCtaSection({ children, className }: PlatformCtaSectionProps) {
  return <section className={joinClassNames("flex w-full flex-col items-center gap-[40px] bg-[#F6F8FA] px-[24px] py-[120px]", className)}>{children}</section>;
}
