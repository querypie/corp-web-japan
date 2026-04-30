import type { Metadata } from "next";
import { ShieldCheck, Users, Zap } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingConversionCta } from "@/components/layout/floating-conversion-cta";
import { SiteHeader } from "@/components/layout/site-header";
import {
  HeroActionGroup,
  HeroBody,
  HeroEyebrow,
  HeroPanel,
  HeroPrimaryAction,
  HeroProofPill,
  HeroProofPillGroup,
  HeroSecondaryAction,
  HeroSection,
  HeroSubcopy,
  HeroTitle,
  HeroTitleLine,
} from "@/components/sections/top-page-hero-section";
import { TopPageSections } from "@/components/sections/top-page-sections";
import {
  CoreValueBody,
  CoreValueBullet,
  CoreValueBulletList,
  CoreValueCard,
  CoreValueCardBadge,
  CoreValueCardHeader,
  CoreValueCardIcon,
  CoreValueCardTitle,
  CoreValueCardTitleWrap,
  CoreValueGrid,
  CoreValueIntro,
  CoreValueSection,
  CoreValueTitle,
} from "@/components/sections/top-page-core-value-section";
import {
  RoadmapBody,
  RoadmapCallout,
  RoadmapCalloutBadge,
  RoadmapCalloutBody,
  RoadmapIntro,
  RoadmapLinkAction,
  RoadmapLinkBody,
  RoadmapLinkCard,
  RoadmapLinkGrid,
  RoadmapLinkTitle,
  RoadmapSection,
  RoadmapStep,
  RoadmapTab,
  RoadmapTabs,
  RoadmapTitle,
} from "@/components/sections/top-page-roadmap-section";
import {
  SolutionChoiceContent,
  SolutionChoiceGroup,
  SolutionChoiceHeading,
  SolutionOverviewIntro,
  SolutionOverviewLead,
  SolutionOverviewLeadGroup,
  SolutionOverviewSection,
  SolutionOverviewTitle,
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
import {
  topPageDownloadUrl,
  topPageFloatingCtaUrl,
  topPageHeroContactUrl,
  topPageMetadata,
} from "@/content/top-page";

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
      <HeroSection
        imageSrc="/top-hero.png"
        imageAlt="QueryPie AIの導入イメージを想起させる、オフィスでAIダッシュボードを活用するチーム"
      >
        <HeroProofPillGroup>
          <HeroProofPill>国際基準のセキュリティ</HeroProofPill>
          <HeroProofPill>テスト導入から全社展開へ</HeroProofPill>
          <HeroProofPill>組織・役割に応じた権限管理</HeroProofPill>
        </HeroProofPillGroup>

        <HeroPanel>
          <HeroEyebrow>Secure Enterprise AI</HeroEyebrow>
          <HeroTitle>
            <HeroTitleLine>信頼できるAIが、</HeroTitleLine>
            <HeroTitleLine delayed>現場を動かす</HeroTitleLine>
          </HeroTitle>
          <HeroSubcopy>誰もが安全かつ迅速に業務で使えるAI</HeroSubcopy>
          <HeroBody>
            QueryPie AIは、強固なセキュリティとガバナンスを前提としたエンタープライズAI基盤を提供します。経営層が求める「信頼」と、現場が求める「使いやすさ」を両立し、AI活用をスモールスタートから実運用・定着まで前に進めます。
          </HeroBody>
          <HeroActionGroup>
            <HeroPrimaryAction href={topPageHeroContactUrl}>お問い合わせ</HeroPrimaryAction>
            <HeroSecondaryAction href={topPageDownloadUrl}>資料をダウンロード</HeroSecondaryAction>
          </HeroActionGroup>
        </HeroPanel>
      </HeroSection>
      <TopPageSections>
        <SolutionOverviewSection>
          <SolutionOverviewIntro>
            <SolutionOverviewTitle>
              AI活用は、単なる業務効率化にとどまらない
              <span className="heading-highlight-accent">経営課題</span>
              への対策
            </SolutionOverviewTitle>

            <SolutionOverviewLeadGroup>
              <SolutionOverviewLead>
                AI活用の真の目的は、日々の作業を減らすことではなく、企業全体の生産性と利益率を向上させることにあります。
              </SolutionOverviewLead>
              <SolutionOverviewLead>
                QueryPie AIは、<strong className="font-bold text-[#174EA6]">社内業務の劇的な効率化がもたらすコスト削減</strong>と、
                <strong className="font-bold text-[#B85733]">自社サービスの価値向上を通じた売上拡大</strong>
                という2つのアプローチで、貴社の経営課題の解決を支援します。
              </SolutionOverviewLead>
            </SolutionOverviewLeadGroup>
          </SolutionOverviewIntro>

          <SolutionChoiceGroup>
            <SolutionChoiceCard href="/solutions/ai-crew" tone="crew">
              <SolutionChoiceHeader>
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
              <SolutionChoiceHeader>
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

        <CoreValueSection>
          <CoreValueIntro>
            <CoreValueTitle>
              AI導入の壁は、技術ではなく
              <span className="heading-highlight-accent">信頼と定着</span>
            </CoreValueTitle>
            <CoreValueBody>
              QueryPie AIは、企業のAI活用を前に進めるために不可欠な3つの条件を備えています。
            </CoreValueBody>
          </CoreValueIntro>

          <CoreValueGrid>
            <CoreValueCard>
              <CoreValueCardHeader>
                <CoreValueCardBadge>01 信頼</CoreValueCardBadge>
                <CoreValueCardIcon>
                  <ShieldCheck className="h-5 w-5" />
                </CoreValueCardIcon>
              </CoreValueCardHeader>
              <CoreValueCardTitleWrap>
                <CoreValueCardTitle>安全性とガバナンス</CoreValueCardTitle>
              </CoreValueCardTitleWrap>
              <CoreValueBulletList>
                <CoreValueBullet>組織・役割に応じた緻密な権限管理と監査対応</CoreValueBullet>
                <CoreValueBullet>入力データの外部学習なし</CoreValueBullet>
                <CoreValueBullet>エンタープライズ基準の安全な環境</CoreValueBullet>
              </CoreValueBulletList>
            </CoreValueCard>

            <CoreValueCard>
              <CoreValueCardHeader>
                <CoreValueCardBadge>02 速さ</CoreValueCardBadge>
                <CoreValueCardIcon>
                  <Zap className="h-5 w-5" />
                </CoreValueCardIcon>
              </CoreValueCardHeader>
              <CoreValueCardTitleWrap>
                <CoreValueCardTitle>開発・導入スピード</CoreValueCardTitle>
              </CoreValueCardTitleWrap>
              <CoreValueBulletList>
                <CoreValueBullet>既存の社内データや業務システムとシームレスに連携</CoreValueBullet>
                <CoreValueBullet>ゼロからの開発を省略</CoreValueBullet>
                <CoreValueBullet>業務で使える状態を素早く構築</CoreValueBullet>
              </CoreValueBulletList>
            </CoreValueCard>

            <CoreValueCard>
              <CoreValueCardHeader>
                <CoreValueCardBadge>03 現場定着</CoreValueCardBadge>
                <CoreValueCardIcon>
                  <Users className="h-5 w-5" />
                </CoreValueCardIcon>
              </CoreValueCardHeader>
              <CoreValueCardTitleWrap>
                <CoreValueCardTitle>運用・活用支援</CoreValueCardTitle>
              </CoreValueCardTitleWrap>
              <CoreValueBulletList>
                <CoreValueBullet>現場が迷わず使えるUIとワークフロー設計</CoreValueBullet>
                <CoreValueBullet>テスト導入で終わらせない</CoreValueBullet>
                <CoreValueBullet>全社展開に向けた運用改善まで伴走</CoreValueBullet>
              </CoreValueBulletList>
            </CoreValueCard>
          </CoreValueGrid>
        </CoreValueSection>

        <RoadmapSection>
          <RoadmapIntro>
            <RoadmapTitle>
              小さく始めて、確実に広げる
              <br />
              <span className="heading-highlight-accent">失敗しない</span>
              AI導入へのロードマップ
            </RoadmapTitle>
            <RoadmapBody>
              社内業務の効率化でも、自社サービスへのAI組み込みでも、大切なのは成果の出る領域から始めて、検証しながら運用へ広げることです。QueryPie AIは、両方のアプローチに対応できる現実的な導入ステップで、AI活用を定着へつなげます。
            </RoadmapBody>
          </RoadmapIntro>

          <RoadmapTabs>
            <RoadmapTab tabKey="crew" label="社内業務効率化">
              <RoadmapStep label="特定業務でのスモールスタート" title={<><span className="heading-highlight-accent">成果の出る</span>領域を見極める</>}>
                既存の業務フローを分析し、最も負荷が高く、<strong className="font-bold text-slate-800">AIによるコスト削減や価値向上が見込める業務に絞ってAIエージェントを適用</strong>します。まずは一つの部門で確実な成功体験を作ります。
              </RoadmapStep>
              <RoadmapStep label="効果測定と現場へのチューニング" title={<>現場が<span className="heading-highlight-accent">使い続ける</span>仕組みを作る</>}>
                単なるツールの提供で終わらず、<strong className="font-bold text-slate-800">現場のフィードバックをもとにプロンプトや参照データを調整</strong>します。使われるためのUI/UXと運用ルールを固め、ROI（投資対効果）を可視化します。
              </RoadmapStep>
              <RoadmapStep label="ガバナンスを効かせた全社展開" title={<>安全に、<span className="heading-highlight-accent">会社全体の基盤</span>へ拡張する</>}>
                QueryPie AIの強みである<strong className="font-bold text-slate-800">緻密な権限制御と監査ログを活用し、セキュリティを担保したまま他部門や自社サービスへ横展開</strong>します。一部署のツールから、全社の経営基盤へと進化させます。
              </RoadmapStep>
            </RoadmapTab>
            <RoadmapTab tabKey="dashi" label="自社サービスAI化">
              <RoadmapStep label="対象機能と要件の定義" title={<><span className="heading-highlight-accent">事業価値の高い</span>AI機能を定める</>}>
                既存のSaaSやWebサービスを分析し、<strong className="font-bold text-slate-800">顧客体験の向上やアップセルにつながるAI機能を特定</strong>します。まずは一つの導線・一つの業務体験から設計を始めます。
              </RoadmapStep>
              <RoadmapStep label="API連携と導入検証" title={<><span className="heading-highlight-accent">既存システムと安全に</span>つなぐ</>}>
                UI/UXを変えすぎず、<strong className="font-bold text-slate-800">既存データや業務システムとAPI経由で統合</strong>します。導入前の検証で精度・運用性・ガードレールを確認しながら調整します。
              </RoadmapStep>
              <RoadmapStep label="自社ブランドでの本番展開" title={<><span className="heading-highlight-accent">継続提供できる</span>AI機能へ育てる</>}>
                リリース後も<strong className="font-bold text-slate-800">監査・権限制御・改善運用を前提に継続提供</strong>し、単発機能ではなく自社サービスの競争力として育てます。
              </RoadmapStep>
            </RoadmapTab>
          </RoadmapTabs>

          <RoadmapCallout>
            <RoadmapCalloutBadge>Solutions</RoadmapCalloutBadge>
            <RoadmapCalloutBody>社内業務の効率化と、自社サービスのAI化。目的に合わせて2つのソリューションを選べます。</RoadmapCalloutBody>
          </RoadmapCallout>

          <RoadmapLinkGrid>
            <RoadmapLinkCard href="/solutions/ai-crew" imageSrc="/top-assets/roadmap-links/ai-crew-link.svg" imageAlt="AI Crew の具体的な業務ユースケースを示す背景イメージ" tone="crew">
              <RoadmapLinkTitle>AIで社内業務を大幅に効率化したい</RoadmapLinkTitle>
              <RoadmapLinkBody>専用AIエージェントで、調査・整理・下書きなどの下準備を任せ、人が本来の判断や改善に集中できる状態をつくります。</RoadmapLinkBody>
              <RoadmapLinkAction>社内業務効率化の進め方を見る</RoadmapLinkAction>
            </RoadmapLinkCard>
            <RoadmapLinkCard href="/solutions/ai-dashi" imageSrc="/top-assets/roadmap-links/ai-dashi-link.svg" imageAlt="AI Dashi の組み込み方を示す背景イメージ" tone="dashi">
              <RoadmapLinkTitle>SaaSやWebサービスのAI化を進めたい</RoadmapLinkTitle>
              <RoadmapLinkBody>既存のSaaSやWebサービスにAI機能を組み込み、顧客体験の向上や新たな収益機会につなげます。</RoadmapLinkBody>
              <RoadmapLinkAction>自社サービスAI化の進め方を見る</RoadmapLinkAction>
            </RoadmapLinkCard>
          </RoadmapLinkGrid>
        </RoadmapSection>
      </TopPageSections>
      <SiteFooter />
    </main>
  );
}
