import type { ReactNode } from "react";
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
  return <ul className="flex flex-col gap-[40px]">{children}</ul>;
}

export function CookiePreferenceItem({ children }: CookiePreferenceItemProps) {
  return <li className="flex flex-col gap-[20px]">{children}</li>;
}

export function CookiePreferenceToggleField({ id, children, disabled = false }: CookiePreferenceToggleFieldProps) {
  const switchId = `cookie-preference-${id}`;

  return (
    <div className="flex items-center gap-[15px]">
      <CookiePreferenceToggle preference={id} id={switchId} disabled={disabled} />
      <label htmlFor={switchId}>{children}</label>
    </div>
  );
}

export function CookiePreferenceToggleDescription({ children }: CookiePreferenceToggleDescriptionProps) {
  return <p>{children}</p>;
}
