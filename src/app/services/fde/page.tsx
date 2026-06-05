import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  ServiceFdeFeatureBody,
  ServiceFdeFeatureChecklist,
  ServiceFdeFeatureCopy,
  ServiceFdeFeatureImage,
  ServiceFdeFeatureImageFrame,
  ServiceFdeFeatureInner,
  ServiceFdeFeatureMedia,
  ServiceFdeFeatureRow,
  ServiceFdeFeatureSection,
  ServiceFdeFeatureTitle,
  ServiceFdeHeroCopy,
  ServiceFdeHeroInner,
  ServiceFdeHeroLead,
  ServiceFdeHeroSection,
  ServiceFdeHeroTitle,
  ServiceFdeHeroVisual,
  ServiceFdePageShell,
} from "@/components/sections/fde/service-page";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { AipFreeTrialCtaSection } from "@/components/sections/simple-cta-section";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export const metadata: Metadata = {
  title: "QueryPie AIP：あなたのためのAI変革エキスパート | QueryPie AI",
  description:
    "組織に組み込まれたフォワードデプロイドエンジニア（FDE）が、戦略と開発から本番運用まで包括的なAI変革を提供し、AIイニシアチブの成功を保証。",
  alternates: {
    canonical: "/services/fde",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ServiceFdePage() {
  return (
    <ServiceFdePageShell {...componentNameDebugProps("ServiceFdePage")}>
      <SiteHeader />

      <ServiceFdeHeroSection>
        <ServiceFdeHeroInner>
          <RevealOnScroll>
            <ServiceFdeHeroCopy>
              <ServiceFdeHeroTitle>
                QueryPie FDE
                <br />
                AXを成功に導く専門家チーム
              </ServiceFdeHeroTitle>
              <ServiceFdeHeroLead>
                フォワードデプロイドエンジニア（FDE）は、ビジネスとテクノロジーの両方を理解する専門家です。
                <br />
                業務変革のコンセプト設計から、AI開発、本番運用まで一貫してサポート。
                <br />
                あなたのチームに入り込み、確実な成果を出すAXを実現します。
              </ServiceFdeHeroLead>
            </ServiceFdeHeroCopy>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120} className="w-full">
            <ServiceFdeHeroVisual />
          </RevealOnScroll>
        </ServiceFdeHeroInner>
      </ServiceFdeHeroSection>

      <ServiceFdeFeatureInner>
        <ServiceFdeFeatureSection muted>
          <RevealOnScroll>
            <ServiceFdeFeatureRow>
              <ServiceFdeFeatureCopy>
                <ServiceFdeFeatureTitle>課題の発見と分析</ServiceFdeFeatureTitle>
                <ServiceFdeFeatureBody>
                  現場ヒアリングを通じて、AXを妨げている真の課題を特定。
                  <br />
                  時間とコストの無駄を防ぎ、最適な解決策を導きます。
                </ServiceFdeFeatureBody>
                <ServiceFdeFeatureChecklist />
              </ServiceFdeFeatureCopy>

              <ServiceFdeFeatureMedia>
                <ServiceFdeFeatureImageFrame width={540}>
                  <ServiceFdeFeatureImage src="/services/fde/find-problems.png" alt="課題の発見と分析" />
                </ServiceFdeFeatureImageFrame>
              </ServiceFdeFeatureMedia>
            </ServiceFdeFeatureRow>
          </RevealOnScroll>
        </ServiceFdeFeatureSection>

        <ServiceFdeFeatureSection>
          <RevealOnScroll>
            <ServiceFdeFeatureRow reverse>
              <ServiceFdeFeatureCopy>
                <ServiceFdeFeatureTitle>戦略とロードマップの策定</ServiceFdeFeatureTitle>
                <ServiceFdeFeatureBody>
                  貴社のビジネス目標に合わせた、最適なAX戦略を設計。
                  <br />
                  課題を具体的なアクションステップに落とし込み、
                  <br />
                  実現可能な導入計画を立案します。
                </ServiceFdeFeatureBody>
                <ServiceFdeFeatureChecklist />
              </ServiceFdeFeatureCopy>

              <ServiceFdeFeatureMedia>
                <ServiceFdeFeatureImageFrame width={580}>
                  <ServiceFdeFeatureImage src="/services/fde/make-plans.png" alt="戦略とロードマップの策定" />
                </ServiceFdeFeatureImageFrame>
              </ServiceFdeFeatureMedia>
            </ServiceFdeFeatureRow>
          </RevealOnScroll>
        </ServiceFdeFeatureSection>

        <ServiceFdeFeatureSection muted>
          <RevealOnScroll>
            <ServiceFdeFeatureRow>
              <ServiceFdeFeatureCopy>
                <ServiceFdeFeatureTitle>カスタムAIエージェントの構築</ServiceFdeFeatureTitle>
                <ServiceFdeFeatureBody>
                  貴社の業務に特化したAIエージェントを、ゼロから構築。
                  <br />
                  要件定義、設計、開発、テストの全工程でFDEがガイドし、
                  <br />
                  実用的なAIを実装します。
                </ServiceFdeFeatureBody>
                <ServiceFdeFeatureChecklist />
              </ServiceFdeFeatureCopy>

              <ServiceFdeFeatureMedia>
                <ServiceFdeFeatureImageFrame width={520}>
                  <ServiceFdeFeatureImage src="/services/fde/build-custom-ai-agents.png" alt="カスタムAIエージェントの構築" />
                </ServiceFdeFeatureImageFrame>
              </ServiceFdeFeatureMedia>
            </ServiceFdeFeatureRow>
          </RevealOnScroll>
        </ServiceFdeFeatureSection>

        <ServiceFdeFeatureSection>
          <RevealOnScroll>
            <ServiceFdeFeatureRow reverse>
              <ServiceFdeFeatureCopy>
                <ServiceFdeFeatureTitle>AI実用化を支援</ServiceFdeFeatureTitle>
                <ServiceFdeFeatureBody>
                  本番稼働後も、運用支援と効果測定を継続的に実施。
                  <br />
                  データに基づいた改善提案で、AXの成果を最大化します。
                </ServiceFdeFeatureBody>
                <ServiceFdeFeatureChecklist />
              </ServiceFdeFeatureCopy>

              <ServiceFdeFeatureMedia>
                <ServiceFdeFeatureImageFrame width={580}>
                  <ServiceFdeFeatureImage src="/services/fde/make-ai-work.png" alt="AI実用化を支援" />
                </ServiceFdeFeatureImageFrame>
              </ServiceFdeFeatureMedia>
            </ServiceFdeFeatureRow>
          </RevealOnScroll>
        </ServiceFdeFeatureSection>
      </ServiceFdeFeatureInner>

      <AipFreeTrialCtaSection />

      <SiteFooter />
    </ServiceFdePageShell>
  );
}
