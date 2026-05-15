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
  title: "QueryPie SAC: System Access Controller | QueryPie AI",
  description: "QueryPie SAC は、AWS、GCP、Azure上のクラウドインスタンスを保護するように設計されており、オンプレミス環境にも対応しています。",
  alternates: {
    canonical: "/t/platforms/acp/system-access-controller",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SystemAccessControllerPage() {
  return (
    <AcpStaticPageShell>
      <SiteHeader />
      <AcpHeroSection media={{"kind": "youtube", "src": "https://www.youtube.com/embed/h1jlfwQFaiA?si=qvk_Mk0ryxXhwX51"}} mediaTitle="System Access Controller">
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
      <AcpCapabilityGallery>
        <AcpSectionHeading>主な機能</AcpSectionHeading>
        <AcpCapabilityGrid>
          <AcpCapabilityImage src="/platforms/acp/system-access-controller/easy-use-jp.png" alt="easy use jp" />
          <AcpCapabilityImage src="/platforms/acp/system-access-controller/web-client.png" alt="web client" />
          <AcpCapabilityImage src="/platforms/acp/system-access-controller/access-control.png" alt="access control" />
          <AcpCapabilityImage src="/platforms/acp/system-access-controller/tag-based-management.png" alt="tag based management" />
          <AcpCapabilityImage src="/platforms/acp/system-access-controller/session-replay.png" alt="session replay" />
          <AcpCapabilityImage src="/platforms/acp/system-access-controller/iac.png" alt="iac" />
          <AcpCapabilityImage src="/platforms/acp/system-access-controller/protocol.png" alt="protocol" />
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
