import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarketingPillProps = {
  children: ReactNode;
  className?: string;
};

export function MarketingPill({ children, className }: MarketingPillProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.08em]",
        className,
      )}
    >
      {children}
    </div>
  );
}

type MarketingIconFrameProps = {
  children: ReactNode;
  className?: string;
};

export function MarketingIconFrame({ children, className }: MarketingIconFrameProps) {
  return (
    <div
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-[14px] shadow-[0_16px_34px_-24px_rgba(15,23,42,0.18)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

type MarketingSurfaceProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function MarketingSurface<T extends ElementType = "div">({
  as,
  children,
  className,
  ...props
}: MarketingSurfaceProps<T>) {
  const Component = (as ?? "div") as ElementType;

  return (
    <Component
      className={cn(
        "border border-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

type MarketingSectionIntroProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  bodyClassName?: string;
};

export function MarketingSectionIntro({
  eyebrow,
  title,
  body,
  className,
  eyebrowClassName,
  titleClassName,
  bodyClassName,
}: MarketingSectionIntroProps) {
  return (
    <div className={cn("mx-auto max-w-[900px] text-center", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b]",
            eyebrowClassName,
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "text-[30px] font-semibold leading-[1.2] tracking-[-0.04em] text-slate-950 sm:text-[42px]",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {body ? (
        <div
          className={cn(
            "mx-auto mt-5 text-[15px] text-slate-600",
            bodyClassName,
          )}
        >
          {body}
        </div>
      ) : null}
    </div>
  );
}
