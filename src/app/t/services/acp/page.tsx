import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AcpFeatureBrowser, AcpFeatureCategory, AcpFeatureItem } from "@/components/sections/acp-feature-browser";
import {
  AcpEasyUseImage,
  AcpEasyUseInner,
  AcpEasyUseSection,
  AcpFeatureInner,
  AcpFeatureIntro,
  AcpFeatureSection,
  AcpHeroCopy,
  AcpHeroInner,
  AcpHeroLead,
  AcpHeroSection,
  AcpHeroTitle,
  AcpHeroVideo,
  AcpIntegrationsBody,
  AcpIntegrationsImage,
  AcpIntegrationsInner,
  AcpIntegrationsLink,
  AcpIntegrationsSection,
  AcpIntegrationsTitle,
  AcpSectionBody,
  AcpSectionTitle,
  AcpServicePageShell,
} from "@/components/sections/acp-service-page";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { CtaActions, CtaContent, CtaCopy, CtaDescription, CtaTitle, SimpleCtaSection } from "@/components/sections/simple-cta-section";
import { BrandGradientCtaButton } from "@/components/ui/brand-gradient-cta-button";

export const metadata: Metadata = {
  title: "QueryPie アクセス制御プラットフォーム (ACP) | QueryPie AI",
  description:
    "ゼロトラスト型の統合アクセス制御により、データベース、サーバー、Kubernetes、Webアプリケーション、ワークフロー全体を一元管理する QueryPie ACP のプレビューです。",
  alternates: {
    canonical: "/t/services/acp",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AcpServicePreviewPage() {
  return (
    <AcpServicePageShell>
      <SiteHeader />

      <AcpHeroSection>
        <AcpHeroInner>
          <RevealOnScroll>
            <AcpHeroCopy>
              <AcpHeroTitle>QueryPie アクセス制御プラットフォーム (ACP)</AcpHeroTitle>
              <AcpHeroLead>
                アクセス制御プラットフォームはデータベースとインフラ全体にわたる包括的なアクセス管理を提供するプラットフォームです。
                <br />
                AIエージェントによるデータベース接続やインフラへのアクセスを最適化し、複雑なインフラをAIエージェントがアクセス可能なエコシステムに転換します。
              </AcpHeroLead>
            </AcpHeroCopy>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120} className="w-full">
            <AcpHeroVideo />
          </RevealOnScroll>
        </AcpHeroInner>
      </AcpHeroSection>

      <AcpEasyUseSection>
        <AcpEasyUseInner>
          <RevealOnScroll>
            <div className="flex flex-col gap-[20px]">
              <AcpSectionTitle>簡単インストール、簡単使用</AcpSectionTitle>
              <AcpSectionBody>
                QueryPie ACPは、クラウド技術とWebベースのインターフェースを組み合わせ、あらゆるオペレーティングシステムで簡単に導入できます。
                <br />
                Dockerパッケージングによりハイブリッド導入も可能で、オンプレミスのセキュリティとSaaS並みの利便性と自動更新を実装しています。
              </AcpSectionBody>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120}>
            <AcpEasyUseImage />
          </RevealOnScroll>
        </AcpEasyUseInner>
      </AcpEasyUseSection>

      <AcpFeatureSection>
        <AcpFeatureInner>
          <RevealOnScroll>
            <AcpFeatureIntro>
              <AcpSectionTitle>QueryPie ACPができること</AcpSectionTitle>
              <AcpSectionBody>
                データベース、システム、Kubernetes、Web、ワークフロー全体にまたがる代表機能をカテゴリごとに確認できます。
              </AcpSectionBody>
            </AcpFeatureIntro>
          </RevealOnScroll>

          <RevealOnScroll delayMs={80}>
            <AcpFeatureBrowser>
              <AcpFeatureCategory label="データベースアクセス制御">
                <AcpFeatureItem
                  title="エージェントレスクラウド"
                  imageSrc="/services/acp/db-agentless-cloud.gif"
                  learnMoreHref="https://docs.querypie.com/ja/administrator-manual/databases/connection-management/cloud-providers"
                >
                  DB同期 AWS、GCP、Azureからデータ資産を個別設定なしで自動同期。
                  <br />
                  管理者は運用を効率化し、本当に重要なことに集中できる自動化されたエージェントレス統合を取得します。
                </AcpFeatureItem>
                <AcpFeatureItem
                  title="汎用DB権限制御"
                  imageSrc="/services/acp/db-query-analyzer.gif"
                  learnMoreHref="https://docs.querypie.com/ja/administrator-manual/databases/db-access-control/privilege-type"
                >
                  QueryPieのクエリアナライザがあらゆるプラットフォームの複雑なクエリを解釈し、統一フォーマットに変換します。
                  <br />
                  汎用的な互換性により、すべてのデータソースに一貫したアクセス制御ポリシーを適用します。
                </AcpFeatureItem>
                <AcpFeatureItem
                  title="機密データマスキング"
                  imageSrc="/services/acp/db-data-masking.gif"
                  learnMoreHref="https://docs.querypie.com/ja/administrator-manual/databases/policies/data-masking"
                >
                  プリセットのマスキングパターンとカスタムルールを使用して機密データと個人データを保護し、未承認ユーザーが重要データにアクセスできないことを保証します。
                  <br />
                  組織全体で安全なアクセスを可能にしながら、コンプライアンスとデータプライバシーを維持します。
                </AcpFeatureItem>
                <AcpFeatureItem
                  title="ユーザーフレンドリーなWeb SQLエディター"
                  imageSrc="/services/acp/db-web-sql-editor.gif"
                  learnMoreHref="https://docs.querypie.com/ja/user-manual/database-access-control/connecting-with-web-sql-editor"
                >
                  Web SQLエディターにより、使用するオペレーティングシステムに関係なく、ブラウザ上で直接クエリの実行、インポート、エクスポート、その他のさまざまなタスクを簡単に実行できます。
                </AcpFeatureItem>
              </AcpFeatureCategory>

              <AcpFeatureCategory label="システムアクセス制御">
                <AcpFeatureItem
                  title="エージェントレスクラウド"
                  imageSrc="/services/acp/system-agentless-cloud.gif"
                  learnMoreHref="https://docs.querypie.com/ja/administrator-manual/servers/connection-management/cloud-providers"
                >
                  複数のクラウドプラットフォーム全体でインフラを自動同期・管理します。
                  <br />
                  自動スケーリングリソースを含むすべてのインフラ資産をシームレスに処理して、重要な業務に集中することを可能にします。
                </AcpFeatureItem>
                <AcpFeatureItem
                  title="コードとしてのシステムアクセスポリシー"
                  imageSrc="/services/acp/system-policy-as-code.gif"
                  learnMoreHref="https://docs.querypie.com/ja/administrator-manual/servers/server-access-control/policies"
                >
                  YAMLベースのアクセスポリシーがユーザーのシステムアクセスのタイミング、場所、方法を制御します。
                  <br />
                  RBACが複数のポリシーを組み合わせ、インフラ管理を簡素化。拡張可能で監査可能なアクセス制御のためのInfrastructure as Codeアプローチです。
                </AcpFeatureItem>
                <AcpFeatureItem
                  title="Webターミナル & SFTPクライアント"
                  imageSrc="/services/acp/system-web-terminal-sftp.gif"
                  learnMoreHref="https://docs.querypie.com/ja/user-manual/server-access-control/using-web-terminal"
                >
                  Webブラウザインターフェースから直接サーバーにアクセスし、コマンドを実行できます。
                  <br />
                  追加ソフトウェアのインストールなしに内蔵SFTPクライアントを使用してファイルを転送できます。
                  <br />
                  クロスプラットフォーム互換性により、オペレーティングシステムに関係なくアクセスを保証します。
                </AcpFeatureItem>
                <AcpFeatureItem
                  title="リアルタイム監視 & セッション再生"
                  imageSrc="/services/acp/system-session-replay.gif"
                  learnMoreHref="https://docs.querypie.com/ja/administrator-manual/audit/server-logs/session-logs"
                >
                  すべてのユーザーインタラクションを捉えて、包括的な監査証跡を提供します。
                  <br />
                  運用中断なしにセキュリティ分析とコンプライアンスレビューのためのセッションを再生し、すべてのアクティビティを完全に可視化して安全なサーバー環境を構築します。
                </AcpFeatureItem>
              </AcpFeatureCategory>

              <AcpFeatureCategory label="Kubernetesアクセス制御">
                <AcpFeatureItem
                  title="簡単なKubernetes登録"
                  imageSrc="/services/acp/kubernetes-easy-registration.gif"
                  learnMoreHref="https://docs.querypie.com/ja/administrator-manual/kubernetes/connection-management/clusters/manually-registering-kubernetes-clusters"
                >
                  シングルスクリプトがクレデンシャルを自動収集し、どこにあるKubernetesクラスターでも接続します。
                  <br />
                  オンプレミスとクラウド環境全体でのシームレスな統合をサポートし、クラウドプラットフォームクラスターの自動同期も可能です。
                </AcpFeatureItem>
                <AcpFeatureItem
                  title="マルチK8S環境での統合RBAC"
                  imageSrc="/services/acp/kubernetes-unified-rbac.gif"
                  learnMoreHref="https://docs.querypie.com/ja/administrator-manual/kubernetes/k8s-access-control/policies/setting-kubernetes-policies"
                >
                  クラスターごとの個別RBAC設定なしに単一コンソールから権限を管理できます。
                  <br />
                  ワイルドカードを使用して複数環境に同ポリシーを適用し、効率的な制御を実現しています。
                  <br />
                  複雑さを排除し、管理オーバーヘッドを大幅に削減できます。
                </AcpFeatureItem>
                <AcpFeatureItem
                  title="Kubernetes API履歴ログ"
                  imageSrc="/services/acp/kubernetes-api-history.gif"
                  learnMoreHref="https://docs.querypie.com/ja/administrator-manual/audit/kubernetes-logs/request-audit"
                >
                  クラスター全体のすべてのK8s APIリクエストを記録し、重要なアクションのみに焦点を当てます。
                  <br />
                  明確で焦点を絞った監査証跡が混乱を招くKubernetesログを置き換え、可視性を向上させます。
                  <br />
                  複雑さを削減して重要な操作を効率的に追跡できます。
                </AcpFeatureItem>
                <AcpFeatureItem
                  title="ライブコンテナセッション記録"
                  imageSrc="/services/acp/kubernetes-live-session-recording.gif"
                  learnMoreHref="https://docs.querypie.com/ja/administrator-manual/audit/kubernetes-logs/pod-session-recordings"
                >
                  コンテナ内のすべてのユーザーアクティビティを完全な再生機能付きでキャプチャします。
                  <br />
                  Pod接続後のアクションを監視・レビューし、包括的な監督を実現します。
                  <br />
                  コンテナ操作を完全に可視化して制御します。
                </AcpFeatureItem>
              </AcpFeatureCategory>

              <AcpFeatureCategory label="Webアクセス制御">
                <AcpFeatureItem
                  title="一元化されたWebアプリケーション管理"
                  imageSrc="/services/acp/web-centralized-management.gif"
                  learnMoreHref="https://docs.querypie.com/ja/user-manual/web-access-control/accessing-web-applications-websites"
                >
                  統合WebプロキシとChrome拡張機能を通じて、AIツール、SaaSプラットフォーム、社内アプリなどすべてのWebアプリケーションを管理します。
                  <br />
                  GUIコンソールとプラットフォームの統一されたガバナンスにより、セキュリティの死角を排除します。
                </AcpFeatureItem>
                <AcpFeatureItem
                  title="ジャストインタイム（JIT）権限制御"
                  imageSrc="/services/acp/web-jit.gif"
                  learnMoreHref="https://docs.querypie.com/ja/administrator-manual/web-apps/connection-management/web-app-configurations"
                >
                  内蔵ワークフローを通じて一時的なWebアプリケーションアクセスを要求・許可します。
                  <br />
                  SaaSと社内アプリケーションへの時間制限付きアクセスを簡単に管理し、包括的な制御でアプリのセキュリティを強化します。
                </AcpFeatureItem>
                <AcpFeatureItem
                  title="動的Webアプリケーション透かし"
                  imageSrc="/services/acp/web-watermark.gif"
                  learnMoreHref="https://docs.querypie.com/ja/administrator-manual/web-apps/connection-management/web-app-configurations"
                >
                  制御されたWebアプリケーション画面に動的透かしを適用しています。
                  <br />
                  可視化された説明責任を維持することでエンドユーザーのセキュリティ体制を強化し、持続的なユーザーIDオーバーレイで不正な画面共有とデータ漏洩を防止します。
                </AcpFeatureItem>
                <AcpFeatureItem
                  title="タイムラインベースブラウザ監視"
                  imageSrc="/services/acp/web-timeline-monitoring.gif"
                  learnMoreHref="https://docs.querypie.com/ja/administrator-manual/audit/web-app-logs/user-activity-recordings"
                >
                  タイムラインビューと自動スクリーンショットにより、アプリ全体のアクションをキャプチャできます。
                  <br />
                  リアルタイムインタラクションを監視してセキュリティ異常を瞬時に特定し、すべてのアプリケーション全体で包括的な保護を保証します。
                </AcpFeatureItem>
              </AcpFeatureCategory>

              <AcpFeatureCategory label="ワークフロー & 統合">
                <AcpFeatureItem
                  title="アイデンティティプロバイダ（IdP）統合"
                  imageSrc="/services/acp/workflow-idp.gif"
                  learnMoreHref="https://docs.querypie.com/ja/administrator-manual/general/user-management/authentication"
                >
                  SAML SSOとSCIMプロトコルを通じてOktaやAD/LDAPなどのIdPを接続できます。
                  <br />
                  一元制御によりユーザー管理とライフサイクルプロセスを効率化し、統一認証とアクセス制御により組織セキュリティを強化しています。
                </AcpFeatureItem>
                <AcpFeatureItem
                  title="内蔵アクセス要求ワークフロー"
                  imageSrc="/services/acp/workflow-request-approval.gif"
                  learnMoreHref="https://docs.querypie.com/ja/user-manual/workflow"
                >
                  内蔵された要求・承認ワークフローによりジャストインタイムアクセス管理を効率化します。
                  <br />
                  承認者がSlackを通じて直接決定を行うことで応答時間を短縮し、効果的なアクセス制御と承認遅延の削減を実現します。
                </AcpFeatureItem>
                <AcpFeatureItem
                  title="シークレットストア統合"
                  imageSrc="/services/acp/workflow-secret-store.gif"
                  learnMoreHref="https://docs.querypie.com/ja/administrator-manual/general/system/integrations/integrating-with-secret-store"
                >
                  HashiCorp Vaultを統合し、既存のシークレットストアから直接クレデンシャルを管理します。
                  <br />
                  許可された操作やワークフローが、安全にストレージやデータベース、セキュリティインフラを完全に制御できるよう、効率化されたクレデンシャル管理を実現します。
                </AcpFeatureItem>
                <AcpFeatureItem
                  title="簡単なログストリーミング"
                  imageSrc="/services/acp/workflow-log-streaming.gif"
                  learnMoreHref="https://docs.querypie.com/ja/administrator-manual/general/system/integrations/integrating-with-syslog"
                >
                  簡単な設定により一元監視へのセキュリティデータストリーミングを実現します。
                  <br />
                  リアルタイムでログを関連付けしてインフラ全体の脅威を特定し、包括的な監視とアラートにより新たな脅威に対応します。
                </AcpFeatureItem>
              </AcpFeatureCategory>
            </AcpFeatureBrowser>
          </RevealOnScroll>
        </AcpFeatureInner>
      </AcpFeatureSection>

      <AcpIntegrationsSection>
        <AcpIntegrationsInner>
          <RevealOnScroll>
            <div className="flex flex-col gap-[20px]">
              <AcpIntegrationsTitle>
                一つのプラットフォーム、
                <br />
                すべてのインフラ
              </AcpIntegrationsTitle>
              <AcpIntegrationsBody>
                データベース、サーバー、Kubernetes、Webアプリケーション、アイデンティティプロバイダ、セキュリティツールなど50以上のシステムとシームレスに統合し、インフラエコシステム全体で統一された権限制御を実現しています。
              </AcpIntegrationsBody>
              <AcpIntegrationsLink href="https://www.querypie.com/ja/solutions/acp/integrations">
                利用可能なACP統合機能をすべて見る &gt;
              </AcpIntegrationsLink>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120}>
            <AcpIntegrationsImage />
          </RevealOnScroll>
        </AcpIntegrationsInner>
      </AcpIntegrationsSection>

      <SimpleCtaSection>
        <RevealOnScroll>
          <CtaContent className="gap-0">
            <CtaCopy>
              <CtaTitle>まずは小さく、失敗しないAXを始めよう</CtaTitle>
              <CtaDescription>簡単サインアップで、14日間の無料トライアルをお試しください</CtaDescription>
              <CtaActions className="mt-[40px]">
                <BrandGradientCtaButton href="https://app.querypie.com/">無料で試してみる</BrandGradientCtaButton>
              </CtaActions>
            </CtaCopy>
          </CtaContent>
        </RevealOnScroll>
      </SimpleCtaSection>

      <SiteFooter />
    </AcpServicePageShell>
  );
}
