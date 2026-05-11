import { Fragment } from "react";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  CompareTable,
  PlanButton,
  PlanCard,
  PlanDescription,
  PlanDivider,
  PlanFeature,
  PlanFeatures,
  PlanPrice,
  PlanRoot,
  PlanTitle,
  PlanTitleContainer,
  PlanVisibility,
  PlansHeroDescription,
  PlansHeroTitle,
  PlansPageSection,
  PricingContextProvider,
  PricingHeader,
  PricingRoot,
  ProductDescription,
  ProductName,
  ProductTab,
  ProductTabs,
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

const Pricing = Object.assign(PricingRoot, { Header: PricingHeader });
const Plan = Object.assign(PlanRoot, {
  Card: PlanCard,
  TitleContainer: PlanTitleContainer,
  Title: PlanTitle,
  Description: PlanDescription,
  Price: PlanPrice,
  Button: PlanButton,
  Features: PlanFeatures,
  Feature: PlanFeature,
  Divider: PlanDivider,
});

export default function PlansPreviewPage() {
  return (
    <main className="relative overflow-x-hidden bg-white pt-[72px] text-slate-950">
      <SiteHeader />
      <PlansPageSection>
        <PricingRoot>
          <Pricing.Header>
            <PlansHeroTitle>プラン</PlansHeroTitle>
            <PlansHeroDescription>
              <p>
                あなたのチームに最適なプランを見つけよう。
                <br />
                14日間の無料トライアルで今すぐ始められます。
              </p>
            </PlansHeroDescription>
          </Pricing.Header>

          <PricingContextProvider defaultActiveTab="aip">
            <ProductTabs>
              <ProductTab name="aip">
                <ProductName>QueryPie AIP</ProductName>
                <ProductDescription>エンタープライズAIプラットフォーム</ProductDescription>
              </ProductTab>
              <ProductTab name="acp">
                <ProductName>QueryPie ACP</ProductName>
                <ProductDescription>アクセス制御プラットフォーム</ProductDescription>
              </ProductTab>
            </ProductTabs>

            <PlanVisibility id="aip">
              <Plan num={3}>
                <Plan.Card type="primary">
                  <Plan.TitleContainer>
                    <div>
                      <Plan.Title>スターター</Plan.Title>
                      <Plan.Description>はじめての利用に最適</Plan.Description>
                    </div>
                    <Plan.Price>$20/月</Plan.Price>
                  </Plan.TitleContainer>
                  <Plan.Button href="https://app.querypie.com" external={true} type="primary">
                    利用を開始する
                  </Plan.Button>
                  <Plan.Features>
                    <Plan.Feature supported={true}>月間800クレジット</Plan.Feature>
                    <Plan.Divider />
                    <Plan.Feature supported={true}>カスタムAIエージェント（現在無制限）</Plan.Feature>
                    <Plan.Feature supported={true}>社内文書学習 (RAG) 3つまで</Plan.Feature>
                    <Plan.Divider />
                    <Plan.Feature supported={true}>操作履歴の記録（最大30日間）</Plan.Feature>
                    <Plan.Feature supported={true}>IPアドレス制限 (ACL)</Plan.Feature>
                  </Plan.Features>
                </Plan.Card>

                <Plan.Card type="primary">
                  <Plan.TitleContainer>
                    <div>
                      <Plan.Title>チーム</Plan.Title>
                      <Plan.Description>チームでの協働作業に最適</Plan.Description>
                    </div>
                    <Plan.Price>$500/月</Plan.Price>
                  </Plan.TitleContainer>
                  <Plan.Button href="https://app.querypie.com" external={true} type="primary">
                    利用を開始する
                  </Plan.Button>
                  <Plan.Features>
                    <Plan.Feature supported={true}>月間20,000クレジット</Plan.Feature>
                    <Plan.Divider />
                    <Plan.Feature supported={true}>カスタムAIエージェント（現在無制限）</Plan.Feature>
                    <Plan.Feature supported={true}>社内文書学習 (RAG) 10個まで</Plan.Feature>
                    <Plan.Divider />
                    <Plan.Feature supported={true}>操作履歴の記録（最大90日間）</Plan.Feature>
                    <Plan.Feature supported={true}>データ漏洩防止 (DLP)</Plan.Feature>
                    <Plan.Feature supported={true}>IPアドレス制限 (ACL)</Plan.Feature>
                  </Plan.Features>
                </Plan.Card>

                <Plan.Card type="black">
                  <Plan.TitleContainer>
                    <div>
                      <Plan.Title>エンタープライズ</Plan.Title>
                      <Plan.Description>大規模組織向けの包括的プラン</Plan.Description>
                    </div>
                    <Plan.Price>個別見積もり</Plan.Price>
                  </Plan.TitleContainer>
                  <Plan.Button href="https://app.querypie.com" external={true} type="black">
                    今すぐ試す
                  </Plan.Button>
                  <Plan.Features>
                    <Plan.Feature supported={true}>カスタムクレジット</Plan.Feature>
                    <Plan.Divider />
                    <Plan.Feature supported={true}>カスタムAIエージェント 無制限</Plan.Feature>
                    <Plan.Feature supported={true}>社内文書学習 (RAG) 無制限</Plan.Feature>
                    <Plan.Divider />
                    <Plan.Feature supported={true}>操作履歴の記録（最大180日間）</Plan.Feature>
                    <Plan.Feature supported={true}>シングルサインオン (SSO)</Plan.Feature>
                    <Plan.Feature supported={true}>データ漏洩防止 (DLP)</Plan.Feature>
                    <Plan.Feature supported={true}>IPアドレス制限 (ACL)</Plan.Feature>
                    <Plan.Divider />
                    <Plan.Feature supported={true}>カスタムブランディング</Plan.Feature>
                    <Plan.Feature supported={true}>高度なAIセキュリティ機能</Plan.Feature>
                  </Plan.Features>
                </Plan.Card>
              </Plan>

              <CompareTable
                rows={[
                  {
                    label: "一般",
                    values: ["料金", "AI利用クレジット", "利用可能なAIモデル", "独自AIモデルの利用"],
                  },
                  {
                    label: "プラットフォーム機能",
                    values: [
                      "Web検索",
                      "データ可視化ウィジェット",
                      "コード生成・実行",
                      "外部ツール連携 (MCP)",
                      "MCP連携設定の作成",
                      "MCPプロンプト自動生成",
                      "外部アプリでの連携利用",
                      "AIエージェント作成数",
                      "組み込みエージェント利用",
                      "エージェント自動実行",
                      "文書学習の登録数 (RAG)",
                    ],
                  },
                  {
                    label: "セキュリティ機能",
                    values: ["シングルサインオン (SSO)", "操作履歴の保存期間", "データ漏洩防止 (DLP)", "IPアドレス制限 (ACL)"],
                  },
                  {
                    label: "組織機能",
                    values: ["組織共通の外部ツール連携設定", "組織共通の社内システム暗号化接続", "連携ツールのアクセス管理", "エージェントのアクセス管理"],
                  },
                  {
                    label: "ブランディングとサポート",
                    values: ["カスタムブランディング", "サポート体制"],
                  },
                ]}
                columns={[
                  {
                    label: "スターター",
                    values: [
                      [{ primary: "$20/月", isBold: true }, { primary: "800クレジット/月" }, { primary: "Claude" }, false],
                      [true, true, true, true, true, true, true, { primary: "一時的に無制限" }, true, true, { primary: "3" }],
                      [false, { primary: "最大30日間", showIcon: true }, false, true],
                      [false, false, false, false],
                      [
                        false,
                        <Fragment key="starter-email-support">
                          <span className="inline-flex flex-col items-center text-center">
                            <span>48時間以内の</span>
                            <span>メールサポート</span>
                          </span>
                        </Fragment>,
                      ],
                    ],
                  },
                  {
                    label: "チーム",
                    values: [
                      [{ primary: "$500/月", isBold: true }, { primary: "20,000クレジット/月" }, { primary: "Claude / ChatGPT / Gemini" }, false],
                      [true, true, true, true, true, true, true, { primary: "一時的に無制限" }, true, true, { primary: "10" }],
                      [false, { primary: "最大90日間", showIcon: true }, true, true],
                      [false, false, true, true],
                      [
                        false,
                        <Fragment key="team-email-support">
                          <span className="inline-flex flex-col items-center text-center">
                            <span>24時間以内の</span>
                            <span>メールサポート</span>
                          </span>
                        </Fragment>,
                      ],
                    ],
                  },
                  {
                    label: "エンタープライズ",
                    values: [
                      [{ primary: "カスタム価格", secondary: "（年間契約）", isBold: true }, { primary: "カスタムクレジット" }, { primary: "主要LLMを自由に選択可" }, { primary: "(Add-on)", showIcon: true }],
                      [true, true, true, true, true, true, true, { primary: "無制限" }, true, true, { primary: "無制限" }],
                      [true, { primary: "最大180日間", showIcon: true }, true, true],
                      [true, true, true, true],
                      [true, { primary: "専任" }],
                    ],
                  },
                ]}
              />
            </PlanVisibility>

            <PlanVisibility id="acp">
              <Plan num={3}>
                <Plan.Card type="primary">
                  <Plan.TitleContainer>
                    <div>
                      <Plan.Title>コミュニティ</Plan.Title>
                      <Plan.Description>同じ品質のCommunity版の無料ライセンスをダウンロードして取得</Plan.Description>
                    </div>
                    <Plan.Price>$0/月</Plan.Price>
                  </Plan.TitleContainer>
                  <Plan.Button href="https://docs.querypie.com/ja/installation/querypie-acp-community-edition" external={true} type="primary">
                    今すぐダウンロード
                  </Plan.Button>
                  <Plan.Features>
                    <Plan.Feature supported={true}>最大5ユーザーまで利用可能</Plan.Feature>
                    <Plan.Feature supported={true}>データベースアクセス制御</Plan.Feature>
                    <Plan.Feature supported={true}>システムアクセス制御</Plan.Feature>
                    <Plan.Feature supported={true}>Kubernetesアクセス制御</Plan.Feature>
                    <Plan.Feature supported={true}>Webアクセス制御</Plan.Feature>
                    <Plan.Feature supported={true}>申請・承認ワークフロー</Plan.Feature>
                  </Plan.Features>
                </Plan.Card>

                <Plan.Card type="primary">
                  <Plan.TitleContainer>
                    <div>
                      <Plan.Title>スタンダード</Plan.Title>
                      <Plan.Description>コミュニティ版にご満足の利用者に限定して提供。年間契約のみ。</Plan.Description>
                    </div>
                    <Plan.Price>$50/人・月</Plan.Price>
                  </Plan.TitleContainer>
                  <Plan.Button href="/contact-us?inquiry=quote-request&product=acp" type="primary">
                    お問い合わせ
                  </Plan.Button>
                  <Plan.Features>
                    <Plan.Feature supported={true}>10ユーザー以上</Plan.Feature>
                    <Plan.Feature supported={true}>データベースアクセス制御</Plan.Feature>
                    <Plan.Feature supported={true}>システムアクセス制御</Plan.Feature>
                    <Plan.Feature supported={true}>Kubernetesアクセス制御</Plan.Feature>
                    <Plan.Feature supported={false}>Webアクセス制御</Plan.Feature>
                    <Plan.Feature supported={true}>申請・承認ワークフロー</Plan.Feature>
                    <Plan.Divider />
                    <Plan.Feature supported={true}>オンラインテクニカルサポート</Plan.Feature>
                    <Plan.Feature supported={false}>導入サポート・オンボーディング</Plan.Feature>
                    <Plan.Feature supported={false}>アップデートサポート</Plan.Feature>
                  </Plan.Features>
                </Plan.Card>

                <Plan.Card type="black">
                  <Plan.TitleContainer>
                    <div>
                      <Plan.Title>エンタープライズ</Plan.Title>
                      <Plan.Description>プロフェッショナルな導入サポートとサービスを求めるチームにおすすめ</Plan.Description>
                    </div>
                    <Plan.Price>個別見積もり</Plan.Price>
                  </Plan.TitleContainer>
                  <Plan.Button href="/contact-us?inquiry=quote-request&product=acp" type="black">
                    お問い合わせ
                  </Plan.Button>
                  <Plan.Features>
                    <Plan.Feature supported={true}>柔軟なユーザー数の設定</Plan.Feature>
                    <Plan.Feature supported={true}>データベースアクセス制御</Plan.Feature>
                    <Plan.Feature supported={true}>システムアクセス制御</Plan.Feature>
                    <Plan.Feature supported={true}>Kubernetesアクセス制御</Plan.Feature>
                    <Plan.Feature supported={true}>Webアクセス制御</Plan.Feature>
                    <Plan.Feature supported={true}>申請・承認ワークフロー</Plan.Feature>
                    <Plan.Divider />
                    <Plan.Feature supported={true}>テクニカルサポート</Plan.Feature>
                    <Plan.Feature supported={true}>導入サポート・オンボーディング</Plan.Feature>
                    <Plan.Feature supported={true}>アップデートサポート</Plan.Feature>
                  </Plan.Features>
                </Plan.Card>
              </Plan>
            </PlanVisibility>
          </PricingContextProvider>
        </PricingRoot>
      </PlansPageSection>
      <SiteFooter />
    </main>
  );
}
