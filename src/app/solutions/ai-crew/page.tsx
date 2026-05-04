import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarDays,
  ChartColumnIncreasing,
  FileSearch,
  Layers3,
  Play,
  Search,
  Settings2,
  ShieldCheck,
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
  AICrewWhyAfterDesktopLayout,
  AICrewWhyAfterMobileLayout,
  AICrewWhyAfterOrbitItem,
  AICrewWhyBeforeCard,
  AICrewWhyBeforePainPoint,
  AICrewWhyBody,
  AICrewWhyComparisonShell,
  AICrewWhyDesktopTaskColumn,
  AICrewWhyIntro,
  AICrewWhySection,
  AICrewWhyTaskColumn,
  AICrewWhyTaskItem,
  AICrewWhyTitle,
} from "@/components/sections/ai-crew-why-section";
import {
  HomePageIntroSections,
  HomePageSections,
} from "@/components/sections/home-page-sections";

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
      <HomePageIntroSections />
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
          <AICrewWhyBeforeCard subtitle="一次対応に時間がかかる">
            <AICrewWhyBeforePainPoint>情報が散らばり調査と確認に時間がかかる</AICrewWhyBeforePainPoint>
            <AICrewWhyBeforePainPoint>下準備が多く本来の判断に時間を使えない</AICrewWhyBeforePainPoint>
          </AICrewWhyBeforeCard>

          <AICrewWhyAfterCard subtitle="役割分担が整理され、本来の業務に集中">
            <AICrewWhyAfterMobileLayout>
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

            <AICrewWhyAfterDesktopLayout>
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
      <HomePageSections />
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
