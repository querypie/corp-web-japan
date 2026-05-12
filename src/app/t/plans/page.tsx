import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  CompareTable,
  CompareTableBooleanCell,
  CompareTableCheckLabelCell,
  CompareTableHead,
  CompareTablePlanHead,
  CompareTableRow,
  CompareTableSection,
  CompareTableTextCell,
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
} from "@/components/sections/plans/section";

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

export default function PlansPage() {
  return (
    <main className="relative overflow-x-hidden bg-white pt-[72px] text-slate-950">
      <SiteHeader />
      <PlansPageSection>
        <PricingRoot>
          <PricingHeader>
            <PlansHeroTitle>プラン</PlansHeroTitle>
            <PlansHeroDescription>
              <p>
                あなたのチームに最適なプランを見つけよう。
                <br />
                14日間の無料トライアルで今すぐ始められます。
              </p>
            </PlansHeroDescription>
          </PricingHeader>

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
              <PlanRoot num={3}>
                <PlanCard type="primary">
                  <PlanTitleContainer>
                    <div>
                      <PlanTitle>スターター</PlanTitle>
                      <PlanDescription>はじめての利用に最適</PlanDescription>
                    </div>
                    <PlanPrice>$20/月</PlanPrice>
                  </PlanTitleContainer>
                  <PlanButton href="https://app.querypie.com" external={true} type="primary">
                    利用を開始する
                  </PlanButton>
                  <PlanFeatures>
                    <PlanFeature supported={true}>月間800クレジット</PlanFeature>
                    <PlanDivider />
                    <PlanFeature supported={true}>カスタムAIエージェント（現在無制限）</PlanFeature>
                    <PlanFeature supported={true}>社内文書学習 (RAG) 3つまで</PlanFeature>
                    <PlanDivider />
                    <PlanFeature supported={true}>操作履歴の記録（最大30日間）</PlanFeature>
                    <PlanFeature supported={true}>IPアドレス制限 (ACL)</PlanFeature>
                  </PlanFeatures>
                </PlanCard>

                <PlanCard type="primary">
                  <PlanTitleContainer>
                    <div>
                      <PlanTitle>チーム</PlanTitle>
                      <PlanDescription>チームでの協働作業に最適</PlanDescription>
                    </div>
                    <PlanPrice>$500/月</PlanPrice>
                  </PlanTitleContainer>
                  <PlanButton href="https://app.querypie.com" external={true} type="primary">
                    利用を開始する
                  </PlanButton>
                  <PlanFeatures>
                    <PlanFeature supported={true}>月間20,000クレジット</PlanFeature>
                    <PlanDivider />
                    <PlanFeature supported={true}>カスタムAIエージェント（現在無制限）</PlanFeature>
                    <PlanFeature supported={true}>社内文書学習 (RAG) 10個まで</PlanFeature>
                    <PlanDivider />
                    <PlanFeature supported={true}>操作履歴の記録（最大90日間）</PlanFeature>
                    <PlanFeature supported={true}>データ漏洩防止 (DLP)</PlanFeature>
                    <PlanFeature supported={true}>IPアドレス制限 (ACL)</PlanFeature>
                  </PlanFeatures>
                </PlanCard>

                <PlanCard type="black">
                  <PlanTitleContainer>
                    <div>
                      <PlanTitle>エンタープライズ</PlanTitle>
                      <PlanDescription>大規模組織向けの包括的プラン</PlanDescription>
                    </div>
                    <PlanPrice>個別見積もり</PlanPrice>
                  </PlanTitleContainer>
                  <PlanButton href="https://app.querypie.com" external={true} type="black">
                    今すぐ試す
                  </PlanButton>
                  <PlanFeatures>
                    <PlanFeature supported={true}>カスタムクレジット</PlanFeature>
                    <PlanDivider />
                    <PlanFeature supported={true}>カスタムAIエージェント 無制限</PlanFeature>
                    <PlanFeature supported={true}>社内文書学習 (RAG) 無制限</PlanFeature>
                    <PlanDivider />
                    <PlanFeature supported={true}>操作履歴の記録（最大180日間）</PlanFeature>
                    <PlanFeature supported={true}>シングルサインオン (SSO)</PlanFeature>
                    <PlanFeature supported={true}>データ漏洩防止 (DLP)</PlanFeature>
                    <PlanFeature supported={true}>IPアドレス制限 (ACL)</PlanFeature>
                    <PlanDivider />
                    <PlanFeature supported={true}>カスタムブランディング</PlanFeature>
                    <PlanFeature supported={true}>高度なAIセキュリティ機能</PlanFeature>
                  </PlanFeatures>
                </PlanCard>
              </PlanRoot>

              <CompareTable>
                <CompareTableHead>
                  <CompareTablePlanHead>スターター</CompareTablePlanHead>
                  <CompareTablePlanHead>チーム</CompareTablePlanHead>
                  <CompareTablePlanHead>エンタープライズ</CompareTablePlanHead>
                </CompareTableHead>

                <CompareTableSection title="一般">
                  <CompareTableRow label="料金">
                    <CompareTableTextCell isBold>$20/月</CompareTableTextCell>
                    <CompareTableTextCell isBold>$500/月</CompareTableTextCell>
                    <CompareTableTextCell isBold secondary="（年間契約）">
                      カスタム価格
                    </CompareTableTextCell>
                  </CompareTableRow>
                  <CompareTableRow label="AI利用クレジット">
                    <CompareTableTextCell>800クレジット/月</CompareTableTextCell>
                    <CompareTableTextCell>20,000クレジット/月</CompareTableTextCell>
                    <CompareTableTextCell>カスタムクレジット</CompareTableTextCell>
                  </CompareTableRow>
                  <CompareTableRow label="利用可能なAIモデル">
                    <CompareTableTextCell>Claude</CompareTableTextCell>
                    <CompareTableTextCell>Claude / ChatGPT / Gemini</CompareTableTextCell>
                    <CompareTableTextCell>主要LLMを自由に選択可</CompareTableTextCell>
                  </CompareTableRow>
                  <CompareTableRow label="独自AIモデルの利用">
                    <CompareTableBooleanCell supported={false} />
                    <CompareTableBooleanCell supported={false} />
                    <CompareTableCheckLabelCell>(Add-on)</CompareTableCheckLabelCell>
                  </CompareTableRow>
                </CompareTableSection>

                <CompareTableSection title="プラットフォーム機能">
                  <CompareTableRow label="Web検索">
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                  </CompareTableRow>
                  <CompareTableRow label="データ可視化ウィジェット">
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                  </CompareTableRow>
                  <CompareTableRow label="コード生成・実行">
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                  </CompareTableRow>
                  <CompareTableRow label="外部ツール連携 (MCP)">
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                  </CompareTableRow>
                  <CompareTableRow label="MCP連携設定の作成">
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                  </CompareTableRow>
                  <CompareTableRow label="MCPプロンプト自動生成">
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                  </CompareTableRow>
                  <CompareTableRow label="外部アプリでの連携利用">
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                  </CompareTableRow>
                  <CompareTableRow label="AIエージェント作成数">
                    <CompareTableTextCell>一時的に無制限</CompareTableTextCell>
                    <CompareTableTextCell>一時的に無制限</CompareTableTextCell>
                    <CompareTableTextCell>無制限</CompareTableTextCell>
                  </CompareTableRow>
                  <CompareTableRow label="組み込みエージェント利用">
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                  </CompareTableRow>
                  <CompareTableRow label="エージェント自動実行">
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                  </CompareTableRow>
                  <CompareTableRow label="文書学習の登録数 (RAG)">
                    <CompareTableTextCell>3</CompareTableTextCell>
                    <CompareTableTextCell>10</CompareTableTextCell>
                    <CompareTableTextCell>無制限</CompareTableTextCell>
                  </CompareTableRow>
                </CompareTableSection>

                <CompareTableSection title="セキュリティ機能">
                  <CompareTableRow label="シングルサインオン (SSO)">
                    <CompareTableBooleanCell supported={false} />
                    <CompareTableBooleanCell supported={false} />
                    <CompareTableBooleanCell supported={true} />
                  </CompareTableRow>
                  <CompareTableRow label="操作履歴の保存期間">
                    <CompareTableCheckLabelCell>最大30日間</CompareTableCheckLabelCell>
                    <CompareTableCheckLabelCell>最大90日間</CompareTableCheckLabelCell>
                    <CompareTableCheckLabelCell>最大180日間</CompareTableCheckLabelCell>
                  </CompareTableRow>
                  <CompareTableRow label="データ漏洩防止 (DLP)">
                    <CompareTableBooleanCell supported={false} />
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                  </CompareTableRow>
                  <CompareTableRow label="IPアドレス制限 (ACL)">
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                  </CompareTableRow>
                </CompareTableSection>

                <CompareTableSection title="組織機能">
                  <CompareTableRow label="組織共通の外部ツール連携設定">
                    <CompareTableBooleanCell supported={false} />
                    <CompareTableBooleanCell supported={false} />
                    <CompareTableBooleanCell supported={true} />
                  </CompareTableRow>
                  <CompareTableRow label="組織共通の社内システム暗号化接続">
                    <CompareTableBooleanCell supported={false} />
                    <CompareTableBooleanCell supported={false} />
                    <CompareTableBooleanCell supported={true} />
                  </CompareTableRow>
                  <CompareTableRow label="連携ツールのアクセス管理">
                    <CompareTableBooleanCell supported={false} />
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                  </CompareTableRow>
                  <CompareTableRow label="エージェントのアクセス管理">
                    <CompareTableBooleanCell supported={false} />
                    <CompareTableBooleanCell supported={true} />
                    <CompareTableBooleanCell supported={true} />
                  </CompareTableRow>
                </CompareTableSection>

                <CompareTableSection title="ブランディングとサポート">
                  <CompareTableRow label="カスタムブランディング">
                    <CompareTableBooleanCell supported={false} />
                    <CompareTableBooleanCell supported={false} />
                    <CompareTableBooleanCell supported={true} />
                  </CompareTableRow>
                  <CompareTableRow label="サポート体制">
                    <CompareTableTextCell>
                      <span className="inline-flex flex-col items-center text-center">
                        <span>48時間以内の</span>
                        <span>メールサポート</span>
                      </span>
                    </CompareTableTextCell>
                    <CompareTableTextCell>
                      <span className="inline-flex flex-col items-center text-center">
                        <span>24時間以内の</span>
                        <span>メールサポート</span>
                      </span>
                    </CompareTableTextCell>
                    <CompareTableTextCell>専任</CompareTableTextCell>
                  </CompareTableRow>
                </CompareTableSection>
              </CompareTable>
            </PlanVisibility>

            <PlanVisibility id="acp">
              <PlanRoot num={3}>
                <PlanCard type="primary">
                  <PlanTitleContainer>
                    <div>
                      <PlanTitle>コミュニティ</PlanTitle>
                      <PlanDescription>同じ品質のCommunity版の無料ライセンスをダウンロードして取得</PlanDescription>
                    </div>
                    <PlanPrice>$0/月</PlanPrice>
                  </PlanTitleContainer>
                  <PlanButton href="https://docs.querypie.com/ja/installation/querypie-acp-community-edition" external={true} type="primary">
                    今すぐダウンロード
                  </PlanButton>
                  <PlanFeatures>
                    <PlanFeature supported={true}>最大5ユーザーまで利用可能</PlanFeature>
                    <PlanFeature supported={true}>データベースアクセス制御</PlanFeature>
                    <PlanFeature supported={true}>システムアクセス制御</PlanFeature>
                    <PlanFeature supported={true}>Kubernetesアクセス制御</PlanFeature>
                    <PlanFeature supported={true}>Webアクセス制御</PlanFeature>
                    <PlanFeature supported={true}>申請・承認ワークフロー</PlanFeature>
                  </PlanFeatures>
                </PlanCard>

                <PlanCard type="primary">
                  <PlanTitleContainer>
                    <div>
                      <PlanTitle>スタンダード</PlanTitle>
                      <PlanDescription>コミュニティ版にご満足の利用者に限定して提供。年間契約のみ。</PlanDescription>
                    </div>
                    <PlanPrice>$50/人・月</PlanPrice>
                  </PlanTitleContainer>
                  <PlanButton href="/contact-us?inquiry=quote-request&product=acp" type="primary">
                    お問い合わせ
                  </PlanButton>
                  <PlanFeatures>
                    <PlanFeature supported={true}>10ユーザー以上</PlanFeature>
                    <PlanFeature supported={true}>データベースアクセス制御</PlanFeature>
                    <PlanFeature supported={true}>システムアクセス制御</PlanFeature>
                    <PlanFeature supported={true}>Kubernetesアクセス制御</PlanFeature>
                    <PlanFeature supported={false}>Webアクセス制御</PlanFeature>
                    <PlanFeature supported={true}>申請・承認ワークフロー</PlanFeature>
                    <PlanDivider />
                    <PlanFeature supported={true}>オンラインテクニカルサポート</PlanFeature>
                    <PlanFeature supported={false}>導入サポート・オンボーディング</PlanFeature>
                    <PlanFeature supported={false}>アップデートサポート</PlanFeature>
                  </PlanFeatures>
                </PlanCard>

                <PlanCard type="black">
                  <PlanTitleContainer>
                    <div>
                      <PlanTitle>エンタープライズ</PlanTitle>
                      <PlanDescription>プロフェッショナルな導入サポートとサービスを求めるチームにおすすめ</PlanDescription>
                    </div>
                    <PlanPrice>個別見積もり</PlanPrice>
                  </PlanTitleContainer>
                  <PlanButton href="/contact-us?inquiry=quote-request&product=acp" type="black">
                    お問い合わせ
                  </PlanButton>
                  <PlanFeatures>
                    <PlanFeature supported={true}>柔軟なユーザー数の設定</PlanFeature>
                    <PlanFeature supported={true}>データベースアクセス制御</PlanFeature>
                    <PlanFeature supported={true}>システムアクセス制御</PlanFeature>
                    <PlanFeature supported={true}>Kubernetesアクセス制御</PlanFeature>
                    <PlanFeature supported={true}>Webアクセス制御</PlanFeature>
                    <PlanFeature supported={true}>申請・承認ワークフロー</PlanFeature>
                    <PlanDivider />
                    <PlanFeature supported={true}>テクニカルサポート</PlanFeature>
                    <PlanFeature supported={true}>導入サポート・オンボーディング</PlanFeature>
                    <PlanFeature supported={true}>アップデートサポート</PlanFeature>
                  </PlanFeatures>
                </PlanCard>
              </PlanRoot>
            </PlanVisibility>
          </PricingContextProvider>
        </PricingRoot>
      </PlansPageSection>
      <SiteFooter />
    </main>
  );
}
