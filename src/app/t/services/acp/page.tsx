import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

export const metadata: Metadata = {
  title: "QueryPie アクセス制御プラットフォーム (ACP) | QueryPie AI",
  description:
    "データベースとインフラ全体にわたる包括的なアクセス管理を提供する QueryPie ACP の preview ページです。",
  alternates: {
    canonical: "/t/services/acp",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const categories = [
  "データベースアクセス制御",
  "システムアクセス制御",
  "Kubernetesアクセス制御",
  "Webアクセス制御",
  "ワークフロー & 統合",
] as const;

const features = [
  {
    title: "エージェントレスクラウド",
    body: "DB同期 AWS、GCP、Azureからデータ資産を個別設定なしで自動同期。管理者は運用を効率化し、本当に重要なことに集中できる自動化されたエージェントレス統合を取得します。",
    imageSrc: "/services/acp/agentless-cloud.gif",
  },
  {
    title: "汎用DB権限制御",
    body: "QueryPieのクエリアナライザがあらゆるプラットフォームの複雑なクエリを解釈し、統一フォーマットに変換します。汎用的な互換性により、すべてのデータソースに一貫したアクセス制御ポリシーを適用します。",
    imageSrc: "/services/acp/query-analyzer.gif",
  },
  {
    title: "機密データマスキング",
    body: "プリセットのマスキングパターンとカスタムルールを使用して機密データと個人データを保護し、未承認ユーザーが重要データにアクセスできないことを保証します。組織全体で安全なアクセスを可能にしながら、コンプライアンスとデータプライバシーを維持します。",
    imageSrc: "/services/acp/data-masking.gif",
  },
  {
    title: "ユーザーフレンドリーなWeb SQLエディター",
    body: "Web SQLエディターにより、使用するオペレーティングシステムに関係なく、ブラウザ上で直接クエリの実行、インポート、エクスポート、その他のさまざまなタスクを簡単に実行できます。",
    imageSrc: "/services/acp/web-sql-editor.gif",
  },
] as const;

export default function TestAcpServicePage() {
  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <section className="mx-auto max-w-[1200px] px-6 pb-20 pt-[136px] lg:px-0 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_520px] lg:gap-16">
          <RevealOnScroll>
            <div className="max-w-[720px]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#E45A2A]">Preview Service</p>
              <h1 className="mt-5 text-[40px] font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-[52px] lg:text-[64px]">
                QueryPie アクセス制御プラットフォーム (ACP)
              </h1>
              <div className="mt-8 space-y-5 text-[15px] leading-8 text-slate-600 sm:text-base">
                <p>
                  アクセス制御プラットフォームはデータベースとインフラ全体にわたる包括的なアクセス管理を提供するプラットフォームです。
                </p>
                <p>
                  AIエージェントによるデータベース接続やインフラへのアクセスを最適化し、複雑なインフラをAIエージェントがアクセス可能なエコシステムに転換します。
                </p>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120}>
            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-[#F5F7FA] shadow-[0_30px_80px_-65px_rgba(15,23,42,0.55)]">
              <div className="relative aspect-[4/3]">
                <Image src="/services/acp/easy-use.png" alt="Easy Installation, Easy Use" fill className="object-cover" />
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="bg-[#F7F8FA] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-0">
          <RevealOnScroll>
            <div className="max-w-[860px]">
              <h2 className="text-[32px] font-semibold leading-[1.18] tracking-[-0.035em] text-slate-950 sm:text-[42px]">
                簡単インストール、簡単使用
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                QueryPie ACPは、クラウド技術とWebベースのインターフェースを組み合わせ、あらゆるオペレーティングシステムで簡単に導入できます。
                Dockerパッケージングによりハイブリッド導入も可能で、オンプレミスのセキュリティとSaaS並みの利便性と自動更新を実装しています。
              </p>
            </div>
          </RevealOnScroll>

          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <RevealOnScroll key={category} delayMs={index * 50}>
                <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                  {category}
                </span>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-20 lg:px-0 lg:py-24">
        <RevealOnScroll>
          <div className="max-w-[820px]">
            <h2 className="text-[32px] font-semibold leading-[1.18] tracking-[-0.035em] text-slate-950 sm:text-[42px]">
              QueryPie ACPができること
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              現在の upstream ページで案内している代表機能をローカル preview に移し、段階ごとの検証ができるように構成しました。
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

      <section className="bg-[#0F172A] py-20 text-white sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-0">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_560px] lg:gap-14">
            <RevealOnScroll>
              <div>
                <h2 className="text-[32px] font-semibold leading-[1.18] tracking-[-0.035em] sm:text-[42px]">
                  一つのプラットフォーム、すべてのインフラ
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-300">
                  データベース、サーバー、Kubernetes、Webアプリケーション、アイデンティティプロバイダ、セキュリティツールなど50以上のシステムとシームレスに統合し、インフラエコシステム全体で統一された権限制御を実現しています。
                </p>
                <div className="mt-9">
                  <Link
                    href="/contact-us?inquiry=demo-request&product=acp"
                    className="inline-flex items-center justify-center rounded-full bg-[#E45A2A] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#cc4f23]"
                  >
                    無料で試してみる
                  </Link>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={120}>
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_30px_80px_-65px_rgba(15,23,42,0.55)]">
                <div className="relative aspect-[16/10]">
                  <Image src="/services/acp/integrations.png" alt="ACP Integrations" fill className="object-cover" />
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
