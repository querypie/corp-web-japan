import type { Metadata } from "next";
import {
  ArrowRight,
  BriefcaseBusiness,
  Cable,
  CalendarDays,
  ChartColumnIncreasing,
  FileSearch,
  FolderKanban,
  Layers3,
  Megaphone,
  MessageSquareText,
  Play,
  Search,
  Settings2,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import {
  aiCrewConsultUrl,
  aiCrewFloatingCtaUrl,
  aiCrewWhitepaperUrl,
  demoUseCasesUrl,
  homePageContent,
} from "@/content/home";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingConversionCta } from "@/components/layout/floating-conversion-cta";
import { SiteHeader } from "@/components/layout/site-header";
import {
  AICrewAboutBody,
  AICrewAboutImage,
  AICrewAboutIntro,
  AICrewAboutSection,
  AICrewAboutShell,
  AICrewAboutTitle,
} from "@/components/sections/ai-crew-about-section";
import {
  AICrewLostProblemBody,
  AICrewLostProblemCard,
  AICrewLostProblemContent,
  AICrewLostProblemTitle,
  AICrewLostSection,
  AICrewLostWhitepaperAction,
  AICrewLostWhitepaperBody,
  AICrewLostWhitepaperCard,
  AICrewLostWhitepaperContent,
  AICrewLostWhitepaperEyebrow,
  AICrewLostWhitepaperTitle,
} from "@/components/sections/ai-crew-lost-section";
import {
  AICrewContactActionGroup,
  AICrewContactBody,
  AICrewContactIntro,
  AICrewContactPrimaryAction,
  AICrewContactSecondaryAction,
  AICrewContactSection,
  AICrewContactShell,
  AICrewContactTitle,
  AICrewDashiPromo,
  AICrewDashiPromoAction,
  AICrewDashiPromoBody,
  AICrewDashiPromoContent,
  AICrewDashiPromoEyebrow,
  AICrewDashiPromoIcon,
  AICrewDashiPromoPanel,
  AICrewDashiPromoPanelHeader,
  AICrewDashiPromoPanelItem,
  AICrewDashiPromoPanelLabel,
  AICrewDashiPromoPanelList,
  AICrewDashiPromoPanelStatusDot,
  AICrewDashiPromoTitle,
  AICrewDashiPromoVisual,
  AICrewDashiPromoVisualOrb,
} from "@/components/sections/ai-crew-contact-section";
import {
  AICrewWhyAfterCard,
  AICrewWhyAfterCardSubtitle,
  AICrewWhyAfterDesktopLayout,
  AICrewWhyAfterMobileLayout,
  AICrewWhyAfterOrbitItem,
  AICrewWhyBeforeCard,
  AICrewWhyBeforeCardSubtitle,
  AICrewWhyBeforePainPoint,
  AICrewWhyBody,
  AICrewWhyComparisonShell,
  AICrewWhyDesktopTaskColumn,
  AICrewWhyHumanDecisionCore,
  AICrewWhyIntro,
  AICrewWhySection,
  AICrewWhyTaskColumn,
  AICrewWhyTaskItem,
  AICrewWhyTitle,
} from "@/components/sections/ai-crew-why-section";
import {
  AICrewHeroActions,
  AICrewHeroBody,
  AICrewHeroContent,
  AICrewHeroEyebrow,
  AICrewHeroPrimaryAction,
  AICrewHeroSecondaryAction,
  AICrewHeroSection,
  AICrewHeroShell,
  AICrewHeroSubcopy,
  AICrewHeroTitle,
  AICrewHeroTitleLine,
  AICrewHeroVisual,
} from "@/components/sections/ai-crew-hero-section";
import {
  AICrewPlatformAccent,
  AICrewPlatformBody,
  AICrewPlatformCard,
  AICrewPlatformCardBody,
  AICrewPlatformCardBullet,
  AICrewPlatformCardStat,
  AICrewPlatformCardTitle,
  AICrewPlatformCore,
  AICrewPlatformCoreBody,
  AICrewPlatformCoreEyebrow,
  AICrewPlatformCoreTitle,
  AICrewPlatformDiagram,
  AICrewPlatformHeader,
  AICrewPlatformSection,
  AICrewPlatformTitle,
} from "@/components/sections/ai-crew-platform-section";
import {
  AICrewResultsBody,
  AICrewResultsCard,
  AICrewResultsCardBody,
  AICrewResultsCardBrand,
  AICrewResultsCardCompany,
  AICrewResultsCardIdentity,
  AICrewResultsCardMeta,
  AICrewResultsCardName,
  AICrewResultsCards,
  AICrewResultsHighlight,
  AICrewResultsIntro,
  AICrewResultsPricing,
  AICrewResultsPricingBody,
  AICrewResultsPricingBodyLine,
  AICrewResultsPricingCard,
  AICrewResultsPricingCardBody,
  AICrewResultsPricingCardTitle,
  AICrewResultsPricingGrid,
  AICrewResultsPricingHeader,
  AICrewResultsPricingIcon,
  AICrewResultsPricingTitle,
  AICrewResultsSection,
  AICrewResultsTitle,
} from "@/components/sections/ai-crew-results-section";
import {
  AICrewProcessActionGroup,
  AICrewProcessBody,
  AICrewProcessCtaBadge,
  AICrewProcessCtaCard,
  AICrewProcessCtaHeader,
  AICrewProcessCtaIcon,
  AICrewProcessCtaLead,
  AICrewProcessGrid,
  AICrewProcessIntro,
  AICrewProcessPrimaryAction,
  AICrewProcessSecondaryAction,
  AICrewProcessSection,
  AICrewProcessStepBadge,
  AICrewProcessStepBody,
  AICrewProcessStepCard,
  AICrewProcessStepHeader,
  AICrewProcessStepIcon,
  AICrewProcessStepTitle,
  AICrewProcessTitle,
} from "@/components/sections/ai-crew-process-section";
import {
  AICrewDesignElementBody,
  AICrewDesignElementCard,
  AICrewDesignElementHeading,
  AICrewDesignElementsGrid,
  AICrewDesignElementsSection,
  AICrewDesignElementsTitle,
} from "@/components/sections/ai-crew-design-elements-section";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import {
  AICrewUseCaseCard,
  AICrewUseCaseCardBody,
  AICrewUseCaseCardCategory,
  AICrewUseCaseCardTitle,
  AICrewUseCasesActions,
  AICrewUseCasesBody,
  AICrewUseCasesFooter,
  AICrewUseCasesGrid,
  AICrewUseCasesIntro,
  AICrewUseCasesNote,
  AICrewUseCasesPrimaryAction,
  AICrewUseCasesSecondaryAction,
  AICrewUseCasesSection,
  AICrewUseCasesTitle,
  AICrewUseCaseTab,
  AICrewUseCaseTabbedCard,
} from "@/components/sections/ai-crew-use-cases-section";

