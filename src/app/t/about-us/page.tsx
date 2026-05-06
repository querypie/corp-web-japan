import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CtaActions, CtaContent, CtaCopy, CtaDescription, CtaTitle, SimpleCtaSection } from "@/components/sections/simple-cta-section";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { BrandGradientCtaButton } from "@/components/ui/brand-gradient-cta-button";

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
  keywords: [
    "QueryPie AIについて",
    "QueryPie AI 投資家",
    "QueryPie AI 履歴",
    "QueryPie AI チーム",
    "QueryPie AI 所在地",
  ],
};

const investors = [
  {
    name: "Salesforce Ventures",
    logoSrc: "/about-us/investors/salesforce-ventures-invest.svg",
    width: 165,
    height: 59,
  },
  {
    name: "Y Combinator",
    logoSrc: "/about-us/investors/y-combinator-invest.svg",
    width: 175,
    height: 35,
  },
  {
    name: "Z Venture Capital",
    logoSrc: "/about-us/investors/z-venture-capital-invest.svg",
    width: 175,
    height: 77,
  },
] as const;

const timeline = [
  {
    year: "2017",
    events: ["設立"],
  },
  {
    year: "2018",
    events: ["カカオインベストメントからの資金調達"],
  },
  {
    year: "2019",
    events: ["TechCrunch SF 2019 に参加", "LG スタートアップコンペティション 2019 で優勝"],
  },
  {
    year: "2020",
    events: ["Y-Combinator からの資金調達"],
  },
  {
    year: "2021",
    events: [
      "QueryPie DAC（データベースアクセスコントローラー）提供開始",
      "優先シードラウンドで 1,775万ドルを調達",
    ],
  },
  {
    year: "2023",
    events: [
      "韓国信用保証基金から 581万ドルの資金を確保",
      "QueryPie SAC（システムアクセスコントローラー）提供開始",
    ],
  },
  {
    year: "2024",
    events: [
      "QueryPie KAC（Kubernetesアクセスコントローラー）/ WAC（Webアクセスコントローラー）提供開始",
      "Salesforce Ventures、Z Venture Capital、Murex Partners、Shinhan Venture Investment からの戦略的投資",
    ],
  },
  {
    year: "2025",
    events: [
      "QueryPie AIP（AIプラットフォーム）提供開始",
      "FDE（フォワードデプロイエンジニア）サービス提供開始",
    ],
  },
] as const;

const leaders = [
  {
    name: "Brant Hwang",
    role: "創業者 & 最高経営責任者 (CEO)",
    imageSrc: "/about-us/crew/brant.png",
    imageWidth: 264,
    imageHeight: 264,
    linkedinUrl: "https://www.linkedin.com/in/ishwang/",
  },
  {
    name: "Paul Hong",
    role: "共同創業者 & 最高財務責任者 (CFO)",
    imageSrc: "/about-us/crew/paul.png",
    imageWidth: 242,
    imageHeight: 242,
    linkedinUrl: "https://www.linkedin.com/in/paul-hong-bb0983216/",
  },
  {
    name: "Sam Kim",
    role: "最高技術責任者 (CTO)",
    imageSrc: "/about-us/crew/sam.png",
    imageWidth: 320,
    imageHeight: 320,
    linkedinUrl: "https://www.linkedin.com/in/sam0-kim/",
  },
  {
    name: "Jake Im",
    role: "最高セキュリティ責任者 (CISO & CPO)",
    imageSrc: "/about-us/crew/jake-im.png",
    imageWidth: 264,
    imageHeight: 264,
    linkedinUrl: "https://www.linkedin.com/in/sungbin-im-ba817b25/",
  },
  {
    name: "Kris Park",
    role: "最高戦略責任者 (CSO)",
    imageSrc: "/about-us/crew/kris.png",
    imageWidth: 242,
    imageHeight: 242,
    linkedinUrl: "https://www.linkedin.com/in/kris-park-89a83b19/",
  },
  {
    name: "Keizo Arinobu",
    role: "グローバルビジネス最高責任者 (CGO) & 日本カントリーマネージャ",
    imageSrc: "/about-us/crew/keizo.png",
    imageWidth: 320,
    imageHeight: 320,
    linkedinUrl: "https://www.linkedin.com/in/keizo-arinobu-b40769/",
  },
] as const;

