import type { ReactNode } from "react";
import { companyBodyTextClassName } from "@/components/ui/text-tokens";
import { CookiePreferenceToggle } from "./toggle";

export type CookiePreferenceKey = "necessary" | "performance" | "functional" | "analysis" | "marketing";

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
};

type CookiePreferenceToggleDescriptionProps = {
  children: ReactNode;
};

export function CookiePreferenceList({ children }: CookiePreferenceListProps) {
  return <ul className="flex flex-col gap-10">{children}</ul>;
}

export function CookiePreferenceItem({ children }: CookiePreferenceItemProps) {
  return <li className="flex flex-col gap-5">{children}</li>;
}

export function CookiePreferenceToggleField({ id, children, disabled = false }: CookiePreferenceToggleFieldProps) {
  const switchId = `cookie-preference-${id}`;

  return (
    <div className="flex items-center gap-4">
      <CookiePreferenceToggle preference={id} id={switchId} disabled={disabled} />
      <label htmlFor={switchId} className="font-medium text-slate-950">{children}</label>
    </div>
  );
}

export function CookiePreferenceToggleDescription({ children }: CookiePreferenceToggleDescriptionProps) {
  return <p className={companyBodyTextClassName}>{children}</p>;
}