export const metadata: Metadata = {
  title: "作業を減らし、成果を増やす。| AI Crew | QueryPie AI",
  description: homePageContent.metadata.description,
  alternates: {
    canonical: "/solutions/ai-crew",
  },
  openGraph: {
    title: "作業を減らし、成果を増やす。| AI Crew | QueryPie AI",
    description: homePageContent.metadata.description,
    type: "website",
  },
  twitter: {
    title: "作業を減らし、成果を増やす。| AI Crew | QueryPie AI",
    description: homePageContent.metadata.description,
    card: "summary_large_image",
  },
};

export default function AICrewPage() {
  return (
    <main className="relative overflow-x-hidden bg-white pt-[72px] text-slate-950">
      <SiteHeader />
      <FloatingConversionCta href={aiCrewFloatingCtaUrl} />
      <AICrewHeroSection>
        <AICrewHeroShell>
          <AICrewHeroContent>
            <AICrewHeroEyebrow>専用AIエージェントの設計・実運用支援</AICrewHeroEyebrow>
            <AICrewHeroTitle>
              <AICrewHeroTitleLine>作業を減らし、</AICrewHeroTitleLine>
              <AICrewHeroTitleLine accent delayMs={120}>成果を増やす。</AICrewHeroTitleLine>
            </AICrewHeroTitle>
            <AICrewHeroSubcopy>利益を生み出す実務特化型AIエージェント</AICrewHeroSubcopy>
            <AICrewHeroBody>
              <p>
                調査、データ整理、下書きなど、時間のかかる「下準備」をAIに任せて効率化。人員を増やすことなく、企業の生産性・利益率の向上を実現します。
              </p>
            </AICrewHeroBody>
            <AICrewHeroActions>
              <AICrewHeroPrimaryAction href={aiCrewConsultUrl}>
                業務に合うAI活用を相談する
              </AICrewHeroPrimaryAction>
              <AICrewHeroSecondaryAction href={demoUseCasesUrl}>
                活用事例を見る
                <ArrowRight className="h-4 w-4" />
              </AICrewHeroSecondaryAction>
            </AICrewHeroActions>
          </AICrewHeroContent>
          <AICrewHeroVisual
            src="/solutions/ai-crew/hero-visual.webp"
            alt="オフィスでAIアシスタント画面を活用しながら業務を進めるチームのイメージ"
          />
        </AICrewHeroShell>
      </AICrewHeroSection>
      <AICrewLostSection>
        <AICrewLostProblemCard>
          <AICrewLostProblemContent>
            <AICrewLostProblemTitle>
              人手不足と見えないコストが、企業の成長を鈍化させる。
            </AICrewLostProblemTitle>
            <AICrewLostProblemBody>
              <p>労働人口の減少と人件費の高騰が続く中、多くの企業が「人が足りない」「採用できない」という深刻な課題に直面しています。</p>
              <p>しかし、本当に人が足りないのでしょうか？ 現場の実態は、情報収集、データの転記、資料の下書きといった付加価値を生まない作業（＝見えないコスト）に、優秀な社員の貴重な時間が奪われているケースがほとんどです。</p>
              <p>「残業でカバーする」「人を増やして解決する」という従来のやり方は、もはや限界を迎えています。この非効率を放置し、社員を疲弊させ続けることは、企業の利益を削り落とし、競争力を失う最大の経営リスクなのです。</p>
            </AICrewLostProblemBody>
          </AICrewLostProblemContent>
        </AICrewLostProblemCard>

        <AICrewLostWhitepaperCard>
          <AICrewLostWhitepaperContent>
            <AICrewLostWhitepaperEyebrow>White Paper</AICrewLostWhitepaperEyebrow>
            <AICrewLostWhitepaperTitle>
              なぜ今、日本企業がAIトランスフォーメーションに取り組むべきなのか
            </AICrewLostWhitepaperTitle>
            <AICrewLostWhitepaperBody>
              AI活用を単なる業務改善で終わらせず、事業変革につなげるための視点をまとめました。
            </AICrewLostWhitepaperBody>
          </AICrewLostWhitepaperContent>
          <AICrewLostWhitepaperAction href={aiCrewWhitepaperUrl}>
            ホワイトペーパーを読む
          </AICrewLostWhitepaperAction>
        </AICrewLostWhitepaperCard>
      </AICrewLostSection>
      <AICrewAboutSection>
        <AICrewAboutShell>
          <AICrewAboutIntro>
            <AICrewAboutTitle>
              AI Agentではなく、<strong>AI Crew</strong>
            </AICrewAboutTitle>
            <AICrewAboutBody>
              <p>
                AIを単なる便利なツールとしてではなく、貴社のチームに加わる
                <strong>「新しい同僚」</strong>
                として迎え入れる。それが私たちの考え方です。
              </p>
              <p>
                企業の業務効率化に必要なのは、人間が指示を考えながら操作しなければならない汎用AIではありません。貴社の業務フローやルールを理解し、面倒な情報収集やデータ整理といった下準備を自律的に巻き取ってくれる、優秀な部下やアシスタントのような存在です。
              </p>
              <p>
                QueryPie AIが提供するAIプラットフォーム（AIP）は、システムとして裏側で動くだけでなく、各業務に合ったAIエージェントを構築し、現場の仲間（Crew）の一員として実務を分担。チーム全体の生産性を劇的に引き上げる最高品質のAIソリューションです。
              </p>
            </AICrewAboutBody>
          </AICrewAboutIntro>
          <AICrewAboutImage
            src="/solutions/ai-crew/concept-team.webp"
            alt="人とAI Crewが同じチームの一員として業務を分担するイメージ"
          />
        </AICrewAboutShell>
      </AICrewAboutSection>
      <AICrewWhySection>
        <AICrewWhyIntro>
          <AICrewWhyTitle>
            AIに下準備を任せ、人は
            <strong>判断と創造</strong>
            に集中する
          </AICrewWhyTitle>
          <AICrewWhyBody>
            <strong>現場が止まるのは、判断の前にある業務が多すぎるから。</strong>
            情報収集、データ整理、一次ドラフト作成、ログ確認などの下準備をAIに任せることで、人は最終判断、顧客対応、企画や改善など、本来注力すべき仕事に集中できます。
          </AICrewWhyBody>
        </AICrewWhyIntro>

        <AICrewWhyComparisonShell>
          <AICrewWhyBeforeCard>
            <AICrewWhyBeforeCardSubtitle>一次対応に時間がかかる</AICrewWhyBeforeCardSubtitle>
            <AICrewWhyBeforePainPoint>情報が散らばり調査と確認に時間がかかる</AICrewWhyBeforePainPoint>
            <AICrewWhyBeforePainPoint>下準備が多く本来の判断に時間を使えない</AICrewWhyBeforePainPoint>
          </AICrewWhyBeforeCard>

          <AICrewWhyAfterCard>
            <AICrewWhyAfterCardSubtitle>役割分担が整理され、本来の業務に集中</AICrewWhyAfterCardSubtitle>
            <AICrewWhyAfterMobileLayout centerCore={<AICrewWhyHumanDecisionCore>人による最終判断</AICrewWhyHumanDecisionCore>}>
              <AICrewWhyTaskColumn label="人">
                <AICrewWhyTaskItem>最終判断</AICrewWhyTaskItem>
                <AICrewWhyTaskItem>顧客対応</AICrewWhyTaskItem>
                <AICrewWhyTaskItem>提案</AICrewWhyTaskItem>
                <AICrewWhyTaskItem>企画</AICrewWhyTaskItem>
                <AICrewWhyTaskItem>改善</AICrewWhyTaskItem>
              </AICrewWhyTaskColumn>

              <AICrewWhyTaskColumn label="AI">
                <AICrewWhyTaskItem>調査</AICrewWhyTaskItem>
                <AICrewWhyTaskItem>整理</AICrewWhyTaskItem>
                <AICrewWhyTaskItem>一次ドラフト</AICrewWhyTaskItem>
                <AICrewWhyTaskItem>分析準備</AICrewWhyTaskItem>
                <AICrewWhyTaskItem>リスク検知</AICrewWhyTaskItem>
              </AICrewWhyTaskColumn>
            </AICrewWhyAfterMobileLayout>

            <AICrewWhyAfterDesktopLayout centerCore={<AICrewWhyHumanDecisionCore>人による最終判断</AICrewWhyHumanDecisionCore>}>
              <AICrewWhyAfterOrbitItem icon={Search} label="調査" bubbleClassName="right-[132px] top-[44px]" />
              <AICrewWhyAfterOrbitItem icon={Layers3} label="整理" bubbleClassName="right-[34px] top-[112px]" />
              <AICrewWhyAfterOrbitItem icon={FileSearch} label="一次ドラフト" bubbleClassName="right-[138px] bottom-[118px]" />
              <AICrewWhyAfterOrbitItem icon={ChartColumnIncreasing} label="分析準備" bubbleClassName="right-[30px] bottom-[110px]" />
              <AICrewWhyAfterOrbitItem
                icon={ShieldCheck}
                label="リスク検知"
                bubbleClassName="left-1/2 top-[22px] -translate-x-1/2"
                chipClassName="left-1/2 top-[88px] -translate-x-1/2"
              />

              <AICrewWhyDesktopTaskColumn label="人" side="left">
                <AICrewWhyTaskItem>最終判断</AICrewWhyTaskItem>
                <AICrewWhyTaskItem>顧客対応</AICrewWhyTaskItem>
                <AICrewWhyTaskItem>提案</AICrewWhyTaskItem>
                <AICrewWhyTaskItem>企画</AICrewWhyTaskItem>
                <AICrewWhyTaskItem>改善</AICrewWhyTaskItem>
              </AICrewWhyDesktopTaskColumn>

              <AICrewWhyDesktopTaskColumn label="AI" side="right">
                <AICrewWhyTaskItem>調査</AICrewWhyTaskItem>
                <AICrewWhyTaskItem>整理</AICrewWhyTaskItem>
                <AICrewWhyTaskItem>一次ドラフト</AICrewWhyTaskItem>
                <AICrewWhyTaskItem>分析準備</AICrewWhyTaskItem>
                <AICrewWhyTaskItem>リスク検知</AICrewWhyTaskItem>
              </AICrewWhyDesktopTaskColumn>
            </AICrewWhyAfterDesktopLayout>
          </AICrewWhyAfterCard>
        </AICrewWhyComparisonShell>
      </AICrewWhySection>
      <AICrewDesignElementsSection>
        <AICrewDesignElementsTitle>
          あなたの
          <strong>実務を担う</strong>
          AI、5つの設計要素
        </AICrewDesignElementsTitle>
        <AICrewDesignElementsGrid>
          <RevealOnScroll delayMs={0}>
            <AICrewDesignElementCard label="業務定義">
              <AICrewDesignElementHeading>任せる業務と期待する成果を明確にする</AICrewDesignElementHeading>
              <AICrewDesignElementBody>
                <p>任せる業務と成果物を決め、役割を明確にします。</p>
              </AICrewDesignElementBody>
            </AICrewDesignElementCard>
          </RevealOnScroll>
          <RevealOnScroll delayMs={70}>
            <AICrewDesignElementCard label="文脈設定">
              <AICrewDesignElementHeading>必要なデータと前提知識をつなぐ</AICrewDesignElementHeading>
              <AICrewDesignElementBody>
                <p>必要な社内データや前提知識につなぎ、使える状態に整えます。</p>
              </AICrewDesignElementBody>
            </AICrewDesignElementCard>
          </RevealOnScroll>
          <RevealOnScroll delayMs={140}>
            <AICrewDesignElementCard label="出力設計">
              <AICrewDesignElementHeading>現場で使える形でアウトプットさせる</AICrewDesignElementHeading>
              <AICrewDesignElementBody>
                <p>要約、比較表、一次ドラフトなど、使いやすい形式を定義します。</p>
              </AICrewDesignElementBody>
            </AICrewDesignElementCard>
          </RevealOnScroll>
          <RevealOnScroll delayMs={210}>
            <AICrewDesignElementCard label="権限管理">
              <AICrewDesignElementHeading>任せる範囲と人の承認を明確にする</AICrewDesignElementHeading>
              <AICrewDesignElementBody>
                <p>アクセス範囲と承認フローを定め、安心して任せられる形にします。</p>
              </AICrewDesignElementBody>
            </AICrewDesignElementCard>
          </RevealOnScroll>
          <RevealOnScroll delayMs={280}>
            <AICrewDesignElementCard label="効果検証">
              <AICrewDesignElementHeading>利用量ではなく、業務への貢献で見る</AICrewDesignElementHeading>
              <AICrewDesignElementBody>
                <p>工数削減や品質改善を確認し、次の改善や横展開につなげます。</p>
              </AICrewDesignElementBody>
            </AICrewDesignElementCard>
          </RevealOnScroll>
        </AICrewDesignElementsGrid>
      </AICrewDesignElementsSection>
      <AICrewProcessSection>
        <AICrewProcessIntro>
          <AICrewProcessTitle>
            導入は5ステップ、任せやすい業務から
            <strong>小さく始める</strong>
          </AICrewProcessTitle>
          <AICrewProcessBody>{`業務課題のヒアリングから、テスト導入（PoC）、試作版の構築、本番導入、改善までを一気通貫で支援します。
いきなり全社導入する必要はありません。まずは1つの業務から始め、成果が見えた領域から広げられます。`}</AICrewProcessBody>
        </AICrewProcessIntro>

        <AICrewProcessGrid>
          <AICrewProcessStepCard delayMs={0}>
            <AICrewProcessStepHeader>
              <AICrewProcessStepBadge>STEP 01</AICrewProcessStepBadge>
              <AICrewProcessStepIcon>
                <FolderKanban className="h-5 w-5" />
              </AICrewProcessStepIcon>
            </AICrewProcessStepHeader>
            <AICrewProcessStepTitle>業務課題ヒアリング</AICrewProcessStepTitle>
            <AICrewProcessStepBody>
              現場で時間がかかっている業務、分散しているデータ、任せたい作業範囲を整理し、どこで業務が滞っているかを明確にします。
            </AICrewProcessStepBody>
          </AICrewProcessStepCard>

          <AICrewProcessStepCard delayMs={70}>
            <AICrewProcessStepHeader>
              <AICrewProcessStepBadge>STEP 02</AICrewProcessStepBadge>
              <AICrewProcessStepIcon>
                <Search className="h-5 w-5" />
              </AICrewProcessStepIcon>
            </AICrewProcessStepHeader>
            <AICrewProcessStepTitle>対象業務の選定・テスト導入設計</AICrewProcessStepTitle>
            <AICrewProcessStepBody>
              まず何をAIに任せると効果が出やすいかを定め、対象部門・利用データ・連携先・期待成果・評価指標を設計します。
            </AICrewProcessStepBody>
          </AICrewProcessStepCard>

          <AICrewProcessStepCard delayMs={140}>
            <AICrewProcessStepHeader>
              <AICrewProcessStepBadge>STEP 03</AICrewProcessStepBadge>
              <AICrewProcessStepIcon>
                <BriefcaseBusiness className="h-5 w-5" />
              </AICrewProcessStepIcon>
            </AICrewProcessStepHeader>
            <AICrewProcessStepTitle>試作版の構築</AICrewProcessStepTitle>
            <AICrewProcessStepBody>
              貴社の業務フローに合わせて、AIの役割、手順、参照データ、出力形式を設計し、実際に触れる形まで組み上げます。
            </AICrewProcessStepBody>
          </AICrewProcessStepCard>

          <AICrewProcessStepCard delayMs={210}>
            <AICrewProcessStepHeader>
              <AICrewProcessStepBadge>STEP 04</AICrewProcessStepBadge>
              <AICrewProcessStepIcon>
                <Settings2 className="h-5 w-5" />
              </AICrewProcessStepIcon>
            </AICrewProcessStepHeader>
            <AICrewProcessStepTitle>PoC実施・評価</AICrewProcessStepTitle>
            <AICrewProcessStepBody>
              実際の業務に近い形で検証し、回答品質、工数削減、運用しやすさを確認します。
            </AICrewProcessStepBody>
          </AICrewProcessStepCard>

          <AICrewProcessStepCard delayMs={280}>
            <AICrewProcessStepHeader>
              <AICrewProcessStepBadge>STEP 05</AICrewProcessStepBadge>
              <AICrewProcessStepIcon>
                <Cable className="h-5 w-5" />
              </AICrewProcessStepIcon>
            </AICrewProcessStepHeader>
            <AICrewProcessStepTitle>本番導入・改善横展開</AICrewProcessStepTitle>
            <AICrewProcessStepBody>
              効果が確認できた業務から本番環境へ展開し、既存システム連携や利用権限を整えながら、他部署や他業務へ広げていきます。
            </AICrewProcessStepBody>
          </AICrewProcessStepCard>

          <AICrewProcessCtaCard delayMs={350}>
            <AICrewProcessCtaHeader>
              <AICrewProcessCtaIcon>
                <ArrowRight className="h-5 w-5" />
              </AICrewProcessCtaIcon>
              <AICrewProcessCtaBadge>小さく始めて本番運用へ</AICrewProcessCtaBadge>
            </AICrewProcessCtaHeader>
            <AICrewProcessCtaLead>まずはお気軽にご相談ください</AICrewProcessCtaLead>
            <AICrewProcessActionGroup>
              <AICrewProcessPrimaryAction href={aiCrewConsultUrl}>
                進め方を相談する
              </AICrewProcessPrimaryAction>
              <AICrewProcessSecondaryAction href={demoUseCasesUrl}>
                活用事例を見る
              </AICrewProcessSecondaryAction>
            </AICrewProcessActionGroup>
          </AICrewProcessCtaCard>
        </AICrewProcessGrid>
      </AICrewProcessSection>
      <AICrewPlatformSection>
        <AICrewPlatformHeader>
          <AICrewPlatformTitle>
            実務での安全なAI活用を支える
            <br />
            エンタープライズAI基盤 <AICrewPlatformAccent>QueryPie AIP</AICrewPlatformAccent>
          </AICrewPlatformTitle>
          <AICrewPlatformBody>
            自律したAIエージェントを実務で安心安全に活用するために不可欠な要素を兼ね備えています。
          </AICrewPlatformBody>
        </AICrewPlatformHeader>

        <AICrewPlatformDiagram>
          <AICrewPlatformCore>
            <AICrewPlatformCoreEyebrow>Secure Enterprise AI</AICrewPlatformCoreEyebrow>
            <AICrewPlatformCoreTitle>QueryPie AIP</AICrewPlatformCoreTitle>
            <AICrewPlatformCoreBody>
              AIエージェントの実務性能と
              <br className="hidden lg:block" />
              ガバナンスを支える中核基盤
            </AICrewPlatformCoreBody>
          </AICrewPlatformCore>

          <AICrewPlatformCard icon="brain" position="top">
            <AICrewPlatformCardTitle subtitle="Brain">頭脳</AICrewPlatformCardTitle>
            <AICrewPlatformCardStat>マルチLLM / データ保護</AICrewPlatformCardStat>
            <AICrewPlatformCardBody>
              <AICrewPlatformCardBullet>業務特性に合わせて最適なLLMを使い分け</AICrewPlatformCardBullet>
              <AICrewPlatformCardBullet>入力した社内データの外部学習はなし</AICrewPlatformCardBullet>
            </AICrewPlatformCardBody>
          </AICrewPlatformCard>

          <AICrewPlatformCard icon="connect" position="right">
            <AICrewPlatformCardTitle subtitle="Connect">連携</AICrewPlatformCardTitle>
            <AICrewPlatformCardStat>社内連携 / アクセス制御</AICrewPlatformCardStat>
            <AICrewPlatformCardBody>
              <AICrewPlatformCardBullet>ゼロトラスト基準で社内システムと繋がり文脈を理解</AICrewPlatformCardBullet>
              <AICrewPlatformCardBullet>QueryPieが誇る厳格なアクセス制御</AICrewPlatformCardBullet>
            </AICrewPlatformCardBody>
          </AICrewPlatformCard>

          <AICrewPlatformCard icon="knowledge" position="bottom">
            <AICrewPlatformCardTitle subtitle="Knowledge">業務知識</AICrewPlatformCardTitle>
            <AICrewPlatformCardStat>業務再現 / 事実参照</AICrewPlatformCardStat>
            <AICrewPlatformCardBody>
              <AICrewPlatformCardBullet>手順書を記憶しハルシネーションを抑える</AICrewPlatformCardBullet>
              <AICrewPlatformCardBullet>自社の信頼できるデータを参照</AICrewPlatformCardBullet>
            </AICrewPlatformCardBody>
          </AICrewPlatformCard>

          <AICrewPlatformCard icon="governance" position="left">
            <AICrewPlatformCardTitle subtitle="Governance">統制</AICrewPlatformCardTitle>
            <AICrewPlatformCardStat>監査ログ / 人の承認</AICrewPlatformCardStat>
            <AICrewPlatformCardBody>
              <AICrewPlatformCardBullet>エンタープライズ水準の監査ログ</AICrewPlatformCardBullet>
              <AICrewPlatformCardBullet>シャドーAIや情報漏洩リスクを低減</AICrewPlatformCardBullet>
            </AICrewPlatformCardBody>
          </AICrewPlatformCard>
        </AICrewPlatformDiagram>
      </AICrewPlatformSection>
      <AICrewUseCasesSection>
        <AICrewUseCasesIntro>
          <AICrewUseCasesTitle>まずは、貴社で最も負荷の高い業務から</AICrewUseCasesTitle>
          <AICrewUseCasesBody>
            改善インパクトの大きい業務を起点に、業務フローや運用ルールに合わせて設計します。まずは、効果が見えやすい領域から小さく始められます。以下は、実際にご相談の多い業務例です。
          </AICrewUseCasesBody>
        </AICrewUseCasesIntro>

        <AICrewUseCasesGrid>
          <AICrewUseCaseCard
            icon="search"
            videoHref="https://youtu.be/K-ld_s4Che0"
            videoAriaLabel="SEO分析の動画を見る"
            detailHref="https://www.querypie.com/ja/features/demo/use-cases/29/seo-analyst"
            ctaLabel="詳しく見る"
          >
            <AICrewUseCaseCardCategory slot="card-category">マーケティング</AICrewUseCaseCardCategory>
            <AICrewUseCaseCardTitle slot="card-title">SEO分析</AICrewUseCaseCardTitle>
            <AICrewUseCaseCardBody slot="card-body">
              サイト分析、改善ポイント整理、ダッシュボード化までを短時間で支援。SEOの現状把握と次の打ち手を見えやすくします。
            </AICrewUseCaseCardBody>
          </AICrewUseCaseCard>

          <AICrewUseCaseTabbedCard icon="wallet" delayMs={90}>
            <AICrewUseCaseCardCategory slot="card-category">見積・営業</AICrewUseCaseCardCategory>
            <AICrewUseCaseCardTitle slot="card-title">見積業務</AICrewUseCaseCardTitle>
            <AICrewUseCaseCardBody slot="card-body">
              見積関連文書の確認から、複雑な見積ロジックに基づく出力までを支援。属人化しやすい見積業務を効率化します。
            </AICrewUseCaseCardBody>
            <AICrewUseCaseTab
              label="見積分析"
              videoHref="https://youtu.be/qwvyVcTaDsA"
              videoAriaLabel="見積分析の動画を見る"
              detailHref="https://www.querypie.com/ja/features/demo/use-cases/28/quotation-analyze-ai-agent"
              ctaLabel="詳しく見る"
            >
              ローカルファイルやパスワード付きPDFをアップロードせずに分析し、確認や比較の手間を減らします。
            </AICrewUseCaseTab>
            <AICrewUseCaseTab
              label="見積書作成"
              videoHref="https://youtu.be/mKZrCQti0Rc"
              videoAriaLabel="見積書作成の動画を見る"
              detailHref="https://www.querypie.com/ja/features/demo/use-cases/27/quotation-ai-agent"
              ctaLabel="詳しく見る"
            >
              複雑な価格表や条件をスキル化し、指定フォーマットで正確な見積書を出力します。
            </AICrewUseCaseTab>
          </AICrewUseCaseTabbedCard>

          <AICrewUseCaseCard
            icon="brain"
            delayMs={180}
            videoHref="https://youtu.be/cWC5lzN1JnE"
            videoAriaLabel="開発インサイトの動画を見る"
            detailHref="https://www.querypie.com/ja/features/demo/use-cases/16/dev-insight-ai-agent"
            ctaLabel="詳しく見る"
          >
            <AICrewUseCaseCardCategory slot="card-category">開発</AICrewUseCaseCardCategory>
            <AICrewUseCaseCardTitle slot="card-title">開発インサイト</AICrewUseCaseCardTitle>
            <AICrewUseCaseCardBody slot="card-body">
              Git、PR、チケット、CI/CD、インシデントを横断し、開発状況とリスクを会話型で可視化。開発チームの意思決定を支援します。
            </AICrewUseCaseCardBody>
          </AICrewUseCaseCard>

          <AICrewUseCaseCard
            icon="chart"
            delayMs={270}
            videoHref="https://youtu.be/f_yM6dinVU4"
            videoAriaLabel="データ分析の動画を見る"
            detailHref="https://www.querypie.com/ja/features/demo/use-cases/7/data-analytics-agent"
            ctaLabel="詳しく見る"
          >
            <AICrewUseCaseCardCategory slot="card-category">分析・経営</AICrewUseCaseCardCategory>
            <AICrewUseCaseCardTitle slot="card-title">データ分析</AICrewUseCaseCardTitle>
            <AICrewUseCaseCardBody slot="card-body">
              自然言語での質問から、データ抽出、可視化、インサイト整理までを支援。アドホックな分析依頼やレポート作成の負荷を下げます。
            </AICrewUseCaseCardBody>
          </AICrewUseCaseCard>
        </AICrewUseCasesGrid>

        <AICrewUseCasesFooter>
          <AICrewUseCasesNote>
            他にも、データ分析、開発、製造、審査、見積、SEO分析など、貴社の業務に合わせた活用例をご覧いただけます。
          </AICrewUseCasesNote>
          <AICrewUseCasesActions>
            <AICrewUseCasesPrimaryAction href={demoUseCasesUrl}>
              すべての活用事例を見る
            </AICrewUseCasesPrimaryAction>
            <AICrewUseCasesSecondaryAction href={aiCrewConsultUrl}>
              業務に合うAI活用を相談する
            </AICrewUseCasesSecondaryAction>
          </AICrewUseCasesActions>
        </AICrewUseCasesFooter>
      </AICrewUseCasesSection>
      <AICrewResultsSection>
        <AICrewResultsIntro>
          <AICrewResultsTitle>
            現場は仕事が進む<AICrewResultsHighlight>スピード</AICrewResultsHighlight>を、経営は
            <AICrewResultsHighlight>投資対効果</AICrewResultsHighlight>を実感
          </AICrewResultsTitle>
          <AICrewResultsBody>
            負荷が高い業務から始めることで、現場は業務を前に進めやすくなり、経営も効果とコストを確認しながら導入を広げられます。
          </AICrewResultsBody>
        </AICrewResultsIntro>

        <AICrewResultsCards>
          <AICrewResultsCard icon={Megaphone}>
            <AICrewResultsCardBody>
              AIツールを1つ増やした感覚ではなく、実務を支えてくれる新しい同僚という感覚に近いです。
            </AICrewResultsCardBody>
            <AICrewResultsCardMeta>
              <AICrewResultsCardBrand>MK</AICrewResultsCardBrand>
              <AICrewResultsCardIdentity>
                <AICrewResultsCardName>マーケティング担当者</AICrewResultsCardName>
                <AICrewResultsCardCompany>B2B事業会社</AICrewResultsCardCompany>
              </AICrewResultsCardIdentity>
            </AICrewResultsCardMeta>
          </AICrewResultsCard>

          <AICrewResultsCard icon={MessageSquareText} delayMs={70}>
            <AICrewResultsCardBody>
              問い合わせ対応の初動が圧倒的に速くなり、担当者が本当に時間を使うべき難易度の高い案件や攻めのサクセス業務に集中できるようになりました。
            </AICrewResultsCardBody>
            <AICrewResultsCardMeta>
              <AICrewResultsCardBrand>CS</AICrewResultsCardBrand>
              <AICrewResultsCardIdentity>
                <AICrewResultsCardName>カスタマーサポート責任者</AICrewResultsCardName>
                <AICrewResultsCardCompany>SaaS運営チーム</AICrewResultsCardCompany>
              </AICrewResultsCardIdentity>
            </AICrewResultsCardMeta>
          </AICrewResultsCard>

          <AICrewResultsCard icon={ChartColumnIncreasing} delayMs={140}>
            <AICrewResultsCardBody>
              会議前に必要な市場データや議事録が先に整理されているので、分析担当の準備負荷が劇的に軽くなりました。
            </AICrewResultsCardBody>
            <AICrewResultsCardMeta>
              <AICrewResultsCardBrand>BD</AICrewResultsCardBrand>
              <AICrewResultsCardIdentity>
                <AICrewResultsCardName>事業企画マネージャー</AICrewResultsCardName>
                <AICrewResultsCardCompany>成長フェーズ企業</AICrewResultsCardCompany>
              </AICrewResultsCardIdentity>
            </AICrewResultsCardMeta>
          </AICrewResultsCard>

          <AICrewResultsCard icon={FolderKanban} delayMs={210}>
            <AICrewResultsCardBody>
              最初から大きく変えず、まずはこの1つの業務だけと小さく始められたので、現場への導入もスムーズでした。
            </AICrewResultsCardBody>
            <AICrewResultsCardMeta>
              <AICrewResultsCardBrand>OP</AICrewResultsCardBrand>
              <AICrewResultsCardIdentity>
                <AICrewResultsCardName>オペレーション統括</AICrewResultsCardName>
                <AICrewResultsCardCompany>業務支援組織</AICrewResultsCardCompany>
              </AICrewResultsCardIdentity>
            </AICrewResultsCardMeta>
          </AICrewResultsCard>
        </AICrewResultsCards>

        <AICrewResultsPricing>
          <AICrewResultsPricingHeader>
            <AICrewResultsPricingIcon>
              <Wallet className="h-5 w-5" />
            </AICrewResultsPricingIcon>
            <AICrewResultsPricingTitle>
              固定費ではなく、<AICrewResultsHighlight>業務量に応じたクレジット制</AICrewResultsHighlight>
            </AICrewResultsPricingTitle>
            <AICrewResultsPricingBody>
              <AICrewResultsPricingBodyLine>
                専用AIエージェントの導入に、多額の初期費用や固定コストは必要ありません。
              </AICrewResultsPricingBodyLine>
              <AICrewResultsPricingBodyLine nowrap>
                人数ではなく、どれだけの業務を支援したかに応じたクレジット制です。まずは、最もボトルネックの大きい業務から小さく始められます。
              </AICrewResultsPricingBodyLine>
            </AICrewResultsPricingBody>
          </AICrewResultsPricingHeader>

          <AICrewResultsPricingGrid>
            <AICrewResultsPricingCard>
              <AICrewResultsPricingCardTitle>必要な分だけ使えるコスト設計</AICrewResultsPricingCardTitle>
              <AICrewResultsPricingCardBody>
                月額固定ではなく、必要な業務ボリュームに応じて利用量を調整できます。繁忙期と閑散期に合わせて、無駄の少ない運用が可能です。
              </AICrewResultsPricingCardBody>
            </AICrewResultsPricingCard>

            <AICrewResultsPricingCard>
              <AICrewResultsPricingCardTitle>部署をまたいでも管理しやすい</AICrewResultsPricingCardTitle>
              <AICrewResultsPricingCardBody>
                マーケティング、経理、人事、開発など、複数部署で活用しても、利用は共通のクレジットで管理できます。導入範囲を広げる際も、コストを把握しやすくなります。
              </AICrewResultsPricingCardBody>
            </AICrewResultsPricingCard>
          </AICrewResultsPricingGrid>
        </AICrewResultsPricing>
      </AICrewResultsSection>
      <AICrewContactSection>
        <AICrewContactShell>
          <AICrewContactIntro>
            <AICrewContactTitle>
              どの業務から始めるべきか、
              <br />
              まずは一緒に整理しませんか？
            </AICrewContactTitle>
            <AICrewContactBody>{`まだ対象業務が明確でなくても問題ありません。
QueryPie AIの専門チームが、貴社のボトルネック整理からPoCの進め方までご一緒します。`}</AICrewContactBody>
          </AICrewContactIntro>

          <AICrewContactActionGroup>
            <AICrewContactPrimaryAction href={aiCrewConsultUrl}>
              <CalendarDays className="h-4 w-4" />
              業務に合うAI活用を相談する
            </AICrewContactPrimaryAction>
            <AICrewContactSecondaryAction href={demoUseCasesUrl}>
              <Play className="h-4 w-4" />
              活用事例を見る
            </AICrewContactSecondaryAction>
          </AICrewContactActionGroup>
        </AICrewContactShell>

        <AICrewDashiPromo>
          <AICrewDashiPromoContent>
            <AICrewDashiPromoEyebrow>
              SaaSやWebサービスのAI化を進めたい企業様へ
            </AICrewDashiPromoEyebrow>
            <AICrewDashiPromoIcon>
              <Settings2 className="h-5 w-5" />
            </AICrewDashiPromoIcon>
            <AICrewDashiPromoTitle>貴社のサービスを、最短でAI化しませんか？</AICrewDashiPromoTitle>
            <AICrewDashiPromoBody>
              <p>
                自社サービスのAI化を、ゼロから数千万円かけて開発する必要はありません。QueryPie AIの強固なAI基盤を、貴社のブランドとUIのまま組み込めるAIソリューションを提供しています。専門エンジニア（FDE）が伴走し、最短1ヶ月で貴社の顧客に新しいAI体験を届けることが可能です。
              </p>
            </AICrewDashiPromoBody>
            <AICrewDashiPromoAction href="/solutions/ai-dashi">
              <Settings2 className="h-4 w-4" />
              自社サービスAI化の進め方を見る
              <ArrowRight className="h-4 w-4" />
            </AICrewDashiPromoAction>
          </AICrewDashiPromoContent>

          <AICrewDashiPromoVisual>
            <AICrewDashiPromoPanel>
              <AICrewDashiPromoPanelHeader>
                <AICrewDashiPromoPanelLabel>AI Solution</AICrewDashiPromoPanelLabel>
                <AICrewDashiPromoPanelStatusDot />
              </AICrewDashiPromoPanelHeader>
              <AICrewDashiPromoPanelList>
                <AICrewDashiPromoPanelItem>Your Service UI</AICrewDashiPromoPanelItem>
                <AICrewDashiPromoPanelItem tone="dashed">
                  AI Layer · QueryPie AIP
                </AICrewDashiPromoPanelItem>
                <AICrewDashiPromoPanelItem tone="primary">
                  FDE Guided Launch
                </AICrewDashiPromoPanelItem>
              </AICrewDashiPromoPanelList>
            </AICrewDashiPromoPanel>
            <AICrewDashiPromoVisualOrb>
              <Settings2 className="h-8 w-8" />
            </AICrewDashiPromoVisualOrb>
          </AICrewDashiPromoVisual>
        </AICrewDashiPromo>
      </AICrewContactSection>
      <SiteFooter />
    </main>
  );
}
