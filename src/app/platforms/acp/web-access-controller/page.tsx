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
  AcpSplitFeatureBadge,
  AcpSplitFeatureBody,
  AcpSplitFeatureSection,
  AcpSplitFeatureTitle,
  AcpStaticPageShell,
  AcpWorksSection,
} from "@/components/sections/acp/static-page";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export const metadata: Metadata = {
  title: "QueryPie WAC: Web Access Controller | QueryPie AI",
  description: "QueryPie WACは、管理者ポータルや SaaS プラットフォームを含む Web アプリケーションのアクセスおよびログアクティビティを保護します。",
  alternates: {
    canonical: "/platforms/acp/web-access-controller",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function WebAccessControllerPage() {
  return (
    <AcpStaticPageShell {...componentNameDebugProps("WebAccessControllerPage")}>
      <SiteHeader />
      <AcpHeroSection background="wac" media={{"kind": "image", "src": "/platforms/acp/web-access-controller/main.png", "alt": "Web Access Controller"}} mediaTitle="Web Access Controller">
        <AcpHeroCopy>
          <AcpHeroEyebrow>QueryPie ACP</AcpHeroEyebrow>
          <AcpHeroTitle>Web Access Controller</AcpHeroTitle>
          <AcpHeroLead>
            QueryPie WAC（Web Access Controller） は、Web アプリケーションへのアクセスを保護するとともに、ユーザーの活動を記録する機能を
            <br />
            備えています。オンプレミスの管理者向けサイトやSaaS プラットフォームを含むWebアプリケーションに対して、権限を持つユーザーのみが
            <br />
            アクセスできるようにし、さらに、ログやスクリーンショットのキャプチャ、機密データのマスキング、ファイル転送といった操作の
            <br />
            制御を通じて、セキュリティを強化します。
          </AcpHeroLead>
        </AcpHeroCopy>
      </AcpHeroSection>
      <AcpFeatureSection topPadding="mega">
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
      <AcpWorksSection imageSrc="/platforms/acp/web-access-controller/works.png" imageAlt="WACの仕組み" imageWidth={1000} imageHeight={400}>
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
      <AcpSplitFeatureSection gray imageSrc="/platforms/acp/web-access-controller/management.png" imageAlt="Centralized Management" imageWidth={640} imageHeight={530}>
        <AcpSplitFeatureTitle>集中管理</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>Web プロキシとChrome 拡張機能を通じて、社内Web アプリケーション（SaaS、社内アプリケーションなど）をシームレスに管理します。 セキュリティレベルが低いSaaS アプリケーションでも、一貫したアクセス制御とログ記録を確保します。同時に、社内GUI コンソールにも同じ制御を適用することで、セキュリティ上の盲点を排除します。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection reverse imageSrc="/platforms/acp/web-access-controller/pac.png" imageAlt="RBAC & ABAC-Based Permission Control" imageWidth={640} imageHeight={470}>
        <AcpSplitFeatureTitle>{"ロールと属性ベースの\nアクセス制御"}</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>ユーザーロール（RBAC）に基づいてWebアプリケーションのアクセス権とポリシーを管理し、SaaS と社内アプリケーションの両方に対してログイン認証とアクセス制御をシームレスに統合します。セキュリティ機能が制限されたSaaS アプリケーションに対しても承認とロギングを提供し、最も必要な場所でセキュリティを強化します。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection gray imageSrc="/platforms/acp/web-access-controller/monitoring.png" imageAlt="Timeline-Based Browser Monitoring" imageWidth={640} imageHeight={490}>
        <AcpSplitFeatureTitle>{"タイムラインベースの\nブラウザ監視"}</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>Web アプリケーションにおけるユーザーの行動をタイムラインベースで追跡します。QueryPie は、ユーザーのアクティビティをスクリーンショットとしてキャプチャし、権限の管理を行い、すべての対話をリアルタイムで明確に確認できるようにします。リアルタイムでのタイムラインモニタリングにより、管理者は異常の兆候を迅速に把握し、社内アプリケーションとSaaS アプリケーションの両方において優れたセキュリティを維持することができます。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection reverse imageSrc="/platforms/acp/web-access-controller/tracking.png" imageAlt="Event and Content-Based User Activity Tracking" imageWidth={640} imageHeight={590}>
        <AcpSplitFeatureTitle>{"イベントとコンテンツベースの\nユーザーアクティビティの追跡"}</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>Web アプリケーションは、ユーザーのクリック、スクロール、入力など、すべてのアクティビティをリアルタイムで追跡し、URL の閲覧からファイル転送に至るまで、ユーザーの行動を完全に把握します。これにより、機密性の高いやりとりに対して、完全な可視性を確保することができます。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection gray imageSrc="/platforms/acp/web-access-controller/siem.png" imageAlt="One-Click SIEM Integration" imageWidth={640} imageHeight={630}>
        <AcpSplitFeatureTitle>ワンクリック SIEM 連動</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>QueryPie では、記録されたすべてのイベントのログストリーミングをシンプル化し、Web アクセス、監査、ユーザーアクティビティなどのデータをリアルタイムで監視することができます。これにより、管理者は重要なイベントを追跡し、ユーザーの行動を分析して、アクセスパターンを確認することができ、セキュリティを強化するための貴重な洞察を提供します。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection reverse imageSrc="/platforms/acp/web-access-controller/url-path-management.png" imageAlt="URL Path Management" imageWidth={640} imageHeight={460}>
        <AcpSplitFeatureTitle>URLパスの管理</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>タグベースのRBAC およびABAC ルールを使用して、サブURLへのアクセスを制御します。管理者はWeb アプリケーションのアクセスを制限し、ユーザーが自分の役割に基づいて許可されたページやコンテンツのみにアクセスできるように設定します。</p>
        </AcpSplitFeatureBody>
      </AcpSplitFeatureSection>
      <AcpSplitFeatureSection gray last imageSrc="/platforms/acp/web-access-controller/data-masking.png" imageAlt="Data Masking in Web Applications" imageWidth={600} imageHeight={450} imageWidthClassName="lg:basis-1/2">
        <AcpSplitFeatureBadge>Coming Soon</AcpSplitFeatureBadge>
        <AcpSplitFeatureTitle>{"Web アプリケーションでの\nデータマスキング"}</AcpSplitFeatureTitle>
        <AcpSplitFeatureBody>
          <p>Web アプリケーションから機密情報をマスキングすることで、不正アクセスや情報漏洩を防ぎます。マスキング技術を適用することにより、インプレッションへのリスクを軽減し、データセキュリティ規制に準拠するとともに、ユーザーのプライバシーを保護することができます。</p>
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
