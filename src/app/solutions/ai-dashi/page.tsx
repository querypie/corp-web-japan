import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Blocks,
  Check,
  Database,
  Settings,
  ShieldCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { aiDashiConsultUrl, aiDashiFloatingUrl, aiDashiWhitepaperUrl } from "@/content/ai-dashi-links";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FloatingConversionCta } from "@/components/layout/floating-conversion-cta";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { ZoomableFigure } from "@/components/sections/zoomable-figure";
import {
  AIDashiComparisonBody,
  AIDashiComparisonCallout,
  AIDashiComparisonHeaderRow,
  AIDashiComparisonLabelCell,
  AIDashiComparisonLegacyCell,
  AIDashiComparisonNote,
  AIDashiComparisonPreferredCell,
  AIDashiComparisonRow,
  AIDashiComparisonSection,
  AIDashiComparisonTable,
  AIDashiComparisonTitle,
  AIDashiComparisonIntro,
} from "@/components/sections/ai-dashi-comparison-section";
import {
  AIDashiSupportBody,
  AIDashiSupportCard,
  AIDashiSupportCardDetailLabel,
  AIDashiSupportCardDetails,
  AIDashiSupportCardHeader,
  AIDashiSupportCardIcon,
  AIDashiSupportCardLead,
  AIDashiSupportCardLayout,
  AIDashiSupportCardPoint,
  AIDashiSupportCardPointList,
  AIDashiSupportCardText,
  AIDashiSupportCardTitle,
  AIDashiSupportCards,
  AIDashiSupportIntro,
  AIDashiSupportSection,
  AIDashiSupportTitle,
} from "@/components/sections/ai-dashi-support-section";
export const metadata: Metadata = {
  title: "自社サービスをAI搭載SaaSへ最短で進化させる | AI Dashi | QueryPie AI",
  description:
    "QueryPie AI Dashiは、自社SaaSやWebサービスにエンタープライズ品質のAI基盤を組み込むためのソリューションです。ブランド体験はそのままに、最短でAI搭載サービスへ進化させます。",
  alternates: {
    canonical: "/solutions/ai-dashi",
  },
  openGraph: {
    title: "自社サービスをAI搭載SaaSへ最短で進化させる | AI Dashi | QueryPie AI",
    description:
      "QueryPie AI Dashiは、自社SaaSやWebサービスにエンタープライズ品質のAI基盤を組み込むためのソリューションです。",
    type: "website",
  },
  twitter: {
    title: "自社サービスをAI搭載SaaSへ最短で進化させる | AI Dashi | QueryPie AI",
    description:
      "QueryPie AI Dashiは、自社SaaSやWebサービスにエンタープライズ品質のAI基盤を組み込むためのソリューションです。",
    card: "summary_large_image",
  },
};

const releaseFlow = [
  {
    step: "STEP 01",
    period: "1〜2週間",
    title: "ヒアリング・要件定義",
    body:
      "貴社のビジネスモデルや既存システム、実現したいAI機能を深くヒアリングし、最適なアーキテクチャと実装方針を策定します。",
  },
  {
    step: "STEP 02",
    period: "2〜3週間",
    title: "プロトタイプ作成",
    body:
      "要件に基づき、UI/UXを貴社ブランドに合わせてカスタマイズした初期のAIモデル・プロトタイプを構築し、実際の動作をご確認いただきます。",
  },
  {
    step: "STEP 03",
    period: "4〜6週間",
    title: "統合開発・テスト",
    body:
      "既存の自社サービスやデータベースとのAPI連携（組み込み）を実施。ハルシネーション対策の調整やセキュリティ要件を満たすためのテストを徹底して行います。",
  },
  {
    step: "STEP 04",
    period: "最短1〜3ヶ月",
    title: "本番リリース・運用開始",
    body:
      "貴社の顧客向けにAIサービスを公開。リリース後も24時間365日のインフラ監視と、FDEによる継続的な改善サポートでビジネスの成長を支えます。",
  },
] as const;

const aiWallCards: ReadonlyArray<{
  icon: LucideIcon;
  title: string;
  body: string;
}> = [
  {
    icon: Users,
    title: "人材と技術の枯渇",
    body: "AI専門エンジニアの採用難に加え、日進月歩で変わる最新アーキテクチャへの追従に開発リソースが食いつぶされ、本来のコア事業の進化が止まります。",
  },
  {
    icon: Database,
    title: "データ整備の泥沼",
    body: "自社データベースを正確にAIに読み込ませる（RAG構築）には膨大な工数がかかり、実用レベルの精度が出ないままリリースが無限に延期されます。",
  },
  {
    icon: Settings,
    title: "肥大化するインフラ保守",
    body: "リリース後も、モデルの更新やプロンプトの調整、インフラ監視など、想定外の保守運用コストが継続的に発生し利益を圧迫します。",
  },
] as const;

