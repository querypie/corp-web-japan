import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  AipFeatureBody,
  AipFeatureCopy,
  AipFeatureHeader,
  AipFeatureHeaderTitle,
  AipFeatureImage,
  AipFeatureInner,
  AipFeatureRow,
  AipFeatureSection,
  AipFeatureTitle,
  AipHeroCopy,
  AipHeroInner,
  AipHeroLead,
  AipHeroSection,
  AipHeroTitle,
  AipHeroVideo,
  AipInlineLink,
  AipLineBreak,
  AipPageShell,
  AipValueCard,
  AipValueCardBody,
  AipValueCardLink,
  AipValueCardTitle,
  AipValueDescription,
  AipValueGrid,
  AipValueImage,
  AipValueInner,
  AipValueIntro,
  AipValueSection,
  AipValueTitle,
} from "@/components/sections/aip/page";
import { AppSpotlightCard } from "@/components/sections/app-spotlight-card";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { AipFreeTrialCtaSection } from "@/components/sections/simple-cta-section";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export const metadata: Metadata = {
  title: "エンタープライズAIプラットフォーム（AIP）｜QueryPie AI",
  description:
    "QueryPie AIPは、従量課金型のLLM、MCPゲートウェイ、FDEによる伴走支援で、AIを安全に現場へ定着させるエンタープライズAIプラットフォームです。",
  alternates: {
    canonical: "/platforms/aip",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AipPage() {
  return (
    <AipPageShell {...componentNameDebugProps("AipPage")}>
      <SiteHeader />

      <AipHeroSection>
        <AipHeroInner>
          <RevealOnScroll>
            <AipHeroCopy>
              <AipHeroTitle>AIを、現場で動かすための基盤。</AipHeroTitle>
              <AipHeroLead>
                QueryPie AIPは、AIと既存の業務システムをつなぎ、コスト・セキュリティ・運用を一つの基盤で整えるエンタープライズAIプラットフォームです。
              </AipHeroLead>
            </AipHeroCopy>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120} className="w-full">
            <AipHeroVideo
              videoSrc="https://www.querypie.com/assets/products/aip/QueryPie%20AIP%20-%20Secure%20Enterprise%20Agentic%20AI%20Platform.mp4"
              posterSrc="https://www.querypie.com/assets/products/aip/aip-cover.png"
            />
          </RevealOnScroll>
        </AipHeroInner>
      </AipHeroSection>

      <AipValueSection>
        <AipValueInner>
          <RevealOnScroll>
            <AipValueIntro>
              <AipValueTitle>AI導入を、成果につなげる3つの基盤</AipValueTitle>
              <AipValueDescription>コストを最適化し、安全につなぎ、現場に定着させる。</AipValueDescription>
            </AipValueIntro>
          </RevealOnScroll>

          <AipValueGrid>
            <RevealOnScroll className="h-full">
              <AipValueCard>
                <AipValueImage src="/services/aip/value-usage-based-llm.png" alt="従量課金型の AIモデル">
                  <AipValueCardTitle>
                    従量課金型の
                    <AipLineBreak />
                    エンタープライズAI
                  </AipValueCardTitle>
                </AipValueImage>
                <AipValueCardBody>
                  全社ライセンスの固定費ではなく、使った分だけ支払う従量課金型。小さく始め、利用状況と効果を見ながら段階的に広げられます。
                </AipValueCardBody>
                <AipValueCardLink href="/platforms/aip/usage-based-llm">詳細を見る</AipValueCardLink>
              </AipValueCard>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80} className="h-full">
              <AipValueCard>
                <AipValueImage src="/services/aip/value-mcp-gateway.png" alt="統合型 AIゲートウェイ">
                  <AipValueCardTitle>
                    統合型
                    <AipLineBreak />
                    MCPゲートウェイ
                  </AipValueCardTitle>
                </AipValueImage>
                <AipValueCardBody>
                  既存の業務システム、社内ツール、MCPサーバーを安全につなぎ、AIエージェントのツール利用を一元管理。大規模なシステム改修なしでAI活用を広げられます。
                </AipValueCardBody>
                <AipValueCardLink href="/platforms/aip/mcp-gateway">詳細を見る</AipValueCardLink>
              </AipValueCard>
            </RevealOnScroll>

            <RevealOnScroll delayMs={160} className="h-full">
              <AipValueCard>
                <AipValueImage src="/services/aip/value-fde-services.png" alt="AI専門家伴走 サービス">
                  <AipValueCardTitle>
                    FDEによる
                    <AipLineBreak />
                    導入・定着支援
                  </AipValueCardTitle>
                </AipValueImage>
                <AipValueCardBody>
                  課題の発見からユースケース設計、実装、本番定着まで。業務と技術の両方を理解するFDEが伴走し、AIを成果につなげます。
                </AipValueCardBody>
                <AipValueCardLink href="/services/fde">詳細を見る</AipValueCardLink>
              </AipValueCard>
            </RevealOnScroll>
          </AipValueGrid>
        </AipValueInner>
      </AipValueSection>

      <AppSpotlightCard
        eyebrow="QueryPie AIPで提供する、実務のためのAIアプリ"
        title="会議を、次の業務につなげるLingo。"
        description="Lingoは、会議の文字起こし、リアルタイム翻訳、要約を一つにしたAIアプリです。QueryPie AIPが提供する安全性と運用性を土台に、会議で生まれる情報を次の行動へつなげます。"
        ctaLabel="Lingoを見る"
        href="https://lingo.querypie.ai/ja?utm_source=querypie_ai&utm_medium=web&utm_campaign=platform_aip_lingo"
      />

      <AipFeatureSection muted>
        <AipFeatureInner>
          <RevealOnScroll>
            <AipFeatureHeader>
              <AipFeatureHeaderTitle>QueryPie AIPができること</AipFeatureHeaderTitle>
            </AipFeatureHeader>
          </RevealOnScroll>

          <AipFeatureRow>
            <RevealOnScroll className="w-full lg:w-auto">
              <AipFeatureCopy className="max-w-[476px]">
                <AipFeatureTitle>プロンプト自動生成</AipFeatureTitle>
                <AipFeatureBody>
                  プリセットされた簡単な指示文（プロンプト）から始めれば
                  <AipLineBreak />
                  包括的かつ最適化されたプロンプトを自動生成します。
                  <AipLineBreak />
                  専門知識がなくてもAIエージェントの効果を最大限に引き出せます。
                </AipFeatureBody>
              </AipFeatureCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80} className="w-full lg:w-auto">
              <AipFeatureImage
                src="/services/aip/prompt.gif"
                alt="プロンプト自動生成"
                width={540}
                height={304}
              />
            </RevealOnScroll>
          </AipFeatureRow>
        </AipFeatureInner>
      </AipFeatureSection>

      <AipFeatureSection>
        <AipFeatureInner>
          <AipFeatureRow reverse>
            <RevealOnScroll className="w-full lg:w-auto">
              <AipFeatureCopy className="max-w-[538px]">
                <AipFeatureTitle>シンプルな統合</AipFeatureTitle>
                <AipFeatureBody>
                  OAuth認証でお使いのツール（Slack、Googleなど）を簡単に接続。
                  <AipLineBreak />
                  提供されている統合機能に加えて、カスタムツールや内部ツールも追加でき、
                  <AipLineBreak />
                  ニーズに合わせたビジネスワークフロー自動化を実現します。
                </AipFeatureBody>
                <AipInlineLink href="/platforms/aip/integrations">
                  QueryPie AIPと接続可能な連携ツールの一覧はこちら
                </AipInlineLink>
              </AipFeatureCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80} className="w-full lg:w-auto">
              <AipFeatureImage
                src="/services/aip/integration.gif"
                alt="シンプルな統合"
                width={580}
                height={326}
              />
            </RevealOnScroll>
          </AipFeatureRow>
        </AipFeatureInner>
      </AipFeatureSection>

      <AipFeatureSection muted>
        <AipFeatureInner>
          <AipFeatureRow>
            <RevealOnScroll className="w-full lg:w-auto">
              <AipFeatureCopy className="max-w-[553px]">
                <AipFeatureTitle>社内文書の学習機能</AipFeatureTitle>
                <AipFeatureBody>
                  社内文書をアップロードして知識ベース化。
                  <AipLineBreak />
                  AIが組織の情報を瞬時に取得し、貴社のビジネスに合った正確な回答をします。
                </AipFeatureBody>
              </AipFeatureCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80} className="w-full lg:w-auto">
              <AipFeatureImage
                src="/services/aip/knowledge.gif"
                alt="社内文書の学習機能"
                width={520}
                height={293}
              />
            </RevealOnScroll>
          </AipFeatureRow>
        </AipFeatureInner>
      </AipFeatureSection>

      <AipFeatureSection>
        <AipFeatureInner>
          <AipFeatureRow reverse>
            <RevealOnScroll className="w-full lg:w-auto">
              <AipFeatureCopy className="max-w-[420px]">
                <AipFeatureTitle>カスタムエージェント作成</AipFeatureTitle>
                <AipFeatureBody>
                  包括的なライブラリから構築済みのエージェントをインストール、
                  <AipLineBreak />
                  または特定の運用要件に合わせて各エージェントの機能を
                  <AipLineBreak />
                  カスタマイズした独自のソリューションを作成できます。
                </AipFeatureBody>
              </AipFeatureCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80} className="w-full lg:w-auto">
              <AipFeatureImage
                src="/services/aip/custom-agent.gif"
                alt="カスタムエージェント作成"
                width={600}
                height={338}
              />
            </RevealOnScroll>
          </AipFeatureRow>
        </AipFeatureInner>
      </AipFeatureSection>

      <AipFeatureSection muted>
        <AipFeatureInner>
          <AipFeatureRow>
            <RevealOnScroll className="w-full lg:w-auto">
              <AipFeatureCopy className="max-w-[418px]">
                <AipFeatureTitle>ビジュアルレポート作成</AipFeatureTitle>
                <AipFeatureBody>
                  AIの回答をグラフや表、インタラクティブな図で表示。
                  <AipLineBreak />
                  複雑な分析結果を視覚的にわかりやすく整理し、
                  <AipLineBreak />
                  そのままエクスポートして会議に活用できます。
                </AipFeatureBody>
              </AipFeatureCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80} className="w-full lg:w-auto">
              <AipFeatureImage
                src="/services/aip/visual-report.gif"
                alt="ビジュアルレポート作成"
                width={520}
                height={293}
              />
            </RevealOnScroll>
          </AipFeatureRow>
        </AipFeatureInner>
      </AipFeatureSection>

      <AipFeatureSection>
        <AipFeatureInner>
          <AipFeatureRow reverse>
            <RevealOnScroll className="w-full lg:w-auto">
              <AipFeatureCopy className="max-w-[420px]">
                <AipFeatureTitle>エージェントスケジューリング</AipFeatureTitle>
                <AipFeatureBody>
                  指定した間隔でAIエージェントをスケジュール設定し、
                  <AipLineBreak />
                  定型タスクを自動化。
                  <AipLineBreak />
                  簡単なエージェント会話を通じて定期的な操作を設定でき、
                  <AipLineBreak />
                  手動作業を削減しながら一貫した実行を保証します。
                </AipFeatureBody>
              </AipFeatureCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80} className="w-full lg:w-auto">
              <AipFeatureImage
                src="/services/aip/scheduling.gif"
                alt="エージェントスケジューリング"
                width={600}
                height={338}
              />
            </RevealOnScroll>
          </AipFeatureRow>
        </AipFeatureInner>
      </AipFeatureSection>

      <AipFreeTrialCtaSection />

      <SiteFooter />
    </AipPageShell>
  );
}
