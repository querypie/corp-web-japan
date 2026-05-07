"use client";

import { useRouter } from "next/navigation";

type LegalPrivacyPolicyVersionSelectorProps = {
  language: "en" | "ko";
  currentVersion: string;
};

const VERSIONS = {
  en: [
    "26-01-15",
    "25-12-03",
    "25-10-21",
    "25-09-08",
    "25-07-28",
    "25-07-15",
    "25-06-10",
    "25-06-05",
    "24-11-29",
    "24-06-07",
    "23-09-22",
    "23-08-25",
    "22-10-11",
    "22-06-06",
    "22-01-12",
    "21-03-30",
    "19-11-29",
  ],
  ko: [
    "26-01-15",
    "25-12-03",
    "25-10-21",
    "25-09-08",
    "25-07-28",
    "25-07-15",
    "25-06-10",
    "25-06-05",
    "24-11-29",
    "24-09-30",
    "24-06-07",
    "23-09-22",
    "23-08-25",
    "22-10-11",
    "22-06-06",
    "22-01-12",
    "21-03-30",
    "19-11-29",
  ],
} as const;

export function LegalPrivacyPolicyVersionSelector({
  language,
  currentVersion,
}: LegalPrivacyPolicyVersionSelectorProps) {
  const router = useRouter();

  return (
    <label className="inline-flex items-center gap-3 text-sm text-slate-500">
      <span>Version</span>
      <select
        defaultValue={currentVersion}
        className="h-10 rounded-[6px] border border-[#d1d5db] bg-white px-3 text-sm text-slate-950"
        onChange={(event) => {
          const nextVersion = event.target.value;
          if (!nextVersion || nextVersion === currentVersion) {
            return;
          }

          router.push(`/privacy-policy-${language}/${nextVersion}`);
        }}
      >
        {VERSIONS[language].map((version) => (
          <option key={version} value={version}>
            QueryPie Privacy Policy {version}
          </option>
        ))}
      </select>
    </label>
  );
}
