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

const migrationStepIcons = {
  assessment: FileSearch,
  analysis: Database,
  poc: FlaskConical,
  migration: Code2,
  test: ClipboardCheck,
  stabilization: CloudCog,
} as const;

type MigrationStepIcon = keyof typeof migrationStepIcons;

type NamedComponentProps = {
  componentName?: string;
};

export function As400CobolMigrationFlow({
  children,
  componentName = "As400CobolMigrationFlow",
}: {
  children: ReactNode;
} & NamedComponentProps) {
  const debugProps =
    componentName === "As400CobolMigrationFlow"
      ? componentNameDebugProps("As400CobolMigrationFlow")
      : componentNameDebugProps(componentName);

  return (
    <div {...debugProps} className="space-y-8">
      <ol
        {...componentNameDebugProps("As400CobolMigrationStepList")}
        className="grid gap-3 lg:grid-cols-6"
      >
        {children}
      </ol>
    </div>
  );
}

export function As400CobolMigrationStep({
  title,
  body,
  stepNumber,
  icon,
  hasConnector = true,
  componentName = "As400CobolMigrationStep",
}: {
  title: string;
  body: string;
  stepNumber: string;
  icon: MigrationStepIcon;
  hasConnector?: boolean;
} & NamedComponentProps) {
  const Icon = migrationStepIcons[icon];
  const debugProps =
    componentName === "As400CobolMigrationStep"
      ? componentNameDebugProps("As400CobolMigrationStep")
      : componentNameDebugProps(componentName);

  return (
    <li {...debugProps} className="relative">
      <div className="flex h-full min-h-[132px] flex-col rounded-[8px] border border-slate-200 bg-white px-4 py-4 shadow-[0_20px_48px_-42px_rgba(15,23,42,0.25)]">
        <div className="flex items-center justify-between gap-3">
          <span
            {...componentNameDebugProps("As400CobolMigrationStepIcon")}
            className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#e8f4f2] text-[#0f766e]"
          >
            <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
          </span>
          <span
            {...componentNameDebugProps("As400CobolMigrationStepNumber")}
            className="text-[12px] font-semibold leading-5 text-slate-400"
          >
            {stepNumber}
          </span>
        </div>
        <h3
          {...componentNameDebugProps("As400CobolMigrationStepTitle")}
          className="mt-4 text-[17px] font-semibold leading-6 text-slate-950"
        >
          {title}
        </h3>
        <p
          {...componentNameDebugProps("As400CobolMigrationStepBody")}
          className="mt-2 text-[13px] font-normal leading-5 text-slate-600"
        >
          {body}
        </p>
      </div>
      {hasConnector ? (
        <ArrowRight
          {...componentNameDebugProps("As400CobolMigrationStepConnector")}
          aria-hidden="true"
          className="absolute right-[-16px] top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 rounded-full bg-slate-50 p-0.5 text-slate-400 lg:block"
          strokeWidth={2}
        />
      ) : null}
    </li>
  );
}

export function As400CobolPanelGrid({
  children,
  componentName = "As400CobolPanelGrid",
}: {
  children: ReactNode;
} & NamedComponentProps) {
  const debugProps =
    componentName === "As400CobolPanelGrid"
      ? componentNameDebugProps("As400CobolPanelGrid")
      : componentNameDebugProps(componentName);

  return (
    <div
      {...debugProps}
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
  componentName = "As400CobolPanel",
}: {
  title: string;
  body: string;
  eyebrow?: string;
} & NamedComponentProps) {
  const debugProps =
    componentName === "As400CobolPanel"
      ? componentNameDebugProps("As400CobolPanel")
      : componentNameDebugProps(componentName);

  return (
    <article
      {...debugProps}
      className="flex h-full flex-col rounded-[8px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-44px_rgba(15,23,42,0.22)]"
    >
      {eyebrow ? (
        <p
          {...componentNameDebugProps("As400CobolPanelEyebrow")}
          className="text-[12px] font-semibold uppercase leading-5 tracking-[0.08em] text-[#0f766e]"
        >
          {eyebrow}
        </p>
      ) : null}
      <h3
        {...componentNameDebugProps("As400CobolPanelTitle")}
        className="mt-2 text-[20px] font-semibold leading-7 text-slate-950"
      >
        {title}
      </h3>
      <p
        {...componentNameDebugProps("As400CobolPanelBody")}
        className="mt-3 text-[15px] font-normal leading-7 text-slate-600"
      >
        {body}
      </p>
    </article>
  );
}
