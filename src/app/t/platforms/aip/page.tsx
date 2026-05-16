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
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { AipFreeTrialCtaSection } from "@/components/sections/simple-cta-section";

export const metadata: Metadata = {
  title: "QueryPie AIプラットフォーム (AIP) | QueryPie AI",
  description:
    "経済的でエンタープライズ対応のソリューションを通じてエンタープライズAI変革を実現するプラットフォーム—使用量ベースのLLM導入と包括的なMCPゲートウェイを特徴とする。カスタマイズされたAIエージェントを提供するフォワードデプロイドエンジニア（FDE）による完全な変革。",
  alternates: {
    canonical: "/t/platforms/aip",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AipPage() {
  return (
    <AipPageShell>
      <SiteHeader />

      <AipHeroSection>
        <AipHeroInner>
          <RevealOnScroll>
            <AipHeroCopy>
              <AipHeroTitle>QueryPie AIプラットフォーム (AIP)</AipHeroTitle>
              <AipHeroLead>
                QueryPie AIPは、既存の業務システムとつながり、実務で使えるAIを実現します。
                <AipLineBreak />
                従量課金でコストを最適化。大規模なシステム改修も不要。
                <AipLineBreak />
                専門家が伴走するので、確実に成果が出るAIプラットフォームです。
              </AipHeroLead>
            </AipHeroCopy>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120} className="w-full">
            <AipHeroVideo videoId="nJGSCd6itUE" thumbnailSrc="/services/aip/aip-video-thumb-jp.png" />
          </RevealOnScroll>
        </AipHeroInner>
      </AipHeroSection>

      <AipValueSection>
        <AipValueInner>
          <RevealOnScroll>
            <AipValueIntro>
              <AipValueTitle>成果にこだわるエンタープライズAI</AipValueTitle>
              <AipValueDescription>AI導入を、ワンストップで実現する３つの価値</AipValueDescription>
            </AipValueIntro>
          </RevealOnScroll>

          <AipValueGrid>
            <RevealOnScroll className="h-full">
              <AipValueCard>
                <AipValueImage src="/services/aip/value-usage-based-llm.png" alt="従量課金型の AIモデル">
                  <AipValueCardTitle>
                    従量課金型の
                    <AipLineBreak />
                    AIモデル
                  </AipValueCardTitle>
                </AipValueImage>
                <AipValueCardBody>
                  全社員分のライセンス購入を経営層にどう説明する？使われなかったら？
                  <AipLineBreak />
                  QueryPie AIPは使った分だけ支払う従量課金型。小さく始めて効果を見ながら段階的に拡大できます。
                  <AipLineBreak />
                  プレミアムLLMを必要な時だけ利用でき、月額固定費の無駄から解放されます。
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
                    AIゲートウェイ
                  </AipValueCardTitle>
                </AipValueImage>
                <AipValueCardBody>
                  既存システムに「つなぐだけ」で、大規模なシステム改修は不要です。
                  <AipLineBreak />
                  複雑な接続処理はQueryPie AIPが担当。
                  <AipLineBreak />
                  バラバラだったシステムが、1つのプラットフォームで統合されたAIワークフローに変わります。
                </AipValueCardBody>
                <AipValueCardLink href="/platforms/aip/mcp-gateway">詳細を見る</AipValueCardLink>
              </AipValueCard>
            </RevealOnScroll>

            <RevealOnScroll delayMs={160} className="h-full">
              <AipValueCard>
                <AipValueImage src="/services/aip/value-fde-services.png" alt="AI専門家伴走 サービス">
                  <AipValueCardTitle>
                    AI専門家伴走
                    <AipLineBreak />
                    サービス
                  </AipValueCardTitle>
                </AipValueImage>
                <AipValueCardBody>
                  ビジネスとテクノロジーの両方を理解する専門家、フォワードデプロイドエンジニア(FDE)が、あなたのチームに入り込みます。
                  <AipLineBreak />
                  課題発見から構築、本番稼働まで伴走し、確実に成果を出すAI導入を実現します。
                </AipValueCardBody>
                <AipValueCardLink href="/t/services/fde">詳細を見る</AipValueCardLink>
              </AipValueCard>
            </RevealOnScroll>
          </AipValueGrid>
        </AipValueInner>
      </AipValueSection>

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
                <AipInlineLink href="/t/platforms/aip/integrations">
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
