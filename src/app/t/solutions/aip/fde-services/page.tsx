import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  AipFdeCtaActions,
  AipFdeCtaCopy,
  AipFdeCtaDescription,
  AipFdeCtaSection,
  AipFdeCtaTitle,
  AipFdeFeatureBody,
  AipFdeFeatureChecklist,
  AipFdeFeatureCopy,
  AipFdeFeatureImage,
  AipFdeFeatureImageFrame,
  AipFdeFeatureInner,
  AipFdeFeatureMedia,
  AipFdeFeatureRow,
  AipFdeFeatureSection,
  AipFdeFeatureTitle,
  AipFdeHeroCopy,
  AipFdeHeroInner,
  AipFdeHeroLead,
  AipFdeHeroSection,
  AipFdeHeroTitle,
  AipFdeHeroVisual,
  AipFdeServicesPageShell,
} from "@/components/sections/aip-fde-services-page";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { BrandGradientCtaButton } from "@/components/ui/brand-gradient-cta-button";

export const metadata: Metadata = {
  title: "QueryPie AIP：あなたのためのAI変革エキスパート | QueryPie AI",
  description:
    "組織に組み込まれたフォワードデプロイドエンジニア（FDE）が、戦略と開発から本番運用まで包括的なAI変革を提供し、AIイニシアチブの成功を保証。",
  alternates: {
    canonical: "/t/solutions/aip/fde-services",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AipFdeServicesPage() {
  return (
    <AipFdeServicesPageShell>
      <SiteHeader />

      <AipFdeHeroSection>
        <AipFdeHeroInner>
          <RevealOnScroll>
            <AipFdeHeroCopy>
              <AipFdeHeroTitle>
                QueryPie FDE
                <br />
                AXを成功に導く専門家チーム
              </AipFdeHeroTitle>
              <AipFdeHeroLead>
                フォワードデプロイドエンジニア（FDE）は、ビジネスとテクノロジーの両方を理解する専門家です。
                <br />
                業務変革のコンセプト設計から、AI開発、本番運用まで一貫してサポート。
                <br />
                あなたのチームに入り込み、確実な成果を出すAXを実現します。
              </AipFdeHeroLead>
            </AipFdeHeroCopy>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120} className="w-full">
            <AipFdeHeroVisual />
          </RevealOnScroll>
        </AipFdeHeroInner>
      </AipFdeHeroSection>

      <AipFdeFeatureInner>
        <AipFdeFeatureSection muted>
          <RevealOnScroll>
            <AipFdeFeatureRow>
              <AipFdeFeatureCopy>
                <AipFdeFeatureTitle>課題の発見と分析</AipFdeFeatureTitle>
                <AipFdeFeatureBody>
                  現場ヒアリングを通じて、AXを妨げている真の課題を特定。
                  <br />
                  時間とコストの無駄を防ぎ、最適な解決策を導きます。
                </AipFdeFeatureBody>
                <AipFdeFeatureChecklist />
              </AipFdeFeatureCopy>

              <AipFdeFeatureMedia>
                <AipFdeFeatureImageFrame width={540}>
                  <AipFdeFeatureImage src="/solutions/aip/fde-services/find-problems.png" alt="課題の発見と分析" />
                </AipFdeFeatureImageFrame>
              </AipFdeFeatureMedia>
            </AipFdeFeatureRow>
          </RevealOnScroll>
        </AipFdeFeatureSection>

        <AipFdeFeatureSection>
          <RevealOnScroll>
            <AipFdeFeatureRow reverse>
              <AipFdeFeatureCopy>
                <AipFdeFeatureTitle>戦略とロードマップの策定</AipFdeFeatureTitle>
                <AipFdeFeatureBody>
                  貴社のビジネス目標に合わせた、最適なAX戦略を設計。
                  <br />
                  課題を具体的なアクションステップに落とし込み、
                  <br />
                  実現可能な導入計画を立案します。
                </AipFdeFeatureBody>
                <AipFdeFeatureChecklist />
              </AipFdeFeatureCopy>

              <AipFdeFeatureMedia>
                <AipFdeFeatureImageFrame width={580}>
                  <AipFdeFeatureImage src="/solutions/aip/fde-services/make-plans.png" alt="戦略とロードマップの策定" />
                </AipFdeFeatureImageFrame>
              </AipFdeFeatureMedia>
            </AipFdeFeatureRow>
          </RevealOnScroll>
        </AipFdeFeatureSection>

        <AipFdeFeatureSection muted>
          <RevealOnScroll>
            <AipFdeFeatureRow>
              <AipFdeFeatureCopy>
                <AipFdeFeatureTitle>カスタムAIエージェントの構築</AipFdeFeatureTitle>
                <AipFdeFeatureBody>
                  貴社の業務に特化したAIエージェントを、ゼロから構築。
                  <br />
                  要件定義、設計、開発、テストの全工程でFDEがガイドし、
                  <br />
                  実用的なAIを実装します。
                </AipFdeFeatureBody>
                <AipFdeFeatureChecklist />
              </AipFdeFeatureCopy>

              <AipFdeFeatureMedia>
                <AipFdeFeatureImageFrame width={520}>
                  <AipFdeFeatureImage src="/solutions/aip/fde-services/build-custom-ai-agents.png" alt="カスタムAIエージェントの構築" />
                </AipFdeFeatureImageFrame>
              </AipFdeFeatureMedia>
            </AipFdeFeatureRow>
          </RevealOnScroll>
        </AipFdeFeatureSection>

        <AipFdeFeatureSection>
          <RevealOnScroll>
            <AipFdeFeatureRow reverse>
              <AipFdeFeatureCopy>
                <AipFdeFeatureTitle>AI実用化を支援</AipFdeFeatureTitle>
                <AipFdeFeatureBody>
                  本番稼働後も、運用支援と効果測定を継続的に実施。
                  <br />
                  データに基づいた改善提案で、AXの成果を最大化します。
                </AipFdeFeatureBody>
                <AipFdeFeatureChecklist />
              </AipFdeFeatureCopy>

              <AipFdeFeatureMedia>
                <AipFdeFeatureImageFrame width={580}>
                  <AipFdeFeatureImage src="/solutions/aip/fde-services/make-ai-work.png" alt="AI実用化を支援" />
                </AipFdeFeatureImageFrame>
              </AipFdeFeatureMedia>
            </AipFdeFeatureRow>
          </RevealOnScroll>
        </AipFdeFeatureSection>
      </AipFdeFeatureInner>

      <AipFdeCtaSection>
        <RevealOnScroll>
          <AipFdeCtaCopy>
            <AipFdeCtaTitle>まずは小さく、失敗しないAXを始めよう</AipFdeCtaTitle>
            <AipFdeCtaDescription>簡単サインアップで、14日間の無料トライアルをお試しください</AipFdeCtaDescription>
          </AipFdeCtaCopy>
        </RevealOnScroll>

        <RevealOnScroll delayMs={80}>
          <AipFdeCtaActions>
            <BrandGradientCtaButton href="https://app.querypie.com">無料で試してみる</BrandGradientCtaButton>
          </AipFdeCtaActions>
        </RevealOnScroll>
      </AipFdeCtaSection>

      <SiteFooter />
    </AipFdeServicesPageShell>
  );
}
