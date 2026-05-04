import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, CalendarDays, Play, Settings2 } from "lucide-react";
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
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import {
  AICrewAboutBody,
  AICrewAboutImage,
  AICrewAboutIntro,
  AICrewAboutSection,
  AICrewAboutShell,
  AICrewAboutTitle,
} from "@/components/sections/ai-crew-about-section";
import { AICrewLostSection } from "@/components/sections/ai-crew-lost-section";
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
      <AICrewLostSection>
        <RevealOnScroll variant="up">
          <div className="mx-auto max-w-[980px] rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.95)_100%)] px-6 py-8 shadow-[0_22px_60px_-46px_rgba(15,23,42,0.16)] sm:px-8 lg:px-10 lg:py-10">
            <div className="max-w-[880px] border-l-4 border-[#2563EB] pl-5">
              <h2 className="text-[28px] font-bold leading-[1.18] tracking-[-0.04em] text-slate-950 sm:text-[34px] lg:text-[38px]">
                人手不足と見えないコストが、企業の成長を鈍化させる。
              </h2>
              <div className="mt-6 space-y-5 text-[15px] leading-8 text-slate-600">
                <p>労働人口の減少と人件費の高騰が続く中、多くの企業が「人が足りない」「採用できない」という深刻な課題に直面しています。</p>
                <p>しかし、本当に人が足りないのでしょうか？ 現場の実態は、情報収集、データの転記、資料の下書きといった付加価値を生まない作業（＝見えないコスト）に、優秀な社員の貴重な時間が奪われているケースがほとんどです。</p>
                <p>「残業でカバーする」「人を増やして解決する」という従来のやり方は、もはや限界を迎えています。この非効率を放置し、社員を疲弊させ続けることは、企業の利益を削り落とし、競争力を失う最大の経営リスクなのです。</p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll variant="up" delayMs={140}>
          <div className="relative mx-auto mt-8 max-w-[980px] overflow-hidden rounded-[1.8rem] border border-[#d7e4fb] bg-[linear-gradient(135deg,#f8fbff_0%,#eef4ff_54%,#f7faff_100%)] px-6 py-6 text-left shadow-[0_22px_60px_-48px_rgba(15,42,95,0.18)] sm:px-8">
            <Image
              src="/solutions/ai-crew/whitepaper-background.svg"
              alt=""
              fill
              className="pointer-events-none object-cover opacity-100"
              sizes="980px"
            />
            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-[630px]">
                <div className="inline-flex rounded-full border border-[#C9D8F5] bg-white/90 px-4 py-2 text-[12px] font-semibold tracking-[0.12em] text-[#163A7A] shadow-[0_14px_36px_-24px_rgba(15,42,95,0.28)]">
                  White Paper
                </div>
                <h3 className="mt-4 text-[24px] font-semibold leading-[1.35] tracking-[-0.03em] text-white sm:text-[28px]">
                  なぜ今、日本企業がAIトランスフォーメーションに取り組むべきなのか
                </h3>
                <p className="mt-3 text-[14px] leading-7 text-white/82">
                  AI活用を単なる業務改善で終わらせず、事業変革につなげるための視点をまとめました。
                </p>
              </div>
              <a
                href={aiCrewWhitepaperUrl}
                className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#C9D8F5] bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF4FF_100%)] px-5 py-3 text-base font-semibold text-[#163A7A] shadow-[0_18px_40px_-30px_rgba(15,42,95,0.34)] transition hover:border-[#B7CCEF] hover:bg-[linear-gradient(180deg,#FAFCFF_0%,#E8F0FF_100%)] whitespace-nowrap"
              >
                ホワイトペーパーを読む
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </RevealOnScroll>
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
