import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  AlertTriangle,
  Blocks,
  BookOpen,
  Check,
  ChevronDown,
  Database,
  Settings,
  ShieldCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AIDashiFaq } from "@/components/sections/ai-dashi-faq";

export const metadata: Metadata = {
  title: "AI Dashi | AI Staff",
  description: "最高品質のAI基盤を、あなたのプロダクトに、あなたのブランドで組み込むための AI Dashi ソリューションページです。",
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
    left: ["最短1ヶ月（API組み込みのみ）", "すぐに市場投入が可能"],
    right: ["半年〜1年以上（試行錯誤の連続）", "競合に先を越され市場機会を逃す"],
  },
  {
    label: "初期インフラ投資",
    left: ["初期投資ゼロ（インフラ不要）", "使った分だけの従量課金でスモールスタートが可能"],
    right: ["数千万円規模の先行投資", "サーバー代や検証費用など、回収不能なサンクコストが発生"],
  },
  {
    label: "専門エンジニア確保",
    left: ["QueryPie AIのFDE（専門エンジニア）が伴走", "AIに関する専門知識不要"],
    right: ["AI人材の採用が必須（極めて困難）", "人件費の高騰で採用が進まないリスク"],
  },
  {
    label: "セキュリティ",
    left: ["エンタープライズ品質の基盤（SOC2/ISO27001）", "厳格な権限管理（RBAC）が標準装備"],
    right: ["ゼロトラストアーキテクチャを一から構築", "情報漏洩の致命的リスクと認証取得の果てしない工数"],
  },
  {
    label: "ハルシネーション対策",
    left: ["エンタープライズRAGによる事実のみの回答", "内蔵されたガードレール機能でB2Bでの業務利用も安心"],
    right: ["精度が上がらず本番リリース不可", "自社データとLLMの連携（チャンキング等）で泥沼化"],
  },
  {
    label: "運用保守",
    left: ["24時間365日のインフラ監視と継続アップデート", "LLMの進化や運用はすべてオフロード、本業に集中"],
    right: ["自社エンジニアが運用保守に追われる", "プロンプト調整やインフラ管理でコア事業の進化が停止"],
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

const aiWallCards: ReadonlyArray<{
  icon: LucideIcon;
  title: string;
  body: string;
  consequence: string;
}> = [
  {
    icon: Users,
    title: "AIエンジニアの採用難と高騰する人件費",
    body: "LLMや機械学習の実装に精通した専門人材の採用は、極めて困難かつ高コストです。",
    consequence: "企画から半年経っても、AIプロジェクトの要件定義にすら着手できない",
  },
  {
    icon: BookOpen,
    title: "日進月歩のAIアーキテクチャへの追従限界",
    body: "毎週のように新しいモデルや技術トレンドが登場し、自社の開発チームだけではキャッチアップが追いつきません。",
    consequence: "誤ったアーキテクチャ選定により、開発した機能が数ヶ月で技術的負債化する",
  },
  {
    icon: Database,
    title: "RAG構築とデータ整備の果てしない泥沼",
    body: "自社データベースやドキュメントをAIに正確に読み込ませるためのデータ整備には、想像以上の工数がかかります。",
    consequence: "AIの精度が実用レベルに達せず、リリース時期が無限に延期される",
  },
  {
    icon: ShieldCheck,
    title: "B2B基準の権限管理とガバナンスの欠如",
    body: "エンタープライズ顧客にAIを提供する際、ユーザーごとの厳格なアクセス権限管理をゼロから自作するのは至難の業です。",
    consequence: "情報漏洩の致命的なリスクを抱え、エンタープライズ顧客への導入審査に落ちる",
  },
  {
    icon: AlertTriangle,
    title: "業務利用で絶対に許されないAIの嘘｜ハルシネーション",
    body: "B2Bプロダクトにおいて、AIが不確かな情報で回答を作るハルシネーションは、顧客の信頼失墜に直結します。",
    consequence: "事実だけに基づくガードレールを実装できず、本番リリースを断念する",
  },
  {
    icon: Settings,
    title: "リリース後に肥大化する保守工数と本業の圧迫",
    body: "AI機能は作って終わりではありません。モデル更新、プロンプト調整、インフラ監視など、運用負荷が継続的に発生します。",
    consequence: "自社エンジニアの時間が食いつぶされ、本来のコア事業の進化が止まる",
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
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,18,34,0.22)_0%,rgba(10,18,34,0.12)_34%,rgba(10,18,34,0.04)_62%,rgba(10,18,34,0.0)_100%)]" />
        </div>

        <div className="relative mx-auto flex max-w-[1200px] items-center justify-start px-3 text-left lg:px-14">
          <div className="flex w-full max-w-[880px] flex-col items-start gap-5 md:max-w-[900px] lg:ml-3 lg:gap-5">
            <h1 className="max-w-[584px] text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-white md:text-[40px] md:leading-[1.08] lg:text-[52px] lg:leading-[58px] lg:tracking-[-1.02px]">
              最高品質のAI基盤を
              <br />
              あなたのプロダクトに、
              <br />
              あなたのブランドで。
            </h1>
            <h2 className="ml-2 max-w-[860px] text-[15px] font-medium leading-7 tracking-[-0.01em] text-white/84 md:ml-3 md:text-[16px] lg:ml-4 lg:whitespace-nowrap lg:text-[17px]">
              自社プロダクトに最速でAI機能を実装する組み込みAI基盤 ｜ Embedded AI
            </h2>
            <Image
              src="/solutions/ai-dashi/hero-submark.svg"
              alt="AI Dashi 出汁"
              width={172}
              height={30}
              className="ml-5 h-[20px] w-auto md:ml-6 md:h-[22px] lg:ml-7 lg:h-[25px]"
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
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:justify-between lg:gap-10">
            <div className="flex flex-col">
              <div className="flex flex-col gap-5">
                <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
                  <span className="bg-gradient-to-r from-[#E45A2A] via-[#ED602E] to-[#F08A3C] bg-clip-text text-transparent">
                    AI Dashi
                  </span>
                  とは？
                </h2>

                <div className="max-w-[640px] space-y-4 text-[15px] leading-7 text-slate-500">
                  <p>
                    「AI Dashi」は、SaaSベンダーやWebサービス企業が、自社プロダクトの裏側に最高品質のAI機能を最速で実装できる
                    <strong className="font-semibold text-slate-700"> 組み込みAI基盤（Embedded AI）</strong>
                    です。
                  </p>
                  <p>
                    チャットボット、文書要約、データ分析、社内ナレッジ検索（RAG）など、QueryPie AIがエンタープライズ環境で磨いてきた高度なAIエージェント技術を、API経由で貴社システムへシームレスに統合できます。ゼロからAIを開発するための専門知識や膨大なインフラ投資は必要ありません。
                  </p>
                  <p>
                    貴社のUIやブランドの世界観を一切壊すことなく、プロダクトのコアバリューを裏側から引き上げ、新たな収益源の立ち上げとタイム・トゥ・マーケットを加速させます。
                  </p>
                  <p>
                    「AI Dashi」は、日本料理の基本である「出汁」から名付けました。
                  </p>
                  <p>
                    良い出汁があれば、料理人はもっと美味しい料理を作れる。
                    <br />
                    良いAI基盤があれば、貴社はもっと優れたAIサービスを顧客に提供できる。
                  </p>
                  <p>
                    味噌汁にも、煮物にも、うどんにも姿を変えて料理を美味しくする出汁のように、「AI Dashi」も貴社のビジネスに合わせて柔軟に形を変え、顧客に最高のAI体験を届けます。
                  </p>
                </div>
              </div>
            </div>

            <div className="h-[320px] w-full overflow-hidden rounded-[20px] bg-[#eceff3] lg:h-[430px] lg:w-full">
              <Image
                src="/solutions/ai-dashi/about-visual.png"
                alt="AI Dashi visual"
                width={1088}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="ai-dashi-values" className="mx-auto max-w-[1920px] bg-white px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col items-center gap-12">
            <div className="w-full text-center">
              <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
                AI Dashiが提供する3つの価値
              </h2>
            </div>

            <div className="grid w-full items-start gap-8 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)] lg:justify-between lg:gap-8">
              <div className="overflow-hidden rounded-[20px] bg-white lg:w-[660px]">
                <div className="h-[420px] w-full lg:h-[680px] lg:w-[660px]">
                  <Image
                    src="/solutions/ai-dashi/value-diagram.svg"
                    alt="AI Dashi value diagram"
                    width={1088}
                    height={900}
                    className="h-full w-full object-contain object-right"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <article className="h-full rounded-[1.8rem] border border-black/6 bg-white p-7 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
                  <div className="inline-flex rounded-full bg-[#15181d] px-3 py-1 text-xs font-semibold text-white">
                    01
                  </div>
                  <h3 className="mt-5 text-[21px] font-semibold leading-7 tracking-[-0.03em] text-slate-950">
                    自社の「オリジナル機能」としてシームレスに展開
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    他社のAIツールを外付けするのではなく、貴社プロダクトの裏側に深く組み込み、<strong className="font-semibold text-slate-800">自社のオリジナル機能</strong>として顧客へ提供できます。UIやブランド体験を損なわず、競争力と顧客ロイヤルティを直接高めます。
                  </p>
                </article>

                <article className="h-full rounded-[1.8rem] border border-black/6 bg-white p-7 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
                  <div className="inline-flex rounded-full bg-[#15181d] px-3 py-1 text-xs font-semibold text-white">
                    02
                  </div>
                  <h3 className="mt-5 text-[21px] font-semibold leading-7 tracking-[-0.03em] text-slate-950">
                    AI開発の「技術的負債」を回避し、コアビジネスに集中
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    変化の速いLLMの追従や複雑なAIインフラの構築・保守は、AI Dashiが担います。ゼロから内製するコストと<strong className="font-semibold text-slate-800">技術的負債</strong>のリスクを抑え、貴重な開発リソースをコアビジネスに集中させられます。
                  </p>
                </article>

                <article className="h-full rounded-[1.8rem] border border-black/6 bg-white p-7 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
                  <div className="inline-flex rounded-full bg-[#15181d] px-3 py-1 text-xs font-semibold text-white">
                    03
                  </div>
                  <h3 className="mt-5 text-[20px] font-semibold leading-7 tracking-[-0.045em] text-slate-950">
                    タイム・トゥ・マーケットを最速化し、新たな収益源を創出
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    セキュアなAI基盤を自前で構築すれば長い開発期間が必要です。AI DashiのAPIなら<strong className="font-semibold text-slate-800">最短1ヶ月</strong>で市場投入でき、競合に先んじたAI機能の提供や、単価向上・アップセルにつながる新たな収益源の立ち上げを加速できます。
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why-ai-dashi" className="mx-auto max-w-[1920px] bg-white px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col items-center gap-12">
            <div className="w-full text-center">
              <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
                なぜAI Dashiが必要なのか？
                <br />
                自社AI化6つの壁
              </h2>
              <p className="mx-auto mt-5 max-w-[860px] text-left text-base leading-7 text-slate-500 lg:pl-[44px]">
                SaaSベンダーやWebサービス企業が、ゼロから自社でAI化を進めようとすると、以下のような「致命的な壁」に直面します。多くのプロジェクトが頓挫するか、膨大な技術的負債を抱えることになる理由です。
              </p>
            </div>

            <div className="grid w-full gap-4 lg:grid-cols-3 lg:gap-4">
              {aiWallCards.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.title} className="flex h-full flex-col rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#eef1f4] text-[#15181d]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-[22px] font-semibold leading-8 tracking-[-0.03em] text-slate-950">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
                    <div className="mt-auto pt-5">
                      <div className="mb-3 flex items-center gap-2 text-[#c75b5b]">
                        <ArrowDown className="h-4 w-4" />
                        <span className="text-xs font-semibold tracking-[0.12em]">致命的な壁</span>
                      </div>
                      <div className="rounded-[1.2rem] border border-[#f1c7c7] bg-[#fff4f4] px-4 py-4">
                        <p className="text-[15px] font-semibold leading-7 tracking-[-0.02em] text-[#a33a3a]">
                          {item.consequence}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
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

            <div className="mx-auto mt-12 max-w-[1000px] overflow-hidden rounded-[1.8rem] border border-black/6 bg-white shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
              <div className="grid w-full grid-cols-[118px_1fr_1fr] border-b border-black/6 bg-[#fafbfc] md:grid-cols-[150px_minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-[180px_minmax(0,1.02fr)_minmax(0,0.98fr)]">
                <div className="border-r border-black/6 bg-[#fafbfc] px-4 py-6" />
                <div className="flex items-center justify-center border-x-2 border-t-2 border-[#f2b8a4] border-b border-b-black/6 bg-[#fff8f4] px-4 py-6 text-center shadow-[inset_0_0_0_1px_rgba(237,96,46,0.05)]">
                  <div className="flex items-start justify-center gap-3">
                    <div className="mt-0.5 inline-flex h-fit rounded-full bg-[#ED602E] px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-white">
                      おすすめ
                    </div>
                    <div className="flex max-w-fit flex-col items-center justify-center text-center">
                      <p className="text-[28px] font-bold leading-8 tracking-[-0.04em] text-slate-950">AI Dashi活用</p>
                      <p className="mt-1 text-[13px] font-medium leading-5 text-slate-600">組み込みAI基盤</p>
                    </div>
                    <div className="invisible inline-flex h-fit rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.14em]">
                      おすすめ
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center bg-[#f8fafc] px-4 py-6 text-center">
                  <div className="flex max-w-fit flex-col items-center justify-center text-center">
                    <p className="text-[22px] font-semibold leading-7 tracking-[-0.03em] text-slate-700">自社開発</p>
                    <p className="mt-1 text-[13px] font-medium leading-5 text-slate-500">フルスクラッチ</p>
                  </div>
                </div>
              </div>

              {comparisonRows.map((row, index) => (
                <div
                  key={row.label}
                  className={`grid w-full grid-cols-[118px_1fr_1fr] md:grid-cols-[150px_minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-[180px_minmax(0,1.02fr)_minmax(0,0.98fr)] ${
                    index < comparisonRows.length - 1 ? "border-b border-black/6" : ""
                  }`}
                >
                  <div className="flex items-center whitespace-nowrap border-r border-black/6 bg-[#fafbfc] px-3 py-5 text-[12px] font-semibold leading-5 tracking-[-0.01em] text-slate-800 md:px-4 md:text-[13px] lg:px-5 lg:text-[14px]">
                    {row.label}
                  </div>

                  <div className={`flex min-h-[118px] items-center justify-center border-x-2 border-[#f2b8a4] bg-[#fff8f4] px-4 py-5 text-center md:px-5 lg:px-6 ${index === comparisonRows.length - 1 ? "border-b-2" : ""}`}>
                    <div className="flex max-w-fit flex-col items-center justify-center gap-2 text-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#ED602E] shadow-[0_10px_24px_-18px_rgba(15,23,42,0.28)]">
                        <Check className="h-4 w-4 stroke-[2.5]" />
                      </div>
                    <p className="text-[15px] font-bold leading-6 text-slate-950 md:text-base">
                        {row.left[0]}
                      </p>
                      <p className="mx-auto max-w-[380px] text-[11px] font-medium leading-5 text-slate-700 md:text-[12px]">
                        {row.left[1]}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-h-[118px] items-center justify-center bg-[#f8fafc] px-4 py-5 text-center md:px-5 lg:px-6">
                    <div className="flex max-w-fit flex-col items-center justify-center gap-2 text-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff4e8] text-[#b54708] shadow-[0_10px_24px_-18px_rgba(15,23,42,0.18)]">
                        <X className="h-4 w-4 stroke-[2.5]" />
                      </div>
                      <p className="text-[15px] font-semibold leading-6 text-slate-700 md:text-base">{row.right[0]}</p>
                      <p className="max-w-[340px] text-[11px] font-medium leading-5 text-slate-500 md:text-[12px]">
                        {row.right[1]}
                      </p>
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
          <div className="mx-auto max-w-[1200px]">
            <div className="text-center">
              <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
                AI Dashiの包括的サポート体制
              </h2>
              <p className="mx-auto mt-5 max-w-[760px] text-base leading-6 text-slate-500">
                AI Dashiは、単なるツールの提供ではありません。貴社が自社ブランドのAIサービスを確実かつ迅速にリリースし、安定して運用し続けるために必要なすべての要素を、QueryPie AIがワンストップで提供します。
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-[1200px] gap-4 lg:grid-cols-3">
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
          <div className="mx-auto flex max-w-[1200px] flex-col gap-8 lg:flex-row lg:items-start lg:gap-8">
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
