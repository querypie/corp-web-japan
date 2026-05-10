"use client";

import { useRouter } from "next/navigation";
import { PRIVACY_POLICY_VERSIONS } from "./privacy-policy-versions";

type PrivacyPolicyVersionSelectorProps = {
  currentSlug: string;
};

export function PrivacyPolicyVersionSelector({ currentSlug }: PrivacyPolicyVersionSelectorProps) {
  const router = useRouter();

  return (
    <label className="inline-flex items-center gap-3 text-sm text-slate-500">
      <span className="sr-only">Version</span>
      <select
        defaultValue={currentSlug}
        className="h-10 rounded-[6px] border border-[#d1d5db] bg-white px-3 text-sm text-slate-950"
        onChange={(event) => {
          const nextSlug = event.target.value;
          if (!nextSlug || nextSlug === currentSlug) {
            return;
          }

          router.push(`/t/privacy-policy/${nextSlug}`);
        }}
      >
        {PRIVACY_POLICY_VERSIONS.map((version) => (
          <option key={version.slug} value={version.slug}>
            {version.label}
          </option>
        ))}
      </select>
    </label>
  );
}
