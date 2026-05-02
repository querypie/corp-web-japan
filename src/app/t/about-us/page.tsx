import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

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
    logoSrc: "/t/about-us/investors/salesforce-ventures-invest.svg",
    width: 240,
    height: 56,
  },
  {
    name: "Y Combinator",
    logoSrc: "/t/about-us/investors/y-combinator-invest.svg",
    width: 250,
    height: 56,
  },
  {
    name: "Z Venture Capital",
    logoSrc: "/t/about-us/investors/z-venture-capital-invest.svg",
    width: 250,
    height: 56,
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
    imageSrc: "/t/about-us/crew/brant.png",
    linkedinUrl: "https://www.linkedin.com/in/ishwang/",
  },
  {
    name: "Paul Hong",
    role: "共同創業者 & 最高財務責任者 (CFO)",
    imageSrc: "/t/about-us/crew/paul.png",
    linkedinUrl: "https://www.linkedin.com/in/paul-hong-bb0983216/",
  },
  {
    name: "Sam Kim",
    role: "最高技術責任者 (CTO)",
    imageSrc: "/t/about-us/crew/sam.png",
    linkedinUrl: "https://www.linkedin.com/in/sam0-kim/",
  },
  {
    name: "Jake Im",
    role: "最高セキュリティ責任者 (CISO & CPO)",
    imageSrc: "/t/about-us/crew/jake-im.png",
    linkedinUrl: "https://www.linkedin.com/in/sungbin-im-ba817b25/",
  },
  {
    name: "Kris Park",
    role: "最高戦略責任者 (CSO)",
    imageSrc: "/t/about-us/crew/kris.png",
    linkedinUrl: "https://www.linkedin.com/in/kris-park-89a83b19/",
  },
  {
    name: "Keizo Arinobu",
    role: "グローバルビジネス最高責任者 (CGO) & 日本カントリーマネージャ",
    imageSrc: "/t/about-us/crew/keizo.png",
    linkedinUrl: "https://www.linkedin.com/in/keizo-arinobu-b40769/",
  },
] as const;

const locations = [
  {
    label: "アメリカ ロサンゼルス",
    iconSrc: "/t/about-us/location/usa-cu.svg",
    iconAlt: "United States",
    lines: ["2525 West 8th Street, Suite 300,", "Los Angeles, CA 90057"],
  },
  {
    label: "韓国 ソウル",
    iconSrc: "/t/about-us/location/republic-of-korea-cu.svg",
    iconAlt: "Republic of Korea",
    lines: ["ソウル麻谷（マゴク）オフィス", "大韓民国 ソウル特別市 江西区 麻谷中央1路26 7階"],
  },
  {
    label: "日本 東京",
    subLabel: "QueryPie AI合同会社",
    iconSrc: "/t/about-us/location/japan-cu.svg",
    iconAlt: "Japan",
    lines: ["〒105-6490", "東京都港区虎ノ門1丁目17番1号", "虎ノ門ヒルズビジネスタワー15階"],
  },
  {
    label: "インドネシア",
    iconSrc: "/t/about-us/location/indonesia-cu.svg",
    iconAlt: "Indonesia",
    lines: ["Office Park Harapan Indah OP 2 No 20,", "Medan Satria, Bekasi, West Java 17132"],
  },
] as const;

