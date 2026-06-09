import type { ReactNode } from "react";
import {
  ArrowRight,
  ClipboardCheck,
  CloudCog,
  Code2,
  Database,
  FileSearch,
  FlaskConical,
} from "lucide-react";
import { componentNameDebugProps } from "@/lib/component-name-debug";

type MigrationStep = {
  title: string;
  body: string;
};

type As400CobolMigrationFlowProps = {
  steps: MigrationStep[];
};

const stepIcons = [
  FileSearch,
  Database,
  FlaskConical,
  Code2,
  ClipboardCheck,
  CloudCog,
] as const;

export function As400CobolMigrationFlow({ steps }: As400CobolMigrationFlowProps) {
  return (
    <div {...componentNameDebugProps("As400CobolMigrationFlow")} className="space-y-8">
      <ol className="grid gap-3 lg:grid-cols-6">
        {steps.map((step, index) => {
          const Icon = stepIcons[index % stepIcons.length];

          return (
            <li key={step.title} className="relative">
              <div className="flex h-full min-h-[132px] flex-col rounded-[8px] border border-slate-200 bg-white px-4 py-4 shadow-[0_20px_48px_-42px_rgba(15,23,42,0.25)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#e8f4f2] text-[#0f766e]">
                    <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <span className="text-[12px] font-semibold leading-5 text-slate-400">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-[17px] font-semibold leading-6 text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-[13px] font-normal leading-5 text-slate-600">
                  {step.body}
                </p>
              </div>
              {index < steps.length - 1 ? (
                <ArrowRight
                  aria-hidden="true"
                  className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-slate-300 lg:block"
                  strokeWidth={2}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function As400CobolPanelGrid({ children }: { children: ReactNode }) {
  return (
    <div
      {...componentNameDebugProps("As400CobolPanelGrid")}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      {children}
    </div>
  );
}

export function As400CobolPanel({
  title,
  body,
  eyebrow,
}: {
  title: string;
  body: string;
  eyebrow?: string;
}) {
  return (
    <article
      {...componentNameDebugProps("As400CobolPanel")}
      className="flex h-full flex-col rounded-[8px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-44px_rgba(15,23,42,0.22)]"
    >
      {eyebrow ? (
        <p className="text-[12px] font-semibold uppercase leading-5 tracking-[0.08em] text-[#0f766e]">
          {eyebrow}
        </p>
      ) : null}
      <h3 className="mt-2 text-[20px] font-semibold leading-7 text-slate-950">
        {title}
      </h3>
      <p className="mt-3 text-[15px] font-normal leading-7 text-slate-600">
        {body}
      </p>
    </article>
  );
}
