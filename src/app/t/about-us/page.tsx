import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Globe2, MapPin, TrendingUp } from "lucide-react";
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
    events: ["Y Combinator からの資金調達"],
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
    label: "日本 東京 / QueryPie AI合同会社",
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

      <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#08111f_0%,#0d1f36_58%,#f8fbff_58%,#ffffff_100%)] pt-[64px]">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute left-[8%] top-24 h-44 w-44 rounded-full bg-[#2A7FFF]/20 blur-3xl" />
          <div className="absolute right-[12%] top-16 h-52 w-52 rounded-full bg-[#63E6BE]/12 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-[1240px] gap-10 px-6 py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:px-10 lg:py-24">
          <RevealOnScroll>
            <div className="max-w-[640px] text-white">
              <p className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/78 backdrop-blur">
                About QueryPie AI
              </p>
              <h1 className="mt-5 text-[36px] font-semibold leading-[1.1] tracking-[-0.04em] sm:text-[48px] lg:text-[62px]">
                エンタープライズAIを、すべての企業に
                <span className="mt-2 block bg-gradient-to-r from-white via-[#D8E9FF] to-[#8FC6FF] bg-clip-text text-transparent">
                  90%のコスト削減、妥協なしのパフォーマンス
                </span>
              </h1>
              <div className="mt-8 space-y-5 text-[15px] leading-8 text-white/82 sm:text-base">
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
                  その結果、誰もが利用できるエンタープライズグレードのAIを実現しました。最先端のAIと合理的な予算、その両立が可能であることを証明しています。
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact-us?inquiry=ai-consulting"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  導入を相談する
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center gap-2 rounded-full border border-white/18 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  お問い合わせ
                </Link>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120} variant="scale">
            <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-white/10 p-3 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.7)] backdrop-blur-xl">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] bg-[#0f172a]">
                <Image
                  src="/t/about-us/hero-game-changer.png"
                  alt="QueryPie AI company overview visual"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <div className="grid gap-3 px-2 pb-2 pt-4 text-white sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <TrendingUp className="h-5 w-5 text-[#7DD3FC]" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Funding</p>
                  <p className="mt-1 text-sm leading-6 text-white/84">総資金調達額 3,000万ドル以上（2025年現在）</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <Building2 className="h-5 w-5 text-[#86EFAC]" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Founded</p>
                  <p className="mt-1 text-sm leading-6 text-white/84">2017年、シリコンバレーで創業</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <Globe2 className="h-5 w-5 text-[#F9A8D4]" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Global</p>
                  <p className="mt-1 text-sm leading-6 text-white/84">米国・韓国・日本・インドネシアに拠点を展開</p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 py-18 lg:px-10 lg:py-24">
        <RevealOnScroll>
          <div className="max-w-[720px]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Investors</p>
            <h2 className="mt-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.035em] text-slate-950 sm:text-[38px]">
              出資企業
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-slate-600 sm:text-base">
              総資金調達額：3,000万ドル以上（2025年現在）
              <br />
              最新ラウンド：2024年 日本における戦略的投資
            </p>
          </div>
        </RevealOnScroll>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {investors.map((investor, index) => (
            <RevealOnScroll key={investor.name} delayMs={index * 90}>
              <div className="flex h-full min-h-[132px] items-center justify-center rounded-[28px] border border-slate-200 bg-slate-50 px-8 py-8 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.28)]">
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

      <section className="bg-slate-50 py-18 lg:py-24">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
          <RevealOnScroll>
            <div className="max-w-[760px]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Journey</p>
              <h2 className="mt-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.035em] text-slate-950 sm:text-[38px]">
                私たちの歩み
              </h2>
              <div className="mt-4 space-y-2 text-[15px] leading-8 text-slate-600 sm:text-base">
                <p>AIが次のフロンティアになったとき、多くの企業が「莫大なコストと複雑な実装」という2つの壁に直面しました。</p>
                <p>そこで私たちは、その両方を解決するために進化を続けてきました。</p>
                <p>誰もが使えるアクセシビリティを保ちながら、AI変革の専門性を構築しています。</p>
              </div>
            </div>
          </RevealOnScroll>

          <div className="mt-12 space-y-4">
            {timeline.map((item, index) => (
              <RevealOnScroll key={item.year} delayMs={index * 60}>
                <div className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.28)] md:grid-cols-[120px_minmax(0,1fr)] md:items-start md:p-7">
                  <div className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-slate-950">{item.year}</div>
                  <ul className="space-y-3 text-[15px] leading-7 text-slate-600 sm:text-base">
                    {item.events.map((event) => (
                      <li key={event} className="flex gap-3">
                        <span className="mt-[10px] h-2.5 w-2.5 shrink-0 rounded-full bg-[#2563EB]" />
                        <span>{event}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 py-18 lg:px-10 lg:py-24">
        <RevealOnScroll>
          <div className="max-w-[760px]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Leadership</p>
            <h2 className="mt-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.035em] text-slate-950 sm:text-[38px]">
              私たちのチーム
            </h2>
            <div className="mt-4 space-y-2 text-[15px] leading-8 text-slate-600 sm:text-base">
              <p>私たちのリーダーは、既成概念にとらわれません。「エンタープライズAIは複雑で高額」という常識に、挑戦し続けています。</p>
              <p>シリコンバレーの研究室だけでなく、実際のビジネスの現場でAIを機能させる。それが私たちの使命です。</p>
            </div>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {leaders.map((leader, index) => (
            <RevealOnScroll key={leader.name} delayMs={index * 60}>
              <article className="group h-full overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_-56px_rgba(15,23,42,0.32)] transition hover:-translate-y-1 hover:shadow-[0_32px_80px_-52px_rgba(15,23,42,0.3)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <Image src={leader.imageSrc} alt={leader.name} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Leadership</p>
                  <h3 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-slate-950">{leader.name}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-slate-600">{leader.role}</p>
                  <Link
                    href={leader.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] transition hover:text-[#1D4ED8]"
                  >
                    LinkedInを見る
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] py-18 lg:py-24">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
          <RevealOnScroll>
            <div className="max-w-[760px]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Global Offices</p>
              <h2 className="mt-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.035em] text-slate-950 sm:text-[38px]">
                グローバル拠点
              </h2>
            </div>
          </RevealOnScroll>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
            <RevealOnScroll variant="scale">
              <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_28px_80px_-56px_rgba(15,23,42,0.3)] sm:p-6">
                <div className="relative aspect-[16/11] overflow-hidden rounded-[24px] bg-[#eaf2ff]">
                  <Image
                    src="/t/about-us/location/world-location-cu.svg"
                    alt="QueryPie AI global office map"
                    fill
                    className="object-contain p-4 sm:p-6"
                  />
                </div>
              </div>
            </RevealOnScroll>

            <div className="grid gap-4">
              {locations.map((location, index) => (
                <RevealOnScroll key={location.label} delayMs={index * 70}>
                  <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.28)]">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50">
                        <Image src={location.iconSrc} alt={location.iconAlt} width={32} height={32} className="h-8 w-8" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-slate-950">
                          <MapPin className="h-4 w-4 text-[#2563EB]" />
                          <h3 className="text-lg font-semibold tracking-[-0.02em]">{location.label}</h3>
                        </div>
                        <div className="mt-3 space-y-1 text-[15px] leading-7 text-slate-600">
                          {location.lines.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 pb-20 pt-4 lg:px-10 lg:pb-24">
        <RevealOnScroll>
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-[linear-gradient(135deg,#071226_0%,#0A1E38_55%,#14345E_100%)] px-6 py-8 text-white shadow-[0_30px_90px_-56px_rgba(15,23,42,0.58)] sm:px-8 sm:py-10 lg:flex lg:items-end lg:justify-between lg:gap-8">
            <div className="max-w-[720px]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/65">Work with QueryPie AI</p>
              <h2 className="mt-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.035em] sm:text-[40px]">
                エンタープライズAI導入を、
                <span className="block text-[#B9DBFF]">もっと現実的に、もっと速く。</span>
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-white/78 sm:text-base">
                セキュリティ、実装、コストの壁を超えて、現場で機能するAI基盤を一緒に設計します。ご相談内容に応じて、導入方針の整理からデモ、個別ディスカッションまでご案内します。
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 lg:mt-0 lg:justify-end">
              <Link
                href="/contact-us?inquiry=demo-request"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                デモを依頼する
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact-us?inquiry=technical-question"
                className="inline-flex items-center gap-2 rounded-full border border-white/16 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                技術相談をする
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <SiteFooter />
    </main>
  );
}
