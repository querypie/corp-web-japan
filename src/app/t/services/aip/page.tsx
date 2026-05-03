import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

export const metadata: Metadata = {
  title: "QueryPie AIプラットフォーム (AIP) | QueryPie AI",
  description:
    "既存の業務システムとつながり、実務で使えるAIを実現する QueryPie AIP の preview ページです。",
  alternates: {
    canonical: "/t/services/aip",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const valueCards = [
  {
    title: "従量課金型の AIモデル",
    body: "全社員分のライセンス購入を経営層にどう説明する？使われなかったら？ QueryPie AIPは使った分だけ支払う従量課金型。小さく始めて効果を見ながら段階的に拡大できます。プレミアムLLMを必要な時だけ利用でき、月額固定費の無駄から解放されます。",
  },
  {
    title: "統合型 AIゲートウェイ",
    body: "既存システムに「つなぐだけ」で、大規模なシステム改修は不要です。複雑な接続処理はQueryPie AIPが担当。バラバラだったシステムが、1つのプラットフォームで統合されたAIワークフローに変わります。",
  },
  {
    title: "AI専門家伴走 サービス",
    body: "ビジネスとテクノロジーの両方を理解する専門家、フォワードデプロイドエンジニア(FDE)が、あなたのチームに入り込みます。課題発見から構築、本番稼働まで伴走し、確実に成果を出すAI導入を実現します。",
  },
] as const;

const features = [
  {
    title: "プロンプト自動生成",
    body: "プリセットされた簡単な指示文（プロンプト）から始めれば、包括的かつ最適化されたプロンプトを自動生成します。専門知識がなくてもAIエージェントの効果を最大限に引き出せます。",
    imageSrc: "/services/aip/prompt.gif",
  },
  {
    title: "シンプルな統合",
    body: "OAuth認証でお使いのツール（Slack、Googleなど）を簡単に接続。提供されている統合機能に加えて、カスタムツールや内部ツールも追加でき、ニーズに合わせたビジネスワークフロー自動化を実現します。",
    imageSrc: "/services/aip/integration.gif",
  },
  {
    title: "社内文書の学習機能",
    body: "社内文書をアップロードして知識ベース化。AIが組織の情報を瞬時に取得し、貴社のビジネスに合った正確な回答をします。",
    imageSrc: "/services/aip/knowledge.gif",
  },
  {
    title: "カスタムエージェント作成",
    body: "包括的なライブラリから構築済みのエージェントをインストール、または特定の運用要件に合わせて各エージェントの機能をカスタマイズした独自のソリューションを作成できます。",
    imageSrc: "/services/aip/custom-agent.gif",
  },
  {
    title: "ビジュアルレポート作成",
    body: "AIの回答をグラフや表、インタラクティブな図で表示。複雑な分析結果を視覚的にわかりやすく整理し、そのままエクスポートして会議に活用できます。",
    imageSrc: "/services/aip/visual-report.gif",
  },
  {
    title: "エージェントスケジューリング",
    body: "指定した間隔でAIエージェントをスケジュール設定し、定型タスクを自動化。簡単なエージェント会話を通じて定期的な操作を設定でき、手動作業を削減しながら一貫した実行を保証します。",
    imageSrc: "/services/aip/scheduling.gif",
  },
] as const;

export default function TestAipServicePage() {
  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <section className="mx-auto max-w-[1200px] px-6 pb-20 pt-[136px] lg:px-0 lg:pb-24">
        <RevealOnScroll>
          <div className="max-w-[860px]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#E45A2A]">Preview Service</p>
            <h1 className="mt-5 text-[40px] font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-[52px] lg:text-[64px]">
              QueryPie AIプラットフォーム (AIP)
            </h1>
            <div className="mt-8 space-y-5 text-[15px] leading-8 text-slate-600 sm:text-base">
              <p>QueryPie AIPは、既存の業務システムとつながり、実務で使えるAIを実現します。</p>
              <p>従量課金でコストを最適化。大規模なシステム改修も不要。</p>
              <p>専門家が伴走するので、確実に成果が出るAIプラットフォームです。</p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section className="bg-[#F7F8FA] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-0">
          <RevealOnScroll>
            <div className="max-w-[760px]">
              <h2 className="text-[32px] font-semibold leading-[1.18] tracking-[-0.035em] text-slate-950 sm:text-[42px]">
                成果にこだわるエンタープライズAI
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">AI導入を、ワンストップで実現する３つの価値</p>
            </div>
          </RevealOnScroll>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {valueCards.map((card, index) => (
              <RevealOnScroll key={card.title} delayMs={index * 80}>
                <article className="flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_-65px_rgba(15,23,42,0.55)]">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#E45A2A]">Value {index + 1}</p>
                  <h3 className="mt-4 text-[24px] font-semibold leading-8 tracking-[-0.03em] text-slate-950">{card.title}</h3>
                  <p className="mt-5 text-[15px] leading-8 text-slate-600 sm:text-base">{card.body}</p>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-20 lg:px-0 lg:py-24">
        <RevealOnScroll>
          <div className="max-w-[820px]">
            <h2 className="text-[32px] font-semibold leading-[1.18] tracking-[-0.035em] text-slate-950 sm:text-[42px]">
              QueryPie AIPができること
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              実際の業務にそのまま組み込める主要機能を、preview でローカル確認できるように移しています。
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {features.map((feature, index) => (
            <RevealOnScroll key={feature.title} delayMs={(index % 2) * 80}>
              <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_80px_-65px_rgba(15,23,42,0.55)]">
                <div className="relative aspect-[16/10] bg-slate-950/4">
                  <Image src={feature.imageSrc} alt={feature.title} fill unoptimized className="object-cover object-top" />
                </div>
                <div className="p-8">
                  <h3 className="text-[24px] font-semibold leading-8 tracking-[-0.03em] text-slate-950">{feature.title}</h3>
                  <p className="mt-4 text-[15px] leading-8 text-slate-600 sm:text-base">{feature.body}</p>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-[980px] px-6 text-center lg:px-0">
          <RevealOnScroll>
            <h2 className="text-[32px] font-semibold leading-[1.2] tracking-[-0.035em] sm:text-[42px]">
              まずは小さく、失敗しないAXを始めよう
            </h2>
            <p className="mx-auto mt-5 max-w-[720px] text-base leading-8 text-slate-300">
              AIP導入や既存システム連携、従量課金でのPoC設計まで、まずは日本向けサイト上で確認・検証できる preview としてご利用ください。
            </p>
            <div className="mt-9 flex justify-center">
              <Link
                href="/contact-us?inquiry=demo-request&product=aip"
                className="inline-flex items-center justify-center rounded-full bg-[#E45A2A] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#cc4f23]"
              >
                無料で試してみる
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