export default function TestAboutUsPage() {
  return (
    <main className="relative overflow-x-hidden bg-white text-slate-950">
      <SiteHeader />

      <section className="mx-auto max-w-[1240px] px-6 pb-20 pt-[112px] lg:px-10 lg:pb-24 lg:pt-[132px]">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)] lg:gap-16">
          <RevealOnScroll>
            <div className="max-w-[620px]">
              <h1 className="text-[34px] font-semibold leading-[1.16] tracking-[-0.04em] text-slate-950 sm:text-[44px] lg:text-[56px]">
                エンタープライズAIを、すべての企業に
                <br />
                90%のコスト削減、妥協なしのパフォーマンス
              </h1>
              <div className="mt-8 space-y-5 text-[15px] leading-8 text-slate-600 sm:text-base">
                <p>
                  QueryPie AIは、他社が解決できない課題、すなわち、莫大なコスト、セキュリティリスク、イノベーションを妨げる複雑さを解決することで、企業のAI活用方法を変革します。
                </p>
                <p>
                  2017年にシリコンバレーで創業して以来、QueryPie AIはデータ保護のリーダーから、包括的なAIプラットフォームへと進化しました。
                </p>
                <p>
                  カスタムエージェント、一元管理、従量課金モデルを提供し、月額40〜80ドルのサブスクリプションを90%コスト削減して置き換えます。
                </p>
                <p>
                  その結果、誰もが利用できるエンタープライズグレードのAIを実現しました。
                  <br />
                  最先端のAIと合理的な予算、その両立が可能であることを証明しています。
                </p>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120}>
            <div className="relative overflow-hidden rounded-[28px] bg-[#0B1220] shadow-[0_30px_90px_-58px_rgba(15,23,42,0.45)]">
              <div className="relative aspect-[16/11]">
                <Image
                  src="/t/about-us/hero-game-changer.png"
                  alt="Game Changer"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 pb-24 lg:px-10 lg:pb-28">
        <RevealOnScroll>
          <div className="max-w-[760px]">
            <h2 className="text-[30px] font-semibold leading-[1.15] tracking-[-0.035em] text-slate-950 sm:text-[38px]">
              出資企業
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-slate-600 sm:text-base">
              総資金調達額：3,000万ドル以上（2025年現在）
              <br />
              最新ラウンド：2024年 日本における戦略的投資
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-10 grid items-center gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {investors.map((investor, index) => (
            <RevealOnScroll key={investor.name} delayMs={index * 80}>
              <div className="flex min-h-[64px] items-center justify-start lg:justify-center">
                <Image
                  src={investor.logoSrc}
                  alt={investor.name}
                  width={investor.width}
                  height={investor.height}
                  className="h-auto max-h-12 w-auto max-w-full"
                />
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="bg-[#F5F7FA] py-20 lg:py-24">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
          <RevealOnScroll>
            <div className="max-w-[760px]">
              <h2 className="text-[30px] font-semibold leading-[1.15] tracking-[-0.035em] text-slate-950 sm:text-[38px]">
                私たちの歩み
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-slate-600 sm:text-base">
                AIが次のフロンティアになったとき、多くの企業が「莫大なコストと複雑な実装」という2つの壁に直面しました。
                <br />
                そこで私たちは、その両方を解決するために進化を続けてきました。
                <br />
                誰もが使えるアクセシビリティを保ちながら、AI変革の専門性を構築しています。
              </p>
            </div>
          </RevealOnScroll>

          <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200 bg-transparent">
            {timeline.map((item, index) => (
              <RevealOnScroll key={item.year} delayMs={index * 50}>
                <div className="grid gap-4 py-6 md:grid-cols-[120px_minmax(0,1fr)] md:gap-8 md:py-7">
                  <h3 className="text-[26px] font-semibold leading-none tracking-[-0.035em] text-slate-950 md:text-[28px]">{item.year}</h3>
                  <ul className="space-y-2 text-[15px] leading-7 text-slate-600 sm:text-base">
                    {item.events.map((event) => (
                      <li key={event}>{event}</li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-24">
        <RevealOnScroll>
          <div className="max-w-[760px]">
            <h2 className="text-[30px] font-semibold leading-[1.15] tracking-[-0.035em] text-slate-950 sm:text-[38px]">
              私たちのチーム
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-slate-600 sm:text-base">
              私たちのリーダーは、既成概念にとらわれません。「エンタープライズAIは複雑で高額」という常識に、挑戦し続けています。
              <br />
              シリコンバレーの研究室だけでなく、実際のビジネスの現場でAIを機能させる—それが私たちの使命です。
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {leaders.map((leader, index) => (
            <RevealOnScroll key={leader.name} delayMs={index * 55}>
              <article className="flex h-full flex-col">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-slate-100">
                  <Image src={leader.imageSrc} alt={leader.name} fill className="object-cover" />
                </div>
                <div className="pt-5">
                  <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-slate-950">{leader.name}</h3>
                  <p className="mt-2 text-[15px] leading-7 text-slate-600">{leader.role}</p>
                  <Link
                    href={leader.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] transition hover:text-[#1D4ED8]"
                  >
                    LinkedIn
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 pb-20 lg:px-10 lg:pb-24">
        <RevealOnScroll>
          <div className="max-w-[760px]">
            <h2 className="text-[30px] font-semibold leading-[1.15] tracking-[-0.035em] text-slate-950 sm:text-[38px]">
              グローバル拠点
            </h2>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
          {locations.map((location, index) => (
            <RevealOnScroll key={location.label} delayMs={index * 55}>
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <Image src={location.iconSrc} alt={location.iconAlt} width={28} height={28} className="h-7 w-7" />
                  <div>
                    <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-slate-950">{location.label}</h3>
                    {"subLabel" in location ? <p className="text-[18px] font-semibold tracking-[-0.02em] text-slate-950">{location.subLabel}</p> : null}
                  </div>
                </div>
                <div className="mt-4 space-y-1 text-[15px] leading-7 text-slate-600">
                  {location.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delayMs={140}>
          <div className="mt-14 overflow-hidden rounded-[28px] bg-[#F4F7FB] p-4 sm:p-6 lg:p-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[22px]">
              <Image
                src="/t/about-us/location/world-location-cu.svg"
                alt="QueryPie AI global office map"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section className="bg-[#F5F7FA] py-20 lg:py-24">
        <div className="mx-auto max-w-[920px] px-6 text-center lg:px-10">
          <RevealOnScroll>
            <h2 className="text-[30px] font-semibold leading-[1.15] tracking-[-0.035em] text-slate-950 sm:text-[38px]">
              まずは小さく、失敗しないAXを始めよう
            </h2>
            <p className="mx-auto mt-5 max-w-[560px] text-[15px] leading-8 text-slate-600 sm:text-base">
              簡単サインアップで、14日間の無料トライアルをお試しください
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="https://app.querypie.com/"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#1D4ED8_0%,#2563EB_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_48px_-24px_rgba(37,99,235,0.5)] transition hover:opacity-95"
              >
                無料で試してみる
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
