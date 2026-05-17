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
  AcpSplitFeatureBody,
  AcpSplitFeatureSection,
  AcpSplitFeatureTitle,
  AcpStaticPageShell,
  AcpWorksSection,
} from "@/components/sections/acp/static-page";

export const metadata: Metadata = {
  title: "QueryPie SAC: System Access Controller | QueryPie AI",
  description: "QueryPie SAC は、AWS、GCP、Azure上のクラウドインスタンスを保護するように設計されており、オンプレミス環境にも対応しています。",
  alternates: {
    canonical: "/platforms/acp/system-access-controller",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SystemAccessControllerPage() {
  return (
    <AcpStaticPageShell>
      <SiteHeader />
      <AcpHeroSection background="sac" media={{"kind": "youtube", "src": "https://www.youtube.com/embed/h1jlfwQFaiA?si=qvk_Mk0ryxXhwX51"}} mediaTitle="System Access Controller">
        <AcpHeroEyebrow>QueryPie ACP</AcpHeroEyebrow>
        <AcpHeroTitle>System Access Controller</AcpHeroTitle>
        <AcpHeroLeadGroup>
          <p>
            QueryPie SAC は、クラウド環境とオンプレミスの複数のシステム、サーバー、ネットワーク機器など、
          </p>
          <p>
            SSH 接続が可能なすべてのリソースの権限を統合管理することができます。管理者は、ユーザー コマンドを監視し、
          </p>
          <p>
            コマンドが実行されたセッションを再生することで、すべてのプラットフォームでセキュリティと監視を強化できます。
          </p>
        </AcpHeroLeadGroup>
      </AcpHeroSection>
      <AcpFeatureSection>
        <AcpSectionIntro>
          <AcpSectionHeading>SACの注目機能</AcpSectionHeading>
          <AcpSectionLeadGroup>
            <p>
              QueryPie SAC はタグベースの権限設定とウェブターミナルを通じてサーバー管理をシンプルにし、
            </p>
            <p>
              エージェントベースのプロキシアクセスと SSH / SFTP の統合管理に対応しており、シームレスな接続が可能です。
            </p>
          </AcpSectionLeadGroup>
        </AcpSectionIntro>
        <AcpFeatureGrid>
          <AcpFeatureCard icon="/platforms/acp/icons/server.svg">
            <AcpFeatureCardTitle>効率的なサーバー管理</AcpFeatureCardTitle>
            <AcpFeatureCardDescription>
              サーバーグループ機能とタグフィルタリングを活用することで、サーバーを簡単かつ迅速に管理できます。また、中央で権限やポリシーを効率的に運用し、セキュリティおよびアクセス制御を最適化します。これにより、管理者は複雑なサーバー環境を手軽に管理できるようになります。
            </AcpFeatureCardDescription>
          </AcpFeatureCard>
          <AcpFeatureCard icon="/platforms/acp/icons/terminal.svg">
            <AcpFeatureCardTitle>Webターミナル対応</AcpFeatureCardTitle>
            <AcpFeatureCardDescription>
              Web ブラウザ内でサーバー接続や作業実行が可能な Web ターミナルおよび Web SFTP を提供することで、一貫したアクセス環境を実現し、すべての作業に対して効率的な権限制御を可能にします。これにより、ユーザーは専用のクライアントソフトを使用することなく、サーバー管理や作業をスムーズに行うことができます。
            </AcpFeatureCardDescription>
          </AcpFeatureCard>
          <AcpFeatureCard icon="/platforms/acp/icons/server-group.svg">
            <AcpFeatureCardTitle>サーバーグループによる 簡単な権限管理</AcpFeatureCardTitle>
            <AcpFeatureCardDescription>
              サーバーグループを通じて権限を付与し、ポリシーを管理し、アクセス時間などの詳細設定を継承してサーバーおよびユーザーレベルで柔軟に管理できます。 これにより、セキュリティが強化され、管理者の業務効率がさらに高まります。
            </AcpFeatureCardDescription>
          </AcpFeatureCard>
          <AcpFeatureCard icon="/platforms/acp/icons/proxy.svg">
            <AcpFeatureCardTitle>プロキシアクセスのためのエージェントサポート</AcpFeatureCardTitle>
            <AcpFeatureCardDescription>
              QueryPie は、ユーザーが利用している既存のプログラムを通じて、様々なシステムとサーバー機器に安全に接続できるように、ユーザーにデスクトップエージェントを提供します。
            </AcpFeatureCardDescription>
          </AcpFeatureCard>
          <AcpFeatureCard icon="/platforms/acp/icons/network.svg">
            <AcpFeatureCardTitle>SSHおよびSFTPアクセス管理</AcpFeatureCardTitle>
            <AcpFeatureCardDescription>
              SSH 経由でアクセス可能なクラウドおよびオンプレミス環境のシステムやサーバーを含む、すべてのリソースの権限を一元管理します。
            </AcpFeatureCardDescription>
          </AcpFeatureCard>
        </AcpFeatureGrid>
      </AcpFeatureSection>
      <AcpWorksSection imageSrc="/platforms/acp/system-access-controller/works.png" imageAlt="QueryPie SACの仕組み">
        <AcpSectionIntro>
          <AcpSectionHeading>QueryPie SACの仕組み</AcpSectionHeading>
          <AcpSectionLeadGroup>
            <p>
              QueryPie SAC は、Web ターミナルおよびWeb SFTP を活用してユーザーを接続することで、アクセス制御と監査作業をシンプル化します。
            </p>
            <p>
              ユーザーはQueryPie プロキシサーバーを介してサーバーに簡単に接続でき、セキュリティプロトコルを確保しながらスムーズにアクセスすることが可能です。
            </p>
            <p>
              また、QueryPie SAC アプリは、すべての操作をモニタリングし、サーバーとのやり取りを強固に監視・制御します。
            </p>
          </AcpSectionLeadGroup>
        </AcpSectionIntro>
      </AcpWorksSection>
      <AcpWorksSection imageSrc="/platforms/acp/system-access-controller/easy-use-jp.png" imageAlt="簡単インストール、簡単操作" imageWidth={1000} imageHeight={440}>
        <AcpSectionIntro>
          <AcpSectionHeading>簡単インストール、簡単操作</AcpSectionHeading>
          <AcpSectionLeadGroup>
            <p>QueryPie はクラウドネイティブ技術と Web ベースのインターフェースを組み合わせ、さまざまなオペレーティングシステムで簡単にインストールおよび運用できるよう設計されています。Docker パッケージングにより容易に配布可能で、オンプレミスのセキュリティとSaaS のような利便性の高いアップデート方式を組み合わせたハイブリッドアプローチをサポートしています。この設計により、金融、医療、公共部門などでのコンプライアンスを支援するとともに、問題が発生した際には即座にロールバックする機能も提供します。QueryPie は、SaaS の利便性とオンプレミスソリューションの強固なセキュリティを融合させることで、顧客に大きな価値を提供することを目指しています。</p>
          </AcpSectionLeadGroup>
        </AcpSectionIntro>
      </AcpWorksSection>
      <AcpSplitFeatureSection gray imageSrc="/platforms/acp/system-access-controller/web-client.png" imageAlt="Web Terminal & SFTP Client" imageWidth={640} imageHeight={680}>
        <AcpSplitFeatureTitle>{"Webターミナル &\nSFTPクライアント"}</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>Web ターミナルと SFTPクライアントを使用することで、サーバーへの簡単な接続が可能です。コマンドを実行したりファイルを転送したりできるため、オペレーティングシステムを問わず、ブラウザ上で迅速に作業を完了することができます。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection reverse imageSrc="/platforms/acp/system-access-controller/access-control.png" imageAlt="Command Right Access Control & Management" imageWidth={600} imageHeight={600} imageWidthClassName="lg:basis-1/2">
        <AcpSplitFeatureTitle>コマンド権限のアクセス制御と管理</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>サーバーグループまたは個別のサーバーに対して、危険レベルに応じたSSH コマンドの権限設定および管理が可能です。ブロックされたコマンドは通知され、疑わしいアクティビティを迅速に検出する手助けとなります。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection gray imageSrc="/platforms/acp/system-access-controller/tag-based-management.png" imageAlt="Tag-based resource management functionality" imageWidth={640} imageHeight={570}>
        <AcpSplitFeatureTitle>タグベースのリソース管理機能</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>個々のサーバーにタグを付け、それらをグループ化して、権限をすばやく適用できます。 クラウド サービス プロバイダーと同期する際、タグが自動的に同期され、クラウド環境でリソースを簡単に管理できます。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection reverse imageSrc="/platforms/acp/system-access-controller/session-replay.png" imageAlt="Real-time Monitoring & Session Replay" imageWidth={600} imageHeight={530} imageWidthClassName="lg:basis-1/2">
        <AcpSplitFeatureTitle>{"リアルタイムモニタリング &\nセッションリプレイ"}</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>リアルタイムでのモニタリングとセッションの再生により、ユーザーの活動を同じ画面で簡単に確認することができます。また、異常な兆候が検出された場合には、即座にセッションを終了し、リソースを安全に保護することが可能です。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection gray imageSrc="/platforms/acp/system-access-controller/iac.png" imageAlt="IaC-based Access Control" imageWidth={620} imageHeight={480} imageWidthClassName="lg:basis-[51.7%]">
        <AcpSplitFeatureTitle>IaC ベースのアクセス制御</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>ユーザーフレンドリーなGUI とIaC の編集機能により、IAMポリシーを簡単に管理することができます。これにより、一元管理されたポリシーを使用して、リソースや特定のアイテムへのアクセス権を迅速に制御することが可能です。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection reverse last imageSrc="/platforms/acp/system-access-controller/protocol.png" imageAlt="Support for Various Protocols" imageWidth={600} imageHeight={540} imageWidthClassName="lg:basis-1/2">
        <AcpSplitFeatureTitle>様々なプロトコルをサポート</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>SSH、SFTP、RDP、VNC などを使用して安全に接続します。これらのプロトコルは、柔軟なリモートアクセス、ファイル転送、リモートデスクトップ操作をサポートし、セキュリティは徹底的に維持されます。</p>
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
            QueryPie はISO27001、SOC2、GDPR、CSA-STAR といったグローバルセキュリティ標準を遵守するように設計され、データセキュリティと規制要件を満たしています。これにより、組織はアクセス管理機能を強化し、コンプライアンス要件を満たし、監査準備を行うことができます。
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
