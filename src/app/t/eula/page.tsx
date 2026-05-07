import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { publicationBodyClassName } from "@/components/sections/publication-post-page";
import { renderEulaPreviewMdx } from "@/lib/legal-preview/eula";

export const metadata: Metadata = {
  title: "EULA | QueryPie AI",
  description: "End User License Agreement の preview ローカルページです。",
  alternates: {
    canonical: "/t/eula",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PreviewEulaPage() {
  const evaluation = await renderEulaPreviewMdx();

  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[120px] pt-[112px] lg:px-[30px] lg:pb-[160px] lg:pt-[144px]">
        <div className="mx-auto max-w-[920px]">
          <div className="border-b border-[#d1d5db] pb-6">
            <h1 className="text-[34px] font-normal leading-[1.2] text-slate-950 lg:text-[40px]">EULA</h1>
            <p className="mt-4 text-base leading-7 text-slate-500">
              corp-web-contents / corp-web-app の current EULA content を元にした preview ページです。
            </p>
          </div>

          <div className={`${publicationBodyClassName} mt-10 [&_h1:first-child]:mt-0`}>{evaluation.content}</div>

          <div className="mt-16 rounded-[10px] bg-[#f9f9fb] px-[30px] py-10 text-center">
            <h2 className="mb-[10px] text-base font-medium text-slate-950">お問い合わせ</h2>
            <p className="mb-[30px] text-sm leading-6 text-slate-500">
              法務・ポリシー関連のご質問がある場合は、お問い合わせフォームからご連絡ください。
            </p>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center rounded-[6px] bg-[#24292F] px-[18px] py-[12px] text-[14px] font-medium leading-none text-white transition hover:opacity-80"
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
