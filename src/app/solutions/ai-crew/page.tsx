import type { Metadata } from "next";
import { ArrowRight, CalendarDays, Play, Settings2 } from "lucide-react";
import {
  aiCrewConsultUrl,
  aiCrewFloatingCtaUrl,
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
