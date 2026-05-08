import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CookiePreferenceItem, CookiePreferenceList } from "@/components/sections/cookie-preference";

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

export default function CookiePreferencePreviewPage() {
  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[112.5px] pt-[108px] lg:px-[30px] lg:pb-[150px] lg:pt-[132px]">
        <div className="mx-auto max-w-[1200px]">
          <h1 className="text-[56.25px] font-normal leading-[67.5px] text-[#24292F]">クッキー設定</h1>

          <div className="mt-[18.75px] max-w-[1200px] text-[15px] font-light leading-[24.375px] tracking-[0.3375px] text-[#57606A]">
            <p>
              当社は、データを収集し、お客様のオンライン体験をカスタマイズするために、「Cookie」などの技術を使用しています。Cookie の設定を管理して、お客様の便宜を図るために分類された特定の種類の Cookie を有効または無効にすることができます。
              <br />
              ページの下部にある Cookie の設定にアクセスすることで、いつでも設定を変更することができます。
            </p>
          </div>

          <div className="mt-[52.5px] max-w-[1200px]">
            <CookiePreferenceList>
              <CookiePreferenceItem
                id="necessary"
                label="必須 Cookie"
                disabled
                description={
                  <p>
                    これらの Cookie は、Web サイトのコア機能を有効にするために必要であり、サイトを使用すると自動的に有効になります。これらには、ショッピングバッグやチェックアウトのプロセスを可能にする Cookie のほか、セキュリティ問題の解決や規制への準拠に役立つ Cookie が含まれます。
                  </p>
                }
              />

              <CookiePreferenceItem
                id="performance"
                label="パフォーマンス Cookie"
                description={
                  <p>
                    これらの Cookie は、当ウェブサイトの利用状況を追跡することで、サイトの機能性を向上させます。場合によっては、これらの Cookie を使用することで、お客様のリクエストを処理する速度が向上したり、お客様が選択したサイト設定を記憶できるようになります。これらの Cookie を無効にすると、カスタマイズされた推奨情報が表示されず、サイトのパフォーマンスが低下することがあります。
                  </p>
                }
              />

              <CookiePreferenceItem
                id="functional"
                label="機能 Cookie"
                description={
                  <p>
                    これらの Cookie は、ウェブサイトがお客様の選択を記憶し、より強化されたパーソナルな機能を提供することを可能にします。これらの Cookie が収集する情報は匿名化されており、他のウェブサイトでの閲覧状況を追跡することはありません。
                  </p>
                }
              />

              <CookiePreferenceItem
                id="analysis"
                label="分析 Cookie"
                description={
                  <p>
                    これらの Cookie を使用することで、訪問者数とトラフィックソースをカウントし、サイトのパフォーマンスを測定および改善することができます。これらの Cookie は、どのページが最も人気があり、最も人気がないかを把握し、訪問者がサイト内をどのように移動しているかを確認するのに役立ちます。これらの Cookie が収集する情報はすべて集計されるため、匿名となります。これらの Cookie を許可しない場合、弊社はお客様がいつ弊社サイトを訪れたかを知ることができず、そのパフォーマンスを監視することができません。
                  </p>
                }
              />

              <CookiePreferenceItem
                id="marketing"
                label="マーケティング Cookie"
                description={
                  <p>
                    マーケティング Cookie は、ユーザーが特定の広告を経由して当サイトにアクセスしたかどうかを識別し、Google 広告などのキャンペーンのパフォーマンスを測定することで、効果的な広告の計画と実行に役立ちます。これらの非必須 Cookie は、お客様の同意を必要とし、特定の個人を識別するために使用されることはありません。
                  </p>
                }
              />
            </CookiePreferenceList>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1920px] bg-[#F6F8FA] px-[22.5px] pb-[112.5px] pt-[112.5px] text-center lg:px-[22.5px]">
        <div className="mx-auto max-w-[841px]">
          <h2 className="text-[48.75px] font-normal leading-[58.125px] text-[#24292F]">まずは小さく、失敗しないAXを始めよう</h2>
          <p className="mt-[18.75px] text-[15px] font-light leading-[24.375px] tracking-[0.3375px] text-[#24292F]">
            簡単サインアップで、14日間の無料トライアルをお試しください
          </p>
          <div className="mt-[38px] flex justify-center">
            <Link
              href="https://app.querypie.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-[10px] rounded-[6px] bg-[linear-gradient(100deg,#0762D4_34.93%,#875AC5_76.81%,#C55A8C_99.98%)] px-[26.25px] py-[13.125px] text-[15px] font-normal leading-[15px] text-[#F6F6F6] transition hover:brightness-[1.04]"
            >
              <span className="block">無料で試してみる</span>
              <span aria-hidden="true" className="inline-flex h-[12px] w-[12px] items-center justify-center">
                <svg viewBox="0 0 7 12" className="h-[12px] w-[7px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 6L0.865033 12L0 11.154L5.26381 6L0 0.846L0.865033 0L7 6Z" fill="currentColor" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
