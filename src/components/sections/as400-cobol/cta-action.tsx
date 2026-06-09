import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { componentNameDebugProps } from "@/lib/component-name-debug";

type As400CobolCtaActionProps = {
  href: string;
  children: ReactNode;
};

export function As400CobolCtaAction({ href, children }: As400CobolCtaActionProps) {
  return (
    <Link
      {...componentNameDebugProps("As400CobolCtaAction")}
      href={href}
      className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[8px] bg-[linear-gradient(135deg,#0f3d6e_0%,#0f766e_58%,#2563eb_100%)] px-6 py-3 text-[15px] font-semibold leading-6 text-white shadow-[0_22px_46px_-24px_rgba(15,61,110,0.72)] transition hover:brightness-[1.05] hover:shadow-[0_26px_58px_-26px_rgba(15,61,110,0.82)]"
    >
      <span>{children}</span>
      <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
    </Link>
  );
}
