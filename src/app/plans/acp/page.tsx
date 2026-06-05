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
  title: "QueryPie ACP プラン | QueryPie AI",
  description,
  alternates: {
    canonical: "/plans/acp",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "QueryPie ACP プラン | QueryPie AI",
    description,
    type: "website",
  },
  twitter: {
    title: "QueryPie ACP プラン | QueryPie AI",
    description,
    card: "summary_large_image",
  },
};

export default function PlansACPPage() {
  return (
    <main {...componentNameDebugProps("PlansACPPage")} className="relative overflow-x-hidden bg-white text-slate-950">
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

          <PricingContextProvider defaultActiveTab="acp">
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
                  <PlanTitle>コミュニティ</PlanTitle>
                  <PlanDescription>同じ品質のCommunity版の無料ライセンスをダウンロードして取得</PlanDescription>
                </div>
              </PlanTitleContainer>
              <PlanPrice>$0/月</PlanPrice>
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
              </PlanTitleContainer>
              <PlanPrice>$50/人・月</PlanPrice>
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
              </PlanTitleContainer>
              <PlanPrice>個別見積もり</PlanPrice>
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
          </PricingContextProvider>
        </PricingRoot>
      </CompanyPageSection>
      <SiteFooter />
    </main>
  );
}
