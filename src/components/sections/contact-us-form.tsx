"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import {
  defaultContactUsFormState,
  getContactUsFormErrors,
  inquiryOptions,
  isContactUsFormValid,
  productOptions,
  timelineOptions,
  type ContactUsFormState,
} from "@/lib/contact-us";

const UTM_ATTRIBUTION_COOKIE_KEY = "utm-attribution";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

type ContactUsFormProps = {
  initialPrefills?: Partial<ContactUsFormState>;
};

type TouchedState = Partial<Record<keyof ContactUsFormState, boolean>>;

const textFields: Array<{
  key: keyof Pick<
    ContactUsFormState,
    "lastName" | "firstName" | "email" | "company" | "title" | "phone"
  >;
  label: string;
  placeholder: string;
  autoComplete: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}> = [
  { key: "lastName", label: "姓", placeholder: "例：山田", autoComplete: "family-name" },
  { key: "firstName", label: "名", placeholder: "例：太郎", autoComplete: "given-name" },
  {
    key: "email",
    label: "ビジネス用メールアドレス",
    placeholder: "例：name@company.com",
    autoComplete: "email",
    inputMode: "email",
  },
  { key: "company", label: "会社名", placeholder: "例：クエリパイ株式会社", autoComplete: "organization" },
  {
    key: "title",
    label: "部署／役職",
    placeholder: "例：エンタープライズAI事業部 部長",
    autoComplete: "organization-title",
  },
  {
    key: "phone",
    label: "電話番号",
    placeholder: "例：090-1234-5678",
    autoComplete: "tel",
    inputMode: "tel",
  },
];

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