const lostSection = {
  title: {
    line1: "明日、AIを搭載した競合が現れたら。",
    line2: "貴社のサービスは選ばれ続けますか？",
  },
  paragraphs: [
    "LLM（大規模言語モデル）の進化により、ソフトウェアの価値基準が根底から変わろうとしています。ユーザーの期待値は、手動で画面を操作する従来のSaaSから、AIが自律的に作業を完結させるSaaSへと急速に移行しています。",
    "自社の長年の強みに固執している間に、AIエージェントを組み込んだ後発のサービスが、圧倒的な自動化体験を武器に突然シェアを奪いに来る時代です。",
    "AI実装の遅れは、単なる機能不足ではありません。サービスの陳腐化と致命的な解約（チャーン）に直結する、経営レベルの危機なのです。",
  ],
} as const;

const enterpriseReadyItems = [
  {
    icon: ShieldCheck,
    title: "B2B基準の権限管理（RBAC）",
    body:
      "組織階層やユーザーごとの緻密なアクセス制御をAPIで実装。情報漏洩の致命的リスクを防ぎます。",
  },
  {
    icon: Database,
    title: "ハルシネーションを防ぐガードレール",
    body:
      "自社データのみに基づく事実回答を徹底し、B2Bの業務利用で絶対に許されない「AIの嘘」を防止します。",
  },
  {
    icon: Check,
    title: "監査ログとコンプライアンス対応",
    body:
      "SOC2 / ISO27001水準のセキュリティ基盤により、エンタープライズ顧客の厳しいセキュリティシート（導入審査）をパスできます。",
  },
] as const;


