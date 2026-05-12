import type { ReactNode } from "react";
import { CookiePreferenceToggle } from "./toggle";

export type CookiePreferenceKey = "necessary" | "performance" | "functional" | "analysis" | "marketing";

type CookiePreferenceListProps = {
  children: ReactNode;
};

type CookiePreferenceItemProps = {
  id: CookiePreferenceKey;
  label: string;
  description: ReactNode;
  disabled?: boolean;
};

export function CookiePreferenceList({ children }: CookiePreferenceListProps) {
  return <ul className="flex flex-col gap-[40px]">{children}</ul>;
}

export function CookiePreferenceItem({ id, label, description, disabled = false }: CookiePreferenceItemProps) {
  const switchId = `cookie-preference-${id}`;

  return (
    <li className="flex flex-col gap-[20px]">
      <div className="flex items-center gap-[15px]">
        <CookiePreferenceToggle preference={id} id={switchId} disabled={disabled} />
        <label htmlFor={switchId} className="text-[18.75px] font-medium leading-[26.25px] text-[#24292F]">
          {label}
        </label>
      </div>
      <div className="text-[15px] font-light leading-[24.375px] tracking-[0.3375px] text-[#57606A]">{description}</div>
    </li>
  );
}
