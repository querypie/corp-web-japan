import { cn } from "@/lib/lingo/utils"

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className="w-full page-gutter">
      <div className={cn("container-main w-full", className)}>{children}</div>
    </div>
  )
}
