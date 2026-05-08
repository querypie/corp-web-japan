import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CtaActions, CtaContent, CtaCopy, CtaDescription, CtaTitle, SimpleCtaSection } from "@/components/sections/simple-cta-section";
import { LegalCookiePreferenceSwitch } from "@/components/sections/legal-cookie-preference-switch";
import { BrandGradientCtaButton } from "@/components/ui/brand-gradient-cta-button";

export const metadata: Metadata = {
  title: "クッキー設定 | QueryPie AI",
  description: "QueryPieのクッキー設定を管理します。",
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
      "これらの Cookie は、Web サイトのコア機能を有効にするために必要であり、サイトを使用すると自動的に有効になります。これらには、ショッピングバッグやチェックアウトのプロセスを可能にする Cookie のほか、セキュリティ問題の解決や規制への準拠に役立つ Cookie が含まれます。",
  },
  {
    id: "performance",
    label: "パフォーマンス Cookie",
    description:
      "これらの Cookie は、当ウェブサイトの利用状況を追跡することで、サイトの機能性を向上させます。場合によっては、これらの Cookie を使用することで、お客様のリクエストを処理する速度が向上したり、お客様が選択したサイト設定を記憶できるようになります。これらの Cookie を無効にすると、カスタマイズされた推奨情報が表示されず、サイトのパフォーマンスが低下することがあります。",
  },
  {
    id: "functional",
    label: "機能 Cookie",
    description:
      "これらの Cookie は、ウェブサイトがお客様の選択を記憶し、より強化されたパーソナルな機能を提供することを可能にします。これらの Cookie が収集する情報は匿名化されており、他のウェブサイトでの閲覧状況を追跡することはありません。",
  },
  {
    id: "analysis",
    label: "分析 Cookie",
    description:
      "これらの Cookie を使用することで、訪問者数とトラフィックソースをカウントし、サイトのパフォーマンスを測定および改善することができます。これらの Cookie は、どのページが最も人気があり、最も人気がないかを把握し、訪問者がサイト内をどのように移動しているかを確認するのに役立ちます。これらの Cookie が収集する情報はすべて集計されるため、匿名となります。これらの Cookie を許可しない場合、弊社はお客様がいつ弊社サイトを訪れたかを知ることができず、そのパフォーマンスを監視することができません。",
  },
  {
    id: "marketing",
    label: "マーケティング Cookie",
    description:
      "マーケティング Cookie は、ユーザーが特定の広告を経由して当サイトにアクセスしたかどうかを識別し、Google 広告などのキャンペーンのパフォーマンスを測定することで、効果的な広告の計画と実行に役立ちます。これらの非必須 Cookie は、お客様の同意を必要とし、特定の個人を識別するために使用されることはありません。",
  },
] as const;

export default function PreviewCookiePreferencePage() {
  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[120px] pt-[112px] lg:px-[30px] lg:pb-[160px] lg:pt-[144px]">
        <div className="mx-auto max-w-[920px]">
          <div className="border-b border-slate-200 pb-8">
            <h1 className="text-[34px] font-normal leading-[1.2] text-slate-950 lg:text-[40px]">クッキー設定</h1>
            <p className="mt-4 text-[16px] font-light leading-7 tracking-[0.01em] text-slate-600">
              当社は、データを収集し、お客様のオンライン体験をカスタマイズするために、「Cookie」などの技術を使用しています。Cookie の設定を管理して、お客様の便宜を図るために分類された特定の種類の Cookie を有効または無効にすることができます。
              <br />
              ページの下部にある Cookie の設定にアクセスすることで、いつでも設定を変更することができます。
            </p>
          </div>

          <div className="pt-8">
            <LegalCookiePreferenceSwitch items={cookiePreferenceItems} />
          </div>
        </div>
      </section>

      <SimpleCtaSection>
        <CtaContent>
          <CtaCopy>
            <CtaTitle>まずは小さく、失敗しないAXを始めよう</CtaTitle>
            <CtaDescription>簡単サインアップで、14日間の無料トライアルをお試しください</CtaDescription>
          </CtaCopy>
          <CtaActions>
            <BrandGradientCtaButton href="https://app.querypie.com/">無料で試してみる</BrandGradientCtaButton>
          </CtaActions>
        </CtaContent>
      </SimpleCtaSection>

      <SiteFooter />
    </main>
  );
}