export default function AIDashiPage() {
  return (
    <main className="relative overflow-x-hidden bg-[#eceff3] pt-[64px] text-slate-950">
      <SiteHeader />
      <FloatingConversionCta href={aiDashiFloatingUrl} />

      <section className="relative mx-auto max-w-[1920px] overflow-hidden bg-[#eceff3] px-6 py-14 lg:px-10 lg:py-[84px]">
        <div className="absolute inset-0">
          <div className="relative h-full w-full">
            <Image
              src="/solutions/ai-dashi/hero-ai.webp"
              alt="AI Dashi hero visual"
              fill
              priority
              className="object-cover object-[50%_18%]"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,18,34,0.4)_0%,rgba(10,18,34,0.22)_30%,rgba(10,18,34,0.08)_58%,rgba(10,18,34,0.0)_100%)]" />
          <div className="absolute left-[8%] top-[12%] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(237,96,46,0.18)_0%,rgba(237,96,46,0.06)_38%,rgba(237,96,46,0)_72%)] blur-2xl" />
          <div className="absolute left-[22%] top-[24%] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_34%,rgba(255,255,255,0)_72%)] blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-[1260px] items-center justify-start px-[30px] text-left">
          <div className="flex w-full max-w-[790px] flex-col items-start gap-5 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,34,0.12)_0%,rgba(10,18,34,0.28)_100%)] px-6 py-7 shadow-[0_28px_72px_-46px_rgba(15,23,42,0.65)] backdrop-blur-[10px] sm:px-8 sm:py-8 lg:gap-5 lg:px-9 lg:py-10">
            <p className="hero-copy-enter inline-flex rounded-full border border-white/18 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/78 backdrop-blur">
              組み込み型AI基盤・ホワイトラベル対応
            </p>
            <h1 className="max-w-[760px] text-[34px] font-semibold leading-[1.12] tracking-[-0.04em] text-white md:text-[40px] md:leading-[1.12] lg:text-[54px] lg:leading-[1.16] lg:tracking-[-1.02px]">
              <span className="hero-title-fragment block">自社サービスを</span>
              <span
                className="hero-title-fragment hero-highlight-sweep block bg-gradient-to-r from-[#ffffff] via-[#edf3ff] to-[#b8c9ff] bg-clip-text text-transparent drop-shadow-[0_12px_28px_rgba(159,182,255,0.22)]"
                style={{ animationDelay: "110ms" }}
              >
                AI搭載SaaS
                <span className="text-white">へ</span>
              </span>
              <span className="hero-title-fragment block" style={{ animationDelay: "220ms" }}>
                最短で進化させる
              </span>
            </h1>
            <p className="hero-copy-enter hero-copy-enter-1 max-w-[540px] text-[15px] leading-8 text-white/84 md:max-w-[620px] md:text-[16px] lg:max-w-[660px]">
              ブランド体験はそのままに、エンタープライズ品質のAI基盤をシームレスに統合。ゼロからの開発リスクを排除し、新たな収益源の創出とタイム・トゥ・マーケットを最速化します。
            </p>
            <div className="hero-copy-enter hero-copy-enter-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={aiDashiConsultUrl}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[10px] border border-white bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_36px_-24px_rgba(15,23,42,0.42)] transition hover:bg-slate-100"
              >
                無料で導入相談・お見積り
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={aiDashiWhitepaperUrl}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[10px] border border-white/24 bg-white/6 px-5 py-3 text-sm font-semibold text-white/92 backdrop-blur transition hover:bg-white/10"
              >
                資料をダウンロード
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1920px] bg-white px-6 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1120px]">
          <RevealOnScroll variant="up">
            <div className="mx-auto max-w-[980px] rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.95)_100%)] px-6 py-8 shadow-[0_22px_60px_-46px_rgba(15,23,42,0.16)] sm:px-8 lg:px-10 lg:py-10">
              <div className="max-w-[860px] border-l-4 border-[#ED602E] pl-5">
                <p className="text-[14px] font-semibold leading-7 tracking-[0.02em] text-[#8c4a2f] sm:text-[15px]">
                  {lostSection.title.line1}
                </p>
                <h2 className="mt-2 text-[28px] font-bold leading-[1.18] tracking-[-0.04em] text-slate-950 sm:text-[34px] lg:text-[38px] lg:whitespace-nowrap">
                  {lostSection.title.line2}
                </h2>
                <div className="mt-6 space-y-5 text-[15px] leading-8 text-slate-600">
                  <p>{lostSection.paragraphs[0]}</p>
                  <p>{lostSection.paragraphs[1]}</p>
                  <p>
                    AI実装の遅れは、単なる機能不足ではありません。サービスの陳腐化と
                    <span className="font-semibold text-slate-800"> 致命的な解約（チャーン）</span>
                    に直結する、経営レベルの危機なのです。
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section id="about-ai-dashi" className="mx-auto max-w-[1920px] bg-[#f8fafc] px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1120px]">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:justify-between lg:gap-10">
            <RevealOnScroll variant="up" className="flex flex-col">
              <div className="flex flex-col gap-5">
                <h2 className="text-[34px] font-semibold leading-[1.24] tracking-[-0.03em] text-slate-950 sm:text-[42px] sm:leading-[54px] sm:tracking-[-0.04em]">
                  なぜ
                  <span className="bg-gradient-to-r from-[#E45A2A] via-[#ED602E] to-[#F08A3C] bg-clip-text text-transparent">
                    AI Dashi
                  </span>
                  なのか？
                </h2>

                <div className="max-w-[640px] space-y-5 text-[15px] leading-8 text-slate-500">
                  <p>良い「出汁」は、主役の食材を邪魔せず、料理全体の旨味を底上げします。</p>
                  <p>SaaSやWebサービスにおけるAIも同じです。AIそのものが主役になるのではなく、貴社がこれまで築き上げてきた「プロダクトのコア価値」を裏側から圧倒的に引き上げる存在でなければなりません。</p>
                  <p>QueryPie AIが提供するAIプラットフォーム（AIP）は、貴社のUIやブランドの世界観に完全に溶け込み、ユーザーに「このサービス、すごく便利になった！」という最高の体験（旨味）を提供するための、最高品質のAI基盤（AI Dashi）です。</p>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll variant="right" delayMs={160} className="relative h-[320px] w-full overflow-hidden rounded-[20px] bg-[#eceff3] shadow-[0_24px_70px_-50px_rgba(15,23,42,0.22)] lg:h-[430px] lg:w-full">
              <Image
                src="/solutions/ai-dashi/about-visual.webp"
                alt="AI Dashi のコンセプトを表現するビジュアル"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section id="ai-dashi-values" className="mx-auto max-w-[1920px] bg-white px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1120px]">
          <div className="flex flex-col items-center gap-12">
            <RevealOnScroll variant="up" className="w-full max-w-[920px] text-center">
              <h2 className="text-[34px] font-semibold leading-[1.24] tracking-[-0.03em] text-slate-950 sm:text-[42px] sm:leading-[54px] sm:tracking-[-0.04em]">
                QueryPie AIPが提供する3つの価値
              </h2>
            </RevealOnScroll>

            <RevealOnScroll className="grid w-full gap-4 lg:grid-cols-3" variant="up" delayMs={120}>
              <article className="rounded-[1.8rem] border border-black/6 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-md shadow-[0_22px_56px_-44px_rgba(15,23,42,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="text-[32px] font-semibold tracking-[-0.06em] text-slate-300">
                    01
                  </div>
                  <div className="inline-flex rounded-full bg-[#eef2f7] px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#2f3a49]">
                    競合優位性の確立
                  </div>
                </div>
                <h3 className="mt-5 text-[21px] font-semibold leading-7 tracking-[-0.03em] text-slate-950">
                  自社の<span className="text-[#ED602E]">オリジナル機能</span>としてシームレスに展開
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  他社の汎用AIツールを外付けするのではなく、貴社プロダクトの裏側に深く組み込みます。ブランド体験を損なわず、直接的な競争力と顧客ロイヤルティを高めます。
                </p>
              </article>

              <article className="rounded-[1.8rem] border border-black/6 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-md shadow-[0_22px_56px_-44px_rgba(15,23,42,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="text-[32px] font-semibold tracking-[-0.06em] text-slate-300">
                    02
                  </div>
                  <div className="inline-flex rounded-full bg-[#eef2f7] px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#2f3a49]">
                    開発リソースの最適化
                  </div>
                </div>
                <h3 className="mt-5 text-[21px] font-semibold leading-7 tracking-[-0.03em] text-slate-950">
                  AI開発の<span className="text-[#ED602E]">技術的負債を回避</span>し、コアビジネスに集中
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  変化の速いLLMの追従や複雑なインフラ保守はすべてQueryPie AIPが担います。ゼロから内製するコストとリスクを抑え、エンジニアの貴重な時間を本来のプロダクト開発に集中させられます。
                </p>
              </article>

              <article className="rounded-[1.8rem] border border-black/6 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-md shadow-[0_22px_56px_-44px_rgba(15,23,42,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="text-[32px] font-semibold tracking-[-0.06em] text-slate-300">
                    03
                  </div>
                  <div className="inline-flex rounded-full bg-[#eef2f7] px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#2f3a49]">
                    事業成長の加速
                  </div>
                </div>
                <h3 className="mt-5 text-[20px] font-semibold leading-7 tracking-[-0.045em] text-slate-950">
                  <span className="text-[#ED602E]">タイム・トゥ・マーケット</span>を最速化し、新たな収益源へ
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  フルスクラッチなら1年以上かかるエンタープライズ水準のセキュアなAI基盤を、最短1ヶ月で市場投入。単価向上（アップセル）や新プランの立ち上げを加速します。
                </p>
              </article>
            </RevealOnScroll>

            <RevealOnScroll className="w-full max-w-[820px]" variant="up" delayMs={220}>
              <ZoomableFigure
                src="/solutions/ai-dashi/value-diagram.png"
                alt="AI Dashi の3つの価値を示す図解"
                caption=""
                sizes="(min-width: 1024px) 680px, 100vw"
                modalScale={1.25}
              />
            </RevealOnScroll>

          </div>
        </div>
      </section>

      <section id="why-ai-dashi" className="mx-auto max-w-[1920px] bg-[#f8fafc] px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col items-center gap-12">
            <RevealOnScroll variant="up" className="w-full max-w-[920px] text-center">
              <h2 className="text-[34px] font-semibold leading-[1.24] tracking-[-0.03em] text-slate-950 sm:text-[42px] sm:leading-[54px] sm:tracking-[-0.04em]">
                ゼロからの自社AI化を阻む、3つの致命的リスク
              </h2>
              <p className="mx-auto mt-5 max-w-[710px] text-left text-base leading-7 text-slate-500">
                LLMのAPIを叩くだけなら簡単ですが、それを「商用レベルのSaaS」として実装しようとすると、多くのプロジェクトが以下の壁に直面し頓挫します。
              </p>
            </RevealOnScroll>

            <RevealOnScroll className="grid w-full gap-4 lg:grid-cols-3 lg:gap-4" variant="up" delayMs={120}>
              {aiWallCards.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.title} className="flex h-full flex-col rounded-[1.8rem] border border-black/6 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-md shadow-[0_22px_56px_-44px_rgba(15,23,42,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#eef1f4] text-[#15181d]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-[22px] font-semibold leading-8 tracking-[-0.03em] text-slate-950">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
                  </article>
                );
              })}
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section id="enterprise-ready" className="mx-auto max-w-[1920px] bg-white px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col items-center gap-12">
            <RevealOnScroll variant="up" className="w-full max-w-[900px] text-center">
              <h2 className="text-[34px] font-semibold leading-[1.24] tracking-[-0.03em] text-slate-950 sm:text-[42px] sm:leading-[54px] sm:tracking-[-0.04em]">
                LLMを繋ぐだけでは、
                <br />
                エンタープライズ顧客には売れない
              </h2>
              <p className="mx-auto mt-5 max-w-[780px] text-left text-base leading-7 text-slate-500">
                AI機能を実装できても、大企業が求める厳しいセキュリティ要件を満たさなければ、導入審査で弾かれます。
                QueryPie AIPは、これらの要件をあらかじめクリアしたAI基盤です。
              </p>
            </RevealOnScroll>

            <RevealOnScroll className="grid w-full gap-4 lg:grid-cols-3" variant="up" delayMs={120}>
              {enterpriseReadyItems.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="flex h-full flex-col rounded-[1.8rem] border border-slate-200/80 bg-white p-6 shadow-[0_22px_56px_-44px_rgba(15,23,42,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-[16px] border border-slate-200 bg-[#f6f8fb] text-[#2f3a49] shadow-[0_16px_34px_-24px_rgba(15,23,42,0.18)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-[22px] font-semibold leading-8 tracking-[-0.03em] text-slate-950">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
                  </article>
                );
              })}
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <AIDashiComparisonSection>
        <AIDashiComparisonIntro>
          <AIDashiComparisonTitle>QueryPie AIPと自社開発の比較</AIDashiComparisonTitle>
          <AIDashiComparisonBody>
            <p>
              ゼロから要件を満たす基盤を構築するフルスクラッチ（自社開発）とQueryPie AIPの比較です。AIPを活用すれば、開発期間・初期コスト・運用リスクのすべてを圧倒的に圧縮し、最短で市場へ展開できます。
            </p>
          </AIDashiComparisonBody>
        </AIDashiComparisonIntro>

        <AIDashiComparisonTable>
          <AIDashiComparisonHeaderRow />

          <AIDashiComparisonRow>
            <AIDashiComparisonLabelCell>開発期間</AIDashiComparisonLabelCell>
            <AIDashiComparisonPreferredCell title="最短1ヶ月（API組み込みのみ）" body="すぐに市場投入が可能" />
            <AIDashiComparisonLegacyCell title="半年〜1年以上（試行錯誤の連続）" body="競合に先を越され市場機会を逃す" />
          </AIDashiComparisonRow>

          <AIDashiComparisonRow>
            <AIDashiComparisonLabelCell>初期インフラ投資</AIDashiComparisonLabelCell>
            <AIDashiComparisonPreferredCell title="初期投資ゼロ（インフラ不要）" body="使った分だけの従量課金でスモールスタートが可能" />
            <AIDashiComparisonLegacyCell title="数千万円規模の先行投資" body="サーバー代や検証費用など、回収不能なサンクコストが発生" />
          </AIDashiComparisonRow>

          <AIDashiComparisonRow>
            <AIDashiComparisonLabelCell>専門エンジニア確保</AIDashiComparisonLabelCell>
            <AIDashiComparisonPreferredCell title="QueryPie AIのFDE（専門エンジニア）が伴走" body="AIに関する専門知識不要" />
            <AIDashiComparisonLegacyCell title="AI人材の採用が必須（極めて困難）" body="人件費の高騰で採用が進まないリスク" />
          </AIDashiComparisonRow>

          <AIDashiComparisonRow>
            <AIDashiComparisonLabelCell>セキュリティ</AIDashiComparisonLabelCell>
            <AIDashiComparisonPreferredCell title="エンタープライズ品質の基盤（SOC2/ISO27001）" body="厳格な権限管理（RBAC）が標準装備" />
            <AIDashiComparisonLegacyCell title="ゼロトラストアーキテクチャを一から構築" body="情報漏洩の致命的リスクと認証取得の果てしない工数" />
          </AIDashiComparisonRow>

          <AIDashiComparisonRow>
            <AIDashiComparisonLabelCell>ハルシネーション対策</AIDashiComparisonLabelCell>
            <AIDashiComparisonPreferredCell title="エンタープライズRAGによる事実のみの回答" body="内蔵されたガードレール機能でB2Bでの業務利用も安心" />
            <AIDashiComparisonLegacyCell title="精度が上がらず本番リリース不可" body="自社データとLLMの連携（チャンキング等）で泥沼化" />
          </AIDashiComparisonRow>

          <AIDashiComparisonRow>
            <AIDashiComparisonLabelCell isLast>運用保守</AIDashiComparisonLabelCell>
            <AIDashiComparisonPreferredCell title="24時間365日のインフラ監視と継続アップデート" body="LLMの進化や運用はすべてオフロード、本業に集中" isLast />
            <AIDashiComparisonLegacyCell title="自社エンジニアが運用保守に追われる" body="プロンプト調整やインフラ管理でコア事業の進化が停止" isLast />
          </AIDashiComparisonRow>
        </AIDashiComparisonTable>

        <AIDashiComparisonNote>
          ※記載の期間・費用は標準的な導入ケースの目安です。要件により変動します。
        </AIDashiComparisonNote>

        <AIDashiComparisonCallout>
          <p className="text-base leading-6 text-slate-600">
            競合他社がAI化を進める中、開発に半年以上かけていては市場機会を逃します。
          </p>
          <p className="mt-2 text-[18px] font-semibold leading-7 text-slate-950">
            QueryPie AIPを活用すれば、
            <span className="bg-gradient-to-r from-[#E45A2A] via-[#ED602E] to-[#F08A3C] bg-clip-text text-transparent">
              最短1ヶ月で
            </span>
            独自のAIサービスをリリースできます。
          </p>
        </AIDashiComparisonCallout>
      </AIDashiComparisonSection>

      <AIDashiSupportSection>
        <AIDashiSupportIntro>
          <AIDashiSupportTitle>QueryPie AIの包括的サポート体制</AIDashiSupportTitle>
          <AIDashiSupportBody>
            単なるツールの提供ではありません。貴社が自社ブランドのAIサービスを確実かつ迅速にリリースし、安定して運用し続けるために必要なすべての要素を、QueryPie AIがワンストップで提供します。
          </AIDashiSupportBody>
        </AIDashiSupportIntro>

        <AIDashiSupportCards>
          <AIDashiSupportCard>
            <AIDashiSupportCardLayout>
              <AIDashiSupportCardHeader>
                <AIDashiSupportCardIcon>
                  <Blocks className="h-5 w-5" />
                </AIDashiSupportCardIcon>
                <AIDashiSupportCardText>
                  <AIDashiSupportCardTitle>カスタマイズ自在なAI基盤の提供</AIDashiSupportCardTitle>
                  <AIDashiSupportCardLead>最速での市場投入を実現するコアシステム</AIDashiSupportCardLead>
                </AIDashiSupportCardText>
              </AIDashiSupportCardHeader>
              <AIDashiSupportCardDetails>
                <AIDashiSupportCardDetailLabel>提供内容</AIDashiSupportCardDetailLabel>
                <AIDashiSupportCardPointList>
                  <AIDashiSupportCardPoint>貴社のブランドデザインに合わせたUI/UXのフルカスタマイズ</AIDashiSupportCardPoint>
                  <AIDashiSupportCardPoint>QueryPie AIが誇る高性能AIエージェント基盤の提供</AIDashiSupportCardPoint>
                  <AIDashiSupportCardPoint>既存の自社サービスやデータベースとシームレスに繋がるAPI連携</AIDashiSupportCardPoint>
                  <AIDashiSupportCardPoint>最短1〜3ヶ月でのスピーディな立ち上げを可能にする開発環境</AIDashiSupportCardPoint>
                </AIDashiSupportCardPointList>
              </AIDashiSupportCardDetails>
            </AIDashiSupportCardLayout>
          </AIDashiSupportCard>

          <AIDashiSupportCard>
            <AIDashiSupportCardLayout>
              <AIDashiSupportCardHeader>
                <AIDashiSupportCardIcon>
                  <Users className="h-5 w-5" />
                </AIDashiSupportCardIcon>
                <AIDashiSupportCardText>
                  <AIDashiSupportCardTitle>専門エンジニアによる開発支援</AIDashiSupportCardTitle>
                  <AIDashiSupportCardLead>貴社チームに伴走し、最適なAIを共に創り上げる</AIDashiSupportCardLead>
                </AIDashiSupportCardText>
              </AIDashiSupportCardHeader>
              <AIDashiSupportCardDetails>
                <AIDashiSupportCardDetailLabel>提供内容</AIDashiSupportCardDetailLabel>
                <AIDashiSupportCardPointList>
                  <AIDashiSupportCardPoint>現場導入支援エンジニア（FDE）がプロジェクトの要件定義から参画</AIDashiSupportCardPoint>
                  <AIDashiSupportCardPoint>貴社のドメイン知識と私たちのAI知見を掛け合わせた最適なアーキテクチャ設計</AIDashiSupportCardPoint>
                  <AIDashiSupportCardPoint>初期セットアップから、貴社開発チームへの技術トレーニング・ナレッジ移転</AIDashiSupportCardPoint>
                  <AIDashiSupportCardPoint>リリースに向けた継続的かつ専門的な技術サポート</AIDashiSupportCardPoint>
                </AIDashiSupportCardPointList>
              </AIDashiSupportCardDetails>
            </AIDashiSupportCardLayout>
          </AIDashiSupportCard>

          <AIDashiSupportCard>
            <AIDashiSupportCardLayout>
              <AIDashiSupportCardHeader>
                <AIDashiSupportCardIcon>
                  <ShieldCheck className="h-5 w-5" />
                </AIDashiSupportCardIcon>
                <AIDashiSupportCardText>
                  <AIDashiSupportCardTitle>24時間365日のインフラ・運用保守</AIDashiSupportCardTitle>
                  <AIDashiSupportCardLead>リリース後も安心。インフラ管理を完全にオフロード</AIDashiSupportCardLead>
                </AIDashiSupportCardText>
              </AIDashiSupportCardHeader>
              <AIDashiSupportCardDetails>
                <AIDashiSupportCardDetailLabel>提供内容</AIDashiSupportCardDetailLabel>
                <AIDashiSupportCardPointList>
                  <AIDashiSupportCardPoint>セキュアで高可用性を誇るAIインフラの構築と運用</AIDashiSupportCardPoint>
                  <AIDashiSupportCardPoint>24時間365日体制でのシステム監視・障害対応（ハウジングサポート）</AIDashiSupportCardPoint>
                  <AIDashiSupportCardPoint>最新のAIモデルへのアップデートや、継続的な機能改善の適用</AIDashiSupportCardPoint>
                  <AIDashiSupportCardPoint>インフラ運用のリソースを気にすることなく、ビジネス成長に集中できる環境</AIDashiSupportCardPoint>
                </AIDashiSupportCardPointList>
              </AIDashiSupportCardDetails>
            </AIDashiSupportCardLayout>
          </AIDashiSupportCard>
        </AIDashiSupportCards>
      </AIDashiSupportSection>

      <section id="ai-dashi-flow" className="mx-auto max-w-[1920px] bg-[#f8fafc] px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-10">
            <RevealOnScroll variant="up" className="w-full max-w-[920px] text-center">
              <h2 className="text-[34px] font-semibold leading-[1.24] tracking-[-0.03em] text-slate-950 sm:text-[42px] sm:leading-[54px] sm:tracking-[-0.04em]">
                最速で市場へ
                <br />
                市場機会を逃さない、
                <span className="bg-gradient-to-r from-[#E45A2A] via-[#ED602E] to-[#F08A3C] bg-clip-text text-transparent">
                  圧倒的な導入スピード
                </span>
              </h2>
              <p className="mx-auto mt-5 max-w-[760px] text-left text-base leading-7 text-slate-500">
                ゼロからAIを自社開発し、試行錯誤で時間を浪費する必要はありません。当社の専門エンジニア（FDE）が要件定義から本番公開まで一気通貫で伴走し、競合に先んじたスピーディな立ち上げを実現します。
              </p>
            </RevealOnScroll>

            <RevealOnScroll className="grid w-full gap-4 lg:grid-cols-2" variant="up" delayMs={120}>
              {releaseFlow.map((item) => (
                <article
                  key={item.step}
                  className="flex h-full flex-col rounded-[1.6rem] border border-black/6 bg-white p-5 shadow-[0_22px_56px_-44px_rgba(15,23,42,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-md lg:p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex rounded-full border border-[#2f3a49]/20 bg-[#2f3a49] px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-white shadow-[0_12px_24px_-18px_rgba(15,23,42,0.38)]">
                      {item.step}
                    </div>
                    <div className="inline-flex rounded-full bg-[#fff4ee] px-3 py-1 text-[12px] font-semibold text-[#b85733]">
                      {item.period}
                    </div>
                  </div>
                  <h3 className="mt-5 text-[21px] font-semibold leading-7 tracking-[-0.03em] text-slate-950 md:text-[22px] md:leading-8 md:tracking-[-0.04em]">
                    {item.title}
                  </h3>
                  <div className="mt-4 flex-1 border-t border-black/6 pt-4">
                    <p className="text-sm leading-7 text-slate-600">{item.body}</p>
                  </div>
                </article>
              ))}
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1920px] bg-[#f8fafc] px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1120px]">
          <div className="rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(255,255,255,0.98)_100%)] px-6 py-8 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.14)] lg:px-8 lg:py-10">
            <div className="flex flex-col items-center gap-10">
              <RevealOnScroll variant="up" className="w-full max-w-[860px] text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">White Paper</p>
                <h2 className="mt-2 text-[24px] font-semibold leading-[1.3] tracking-[-0.03em] text-slate-950 sm:text-[30px]">
                  SaaS事業責任者向けホワイトペーパー
                </h2>
                <p className="mx-auto mt-4 max-w-[760px] text-left text-base leading-7 text-slate-500">
                  AIエージェント時代に、SaaS企業が取るべき戦略をまとめた資料を無料でダウンロードいただけます。
                </p>
              </RevealOnScroll>

              <RevealOnScroll
                variant="up"
                delayMs={120}
                className="w-full max-w-[980px]"
              >
                <Link
                  href={aiDashiWhitepaperUrl}
                  className="group grid overflow-hidden rounded-[1.8rem] border border-black/6 bg-white shadow-[0_22px_56px_-44px_rgba(15,23,42,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-md md:grid-cols-[280px_minmax(0,1fr)]"
                >
                  <div className="relative min-h-[260px] bg-[#f5f7fb] p-6 md:min-h-full">
                    <Image
                      src="/solutions/ai-dashi/the-end-of-saas-or-its-evolution.png"
                      alt="SaaSの終焉か、進化か ホワイトペーパー表紙"
                      fill
                      className="object-contain p-6"
                      sizes="(min-width: 768px) 280px, 100vw"
                    />
                  </div>

                  <div className="flex flex-col justify-between gap-5 px-6 py-6 md:px-8 md:py-8">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex rounded-full bg-[#eef2f7] px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#2f3a49]">
                          プロダクト責任者向け
                        </span>
                        <span className="inline-flex rounded-full bg-[#eef2f7] px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#2f3a49]">
                          SaaS戦略
                        </span>
                        <span className="inline-flex rounded-full bg-[#eef2f7] px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#2f3a49]">
                          組み込みAI
                        </span>
                      </div>

                      <h3 className="mt-5 text-[24px] font-semibold leading-[1.4] tracking-[-0.03em] text-slate-950">
                        SaaSの終焉か、進化か 〜AIエージェント時代にSaaS企業が取るべき戦略〜
                      </h3>
                      <p className="mt-4 text-[15px] leading-7 text-slate-600">
                        本ホワイトペーパーは、AIエージェントがSaaSビジネスに与える影響を分析し、SaaS企業が取るべき戦略と、QueryPie AI自身のSaaSベンダーからAI Native企業への変革の実録をお伝えします。
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#ED602E] transition group-hover:gap-2.5">
                      無料ダウンロード
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="w-full bg-[#f9f9fb] px-6 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto flex max-w-[920px] flex-col items-center gap-8">
          <RevealOnScroll variant="up" className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-[36px] font-semibold leading-[1.14] tracking-[-0.05em] text-[#15181d] sm:text-[46px] sm:leading-[58px]">
              <span className="inline-block whitespace-nowrap">
                自社サービスの
                <span className="bg-gradient-to-r from-[#E45A2A] via-[#ED602E] to-[#F08A3C] bg-clip-text text-transparent">
                  AI化
                </span>
                を、
              </span>
              <br />
              一緒にデザインしませんか？
            </h2>
            <p className="max-w-[780px] text-base leading-7 text-slate-500">
              複雑な手動操作をAIに任せたい。顧客の要望に応えるAI機能をスピーディに実装したい。
              <br />
              QueryPie AIPを活用した具体的な連携アイデアからお見積もりまで、まずはお気軽にご相談ください。
            </p>
          </RevealOnScroll>

          <RevealOnScroll variant="up" delayMs={120} className="flex flex-col items-center gap-4">
            <Link
              href={aiDashiConsultUrl}
              className="inline-flex max-w-full items-center justify-center rounded-[8px] bg-[#15181d] px-4 py-2.5 text-center text-sm font-semibold leading-5 text-white transition hover:bg-[#0f1216] sm:whitespace-nowrap sm:text-base"
            >
              無料で導入相談・お見積もりをする
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
