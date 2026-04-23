"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Copy, Facebook, Linkedin, Twitter } from "lucide-react";
import type { ResourceDownloadPost } from "@/lib/resource-posts";
import { ResourceLeadForm } from "@/components/sections/resource-lead-form";

type ResourcePostDownloadPageProps = {
  post: ResourceDownloadPost;
};

const shareIcons = [Facebook, Twitter, Linkedin] as const;

export function ResourcePostDownloadPage({
  post,
}: ResourcePostDownloadPageProps) {
  const [success, setSuccess] = useState(false);
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

  return (
    <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-20 pt-[112px] lg:px-[30px] lg:pb-[120px] lg:pt-[144px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_440px] lg:gap-14">
          <div className="lg:sticky lg:top-[108px] lg:self-start">
            <span className="mb-4 inline-flex self-start rounded-full border border-[#353c45] px-3 py-[3px] text-[11px] font-medium leading-[1.6] tracking-[0.04em] text-slate-950">
              {post.categoryLabel}
            </span>
            <h1 className="mb-6 border-b border-[#E5E7EB] pb-6 text-[28px] font-normal leading-[1.45] tracking-[-0.02em] text-slate-950 lg:text-[32px]">
              {post.title}
            </h1>
            <div className="mb-7 flex items-center justify-end gap-1">
              {shareIcons.map((Icon, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label="共有"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] transition hover:bg-[#F3F4F6] hover:text-slate-950"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </button>
              ))}
              <button
                type="button"
                aria-label="リンクをコピー"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] transition hover:bg-[#F3F4F6] hover:text-slate-950"
              >
                <Copy className="h-[18px] w-[18px]" />
              </button>
            </div>
            <div>
              <Image
                src={post.coverImageSrc}
                alt={post.title}
                width={960}
                height={1358}
                className="h-auto w-full"
              />
            </div>
          </div>

          <div className="rounded-[12px] border border-[#E5E7EB] bg-white px-6 py-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] lg:px-10 lg:py-9">
            {!success ? (
              <>
                <p className="mb-7 text-base leading-6 text-slate-500">
                  {post.formDescription}
                </p>
                <ResourceLeadForm
                  form={form}
                  setForm={setForm}
                  submitEnabled={hasRequiredFields}
                  submitLabel="ダウンロードする"
                  variant="download"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!hasRequiredFields) return;
                    setSuccess(true);
                  }}
                />
              </>
            ) : (
              <div className="mx-auto max-w-[340px] px-0 pb-2 pt-4 text-center">
                <div className="mb-3 flex justify-center text-[#22C55E]">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="mb-[10px] text-[22px] font-semibold tracking-[-0.02em] text-slate-950">
                  {post.successTitle}
                </h2>
                <p
                  className="mx-auto mb-4 max-w-[300px] text-sm leading-6 text-slate-500"
                  dangerouslySetInnerHTML={{ __html: post.successTextHtml }}
                />
                <button
                  type="button"
                  disabled
                  className="inline-flex h-11 items-center gap-2 rounded-[8px] bg-[#374151] px-6 text-[14px] font-medium text-white opacity-60"
                >
                  PDFをダウンロード
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
