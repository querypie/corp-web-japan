import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  AipUsageBasedLlmComparisonBody,
  AipUsageBasedLlmComparisonCard,
  AipUsageBasedLlmComparisonGrid,
  AipUsageBasedLlmComparisonLabel,
  AipUsageBasedLlmComparisonValue,
  AipUsageBasedLlmComparisonSection,
  AipUsageBasedLlmComparisonTitle,
  AipUsageBasedLlmFeatureBand,
  AipUsageBasedLlmFeatureBody,
  AipUsageBasedLlmFeatureCopy,
  AipUsageBasedLlmFeatureImage,
  AipUsageBasedLlmFeatureRow,
  AipUsageBasedLlmFeatureTitle,
  AipUsageBasedLlmHeroDescription,
  AipUsageBasedLlmHeroFootnote,
  AipUsageBasedLlmHeroImage,
  AipUsageBasedLlmHeroSection,
  AipUsageBasedLlmHeroTitle,
  AipUsageBasedLlmLineBreak,
  AipUsageBasedLlmPageShell,
} from "@/components/sections/usage-based-llm/section";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { AipFreeTrialCtaSection } from "@/components/sections/simple-cta-section";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export const metadata: Metadata = {
  title: "従量課金型エンタープライズAI｜QueryPie AIP | QueryPie AI",
  description:
    "固定費を抑え、使った分だけ支払う。QueryPie AIPは、複数のプレミアムLLM、SSO、一元管理を備え、AIを全社へ広げる従量課金型エンタープライズAIです。",
  alternates: {
    canonical: "/platforms/aip/usage-based-llm",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AipUsageBasedLlmPage() {
  return (
    <AipUsageBasedLlmPageShell {...componentNameDebugProps("AipUsageBasedLlmPage")}>
      <SiteHeader />

      <AipUsageBasedLlmHeroSection>
        <RevealOnScroll>
          <AipUsageBasedLlmHeroTitle>
            使った分だけで、
            <br />
            AIを全社へ。
          </AipUsageBasedLlmHeroTitle>
        </RevealOnScroll>

        <RevealOnScroll delayMs={60}>
          <AipUsageBasedLlmHeroDescription>
            ブラウザからすぐに使え、導入のためのダウンロードや大がかりなセットアップは不要です。
            <AipUsageBasedLlmLineBreak />
            固定費を持たない従量課金で、AI活用を小さく始め、利用状況と成果に合わせて段階的に広げられます。
            <AipUsageBasedLlmLineBreak />
            月額課金型AIサービスと比べ、最大90%のコスト削減も可能です。
            <AipUsageBasedLlmHeroFootnote>*削減率は利用条件により異なります</AipUsageBasedLlmHeroFootnote>
          </AipUsageBasedLlmHeroDescription>
        </RevealOnScroll>

        <RevealOnScroll delayMs={120}>
          <AipUsageBasedLlmHeroImage />
        </RevealOnScroll>
      </AipUsageBasedLlmHeroSection>

      <AipUsageBasedLlmFeatureBand muted>
        <AipUsageBasedLlmFeatureRow>
          <RevealOnScroll>
            <AipUsageBasedLlmFeatureCopy className="lg:w-[445px] lg:max-w-[445px]">
              <AipUsageBasedLlmFeatureTitle>使った分だけ、無駄なく支払う</AipUsageBasedLlmFeatureTitle>
              <AipUsageBasedLlmFeatureBody>
                月額固定のライセンス費用ではなく、実際の利用量に応じて支払う従量課金型です。利用が広がっても、コストを把握しながら柔軟にAI活用を拡大できます。
              </AipUsageBasedLlmFeatureBody>
            </AipUsageBasedLlmFeatureCopy>
          </RevealOnScroll>

          <RevealOnScroll delayMs={80}>
            <AipUsageBasedLlmFeatureImage
              src="https://www.querypie.com/assets/products/aip/usage-based-llm/aip_function_pay.gif"
              alt="従量課金型の利用状況"
              width={540}
              height={304}
            />
          </RevealOnScroll>
        </AipUsageBasedLlmFeatureRow>
      </AipUsageBasedLlmFeatureBand>

      <AipUsageBasedLlmFeatureBand>
        <AipUsageBasedLlmFeatureRow reverse>
          <RevealOnScroll>
            <AipUsageBasedLlmFeatureCopy className="ml-auto lg:w-[534px] lg:max-w-[534px]">
              <AipUsageBasedLlmFeatureTitle>
                用途に合わせて、LLMを選ぶ
              </AipUsageBasedLlmFeatureTitle>
              <AipUsageBasedLlmFeatureBody>
                Claude、GPT、Geminiなど、業界をリードするLLMに対応。自社で保有・運用するLLMも含め、業務や要件に適したモデルを選択できます。
              </AipUsageBasedLlmFeatureBody>
            </AipUsageBasedLlmFeatureCopy>
          </RevealOnScroll>

          <RevealOnScroll delayMs={80}>
            <AipUsageBasedLlmFeatureImage
              src="https://www.querypie.com/assets/products/aip/usage-based-llm/aip_function_llmmodel.gif"
              alt="利用するLLMモデルの選択"
              width={580}
              height={326}
            />
          </RevealOnScroll>
        </AipUsageBasedLlmFeatureRow>
      </AipUsageBasedLlmFeatureBand>

      <AipUsageBasedLlmFeatureBand muted>
        <AipUsageBasedLlmFeatureRow>
          <RevealOnScroll>
            <AipUsageBasedLlmFeatureCopy className="lg:w-[518px] lg:max-w-[518px]">
              <AipUsageBasedLlmFeatureTitle>SSOと一元管理で、組織利用に対応</AipUsageBasedLlmFeatureTitle>
              <AipUsageBasedLlmFeatureBody>
                既存のアイデンティティプロバイダーとSSO連携し、ログインとアカウント管理を一元化。利用者が増えても、セキュリティと運用の統制を保てます。
              </AipUsageBasedLlmFeatureBody>
            </AipUsageBasedLlmFeatureCopy>
          </RevealOnScroll>

          <RevealOnScroll delayMs={80}>
            <AipUsageBasedLlmFeatureImage
              src="https://www.querypie.com/assets/products/aip/usage-based-llm/aip_function_sso.gif"
              alt="SSOによるアカウントの一元管理"
              width={520}
              height={293}
            />
          </RevealOnScroll>
        </AipUsageBasedLlmFeatureRow>
      </AipUsageBasedLlmFeatureBand>

      <AipUsageBasedLlmComparisonSection>
        <RevealOnScroll>
          <AipUsageBasedLlmComparisonTitle>全社導入のコストを、利用実態に合わせる。</AipUsageBasedLlmComparisonTitle>
        </RevealOnScroll>

        <RevealOnScroll delayMs={80}>
          <AipUsageBasedLlmComparisonGrid>
            <AipUsageBasedLlmComparisonCard featured>
              <AipUsageBasedLlmComparisonLabel inverted>月額固定費</AipUsageBasedLlmComparisonLabel>
              <AipUsageBasedLlmComparisonValue inverted>$0（従量課金）</AipUsageBasedLlmComparisonValue>
              <AipUsageBasedLlmComparisonBody inverted>月額固定のライセンス費用ではなく、実際の利用量に応じて支払います。</AipUsageBasedLlmComparisonBody>
            </AipUsageBasedLlmComparisonCard>
            <AipUsageBasedLlmComparisonCard>
              <AipUsageBasedLlmComparisonLabel>対応するLLM</AipUsageBasedLlmComparisonLabel>
              <AipUsageBasedLlmComparisonValue>Claude / GPT / Gemini</AipUsageBasedLlmComparisonValue>
              <AipUsageBasedLlmComparisonBody>自社で保有するLLMを含め、用途に合わせて選択できます。</AipUsageBasedLlmComparisonBody>
            </AipUsageBasedLlmComparisonCard>
            <AipUsageBasedLlmComparisonCard>
              <AipUsageBasedLlmComparisonLabel>200ユーザー規模の年間目安</AipUsageBasedLlmComparisonLabel>
              <AipUsageBasedLlmComparisonValue>US$7,200〜*</AipUsageBasedLlmComparisonValue>
              <AipUsageBasedLlmComparisonBody>主要な月額課金型AIサービスと比べ、最大90%のコスト削減が見込めます。</AipUsageBasedLlmComparisonBody>
            </AipUsageBasedLlmComparisonCard>
          </AipUsageBasedLlmComparisonGrid>
        </RevealOnScroll>
      </AipUsageBasedLlmComparisonSection>

      <AipFreeTrialCtaSection />

      <SiteFooter />
    </AipUsageBasedLlmPageShell>
  );
}
