import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  AcpCapabilityGallery,
  AcpFeatureSection,
  AcpHeroSection,
  AcpPageCta,
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

const heroDescription = ["QueryPie SAC は、クラウド環境とオンプレミスの複数のシステム、サーバー、ネットワーク機器など、", "SSH 接続が可能なすべてのリソースの権限を統合管理することができます。管理者は、ユーザー コマンドを監視し、", "コマンドが実行されたセッションを再生することで、すべてのプラットフォームでセキュリティと監視を強化できます。"] as const;

const featureIntro = ["QueryPie SAC はタグベースの権限設定とウェブターミナルを通じてサーバー管理をシンプルにし、", "エージェントベースのプロキシアクセスと SSH / SFTP の統合管理に対応しており、シームレスな接続が可能です。"] as const;

const keyFeatures = [
  {
    "title": "効率的なサーバー管理",
    "description": "サーバーグループ機能とタグフィルタリングを活用することで、サーバーを簡単かつ迅速に管理できます。また、中央で権限やポリシーを効率的に運用し、セキュリティおよびアクセス制御を最適化します。これにより、管理者は複雑なサーバー環境を手軽に管理できるようになります。",
    "icon": "/platforms/acp/icons/server.svg"
  },
  {
    "title": "Webターミナル対応",
    "description": "Web ブラウザ内でサーバー接続や作業実行が可能な Web ターミナルおよび Web SFTP を提供することで、一貫したアクセス環境を実現し、すべての作業に対して効率的な権限制御を可能にします。これにより、ユーザーは専用のクライアントソフトを使用することなく、サーバー管理や作業をスムーズに行うことができます。",
    "icon": "/platforms/acp/icons/terminal.svg"
  },
  {
    "title": "サーバーグループによる 簡単な権限管理",
    "description": "サーバーグループを通じて権限を付与し、ポリシーを管理し、アクセス時間などの詳細設定を継承してサーバーおよびユーザーレベルで柔軟に管理できます。 これにより、セキュリティが強化され、管理者の業務効率がさらに高まります。",
    "icon": "/platforms/acp/icons/server-group.svg"
  },
  {
    "title": "プロキシアクセスのためのエージェントサポート",
    "description": "QueryPie は、ユーザーが利用している既存のプログラムを通じて、様々なシステムとサーバー機器に安全に接続できるように、ユーザーにデスクトップエージェントを提供します。",
    "icon": "/platforms/acp/icons/proxy.svg"
  },
  {
    "title": "SSHおよびSFTPアクセス管理",
    "description": "SSH 経由でアクセス可能なクラウドおよびオンプレミス環境のシステムやサーバーを含む、すべてのリソースの権限を一元管理します。",
    "icon": "/platforms/acp/icons/network.svg"
  }
] as const;

const worksBody = ["QueryPie SAC は、Web ターミナルおよびWeb SFTP を活用してユーザーを接続することで、アクセス制御と監査作業をシンプル化します。", "ユーザーはQueryPie プロキシサーバーを介してサーバーに簡単に接続でき、セキュリティプロトコルを確保しながらスムーズにアクセスすることが可能です。", "また、QueryPie SAC アプリは、すべての操作をモニタリングし、サーバーとのやり取りを強固に監視・制御します。"] as const;

const capabilityImages = [
  {
    "src": "/platforms/acp/system-access-controller/easy-use-jp.png",
    "alt": "easy use jp"
  },
  {
    "src": "/platforms/acp/system-access-controller/web-client.png",
    "alt": "web client"
  },
  {
    "src": "/platforms/acp/system-access-controller/access-control.png",
    "alt": "access control"
  },
  {
    "src": "/platforms/acp/system-access-controller/tag-based-management.png",
    "alt": "tag based management"
  },
  {
    "src": "/platforms/acp/system-access-controller/session-replay.png",
    "alt": "session replay"
  },
  {
    "src": "/platforms/acp/system-access-controller/iac.png",
    "alt": "iac"
  },
  {
    "src": "/platforms/acp/system-access-controller/protocol.png",
    "alt": "protocol"
  }
] as const;

export default function SystemAccessControllerPage() {
  return (
    <AcpStaticPageShell>
      <SiteHeader />
      <AcpHeroSection
        title="System Access Controller"
        description={heroDescription}
        media={{"kind": "youtube", "src": "https://www.youtube.com/embed/h1jlfwQFaiA?si=qvk_Mk0ryxXhwX51"}}
      />
      <AcpFeatureSection heading="SACの注目機能" intro={featureIntro} features={keyFeatures} />
      <AcpWorksSection
        heading="QueryPie SACの仕組み"
        body={worksBody}
        imageSrc="/platforms/acp/system-access-controller/works.png"
        imageAlt="QueryPie SACの仕組み"
      />
      <AcpCapabilityGallery heading="主な機能" images={capabilityImages} />
      <AcpPageCta />
      <SiteFooter />
    </AcpStaticPageShell>
  );
}
