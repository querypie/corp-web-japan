import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  type ComparisonGroup,
  type PlanCardData,
  PlansHeroDescription,
  PlansHeroSection,
  PlansHeroTitle,
  PlansPageSection,
  PlansProductSwitcher,
} from "@/components/sections/plans-page";

export const metadata: Metadata = {
  title: "プラン | QueryPie AI",
  description: "あなたのチームに最適なプランを見つけよう。14日間の無料トライアルで今すぐ始められます。",
  alternates: {
    canonical: "/t/plans",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "プラン | QueryPie AI",
    description: "あなたのチームに最適なプランを見つけよう。14日間の無料トライアルで今すぐ始められます。",
    type: "website",
  },
  twitter: {
    title: "プラン | QueryPie AI",
    description: "あなたのチームに最適なプランを見つけよう。14日間の無料トライアルで今すぐ始められます。",
    card: "summary_large_image",
  },
};

const aipPlans: readonly PlanCardData[] = [
  {
    title: "スターター",
    description: "はじめての利用に最適",
    price: "$20/月",
    ctaLabel: "利用を開始する",
    ctaHref: "https://app.querypie.com",
    ctaExternal: true,
    tone: "primary",
    features: [
      { label: "月間800クレジット", dividerAfter: true },
      { label: "カスタムAIエージェント（現在無制限）" },
      { label: "社内文書学習 (RAG) 3つまで", dividerAfter: true },
      { label: "操作履歴の記録（最大30日間）" },
      { label: "IPアドレス制限 (ACL)" },
    ],
  },
  {
    title: "チーム",
    description: "チームでの協働作業に最適",
    price: "$500/月",
    ctaLabel: "利用を開始する",
    ctaHref: "https://app.querypie.com",
    ctaExternal: true,
    tone: "primary",
    features: [
      { label: "月間20,000クレジット", dividerAfter: true },
      { label: "カスタムAIエージェント（現在無制限）" },
      { label: "社内文書学習 (RAG) 10個まで", dividerAfter: true },
      { label: "操作履歴の記録（最大90日間）" },
      { label: "データ漏洩防止 (DLP)" },
      { label: "IPアドレス制限 (ACL)" },
    ],
  },
  {
    title: "エンタープライズ",
    description: "大規模組織向けの包括的プラン",
    price: "個別見積もり",
    ctaLabel: "今すぐ試す",
    ctaHref: "https://app.querypie.com",
    ctaExternal: true,
    tone: "dark",
    features: [
      { label: "カスタムクレジット", dividerAfter: true },
      { label: "カスタムAIエージェント 無制限" },
      { label: "社内文書学習 (RAG) 無制限", dividerAfter: true },
      { label: "操作履歴の記録（最大180日間）" },
      { label: "シングルサインオン (SSO)" },
      { label: "データ漏洩防止 (DLP)" },
      { label: "IPアドレス制限 (ACL)", dividerAfter: true },
      { label: "カスタムブランディング" },
      { label: "高度なAIセキュリティ機能" },
    ],
  },
] as const;

const aipComparisonGroups: readonly ComparisonGroup[] = [
  {
    title: "一般",
    rows: [
      {
        label: "料金",
        values: [
          <strong key="starter-price">$20/月</strong>,
          <strong key="team-price">$500/月</strong>,
          <span key="enterprise-price" className="inline-flex flex-col items-center text-center">
            <strong>カスタム価格</strong>
            <span className="text-xs text-slate-500">（年間契約）</span>
          </span>,
        ],
      },
      {
        label: "AI利用クレジット",
        values: ["800クレジット/月", "20,000クレジット/月", "カスタムクレジット"],
      },
      {
        label: "利用可能なAIモデル",
        values: ["Claude", "Claude / ChatGPT / Gemini", "主要LLMを自由に選択可"],
      },
      {
        label: "独自AIモデルの利用",
        values: [false, false, "(Add-on)"],
      },
    ],
  },
  {
    title: "プラットフォーム機能",
    rows: [
      { label: "Web検索", values: [true, true, true] },
      { label: "データ可視化ウィジェット", values: [true, true, true] },
      { label: "コード生成・実行", values: [true, true, true] },
      { label: "外部ツール連携 (MCP)", values: [true, true, true] },
      { label: "MCP連携設定の作成", values: [true, true, true] },
      { label: "MCPプロンプト自動生成", values: [true, true, true] },
      { label: "外部アプリでの連携利用", values: [true, true, true] },
      { label: "AIエージェント作成数", values: ["一時的に無制限", "一時的に無制限", "無制限"] },
      { label: "組み込みエージェント利用", values: [true, true, true] },
      { label: "エージェント自動実行", values: [true, true, true] },
      { label: "文書学習の登録数 (RAG)", values: ["3", "10", "無制限"] },
    ],
  },
  {
    title: "セキュリティ機能",
    rows: [
      { label: "シングルサインオン (SSO)", values: [false, false, true] },
      { label: "操作履歴の保存期間", values: ["最大30日間", "最大90日間", "最大180日間"] },
      { label: "データ漏洩防止 (DLP)", values: [false, true, true] },
      { label: "IPアドレス制限 (ACL)", values: [true, true, true] },
    ],
  },
  {
    title: "組織機能",
    rows: [
      { label: "組織共通の外部ツール連携設定", values: [false, false, true] },
      { label: "組織共通の社内システム暗号化接続", values: [false, false, true] },
      { label: "連携ツールのアクセス管理", values: [false, true, true] },
      { label: "エージェントのアクセス管理", values: [false, true, true] },
    ],
  },
  {
    title: "ブランディングとサポート",
    rows: [
      { label: "カスタムブランディング", values: [false, false, true] },
      {
        label: "サポート体制",
        values: [
          <span key="starter-support" className="inline-flex flex-col items-center text-center">
            <span>48時間以内の</span>
            <span>メールサポート</span>
          </span>,
          <span key="team-support" className="inline-flex flex-col items-center text-center">
            <span>24時間以内の</span>
            <span>メールサポート</span>
          </span>,
          "専任",
        ],
      },
    ],
  },
] as const;