const locations = [
  {
    label: "アメリカ ロサンゼルス",
    iconSrc: "/about-us/location/usa-cu.svg",
    iconAlt: "United States",
    lines: ["2525 West 8th Street, Suite 300,", "Los Angeles, CA 90057"],
  },
  {
    label: "韓国 ソウル",
    iconSrc: "/about-us/location/republic-of-korea-cu.svg",
    iconAlt: "Republic of Korea",
    lines: ["ソウル麻谷（マゴク）オフィス", "大韓民国 ソウル特別市 江西区 麻谷中央1路26 7階"],
  },
  {
    label: "日本 東京",
    subLabel: "QueryPie AI合同会社",
    iconSrc: "/about-us/location/japan-cu.svg",
    iconAlt: "Japan",
    lines: ["〒105-6490", "東京都港区虎ノ門1丁目17番1号", "虎ノ門ヒルズビジネスタワー15階"],
  },
  {
    label: "インドネシア",
    iconSrc: "/about-us/location/indonesia-cu.svg",
    iconAlt: "Indonesia",
    lines: ["Office Park Harapan Indah OP 2 No 20,", "Medan Satria, Bekasi, West Java 17132"],
  },
] as const;

const sectionHeadingClass =
  "text-[48.75px] font-normal leading-[58.125px] tracking-[-0.035em] text-slate-950";
const bodyCopyClass = "text-base font-light leading-[1.95] text-slate-600";
const secondaryCopyClass = "text-base font-light leading-[1.95] text-slate-600";