export function ContactUsForm({ initialPrefills = {} }: ContactUsFormProps) {
  const [form, setForm] = useState<ContactUsFormState>({
    ...defaultContactUsFormState,
    ...initialPrefills,
  });
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [touched, setTouched] = useState<TouchedState>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const errors = getContactUsFormErrors(form);
  const submitEnabled = isContactUsFormValid(form) && submitState.status !== "submitting";
  const selectClass =
    "h-11 w-full appearance-none rounded-[6px] border border-[#D1D5DB] bg-white pl-3 pr-12 text-sm text-slate-950";

  const updateField = <K extends keyof ContactUsFormState>(key: K, value: ContactUsFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const markTouched = (key: keyof ContactUsFormState) => {
    setTouched((current) => ({ ...current, [key]: true }));
  };

  const shouldShowError = (key: keyof ContactUsFormState) => submitAttempted || Boolean(touched[key]);

  const getFieldError = (key: keyof ContactUsFormState): string | undefined =>
    shouldShowError(key) ? errors[key] : undefined;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (!submitEnabled) {
      return;
    }

    setSubmitState({ status: "submitting" });

    try {
      const response = await fetch("/contact-us/submit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          form,
          referrerUrl: window.location.href,
          utmAttribution: buildUtmAttribution(),
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
            "送信に失敗しました。時間をおいて、もう一度お試しください。",
        });
        return;
      }

      setSubmitState({ status: "success" });
    } catch {
      setSubmitState({
        status: "error",
        message: "送信中にエラーが発生しました。時間をおいて、もう一度お試しください。",
      });
    }
  };

  const inquiryError = getFieldError("inquiry");
  const productsError = getFieldError("products");
  const timelineError = getFieldError("timeline");
  const messageError = getFieldError("message");

  return (
    <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-20 pt-[112px] lg:pb-[120px] lg:pt-[144px]">
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[minmax(0,1fr)_520px] lg:gap-14">
        <div>
          <h1 className="mb-6 text-[34px] font-medium leading-[1.25] tracking-[-0.03em] text-slate-950 lg:text-[44px]">
            お問い合わせ
          </h1>
          <p className="max-w-[680px] text-base leading-7 text-slate-500">
            製品導入のご相談、デモのご依頼、資料ダウンロード、技術的なご質問などを受け付けています。
            下記フォームに必要事項をご入力ください。内容を確認のうえ、担当チームより1〜2営業日以内にご連絡いたします。
          </p>
          <ul className="mt-8 grid gap-3 text-sm leading-6 text-slate-500">
            <li>• 製品や導入フェーズに応じて適切な担当が対応します。</li>
            <li>• お問い合わせ内容に応じてデモ、資料送付、個別相談をご案内します。</li>
            <li>• 送信内容は確認後、順次メールにて返信いたします。</li>
          </ul>
        </div>

        <div className="rounded-[12px] border border-[#E5E7EB] bg-white px-6 py-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] lg:px-10 lg:py-9">
          {submitState.status === "success" ? (
            <div className="mx-auto max-w-[360px] px-0 pb-2 pt-4 text-center">
              <div className="mb-3 flex justify-center text-[#22C55E]">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="mb-[10px] text-[22px] font-semibold tracking-[-0.02em] text-slate-950">
                送信が完了しました。
              </h2>
              <p className="mx-auto mb-4 whitespace-pre-line text-sm leading-6 text-slate-500">
                QueryPie にご関心をお寄せいただきありがとうございます。{"\n"}
                ご入力いただいたメールアドレス宛に、担当チームより追ってご連絡いたします。
              </p>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
              {textFields.map(({ key, label, placeholder, autoComplete, inputMode }) => {
                const required = key !== "phone";
                const fieldError = getFieldError(key);
                const inputId = `contact-us-${key}`;
                const errorId = `${inputId}-error`;

                return (
                  <label key={key} className="flex flex-col gap-[6px]" htmlFor={inputId}>
                    <span className="text-[13px] font-medium leading-[1.4] text-slate-950">
                      {required ? <span className="mr-[2px] text-[#EF4444]">*</span> : null}
                      {label}
                    </span>
                    <input
                      id={inputId}
                      name={key}
                      type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                      value={String(form[key])}
                      onChange={(event) => updateField(key, event.target.value as ContactUsFormState[typeof key])}
                      onBlur={() => markTouched(key)}
                      placeholder={placeholder}
                      autoComplete={autoComplete}
                      inputMode={inputMode}
                      required={required}
                      aria-invalid={fieldError ? "true" : "false"}
                      aria-describedby={fieldError ? errorId : undefined}
                      className={`h-11 rounded-[6px] border px-3 text-sm text-slate-950 placeholder:text-slate-400 ${
                        fieldError ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#D1D5DB]"
                      }`}
                    />
                    {fieldError ? (
                      <p id={errorId} className="text-sm leading-6 text-[#B91C1C]">
                        {fieldError}
                      </p>
                    ) : null}
                  </label>
                );
              })}

              <label className="flex flex-col gap-[6px]" htmlFor="contact-us-inquiry">
                <span className="text-[13px] font-medium leading-[1.4] text-slate-950">
                  <span className="mr-[2px] text-[#EF4444]">*</span>
                  お問い合わせの種類
                </span>
                <div className="relative">
                  <select
                    id="contact-us-inquiry"
                    name="inquiry"
                    value={form.inquiry}
                    onChange={(event) => updateField("inquiry", event.target.value)}
                    onBlur={() => markTouched("inquiry")}
                    required
                    aria-invalid={inquiryError ? "true" : "false"}
                    aria-describedby={inquiryError ? "contact-us-inquiry-error" : undefined}
                    className={`${selectClass} ${inquiryError ? "border-[#DC2626] bg-[#FEF2F2]" : ""}`}
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
                {inquiryError ? (
                  <p id="contact-us-inquiry-error" className="text-sm leading-6 text-[#B91C1C]">
                    {inquiryError}
                  </p>
                ) : null}
              </label>

              <fieldset className="flex flex-col gap-[6px]">
                <legend className="text-[13px] font-medium leading-[1.4] text-slate-950">
                  <span className="mr-[2px] text-[#EF4444]">*</span>
                  関心のある製品・サービス
                </legend>
                <div
                  className={`grid gap-2 rounded-[6px] border p-4 ${
                    productsError ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E5E7EB] bg-[#F9FAFB]"
                  }`}
                >
                  {productOptions.map((option) => {
                    const inputId = `contact-us-product-${option.key}`;

                    return (
                      <label key={option.key} htmlFor={inputId} className="text-sm leading-6 text-slate-700">
                        <input
                          id={inputId}
                          type="checkbox"
                          name="products"
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
                          onBlur={() => markTouched("products")}
                        />
                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
                {productsError ? (
                  <p id="contact-us-products-error" className="text-sm leading-6 text-[#B91C1C]">
                    {productsError}
                  </p>
                ) : null}
              </fieldset>

              <label className="flex flex-col gap-[6px]" htmlFor="contact-us-timeline">
                <span className="text-[13px] font-medium leading-[1.4] text-slate-950">
                  <span className="mr-[2px] text-[#EF4444]">*</span>
                  導入予定時期
                </span>
                <div className="relative">
                  <select
                    id="contact-us-timeline"
                    name="timeline"
                    value={form.timeline}
                    onChange={(event) => updateField("timeline", event.target.value)}
                    onBlur={() => markTouched("timeline")}
                    required
                    aria-invalid={timelineError ? "true" : "false"}
                    aria-describedby={timelineError ? "contact-us-timeline-error" : undefined}
                    className={`${selectClass} ${timelineError ? "border-[#DC2626] bg-[#FEF2F2]" : ""}`}
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
                {timelineError ? (
                  <p id="contact-us-timeline-error" className="text-sm leading-6 text-[#B91C1C]">
                    {timelineError}
                  </p>
                ) : null}
              </label>

              <label className="flex flex-col gap-[6px]" htmlFor="contact-us-message">
                <span className="text-[13px] font-medium leading-[1.4] text-slate-950">
                  <span className="mr-[2px] text-[#EF4444]">*</span>
                  ご相談内容
                </span>
                <textarea
                  id="contact-us-message"
                  name="message"
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  onBlur={() => markTouched("message")}
                  placeholder="具体的なご質問やご要望をお聞かせください。"
                  autoComplete="off"
                  required
                  aria-invalid={messageError ? "true" : "false"}
                  aria-describedby={messageError ? "contact-us-message-error" : undefined}
                  className={`min-h-[136px] rounded-[6px] border px-3 py-3 text-sm text-slate-950 placeholder:text-slate-400 ${
                    messageError ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#D1D5DB]"
                  }`}
                />
                {messageError ? (
                  <p id="contact-us-message-error" className="text-sm leading-6 text-[#B91C1C]">
                    {messageError}
                  </p>
                ) : null}
              </label>

              <label className="text-sm leading-6 text-slate-500" htmlFor="contact-us-marketing">
                <input
                  id="contact-us-marketing"
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
                に同意のうえ送信してください。
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
