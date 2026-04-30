import type { Metadata } from "next";
import { Blocks, Users } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingConversionCta } from "@/components/layout/floating-conversion-cta";
import { SiteHeader } from "@/components/layout/site-header";
import { TopPageSections } from "@/components/sections/top-page-sections";
import {
  SolutionChoiceContent,
  SolutionChoiceGroup,
  SolutionChoiceHeading,
  SolutionOverviewIntro,
  SolutionOverviewLead,
  SolutionOverviewSection,
} from "@/components/sections/top-page-solution-overview-section";
import {
  SolutionChoiceAction,
  SolutionChoiceBadge,
  SolutionChoiceCard,
  SolutionChoiceDescription,
  SolutionChoiceHeader,
  SolutionChoiceSubtitle,
  SolutionChoiceTitle,
} from "@/components/sections/top-page-solution-choice-card";
import { topPageFloatingCtaUrl, topPageMetadata } from "@/content/top-page";

export const metadata: Metadata = {
  title: topPageMetadata.title,
  description: topPageMetadata.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: topPageMetadata.title,
    description: topPageMetadata.description,
    type: "website",
  },
  twitter: {
    title: topPageMetadata.title,
    description: topPageMetadata.description,
    card: "summary_large_image",
  },
};

export default function HomePage() {
  return (
    <main className="relative overflow-x-hidden bg-white pt-[72px] text-slate-950">
      <SiteHeader />
      <FloatingConversionCta href={topPageFloatingCtaUrl} />
      <TopPageSections>
        <SolutionOverviewSection>
          <SolutionOverviewIntro
            title={
              <>
                AI活用は、単なる業務効率化にとどまらない
                <span className="heading-highlight-accent">経営課題</span>
                への対策
              </>
            }
          >
            <SolutionOverviewLead>
              AI活用の真の目的は、日々の作業を減らすことではなく、企業全体の生産性と利益率を向上させることにあります。
            </SolutionOverviewLead>
            <SolutionOverviewLead>
              QueryPie AIは、<strong className="font-bold text-[#174EA6]">社内業務の劇的な効率化がもたらすコスト削減</strong>と、
              <strong className="font-bold text-[#B85733]">自社サービスの価値向上を通じた売上拡大</strong>
              という2つのアプローチで、貴社の経営課題の解決を支援します。
            </SolutionOverviewLead>
          </SolutionOverviewIntro>

          <SolutionChoiceGroup>
            <SolutionChoiceCard href="/solutions/ai-crew" tone="crew">
              <SolutionChoiceHeader icon={Users}>
                <SolutionChoiceBadge>AI Crew</SolutionChoiceBadge>
              </SolutionChoiceHeader>
              <SolutionChoiceContent>
                <SolutionChoiceHeading>
                  <SolutionChoiceTitle>AIで社内業務を大幅に効率化したい</SolutionChoiceTitle>
                  <SolutionChoiceSubtitle>専用AIエージェントの設計・実運用支援</SolutionChoiceSubtitle>
                </SolutionChoiceHeading>
                <SolutionChoiceDescription>
                  業務に合わせた専用AIエージェントを設計し、導入から運用、改善までを伴走支援します。テスト導入で終わらず、現場で使われるAI活用へつなげます。
                </SolutionChoiceDescription>
                <SolutionChoiceAction>社内業務効率化の進め方を見る</SolutionChoiceAction>
              </SolutionChoiceContent>
            </SolutionChoiceCard>

            <SolutionChoiceCard href="/solutions/ai-dashi" tone="dashi">
              <SolutionChoiceHeader icon={Blocks}>
                <SolutionChoiceBadge>AI Dashi</SolutionChoiceBadge>
              </SolutionChoiceHeader>
              <SolutionChoiceContent>
                <SolutionChoiceHeading>
                  <SolutionChoiceTitle>SaaSやWebサービスのAI化を進めたい</SolutionChoiceTitle>
                  <SolutionChoiceSubtitle>組み込み型AI基盤・ホワイトラベル対応</SolutionChoiceSubtitle>
                </SolutionChoiceHeading>
                <SolutionChoiceDescription>
                  自社SaaSやWebサービスに組み込める、エンタープライズ向けAI基盤です。安全性、拡張性、運用性を備えたAI機能を、自社ブランドで既存のサービスに展開できます。
                </SolutionChoiceDescription>
                <SolutionChoiceAction>自社サービスAI化の進め方を見る</SolutionChoiceAction>
              </SolutionChoiceContent>
            </SolutionChoiceCard>
          </SolutionChoiceGroup>
        </SolutionOverviewSection>
      </TopPageSections>
      <SiteFooter />
    </main>
  );
}
