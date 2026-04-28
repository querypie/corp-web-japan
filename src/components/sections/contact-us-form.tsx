"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import {
  defaultContactUsFormState,
  inquiryOptions,
  isContactUsFormValid,
  productOptions,
  timelineOptions,
  type ContactUsFormState,
} from "@/lib/contact-us";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

type ContactUsFormProps = {
  initialPrefills?: Partial<ContactUsFormState>;
};

export function ContactUsForm({
  initialPrefills = {},
}: ContactUsFormProps) {
  const [form, setForm] = useState<ContactUsFormState>({
    ...defaultContactUsFormState,
    ...initialPrefills,
  });
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const submitEnabled = isContactUsFormValid(form) && submitState.status !== "submitting";
  const selectClass =
    "h-11 w-full appearance-none rounded-[6px] border border-[#D1D5DB] bg-white pl-3 pr-12 text-sm";

  const updateField = <K extends keyof ContactUsFormState,>(
    key: K,
    value: ContactUsFormState[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!submitEnabled) {
      return;
    }

    setSubmitState({ status: "submitting" });

    try {
      const response = await fetch("/t/contact-us/submit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          form,
          referrerUrl: window.location.href,
        }),
      });

      const json = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;

      if (!response.ok || !json?.success) {
        setSubmitState({
          status: "error",
          message:
            json?.message ??
            "送信に失敗しました。設定または接続状態を確認して、もう一度お試しください。",
        });
        return;
      }

      setSubmitState({ status: "success" });
    } catch {
      setSubmitState({
        status: "error",
        message: "送信中にエラーが発生しました。しばらくしてから再度お試しください。",
      });
    }
  };

  return (
    <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-20 pt-[112px] lg:pb-[120px] lg:pt-[144px]">
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[minmax(0,1fr)_520px] lg:gap-14">
        <div>
          <h1 className="mb-6 text-[34px] font-medium leading-[1.25] tracking-[-0.03em] text-slate-950 lg:text-[44px]">
            Contact Us
          </h1>
          <p className="max-w-[680px] text-base leading-7 text-slate-500">
            現在の公開ルートである /contact-us は引き続き外部の日本向け問い合わせページへリダイレクトします。
            このフォームは現在 /t/contact-us で提供されており、このリポジトリ内でローカルの contact-us 機能を運用できるように構成されています。
          </p>
          <ul className="mt-8 grid gap-3 text-sm leading-6 text-slate-500">
            <li>• stable query API: inquiry, repeated product</li>
            <li>• 日本語ラベルのフォーム UI</li>
            <li>• 本番オープン前の isolated submit endpoint</li>
          </ul>
        </div>

        <div className="rounded-[12px] border border-[#E5E7EB] bg-white px-6 py-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] lg:px-10 lg:py-9">
          {submitState.status === "success" ? (
            <div className="mx-auto max-w-[360px] px-0 pb-2 pt-4 text-center">
              <div className="mb-3 flex justify-center text-[#22C55E]">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="mb-[10px] text-[22px] font-semibold tracking-[-0.02em] text-slate-950">
                送信が完了しました
              </h2>
              <p className="mx-auto mb-4 text-sm leading-6 text-slate-500">
                お問い合わせ内容を受け付けました。担当チームが内容を確認後、ご連絡いたします。
              </p>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {[
                ["lastName", "姓", "例：山田"],
                ["firstName", "名", "例：太郎"],
                ["email", "ビジネス用メールアドレス", "例：name@company.com"],
                ["company", "会社名", "例：クエリパイ株式会社"],
                ["title", "部署／役職", "例：エンタープライズAI事業部 部長"],
                ["phone", "電話番号", "例：090-1234-5678"],
              ].map(([key, label, placeholder]) => {
                const fieldKey = key as keyof ContactUsFormState;
                const required = key !== "phone";

                return (
                  <label key={key} className="flex flex-col gap-[6px]">
                    <span className="text-[13px] font-medium leading-[1.4] text-slate-950">
                      {required ? <span className="mr-[2px] text-[#EF4444]">*</span> : null}
                      {label}
                    </span>
                    <input
                      type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                      value={String(form[fieldKey])}
                      onChange={(event) => updateField(fieldKey, event.target.value as ContactUsFormState[typeof fieldKey])}
                      placeholder={placeholder}
                      className="h-11 rounded-[6px] border border-[#D1D5DB] px-3 text-sm text-slate-950 placeholder:text-slate-400"
                    />
                  </label>
                );
              })}

              <label className="flex flex-col gap-[6px]">
                <span className="text-[13px] font-medium leading-[1.4] text-slate-950">
                  <span className="mr-[2px] text-[#EF4444]">*</span>
                  お問い合わせの種類
                </span>
                <div className="relative">
                  <select
                    value={form.inquiry}
                    onChange={(event) => updateField("inquiry", event.target.value)}
                    className={selectClass}
                  >
                    <option value="">お問い合わせ内容を選択してください</option>
                    {inquiryOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700" />
                </div>
              </label>

              <label className="flex flex-col gap-[6px]">
                <span className="text-[13px] font-medium leading-[1.4] text-slate-950">
                  <span className="mr-[2px] text-[#EF4444]">*</span>
                  関心のある製品・サービス
                </span>
                <div className="grid gap-2 rounded-[6px] border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                  {productOptions.map((option) => (
                    <label key={option.key} className="text-sm leading-6 text-slate-500">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={form.products.includes(option.key)}
                        onChange={(event) =>
                          updateField(
                            "products",
                            event.target.checked
                              ? [...form.products, option.key]
                              : form.products.filter((item) => item !== option.key),
                          )
                        }
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </label>

              <label className="flex flex-col gap-[6px]">
                <span className="text-[13px] font-medium leading-[1.4] text-slate-950">
                  <span className="mr-[2px] text-[#EF4444]">*</span>
                  導入予定時期
                </span>
                <div className="relative">
                  <select
                    value={form.timeline}
                    onChange={(event) => updateField("timeline", event.target.value)}
                    className={selectClass}
                  >
                    <option value="">導入予定時期を選択してください</option>
                    {timelineOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700" />
                </div>
              </label>

              <label className="flex flex-col gap-[6px]">
                <span className="text-[13px] font-medium leading-[1.4] text-slate-950">
                  <span className="mr-[2px] text-[#EF4444]">*</span>
                  ご相談内容
                </span>
                <textarea
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  placeholder="現在の課題やご相談内容をご入力ください。"
                  className="min-h-[136px] rounded-[6px] border border-[#D1D5DB] px-3 py-3 text-sm text-slate-950 placeholder:text-slate-400"
                />
              </label>

              <label className="text-sm leading-6 text-slate-500">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={form.marketing}
                  onChange={(event) => updateField("marketing", event.target.checked)}
                />
                <span>QueryPie AIからの情報提供メールの受け取りに同意します。</span>
              </label>

              <p className="mt-1 text-center text-sm leading-6 text-slate-500">
                <Link href="/terms-of-service" className="underline underline-offset-4">
                  利用規約
                </Link>
                と
                <Link href="/privacy-policy" className="underline underline-offset-4">
                  プライバシーポリシー
                </Link>
                に同意して送信する。
              </p>

              {submitState.status === "error" ? (
                <p className="rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm leading-6 text-[#991B1B]">
                  {submitState.message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={!submitEnabled}
                className={`mt-2 inline-flex w-full items-center justify-center rounded-[6px] px-8 py-3 text-base font-medium transition ${
                  submitEnabled
                    ? "bg-[#111827] text-white hover:opacity-85"
                    : "cursor-not-allowed bg-[#D1D5DB] text-[#9CA3AF]"
                }`}
              >
                {submitState.status === "submitting" ? "送信中..." : "送信する"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
