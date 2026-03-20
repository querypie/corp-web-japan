import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  Blocks,
  BookOpen,
  ChevronDown,
  Database,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AIDashiFaq } from "@/components/sections/ai-dashi-faq";

export const metadata: Metadata = {
  title: "AI Dashi | AI Staff",
  description: "最高品質のAI基盤を、あなたのブランドで展開するための AI Dashi ソリューションページです。",
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

const comparisonRows = [
  {
    label: "開発期間",
    left: ["◎", "開発不要"],
    right: ["×", "3〜6ヶ月"],
  },
  {
    label: "初期コスト",
    left: ["◎", "初期費用0円"],
    right: ["×", "数千万円〜"],
  },
  {
    label: "専門人材",
    left: ["◎", "フォワードデプロイエンジニア（FDE）が支援"],
    right: ["△", "採用必須（困難）"],
  },
  {
    label: "セキュリティ",
    left: ["◎", "実証済み基盤", "セキュリティ認証（SOC2、ISO27001等）取得"],
    right: ["△", "ゼロから構築"],
  },
  {
    label: "ハルシネーション対策",
    left: ["◎", "RAGアーキテクチャやマルチLLM対応", "ガードレール機能などのファクトチェック内蔵"],
    right: ["×", "試行錯誤"],
  },
  {
    label: "運用保守",
    left: ["◎", "24時間365日サポート体制"],
    right: ["×", "自社で継続対応"],
  },
] as const;

const supportItems = [
  {
    number: "01",
    title: "カスタマイズ自在なAI基盤の提供",
    body: "最速での市場投入を実現するコアシステム",
  },
  {
    number: "02",
    title: "専門エンジニア（FDE）による開発支援",
    body: "貴社チームに伴走し、最適なAIを共に創り上げる",
  },
  {
    number: "03",
    title: "24時間365日のインフラ・運用保守（ハウジング）",
    body: "リリース後も安心。インフラ管理を完全にオフロード",
  },
] as const;

const sectionNavItems = [
  { label: "AI Dashiとは？", href: "#about-ai-dashi", chevron: true },
  { label: "AI Dashi 3つの価値", href: "#ai-dashi-values", chevron: true },
  { label: "なぜAI Dashiが必要か", href: "#why-ai-dashi", chevron: true },
  { label: "自社開発との比較", href: "#ai-dashi-comparison", chevron: true },
  { label: "サポート体制", href: "#ai-dashi-support", chevron: true },
  { label: "導入フロー", href: "#ai-dashi-flow", chevron: true },
  { label: "FAQ", href: "#ai-dashi-faq", chevron: true },
] as const;

export default function AIDashiPage() {
  return (
    <main className="relative overflow-x-hidden bg-[#eceff3] pt-[64px] text-slate-950">
      <SiteHeader />

      <Link
        href="#ai-dashi-cta"
        className="fixed bottom-5 right-5 z-[1100] inline-flex items-center justify-center rounded-full border border-[#cf5f31] bg-[#ED602E] px-4 py-2.5 text-[14px] font-semibold leading-5 text-white shadow-[0_12px_30px_-20px_rgba(0,0,0,0.35)] transition hover:bg-[#d45527] md:bottom-8 md:right-8"
      >
        導入相談
      </Link>

      <section className="relative mx-auto max-w-[1920px] overflow-hidden bg-[#eceff3] px-6 py-14 lg:px-10 lg:py-[84px]">
        <div className="absolute inset-0">
          <div className="relative h-full w-full">
            <Image
              src="/solutions/ai-dashi/hero-ai.png"
              alt="AI Dashi hero visual"
              fill
              priority
              className="object-cover object-[50%_18%]"
            />
          </div>
        </div>

        <div className="relative mx-auto flex max-w-[1200px] items-center justify-center text-center">
          <div className="flex w-full max-w-[860px] flex-col items-center gap-4 md:w-fit">
            <h1 className="text-[34px] font-semibold leading-[1.12] tracking-[-0.04em] text-white md:text-[42px] md:leading-[1.1] lg:text-[52px] lg:leading-[58px] lg:tracking-[-1.04px]">
              最高品質のAI基盤を
              <br />
              あなたのブランドで
            </h1>
            <Image
              src="/solutions/ai-dashi/hero-submark.svg"
              alt="AI Dashi 出汁"
              width={145}
              height={24}
              className="h-4 w-auto lg:h-5"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1920px] border-y border-black/6 bg-white px-6 py-3 lg:px-10">
        <div className="mx-auto max-w-[1200px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <nav className="flex min-w-max items-center justify-center gap-1">
            {sectionNavItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="inline-flex items-center justify-center gap-1 px-3 py-2 text-[14px] font-medium leading-5 text-slate-500 transition hover:text-[#15181d] focus:outline-none"
              >
                {item.label}
                {item.chevron ? <ChevronDown className="h-3 w-3" /> : null}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section id="about-ai-dashi" className="mx-auto max-w-[1920px] bg-white px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1120px]">
          <div className="grid items-center gap-8 lg:grid-cols-[544px_544px] lg:justify-between lg:gap-8">
            <div className="flex flex-col">
              <div className="flex flex-col gap-5">
                <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
                  「AI Dashi」とは？
                </h2>

                <div className="max-w-[498px] space-y-4 text-base leading-6 text-slate-500">
                  <p>
                    良い「出汁」があれば、料理人はもっと美味しい料理を作れる。
                    <br />
                    良い「AI基盤」があれば、貴社はもっと優れたAIサービスを顧客に提供できる。
                  </p>
                  <p>「AI Dashi」は、貴社のブランドとデザインで、そのまま提供できるAI基盤です。</p>
                  <p>
                    チャットボット、文書要約、データ分析、社内ナレッジ検索──QueryPie AIが培ったAIエージェント技術を、自社プロダクトの拡充機能としてスピーディに展開できます。AIの専門知識も、大規模な開発チームも不要です。
                  </p>
                  <p>
                    「AI Dashi」は、日本料理の基本である「出汁」から名付けました。
                    <br />
                    味噌汁にも、煮物にも、うどんにも姿を変えて料理を美味しくする出汁のように、「AI Dashi」も貴社のビジネスに合わせて柔軟に形を変え、顧客に最高のAI体験を届けます。
                  </p>
                </div>
              </div>
            </div>

            <div className="h-[320px] w-full rounded-[20px] bg-[#eceff3] lg:h-[450px] lg:w-[544px]" />
          </div>
        </div>
      </section>

      <section id="ai-dashi-values" className="mx-auto max-w-[1920px] bg-white px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1120px]">
          <div className="flex flex-col items-center gap-12">
            <div className="w-full text-center">
              <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
                AI Dashiが提供する3つの価値
              </h2>
            </div>

            <div className="h-[280px] w-full rounded-[20px] bg-[#eceff3] lg:h-[400px]" />

            <div className="grid w-full gap-4 lg:grid-cols-3">
              <article className="rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
                <div className="inline-flex rounded-full bg-[#15181d] px-3 py-1 text-xs font-semibold text-white">
                  01
                </div>
                <h3 className="mt-5 text-2xl font-semibold leading-8 tracking-[-0.04em] text-slate-950">
                  自社ブランドによるAIサービスの展開
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  AIを「他社のツール」として導入するのではなく、貴社の既存システムやプロダクトに組み込み、「自社のオリジナル機能」として顧客に提供できます。これにより、自社サービスの競争力と顧客ロイヤルティを直接高めることが可能です。
                </p>
              </article>

              <article className="rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
                <div className="inline-flex rounded-full bg-[#15181d] px-3 py-1 text-xs font-semibold text-white">
                  02
                </div>
                <h3 className="mt-5 text-2xl font-semibold leading-8 tracking-[-0.04em] text-slate-950">
                  開発の複雑さから解放され、本業へ集中
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  専門的なAI技術のキャッチアップや、複雑なインフラ構築はすべて「AI Dashi」が担います。ゼロからAIを開発する膨大なコストと手間を削減し、貴重なエンジニアリソースを自社のコアビジネス（本業）の進化に集中させることができます。
                </p>
              </article>

              <article className="rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
                <div className="inline-flex rounded-full bg-[#15181d] px-3 py-1 text-xs font-semibold text-white">
                  03
                </div>
                <h3 className="mt-5 text-2xl font-semibold leading-8 tracking-[-0.04em] text-slate-950">
                  新たな収益源の最速立ち上げ
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  AI基盤を自前で構築すれば年単位の時間がかかりますが、「AI Dashi」を活用すれば圧倒的なスピードで市場投入（タイムトゥマーケット）が可能です。競合に先んじてAI機能をリリースし、迅速に新たな収益源を構築できます。
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="why-ai-dashi" className="mx-auto max-w-[1920px] bg-white px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col items-center gap-12">
            <div className="w-full text-center">
              <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
                なぜ、AIDashiが必要なのか？：自社AI化の壁
              </h2>
              <p className="mx-auto mt-5 max-w-[914px] text-base leading-6 text-slate-500">
                SaaSベンダーやWebサービス企業が自社でAI化を進める際、以下のような課題に直面します。
              </p>
            </div>

            <div className="grid w-full gap-4 lg:grid-cols-3 lg:gap-4">
              <article className="rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#eef1f4] text-[#15181d]">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-[22px] font-semibold leading-7 tracking-[-0.03em] text-slate-950">人材不足</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  AI専門家の採用は困難かつ高コスト
                </p>
                <div className="mt-5 border-t border-black/6 pt-4">
                  <p className="text-[20px] font-semibold leading-7 tracking-[-0.02em] text-slate-950">
                    → プロジェクトに着手できない
                  </p>
                </div>
              </article>

              <article className="rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#eef1f4] text-[#15181d]">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-[22px] font-semibold leading-7 tracking-[-0.03em] text-slate-950">知識不足</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  最新AI技術のキャッチアップが追いつかない
                </p>
                <div className="mt-5 border-t border-black/6 pt-4">
                  <p className="text-[20px] font-semibold leading-7 tracking-[-0.02em] text-slate-950">
                    → 間違った技術選定
                  </p>
                </div>
              </article>

              <article className="rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#eef1f4] text-[#15181d]">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-[22px] font-semibold leading-7 tracking-[-0.03em] text-slate-950">データ準備</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  学習・テストデータの整備に膨大な工数
                </p>
                <div className="mt-5 border-t border-black/6 pt-4">
                  <p className="text-[20px] font-semibold leading-7 tracking-[-0.02em] text-slate-950">
                    → 開発期間の長期化
                  </p>
                </div>
              </article>

              <article className="rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#eef1f4] text-[#15181d]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-[22px] font-semibold leading-7 tracking-[-0.03em] text-slate-950">セキュリティ</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  企業向けAIに必須のガバナンス・アクセス管理
                </p>
                <div className="mt-5 border-t border-black/6 pt-4">
                  <p className="text-[20px] font-semibold leading-7 tracking-[-0.02em] text-slate-950">
                    → 導入のハードルが高い
                  </p>
                </div>
              </article>

              <article className="rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#eef1f4] text-[#15181d]">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-[22px] font-semibold leading-7 tracking-[-0.03em] text-slate-950">ハルシネーション</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  業務利用には致命的
                </p>
                <div className="mt-5 border-t border-black/6 pt-4">
                  <p className="text-[20px] font-semibold leading-7 tracking-[-0.02em] text-slate-950">
                    → 信頼性が担保できない
                  </p>
                </div>
              </article>

              <article className="rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#eef1f4] text-[#15181d]">
                  <Settings className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-[22px] font-semibold leading-7 tracking-[-0.03em] text-slate-950">運用負荷</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  リリース後の保守・改善に継続的なリソースが必要
                </p>
                <div className="mt-5 border-t border-black/6 pt-4">
                  <p className="text-[20px] font-semibold leading-7 tracking-[-0.02em] text-slate-950">
                    → 本業が圧迫される
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="ai-dashi-comparison" className="mx-auto max-w-[1920px] bg-white px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="w-full">
            <div className="text-center">
              <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
                AI Dashiと自社開発の比較
              </h2>
              <p className="mx-auto mt-5 max-w-[760px] text-base leading-6 text-slate-500">
                AI Dashiなら、開発期間・コスト・専門人材の壁をまとめて解消できます。
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-[980px] overflow-hidden rounded-[1.8rem] border border-black/6 bg-white shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
              <div className="grid w-full grid-cols-[120px_minmax(0,1fr)_120px] border-b border-black/6 bg-[#fafbfc] md:grid-cols-[180px_minmax(0,1fr)_180px] lg:grid-cols-[220px_minmax(0,1fr)_220px]">
                <div className="border-r border-black/6 bg-[#fafbfc] px-4 py-6" />
                <div className="flex items-center justify-center border-r border-black/6 px-4 py-6 text-center">
                  <div className="flex max-w-fit flex-col items-center justify-center text-center">
                    <p className="text-[28px] font-semibold leading-8 tracking-[-0.04em] text-slate-950">AI Dashi活用</p>
                    <Image
                      src="/header-assets/stage-logo.svg"
                      alt="QueryPie AI"
                      width={148}
                      height={28}
                      className="mt-1.5 h-4.5 w-auto"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center px-4 py-6 text-center">
                  <div className="flex max-w-fit flex-col items-center justify-center text-center">
                    <p className="text-[22px] font-semibold leading-7 tracking-[-0.03em] text-slate-950">自社開発</p>
                    <p className="mt-1 text-[13px] font-medium leading-5 text-slate-500">フルスクラッチ</p>
                  </div>
                </div>
              </div>

              {comparisonRows.map((row, index) => (
                <div
                  key={row.label}
                  className={`grid w-full grid-cols-[120px_minmax(0,1fr)_120px] md:grid-cols-[180px_minmax(0,1fr)_180px] lg:grid-cols-[220px_minmax(0,1fr)_220px] ${
                    index < comparisonRows.length - 1 ? "border-b border-black/6" : ""
                  }`}
                >
                  <div className="flex items-center border-r border-black/6 bg-[#fafbfc] px-4 py-5 text-sm font-semibold leading-6 tracking-[-0.01em] text-slate-950 md:px-5 md:text-base lg:px-6">
                    {row.label}
                  </div>

                  <div className="flex min-h-[104px] items-center justify-center border-r border-black/6 px-4 py-5 text-center md:px-5 lg:px-6">
                    <div className="flex max-w-fit flex-col items-center justify-center gap-1 text-center">
                      <p className="text-[18px] font-semibold leading-6 text-slate-950">{row.left[0]}</p>
                      <p className="text-[15px] font-semibold leading-6 text-slate-950 md:text-base">
                        {row.left[1]}
                      </p>
                    {row.left[2] ? (
                        <p className="mx-auto max-w-[380px] text-[12px] font-semibold leading-5 text-slate-950 md:text-[13px]">
                          {row.left[2]}
                        </p>
                    ) : null}
                    </div>
                  </div>

                  <div className="flex min-h-[104px] items-center justify-center px-4 py-5 text-center md:px-5 lg:px-6">
                    <div className="flex max-w-fit flex-col items-center justify-center gap-1 text-center">
                      <p className="text-[18px] font-semibold leading-6 text-slate-500">{row.right[0]}</p>
                      <p className="text-base font-medium leading-6 text-slate-600">{row.right[1]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              ※記載の期間・費用は標準的な導入ケースの目安です。要件により変動します。
            </p>

            <div className="mx-auto mt-6 max-w-[980px] rounded-[1.2rem] border border-black/6 bg-[#f9f9fb] px-6 py-5 text-center">
              <p className="text-base leading-6 text-slate-600">
                競合他社がAI化を進める中、開発に半年以上かけていては市場機会を逃します。
              </p>
              <p className="mt-2 text-[18px] font-semibold leading-7 text-slate-950">
                AI Dashiを活用すれば、最短1ヶ月で独自のAIサービスをリリースできます。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="ai-dashi-support" className="mx-auto max-w-[1920px] bg-white px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto max-w-[1120px]">
            <div className="text-center">
              <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
                AI Dashiの包括的サポート体制
              </h2>
              <p className="mx-auto mt-5 max-w-[760px] text-base leading-6 text-slate-500">
                AI Dashiは、単なるツールの提供ではありません。貴社が自社ブランドのAIサービスを確実かつ迅速にリリースし、安定して運用し続けるために必要なすべての要素を、QueryPie AIがワンストップで提供します。
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-[1120px] gap-4 lg:grid-cols-3">
              {supportItems.map((item, index) => (
                <article
                  key={item.number}
                  className="flex min-h-[256px] flex-col rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#eef1f4] text-[#15181d]">
                    {index === 0 && <Blocks className="h-5 w-5" />}
                    {index === 1 && <Users className="h-5 w-5" />}
                    {index === 2 && <ShieldCheck className="h-5 w-5" />}
                  </div>
                  <h3 className="mt-4 text-[22px] font-semibold leading-7 tracking-[-0.03em] text-slate-950 md:text-2xl md:leading-8 md:tracking-[-0.04em]">
                    {item.title}
                  </h3>
                  <div className="mt-4 border-t border-black/6 pt-4">
                    <p className="text-sm leading-7 text-slate-600">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="ai-dashi-flow" className="mx-auto max-w-[1920px] bg-white px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto flex max-w-[1120px] flex-col gap-8 lg:flex-row lg:items-start lg:gap-8">
            <div className="w-full lg:max-w-[520px]">
              <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
                リリースまでの導入フロー
              </h2>
              <p className="mt-5 max-w-[520px] text-base leading-6 text-slate-500">
                ヒアリングから本番リリースまで、専門エンジニア（FDE）が貴社と伴走し、最短1〜3ヶ月でのスピーディな立ち上げを実現します。
              </p>
            </div>

            <div className="w-full space-y-4 lg:max-w-[568px]">
              {releaseFlow.map((item) => (
                <article
                  key={item.step}
                  className="rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]"
                >
                  <div className="inline-flex rounded-full bg-[#15181d] px-3 py-1 text-xs font-semibold text-white">
                    {item.step}
                  </div>
                  <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">{item.period}</p>
                  <h3 className="mt-3 text-[22px] font-semibold leading-7 tracking-[-0.03em] text-slate-950 md:text-2xl md:leading-8 md:tracking-[-0.04em]">
                    {item.title}
                  </h3>
                  <div className="mt-5 border-t border-black/6 pt-5">
                    <p className="text-sm leading-7 text-slate-600">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="ai-dashi-faq" className="mx-auto max-w-[1920px] bg-white px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col items-center gap-12">
            <div className="w-full text-center">
              <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
                よくある質問
              </h2>
            </div>

            <AIDashiFaq />
          </div>
        </div>
      </section>

      <section id="ai-dashi-cta" className="w-full bg-[#f9f9fb] px-6 py-16 text-center lg:px-10 lg:py-20">
        <div className="mx-auto flex max-w-[760px] flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.06em] text-[#15181d] sm:text-[54px] sm:leading-[60px]">
              自社プロダクトの「AI化」を、
              <br />
              一緒にデザインしませんか？
            </h2>
            <p className="max-w-[700px] text-base leading-6 text-slate-500">
              複雑な手動操作をAIに任せたい。顧客の要望に応えるAI機能をスピーディに実装したい。AI Dashiを活用した具体的な連携アイデアからお見積もりまで、まずはお気軽にご相談ください。
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Link
              href="/#contact"
              className="inline-flex max-w-full items-center justify-center rounded-[8px] bg-[#15181d] px-4 py-2.5 text-center text-sm font-semibold leading-5 text-white transition hover:bg-[#0f1216] sm:whitespace-nowrap sm:text-base"
            >
              無料で導入相談・お見積もりをする
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
