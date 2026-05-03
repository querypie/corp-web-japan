import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

export const metadata: Metadata = {
  title: "QueryPie AIP：あなたのためのAI変革エキスパート | QueryPie AI",
  description:
    "フォワードデプロイドエンジニア（FDE）サービスを preview 用に移したローカル確認ページです。",
  alternates: {
    canonical: "/t/services/fde",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const steps = [
  {
    title: "課題の発見と分析",
    body: "現場ヒアリングを通じて、AXを妨げている真の課題を特定。時間とコストの無駄を防ぎ、最適な解決策を導きます。",
    imageSrc: "/services/fde/find-problems.png",
  },
  {
    title: "戦略とロードマップの策定",
    body: "貴社のビジネス目標に合わせた、最適なAX戦略を設計。課題を具体的なアクションステップに落とし込み、実現可能な導入計画を立案します。",
    imageSrc: "/services/fde/make-plans.png",
  },
  {
    title: "カスタムAIエージェントの構築",
    body: "貴社の業務に特化したAIエージェントを、ゼロから構築。要件定義、設計、開発、テストの全工程でFDEがガイドし、実用的なAIを実装します。",
    imageSrc: "/services/fde/build-custom-ai-agents.png",
  },
  {
    title: "AI実用化を支援",
    body: "本番稼働後も、運用支援と効果測定を継続的に実施。データに基づいた改善提案で、AXの成果を最大化します。",
    imageSrc: "/services/fde/make-ai-work.png",
  },
] as const;

export default function TestFdeServicePage() {
  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <section className="mx-auto max-w-[1200px] px-6 pb-20 pt-[136px] lg:px-0 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_520px] lg:gap-16">
          <RevealOnScroll>
            <div className="max-w-[700px]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#E45A2A]">Preview Service</p>
              <h1 className="mt-5 text-[40px] font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-[52px] lg:text-[64px]">
                QueryPie FDE AXを成功に導く専門家チーム
              </h1>
              <div className="mt-8 space-y-5 text-[15px] leading-8 text-slate-600 sm:text-base">
                <p>
                  フォワードデプロイドエンジニア（FDE）は、ビジネスとテクノロジーの両方を理解する専門家です。
                </p>
                <p>
                  業務変革のコンセプト設計から、AI開発、本番運用まで一貫してサポート。あなたのチームに入り込み、確実な成果を出すAXを実現します。
                </p>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120}>
            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-[#F7F8FA] p-8 shadow-[0_30px_80px_-65px_rgba(15,23,42,0.55)]">
              <div className="relative aspect-[4/3]">
                <Image src="/services/fde/hero.svg" alt="Custom AI Agents" fill unoptimized className="object-contain" />
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="bg-[#F7F8FA] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-0">
          <RevealOnScroll>
            <div className="max-w-[820px]">
              <h2 className="text-[32px] font-semibold leading-[1.18] tracking-[-0.035em] text-slate-950 sm:text-[42px]">
                FDEが伴走するAX導入の進め方
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                upstream の FDE サービスページで案内している主要ステップと説明をローカル preview に移し、検証中でも流れ全体を確認できるようにしました。
              </p>
            </div>
          </RevealOnScroll>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {steps.map((step, index) => (
              <RevealOnScroll key={step.title} delayMs={(index % 2) * 80}>
                <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_80px_-65px_rgba(15,23,42,0.55)]">
                  <div className="relative aspect-[16/10] bg-slate-950/4">
                    <Image src={step.imageSrc} alt={step.title} fill className="object-cover" />
                  </div>
                  <div className="p-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#E45A2A]">Step {index + 1}</p>
                    <h3 className="mt-4 text-[24px] font-semibold leading-8 tracking-[-0.03em] text-slate-950">{step.title}</h3>
                    <p className="mt-4 text-[15px] leading-8 text-slate-600 sm:text-base">{step.body}</p>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-[960px] px-6 text-center lg:px-0">
          <RevealOnScroll>
            <h2 className="text-[32px] font-semibold leading-[1.2] tracking-[-0.035em] sm:text-[42px]">
              まずは小さく、失敗しないAXを始めよう
            </h2>
            <p className="mx-auto mt-5 max-w-[720px] text-base leading-8 text-slate-300">
              課題の言語化からロードマップ設計、カスタムAIエージェント構築、運用改善まで、FDE伴走の全体像をこの preview で事前確認できます。
            </p>
            <div className="mt-9 flex justify-center">
              <Link
                href="/contact-us?inquiry=demo-request&product=fde"
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
