import type { ReactNode } from "react";

type PrivacySelectorBoxProps = {
  children?: ReactNode;
};

type PrivacyPolicyLanguageSelectorProps = {
  language: "en" | "ko";
};

export function PrivacySelectorBox({ children }: PrivacySelectorBoxProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[10px] bg-[#f9f9fb] px-4 py-3">
      {children}
    </div>
  );
}

export function PrivacyPolicyLanguageSelector({ language }: PrivacyPolicyLanguageSelectorProps) {
  return (
    <div className="text-sm text-slate-500">
      <a
        href="https://www.querypie.com/ja/privacy-policy-ko"
        className={language === "ko" ? "font-medium text-slate-950" : undefined}
      >
        Korean
      </a>
      <span className="px-2">/</span>
      <a
        href="https://www.querypie.com/ja/privacy-policy-en"
        className={language === "en" ? "font-medium text-slate-950" : undefined}
      >
        English
      </a>
    </div>
  );
}
