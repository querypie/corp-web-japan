"use client";

type PrivacyPolicyVersionSelectorProps = {
  currentSlug: string;
  slugs: string[];
};

export function PrivacyPolicyVersionSelector({ currentSlug, slugs }: PrivacyPolicyVersionSelectorProps) {
  return (
    <label className="inline-flex items-center gap-3 text-sm text-slate-500">
      <span className="sr-only">Change history</span>
      <select
        defaultValue={currentSlug}
        className="h-10 min-w-[160px] rounded-[6px] border border-[#d1d5db] bg-white px-3 text-sm text-slate-950"
        onChange={(event) => {
          const nextSlug = event.target.value;
          if (!nextSlug || nextSlug === currentSlug || typeof window === "undefined") {
            return;
          }

          window.location.assign(`/privacy-policy/${nextSlug}`);
        }}
      >
        {slugs.map((slug) => (
          <option key={slug} value={slug}>
            {slug}
          </option>
        ))}
      </select>
    </label>
  );
}
