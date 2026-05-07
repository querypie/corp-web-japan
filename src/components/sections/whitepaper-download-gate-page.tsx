"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import { ResourceLeadForm } from "@/components/sections/resource-lead-form";
import {
  defaultGatingFormState,
  isGatingFormValid,
  type GatingFormState,
} from "@/lib/gating-form";

type WhitepaperDownloadGatePageProps = {
  categoryLabel: string;
  title: string;
  coverImageSrc: string;
  contentKey: string;
  downloadHref: string;
  formDescription?: string;
};

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

export function WhitepaperDownloadGatePage({
  categoryLabel,
  title,
  coverImageSrc,
  contentKey,
  downloadHref,
  formDescription = "限定コンテンツの入手には、フォームのご記入をお願いいたします。",
}: WhitepaperDownloadGatePageProps) {
  const [form, setForm] = useState<GatingFormState>(defaultGatingFormState);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submitEnabled = isGatingFormValid(form);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!submitEnabled || submitting) {
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
        setErrorMessage(result?.message ?? "送信に失敗しました。時間をおいて再度お試しください。");
        return;
      }

      window.location.assign(downloadHref);
    } catch {
      setErrorMessage("送信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-20 pt-[112px] lg:px-[30px] lg:pb-[120px] lg:pt-[144px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_440px] lg:gap-14">
          <div className="lg:sticky lg:top-[108px] lg:self-start">
            <span className="mb-4 inline-flex self-start rounded-full border border-[#353c45] px-3 py-[3px] text-[11px] font-medium leading-[1.6] tracking-[0.04em] text-slate-950">
              {categoryLabel}
            </span>
            <h1 className="mb-6 border-b border-[#E5E7EB] pb-6 text-[28px] font-normal leading-[1.45] tracking-[-0.02em] text-slate-950 lg:text-[32px]">
              {title}
            </h1>
            <div>
              <Image
                src={coverImageSrc}
                alt={title}
                width={960}
                height={1358}
                className="h-auto w-full"
              />
            </div>
          </div>

          <div className="rounded-[12px] border border-[#E5E7EB] bg-white px-6 py-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] lg:px-10 lg:py-9">
            <p className="mb-7 text-base leading-6 text-slate-500">{formDescription}</p>
            <ResourceLeadForm
              form={form}
              setForm={setForm}
              submitEnabled={submitEnabled}
              submitting={submitting}
              errorMessage={errorMessage}
              submitLabel="ダウンロードする"
              variant="download"
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
