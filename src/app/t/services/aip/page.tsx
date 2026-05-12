import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  AipServiceFeatureBody,
  AipServiceFeatureCopy,
  AipServiceFeatureHeader,
  AipServiceFeatureHeaderTitle,
  AipServiceFeatureImage,
  AipServiceFeatureInner,
  AipServiceFeatureRow,
  AipServiceFeatureSection,
  AipServiceFeatureTitle,
  AipServiceHeroCopy,
  AipServiceHeroInner,
  AipServiceHeroLead,
  AipServiceHeroSection,
  AipServiceHeroTitle,
  AipServiceHeroVideo,
  AipServiceInlineLink,
  AipServiceLineBreak,
  AipServicePageShell,
  AipServiceValueCard,
  AipServiceValueCardBody,
  AipServiceValueCardTitle,
  AipServiceValueDescription,
  AipServiceValueGrid,
  AipServiceValueImage,
  AipServiceValueInner,
  AipServiceValueIntro,
  AipServiceValueSection,
  AipServiceValueTitle,
} from "@/components/sections/aip-service-page";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { AipFreeTrialCtaSection } from "@/components/sections/simple-cta-section";

export const metadata: Metadata = {
  title: "QueryPie AIプラットフォーム (AIP) | QueryPie AI",
  description:
    "経済的でエンタープライズ対応のソリューションを通じてエンタープライズAI変革を実現するプラットフォーム—使用量ベースのLLM導入と包括的なMCPゲートウェイを特徴とする。カスタマイズされたAIエージェントを提供するフォワードデプロイドエンジニア（FDE）による完全な変革。",
  alternates: {
    canonical: "/t/services/aip",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AipServicePage() {
  return (
    <AipServicePageShell>
      <SiteHeader />

      <AipServiceHeroSection>
        <AipServiceHeroInner>
          <RevealOnScroll>
            <AipServiceHeroCopy>
              <AipServiceHeroTitle>QueryPie AIプラットフォーム (AIP)</AipServiceHeroTitle>
              <AipServiceHeroLead>
                QueryPie AIPは、既存の業務システムとつながり、実務で使えるAIを実現します。
                <AipServiceLineBreak />
                従量課金でコストを最適化。大規模なシステム改修も不要。
                <AipServiceLineBreak />
                専門家が伴走するので、確実に成果が出るAIプラットフォームです。
              </AipServiceHeroLead>
            </AipServiceHeroCopy>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120} className="w-full">
            <AipServiceHeroVideo />
          </RevealOnScroll>
        </AipServiceHeroInner>
      </AipServiceHeroSection>

      <AipServiceValueSection>
        <AipServiceValueInner>
          <RevealOnScroll>
            <AipServiceValueIntro>
              <AipServiceValueTitle>成果にこだわるエンタープライズAI</AipServiceValueTitle>
              <AipServiceValueDescription>AI導入を、ワンストップで実現する３つの価値</AipServiceValueDescription>
            </AipServiceValueIntro>
          </RevealOnScroll>

          <AipServiceValueGrid>
            <RevealOnScroll>
              <AipServiceValueCard>
                <AipServiceValueImage src="/services/aip/value-usage-based-llm.png" alt="従量課金型の AIモデル" />
                <AipServiceValueCardTitle>従量課金型の AIモデル</AipServiceValueCardTitle>
                <AipServiceValueCardBody>
                  全社員分のライセンス購入を経営層にどう説明する？使われなかったら？
                  <AipServiceLineBreak />
                  QueryPie AIPは使った分だけ支払う従量課金型。小さく始めて効果を見ながら段階的に拡大できます。
                  <AipServiceLineBreak />
                  プレミアムLLMを必要な時だけ利用でき、月額固定費の無駄から解放されます。
                </AipServiceValueCardBody>
                <AipServiceInlineLink href="/t/solutions/aip/usage-based-llm">詳細を見る</AipServiceInlineLink>
              </AipServiceValueCard>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80}>
              <AipServiceValueCard>
                <AipServiceValueImage src="/services/aip/value-mcp-gateway.png" alt="統合型 AIゲートウェイ" />
                <AipServiceValueCardTitle>統合型 AIゲートウェイ</AipServiceValueCardTitle>
                <AipServiceValueCardBody>
                  既存システムに「つなぐだけ」で、大規模なシステム改修は不要です。
                  <AipServiceLineBreak />
                  複雑な接続処理はQueryPie AIPが担当。
                  <AipServiceLineBreak />
                  バラバラだったシステムが、1つのプラットフォームで統合されたAIワークフローに変わります。
                </AipServiceValueCardBody>
                <AipServiceInlineLink href="/t/solutions/aip/mcp-gateway">詳細を見る</AipServiceInlineLink>
              </AipServiceValueCard>
            </RevealOnScroll>

            <RevealOnScroll delayMs={160}>
              <AipServiceValueCard>
                <AipServiceValueImage src="/services/aip/value-fde-services.png" alt="AI専門家伴走 サービス" />
                <AipServiceValueCardTitle>AI専門家伴走 サービス</AipServiceValueCardTitle>
                <AipServiceValueCardBody>
                  ビジネスとテクノロジーの両方を理解する専門家、フォワードデプロイドエンジニア(FDE)が、あなたのチームに入り込みます。
                  <AipServiceLineBreak />
                  課題発見から構築、本番稼働まで伴走し、確実に成果を出すAI導入を実現します。
                </AipServiceValueCardBody>
                <AipServiceInlineLink href="/t/solutions/aip/fde-services">詳細を見る</AipServiceInlineLink>
              </AipServiceValueCard>
            </RevealOnScroll>
          </AipServiceValueGrid>
        </AipServiceValueInner>
      </AipServiceValueSection>

      <AipServiceFeatureSection muted>
        <AipServiceFeatureInner>
          <RevealOnScroll>
            <AipServiceFeatureHeader>
              <AipServiceFeatureHeaderTitle>QueryPie AIPができること</AipServiceFeatureHeaderTitle>
            </AipServiceFeatureHeader>
          </RevealOnScroll>

          <AipServiceFeatureRow>
            <RevealOnScroll>
              <AipServiceFeatureCopy className="max-w-[417px]">
                <AipServiceFeatureTitle>プロンプト自動生成</AipServiceFeatureTitle>
                <AipServiceFeatureBody>
                  プリセットされた簡単な指示文（プロンプト）から始めれば
                  <AipServiceLineBreak />
                  包括的かつ最適化されたプロンプトを自動生成します。
                  <AipServiceLineBreak />
                  専門知識がなくてもAIエージェントの効果を最大限に引き出せます。
                </AipServiceFeatureBody>
              </AipServiceFeatureCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80}>
              <AipServiceFeatureImage
                src="/services/aip/prompt.gif"
                alt="プロンプト自動生成"
                width={540}
                height={304}
              />
            </RevealOnScroll>
          </AipServiceFeatureRow>
        </AipServiceFeatureInner>
      </AipServiceFeatureSection>

      <AipServiceFeatureSection>
        <AipServiceFeatureInner>
          <AipServiceFeatureRow reverse>
            <RevealOnScroll>
              <AipServiceFeatureCopy className="max-w-[380px]">
                <AipServiceFeatureTitle>シンプルな統合</AipServiceFeatureTitle>
                <AipServiceFeatureBody>
                  OAuth認証でお使いのツール（Slack、Googleなど）を簡単に接続。
                  <AipServiceLineBreak />
                  提供されている統合機能に加えて、カスタムツールや内部ツールも追加でき、
                  <AipServiceLineBreak />
                  ニーズに合わせたビジネスワークフロー自動化を実現します。
                </AipServiceFeatureBody>
                <AipServiceInlineLink href="https://www.querypie.com/ja/solutions/aip/integrations">
                  QueryPie AIPと接続可能な連携ツールの一覧はこちら
                </AipServiceInlineLink>
              </AipServiceFeatureCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80}>
              <AipServiceFeatureImage
                src="/services/aip/integration.gif"
                alt="シンプルな統合"
                width={580}
                height={326}
              />
            </RevealOnScroll>
          </AipServiceFeatureRow>
        </AipServiceFeatureInner>
      </AipServiceFeatureSection>

      <AipServiceFeatureSection muted>
        <AipServiceFeatureInner>
          <AipServiceFeatureRow>
            <RevealOnScroll>
              <AipServiceFeatureCopy className="max-w-[407px]">
                <AipServiceFeatureTitle>社内文書の学習機能</AipServiceFeatureTitle>
                <AipServiceFeatureBody>
                  社内文書をアップロードして知識ベース化。
                  <AipServiceLineBreak />
                  AIが組織の情報を瞬時に取得し、貴社のビジネスに合った正確な回答をします。
                </AipServiceFeatureBody>
              </AipServiceFeatureCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80}>
              <AipServiceFeatureImage
                src="/services/aip/knowledge.gif"
                alt="社内文書の学習機能"
                width={520}
                height={293}
              />
            </RevealOnScroll>
          </AipServiceFeatureRow>
        </AipServiceFeatureInner>
      </AipServiceFeatureSection>

      <AipServiceFeatureSection>
        <AipServiceFeatureInner>
          <AipServiceFeatureRow reverse>
            <RevealOnScroll>
              <AipServiceFeatureCopy className="max-w-[420px]">
                <AipServiceFeatureTitle>カスタムエージェント作成</AipServiceFeatureTitle>
                <AipServiceFeatureBody>
                  包括的なライブラリから構築済みのエージェントをインストール、
                  <AipServiceLineBreak />
                  または特定の運用要件に合わせて各エージェントの機能を
                  <AipServiceLineBreak />
                  カスタマイズした独自のソリューションを作成できます。
                </AipServiceFeatureBody>
              </AipServiceFeatureCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80}>
              <AipServiceFeatureImage
                src="/services/aip/custom-agent.gif"
                alt="カスタムエージェント作成"
                width={600}
                height={338}
              />
            </RevealOnScroll>
          </AipServiceFeatureRow>
        </AipServiceFeatureInner>
      </AipServiceFeatureSection>

      <AipServiceFeatureSection muted>
        <AipServiceFeatureInner>
          <AipServiceFeatureRow>
            <RevealOnScroll>
              <AipServiceFeatureCopy className="max-w-[418px]">
                <AipServiceFeatureTitle>ビジュアルレポート作成</AipServiceFeatureTitle>
                <AipServiceFeatureBody>
                  AIの回答をグラフや表、インタラクティブな図で表示。
                  <AipServiceLineBreak />
                  複雑な分析結果を視覚的にわかりやすく整理し、
                  <AipServiceLineBreak />
                  そのままエクスポートして会議に活用できます。
                </AipServiceFeatureBody>
              </AipServiceFeatureCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80}>
              <AipServiceFeatureImage
                src="/services/aip/visual-report.gif"
                alt="ビジュアルレポート作成"
                width={520}
                height={293}
              />
            </RevealOnScroll>
          </AipServiceFeatureRow>
        </AipServiceFeatureInner>
      </AipServiceFeatureSection>

      <AipServiceFeatureSection>
        <AipServiceFeatureInner>
          <AipServiceFeatureRow reverse>
            <RevealOnScroll>
              <AipServiceFeatureCopy className="max-w-[420px]">
                <AipServiceFeatureTitle>エージェントスケジューリング</AipServiceFeatureTitle>
                <AipServiceFeatureBody>
                  指定した間隔でAIエージェントをスケジュール設定し、
                  <AipServiceLineBreak />
                  定型タスクを自動化。
                  <AipServiceLineBreak />
                  簡単なエージェント会話を通じて定期的な操作を設定でき、
                  <AipServiceLineBreak />
                  手動作業を削減しながら一貫した実行を保証します。
                </AipServiceFeatureBody>
              </AipServiceFeatureCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={80}>
              <AipServiceFeatureImage
                src="/services/aip/scheduling.gif"
                alt="エージェントスケジューリング"
                width={600}
                height={338}
              />
            </RevealOnScroll>
          </AipServiceFeatureRow>
        </AipServiceFeatureInner>
      </AipServiceFeatureSection>

      <AipFreeTrialCtaSection />

      <SiteFooter />
    </AipServicePageShell>
  );
}
