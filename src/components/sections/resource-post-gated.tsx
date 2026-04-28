"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  ResourceLeadForm,
  type ResourceLeadFormState,
} from "@/components/sections/resource-lead-form";

const initialFormState: ResourceLeadFormState = {
  lastName: "",
  firstName: "",
  email: "",
  company: "",
  jobTitle: "",
  phone: "",
  inquiry: "",
  timeline: "",
  products: [],
  marketing: false,
};

type ResourcePostGatedProps = {
  contentKey: string;
  initiallyUnlocked: boolean;
  gatedContent: ReactNode;
};

export function ResourcePostGated({
  contentKey,
  initiallyUnlocked,
  gatedContent,
}: ResourcePostGatedProps) {
  const [unlocked, setUnlocked] = useState(initiallyUnlocked);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState<ResourceLeadFormState>(initialFormState);

  const hasRequiredFields = Boolean(
    form.lastName.trim() &&
      form.firstName.trim() &&
      form.email.trim() &&
      form.company.trim() &&
      form.jobTitle.trim() &&
      form.inquiry &&
      form.timeline &&
      form.products.length > 0,
  );

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
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
      if (!result?.success) {
        throw new Error("Unlock failed");
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

      {unlocked ? <div className="mt-12">{gatedContent}</div> : null}
    </>
  );
}
