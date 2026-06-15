import type { ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Braces,
  CheckCircle2,
  CloudCog,
  Code2,
  Database,
  FileSearch,
  GitBranch,
  Landmark,
  Network,
  Route,
  ServerCog,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { componentNameDebugProps } from "@/lib/component-name-debug";

const iconMap = {
  analysis: FileSearch,
  api: Network,
  architecture: GitBranch,
  book: BookOpen,
  brain: BrainCircuit,
  check: CheckCircle2,
  cloud: CloudCog,
  code: Code2,
  database: Database,
  flow: Workflow,
  host: ServerCog,
  legacy: Landmark,
  route: Route,
  security: ShieldCheck,
  source: Braces,
} as const;

type IconName = keyof typeof iconMap;

type IconBadgeProps = {
  icon: IconName;
};

function IconBadge({ icon }: IconBadgeProps) {
  const Icon = iconMap[icon];

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#e8f4f2] text-[#0f766e]">
      <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
    </span>
  );
}

export function As400CobolStatGrid({ children }: { children: ReactNode }) {
  return (
    <div
      {...componentNameDebugProps("As400CobolStatGrid")}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      {children}
    </div>
  );
}

export function As400CobolStatCard({
  value,
  label,
  description,
}: {
  value: string;
  label: string;
  description: string;
}) {
  return (
    <article
      {...componentNameDebugProps("As400CobolStatCard")}
      className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-44px_rgba(15,23,42,0.24)]"
    >
      <p className="text-[28px] font-semibold leading-9 text-slate-950">{value}</p>
      <h3 className="mt-2 text-[15px] font-semibold leading-6 text-slate-950">
        {label}
      </h3>
      <p className="mt-2 text-[13px] leading-6 text-slate-600">{description}</p>
    </article>
  );
}

export function As400CobolTextColumns({ children }: { children: ReactNode }) {
  return (
    <div
      {...componentNameDebugProps("As400CobolTextColumns")}
      className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]"
    >
      {children}
    </div>
  );
}

export function As400CobolBodyText({ children }: { children: ReactNode }) {
  return (
    <div
      {...componentNameDebugProps("As400CobolBodyText")}
      className="space-y-5 text-[16px] leading-8 text-slate-600"
    >
      {children}
    </div>
  );
}

export function As400CobolInsightList({ children }: { children: ReactNode }) {
  return (
    <ul
      {...componentNameDebugProps("As400CobolInsightList")}
      className="grid gap-3"
    >
      {children}
    </ul>
  );
}

export function As400CobolInsightItem({
  icon,
  title,
  children,
}: {
  icon: IconName;
  title: string;
  children: ReactNode;
}) {
  return (
    <li
      {...componentNameDebugProps("As400CobolInsightItem")}
      className="flex gap-4 rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-44px_rgba(15,23,42,0.18)]"
    >
      <IconBadge icon={icon} />
      <div>
        <h3 className="text-[17px] font-semibold leading-6 text-slate-950">{title}</h3>
        <p className="mt-2 text-[14px] leading-7 text-slate-600">{children}</p>
      </div>
    </li>
  );
}

export function As400CobolDiagramRail({ children }: { children: ReactNode }) {
  return (
    <div
      {...componentNameDebugProps("As400CobolDiagramRail")}
      className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]"
    >
      {children}
    </div>
  );
}

export function As400CobolDiagramArrow() {
  return (
    <div
      {...componentNameDebugProps("As400CobolDiagramArrow")}
      aria-hidden="true"
      className="hidden items-center justify-center text-slate-300 lg:flex"
    >
      <ArrowRight className="h-5 w-5" strokeWidth={2} />
    </div>
  );
}

export function As400CobolDiagramStage({
  icon,
  eyebrow,
  title,
  children,
}: {
  icon: IconName;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article
      {...componentNameDebugProps("As400CobolDiagramStage")}
      className="flex min-h-[260px] flex-col rounded-[8px] border border-slate-200 bg-white p-6 shadow-[0_24px_58px_-46px_rgba(15,23,42,0.24)]"
    >
      <div className="flex items-start gap-4">
        <IconBadge icon={icon} />
        <div>
          <p className="text-[12px] font-semibold uppercase leading-5 tracking-[0.08em] text-[#0f766e]">
            {eyebrow}
          </p>
          <h3 className="mt-1 text-[20px] font-semibold leading-7 text-slate-950">
            {title}
          </h3>
        </div>
      </div>
      <div className="mt-5 text-[14px] leading-7 text-slate-600">{children}</div>
    </article>
  );
}

export function As400CobolMiniList({ children }: { children: ReactNode }) {
  return (
    <ul
      {...componentNameDebugProps("As400CobolMiniList")}
      className="space-y-2"
    >
      {children}
    </ul>
  );
}

export function As400CobolMiniListItem({ children }: { children: ReactNode }) {
  return (
    <li
      {...componentNameDebugProps("As400CobolMiniListItem")}
      className="flex gap-2"
    >
      <span aria-hidden="true" className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0f766e]" />
      <span>{children}</span>
    </li>
  );
}

export function As400CobolPathGrid({ children }: { children: ReactNode }) {
  return (
    <div
      {...componentNameDebugProps("As400CobolPathGrid")}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      {children}
    </div>
  );
}

export function As400CobolPathCard({
  icon,
  title,
  children,
}: {
  icon: IconName;
  title: string;
  children: ReactNode;
}) {
  return (
    <article
      {...componentNameDebugProps("As400CobolPathCard")}
      className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-44px_rgba(15,23,42,0.22)]"
    >
      <IconBadge icon={icon} />
      <h3 className="mt-4 text-[18px] font-semibold leading-7 text-slate-950">{title}</h3>
      <p className="mt-3 text-[14px] leading-7 text-slate-600">{children}</p>
    </article>
  );
}

export function As400CobolArchitectureBand({ children }: { children: ReactNode }) {
  return (
    <div
      {...componentNameDebugProps("As400CobolArchitectureBand")}
      className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]"
    >
      {children}
    </div>
  );
}
