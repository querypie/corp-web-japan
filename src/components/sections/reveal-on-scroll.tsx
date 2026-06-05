"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { componentNameDebugProps } from "@/lib/component-name-debug";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  variant?: "up" | "left" | "right" | "scale";
  delayMs?: number;
} & Omit<ComponentPropsWithoutRef<"div">, "children" | "className">;

const variantClassMap = {
  up: "translate-y-6",
  left: "-translate-x-6",
  right: "translate-x-6",
  scale: "scale-[0.98]",
} as const;

export function RevealOnScroll({
  children,
  className = "",
  variant = "up",
  delayMs = 0,
  style,
  ...props
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div {...componentNameDebugProps("RevealOnScroll")} {...props}
      ref={ref}
      style={{ ...style, transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible ? "translate-x-0 translate-y-0 scale-100 opacity-100" : `${variantClassMap[variant]} opacity-0`
      } ${className}`}
    >
      {children}
    </div>
  );
}
