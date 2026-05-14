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
  title: "QueryPie WAC: Web Access Controller | QueryPie AI",
  description: "QueryPie WACは、管理者ポータルや SaaS プラットフォームを含む Web アプリケーションのアクセスおよびログアクティビティを保護します。",
  alternates: {
    canonical: "/t/platforms/acp/web-access-controller",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const heroDescription = ["QueryPie WAC（Web Access Controller） は、Web アプリケーションへのアクセスを保護するとともに、ユーザーの活動を記録する機能を", "備えています。オンプレミスの管理者向けサイトやSaaS プラットフォームを含むWebアプリケーションに対して、権限を持つユーザーのみが", "アクセスできるようにし、さらに、ログやスクリーンショットのキャプチャ、機密データのマスキング、ファイル転送といった操作の", "制御を通じて、セキュリティを強化します。"] as const;

const featureIntro = ["QueryPie WAC（Web Access Controller） は、すべてのWeb アプリケーションを統合し、シームレスなRBAC（ロールベースのアクセス制御）と権限管理を", "サポートすることで、セキュリティ上の脆弱性を効果的に防ぎます。また、タイムラインベースの履歴機能によりユーザーのアクティビティを記録し、", "詳細なログとスクリーンショットを活用して、活動状況の可視性を高めます。"] as const;

const keyFeatures = [
  {
    "title": "Webアプリケーションの統合アクセス制御",
    "description": "自社開発ソリューションからSaaSまで、すべてのウェブアプリケーションを統合し、RBACと権限管理を可能にすることにより、セキュリティのギャップを埋めることができます。",
    "icon": "/platforms/acp/icons/web.svg"
  },
  {
    "title": "ブラウザタイムラインベースのユーザーアクティビティ履歴",
    "description": "URL のナビゲーション、リンクのクリック、クリップボードへのコピーなどのユーザーアクションをスクリーンショットで詳細に記録します。さらに、HTTP リクエストを解析することで、イベントをわかりやすく可視化します。",
    "icon": "/platforms/acp/icons/activity-recording.svg"
  },
  {
    "title": "イベントとコンテンツベースのユーザーアクティビティの追跡",
    "description": "クリック、入力、クリップボードの使用、ファイル転送など、ユーザーのアクティビティを追跡します。ボタンのクリックなどの詳細をスクリーンショットとともに記録し、簡単に確認できます。",
    "icon": "/platforms/acp/icons/tracking.svg"
  }
] as const;

const worksBody = ["QueryPie WAC は、ユーザーとWebアプリケーションの間にセキュアなゲートウェイとして機能し、安全なアクセスを確保するために", "ロールベースのアクセス制御（RBAC）を実施します。また、機密情報をマスキングしつつ、URL のナビゲーション、クリック操作、ファイル転送など、", "ユーザーのアクティビティを詳細に記録します。さらに、リアルタイムでのモニタリングやイベントトラッキングに加え、SIEM との容易な統合を実現し、", "Web アプリケーションにおける高度なセキュリティとコンプライアンスを提供します。"] as const;

const capabilityImages = [
  {
    "src": "/platforms/acp/web-access-controller/main.png",
    "alt": "main"
  },
  {
    "src": "/platforms/acp/web-access-controller/management.png",
    "alt": "management"
  },
  {
    "src": "/platforms/acp/web-access-controller/pac.png",
    "alt": "pac"
  },
  {
    "src": "/platforms/acp/web-access-controller/monitoring.png",
    "alt": "monitoring"
  },
  {
    "src": "/platforms/acp/web-access-controller/tracking.png",
    "alt": "tracking"
  },
  {
    "src": "/platforms/acp/web-access-controller/siem.png",
    "alt": "siem"
  },
  {
    "src": "/platforms/acp/web-access-controller/url-path-management.png",
    "alt": "url path management"
  },
  {
    "src": "/platforms/acp/web-access-controller/data-masking.png",
    "alt": "data masking"
  }
] as const;

export default function WebAccessControllerPage() {
  return (
    <AcpStaticPageShell>
      <SiteHeader />
      <AcpHeroSection
        title="Web Access Controller"
        description={heroDescription}
        media={{"kind": "image", "src": "/platforms/acp/web-access-controller/main.png", "alt": "Web Access Controller"}}
      />
      <AcpFeatureSection heading="WACの注目機能" intro={featureIntro} features={keyFeatures} />
      <AcpWorksSection
        heading="WACの仕組み"
        body={worksBody}
        imageSrc="/platforms/acp/web-access-controller/works.png"
        imageAlt="WACの仕組み"
      />
      <AcpCapabilityGallery heading="主な機能" images={capabilityImages} />
      <AcpPageCta />
      <SiteFooter />
    </AcpStaticPageShell>
  );
}
