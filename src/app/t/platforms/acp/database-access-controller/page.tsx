import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  AcpCapabilityGallery,
  AcpCapabilityGrid,
  AcpCapabilityImage,
  AcpFeatureCard,
  AcpFeatureCardDescription,
  AcpFeatureCardTitle,
  AcpFeatureGrid,
  AcpFeatureSection,
  AcpHeroEyebrow,
  AcpHeroLeadGroup,
  AcpHeroSection,
  AcpHeroTitle,
  AcpPageCta,
  AcpPageCtaDescription,
  AcpPageCtaLink,
  AcpPageCtaTitle,
  AcpSectionHeading,
  AcpSectionIntro,
  AcpSectionLeadGroup,
  AcpStaticPageShell,
  AcpWorksSection,
} from "@/components/sections/acp/static-page";

export const metadata: Metadata = {
  title: "QueryPie DAC: Database Access Controller | QueryPie AI",
  description: "QueryPie DACnはデータ保護のために作られ、様々なクラウドエコシステムにシームレスに接続します。 ",
  alternates: {
    canonical: "/t/platforms/acp/database-access-controller",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DatabaseAccessControllerPage() {
  return (
    <AcpStaticPageShell>
      <SiteHeader />
      <AcpHeroSection media={{"kind": "youtube", "src": "https://www.youtube.com/embed/SoACnHF6s3Y?si=1DSZJfMYeXjeT0kU"}} mediaTitle="Database Access Controller">
        <AcpHeroEyebrow>QueryPie ACP</AcpHeroEyebrow>
        <AcpHeroTitle>Database Access Controller</AcpHeroTitle>
        <AcpHeroLeadGroup>
          <p>
            QueryPie DAC は、クラウド環境とオンプレミス環境の両方をサポートするデータ保護およびアクセス制御ソリューションです。
          </p>
          <p>
            どこにいても、データセキュリティとアクセス制御を完全に管理できるQueryPie DAC から始めてみませんか？
          </p>
        </AcpHeroLeadGroup>
      </AcpHeroSection>
      <AcpFeatureSection>
        <AcpSectionIntro>
          <AcpSectionHeading>DAC の注目機能</AcpSectionHeading>
          <AcpSectionLeadGroup>
            <p>
              QueryPie DAC は、RBAC（ロールベースアクセス制御）とABAC（属性ベースアクセス制御）を活用した動的なアクセス制御を提供し、高度な権限管理をサポートします。ユーザーはWeb SQL エディタを使ってスムーズにデータベース作業を行うことができ、管理者は多様なデータソースにおけるユーザーの活動をリアルタイムで監査することが可能です。
            </p>
          </AcpSectionLeadGroup>
        </AcpSectionIntro>
        <AcpFeatureGrid>
          <AcpFeatureCard icon="/platforms/acp/icons/iam.svg">
            <AcpFeatureCardTitle>RBAC / ABAC ベースのアクセス制御</AcpFeatureCardTitle>
            <AcpFeatureCardDescription>
              ユーザーロール(RBAC: Role-Based Access Control)によって基本権限を設定できるだけでなく、時間、曜日、 アドレス、SQL タイプなど様々な属性(ABAC: Attribute-Based Access Control)に基づいた詳細なアクセス制御が可能です。
            </AcpFeatureCardDescription>
          </AcpFeatureCard>
          <AcpFeatureCard icon="/platforms/acp/icons/web-editor.svg">
            <AcpFeatureCardTitle>Web SQL エディタ対応</AcpFeatureCardTitle>
            <AcpFeatureCardDescription>
              ユーザーのオペレーティングシステムが何であっても、IDE ツールがなくても、ユーザフレンドリーな Web SQL エディタでブラウザから直接データベースに接続することができます。 クエリの実行からデータのインポートとエクスポートまで、すべてのタスクを簡単に処理できます。
            </AcpFeatureCardDescription>
          </AcpFeatureCard>
          <AcpFeatureCard icon="/platforms/acp/icons/alert.svg">
            <AcpFeatureCardTitle>データ監査と異常兆候の通知</AcpFeatureCardTitle>
            <AcpFeatureCardDescription>
              ログイン、データベースアクセス、権限変更、SQL コマンド、クエリ結果など、すべてのユーザー活動を追跡し、異常な行動を素早く感知し、データセキュリティを徹底的に維持することができます。また、Slack のようなチャンネルでリアルタイム通知を受けて重要なイベントを確認することができます。
            </AcpFeatureCardDescription>
          </AcpFeatureCard>
          <AcpFeatureCard icon="/platforms/acp/icons/table-access-control.svg">
            <AcpFeatureCardTitle>テーブル / カラム単位のアクセス制御</AcpFeatureCardTitle>
            <AcpFeatureCardDescription>
              機密情報を保護するためにデータマスキングポリシーを適用し、特定のクエリルールによって重要なテーブルとカラムへのアクセス制限を設定してデータセキュリティを強化することができます。
            </AcpFeatureCardDescription>
          </AcpFeatureCard>
          <AcpFeatureCard icon="/platforms/acp/icons/workflow.svg">
            <AcpFeatureCardTitle>ジャストインアクセス要求処理</AcpFeatureCardTitle>
            <AcpFeatureCardDescription>
              ユーザーが必要な時点でアクセス権を要請し、管理者が直ちに承認及び権限を付与することができます。 Slack のようなシームレスな統合により、簡単で効率的なアクセス管理が可能です。
            </AcpFeatureCardDescription>
          </AcpFeatureCard>
        </AcpFeatureGrid>
      </AcpFeatureSection>
      <AcpWorksSection imageSrc="/platforms/acp/database-access-controller/works.png" imageAlt="QueryPie DACの仕組み">
        <AcpSectionIntro>
          <AcpSectionHeading>QueryPie DACの仕組み</AcpSectionHeading>
          <AcpSectionLeadGroup>
            <p>
              ブラウザベースのWeb SQLエディタにより、データ漏洩制御を簡単に管理できるだけでなく、
            </p>
            <p>
              サードパーティーツールの使用を可能にするエージェントまたはエージェントレス(URLプロキシ)方式をサポートします。
            </p>
            <p>
              QueryPieは、お客様の固有の環境に合わせて柔軟なワークスペースを提供し、セキュリティを一層強化します。
            </p>
          </AcpSectionLeadGroup>
        </AcpSectionIntro>
      </AcpWorksSection>
      <AcpCapabilityGallery>
        <AcpSectionHeading>主な機能</AcpSectionHeading>
        <AcpCapabilityGrid>
          <AcpCapabilityImage src="/platforms/acp/database-access-controller/analyzer.png" alt="analyzer" />
          <AcpCapabilityImage src="/platforms/acp/database-access-controller/easy-use-jp.png" alt="easy use jp" />
          <AcpCapabilityImage src="/platforms/acp/database-access-controller/sql-editor.png" alt="sql editor" />
          <AcpCapabilityImage src="/platforms/acp/database-access-controller/third-party-tools.png" alt="third party tools" />
          <AcpCapabilityImage src="/platforms/acp/database-access-controller/db-control.png" alt="db control" />
          <AcpCapabilityImage src="/platforms/acp/database-access-controller/data-masking.png" alt="data masking" />
          <AcpCapabilityImage src="/platforms/acp/database-access-controller/ledger.png" alt="ledger" />
          <AcpCapabilityImage src="/platforms/acp/database-access-controller/workflow.png" alt="workflow" />
        </AcpCapabilityGrid>
      </AcpCapabilityGallery>
      <AcpPageCta>
        <AcpPageCtaTitle>QueryPie ACPを無料でお試しください</AcpPageCtaTitle>
        <AcpPageCtaDescription>
          アクセス制御、監査、統合管理をひとつのプラットフォームで確認できます。
        </AcpPageCtaDescription>
        <AcpPageCtaLink>デモを依頼</AcpPageCtaLink>
      </AcpPageCta>
      <SiteFooter />
    </AcpStaticPageShell>
  );
}
