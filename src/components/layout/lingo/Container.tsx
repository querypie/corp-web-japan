import { cn } from "@/lib/lingo/utils"
import { componentNameDebugProps } from "@/lib/component-name-debug";
import type { ComponentPropsWithoutRef } from "react";

interface ContainerProps extends Omit<ComponentPropsWithoutRef<"div">, "children" | "className"> {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div {...componentNameDebugProps("Container")} className="w-full page-gutter">
      <div {...props} className={cn("container-main w-full", className)}>{children}</div>
    </div>
  )
}
