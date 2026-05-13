"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import type { PublicationPostDownloadCta } from "@/lib/publications/types";
import {
  ResourceLeadForm,
  type ResourceLeadFormState,
} from "@/components/sections/publication/lead-form";
import {
  defaultGatingFormState,
  isGatingFormValid,
} from "@/lib/gating-form";

const UTM_ATTRIBUTION_COOKIE_KEY = "utm-attribution";

type UtmTouch = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  landing: string;
  ts: string;
};

type UtmAttribution = {
  first: UtmTouch;
  recent: UtmTouch[];
};

const buildUtmAttribution = (): string | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const params = new URLSearchParams(window.location.search);
  const hasUtm = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].some(
    (key) => params.get(key),
  );

  if (hasUtm) {
    const touch: UtmTouch = {
      landing: `${window.location.pathname}${window.location.search}`,
      ts: new Date().toISOString(),
    };

    const source = params.get("utm_source");
    const medium = params.get("utm_medium");
    const campaign = params.get("utm_campaign");
    const term = params.get("utm_term");
    const content = params.get("utm_content");

    if (source) touch.source = source;
    if (medium) touch.medium = medium;
    if (campaign) touch.campaign = campaign;
    if (term) touch.term = term;
    if (content) touch.content = content;

    return encodeURIComponent(JSON.stringify({ first: touch, recent: [touch] } satisfies UtmAttribution));
  }

  const encodedCookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${UTM_ATTRIBUTION_COOKIE_KEY}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  return encodedCookie || undefined;
};

type ResourcePostGatedProps = {
  contentKey: string;
  initiallyUnlocked: boolean;
  gatedContent: ReactNode;
  bodyClassName?: string;
  downloadCta?: PublicationPostDownloadCta | null;
};

function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}

function ResourceDownloadCta({ downloadCta }: { downloadCta: PublicationPostDownloadCta }) {
  if (downloadCta.external || isExternalHref(downloadCta.href)) {
    return (
      <a href={downloadCta.href} className="article-content-btn" target="_blank" rel="noopener noreferrer">
        {downloadCta.label}
      </a>
    );
  }

  return (
    <Link href={downloadCta.href} className="article-content-btn">
      {downloadCta.label}
    </Link>
  );
}

export function ResourcePostGated({
  contentKey,
  initiallyUnlocked,
  gatedContent,
  bodyClassName,
  downloadCta,
}: ResourcePostGatedProps) {
  const [unlocked, setUnlocked] = useState(initiallyUnlocked);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState<ResourceLeadFormState>(defaultGatingFormState);

  useEffect(() => {
    setUnlocked(initiallyUnlocked);
  }, [initiallyUnlocked]);

  const hasRequiredFields = isGatingFormValid(form);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasRequiredFields || submitting) {
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/gating-form/unlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentKey,
          form,
          referrerUrl: window.location.href,
          utmAttribution: buildUtmAttribution(),
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;

      if (!response.ok || !result?.success) {
        setErrorMessage(
          result?.message ?? "送信に失敗しました。時間をおいて再度お試しください。",
        );
        return;
      }

      setUnlocked(true);
    } catch {
      setErrorMessage("送信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {unlocked ? null : (
        <div className="relative -mt-[100px] pt-[100px]">
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-[120px] bg-gradient-to-b from-transparent to-white" />
          <div className="relative z-[2] pt-12">
            <h2 className="mb-[14px] text-center text-[34px] font-medium tracking-[-0.02em] text-slate-950">
              全文を読む
            </h2>
            <p className="mx-auto mb-9 max-w-[520px] text-center text-base leading-6 text-slate-500">
              フォームに入力後、限定コンテンツをご覧いただけます。
            </p>
            <div className="mx-auto max-w-[440px]">
              <ResourceLeadForm
                form={form}
                setForm={setForm}
                submitEnabled={hasRequiredFields}
                submitting={submitting}
                errorMessage={errorMessage}
                submitLabel="送信する"
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      )}

      {unlocked ? (
        <div className="mt-12">
          <div className={bodyClassName}>
            {gatedContent}
            {downloadCta ? <ResourceDownloadCta downloadCta={downloadCta} /> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