const acpPlans: readonly PlanCardData[] = [
  {
    title: "コミュニティ",
    description: "同じ品質のCommunity版の無料ライセンスをダウンロードして取得",
    price: "$0/月",
    ctaLabel: "今すぐダウンロード",
    ctaHref: "https://docs.querypie.com/ja/installation/querypie-acp-community-edition",
    ctaExternal: true,
    tone: "primary",
    features: [
      { label: "最大5ユーザーまで利用可能" },
      { label: "データベースアクセス制御" },
      { label: "システムアクセス制御" },
      { label: "Kubernetesアクセス制御" },
      { label: "Webアクセス制御" },
      { label: "申請・承認ワークフロー" },
    ],
  },
  {
    title: "スタンダード",
    description: "コミュニティ版にご満足の利用者に限定して提供。年間契約のみ。",
    price: "$50/人・月",
    ctaLabel: "お問い合わせ",
    ctaHref: "/contact-us?inquiry=quote-request&product=acp",
    tone: "primary",
    features: [
      { label: "10ユーザー以上" },
      { label: "データベースアクセス制御" },
      { label: "システムアクセス制御" },
      { label: "Kubernetesアクセス制御" },
      { label: "Webアクセス制御", supported: false },
      { label: "申請・承認ワークフロー", dividerAfter: true },
      { label: "オンラインテクニカルサポート" },
      { label: "導入サポート・オンボーディング", supported: false },
      { label: "アップデートサポート", supported: false },
    ],
  },
  {
    title: "エンタープライズ",
    description: "プロフェッショナルな導入サポートとサービスを求めるチームにおすすめ",
    price: "個別見積もり",
    ctaLabel: "お問い合わせ",
    ctaHref: "/contact-us?inquiry=quote-request&product=acp",
    tone: "dark",
    features: [
      { label: "柔軟なユーザー数の設定" },
      { label: "データベースアクセス制御" },
      { label: "システムアクセス制御" },
      { label: "Kubernetesアクセス制御" },
      { label: "Webアクセス制御" },
      { label: "申請・承認ワークフロー", dividerAfter: true },
      { label: "テクニカルサポート" },
      { label: "導入サポート・オンボーディング" },
      { label: "アップデートサポート" },
    ],
  },
] as const;

export default function PlansPreviewPage() {
  return (
    <main className="relative overflow-x-hidden bg-white pt-[72px] text-slate-950">
      <SiteHeader />
      <PlansPageSection>
        <PlansHeroSection>
          <div className="flex flex-col gap-5">
            <PlansHeroTitle>プラン</PlansHeroTitle>
            <PlansHeroDescription>
              <p>
                あなたのチームに最適なプランを見つけよう。
                <br />
                14日間の無料トライアルで今すぐ始められます。
              </p>
            </PlansHeroDescription>
          </div>

          <PlansProductSwitcher
            products={[
              {
                key: "aip",
                name: "QueryPie AIP",
                description: "エンタープライズAIプラットフォーム",
                cards: aipPlans,
                comparisonGroups: aipComparisonGroups,
              },
              {
                key: "acp",
                name: "QueryPie ACP",
                description: "アクセス制御プラットフォーム",
                cards: acpPlans,
              },
            ]}
          />
        </PlansHeroSection>
      </PlansPageSection>
      <SiteFooter />
    </main>
  );
}
