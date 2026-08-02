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
  AipHeroEyebrow,
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
              <AipHeroEyebrow>QueryPie AIP｜Agentic AI Platform</AipHeroEyebrow>
              <AipHeroTitle>AIを、現場で動かすための基盤。</AipHeroTitle>
              <AipHeroLead>
                QueryPie AIPは、AIと既存の業務システムをつなぎ、コスト・セキュリティ・運用を一つの基盤で整えるエンタープライズAIプラットフォームです。
              </AipHeroLead>
            </AipHeroCopy>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120} className="w-full">
            <AipHeroVideo
              posterSrc="https://www.querypie.com/assets/products/aip/aip-cover.png"
              videoSrc="https://www.querypie.com/assets/products/aip/QueryPie%20AIP%20-%20Secure%20Enterprise%20Agentic%20AI%20Platform.mp4"
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
                  課題の発見からユースケース設計、実装、本番定着まで。業務と技術の両方を理解するFDE（Forward Deployed Engineer）が伴走し、AIを成果につなげます。
                </AipValueCardBody>
                <AipValueCardLink href="/services/fde">詳細を見る</AipValueCardLink>
              </AipValueCard>
            </RevealOnScroll>
          </AipValueGrid>
        </AipValueInner>
      </AipValueSection>

      <AppSpotlightCard
        sectionTitle="QueryPie AIPで動く、業務を前に進めるAIアプリ"
        eyebrow="QueryPie AIPのアプリ"
        title="会議を、次の業務につなげるLingo。"
        description="Lingoは、会議の文字起こし、リアルタイム翻訳、要約を一つにしたAIアプリです。QueryPie AIPが提供する安全性と運用性を土台に、会議で生まれる情報を次の行動へつなげます。"
        ctaLabel="Lingoを見る"
        href="https://lingo.querypie.ai/ja?utm_source=querypie_ai&utm_medium=web&utm_campaign=platform_aip_lingo"
      />

      <AipFeatureSection muted>
        <AipFeatureInner>
          <RevealOnScroll>
            <AipFeatureHeader>
              <AipFeatureHeaderTitle>実務に根づく、AIの実行機能</AipFeatureHeaderTitle>
            </AipFeatureHeader>
          </RevealOnScroll>

          <AipFeatureRow>
            <RevealOnScroll className="w-full lg:w-auto">
              <AipFeatureCopy className="max-w-[476px]">
                <AipFeatureTitle>指示から、実行できるプロンプトへ</AipFeatureTitle>
                <AipFeatureBody>
                  目的を入力すると、必要な文脈や指示を整理したプロンプトを生成。専門的な書き方を覚えなくても、業務に沿ったAIエージェントを立ち上げられます。
                </AipFeatureBody>
              </AipFeatureCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80} className="w-full lg:w-auto">
              <AipFeatureImage
                src="https://www.querypie.com/assets/products/aip/aip_function_prompt.gif"
                alt="プロンプトの作成と実行"
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
                <AipFeatureTitle>既存のツールを、AIの実行基盤へ</AipFeatureTitle>
                <AipFeatureBody>
                  SlackやGoogleなどのSaaS、社内ツール、カスタムMCPサーバーを接続。AIエージェントが必要なツールを安全に呼び出し、業務フローを実行できます。
                </AipFeatureBody>
                <AipInlineLink href="/platforms/aip/integrations">
                  接続可能な連携ツールを見る
                </AipInlineLink>
              </AipFeatureCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80} className="w-full lg:w-auto">
              <AipFeatureImage
                src="https://www.querypie.com/assets/products/aip/aip_function_integration.gif"
                alt="AIと既存ツールの統合"
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
                <AipFeatureTitle>社内の知識を、回答に活かす</AipFeatureTitle>
                <AipFeatureBody>
                  社内文書を知識ベースとして取り込み、必要な情報をAIが参照。組織固有の文脈に沿った、根拠のある回答を支援します。
                </AipFeatureBody>
              </AipFeatureCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80} className="w-full lg:w-auto">
              <AipFeatureImage
                src="https://www.querypie.com/assets/products/aip/aip_function_knowledge.gif"
                alt="社内知識を活用したAI回答"
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
                <AipFeatureTitle>業務に合わせて、AIエージェントを設計</AipFeatureTitle>
                <AipFeatureBody>
                  用意されたテンプレートを起点に、役割・利用ツール・実行手順を業務に合わせて設定。組織固有の運用にフィットするAIエージェントを構築できます。
                </AipFeatureBody>
              </AipFeatureCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80} className="w-full lg:w-auto">
              <AipFeatureImage
                src="https://www.querypie.com/assets/products/aip/aip_function_createagent.gif"
                alt="カスタムAIエージェントの作成"
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
                <AipFeatureTitle>回答を、意思決定できるレポートへ</AipFeatureTitle>
                <AipFeatureBody>
                  AIの回答をグラフ、表、インタラクティブな図へ展開。複雑な分析結果を共有しやすい形に整理し、会議や次のアクションにつなげられます。
                </AipFeatureBody>
              </AipFeatureCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80} className="w-full lg:w-auto">
              <AipFeatureImage
                src="https://www.querypie.com/assets/products/aip/aip_function_visualization.gif"
                alt="AI回答の可視化レポート"
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
                <AipFeatureTitle>定型業務を、スケジュールで自動化</AipFeatureTitle>
                <AipFeatureBody>
                  実行間隔や手順を指定して、AIエージェントの処理を自動化。定期的な確認・集計・通知などを、手作業に頼らず一貫して実行できます。
                </AipFeatureBody>
              </AipFeatureCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80} className="w-full lg:w-auto">
              <AipFeatureImage
                src="https://www.querypie.com/assets/products/aip/aip_function_schedule.gif"
                alt="AIエージェントのスケジュール実行"
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
