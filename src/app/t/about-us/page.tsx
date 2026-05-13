import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  AboutUsBodyCopy,
  AboutUsHeroCopy,
  AboutUsHeroHeading,
  AboutUsHeroIntro,
  AboutUsHeroImage,
  AboutUsHeroLayout,
  AboutUsHeroSection,
  AboutUsInvestorLogo,
  AboutUsInvestorLogoRow,
  AboutUsLeaderCard,
  AboutUsLeaderGrid,
  AboutUsLeaderName,
  AboutUsLeaderRole,
  AboutUsLocationAddress,
  AboutUsLocationCard,
  AboutUsLocationGrid,
  AboutUsLocationName,
  AboutUsSection,
  AboutUsSectionHeading,
  AboutUsSectionIntro,
  AboutUsTimeline,
  AboutUsTimelineItem,
} from "@/components/sections/about-us/section";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { AipFreeTrialCtaSection } from "@/components/sections/simple-cta-section";

export const metadata: Metadata = {
  title: "会社概要 | QueryPie AI",
  description: "QueryPie AIは、お客様のビジネスを前進させるエンタープライズAI企業です。",
  alternates: {
    canonical: "/t/about-us",
  },
  robots: {
    index: false,
    follow: false,
  },
  keywords: ["QueryPie AIについて", "QueryPie AI 投資家", "QueryPie AI 履歴", "QueryPie AI チーム", "QueryPie AI 所在地"],
};

export default function AboutUsPage() {
  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <AboutUsHeroSection>
        <AboutUsHeroIntro>
          <RevealOnScroll>
            <AboutUsHeroHeading>
              エンタープライズAIを、すべての企業に
              <br />
              90%のコスト削減、妥協なしのパフォーマンス
            </AboutUsHeroHeading>
          </RevealOnScroll>

          <AboutUsHeroLayout>
            <RevealOnScroll>
              <AboutUsHeroCopy>
                <AboutUsBodyCopy>
                  QueryPie AIは、他社が解決できない課題、すなわち、莫大なコスト、セキュリティリスク、イノベーションを妨げる複雑さを解決することで、企業のAI活用方法を変革します。
                </AboutUsBodyCopy>
                <AboutUsBodyCopy>
                  2017年にシリコンバレーで創業して以来、QueryPie AIはデータ保護のリーダーから、包括的なAIプラットフォームへと進化しました。
                </AboutUsBodyCopy>
                <AboutUsBodyCopy>
                  カスタムエージェント、一元管理、従量課金モデルを提供し、月額40〜80ドルのサブスクリプションを90%コスト削減して置き換えます。
                </AboutUsBodyCopy>
                <AboutUsBodyCopy>
                  その結果、誰もが利用できるエンタープライズグレードのAIを実現しました。
                  最先端のAIと合理的な予算、その両立が可能であることを証明しています。
                </AboutUsBodyCopy>
              </AboutUsHeroCopy>
            </RevealOnScroll>

            <RevealOnScroll delayMs={120}>
              <AboutUsHeroImage />
            </RevealOnScroll>
          </AboutUsHeroLayout>
        </AboutUsHeroIntro>
      </AboutUsHeroSection>

      <AboutUsSection className="mx-auto max-w-[1200px] px-6 pb-[92px] pt-[94px] lg:px-0">
        <RevealOnScroll>
          <AboutUsSectionHeading>出資企業</AboutUsSectionHeading>
          <AboutUsSectionIntro>
            <AboutUsBodyCopy>
              総資金調達額：3,000万ドル以上（2025年現在）
              <br />
              最新ラウンド：2024年 日本における戦略的投資
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

      <AboutUsSection muted className="py-[112.5px]">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-0">
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
              <AboutUsTimelineItem year="2017">
                <li>設立</li>
              </AboutUsTimelineItem>
            </RevealOnScroll>
            <RevealOnScroll delayMs={50}>
              <AboutUsTimelineItem year="2018">
                <li>カカオインベストメントからの資金調達</li>
              </AboutUsTimelineItem>
            </RevealOnScroll>
            <RevealOnScroll delayMs={100}>
              <AboutUsTimelineItem year="2019">
                <li>TechCrunch SF 2019 に参加</li>
                <li>LG スタートアップコンペティション 2019 で優勝</li>
              </AboutUsTimelineItem>
            </RevealOnScroll>
            <RevealOnScroll delayMs={150}>
              <AboutUsTimelineItem year="2020">
                <li>Y-Combinator からの資金調達</li>
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
          </AboutUsTimeline>
        </div>
      </AboutUsSection>

      <AboutUsSection className="mx-auto max-w-[1200px] px-6 pb-[75px] pt-[76px] lg:px-0">
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

      <AboutUsSection className="mx-auto max-w-[1200px] px-6 pb-[188px] pt-[12px] lg:px-0">
        <RevealOnScroll>
          <AboutUsSectionHeading>グローバル拠点</AboutUsSectionHeading>
        </RevealOnScroll>

        <AboutUsLocationGrid>
          <RevealOnScroll>
            <AboutUsLocationCard iconSrc="/about-us/location/usa-cu.svg" iconAlt="United States">
              <AboutUsLocationName>アメリカ ロサンゼルス</AboutUsLocationName>
              <AboutUsLocationAddress>
                <p>2525 West 8th Street, Suite 300,</p>
                <p>Los Angeles, CA 90057</p>
              </AboutUsLocationAddress>
            </AboutUsLocationCard>
          </RevealOnScroll>
          <RevealOnScroll delayMs={55}>
            <AboutUsLocationCard iconSrc="/about-us/location/republic-of-korea-cu.svg" iconAlt="Republic of Korea">
              <AboutUsLocationName>韓国 ソウル</AboutUsLocationName>
              <AboutUsLocationAddress>
                <p>ソウル麻谷（マゴク）オフィス</p>
                <p>大韓民国 ソウル特別市 江西区 麻谷中央1路26 7階</p>
              </AboutUsLocationAddress>
            </AboutUsLocationCard>
          </RevealOnScroll>
          <RevealOnScroll delayMs={110}>
            <AboutUsLocationCard iconSrc="/about-us/location/japan-cu.svg" iconAlt="Japan">
              <AboutUsLocationName>
                日本 東京
                <span className="block">QueryPie AI合同会社</span>
              </AboutUsLocationName>
              <AboutUsLocationAddress>
                <p>〒105-6490</p>
                <p>東京都港区虎ノ門1丁目17番1号</p>
                <p>虎ノ門ヒルズビジネスタワー15階</p>
              </AboutUsLocationAddress>
            </AboutUsLocationCard>
          </RevealOnScroll>
          <RevealOnScroll delayMs={165}>
            <AboutUsLocationCard iconSrc="/about-us/location/indonesia-cu.svg" iconAlt="Indonesia">
              <AboutUsLocationName>インドネシア</AboutUsLocationName>
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
