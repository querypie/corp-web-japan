import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { componentNameDebugProps } from "@/lib/component-name-debug";
import { SiteNoticeSurface } from "@/components/sections/site-notice/site-notice-surface";
import {
  AboutUsBodyCopy,
  AboutUsHeroCopy,
  AboutUsHeroImage,
  AboutUsHeroSubtitle,
  AboutUsInvestorLogo,
  AboutUsInvestorLogoRow,
  AboutUsLeaderCard,
  AboutUsLeaderGrid,
  AboutUsLeaderName,
  AboutUsLeaderRole,
  AboutUsLocationAddress,
  AboutUsLocationCard,
  AboutUsLocationEntity,
  AboutUsLocationGrid,
  AboutUsLocationName,
  AboutUsLocationOffice,
  AboutUsSection,
  AboutUsSectionHeading,
  AboutUsSectionIntro,
  AboutUsTimeline,
  AboutUsTimelineItem,
} from "@/components/sections/about-us/section";
import {
  CompanyPageLayout,
  CompanyPageIntro,
  CompanyPageSection,
  CompanyPageTitle,
} from "@/components/sections/company/page-primitives";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { AipFreeTrialCtaSection } from "@/components/sections/simple-cta-section";

export const metadata: Metadata = {
  title: "会社概要 | QueryPie AI",
  description: "QueryPie AIは、セキュリティとガバナンスを基盤に、企業のAI活用を成果へつなげます。",
  alternates: {
    canonical: "/about-us",
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: ["QueryPie AIについて", "QueryPie AI 投資家", "QueryPie AI 履歴", "QueryPie AI チーム", "QueryPie AI 所在地"],
};

export const revalidate = 3600;

export default function AboutUsPage() {
  return (
    <main {...componentNameDebugProps("AboutUsPage")} className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />
      <SiteNoticeSurface />

      <CompanyPageSection>
        <CompanyPageIntro>
          <RevealOnScroll>
            <CompanyPageTitle>
              AIを、安全に。
              <br />
              事業の力に。
            </CompanyPageTitle>
          </RevealOnScroll>

          <CompanyPageLayout preset="aboutUsHero">
            <RevealOnScroll>
              <AboutUsHeroCopy>
                <AboutUsHeroSubtitle>
                  エンタープライズAIを、すべての企業へ
                  <br />
                  最大90%のコスト削減と、妥協のないパフォーマンス
                </AboutUsHeroSubtitle>
                <AboutUsBodyCopy>
                  QueryPie AIは、高額な導入・運用コスト、セキュリティリスク、そしてイノベーションを妨げる複雑な運用課題を解消し、企業におけるAI活用のあり方を変革します。
                </AboutUsBodyCopy>
                <AboutUsBodyCopy>
                  2016年のシリコンバレー創業以来、私たちはデータ保護の知見を基盤に、企業が安心してAIを活用できる包括的なプラットフォームへと進化してきました。
                </AboutUsBodyCopy>
                <AboutUsBodyCopy>
                  カスタムAIエージェントの構築、一元的な管理・統制、そして利用量に応じた柔軟な料金体系を提供。従来の高額なAIサブスクリプションに代わる選択肢として、最大90%のコスト削減を目指します。
                </AboutUsBodyCopy>
                <AboutUsBodyCopy>
                  最先端のAI、高度なセキュリティ、そして持続可能なコスト。QueryPie AIは、このすべてを両立させ、あらゆる企業がエンタープライズグレードのAIを活用できる環境をつくります。
                </AboutUsBodyCopy>
              </AboutUsHeroCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={120} className="lg:self-stretch">
              <AboutUsHeroImage />
            </RevealOnScroll>
          </CompanyPageLayout>
        </CompanyPageIntro>
      </CompanyPageSection>

      <AboutUsSection>
        <RevealOnScroll>
          <AboutUsSectionHeading>出資企業</AboutUsSectionHeading>
          <AboutUsSectionIntro>
            <AboutUsBodyCopy>
              総資金調達額：3,300万ドル（2026年時点）
            </AboutUsBodyCopy>
          </AboutUsSectionIntro>
        </RevealOnScroll>

        <AboutUsInvestorLogoRow>
          <RevealOnScroll>
            <AboutUsInvestorLogo name="Salesforce Ventures" logoSrc="/about-us/investors/salesforce-ventures-invest.svg" width={165} height={59} />
          </RevealOnScroll>
          <RevealOnScroll delayMs={80}>
            <AboutUsInvestorLogo name="Y Combinator" logoSrc="/about-us/investors/y-combinator-invest.svg" width={175} height={35} />
          </RevealOnScroll>
          <RevealOnScroll delayMs={160}>
            <AboutUsInvestorLogo name="Z Venture Capital" logoSrc="/about-us/investors/z-venture-capital-invest.svg" width={175} height={77} />
          </RevealOnScroll>
        </AboutUsInvestorLogoRow>
      </AboutUsSection>

      <AboutUsSection muted>
        <RevealOnScroll>
          <AboutUsSectionHeading>私たちの歩み</AboutUsSectionHeading>
          <AboutUsSectionIntro>
            <AboutUsBodyCopy>
              AIが次のフロンティアになったとき、多くの企業が「莫大なコストと複雑な実装」という2つの壁に直面しました。
              <br />
              そこで私たちは、その両方を解決するために進化を続けてきました。
              <br />
              誰もが使えるアクセシビリティを保ちながら、AI変革の専門性を構築しています。
            </AboutUsBodyCopy>
          </AboutUsSectionIntro>
        </RevealOnScroll>

        <AboutUsTimeline>
          <RevealOnScroll>
            <AboutUsTimelineItem year="2016">
              <li>設立</li>
            </AboutUsTimelineItem>
          </RevealOnScroll>
          <RevealOnScroll delayMs={50}>
            <AboutUsTimelineItem year="2018">
              <li>カカオインベストメントからの資金調達</li>
              <li>QueryPie SQL Client の開発を開始</li>
            </AboutUsTimelineItem>
          </RevealOnScroll>
          <RevealOnScroll delayMs={100}>
            <AboutUsTimelineItem year="2019">
              <li>QueryPie SQL Client を提供開始</li>
              <li>TechCrunch SF 2019 に参加</li>
              <li>LG スタートアップコンペティション 2019 で優勝</li>
            </AboutUsTimelineItem>
          </RevealOnScroll>
          <RevealOnScroll delayMs={150}>
            <AboutUsTimelineItem year="2020">
              <li>Y Combinator からの資金調達</li>
              <li>データ保護プラットフォームへ転換</li>
              <li>Yanolja、KakaoPay、DunamuへQueryPieを提供</li>
            </AboutUsTimelineItem>
          </RevealOnScroll>
          <RevealOnScroll delayMs={200}>
            <AboutUsTimelineItem year="2021">
              <li>QueryPie DAC（データベースアクセスコントローラー）提供開始</li>
              <li>優先シードラウンドで 1,775万ドルを調達</li>
            </AboutUsTimelineItem>
          </RevealOnScroll>
          <RevealOnScroll delayMs={250}>
            <AboutUsTimelineItem year="2023">
              <li>韓国信用保証基金から 581万ドルの資金を確保</li>
              <li>QueryPie SAC（システムアクセスコントローラー）提供開始</li>
            </AboutUsTimelineItem>
          </RevealOnScroll>
          <RevealOnScroll delayMs={300}>
            <AboutUsTimelineItem year="2024">
              <li>QueryPie Japan（東京）を開設</li>
              <li>QueryPie KAC（Kubernetesアクセスコントローラー）/ WAC（Webアクセスコントローラー）提供開始</li>
              <li>Salesforce Ventures、Z Venture Capital、Murex Partners、Shinhan Venture Investment からの戦略的投資</li>
            </AboutUsTimelineItem>
          </RevealOnScroll>
          <RevealOnScroll delayMs={350}>
            <AboutUsTimelineItem year="2025">
              <li>QueryPie AIP（AIプラットフォーム）提供開始</li>
              <li>FDE（フォワードデプロイエンジニア）サービス提供開始</li>
            </AboutUsTimelineItem>
          </RevealOnScroll>
          <RevealOnScroll delayMs={400}>
            <AboutUsTimelineItem year="2026">
              <li>QueryPie AIPアプリ「Lingo」「NotePie」を提供開始</li>
              <li>QueryPie ACP AI Packを提供開始</li>
            </AboutUsTimelineItem>
          </RevealOnScroll>
        </AboutUsTimeline>
      </AboutUsSection>

      <AboutUsSection>
        <RevealOnScroll>
          <AboutUsSectionHeading>私たちのチーム</AboutUsSectionHeading>
          <AboutUsSectionIntro>
            <AboutUsBodyCopy>
              私たちのリーダーは、既成概念にとらわれません。「エンタープライズAIは複雑で高額」という常識に、挑戦し続けています。
              <br />
              シリコンバレーの研究室だけでなく、実際のビジネスの現場でAIを機能させる—それが私たちの使命です。
            </AboutUsBodyCopy>
          </AboutUsSectionIntro>
        </RevealOnScroll>

        <AboutUsLeaderGrid>
          <RevealOnScroll>
            <AboutUsLeaderCard imageSrc="/about-us/crew/brant.png" imageAlt="Brant Hwang" linkedinUrl="https://www.linkedin.com/in/ishwang/">
              <AboutUsLeaderName>Brant Hwang</AboutUsLeaderName>
              <AboutUsLeaderRole>創業者 & 最高経営責任者 (CEO)</AboutUsLeaderRole>
            </AboutUsLeaderCard>
          </RevealOnScroll>
          <RevealOnScroll delayMs={55}>
            <AboutUsLeaderCard imageSrc="/about-us/crew/paul.png" imageAlt="Paul Hong" linkedinUrl="https://www.linkedin.com/in/paul-hong-bb0983216/">
              <AboutUsLeaderName>Paul Hong</AboutUsLeaderName>
              <AboutUsLeaderRole>共同創業者 & 最高財務責任者 (CFO)</AboutUsLeaderRole>
            </AboutUsLeaderCard>
          </RevealOnScroll>
          <RevealOnScroll delayMs={110}>
            <AboutUsLeaderCard imageSrc="/about-us/crew/sam.png" imageAlt="Sam Kim" linkedinUrl="https://www.linkedin.com/in/sam0-kim/">
              <AboutUsLeaderName>Sam Kim</AboutUsLeaderName>
              <AboutUsLeaderRole>最高技術責任者 (CTO)</AboutUsLeaderRole>
            </AboutUsLeaderCard>
          </RevealOnScroll>
          <RevealOnScroll delayMs={165}>
            <AboutUsLeaderCard imageSrc="/about-us/crew/jake-im.png" imageAlt="Jake Im" linkedinUrl="https://www.linkedin.com/in/sungbin-im-ba817b25/">
              <AboutUsLeaderName>Jake Im</AboutUsLeaderName>
              <AboutUsLeaderRole>最高セキュリティ責任者 (CISO & CPO)</AboutUsLeaderRole>
            </AboutUsLeaderCard>
          </RevealOnScroll>
          <RevealOnScroll delayMs={220}>
            <AboutUsLeaderCard imageSrc="/about-us/crew/kris.png" imageAlt="Kris Park" linkedinUrl="https://www.linkedin.com/in/kris-park-89a83b19/">
              <AboutUsLeaderName>Kris Park</AboutUsLeaderName>
              <AboutUsLeaderRole>最高戦略責任者 (CSO)</AboutUsLeaderRole>
            </AboutUsLeaderCard>
          </RevealOnScroll>
          <RevealOnScroll delayMs={275}>
            <AboutUsLeaderCard imageSrc="/about-us/crew/keizo.png" imageAlt="Keizo Arinobu" linkedinUrl="https://www.linkedin.com/in/keizo-arinobu-b40769/">
              <AboutUsLeaderName>Keizo Arinobu</AboutUsLeaderName>
              <AboutUsLeaderRole>グローバルビジネス最高責任者 (CGO) & 日本カントリーマネージャ</AboutUsLeaderRole>
            </AboutUsLeaderCard>
          </RevealOnScroll>
        </AboutUsLeaderGrid>
      </AboutUsSection>

      <AboutUsSection>
        <RevealOnScroll>
          <AboutUsSectionHeading>グローバル拠点</AboutUsSectionHeading>
        </RevealOnScroll>

        <AboutUsLocationGrid>
          <RevealOnScroll>
            <AboutUsLocationCard iconSrc="/about-us/location/usa-cu.svg" iconAlt="United States">
              <AboutUsLocationName>Los Angeles, USA</AboutUsLocationName>
              <AboutUsLocationOffice>Global Headquarters</AboutUsLocationOffice>
              <AboutUsLocationEntity>CHEQUER Global, Inc.</AboutUsLocationEntity>
              <AboutUsLocationAddress>
                <p>2525 West 8th Street, Suite 300,</p>
                <p>Los Angeles, CA 90057</p>
              </AboutUsLocationAddress>
            </AboutUsLocationCard>
          </RevealOnScroll>
          <RevealOnScroll delayMs={55}>
            <AboutUsLocationCard iconSrc="/about-us/location/republic-of-korea-cu.svg" iconAlt="Republic of Korea">
              <AboutUsLocationName>Seoul, South Korea</AboutUsLocationName>
              <AboutUsLocationOffice>R&amp;D Office</AboutUsLocationOffice>
              <AboutUsLocationEntity>QueryPie, Inc.</AboutUsLocationEntity>
              <AboutUsLocationAddress>
                <p>7F, 26, Magokjungang 1-ro, Gangseo-gu,</p>
                <p>Seoul 07807</p>
              </AboutUsLocationAddress>
            </AboutUsLocationCard>
          </RevealOnScroll>
          <RevealOnScroll delayMs={110}>
            <AboutUsLocationCard iconSrc="/about-us/location/japan-cu.svg" iconAlt="Japan">
              <AboutUsLocationName>Tokyo, Japan</AboutUsLocationName>
              <AboutUsLocationOffice>Japan Office</AboutUsLocationOffice>
              <AboutUsLocationEntity>QueryPie AI合同会社</AboutUsLocationEntity>
              <AboutUsLocationAddress>
                <p>〒105-6490 東京都港区虎ノ門1丁目17番1号</p>
                <p>虎ノ門ヒルズビジネスタワー15階</p>
              </AboutUsLocationAddress>
            </AboutUsLocationCard>
          </RevealOnScroll>
          <RevealOnScroll delayMs={165}>
            <AboutUsLocationCard iconSrc="/about-us/location/indonesia-cu.svg" iconAlt="Indonesia">
              <AboutUsLocationName>Bekasi, Indonesia</AboutUsLocationName>
              <AboutUsLocationOffice>Indonesia Office</AboutUsLocationOffice>
              <AboutUsLocationEntity>&nbsp;</AboutUsLocationEntity>
              <AboutUsLocationAddress>
                <p>Office Park Harapan Indah OP 2 No 20,</p>
                <p>Medan Satria, Bekasi, West Java 17132</p>
              </AboutUsLocationAddress>
            </AboutUsLocationCard>
          </RevealOnScroll>
        </AboutUsLocationGrid>

        <RevealOnScroll delayMs={140}>
          <div className="mt-[20px]">
            <Image src="/about-us/location/world-location-cu.svg" alt="QueryPie Locations" width={1200} height={480} className="h-auto w-full" />
          </div>
        </RevealOnScroll>
      </AboutUsSection>

      <AipFreeTrialCtaSection />

      <SiteFooter />
    </main>
  );
}
