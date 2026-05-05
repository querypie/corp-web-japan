import type { Metadata } from "next";
import {
  ArrowRight,
  Blocks,
  Check,
  Database,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { aiDashiConsultUrl, aiDashiFloatingUrl, aiDashiWhitepaperUrl } from "@/content/ai-dashi-links";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FloatingConversionCta } from "@/components/layout/floating-conversion-cta";
import {
  AIDashiHeroActions,
  AIDashiHeroBackground,
  AIDashiHeroBackgroundImage,
  AIDashiHeroBackdrop,
  AIDashiHeroEyebrow,
  AIDashiHeroLead,
  AIDashiHeroPanel,
  AIDashiHeroPrimaryAction,
  AIDashiHeroSecondaryAction,
  AIDashiHeroSection,
  AIDashiHeroShell,
  AIDashiHeroTitle,
  AIDashiHeroTitleAccent,
  AIDashiHeroTitleLine,
} from "@/components/sections/ai-dashi-hero-section";
import {
  AIDashiAboutBody,
  AIDashiAboutHighlight,
  AIDashiAboutIntro,
  AIDashiAboutSection,
  AIDashiAboutShell,
  AIDashiAboutTitle,
  AIDashiAboutVisual,
} from "@/components/sections/ai-dashi-about-section";
import {
  AIDashiValuesDiagram,
  AIDashiValueBadge,
  AIDashiValueCard,
  AIDashiValueCardBody,
  AIDashiValueCardHeader,
  AIDashiValueCardTitle,
  AIDashiValueHighlight,
  AIDashiValueNumber,
  AIDashiValuesGrid,
  AIDashiValuesIntro,
  AIDashiValuesSection,
  AIDashiValuesShell,
  AIDashiValuesTitle,
} from "@/components/sections/ai-dashi-values-section";
import {
  AIDashiWhitepaperAction,
  AIDashiWhitepaperBody,
  AIDashiWhitepaperCard,
  AIDashiWhitepaperCardBodyLayout,
  AIDashiWhitepaperCardDescription,
  AIDashiWhitepaperCardTitle,
  AIDashiWhitepaperCover,
  AIDashiWhitepaperEyebrow,
  AIDashiWhitepaperIntro,
  AIDashiWhitepaperSection,
  AIDashiWhitepaperShell,
  AIDashiWhitepaperTag,
  AIDashiWhitepaperTags,
  AIDashiWhitepaperTitle,
} from "@/components/sections/ai-dashi-whitepaper-section";
import {
  AIDashiContactActions,
  AIDashiContactBody,
  AIDashiContactHighlight,
  AIDashiContactIntro,
  AIDashiContactPrimaryAction,
  AIDashiContactSection,
  AIDashiContactShell,
  AIDashiContactTitle,
} from "@/components/sections/ai-dashi-contact-section";
import {
  AIDashiComparisonBody,
  AIDashiComparisonCallout,
  AIDashiComparisonHeaderRow,
  AIDashiComparisonLabelCell,
  AIDashiComparisonLegacyBody,
  AIDashiComparisonLegacyCell,
  AIDashiComparisonLegacyIcon,
  AIDashiComparisonLegacyTitle,
  AIDashiComparisonNote,
  AIDashiComparisonPreferredBody,
  AIDashiComparisonPreferredCell,
  AIDashiComparisonPreferredIcon,
  AIDashiComparisonPreferredTitle,
  AIDashiComparisonRow,
  AIDashiComparisonSection,
  AIDashiComparisonTable,
  AIDashiComparisonTitle,
  AIDashiComparisonIntro,
} from "@/components/sections/ai-dashi-comparison-section";
import {
  AIDashiSupportBody,
  AIDashiSupportCard,
  AIDashiSupportCardDetailLabel,
  AIDashiSupportCardDetails,
  AIDashiSupportCardIcon,
  AIDashiSupportCardLead,
  AIDashiSupportCardLayout,
  AIDashiSupportCardPoint,
  AIDashiSupportCardPointList,
  AIDashiSupportCardCopy,
  AIDashiSupportCardSummary,
  AIDashiSupportCardTitle,
  AIDashiSupportCards,
  AIDashiSupportIntro,
  AIDashiSupportSection,
  AIDashiSupportTitle,
} from "@/components/sections/ai-dashi-support-section";
import {
  AIDashiReleaseFlowBody,
  AIDashiReleaseFlowCard,
  AIDashiReleaseFlowCardBody,
  AIDashiReleaseFlowCardHeader,
  AIDashiReleaseFlowCardTitle,
  AIDashiReleaseFlowGrid,
  AIDashiReleaseFlowIntro,
  AIDashiReleaseFlowPeriodBadge,
  AIDashiReleaseFlowSection,
  AIDashiReleaseFlowStepBadge,
  AIDashiReleaseFlowTitle,
} from "@/components/sections/ai-dashi-release-flow-section";
import {
  AIDashiRiskBody,
  AIDashiRiskLead,
  AIDashiRiskSection,
  AIDashiRiskTitle,
} from "@/components/sections/ai-dashi-risk-section";
import {
  AIDashiEnterpriseReadyBody,
  AIDashiEnterpriseReadyCard,
  AIDashiEnterpriseReadyCardBody,
  AIDashiEnterpriseReadyCardIcon,
  AIDashiEnterpriseReadyCardTitle,
  AIDashiEnterpriseReadyCards,
  AIDashiEnterpriseReadyIntro,
  AIDashiEnterpriseReadySection,
  AIDashiEnterpriseReadyTitle,
} from "@/components/sections/ai-dashi-enterprise-ready-section";
import {
  AIDashiWallCardsBody,
  AIDashiWallCardsCard,
  AIDashiWallCardsCardBody,
  AIDashiWallCardsCardIcon,
  AIDashiWallCardsCardTitle,
  AIDashiWallCardsGrid,
  AIDashiWallCardsIntro,
  AIDashiWallCardsSection,
  AIDashiWallCardsTitle,
} from "@/components/sections/ai-dashi-wall-cards-section";
export const metadata: Metadata = {
  title: "自社サービスをAI搭載SaaSへ最短で進化させる | AI Dashi | QueryPie AI",
  description:
    "QueryPie AI Dashiは、自社SaaSやWebサービスにエンタープライズ品質のAI基盤を組み込むためのソリューションです。ブランド体験はそのままに、最短でAI搭載サービスへ進化させます。",
  alternates: {
    canonical: "/solutions/ai-dashi",
  },
  openGraph: {
    title: "自社サービスをAI搭載SaaSへ最短で進化させる | AI Dashi | QueryPie AI",
    description:
      "QueryPie AI Dashiは、自社SaaSやWebサービスにエンタープライズ品質のAI基盤を組み込むためのソリューションです。",
    type: "website",
  },
  twitter: {
    title: "自社サービスをAI搭載SaaSへ最短で進化させる | AI Dashi | QueryPie AI",
    description:
      "QueryPie AI Dashiは、自社SaaSやWebサービスにエンタープライズ品質のAI基盤を組み込むためのソリューションです。",
    card: "summary_large_image",
  },
};


