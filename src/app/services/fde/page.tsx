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
  ServiceFdeHeroEyebrow,
  ServiceFdeHeroInner,
  ServiceFdeHeroLead,
  ServiceFdeHeroSection,
  ServiceFdeHeroTitle,
  ServiceFdeHeroVisual,
  ServiceFdeOverviewHeader,
  ServiceFdeOverviewSection,
  ServiceFdePageShell,
  ServiceFdeChallengeContent,
  ServiceFdeChallengeItem,
  ServiceFdeChallengeList,
  ServiceFdeChallengeSection,
  ServiceFdeFeatureStep,
  ServiceFdeSectionLead,
  ServiceFdeSectionTitle,
} from "@/components/sections/fde/service-page";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { CtaActions, CtaButton, CtaContent, CtaCopy, CtaDescription, CtaTitle, SimpleCtaSection } from "@/components/sections/simple-cta-section";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export const metadata: Metadata = {
  title: "FDEによるAI導入・定着支援 | QueryPie AI",
  description:
    "QueryPie AIのFDEは、顧客の現場に入り込み、AI活用の構想、課題発見、設計、実装、本番展開、運用改善までを一気通貫で支援します。",
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
              <ServiceFdeHeroEyebrow>QueryPie FDE</ServiceFdeHeroEyebrow>
              <ServiceFdeHeroTitle>AI活用を、現場の成果につなげる。</ServiceFdeHeroTitle>
              <ServiceFdeHeroLead>
                FDE（Forward Deployed Engineer）は、顧客の現場に入り込み、課題の発見から設計、実装、本番展開、運用改善までを一気通貫で担う専門チームです。QueryPie AIPを基盤に、AIを「試す」段階から、実際に業務で使われる状態へ導きます。
              </ServiceFdeHeroLead>
            </ServiceFdeHeroCopy>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120} className="w-full">
            <ServiceFdeHeroVisual />
          </RevealOnScroll>
        </ServiceFdeHeroInner>
      </ServiceFdeHeroSection>

      <ServiceFdeChallengeSection>
        <RevealOnScroll>
          <ServiceFdeChallengeContent>
            <ServiceFdeSectionTitle>AI導入のラストワンマイルを、前に進める。</ServiceFdeSectionTitle>
            <ServiceFdeSectionLead>生成AIの価値は、モデルを選ぶだけでは生まれません。業務、データ、既存システム、権限管理、運用に組み込まれて初めて、事業の成果につながります。</ServiceFdeSectionLead>
            <ServiceFdeChallengeList>
              <ServiceFdeChallengeItem>PoCはできても、本番導入まで進まない</ServiceFdeChallengeItem>
              <ServiceFdeChallengeItem>社内データや既存システムと、安全につながらない</ServiceFdeChallengeItem>
              <ServiceFdeChallengeItem>セキュリティ・権限・監査の要件を満たせない</ServiceFdeChallengeItem>
              <ServiceFdeChallengeItem>利用部門に定着せず、効果を測れない</ServiceFdeChallengeItem>
            </ServiceFdeChallengeList>
          </ServiceFdeChallengeContent>
        </RevealOnScroll>
      </ServiceFdeChallengeSection>

      <ServiceFdeOverviewSection>
        <RevealOnScroll>
          <ServiceFdeOverviewHeader>
            <ServiceFdeSectionTitle>FDEは、現場の課題をAIで解決する実装チームです。</ServiceFdeSectionTitle>
            <ServiceFdeSectionLead>提案や技術検証で終わらせず、顧客固有の業務・データ・セキュリティ要件を踏まえ、実際に使われるAIを形にします。現場の知見をプロダクト改善へ還元しながら、4つのステップを短いサイクルで進めます。</ServiceFdeSectionLead>
          </ServiceFdeOverviewHeader>
        </RevealOnScroll>
      </ServiceFdeOverviewSection>

      <ServiceFdeFeatureInner>
        <ServiceFdeFeatureSection muted>
          <RevealOnScroll>
            <ServiceFdeFeatureRow>
              <ServiceFdeFeatureCopy>
                <ServiceFdeFeatureStep>STEP 01</ServiceFdeFeatureStep>
                <ServiceFdeFeatureTitle>現場から、解くべき課題を見つける</ServiceFdeFeatureTitle>
                <ServiceFdeFeatureBody>
                  現場ヒアリング、業務フローの観察、既存システムやデータ構造の確認を通じて、AI活用を妨げる本質的な課題を整理します。時間とコストの無駄を防ぎ、成果につながる課題を明確にします。
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
                <ServiceFdeFeatureStep>STEP 02</ServiceFdeFeatureStep>
                <ServiceFdeFeatureTitle>事業成果から、導入の道筋を描く</ServiceFdeFeatureTitle>
                <ServiceFdeFeatureBody>
                  ビジネス目標、利用部門、データソース、セキュリティ要件を踏まえ、実現可能なユースケースとロードマップを設計。小さく検証しながら、確実に広げる計画へ落とし込みます。
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
                <ServiceFdeFeatureStep>STEP 03</ServiceFdeFeatureStep>
                <ServiceFdeFeatureTitle>業務で動くAIを、短いサイクルで検証する</ServiceFdeFeatureTitle>
                <ServiceFdeFeatureBody>
                  AIエージェント、RAG、API連携などを組み合わせ、業務に合うプロトタイプを構築。現場のフィードバックを取り込みながら、精度・使いやすさ・運用性を磨きます。
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
                <ServiceFdeFeatureStep>STEP 04</ServiceFdeFeatureStep>
                <ServiceFdeFeatureTitle>本番展開から、現場への定着まで伴走する</ServiceFdeFeatureTitle>
                <ServiceFdeFeatureBody>
                  認証・認可、監査ログ、運用フロー、利用部門への展開までを支援。本番稼働後も利用状況と効果を確認し、継続的な改善でAI活用を現場に定着させます。
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

      <SimpleCtaSection background="white">
        <CtaContent>
          <CtaCopy>
            <CtaTitle>AI活用を、PoCで終わらせない。</CtaTitle>
            <CtaDescription>現在の課題や導入フェーズに合わせて、FDEによる支援の進め方をご案内します。</CtaDescription>
          </CtaCopy>
          <CtaActions className="flex-wrap gap-3">
            <CtaButton href="/contact-us?inquiry=ai-consulting&product=fde">FDEについて相談する</CtaButton>
            <CtaButton href="/blog/33/what-is-forward-deployed-engineer-fde" variant="secondary">FDEを詳しく知る</CtaButton>
          </CtaActions>
        </CtaContent>
      </SimpleCtaSection>

      <SiteFooter />
    </ServiceFdePageShell>
  );
}
