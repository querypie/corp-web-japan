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
          className="mx-auto max-w-[760px] text-center"
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