export default function TestAboutUsPage() {
  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <section className="mx-auto max-w-[1440px] bg-white px-[30px] pb-[84px] pt-[92px] lg:pb-[84px] lg:pt-[116px]">
        <RevealOnScroll>
          <div className="mx-auto max-w-[1200px]">
            <h1 className="text-[44px] font-medium leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-[52px] lg:text-[60px]">
              エンタープライズAIを、すべての企業に
              <br />
              90%のコスト削減、妥協なしのパフォーマンス
            </h1>
          </div>
        </RevealOnScroll>

        <div className="mx-auto mt-[56px] max-w-[1200px] grid items-start gap-16 lg:grid-cols-[504px_640px] lg:gap-14">
          <RevealOnScroll>
            <div className="space-y-6 max-w-[504px]">
              <p className={bodyCopyClass}>
                QueryPie AIは、他社が解決できない課題、すなわち、莫大なコスト、セキュリティリスク、イノベーションを妨げる複雑さを解決することで、企業のAI活用方法を変革します。
              </p>
              <p className={bodyCopyClass}>
                2017年にシリコンバレーで創業して以来、QueryPie AIはデータ保護のリーダーから、包括的なAIプラットフォームへと進化しました。
              </p>
              <p className={bodyCopyClass}>
                カスタムエージェント、一元管理、従量課金モデルを提供し、月額40〜80ドルのサブスクリプションを90%コスト削減して置き換えます。
              </p>
              <p className={bodyCopyClass}>
                その結果、誰もが利用できるエンタープライズグレードのAIを実現しました。
                <br />
                最先端のAIと合理的な予算、その両立が可能であることを証明しています。
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120}>
            <div className="relative h-[360px] w-full lg:w-[640px]">
              <Image src="/about-us/hero-game-changer.png" alt="Game Changer" fill priority className="object-cover" />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 pb-[92px] pt-[94px] lg:px-0">
        <RevealOnScroll>
          <h2 className={sectionHeadingClass}>出資企業</h2>
          <div className="mt-4 max-w-[760px]">
            <p className={bodyCopyClass}>
              総資金調達額：3,000万ドル以上（2025年現在）
              <br />
              最新ラウンド：2024年 日本における戦略的投資
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-[72px] flex flex-wrap items-center justify-center gap-x-[169px] gap-y-8">
          {investors.map((investor, index) => (
            <RevealOnScroll key={investor.name} delayMs={index * 80}>
              <div className="flex min-h-[80px] items-center justify-center">
                <Image
                  src={investor.logoSrc}
                  alt={investor.name}
                  width={investor.width}
                  height={investor.height}
                  style={{ width: `${investor.width}px`, height: `${investor.height}px` }}
                  className="max-w-full object-contain"
                />
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="bg-[#F6F8FA] py-[112.5px]">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-0">
          <RevealOnScroll>
            <h2 className={sectionHeadingClass}>私たちの歩み</h2>
            <div className="mt-4 max-w-[760px]">
              <p className={bodyCopyClass}>
                AIが次のフロンティアになったとき、多くの企業が「莫大なコストと複雑な実装」という2つの壁に直面しました。
                <br />
                そこで私たちは、その両方を解決するために進化を続けてきました。
                <br />
                誰もが使えるアクセシビリティを保ちながら、AI変革の専門性を構築しています。
              </p>
            </div>
          </RevealOnScroll>

          <div className="mt-[90px] space-y-6">
            {timeline.map((item, index) => (
              <RevealOnScroll key={item.year} delayMs={index * 50}>
                <div className="grid gap-4 px-[29px] py-[6px] md:grid-cols-[94px_minmax(0,1fr)] md:gap-[56px]">
                  <h3 className="text-[30px] font-medium leading-[39.375px] tracking-[-0.03em] text-slate-950">{item.year}</h3>
                  <div className="border-l border-slate-200 pl-[28px]">
                    <ul className={`list-none space-y-1 pl-0 ${secondaryCopyClass}`}>
                      {item.events.map((event) => (
                        <li key={event}>{event}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 pb-[75px] pt-[76px] lg:px-0">
        <RevealOnScroll>
          <h2 className={sectionHeadingClass}>私たちのチーム</h2>
          <div className="mt-4 max-w-[1200px]">
            <p className={bodyCopyClass}>
              私たちのリーダーは、既成概念にとらわれません。「エンタープライズAIは複雑で高額」という常識に、挑戦し続けています。
              <br />
              シリコンバレーの研究室だけでなく、実際のビジネスの現場でAIを機能させる—それが私たちの使命です。
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-[36px] grid gap-x-10 gap-y-[42px] md:grid-cols-2 xl:grid-cols-3">
          {leaders.map((leader, index) => (
            <RevealOnScroll key={leader.name} delayMs={index * 55}>
              <article className="flex h-full flex-col">
                <div className="relative aspect-square w-full overflow-hidden rounded-[24px] bg-[#F6F8FA]">
                  <Image
                    src={leader.imageSrc}
                    alt={leader.name}
                    fill
                    sizes="(min-width: 1280px) 320px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="pt-[19px] w-full">
                  <h3 className="text-[18.75px] font-medium leading-[26.25px] tracking-[-0.02em] text-slate-950">
                    {leader.name}
                  </h3>
                  <p className={`mt-1 text-[13.125px] leading-[20.625px] ${secondaryCopyClass}`}>{leader.role}</p>
                  <Link
                    href={leader.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${leader.name} LinkedIn`}
                    className={`mt-4 flex w-full justify-end ${secondaryCopyClass} transition hover:text-slate-950`}
                  >
                    <Image src="/about-us/linkedin.svg" alt="LinkedIn" width={34} height={34} className="h-[34px] w-[34px]" />
                  </Link>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 pb-[188px] pt-[12px] lg:px-0">
        <RevealOnScroll>
          <h2 className={sectionHeadingClass}>グローバル拠点</h2>
        </RevealOnScroll>

        <div className="mt-[31px] grid gap-x-[36px] gap-y-10 md:grid-cols-2 xl:grid-cols-4">
          {locations.map((location, index) => (
            <RevealOnScroll key={location.label} delayMs={index * 55}>
              <div className="flex h-full flex-col">
                <div className="inline-flex h-[35px] w-[35px] items-center justify-center rounded-[4px] border border-[#D0D7DE] bg-white">
                  <Image src={location.iconSrc} alt={location.iconAlt} width={23} height={17} className="h-[17px] w-[23px]" />
                </div>
                <div className="mt-4">
                  <h3 className="text-[18.75px] font-medium leading-[26.25px] tracking-[-0.02em] text-slate-950">
                    {location.label}
                    {"subLabel" in location ? <span className="block">{location.subLabel}</span> : null}
                  </h3>
                </div>
                <div className={`mt-4 space-y-0 ${secondaryCopyClass}`}>
                  {location.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delayMs={140}>
          <div className="mt-[20px]">
            <Image
              src="/about-us/location/world-location-cu.svg"
              alt="QueryPie Locations"
              width={1200}
              height={480}
              className="h-auto w-full"
            />
          </div>
        </RevealOnScroll>
      </section>

      <SimpleCtaSection>
        <RevealOnScroll>
          <CtaContent>
            <CtaCopy>
              <CtaTitle>まずは小さく、失敗しないAXを始めよう</CtaTitle>
              <CtaDescription className="mx-auto max-w-[560px] tracking-normal">
                簡単サインアップで、14日間の無料トライアルをお試しください
              </CtaDescription>
            </CtaCopy>
            <CtaActions>
              <BrandGradientCtaButton href="https://app.querypie.com/">無料で試してみる</BrandGradientCtaButton>
            </CtaActions>
          </CtaContent>
        </RevealOnScroll>
      </SimpleCtaSection>

      <SiteFooter />
    </main>
  );
}
