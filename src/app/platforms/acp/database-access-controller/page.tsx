import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  AcpFeatureCard,
  AcpFaqItem,
  AcpFaqSection,
  AcpFeatureCardDescription,
  AcpFeatureCardTitle,
  AcpFeatureGrid,
  AcpFeatureSection,
  AcpHeroCopy,
  AcpHeroEyebrow,
  AcpHeroLead,
  AcpHeroSection,
  AcpHeroTitle,
  AcpPageCta,
  AcpPageCtaDescription,
  AcpPageCtaLink,
  AcpPageCtaTitle,
  AcpSectionHeading,
  AcpSectionIntro,
  AcpSectionLeadGroup,
  AcpSplitFeatureBody,
  AcpSplitFeatureSection,
  AcpSplitFeatureTitle,
  AcpStaticPageShell,
  AcpWorksSection,
} from "@/components/sections/acp/static-page";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export const metadata: Metadata = {
  title: "QueryPie DAC: Database Access Controller | QueryPie AI",
  description: "QueryPie DACnはデータ保護のために作られ、様々なクラウドエコシステムにシームレスに接続します。 ",
  alternates: {
    canonical: "/platforms/acp/database-access-controller",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DatabaseAccessControllerPage() {
  return (
    <AcpStaticPageShell {...componentNameDebugProps("DatabaseAccessControllerPage")}>
      <SiteHeader />
      <AcpHeroSection background="dac" media={{"kind": "youtube", "src": "https://www.youtube.com/embed/SoACnHF6s3Y?si=1DSZJfMYeXjeT0kU"}} mediaTitle="Database Access Controller">
        <AcpHeroCopy>
          <AcpHeroEyebrow>QueryPie ACP</AcpHeroEyebrow>
          <AcpHeroTitle>Database Access Controller</AcpHeroTitle>
          <AcpHeroLead>
            QueryPie DAC は、クラウド環境とオンプレミス環境の両方をサポートするデータ保護およびアクセス制御ソリューションです。
            <br />
            どこにいても、データセキュリティとアクセス制御を完全に管理できるQueryPie DAC から始めてみませんか？
          </AcpHeroLead>
        </AcpHeroCopy>
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
      <AcpWorksSection imageSrc="/platforms/acp/database-access-controller/works.png" imageAlt="QueryPie DACの仕組み" imageWidth={1000} imageHeight={400}>
        <AcpSectionIntro>
          <AcpSectionHeading>QueryPie DACの仕組み</AcpSectionHeading>
          <AcpSectionLeadGroup>
            <p>
              QueryPieは、お客様の固有の環境に合わせて柔軟なワークスペースを提供し、セキュリティを一層強化します。
            </p>
            <p>
              ブラウザベースのWeb SQLエディタにより、データ漏洩制御を簡単に管理できるだけでなく、
            </p>
            <p>
              サードパーティーツールの使用を可能にするエージェントまたはエージェントレス(URLプロキシ)方式をサポートします。
            </p>
          </AcpSectionLeadGroup>
        </AcpSectionIntro>
      </AcpWorksSection>
      <AcpWorksSection imageSrc="/platforms/acp/database-access-controller/analyzer.png" imageAlt="QueryPie Universal Analyzer" imageWidth={1000} imageHeight={420}>
        <AcpSectionIntro>
          <AcpSectionHeading>{"QueryPie ユニバーサルアナライザー:\nあらゆるクエリ言語に対応"}</AcpSectionHeading>
          <AcpSectionLeadGroup>
            <p>QueryPie ならではの武器、クエリーアナライザーによって様々なデータソース間の差違を解消します。</p>
            <p>いかなる複雑なクエリもQueryPie アナライザーが分析して解析し、シンプルな形式に変換します。</p>
          </AcpSectionLeadGroup>
        </AcpSectionIntro>
      </AcpWorksSection>
      <AcpWorksSection imageSrc="/platforms/acp/database-access-controller/easy-use-jp.png" imageAlt="簡単インストール、簡単操作" imageWidth={1000} imageHeight={440}>
        <AcpSectionIntro>
          <AcpSectionHeading>簡単インストール、簡単操作</AcpSectionHeading>
          <AcpSectionLeadGroup>
            <p>
              QueryPie はクラウドネイティブ技術とWebベースのインターフェースを組み合わせ、さまざまなオペレーティングシステムで簡単にインストールおよび運用できるよう設計されています。Docker パッケージングにより容易に配布可能で、オンプレミスのセキュリティとSaaS のような利便性の高いアップデート方式を組み合わせたハイブリッドアプローチをサポートしています。この設計により、金融、医療、公共部門などでのコンプライアンスを支援するとともに、問題が発生した際には即座にロールバックする機能も提供します。QueryPie は、SaaS の利便性とオンプレミスソリューションの強固なセキュリティを融合させることで、顧客に大きな価値を提供することを目指しています。
            </p>
          </AcpSectionLeadGroup>
        </AcpSectionIntro>
      </AcpWorksSection>
      <AcpSplitFeatureSection gray imageSrc="/platforms/acp/database-access-controller/sql-editor.png" imageAlt="ユーザーフレンドリーなWeb SQL エディタ" imageWidth={620} imageHeight={530} imageWidthClassName="lg:basis-[51.7%]">
        <AcpSplitFeatureTitle>{"ユーザーフレンドリーな\nWeb SQLエディタ"}</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>もう、IDE を個別に用意する必要ありません！ QueryPie のWeb SQL エディタを使用すれば、使用するOS に関係なく、ブラウザ上で簡単にクエリの実行、インポート、エクスポート、およびさまざまなタスクを実行できます。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection reverse imageSrc="/platforms/acp/database-access-controller/third-party-tools.png" imageAlt="サードパーティー ツールのための安全なプロキシ接続をサポート" imageWidth={600} imageHeight={380} imageWidthClassName="lg:basis-1/2">
        <AcpSplitFeatureTitle>{"サードパーティー ツールのための\n安全なプロキシ接続をサポート"}</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>これまで利用していたツールをそのままデータベースに接続する必要がある場合のために、QueryPie は安全なプロキシサーバでのアプローチをサポートします。 エージェント及びエージェントレス方式をすべてサポートし、QueryPie と同様の強力なアクセス制御とポリシーをご利用いただけます。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection gray imageSrc="/platforms/acp/database-access-controller/db-control.png" imageAlt="データベースを統合した構文制御支援" imageWidth={640} imageHeight={760}>
        <AcpSplitFeatureTitle>{"データベースを\n統合した構文制御支援"}</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>標準SQLに基づいてデータベースを統合した構文制御が可能です。RDBMS、データウェアハウス、NoSQL などを一貫した権限ポリシーで管理し、Redis は200以上のコマンドを、MongoDB Shell は標準SQL に対応して構文統制をサポートします。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection reverse imageSrc="/platforms/acp/database-access-controller/data-masking.png" imageAlt="重要データのマスキング処理と保護" imageWidth={640} imageHeight={660}>
        <AcpSplitFeatureTitle>重要データのマスキング処理と保護</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>事前定義されたパターンと正規形式で機密情報データのマスキング処理をサポートします。 カスタムパターン設定を通じて柔軟なマスキングポリシーを構成し、ビュー作成および関数使用時にデータを遮断し、ポリシーに従って個人情報を安全に保護します。 単一カラムだけでなく、JSON 形式のデータも処理します。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection gray imageSrc="/platforms/acp/database-access-controller/ledger.png" imageAlt="元帳テーブルのアクセス制御" imageWidth={640} imageHeight={670}>
        <AcpSplitFeatureTitle>元帳テーブルのアクセス制御</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>重要なテーブルへの変更を承認するワークフローを備えており、データを簡単に管理できます。 元帳テーブルポリシー(Ledger Table Policy) に検出された場合、事前定義された承認プロセスが自動的に行われます。 変更前後の結果を追跡し、スムーズな構成管理を実現します！</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection reverse last imageSrc="/platforms/acp/database-access-controller/workflow.png" imageAlt="権限付与とSQL承認のプロセスの自動化" imageWidth={620} imageHeight={670} imageWidthClassName="lg:basis-[51.7%]">
        <AcpSplitFeatureTitle>{"権限付与とSQL承認の\nプロセスの自動化"}</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>管理者が承認プロセスを設定できるカスタマイズ可能なテンプレートを使用して、ワークフローをシンプルにします！権限のないユーザーがデータベースへのアクセスや変更を要求した場合、自動化されたワークフローがすべてをスムーズに実行されるようにします。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpFaqSection>
        <AcpFaqItem question="QueryPie はSaaS サービスですか？">
          <p>
            現在、QueryPie はクラウドとオンプレミス環境の両方でインストール可能なソリューションとして提供され、今後SaaS ベースのサービスのご提供を計画しています。これにより、お客様は既存のインフラストラクチャとシームレスに統合され、SaaS への移行サポートを受けることができます。
          </p>
        </AcpFaqItem>
        <AcpFaqItem question="QueryPie はユーザー認証をどのように処理しますか？">
          <p>
            QueryPieは、SAMLベースのSSO、多要素認証(MFA)、LDAP 統合をサポートし、ユーザーがシステムに安全にアクセスできるようにします。集中管理機能により、管理者はシステム間の権限を効率的に処理でき、セキュリティを強化し、ユーザーアクセスに対する統制を向上させることができます。
          </p>
        </AcpFaqItem>
        <AcpFaqItem question="QueryPie はどのようなセキュリティ標準を遵守していますか？">
          <p>
            QueryPie はISO/IEC 42001、ISO27001、SOC2、GDPR、CSA-STAR といったグローバルセキュリティ標準を遵守するように設計され、データセキュリティと規制要件を満たしています。これにより、組織はアクセス管理機能を強化し、コンプライアンス要件を満たし、監査準備を行うことができます。
          </p>
        </AcpFaqItem>
        <AcpFaqItem question="QueryPie は既存のセキュリティソリューションと互換性がありますか？">
          <p>
            QueryPie はAPI を通じて様々な外部セキュリティソリューションと円滑に統合されるように設計されています。これにより、既存のインフラストラクチャとの互換性が保証され、既存のセキュリティ フレームワークが強化され、追加のセキュリティ ソリューションなしで効率的な運用が可能になります。
          </p>
        </AcpFaqItem>
      </AcpFaqSection>
      <AcpPageCta>
        <AcpPageCtaTitle>まずは小さく、失敗しないAXを始めよう</AcpPageCtaTitle>
        <AcpPageCtaDescription>
          簡単サインアップで、14日間の無料トライアルをお試しください
        </AcpPageCtaDescription>
        <AcpPageCtaLink>無料で試してみる</AcpPageCtaLink>
      </AcpPageCta>
      <SiteFooter />
    </AcpStaticPageShell>
  );
}
