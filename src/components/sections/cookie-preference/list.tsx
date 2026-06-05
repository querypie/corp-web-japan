import type { ReactNode } from "react";
import { companyBodyTextClassName } from "@/components/ui/text-tokens";
import type { CookiePreferenceKey } from "@/lib/cookie-preferences";
import { CookiePreferenceToggle } from "./toggle";
import { componentNameDebugProps } from "@/lib/component-name-debug";

type CookiePreferenceListProps = {
  children: ReactNode;
};

type CookiePreferenceItemProps = {
  children: ReactNode;
};

type CookiePreferenceToggleFieldProps = {
  id: CookiePreferenceKey;
  children: ReactNode;
  disabled?: boolean;
  initialChecked?: boolean;
};

type CookiePreferenceToggleDescriptionProps = {
  children: ReactNode;
};

export function CookiePreferenceList({ children }: CookiePreferenceListProps) {
  return <ul {...componentNameDebugProps("CookiePreferenceList")} className="flex flex-col gap-10">{children}</ul>;
}

export function CookiePreferenceItem({ children }: CookiePreferenceItemProps) {
  return <li {...componentNameDebugProps("CookiePreferenceItem")} className="flex flex-col gap-5">{children}</li>;
}

export function CookiePreferenceToggleField({
  id,
  children,
  disabled = false,
  initialChecked = false,
}: CookiePreferenceToggleFieldProps) {
  const switchId = `cookie-preference-${id}`;

  return (
    <div {...componentNameDebugProps("CookiePreferenceToggleField")} className="flex items-center gap-4">
      <CookiePreferenceToggle preference={id} id={switchId} disabled={disabled} initialChecked={initialChecked} />
      <label htmlFor={switchId} className="font-medium text-slate-950">{children}</label>
    </div>
  );
}

export function CookiePreferenceToggleDescription({ children }: CookiePreferenceToggleDescriptionProps) {
  return <p {...componentNameDebugProps("CookiePreferenceToggleDescription")} className={companyBodyTextClassName}>{children}</p>;
}
