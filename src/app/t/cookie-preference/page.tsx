import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LegalCookiePreferenceSwitch } from "@/components/sections/legal-cookie-preference-switch";

export const metadata: Metadata = {
  title: "Cookie設定 | QueryPie AI",
  description: "Cookie preference settings preview page for the Japan site.",
  alternates: {
    canonical: "/t/cookie-preference",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const cookiePreferenceItems = [
  {
    id: "necessary",
    disabled: true,
    label: "必須 Cookie",
    description:
      "これらの Cookie はコア機能に必要で、サイト利用時に常に有効です。セキュリティ維持と基本動作のために使用されます。",
  },
  {
    id: "performance",
    label: "パフォーマンス Cookie",
    description:
      "サイト利用状況を追跡し、応答速度や設定保持などの改善に利用します。無効化すると一部の体験最適化が反映されない場合があります。",
  },
  {
    id: "functional",
    label: "機能 Cookie",
    description:
      "お客様の選択内容を記憶し、よりパーソナルな機能を提供するために利用します。収集情報は匿名化されます。",
  },
  {
    id: "analysis",
    label: "分析 Cookie",
    description:
      "訪問者数や流入元、人気ページなどを集計し、サイト改善に利用します。無効化すると分析精度が低下します。",
  },
  {
    id: "marketing",
    label: "マーケティング Cookie",
    description:
      "広告経由の流入やキャンペーンの成果測定に利用します。個人を直接識別する目的では使用しません。",
  },
] as const;

export default function PreviewCookiePreferencePage() {
  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[120px] pt-[112px] lg:px-[30px] lg:pb-[160px] lg:pt-[144px]">
        <div className="mx-auto max-w-[920px]">
          <div className="mb-10 border-b border-[#d1d5db] pb-6">
            <h1 className="text-[34px] font-normal leading-[1.2] text-slate-950 lg:text-[40px]">Cookie設定</h1>
            <p className="mt-4 text-base leading-7 text-slate-500">
              当社は Cookie などの技術を使用して体験を最適化します。下記カテゴリごとに有効・無効を切り替えられる preview ページです。
            </p>
          </div>

          <LegalCookiePreferenceSwitch items={cookiePreferenceItems} />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
