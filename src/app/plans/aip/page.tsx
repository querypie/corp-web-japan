import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  CompanyPageIntro,
  CompanyPageLead,
  CompanyPageSection,
  CompanyPageTitle,
} from "@/components/sections/company/page-primitives";
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
  PricingContextProvider,
  PricingRoot,
  ProductDescription,
  ProductName,
  ProductTab,
  ProductTabs,
} from "@/components/sections/plans/section";
import { componentNameDebugProps } from "@/lib/component-name-debug";

const description = "あなたのチームに最適なプランを見つけよう。14日間の無料トライアルで今すぐ始められます。";

export const metadata: Metadata = {
  title: "QueryPie AIP プラン | QueryPie AI",
  description,
  alternates: {
    canonical: "/plans/aip",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "QueryPie AIP プラン | QueryPie AI",
    description,
    type: "website",
  },
  twitter: {
    title: "QueryPie AIP プラン | QueryPie AI",
    description,
    card: "summary_large_image",
  },
};

export default function PlansAIPPage() {
  return (
    <main {...componentNameDebugProps("PlansAIPPage")} className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <CompanyPageSection>
        <PricingRoot>
          <CompanyPageIntro>
            <CompanyPageTitle>プラン</CompanyPageTitle>
            <CompanyPageLead>
              <p>
                あなたのチームに最適なプランを見つけよう。
                <br />
                14日間の無料トライアルで今すぐ始められます。
              </p>
            </CompanyPageLead>
          </CompanyPageIntro>

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

        <PlanRoot num={3}>
          <PlanCard type="primary">
            <PlanTitleContainer>
              <div>
                <PlanTitle>スターター</PlanTitle>
                <PlanDescription>はじめての利用に最適</PlanDescription>
              </div>
            </PlanTitleContainer>
            <PlanPrice>$20/月</PlanPrice>
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
            </PlanTitleContainer>
            <PlanPrice>$500/月</PlanPrice>
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
            </PlanTitleContainer>
            <PlanPrice>個別見積もり</PlanPrice>
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
          </PricingContextProvider>
        </PricingRoot>
      </CompanyPageSection>
      <SiteFooter />
    </main>
  );
}
