import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  AipUsageBasedLlmComparisonImage,
  AipUsageBasedLlmComparisonSection,
  AipUsageBasedLlmComparisonTitle,
  AipUsageBasedLlmCtaButtonWrap,
  AipUsageBasedLlmCtaDescription,
  AipUsageBasedLlmFeatureBand,
  AipUsageBasedLlmFeatureBody,
  AipUsageBasedLlmFeatureCopy,
  AipUsageBasedLlmFeatureImage,
  AipUsageBasedLlmFeatureRow,
  AipUsageBasedLlmFeatureTitle,
  AipUsageBasedLlmHeroDescription,
  AipUsageBasedLlmHeroImage,
  AipUsageBasedLlmHeroSection,
  AipUsageBasedLlmHeroTitle,
  AipUsageBasedLlmLineBreak,
  AipUsageBasedLlmPageShell,
} from "@/components/sections/aip-usage-based-llm";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { CtaContent, CtaCopy, CtaTitle, SimpleCtaSection } from "@/components/sections/simple-cta-section";
import { BrandGradientCtaButton } from "@/components/ui/brand-gradient-cta-button";

export const metadata: Metadata = {
  title: "QueryPie AIP：実際使用量ベースエンタープライズAI | QueryPie AI",
  description:
    "固定費なしで使った分だけ支払える QueryPie AIP の従量課金型エンタープライズAIページ。プレミアムLLM、SSO、コスト最適化を一体で提供します。",
  alternates: {
    canonical: "/t/solutions/aip/usage-based-llm",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AipUsageBasedLlmPage() {
  return (
    <AipUsageBasedLlmPageShell>
      <SiteHeader />

      <AipUsageBasedLlmHeroSection>
        <RevealOnScroll>
          <AipUsageBasedLlmHeroTitle>
            QueryPie AIP
            <br />
            従量課金型エンタープライズAI
          </AipUsageBasedLlmHeroTitle>
        </RevealOnScroll>

        <RevealOnScroll delayMs={60}>
          <AipUsageBasedLlmHeroDescription>
            QueryPie AIPは、ブラウザで使えるプラットフォーム。ダウンロード不要、セットアップ不要で即座にアクセスできます。
            <AipUsageBasedLlmLineBreak />
            固定費用なしで使った分だけ支払う従量課金型だから、ChatGPTと比較して最大90%*のコスト削減を実現。
            <AipUsageBasedLlmLineBreak />
            小さく始めて効果を見ながら段階的に拡大できます。*ユーザーの利用量により異なります
          </AipUsageBasedLlmHeroDescription>
        </RevealOnScroll>

        <RevealOnScroll delayMs={120}>
          <AipUsageBasedLlmHeroImage />
        </RevealOnScroll>
      </AipUsageBasedLlmHeroSection>

      <AipUsageBasedLlmFeatureBand muted>
        <AipUsageBasedLlmFeatureRow>
          <RevealOnScroll>
            <AipUsageBasedLlmFeatureCopy className="max-w-[417px]">
              <AipUsageBasedLlmFeatureTitle>利用量に応じた課金モデル</AipUsageBasedLlmFeatureTitle>
              <AipUsageBasedLlmFeatureBody>
                使った分だけ支払う従量課金型。
                <AipUsageBasedLlmLineBreak />
                高額な月額固定費がないので無駄がありません。
                <AipUsageBasedLlmLineBreak />
                あらゆる規模の組織にとって、AI導入が手軽で拡張も簡単です。
              </AipUsageBasedLlmFeatureBody>
            </AipUsageBasedLlmFeatureCopy>
          </RevealOnScroll>

          <RevealOnScroll delayMs={80}>
            <AipUsageBasedLlmFeatureImage
              src="/solutions/aip/usage-based-llm/pay.gif"
              alt="利用量に応じた課金モデル"
              width={540}
              height={304}
              className="justify-end"
            />
          </RevealOnScroll>
        </AipUsageBasedLlmFeatureRow>
      </AipUsageBasedLlmFeatureBand>

      <AipUsageBasedLlmFeatureBand>
        <AipUsageBasedLlmFeatureRow>
          <RevealOnScroll delayMs={80}>
            <AipUsageBasedLlmFeatureImage
              src="/solutions/aip/usage-based-llm/premium-llm.gif"
              alt="選択可能なプレミアムLLM (大規模言語モデル)"
              width={580}
              height={326}
              className="justify-start"
            />
          </RevealOnScroll>

          <RevealOnScroll>
            <AipUsageBasedLlmFeatureCopy className="ml-auto">
              <AipUsageBasedLlmFeatureTitle>
                選択可能なプレミアムLLM
                <br />
                (大規模言語モデル)
              </AipUsageBasedLlmFeatureTitle>
              <AipUsageBasedLlmFeatureBody>
                ChatGPT、Claude、Geminiなど、業界をリードするAIモデルにアクセス。
                <AipUsageBasedLlmLineBreak />
                ニーズに適したAIを選択し、チームの生産性を瞬時に向上します。
              </AipUsageBasedLlmFeatureBody>
            </AipUsageBasedLlmFeatureCopy>
          </RevealOnScroll>
        </AipUsageBasedLlmFeatureRow>
      </AipUsageBasedLlmFeatureBand>

      <AipUsageBasedLlmFeatureBand muted>
        <AipUsageBasedLlmFeatureRow>
          <RevealOnScroll>
            <AipUsageBasedLlmFeatureCopy className="max-w-[485px]">
              <AipUsageBasedLlmFeatureTitle>シングルサインオン(SSO) で一元管理</AipUsageBasedLlmFeatureTitle>
              <AipUsageBasedLlmFeatureBody>
                既存のアイデンティティプロバイダーとSSO連携し、
                <AipUsageBasedLlmLineBreak />
                シームレスにログイン。すべてのアカウントを一元管理し、
                <AipUsageBasedLlmLineBreak />
                セキュリティと管理体制を強化します。
              </AipUsageBasedLlmFeatureBody>
            </AipUsageBasedLlmFeatureCopy>
          </RevealOnScroll>

          <RevealOnScroll delayMs={80}>
            <AipUsageBasedLlmFeatureImage
              src="/solutions/aip/usage-based-llm/sso.gif"
              alt="シングルサインオン(SSO) で一元管理"
              width={520}
              height={293}
              className="justify-end"
            />
          </RevealOnScroll>
        </AipUsageBasedLlmFeatureRow>
      </AipUsageBasedLlmFeatureBand>

      <AipUsageBasedLlmComparisonSection>
        <RevealOnScroll>
          <AipUsageBasedLlmComparisonTitle>最高のパフォーマンスを、最適なコストで！</AipUsageBasedLlmComparisonTitle>
        </RevealOnScroll>

        <RevealOnScroll delayMs={80}>
          <AipUsageBasedLlmComparisonImage />
        </RevealOnScroll>
      </AipUsageBasedLlmComparisonSection>

      <SimpleCtaSection>
        <RevealOnScroll>
          <CtaContent className="gap-0">
            <CtaCopy>
              <CtaTitle>まずは小さく、失敗しないAXを始めよう</CtaTitle>
              <AipUsageBasedLlmCtaDescription>簡単サインアップで、14日間の無料トライアルをお試しください</AipUsageBasedLlmCtaDescription>
              <AipUsageBasedLlmCtaButtonWrap>
                <BrandGradientCtaButton href="https://app.querypie.com/">
                  無料で試してみる
                </BrandGradientCtaButton>
              </AipUsageBasedLlmCtaButtonWrap>
            </CtaCopy>
          </CtaContent>
        </RevealOnScroll>
      </SimpleCtaSection>

      <SiteFooter />
    </AipUsageBasedLlmPageShell>
  );
}
