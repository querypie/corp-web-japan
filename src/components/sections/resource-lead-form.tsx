"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

type LeadFormState = {
  lastName: string;
  firstName: string;
  email: string;
  company: string;
  jobTitle: string;
  phone: string;
  inquiry: string;
  timeline: string;
  products: string[];
  marketing: boolean;
};

type ResourceLeadFormProps = {
  form: LeadFormState;
  setForm: React.Dispatch<React.SetStateAction<LeadFormState>>;
  submitLabel: string;
  submitEnabled: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  variant?: "download" | "gated";
};

const productOptions = [
  ["aip", "AI Platform (AIP)"],
  ["acp", "Access Control Platform (ACP)"],
  ["fdes", "Forward Deployed Engineer Service"],
  ["ai-dashi", "AI 出汁"],
] as const;

const inquiryOptions = [
  ["", "選択してください"],
  ["demo", "デモリクエスト"],
  ["info", "資料請求"],
  ["partner", "パートナーシップ"],
  ["other", "その他"],
] as const;

const timelineOptions = [
  ["", "選択してください"],
  ["asap", "すぐに導入したい"],
  ["3mo", "3ヶ月以内"],
  ["6mo", "6ヶ月以内"],
  ["1yr", "1年以内"],
  ["exploring", "検討中"],
] as const;

export function ResourceLeadForm({
  form,
  setForm,
  submitLabel,
  submitEnabled,
  onSubmit,
  variant = "download",
}: ResourceLeadFormProps) {
  const selectClass =
    "h-11 w-full appearance-none rounded-[6px] border border-[#D1D5DB] bg-white pl-3 pr-12 text-sm";

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      {[
        ["lastName", "姓", "例：山田"],
        ["firstName", "名", "例：太郎"],
        ["email", "ビジネス用メールアドレス", "例：name@company.com"],
        ["company", "会社名", "例：クエリパイ株式会社"],
        ["jobTitle", "部署／役職", "例：エンタープライズAI事業部 部長"],
        ["phone", "電話番号", "例：090-1234-5678"],
      ].map(([key, label, placeholder]) => (
        <label key={key} className="flex flex-col gap-[6px]">
          <span className="text-[13px] font-medium leading-[1.4] text-slate-950">
            {["phone"].includes(key) ? null : (
              <span className="mr-[2px] text-[#EF4444]">*</span>
            )}
            {label}
          </span>
          <input
            type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
            value={form[key as keyof LeadFormState] as string}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, [key]: event.target.value }))
            }
            placeholder={placeholder}
            className="h-11 rounded-[6px] border border-[#D1D5DB] px-3 text-sm text-slate-950 placeholder:text-slate-400"
          />
        </label>
      ))}

      <label className="flex flex-col gap-[6px]">
        <span className="text-[13px] font-medium leading-[1.4] text-slate-950">
          <span className="mr-[2px] text-[#EF4444]">*</span>
          お問い合わせの種類
        </span>
        <div className="relative">
          <select
            value={form.inquiry}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, inquiry: event.target.value }))
            }
            className={selectClass}
          >
            {inquiryOptions.map(([value, label]) => (
              <option key={value || "empty"} value={value}>
                {label}
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
          {productOptions.map(([value, label]) => (
            <label key={value} className="text-sm leading-6 text-slate-500">
              <input
                type="checkbox"
                className="mr-2"
                checked={form.products.includes(value)}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    products: event.target.checked
                      ? [...prev.products, value]
                      : prev.products.filter((item) => item !== value),
                  }))
                }
              />
              <span>{label}</span>
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
            onChange={(event) =>
              setForm((prev) => ({ ...prev, timeline: event.target.value }))
            }
            className={selectClass}
          >
            {timelineOptions.map(([value, label]) => (
              <option key={value || "empty"} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700" />
        </div>
      </label>

      <label className="text-sm leading-6 text-slate-500">
        <input
          type="checkbox"
          className="mr-2"
          checked={form.marketing}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, marketing: event.target.checked }))
          }
        />
        <span>QueryPie AIからの情報提供メールの受け取りに同意します。</span>
      </label>

      <p className="mt-1 text-center text-sm leading-6 text-slate-500">
        <Link
          href="https://www.querypie.com/ja/terms-of-service"
          className="underline underline-offset-4"
        >
          利用規約
        </Link>
        と
        <Link
          href="https://www.querypie.com/ja/privacy-policy"
          className="underline underline-offset-4"
        >
          プライバシーポリシー
        </Link>
        に同意して送信する。
      </p>

      <button
        type="submit"
        className={`mt-2 inline-flex w-full items-center justify-center rounded-[6px] px-8 py-3 text-base font-medium transition ${
          submitEnabled
            ? "bg-[#111827] text-white hover:opacity-85"
            : variant === "download"
              ? "cursor-not-allowed bg-[#D1D5DB] text-[#9CA3AF]"
              : "bg-[#111827] text-white hover:opacity-85"
        }`}
      >
        {submitLabel}
      </button>
    </form>
  );
}
