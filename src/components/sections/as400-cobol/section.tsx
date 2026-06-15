import type { ReactNode } from "react";
import { componentNameDebugProps } from "@/lib/component-name-debug";

type As400CobolSectionProps = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  muted?: boolean;
  id?: string;
  componentName?: string;
};

export function As400CobolSection({
  eyebrow,
  title,
  lead,
  children,
  muted = false,
  id,
  componentName = "As400CobolSection",
}: As400CobolSectionProps) {
  const debugProps =
    componentName === "As400CobolSection"
      ? componentNameDebugProps("As400CobolSection")
      : componentNameDebugProps(componentName);

  return (
    <section
      {...debugProps}
      id={id}
      className={muted ? "bg-slate-50 px-6 py-20 lg:px-0" : "bg-white px-6 py-20 lg:px-0"}
    >
      <div className="mx-auto w-full max-w-[1120px]">
        <div
          {...componentNameDebugProps("As400CobolSectionIntro")}
          className="mx-auto max-w-[880px] text-center"
        >
          {eyebrow ? (
            <p
              {...componentNameDebugProps("As400CobolSectionEyebrow")}
              className="text-[13px] font-semibold uppercase leading-5 tracking-[0.12em] text-[#0f766e]"
            >
              {eyebrow}
            </p>
          ) : null}
          <h2
            {...componentNameDebugProps("As400CobolSectionTitle")}
            className="mt-3 text-[32px] font-semibold leading-[42px] tracking-normal text-slate-950 md:text-[42px] md:leading-[52px]"
          >
            {title}
          </h2>
          {lead ? (
            <p
              {...componentNameDebugProps("As400CobolSectionLead")}
              className="mt-5 text-[16px] font-normal leading-7 text-slate-600 md:text-[17px] md:leading-8"
            >
              {lead}
            </p>
          ) : null}
        </div>
        <div {...componentNameDebugProps("As400CobolSectionBody")} className="mt-10">
          {children}
        </div>
      </div>
    </section>
  );
}

export function As400CobolReferenceNotes({
  children,
  componentName = "As400CobolReferenceNotes",
}: {
  children: ReactNode;
  componentName?: string;
}) {
  const debugProps =
    componentName === "As400CobolReferenceNotes"
      ? componentNameDebugProps("As400CobolReferenceNotes")
      : componentNameDebugProps(componentName);

  return (
    <aside
      {...debugProps}
      aria-label="Reference notes"
      className="mt-8 rounded-[8px] border border-slate-200 bg-white/75 px-5 py-4 text-left text-[12px] leading-6 text-slate-500"
    >
      <p
        {...componentNameDebugProps("As400CobolReferenceNotesLabel")}
        className="font-semibold uppercase tracking-[0.08em] text-slate-500"
      >
        References
      </p>
      <ul
        {...componentNameDebugProps("As400CobolReferenceNotesList")}
        className="mt-2 space-y-1"
      >
        {children}
      </ul>
    </aside>
  );
}

export function As400CobolReferenceNote({
  children,
  componentName = "As400CobolReferenceNote",
}: {
  children: ReactNode;
  componentName?: string;
}) {
  const debugProps =
    componentName === "As400CobolReferenceNote"
      ? componentNameDebugProps("As400CobolReferenceNote")
      : componentNameDebugProps(componentName);

  return (
    <li {...debugProps} className="flex gap-2">
      <span aria-hidden="true" className="text-slate-400">
        ※
      </span>
      <span>{children}</span>
    </li>
  );
}

export function As400CobolReferenceLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      {...componentNameDebugProps("As400CobolReferenceLink")}
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-[#0f766e] underline decoration-[#0f766e]/30 underline-offset-4 hover:text-[#0b5f59]"
    >
      {children}
    </a>
  );
}