export default function AIDashiPage() {
  return (
    <main className="relative overflow-x-hidden bg-[#eceff3] pt-[64px] text-slate-950">
      <SiteHeader />
      <FloatingConversionCta href={aiDashiFloatingUrl} />

      <AIDashiHeroSection>
        <AIDashiHeroBackground>
          <AIDashiHeroBackgroundImage src="/solutions/ai-dashi/hero-ai.webp" alt="AI Dashi hero visual" />
          <AIDashiHeroBackdrop />
        </AIDashiHeroBackground>

        <AIDashiHeroShell>
          <AIDashiHeroPanel>
            <AIDashiHeroEyebrow>組み込み型AI基盤・ホワイトラベル対応</AIDashiHeroEyebrow>
            <AIDashiHeroTitle>
              <AIDashiHeroTitleLine>自社サービスを</AIDashiHeroTitleLine>
              <AIDashiHeroTitleAccent delayMs={110}>
                AI搭載SaaS
                <span className="text-white">へ</span>
              </AIDashiHeroTitleAccent>
              <AIDashiHeroTitleLine delayMs={220}>最短で進化させる</AIDashiHeroTitleLine>
            </AIDashiHeroTitle>
            <AIDashiHeroLead>
              ブランド体験はそのままに、エンタープライズ品質のAI基盤をシームレスに統合。ゼロからの開発リスクを排除し、新たな収益源の創出とタイム・トゥ・マーケットを最速化します。
            </AIDashiHeroLead>
            <AIDashiHeroActions>
              <AIDashiHeroPrimaryAction href={aiDashiConsultUrl}>
                無料で導入相談・お見積り
                <ArrowRight className="h-4 w-4" />
              </AIDashiHeroPrimaryAction>
              <AIDashiHeroSecondaryAction href={aiDashiWhitepaperUrl}>
                資料をダウンロード
                <ArrowRight className="h-4 w-4" />
              </AIDashiHeroSecondaryAction>
            </AIDashiHeroActions>
          </AIDashiHeroPanel>
        </AIDashiHeroShell>
      </AIDashiHeroSection>

      <AIDashiRiskSection>
        <AIDashiRiskLead>明日、AIを搭載した競合が現れたら。</AIDashiRiskLead>
        <AIDashiRiskTitle>貴社のサービスは選ばれ続けますか？</AIDashiRiskTitle>
        <AIDashiRiskBody>
          <p>
            LLM（大規模言語モデル）の進化により、ソフトウェアの価値基準が根底から変わろうとしています。ユーザーの期待値は、手動で画面を操作する従来のSaaSから、AIが自律的に作業を完結させるSaaSへと急速に移行しています。
          </p>
          <p>
            自社の長年の強みに固執している間に、AIエージェントを組み込んだ後発のサービスが、圧倒的な自動化体験を武器に突然シェアを奪いに来る時代です。
          </p>
          <p>
            AI実装の遅れは、単なる機能不足ではありません。サービスの陳腐化と
            <strong>致命的な解約（チャーン）</strong>
            に直結する、経営レベルの危機なのです。
          </p>
        </AIDashiRiskBody>
      </AIDashiRiskSection>

      <AIDashiAboutSection>
        <AIDashiAboutShell>
          <AIDashiAboutIntro>
            <AIDashiAboutTitle>
              なぜ
              <AIDashiAboutHighlight>AI Dashi</AIDashiAboutHighlight>
              なのか？
            </AIDashiAboutTitle>

            <AIDashiAboutBody>
              <p>良い「出汁」は、主役の食材を邪魔せず、料理全体の旨味を底上げします。</p>
              <p>SaaSやWebサービスにおけるAIも同じです。AIそのものが主役になるのではなく、貴社がこれまで築き上げてきた「プロダクトのコア価値」を裏側から圧倒的に引き上げる存在でなければなりません。</p>
              <p>QueryPie AIが提供するAIプラットフォーム（AIP）は、貴社のUIやブランドの世界観に完全に溶け込み、ユーザーに「このサービス、すごく便利になった！」という最高の体験（旨味）を提供するための、最高品質のAI基盤（AI Dashi）です。</p>
            </AIDashiAboutBody>
          </AIDashiAboutIntro>

          <AIDashiAboutVisual src="/solutions/ai-dashi/about-visual.webp" alt="AI Dashi のコンセプトを表現するビジュアル" />
        </AIDashiAboutShell>
      </AIDashiAboutSection>

      <AIDashiValuesSection>
        <AIDashiValuesShell>
          <AIDashiValuesIntro>
            <AIDashiValuesTitle>QueryPie AIPが提供する3つの価値</AIDashiValuesTitle>
          </AIDashiValuesIntro>

          <AIDashiValuesGrid>
            <AIDashiValueCard>
              <AIDashiValueCardHeader>
                <AIDashiValueNumber>01</AIDashiValueNumber>
                <AIDashiValueBadge>競合優位性の確立</AIDashiValueBadge>
              </AIDashiValueCardHeader>
              <AIDashiValueCardTitle>
                自社の<AIDashiValueHighlight>オリジナル機能</AIDashiValueHighlight>としてシームレスに展開
              </AIDashiValueCardTitle>
              <AIDashiValueCardBody>
                他社の汎用AIツールを外付けするのではなく、貴社プロダクトの裏側に深く組み込みます。ブランド体験を損なわず、直接的な競争力と顧客ロイヤルティを高めます。
              </AIDashiValueCardBody>
            </AIDashiValueCard>

            <AIDashiValueCard>
              <AIDashiValueCardHeader>
                <AIDashiValueNumber>02</AIDashiValueNumber>
                <AIDashiValueBadge>開発リソースの最適化</AIDashiValueBadge>
              </AIDashiValueCardHeader>
              <AIDashiValueCardTitle>
                AI開発の<AIDashiValueHighlight>技術的負債を回避</AIDashiValueHighlight>し、コアビジネスに集中
              </AIDashiValueCardTitle>
              <AIDashiValueCardBody>
                変化の速いLLMの追従や複雑なインフラ保守はすべてQueryPie AIPが担います。ゼロから内製するコストとリスクを抑え、エンジニアの貴重な時間を本来のプロダクト開発に集中させられます。
              </AIDashiValueCardBody>
            </AIDashiValueCard>

            <AIDashiValueCard>
              <AIDashiValueCardHeader>
                <AIDashiValueNumber>03</AIDashiValueNumber>
                <AIDashiValueBadge>事業成長の加速</AIDashiValueBadge>
              </AIDashiValueCardHeader>
              <AIDashiValueCardTitle compact>
                <AIDashiValueHighlight>タイム・トゥ・マーケット</AIDashiValueHighlight>を最速化し、新たな収益源へ
              </AIDashiValueCardTitle>
              <AIDashiValueCardBody>
                フルスクラッチなら1年以上かかるエンタープライズ水準のセキュアなAI基盤を、最短1ヶ月で市場投入。単価向上（アップセル）や新プランの立ち上げを加速します。
              </AIDashiValueCardBody>
            </AIDashiValueCard>
          </AIDashiValuesGrid>

          <AIDashiValuesDiagram />
        </AIDashiValuesShell>
      </AIDashiValuesSection>

      <AIDashiWallCardsSection>
        <AIDashiWallCardsIntro>
          <AIDashiWallCardsTitle>ゼロからの自社AI化を阻む、3つの致命的リスク</AIDashiWallCardsTitle>
          <AIDashiWallCardsBody>
            LLMのAPIを叩くだけなら簡単ですが、それを「商用レベルのSaaS」として実装しようとすると、多くのプロジェクトが以下の壁に直面し頓挫します。
          </AIDashiWallCardsBody>
        </AIDashiWallCardsIntro>

        <AIDashiWallCardsGrid>
          <AIDashiWallCardsCard>
            <AIDashiWallCardsCardIcon>
              <Users className="h-5 w-5" />
            </AIDashiWallCardsCardIcon>
            <AIDashiWallCardsCardTitle>人材と技術の枯渇</AIDashiWallCardsCardTitle>
            <AIDashiWallCardsCardBody>
              AI専門エンジニアの採用難に加え、日進月歩で変わる最新アーキテクチャへの追従に開発リソースが食いつぶされ、本来のコア事業の進化が止まります。
            </AIDashiWallCardsCardBody>
          </AIDashiWallCardsCard>

          <AIDashiWallCardsCard>
            <AIDashiWallCardsCardIcon>
              <Database className="h-5 w-5" />
            </AIDashiWallCardsCardIcon>
            <AIDashiWallCardsCardTitle>データ整備の泥沼</AIDashiWallCardsCardTitle>
            <AIDashiWallCardsCardBody>
              自社データベースを正確にAIに読み込ませる（RAG構築）には膨大な工数がかかり、実用レベルの精度が出ないままリリースが無限に延期されます。
            </AIDashiWallCardsCardBody>
          </AIDashiWallCardsCard>

          <AIDashiWallCardsCard>
            <AIDashiWallCardsCardIcon>
              <Settings className="h-5 w-5" />
            </AIDashiWallCardsCardIcon>
            <AIDashiWallCardsCardTitle>肥大化するインフラ保守</AIDashiWallCardsCardTitle>
            <AIDashiWallCardsCardBody>
              リリース後も、モデルの更新やプロンプトの調整、インフラ監視など、想定外の保守運用コストが継続的に発生し利益を圧迫します。
            </AIDashiWallCardsCardBody>
          </AIDashiWallCardsCard>
        </AIDashiWallCardsGrid>
      </AIDashiWallCardsSection>

      <AIDashiEnterpriseReadySection>
        <AIDashiEnterpriseReadyIntro>
          <AIDashiEnterpriseReadyTitle>
            LLMを繋ぐだけでは、
            <br />
            エンタープライズ顧客には売れない
          </AIDashiEnterpriseReadyTitle>
          <AIDashiEnterpriseReadyBody>
            AI機能を実装できても、大企業が求める厳しいセキュリティ要件を満たさなければ、導入審査で弾かれます。
            QueryPie AIPは、これらの要件をあらかじめクリアしたAI基盤です。
          </AIDashiEnterpriseReadyBody>
        </AIDashiEnterpriseReadyIntro>

        <AIDashiEnterpriseReadyCards>
          <AIDashiEnterpriseReadyCard>
            <AIDashiEnterpriseReadyCardIcon>
              <ShieldCheck className="h-6 w-6" />
            </AIDashiEnterpriseReadyCardIcon>
            <AIDashiEnterpriseReadyCardTitle>B2B基準の権限管理（RBAC）</AIDashiEnterpriseReadyCardTitle>
            <AIDashiEnterpriseReadyCardBody>
              組織階層やユーザーごとの緻密なアクセス制御をAPIで実装。情報漏洩の致命的リスクを防ぎます。
            </AIDashiEnterpriseReadyCardBody>
          </AIDashiEnterpriseReadyCard>

          <AIDashiEnterpriseReadyCard>
            <AIDashiEnterpriseReadyCardIcon>
              <Database className="h-6 w-6" />
            </AIDashiEnterpriseReadyCardIcon>
            <AIDashiEnterpriseReadyCardTitle>ハルシネーションを防ぐガードレール</AIDashiEnterpriseReadyCardTitle>
            <AIDashiEnterpriseReadyCardBody>
              自社データのみに基づく事実回答を徹底し、B2Bの業務利用で絶対に許されない「AIの嘘」を防止します。
            </AIDashiEnterpriseReadyCardBody>
          </AIDashiEnterpriseReadyCard>

          <AIDashiEnterpriseReadyCard>
            <AIDashiEnterpriseReadyCardIcon>
              <Check className="h-6 w-6" />
            </AIDashiEnterpriseReadyCardIcon>
            <AIDashiEnterpriseReadyCardTitle>監査ログとコンプライアンス対応</AIDashiEnterpriseReadyCardTitle>
            <AIDashiEnterpriseReadyCardBody>
              SOC2 / ISO27001水準のセキュリティ基盤により、エンタープライズ顧客の厳しいセキュリティシート（導入審査）をパスできます。
            </AIDashiEnterpriseReadyCardBody>
          </AIDashiEnterpriseReadyCard>
        </AIDashiEnterpriseReadyCards>
      </AIDashiEnterpriseReadySection>

      <AIDashiComparisonSection>
        <AIDashiComparisonIntro>
          <AIDashiComparisonTitle>QueryPie AIPと自社開発の比較</AIDashiComparisonTitle>
          <AIDashiComparisonBody>
            <p>
              ゼロから要件を満たす基盤を構築するフルスクラッチ（自社開発）とQueryPie AIPの比較です。AIPを活用すれば、開発期間・初期コスト・運用リスクのすべてを圧倒的に圧縮し、最短で市場へ展開できます。
            </p>
          </AIDashiComparisonBody>
        </AIDashiComparisonIntro>

        <AIDashiComparisonTable>
          <AIDashiComparisonHeaderRow />

          <AIDashiComparisonRow>
            <AIDashiComparisonLabelCell>開発期間</AIDashiComparisonLabelCell>
            <AIDashiComparisonPreferredCell>
              <AIDashiComparisonPreferredIcon />
              <AIDashiComparisonPreferredTitle>最短1ヶ月（API組み込みのみ）</AIDashiComparisonPreferredTitle>
              <AIDashiComparisonPreferredBody>すぐに市場投入が可能</AIDashiComparisonPreferredBody>
            </AIDashiComparisonPreferredCell>
            <AIDashiComparisonLegacyCell>
              <AIDashiComparisonLegacyIcon />
              <AIDashiComparisonLegacyTitle>半年〜1年以上（試行錯誤の連続）</AIDashiComparisonLegacyTitle>
              <AIDashiComparisonLegacyBody>競合に先を越され市場機会を逃す</AIDashiComparisonLegacyBody>
            </AIDashiComparisonLegacyCell>
          </AIDashiComparisonRow>

          <AIDashiComparisonRow>
            <AIDashiComparisonLabelCell>初期インフラ投資</AIDashiComparisonLabelCell>
            <AIDashiComparisonPreferredCell>
              <AIDashiComparisonPreferredIcon />
              <AIDashiComparisonPreferredTitle>初期投資ゼロ（インフラ不要）</AIDashiComparisonPreferredTitle>
              <AIDashiComparisonPreferredBody>使った分だけの従量課金でスモールスタートが可能</AIDashiComparisonPreferredBody>
            </AIDashiComparisonPreferredCell>
            <AIDashiComparisonLegacyCell>
              <AIDashiComparisonLegacyIcon />
              <AIDashiComparisonLegacyTitle>数千万円規模の先行投資</AIDashiComparisonLegacyTitle>
              <AIDashiComparisonLegacyBody>サーバー代や検証費用など、回収不能なサンクコストが発生</AIDashiComparisonLegacyBody>
            </AIDashiComparisonLegacyCell>
          </AIDashiComparisonRow>

          <AIDashiComparisonRow>
            <AIDashiComparisonLabelCell>専門エンジニア確保</AIDashiComparisonLabelCell>
            <AIDashiComparisonPreferredCell>
              <AIDashiComparisonPreferredIcon />
              <AIDashiComparisonPreferredTitle>QueryPie AIのFDE（専門エンジニア）が伴走</AIDashiComparisonPreferredTitle>
              <AIDashiComparisonPreferredBody>AIに関する専門知識不要</AIDashiComparisonPreferredBody>
            </AIDashiComparisonPreferredCell>
            <AIDashiComparisonLegacyCell>
              <AIDashiComparisonLegacyIcon />
              <AIDashiComparisonLegacyTitle>AI人材の採用が必須（極めて困難）</AIDashiComparisonLegacyTitle>
              <AIDashiComparisonLegacyBody>人件費の高騰で採用が進まないリスク</AIDashiComparisonLegacyBody>
            </AIDashiComparisonLegacyCell>
          </AIDashiComparisonRow>

          <AIDashiComparisonRow>
            <AIDashiComparisonLabelCell>セキュリティ</AIDashiComparisonLabelCell>
            <AIDashiComparisonPreferredCell>
              <AIDashiComparisonPreferredIcon />
              <AIDashiComparisonPreferredTitle>エンタープライズ品質の基盤（SOC2/ISO27001）</AIDashiComparisonPreferredTitle>
              <AIDashiComparisonPreferredBody>厳格な権限管理（RBAC）が標準装備</AIDashiComparisonPreferredBody>
            </AIDashiComparisonPreferredCell>
            <AIDashiComparisonLegacyCell>
              <AIDashiComparisonLegacyIcon />
              <AIDashiComparisonLegacyTitle>ゼロトラストアーキテクチャを一から構築</AIDashiComparisonLegacyTitle>
              <AIDashiComparisonLegacyBody>情報漏洩の致命的リスクと認証取得の果てしない工数</AIDashiComparisonLegacyBody>
            </AIDashiComparisonLegacyCell>
          </AIDashiComparisonRow>

          <AIDashiComparisonRow>
            <AIDashiComparisonLabelCell>ハルシネーション対策</AIDashiComparisonLabelCell>
            <AIDashiComparisonPreferredCell>
              <AIDashiComparisonPreferredIcon />
              <AIDashiComparisonPreferredTitle>エンタープライズRAGによる事実のみの回答</AIDashiComparisonPreferredTitle>
              <AIDashiComparisonPreferredBody>内蔵されたガードレール機能でB2Bでの業務利用も安心</AIDashiComparisonPreferredBody>
            </AIDashiComparisonPreferredCell>
            <AIDashiComparisonLegacyCell>
              <AIDashiComparisonLegacyIcon />
              <AIDashiComparisonLegacyTitle>精度が上がらず本番リリース不可</AIDashiComparisonLegacyTitle>
              <AIDashiComparisonLegacyBody>自社データとLLMの連携（チャンキング等）で泥沼化</AIDashiComparisonLegacyBody>
            </AIDashiComparisonLegacyCell>
          </AIDashiComparisonRow>

          <AIDashiComparisonRow>
            <AIDashiComparisonLabelCell isLast>運用保守</AIDashiComparisonLabelCell>
            <AIDashiComparisonPreferredCell isLast>
              <AIDashiComparisonPreferredIcon />
              <AIDashiComparisonPreferredTitle>24時間365日のインフラ監視と継続アップデート</AIDashiComparisonPreferredTitle>
              <AIDashiComparisonPreferredBody>LLMの進化や運用はすべてオフロード、本業に集中</AIDashiComparisonPreferredBody>
            </AIDashiComparisonPreferredCell>
            <AIDashiComparisonLegacyCell isLast>
              <AIDashiComparisonLegacyIcon />
              <AIDashiComparisonLegacyTitle>自社エンジニアが運用保守に追われる</AIDashiComparisonLegacyTitle>
              <AIDashiComparisonLegacyBody>プロンプト調整やインフラ管理でコア事業の進化が停止</AIDashiComparisonLegacyBody>
            </AIDashiComparisonLegacyCell>
          </AIDashiComparisonRow>
        </AIDashiComparisonTable>

        <AIDashiComparisonNote>
          ※記載の期間・費用は標準的な導入ケースの目安です。要件により変動します。
        </AIDashiComparisonNote>

        <AIDashiComparisonCallout>
          <p className="text-base leading-6 text-slate-600">
            競合他社がAI化を進める中、開発に半年以上かけていては市場機会を逃します。
          </p>
          <p className="mt-2 text-[18px] font-semibold leading-7 text-slate-950">
            QueryPie AIPを活用すれば、
            <span className="bg-gradient-to-r from-[#E45A2A] via-[#ED602E] to-[#F08A3C] bg-clip-text text-transparent">
              最短1ヶ月で
            </span>
            独自のAIサービスをリリースできます。
          </p>
        </AIDashiComparisonCallout>
      </AIDashiComparisonSection>

      <AIDashiSupportSection>
        <AIDashiSupportIntro>
          <AIDashiSupportTitle>QueryPie AIの包括的サポート体制</AIDashiSupportTitle>
          <AIDashiSupportBody>
            単なるツールの提供ではありません。貴社が自社ブランドのAIサービスを確実かつ迅速にリリースし、安定して運用し続けるために必要なすべての要素を、QueryPie AIがワンストップで提供します。
          </AIDashiSupportBody>
        </AIDashiSupportIntro>

        <AIDashiSupportCards>
          <AIDashiSupportCard>
            <AIDashiSupportCardLayout>
              <AIDashiSupportCardSummary>
                <AIDashiSupportCardIcon>
                  <Blocks className="h-5 w-5" />
                </AIDashiSupportCardIcon>
                <AIDashiSupportCardCopy>
                  <AIDashiSupportCardTitle>カスタマイズ自在なAI基盤の提供</AIDashiSupportCardTitle>
                  <AIDashiSupportCardLead>最速での市場投入を実現するコアシステム</AIDashiSupportCardLead>
                </AIDashiSupportCardCopy>
              </AIDashiSupportCardSummary>
              <AIDashiSupportCardDetails>
                <AIDashiSupportCardDetailLabel>提供内容</AIDashiSupportCardDetailLabel>
                <AIDashiSupportCardPointList>
                  <AIDashiSupportCardPoint>貴社のブランドデザインに合わせたUI/UXのフルカスタマイズ</AIDashiSupportCardPoint>
                  <AIDashiSupportCardPoint>QueryPie AIが誇る高性能AIエージェント基盤の提供</AIDashiSupportCardPoint>
                  <AIDashiSupportCardPoint>既存の自社サービスやデータベースとシームレスに繋がるAPI連携</AIDashiSupportCardPoint>
                  <AIDashiSupportCardPoint>最短1〜3ヶ月でのスピーディな立ち上げを可能にする開発環境</AIDashiSupportCardPoint>
                </AIDashiSupportCardPointList>
              </AIDashiSupportCardDetails>
            </AIDashiSupportCardLayout>
          </AIDashiSupportCard>

          <AIDashiSupportCard>
            <AIDashiSupportCardLayout>
              <AIDashiSupportCardSummary>
                <AIDashiSupportCardIcon>
                  <Users className="h-5 w-5" />
                </AIDashiSupportCardIcon>
                <AIDashiSupportCardCopy>
                  <AIDashiSupportCardTitle>専門エンジニアによる開発支援</AIDashiSupportCardTitle>
                  <AIDashiSupportCardLead>貴社チームに伴走し、最適なAIを共に創り上げる</AIDashiSupportCardLead>
                </AIDashiSupportCardCopy>
              </AIDashiSupportCardSummary>
              <AIDashiSupportCardDetails>
                <AIDashiSupportCardDetailLabel>提供内容</AIDashiSupportCardDetailLabel>
                <AIDashiSupportCardPointList>
                  <AIDashiSupportCardPoint>現場導入支援エンジニア（FDE）がプロジェクトの要件定義から参画</AIDashiSupportCardPoint>
                  <AIDashiSupportCardPoint>貴社のドメイン知識と私たちのAI知見を掛け合わせた最適なアーキテクチャ設計</AIDashiSupportCardPoint>
                  <AIDashiSupportCardPoint>初期セットアップから、貴社開発チームへの技術トレーニング・ナレッジ移転</AIDashiSupportCardPoint>
                  <AIDashiSupportCardPoint>リリースに向けた継続的かつ専門的な技術サポート</AIDashiSupportCardPoint>
                </AIDashiSupportCardPointList>
              </AIDashiSupportCardDetails>
            </AIDashiSupportCardLayout>
          </AIDashiSupportCard>

          <AIDashiSupportCard>
            <AIDashiSupportCardLayout>
              <AIDashiSupportCardSummary>
                <AIDashiSupportCardIcon>
                  <ShieldCheck className="h-5 w-5" />
                </AIDashiSupportCardIcon>
                <AIDashiSupportCardCopy>
                  <AIDashiSupportCardTitle>24時間365日のインフラ・運用保守</AIDashiSupportCardTitle>
                  <AIDashiSupportCardLead>リリース後も安心。インフラ管理を完全にオフロード</AIDashiSupportCardLead>
                </AIDashiSupportCardCopy>
              </AIDashiSupportCardSummary>
              <AIDashiSupportCardDetails>
                <AIDashiSupportCardDetailLabel>提供内容</AIDashiSupportCardDetailLabel>
                <AIDashiSupportCardPointList>
                  <AIDashiSupportCardPoint>セキュアで高可用性を誇るAIインフラの構築と運用</AIDashiSupportCardPoint>
                  <AIDashiSupportCardPoint>24時間365日体制でのシステム監視・障害対応（ハウジングサポート）</AIDashiSupportCardPoint>
                  <AIDashiSupportCardPoint>最新のAIモデルへのアップデートや、継続的な機能改善の適用</AIDashiSupportCardPoint>
                  <AIDashiSupportCardPoint>インフラ運用のリソースを気にすることなく、ビジネス成長に集中できる環境</AIDashiSupportCardPoint>
                </AIDashiSupportCardPointList>
              </AIDashiSupportCardDetails>
            </AIDashiSupportCardLayout>
          </AIDashiSupportCard>
        </AIDashiSupportCards>
      </AIDashiSupportSection>

      <AIDashiReleaseFlowSection>
        <AIDashiReleaseFlowIntro>
          <AIDashiReleaseFlowTitle>
            最速で市場へ
            <br />
            市場機会を逃さない、
            <strong>圧倒的な導入スピード</strong>
          </AIDashiReleaseFlowTitle>
          <AIDashiReleaseFlowBody>
            ゼロからAIを自社開発し、試行錯誤で時間を浪費する必要はありません。当社の専門エンジニア（FDE）が要件定義から本番公開まで一気通貫で伴走し、競合に先んじたスピーディな立ち上げを実現します。
          </AIDashiReleaseFlowBody>
        </AIDashiReleaseFlowIntro>

        <AIDashiReleaseFlowGrid>
          <AIDashiReleaseFlowCard>
            <AIDashiReleaseFlowCardHeader>
              <AIDashiReleaseFlowStepBadge>STEP 01</AIDashiReleaseFlowStepBadge>
              <AIDashiReleaseFlowPeriodBadge>1〜2週間</AIDashiReleaseFlowPeriodBadge>
            </AIDashiReleaseFlowCardHeader>
            <AIDashiReleaseFlowCardTitle>ヒアリング・要件定義</AIDashiReleaseFlowCardTitle>
            <AIDashiReleaseFlowCardBody>
              貴社のビジネスモデルや既存システム、実現したいAI機能を深くヒアリングし、最適なアーキテクチャと実装方針を策定します。
            </AIDashiReleaseFlowCardBody>
          </AIDashiReleaseFlowCard>

          <AIDashiReleaseFlowCard>
            <AIDashiReleaseFlowCardHeader>
              <AIDashiReleaseFlowStepBadge>STEP 02</AIDashiReleaseFlowStepBadge>
              <AIDashiReleaseFlowPeriodBadge>2〜3週間</AIDashiReleaseFlowPeriodBadge>
            </AIDashiReleaseFlowCardHeader>
            <AIDashiReleaseFlowCardTitle>プロトタイプ作成</AIDashiReleaseFlowCardTitle>
            <AIDashiReleaseFlowCardBody>
              要件に基づき、UI/UXを貴社ブランドに合わせてカスタマイズした初期のAIモデル・プロトタイプを構築し、実際の動作をご確認いただきます。
            </AIDashiReleaseFlowCardBody>
          </AIDashiReleaseFlowCard>

          <AIDashiReleaseFlowCard>
            <AIDashiReleaseFlowCardHeader>
              <AIDashiReleaseFlowStepBadge>STEP 03</AIDashiReleaseFlowStepBadge>
              <AIDashiReleaseFlowPeriodBadge>4〜6週間</AIDashiReleaseFlowPeriodBadge>
            </AIDashiReleaseFlowCardHeader>
            <AIDashiReleaseFlowCardTitle>統合開発・テスト</AIDashiReleaseFlowCardTitle>
            <AIDashiReleaseFlowCardBody>
              既存の自社サービスやデータベースとのAPI連携（組み込み）を実施。ハルシネーション対策の調整やセキュリティ要件を満たすためのテストを徹底して行います。
            </AIDashiReleaseFlowCardBody>
          </AIDashiReleaseFlowCard>

          <AIDashiReleaseFlowCard>
            <AIDashiReleaseFlowCardHeader>
              <AIDashiReleaseFlowStepBadge>STEP 04</AIDashiReleaseFlowStepBadge>
              <AIDashiReleaseFlowPeriodBadge>最短1〜3ヶ月</AIDashiReleaseFlowPeriodBadge>
            </AIDashiReleaseFlowCardHeader>
            <AIDashiReleaseFlowCardTitle>本番リリース・運用開始</AIDashiReleaseFlowCardTitle>
            <AIDashiReleaseFlowCardBody>
              貴社の顧客向けにAIサービスを公開。リリース後も24時間365日のインフラ監視と、FDEによる継続的な改善サポートでビジネスの成長を支えます。
            </AIDashiReleaseFlowCardBody>
          </AIDashiReleaseFlowCard>
        </AIDashiReleaseFlowGrid>
      </AIDashiReleaseFlowSection>

      <AIDashiWhitepaperSection>
        <AIDashiWhitepaperShell>
          <AIDashiWhitepaperIntro>
            <AIDashiWhitepaperEyebrow>White Paper</AIDashiWhitepaperEyebrow>
            <AIDashiWhitepaperTitle>SaaS事業責任者向けホワイトペーパー</AIDashiWhitepaperTitle>
            <AIDashiWhitepaperBody>
              AIエージェント時代に、SaaS企業が取るべき戦略をまとめた資料を無料でダウンロードいただけます。
            </AIDashiWhitepaperBody>
          </AIDashiWhitepaperIntro>

          <AIDashiWhitepaperCard href={aiDashiWhitepaperUrl}>
            <AIDashiWhitepaperCover src="/solutions/ai-dashi/the-end-of-saas-or-its-evolution.png" alt="SaaSの終焉か、進化か ホワイトペーパー表紙" />

            <AIDashiWhitepaperCardBodyLayout>
              <div>
                <AIDashiWhitepaperTags>
                  <AIDashiWhitepaperTag>プロダクト責任者向け</AIDashiWhitepaperTag>
                  <AIDashiWhitepaperTag>SaaS戦略</AIDashiWhitepaperTag>
                  <AIDashiWhitepaperTag>組み込みAI</AIDashiWhitepaperTag>
                </AIDashiWhitepaperTags>

                <AIDashiWhitepaperCardTitle>
                  SaaSの終焉か、進化か 〜AIエージェント時代にSaaS企業が取るべき戦略〜
                </AIDashiWhitepaperCardTitle>
                <AIDashiWhitepaperCardDescription>
                  本ホワイトペーパーは、AIエージェントがSaaSビジネスに与える影響を分析し、SaaS企業が取るべき戦略と、QueryPie AI自身のSaaSベンダーからAI Native企業への変革の実録をお伝えします。
                </AIDashiWhitepaperCardDescription>
              </div>

              <AIDashiWhitepaperAction>
                無料ダウンロード
                <ArrowRight className="h-4 w-4" />
              </AIDashiWhitepaperAction>
            </AIDashiWhitepaperCardBodyLayout>
          </AIDashiWhitepaperCard>
        </AIDashiWhitepaperShell>
      </AIDashiWhitepaperSection>

      <AIDashiContactSection>
        <AIDashiContactShell>
          <AIDashiContactIntro>
            <AIDashiContactTitle>
              <span className="inline-block whitespace-nowrap">
                自社サービスの
                <AIDashiContactHighlight>AI化</AIDashiContactHighlight>
                を、
              </span>
              <br />
              一緒にデザインしませんか？
            </AIDashiContactTitle>
            <AIDashiContactBody>
              複雑な手動操作をAIに任せたい。顧客の要望に応えるAI機能をスピーディに実装したい。
              <br />
              QueryPie AIPを活用した具体的な連携アイデアからお見積もりまで、まずはお気軽にご相談ください。
            </AIDashiContactBody>
          </AIDashiContactIntro>

          <AIDashiContactActions>
            <AIDashiContactPrimaryAction href={aiDashiConsultUrl}>無料で導入相談・お見積もりをする</AIDashiContactPrimaryAction>
          </AIDashiContactActions>
        </AIDashiContactShell>
      </AIDashiContactSection>

      <SiteFooter />
    </main>
  );
}
