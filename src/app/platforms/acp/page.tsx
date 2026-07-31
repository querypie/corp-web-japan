import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  AcpFeatureBrowser,
  AcpFeatureCategory,
  AcpFeatureCategoryLabel,
  AcpFeatureItem,
  AcpFeatureItemBody,
  AcpFeatureItemTitle,
} from "@/components/sections/acp/feature-browser";
import {
  AcpAiPackBody,
  AcpAiPackCard,
  AcpAiPackCardBody,
  AcpAiPackCardGrid,
  AcpAiPackCardTitle,
  AcpAiPackContent,
  AcpAiPackInner,
  AcpAiPackIntro,
  AcpAiPackSection,
  AcpAiPackTitle,
  AcpAiPackVideo,
  AcpFeatureInner,
  AcpFeatureIntro,
  AcpFeatureSection,
  AcpGovernanceCard,
  AcpGovernanceCardTitle,
  AcpGovernanceGrid,
  AcpGovernanceInner,
  AcpGovernanceIntro,
  AcpGovernanceList,
  AcpGovernanceListItem,
  AcpGovernanceSection,
  AcpHeroCopy,
  AcpHeroInner,
  AcpHeroLead,
  AcpHeroSection,
  AcpHeroTitle,
  AcpHeroDiagram,
  AcpIntegrationsBody,
  AcpIntegrationsImage,
  AcpIntegrationsInner,
  AcpIntegrationsLink,
  AcpIntegrationsSection,
  AcpIntegrationsTitle,
  AcpSectionBody,
  AcpSectionTitle,
  AcpServicePageShell,
} from "@/components/sections/acp/service-page";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { CtaActions, CtaButton, CtaContent, CtaCopy, CtaDescription, CtaTitle, SimpleCtaSection } from "@/components/sections/simple-cta-section";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export const metadata: Metadata = {
  title: "アクセスを一元化し、AI活用まで統制する｜QueryPie ACP | QueryPie AI",
  description:
    "QueryPie ACPは、データベース、システム、Kubernetes、Web/SaaS、MCPへのアクセスを一元制御するアクセス制御プラットフォームです。最小権限、申請・承認、監査、DLPを統合し、AI時代のガバナンスを支えます。",
  alternates: {
    canonical: "/platforms/acp",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AcpPage() {
  return (
    <AcpServicePageShell {...componentNameDebugProps("AcpPage")}>
      <SiteHeader />

      <AcpHeroSection>
        <AcpHeroInner>
          <RevealOnScroll>
            <AcpHeroCopy>
              <p className="text-sm font-semibold tracking-[0.14em] text-[#174EA6]">QueryPie ACP｜Access Control Platform</p>
              <AcpHeroTitle>
                アクセスを一元化し、
                <br />
                AI活用まで統制する。
              </AcpHeroTitle>
              <AcpHeroLead>
                QueryPie ACPは、データベース、システム、Kubernetes、Web/SaaS、MCPへのアクセスを一元制御するプラットフォームです。
                <br />
                最小権限、申請・承認、監査ログ、セッション記録、DLPを統合し、複雑なインフラ全体で監査に耐えるガバナンスを実現します。
              </AcpHeroLead>
            </AcpHeroCopy>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120} className="w-full">
            <AcpHeroDiagram />
          </RevealOnScroll>
        </AcpHeroInner>
      </AcpHeroSection>

      <AcpGovernanceSection>
        <AcpGovernanceInner>
          <RevealOnScroll>
            <AcpGovernanceIntro>
              <AcpSectionTitle>アクセス統制を、AI時代の共通基盤へ</AcpSectionTitle>
              <AcpSectionBody>
                アクセスを許可・禁止するだけでは、複雑化するインフラとAI活用を守り切れません。QueryPie ACPは、統制の仕組みと対象環境を一つの基盤に集約します。
              </AcpSectionBody>
            </AcpGovernanceIntro>
          </RevealOnScroll>

          <RevealOnScroll delayMs={100}>
            <AcpGovernanceGrid>
              <AcpGovernanceCard>
                <AcpGovernanceCardTitle>統制の仕組み</AcpGovernanceCardTitle>
                <AcpGovernanceList>
                  <AcpGovernanceListItem>最小権限アクセス</AcpGovernanceListItem>
                  <AcpGovernanceListItem>申請・承認ワークフロー</AcpGovernanceListItem>
                  <AcpGovernanceListItem>監査ログ・セッション記録</AcpGovernanceListItem>
                  <AcpGovernanceListItem>DLP・機密データマスキング</AcpGovernanceListItem>
                  <AcpGovernanceListItem>ポリシー管理</AcpGovernanceListItem>
                  <AcpGovernanceListItem>異常操作の可視化</AcpGovernanceListItem>
                </AcpGovernanceList>
              </AcpGovernanceCard>

              <AcpGovernanceCard>
                <AcpGovernanceCardTitle>統制の対象</AcpGovernanceCardTitle>
                <AcpGovernanceList>
                  <AcpGovernanceListItem>データベース</AcpGovernanceListItem>
                  <AcpGovernanceListItem>サーバー・システム</AcpGovernanceListItem>
                  <AcpGovernanceListItem>Kubernetes</AcpGovernanceListItem>
                  <AcpGovernanceListItem>Webアプリケーション・SaaS</AcpGovernanceListItem>
                  <AcpGovernanceListItem>MCPツール・MCPサーバー</AcpGovernanceListItem>
                </AcpGovernanceList>
              </AcpGovernanceCard>
            </AcpGovernanceGrid>
          </RevealOnScroll>
        </AcpGovernanceInner>
      </AcpGovernanceSection>

      <AcpFeatureSection>
        <AcpFeatureInner>
          <RevealOnScroll>
            <AcpFeatureIntro>
              <AcpSectionTitle>対象ごとに最適化された、5つのアクセス制御</AcpSectionTitle>
              <AcpSectionBody>
                データとインフラ、そしてAIが利用するMCPまで。対象環境に応じた統制を、一つのポリシーと監査基盤で運用できます。
              </AcpSectionBody>
            </AcpFeatureIntro>
          </RevealOnScroll>

          <RevealOnScroll delayMs={80}>
            <AcpFeatureBrowser>
              <AcpFeatureCategory>
                <AcpFeatureCategoryLabel>DAC｜データアクセス制御</AcpFeatureCategoryLabel>
                <AcpFeatureItem
                  mediaSrc="https://www.querypie.com/assets/products/acp/acp-dac.mp4#t=0.001"
                  mediaAlt="データベースアクセス制御のデモ"
                >
                  <AcpFeatureItemTitle>データを可視化し、必要な範囲だけを許可</AcpFeatureItemTitle>
                  <AcpFeatureItemBody>
                    クラウドとオンプレミスのデータ資産を一元管理し、機密情報を識別・マスキング。
                    <br />
                    クエリ単位で最小権限を適用し、安全なデータ活用を支えます。
                  </AcpFeatureItemBody>
                </AcpFeatureItem>
              </AcpFeatureCategory>

              <AcpFeatureCategory>
                <AcpFeatureCategoryLabel>SAC｜システムアクセス制御</AcpFeatureCategoryLabel>
                <AcpFeatureItem
                  mediaSrc="https://www.querypie.com/assets/products/acp/acp-sac.mp4#t=0.001"
                  mediaAlt="システムアクセス制御のデモ"
                >
                  <AcpFeatureItemTitle>サーバー操作を、統制と監査のもとに</AcpFeatureItemTitle>
                  <AcpFeatureItemBody>
                    AWS、GCP、Azure、オンプレミスを横断してアクセスを管理。
                    <br />
                    申請・承認から操作記録、セッション再生までを一つの流れで運用できます。
                  </AcpFeatureItemBody>
                </AcpFeatureItem>
              </AcpFeatureCategory>

              <AcpFeatureCategory>
                <AcpFeatureCategoryLabel>KAC｜Kubernetesアクセス制御</AcpFeatureCategoryLabel>
                <AcpFeatureItem
                  mediaSrc="https://www.querypie.com/assets/products/acp/acp-kac.mp4#t=0.001"
                  mediaAlt="Kubernetesアクセス制御のデモ"
                >
                  <AcpFeatureItemTitle>マルチクラスタ環境を、一つのポリシーで管理</AcpFeatureItemTitle>
                  <AcpFeatureItemBody>
                    クラウドとオンプレミスのKubernetes環境をまとめて可視化・統制。
                    <br />
                    APIリクエストの監査とコンテナ操作の記録により、運用の透明性を高めます。
                  </AcpFeatureItemBody>
                </AcpFeatureItem>
              </AcpFeatureCategory>

              <AcpFeatureCategory>
                <AcpFeatureCategoryLabel>WAC｜Web/SaaSアクセス制御</AcpFeatureCategoryLabel>
                <AcpFeatureItem
                  mediaSrc="https://www.querypie.com/assets/products/acp/acp-wac.mp4#t=0.001"
                  mediaAlt="Web/SaaSアクセス制御のデモ"
                >
                  <AcpFeatureItemTitle>WebアプリとSaaSの利用状況を、一元的に把握</AcpFeatureItemTitle>
                  <AcpFeatureItemBody>
                    管理画面やSaaSへのアクセスを統制し、操作ログと画面記録を取得。
                    <br />
                    機密情報のマスキングやファイル転送の制御で、情報漏洩リスクを抑えます。
                  </AcpFeatureItemBody>
                </AcpFeatureItem>
              </AcpFeatureCategory>

              <AcpFeatureCategory>
                <AcpFeatureCategoryLabel>MAC｜MCPアクセス制御</AcpFeatureCategoryLabel>
                <AcpFeatureItem
                  mediaSrc="https://www.querypie.com/assets/products/acp/acp-mac.mp4#t=0.001"
                  mediaAlt="MCPアクセス制御のデモ"
                >
                  <AcpFeatureItemTitle>AIエージェントのツール利用を、安全に統制</AcpFeatureItemTitle>
                  <AcpFeatureItemBody>
                    MCPツールやMCPサーバーの呼び出しを、ポリシーに基づき一元制御。
                    <br />
                    リアルタイムのリスク検知と機密データのマスキングで、AI活用に必要なガードレールを提供します。
                  </AcpFeatureItemBody>
                </AcpFeatureItem>
              </AcpFeatureCategory>
            </AcpFeatureBrowser>
          </RevealOnScroll>
        </AcpFeatureInner>
      </AcpFeatureSection>

      <AcpAiPackSection>
        <AcpAiPackInner>
          <RevealOnScroll>
            <AcpAiPackIntro>
              <AcpAiPackTitle>ACP AI Pack</AcpAiPackTitle>
              <AcpAiPackBody>
                AI ChatやAIエージェントにも、これまでのアクセス制御・認可・ポリシー・監査の仕組みを拡張。ツール呼び出し、データ取得、承認の迂回、異常操作まで、AIの実行を安全に統制します。
              </AcpAiPackBody>
            </AcpAiPackIntro>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120}>
            <AcpAiPackContent>
              <AcpAiPackCardGrid>
                <AcpAiPackCard>
                  <AcpAiPackCardTitle>AI Chat</AcpAiPackCardTitle>
                  <AcpAiPackCardBody>自然言語で、分析・権限確認・監査作業を進められます。</AcpAiPackCardBody>
                </AcpAiPackCard>
                <AcpAiPackCard>
                  <AcpAiPackCardTitle>ACP MCP</AcpAiPackCardTitle>
                  <AcpAiPackCardBody>社内外のAIエージェントからQueryPieのMCPツールを安全に利用できます。</AcpAiPackCardBody>
                </AcpAiPackCard>
                <AcpAiPackCard>
                  <AcpAiPackCardTitle>AI Skills</AcpAiPackCardTitle>
                  <AcpAiPackCardBody>監査レポートの作成や権限変更履歴の整理など、定型的なセキュリティ業務を自動化します。</AcpAiPackCardBody>
                </AcpAiPackCard>
              </AcpAiPackCardGrid>
              <AcpAiPackVideo />
            </AcpAiPackContent>
          </RevealOnScroll>
        </AcpAiPackInner>
      </AcpAiPackSection>

      <AcpIntegrationsSection>
        <AcpIntegrationsInner>
          <RevealOnScroll>
            <div className="flex flex-col gap-[20px]">
              <AcpIntegrationsTitle>
                ひとつの統制基盤で、
                <br />
                すべてのインフラとAIの接点を管理する
              </AcpIntegrationsTitle>
              <AcpIntegrationsBody>
                データベース、サーバー、Kubernetes、Webアプリケーション、アイデンティティプロバイダ、セキュリティツールなど50以上のシステムと連携。インフラ全体とAI活用をまたぐ、統一された権限制御を実現します。
              </AcpIntegrationsBody>
              <AcpIntegrationsLink href="/platforms/acp/integrations">対応するACP統合機能を見る</AcpIntegrationsLink>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120}>
            <AcpIntegrationsImage />
          </RevealOnScroll>
        </AcpIntegrationsInner>
      </AcpIntegrationsSection>

      <SimpleCtaSection background="white">
        <CtaContent>
          <CtaCopy>
            <CtaTitle>アクセス統制を、次のAI活用へ。</CtaTitle>
            <CtaDescription>現在の環境と運用要件に合わせて、QueryPie ACPの導入・活用方法をご案内します。</CtaDescription>
          </CtaCopy>
          <CtaActions>
            <CtaButton href="/contact-us?inquiry=ai-consulting&product=acp">ACPについて相談する</CtaButton>
          </CtaActions>
        </CtaContent>
      </SimpleCtaSection>

      <SiteFooter />
    </AcpServicePageShell>
  );
}
