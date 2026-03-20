"use client";

import { useState } from "react";
import { ResourceLeadForm } from "@/components/sections/resource-lead-form";

type ResourcePostGatedProps = {
  gatingHtml: string;
  gatedContentHtml: string;
};

export function ResourcePostGated({
  gatingHtml,
  gatedContentHtml,
}: ResourcePostGatedProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
    jobTitle: "",
    phone: "",
    inquiry: "",
    timeline: "",
    products: [] as string[],
    marketing: false,
  });

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

  const headingMatch = gatingHtml.match(/<h2 class="gating-heading">([\s\S]*?)<\/h2>/);
  const subtextMatch = gatingHtml.match(/<p class="gating-subtext">([\s\S]*?)<\/p>/);

  return (
    <>
      {!unlocked ? (
        <div className="relative -mt-[100px] pt-[100px]">
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-[120px] bg-gradient-to-b from-transparent to-white" />
          <div className="relative z-[2] pt-12">
            <h2 className="mb-[14px] text-center text-[34px] font-medium tracking-[-0.02em] text-slate-950">
              {headingMatch?.[1] ?? "全文を読む"}
            </h2>
            <p className="mx-auto mb-9 max-w-[520px] text-center text-base leading-6 text-slate-500">
              {subtextMatch?.[1] ?? "フォームに入力後、限定コンテンツをご覧いただけます。"}
            </p>
            <div className="mx-auto max-w-[440px]">
              <ResourceLeadForm
                form={form}
                setForm={setForm}
                submitEnabled={hasRequiredFields}
                submitLabel="送信する"
                variant="gated"
                onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  if (!hasRequiredFields) return;
                  setUnlocked(true);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}

      {unlocked ? (
        <div
          className={[
            "mt-12 text-base leading-6 text-slate-500",
            "[&_a]:text-[#2563EB] [&_a]:underline [&_a]:decoration-[1px] [&_a]:underline-offset-[3px] hover:[&_a]:text-[#1D4ED8]",
            "[&_h1]:mt-12 [&_h1]:text-[22px] [&_h1]:font-semibold [&_h1]:leading-[1.4] [&_h1]:tracking-[-0.01em] [&_h1]:text-slate-950",
            "[&_h2]:mt-10 [&_h2]:text-[22px] [&_h2]:font-normal [&_h2]:leading-[1.455] [&_h2]:text-slate-950",
            "[&_h3]:mt-8 [&_h3]:text-[17px] [&_h3]:font-medium [&_h3]:leading-[1.4] [&_h3]:text-slate-950",
            "[&_h4]:mt-7 [&_h4]:text-[15px] [&_h4]:font-medium [&_h4]:leading-[1.5] [&_h4]:text-slate-950",
            "[&_p]:mt-4 [&_p]:text-base [&_p]:leading-6 [&_p]:text-slate-500",
            "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-4",
            "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-4",
            "[&_li]:mb-2 [&_li]:text-base [&_li]:leading-6 [&_li]:text-slate-500",
            "[&_strong]:font-medium [&_strong]:text-slate-950",
            "[&_figure.wp-figure]:my-8 [&_figure.wp-figure]:text-center",
            "[&_figure.wp-figure_img]:max-w-full",
            "[&_figure.wp-figure_img]:rounded-[8px]",
            "[&_figure.wp-figure_img]:border [&_figure.wp-figure_img]:border-[#e5e7eb]",
            "[&_figure.wp-figure_figcaption]:mt-[10px] [&_figure.wp-figure_figcaption]:text-sm [&_figure.wp-figure_figcaption]:leading-6 [&_figure.wp-figure_figcaption]:text-slate-400",
            "[&_blockquote]:my-[20px] [&_blockquote]:border-l [&_blockquote]:border-[#d1d5db] [&_blockquote]:pl-[30px]",
            "[&_blockquote_p]:mt-0 [&_blockquote_p]:text-base [&_blockquote_p]:leading-6 [&_blockquote_p]:text-slate-500",
            "[&_blockquote_li]:text-base [&_blockquote_li]:leading-6 [&_blockquote_li]:text-slate-500",
            "[&_table]:my-[34px] [&_table]:w-full [&_table]:border-collapse [&_table]:border-t [&_table]:border-b [&_table]:border-[#d1d5db] [&_table]:text-sm",
            "[&_th]:border-b [&_th]:border-[#d1d5db] [&_th]:bg-[#f9f9fb] [&_th]:px-5 [&_th]:py-[14px] [&_th]:text-left [&_th]:font-medium [&_th]:leading-[1.5] [&_th]:text-slate-950",
            "[&_td]:border-b [&_td]:border-[#e5e7eb] [&_td]:px-5 [&_td]:py-[14px] [&_td]:align-top [&_td]:leading-6 [&_td]:text-slate-500",
            "[&_tr:nth-child(even)_td]:bg-[#f6f8fa]",
            "[&_tr:last-child_td]:border-b-0",
            "[&_hr]:hidden",
            "[&>br]:hidden",
          ].join(" ")}
          dangerouslySetInnerHTML={{ __html: gatedContentHtml }}
        />
      ) : null}
    </>
  );
}
