import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  AcpEasyUseImage,
  AcpEasyUseInner,
  AcpEasyUseSection,
  AcpFeatureBrowser,
  AcpHeroCopy,
  AcpHeroInner,
  AcpHeroLead,
  AcpHeroSection,
  AcpHeroTitle,
  AcpHeroVideo,
  AcpIntegrationsBody,
  AcpIntegrationsImage,
  AcpIntegrationsInner,
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

type AcpFeatureItem = {
  title: string;
  description: ReactNode;
  imageSrc: string;
  learnMoreHref: string;
};

type AcpFeatureCategory = {
  label: string;
  items: readonly AcpFeatureItem[];
};

const categories: readonly AcpFeatureCategory[] = [
  {
    label: "データベースアクセス制御",
    items: [
      {
        title: "エージェントレスクラウド",
        description:
          "DB同期 AWS、GCP、Azureからデータ資産を個別設定なしで自動同期。 管理者は運用を効率化し、本当に重要なことに集中できる 自動化されたエージェントレス統合を取得します。",
        imageSrc: "/services/acp/db-agentless-cloud.gif",
        learnMoreHref: "https://docs.querypie.com/ja/administrator-manual/databases/connection-management/cloud-providers",
      },
      {
        title: "汎用DB権限制御",
        description:
          "QueryPieのクエリアナライザ があらゆるプラットフォームの複雑なクエリを解釈し、 統一フォーマットに変換します。 汎用的な互換性により、すべてのデータソースに一貫したアクセス制御ポリシーを適用します。",
        imageSrc: "/services/acp/db-query-analyzer.gif",
        learnMoreHref: "https://docs.querypie.com/ja/administrator-manual/databases/db-access-control/privilege-type",
      },
      {
        title: "機密データマスキング",
        description:
          "プリセットのマスキングパターンとカスタムルールを使用して機密データと個人データを保護し、未承認ユーザーが重要データにアクセスできないことを保証します。組織全体で安全なアクセスを可能にしながら、コンプライアンスとデータプライバシーを維持します。",
        imageSrc: "/services/acp/db-data-masking.gif",
        learnMoreHref: "https://docs.querypie.com/ja/administrator-manual/databases/policies/data-masking",
      },
      {
        title: "ユーザーフレンドリーなWeb SQLエディター",
        description:
          "Web SQLエディターにより、使用するオペレーティングシステムに関係なく、ブラウザ上で 直接クエリの実行、インポート、エクスポート、その他のさまざまなタスクを簡単に実行できます。",
        imageSrc: "/services/acp/db-web-sql-editor.gif",
        learnMoreHref: "https://docs.querypie.com/ja/user-manual/database-access-control/connecting-with-web-sql-editor",
      },
    ],
  },
  {
    label: "システムアクセス制御",
    items: [
      {
        title: "エージェントレスクラウド",
        description:
          "複数のクラウドプラットフォーム全体でインフラを自動同期・管理します。自動スケーリングリソースを含むすべてのインフラ資産をシームレスに処理して、 重要な業務に集中することを可能にします。",
        imageSrc: "/services/acp/system-agentless-cloud.gif",
        learnMoreHref: "https://docs.querypie.com/ja/administrator-manual/servers/connection-management/cloud-providers",
      },
      {
        title: "コードとしてのシステムアクセスポリシー",
        description:
          "YAMLベースのアクセスポリシーがユーザー のシステムアクセスのタイミング、場所、方法を制御します。 RBACが複数のポリシーを組み合わせ、インフラ管理を簡素化。 拡張可能で監査可能なアクセス制御のためのインフラストラクチャ・アズ・コード(IaC)アプローチ。",
        imageSrc: "/services/acp/system-policy-as-code.gif",
        learnMoreHref: "https://docs.querypie.com/ja/administrator-manual/servers/server-access-control/policies",
      },
      {
        title: "Webターミナル & SFTPクライアント",
        description:
          "Webブラウザインターフェースから直接サーバーにアクセスしコマンドを実行できます。追加ソフトウェアのインストールなしに内蔵SFTPクライアントを使用してファイルを転送できます。クロスプラットフォーム互換性により、オペレーティングシステムに関係なくアクセスを保証します。",
        imageSrc: "/services/acp/system-web-terminal-sftp.gif",
        learnMoreHref: "https://docs.querypie.com/ja/user-manual/server-access-control/using-web-terminal",
      },
      {
        title: "リアルタイム監視 & セッション再生",
        description:
          "すべてのユーザーインタラクションを捉えて、包括的な監査証跡を提供します。運用中断なしにセキュリティ分析とコンプライアンスレビューのためのセッションを再生し、すべてのアクティビティを完全に可視化して安全なサーバー環境を構築します。",
        imageSrc: "/services/acp/system-session-replay.gif",
        learnMoreHref: "https://docs.querypie.com/ja/administrator-manual/audit/server-logs/session-logs",
      },
    ],
  },
  {
    label: "Kubernetesアクセス制御",
    items: [
      {
        title: "簡単なKubernetes登録",
        description:
          "シングルスクリプトがクレデンシャルを自動収集し、どこにあるKubernetesクラスターでも接続します。オンプレミスとクラウド環境全体でのシームレスな統合をサポートします。 クラウドプラットフォームクラスターの自動同期サポートも含みます。",
        imageSrc: "/services/acp/kubernetes-easy-registration.gif",
        learnMoreHref: "https://docs.querypie.com/ja/administrator-manual/kubernetes/connection-management/clusters/manually-registering-kubernetes-clusters",
      },
      {
        title: "マルチK8S環境での統合RBAC",
        description:
          "クラスターごとの個別RBAC設定なしに単一コンソールから権限を管理できます。ワイルドカードを使用して複数環境に同ポリシーを適用し、効率的な制御を実現しています。複雑さを排除し、管理オーバーヘッドを大幅に削減できます。",
        imageSrc: "/services/acp/kubernetes-unified-rbac.gif",
        learnMoreHref: "https://docs.querypie.com/ja/administrator-manual/kubernetes/k8s-access-control/policies/setting-kubernetes-policies",
      },
      {
        title: "Kubernetes API履歴ログ",
        description:
          "クラスター全体のすべてのK8s APIリクエストを記録し、重要なアクションのみに焦点を当てます。明確で焦点を絞った監査証跡が混乱を招くKubernetesログを置き換え、可視性を向上させます。 複雑さを削減して重要な操作を効率的に追跡できます。",
        imageSrc: "/services/acp/kubernetes-api-history.gif",
        learnMoreHref: "https://docs.querypie.com/ja/administrator-manual/audit/kubernetes-logs/request-audit",
      },
      {
        title: "ライブコンテナセッション記録",
        description:
          "コンテナ内のすべてのユーザーアクティビティを完全な再生機能付きでキャプチャします。 Pod接続後のアクションを監視・レビューし、包括的な監督を実現します。 コンテナ操作を完全に可視化して制御します。",
        imageSrc: "/services/acp/kubernetes-live-session-recording.gif",
        learnMoreHref: "https://docs.querypie.com/ja/administrator-manual/audit/kubernetes-logs/pod-session-recordings",
      },
    ],
  },
  {
    label: "Webアクセス制御",
    items: [
      {
        title: "一元化されたWebアプリケーション管理",
        description:
          "統合WebプロキシとChrome拡張機能を通じて、AIツール、SaaSプラットフォーム、 社内アプリなどすべてのWebアプリケーションを管理します。 GUIコンソールとプラットフォームの統一されたガバナンスにより、セキュリティの死角を排除します。",
        imageSrc: "/services/acp/web-centralized-management.gif",
        learnMoreHref: "https://docs.querypie.com/ja/user-manual/web-access-control/accessing-web-applications-websites",
      },
      {
        title: "ジャストインタイム（JIT）権限制御",
        description:
          "内蔵ワークフローを通じて一時的なWebアプリケーションアクセスを要求・許可します。SaaSと社内アプリケーションへの時間制限付きアクセスを簡単に管理。包括的な制御により、機能制限アプリのセキュリティを強化します。",
        imageSrc: "/services/acp/web-jit.gif",
        learnMoreHref: "https://docs.querypie.com/ja/administrator-manual/web-apps/connection-management/web-app-configurations",
      },
      {
        title: "動的Webアプリケーション透かし",
        description:
          "制御されたWebアプリケーション画面に動的透かしを適用しています。可視的な可視化された説明責任を維持することで、エンドユーザーのセキュリティ体制を強化します。持続的なユーザーIDオーバーレイにより、不正な画面共有とデータ漏洩を防止します。",
        imageSrc: "/services/acp/web-watermark.gif",
        learnMoreHref: "https://docs.querypie.com/ja/administrator-manual/web-apps/connection-management/web-app-configurations",
      },
      {
        title: "タイムラインベースブラウザ監視",
        description:
          "タイムラインビューと自動スクリーンショットにより、アプリ全体のアクションをキャプチャできます。リアルタイムインタラクションを監視し、セキュリティ異常を瞬時に特定し、完全に可視化することで完全な可視性により、すべてのアプリケーション全体で包括的な保護を保証します。",
        imageSrc: "/services/acp/web-timeline-monitoring.gif",
        learnMoreHref: "https://docs.querypie.com/ja/administrator-manual/audit/web-app-logs/user-activity-recordings",
      },
    ],
  },
  {
    label: "ワークフロー & 統合",
    items: [
      {
        title: "アイデンティティプロバイダ （IdP）統合",
        description:
          "SAML SSOとSCIMプロトコルを通じてOktaやAD/LDAPなどのIdPを接続できます。一元制御によりユーザー管理とライフサイクルプロセスを効率化し、統一認証とアクセス制御により組織セキュリティを強化しています。",
        imageSrc: "/services/acp/workflow-idp.gif",
        learnMoreHref: "https://docs.querypie.com/ja/administrator-manual/general/user-management/authentication",
      },
      {
        title: "内蔵アクセス要求ワークフロー",
        description:
          "内蔵された要求・承認ワークフロー によりジャストインタイムアクセス管理を効率化します。承認者がSlackを通じて直接決定を行うことで応答時間を短縮できます。行い、応答時間を短縮。効果的なアクセス制御と承認遅延の削減により、効率的な運用を保証します。",
        imageSrc: "/services/acp/workflow-request-approval.gif",
        learnMoreHref: "https://docs.querypie.com/ja/user-manual/workflow",
      },
      {
        title: "シークレットストア統合",
        description:
          "HashiCorp Vaultを統合し、既存のシークレットストアから直接クレデンシャルを管理します。許可された操作やワークフローが、安全にストレージやデータベース、セキュリティインフラを完全に制御して効率化されたクレデンシャルを管理します。",
        imageSrc: "/services/acp/workflow-secret-store.gif",
        learnMoreHref: "https://docs.querypie.com/ja/administrator-manual/general/system/integrations/integrating-with-secret-store",
      },
      {
        title: "簡単なログストリーミング",
        description:
          "簡単な設定により一元監視へのセキュリティデータストリーミングします。リアルタイムでログを関連付けしてインフラ全体の脅威を特定。包括的な監視とアラートにより新たな脅威に対応します。",
        imageSrc: "/services/acp/workflow-log-streaming.gif",
        learnMoreHref: "https://docs.querypie.com/ja/administrator-manual/general/system/integrations/integrating-with-syslog",
      },
    ],
  },
];

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
                Dockerパッケージングによりハイブリッド導入も可能で、 オンプレミスのセキュリティとSaaS並みの利便性と自動更新を実装しています。
              </AcpSectionBody>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120}>
            <AcpEasyUseImage />
          </RevealOnScroll>
        </AcpEasyUseInner>
      </AcpEasyUseSection>

      <section className="flex justify-center px-6 pb-[80px] lg:px-0">
        <div className="w-full max-w-[1200px]">
          <AcpFeatureBrowser categories={categories} />
        </div>
      </section>

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
              <a
                href="https://www.querypie.com/ja/solutions/acp/integrations"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-[15px] font-normal leading-normal text-[#24292F] underline-offset-4 hover:underline"
              >
                利用可能なACP統合機能をすべて見る &gt;
              </a>
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
