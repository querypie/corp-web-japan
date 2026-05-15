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

export default function WebAccessControllerPage() {
  return (
    <AcpStaticPageShell>
      <SiteHeader />
      <AcpHeroSection media={{"kind": "image", "src": "/platforms/acp/web-access-controller/main.png", "alt": "Web Access Controller"}} mediaTitle="Web Access Controller">
        <AcpHeroEyebrow>QueryPie ACP</AcpHeroEyebrow>
        <AcpHeroTitle>Web Access Controller</AcpHeroTitle>
        <AcpHeroLeadGroup>
          <p>
            QueryPie WAC（Web Access Controller） は、Web アプリケーションへのアクセスを保護するとともに、ユーザーの活動を記録する機能を
          </p>
          <p>
            備えています。オンプレミスの管理者向けサイトやSaaS プラットフォームを含むWebアプリケーションに対して、権限を持つユーザーのみが
          </p>
          <p>
            アクセスできるようにし、さらに、ログやスクリーンショットのキャプチャ、機密データのマスキング、ファイル転送といった操作の
          </p>
          <p>
            制御を通じて、セキュリティを強化します。
          </p>
        </AcpHeroLeadGroup>
      </AcpHeroSection>
      <AcpFeatureSection>
        <AcpSectionIntro>
          <AcpSectionHeading>WACの注目機能</AcpSectionHeading>
          <AcpSectionLeadGroup>
            <p>
              QueryPie WAC（Web Access Controller） は、すべてのWeb アプリケーションを統合し、シームレスなRBAC（ロールベースのアクセス制御）と権限管理を
            </p>
            <p>
              サポートすることで、セキュリティ上の脆弱性を効果的に防ぎます。また、タイムラインベースの履歴機能によりユーザーのアクティビティを記録し、
            </p>
            <p>
              詳細なログとスクリーンショットを活用して、活動状況の可視性を高めます。
            </p>
          </AcpSectionLeadGroup>
        </AcpSectionIntro>
        <AcpFeatureGrid>
          <AcpFeatureCard icon="/platforms/acp/icons/web.svg">
            <AcpFeatureCardTitle>Webアプリケーションの統合アクセス制御</AcpFeatureCardTitle>
            <AcpFeatureCardDescription>
              自社開発ソリューションからSaaSまで、すべてのウェブアプリケーションを統合し、RBACと権限管理を可能にすることにより、セキュリティのギャップを埋めることができます。
            </AcpFeatureCardDescription>
          </AcpFeatureCard>
          <AcpFeatureCard icon="/platforms/acp/icons/activity-recording.svg">
            <AcpFeatureCardTitle>ブラウザタイムラインベースのユーザーアクティビティ履歴</AcpFeatureCardTitle>
            <AcpFeatureCardDescription>
              URL のナビゲーション、リンクのクリック、クリップボードへのコピーなどのユーザーアクションをスクリーンショットで詳細に記録します。さらに、HTTP リクエストを解析することで、イベントをわかりやすく可視化します。
            </AcpFeatureCardDescription>
          </AcpFeatureCard>
          <AcpFeatureCard icon="/platforms/acp/icons/tracking.svg">
            <AcpFeatureCardTitle>イベントとコンテンツベースのユーザーアクティビティの追跡</AcpFeatureCardTitle>
            <AcpFeatureCardDescription>
              クリック、入力、クリップボードの使用、ファイル転送など、ユーザーのアクティビティを追跡します。ボタンのクリックなどの詳細をスクリーンショットとともに記録し、簡単に確認できます。
            </AcpFeatureCardDescription>
          </AcpFeatureCard>
        </AcpFeatureGrid>
      </AcpFeatureSection>
      <AcpWorksSection imageSrc="/platforms/acp/web-access-controller/works.png" imageAlt="WACの仕組み">
        <AcpSectionIntro>
          <AcpSectionHeading>WACの仕組み</AcpSectionHeading>
          <AcpSectionLeadGroup>
            <p>
              QueryPie WAC は、ユーザーとWebアプリケーションの間にセキュアなゲートウェイとして機能し、安全なアクセスを確保するために
            </p>
            <p>
              ロールベースのアクセス制御（RBAC）を実施します。また、機密情報をマスキングしつつ、URL のナビゲーション、クリック操作、ファイル転送など、
            </p>
            <p>
              ユーザーのアクティビティを詳細に記録します。さらに、リアルタイムでのモニタリングやイベントトラッキングに加え、SIEM との容易な統合を実現し、
            </p>
            <p>
              Web アプリケーションにおける高度なセキュリティとコンプライアンスを提供します。
            </p>
          </AcpSectionLeadGroup>
        </AcpSectionIntro>
      </AcpWorksSection>
      <AcpCapabilityGallery>
        <AcpSectionHeading>主な機能</AcpSectionHeading>
        <AcpCapabilityGrid>
          <AcpCapabilityImage src="/platforms/acp/web-access-controller/main.png" alt="main" />
          <AcpCapabilityImage src="/platforms/acp/web-access-controller/management.png" alt="management" />
          <AcpCapabilityImage src="/platforms/acp/web-access-controller/pac.png" alt="pac" />
          <AcpCapabilityImage src="/platforms/acp/web-access-controller/monitoring.png" alt="monitoring" />
          <AcpCapabilityImage src="/platforms/acp/web-access-controller/tracking.png" alt="tracking" />
          <AcpCapabilityImage src="/platforms/acp/web-access-controller/siem.png" alt="siem" />
          <AcpCapabilityImage src="/platforms/acp/web-access-controller/url-path-management.png" alt="url path management" />
          <AcpCapabilityImage src="/platforms/acp/web-access-controller/data-masking.png" alt="data masking" />
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
