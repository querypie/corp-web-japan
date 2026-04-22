import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  BriefcaseBusiness,
  Cable,
  CalendarDays,
  CheckCircle2,
  FileSearch,
  FolderKanban,
  Layers3,
  Megaphone,
  MessageSquareText,
  ScanSearch,
  Shield,
  Play,
  Settings2,
  Search,
  ShieldCheck,
  Wallet,
  ChartColumnIncreasing,
} from "lucide-react";
import { homePageContent } from "@/content/home";
import { FeatureShowcase } from "@/components/sections/feature-showcase";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { UseCaseShowcase } from "@/components/sections/use-case-showcase";

const aiCrewAccentTextClass =
  "bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_48%,#2563EB_78%,#93C5FD_100%)] bg-clip-text text-transparent [animation:heroAccentGlow_3.2s_ease-in-out_infinite] motion-reduce:animate-none";

const aiCrewPrimaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] px-5 py-3 text-base font-semibold text-white shadow-[0_22px_46px_-24px_rgba(23,78,166,0.72)] transition hover:brightness-[1.06] hover:shadow-[0_26px_58px_-26px_rgba(23,78,166,0.82)]";

const aiCrewSecondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#C9D8F5] bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF4FF_100%)] px-5 py-3 text-base font-semibold text-[#163A7A] shadow-[0_18px_40px_-30px_rgba(15,42,95,0.34)] transition hover:border-[#B7CCEF] hover:bg-[linear-gradient(180deg,#FAFCFF_0%,#E8F0FF_100%)]";

const processStepIcons = [
  FolderKanban,
  Search,
  BriefcaseBusiness,
  Settings2,
  Cable,
] as const;

function renderEmphasizedText(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold text-slate-800">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function renderHighlightedKeyword(line: string, keyword: string) {
  if (!line.includes(keyword)) {
    return line;
  }

  const [before, after] = line.split(keyword);

  return (
    <>
      {before}
      <span className={aiCrewAccentTextClass}>
        {keyword}
      </span>
      {after}
    </>
  );
}

function renderHighlightedKeywords(line: string, keywords: string[]) {
  return line.split(new RegExp(`(${keywords.join("|")})`, "g")).map((part, index) => {
    if (keywords.includes(part)) {
      return (
        <span key={`${part}-${index}`} className={aiCrewAccentTextClass}>
          {part}
        </span>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}

export function HomePageSections() {
  const {
    hero,
    lostSection,
    whitepaperCta,
    featureIntro,
    featureTabs,
    comparison,
    roi,
    problem,
    roles,
    process,
    testimonials,
    contact,
  } = homePageContent;

  return (
    <>
      <section id="hero" className="mx-auto max-w-[1260px] px-6 py-14 lg:px-0 lg:py-[72px]">
        <div className="relative z-10 mx-auto overflow-hidden rounded-[2.2rem] border border-[#D6E2F6] bg-[linear-gradient(135deg,#FBFDFF_0%,#EEF4FF_46%,#F8FBFF_100%)] px-6 py-8 shadow-[0_28px_90px_-56px_rgba(15,42,95,0.22)] sm:px-8 lg:px-[30px] lg:py-10">
          <div className="absolute left-[-80px] top-[-72px] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.22)_0%,rgba(96,165,250,0)_72%)]" />
          <div className="absolute bottom-[-110px] right-[-30px] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.16)_0%,rgba(37,99,235,0)_72%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(500px,590px)] lg:items-center lg:gap-7">
            <div className="max-w-[620px] lg:pl-4">
              <RevealOnScroll>
                <div className="inline-flex rounded-full border border-[#C9D8F5] bg-white/90 px-4 py-2 text-[12px] font-semibold tracking-[0.12em] text-[#163A7A] shadow-[0_14px_36px_-24px_rgba(15,42,95,0.28)] backdrop-blur-sm">
                  {hero.eyebrow}
                </div>
              </RevealOnScroll>

              <RevealOnScroll delayMs={40}>
                <h1 className="mt-5 text-left text-[47px] font-[800] leading-[1.14] tracking-[-0.04em] text-slate-950 sm:text-[57px] lg:text-[73px] lg:leading-[86px]">
                  {hero.title.split("\n").map((line, index, lines) => (
                    <span
                      key={`${line}-${index}`}
                      className={`block [animation:heroHeadlineRise_760ms_ease-out_both] motion-reduce:animate-none ${
                        index === lines.length - 1 ? aiCrewAccentTextClass : "text-slate-950"
                      }`}
                      style={{ animationDelay: `${index * 120}ms` }}
                    >
                      {line}
                    </span>
                  ))}
                </h1>
              </RevealOnScroll>

              <RevealOnScroll delayMs={70}>
                <p className="mt-4 text-left">
                  <span className="inline-block bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] bg-clip-text text-[18px] font-bold leading-[1.55] tracking-[0.06em] text-transparent sm:text-[20px]">
                    {hero.subcopy}
                  </span>
                </p>
              </RevealOnScroll>

              <RevealOnScroll delayMs={90}>
                <div className="mt-5 max-w-[35rem] text-left text-[16px] leading-[1.95] tracking-[-0.01em] text-slate-600 sm:text-base">
                  <p>{hero.body}</p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delayMs={140}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link href={hero.primaryCta.href} className={aiCrewPrimaryButtonClass}>
                    {hero.primaryCta.label}
                  </Link>
                  {isExternalHref(hero.secondaryCta.href) ? (
                    <a
                      href={hero.secondaryCta.href}
                      target="_blank"
                      rel="noreferrer"
                      className={aiCrewSecondaryButtonClass}
                    >
                      {hero.secondaryCta.label}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <Link href={hero.secondaryCta.href} className={aiCrewSecondaryButtonClass}>
                      {hero.secondaryCta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </RevealOnScroll>
            </div>

            <RevealOnScroll variant="scale" delayMs={160}>
              <div className="relative">
                <figure className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[#D7E5FB] shadow-[0_34px_96px_-48px_rgba(15,42,95,0.30)]">
                  <div className="absolute inset-0 z-10 bg-[linear-gradient(135deg,rgba(15,42,95,0.14)_0%,rgba(15,42,95,0.02)_38%,rgba(15,42,95,0.18)_100%)]" />
                  <div className="relative aspect-[16/9.35]">
                    <Image
                      src={hero.imageSrc}
                      alt={hero.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 560px, 100vw"
                      priority
                    />
                  </div>
                </figure>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section id="lost" className="mx-auto max-w-[1920px] bg-white px-6 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1120px]">
          <RevealOnScroll variant="up">
            <div className="mx-auto max-w-[980px] rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.95)_100%)] px-6 py-8 shadow-[0_22px_60px_-46px_rgba(15,23,42,0.16)] sm:px-8 lg:px-10 lg:py-10">
              <div className="max-w-[880px] border-l-4 border-[#2563EB] pl-5">
                <h2 className="text-[31px] font-bold leading-[1.2] tracking-[-0.04em] text-slate-950 sm:text-[37px] lg:text-[41px]">
                  {lostSection.title}
                </h2>
                <div className="mt-6 space-y-5 text-[16px] leading-8 text-slate-600">
                  <p>{lostSection.paragraphs[0]}</p>
                  <p>{lostSection.paragraphs[1]}</p>
                  <p>{lostSection.paragraphs[2]}</p>
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
                    {whitepaperCta.label}
                  </div>
                  <h3 className="mt-4 text-[24px] font-semibold leading-[1.35] tracking-[-0.03em] text-white sm:text-[28px]">
                    {whitepaperCta.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-7 text-white/82">
                    {whitepaperCta.body}
                  </p>
                </div>
                <a
                  href={whitepaperCta.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`${aiCrewSecondaryButtonClass} whitespace-nowrap`}
                >
                  {whitepaperCta.cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-[1920px] bg-[#f6f8fb] px-6 py-20 lg:px-10">
        <FeatureShowcase
          intro={{ title: featureIntro.title, body: featureIntro.body, imageSrc: featureIntro.imageSrc, imageAlt: featureIntro.imageAlt }}
        />
      </section>

      <section id="why" className="mx-auto max-w-[1920px] bg-white px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1120px] text-center">
          <RevealOnScroll>
            <h2 className="text-[37px] font-semibold leading-[1.26] tracking-[-0.03em] text-slate-950 sm:text-[45px] sm:leading-[58px] sm:tracking-[-0.04em]">
              {renderHighlightedKeyword(comparison.title, "判断と創造")}
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delayMs={80}>
            <p className="mx-auto mt-5 max-w-[900px] text-left text-base leading-8 text-slate-600">
              {renderEmphasizedText(comparison.body)}
            </p>
          </RevealOnScroll>
        </div>

        <RevealOnScroll className="mx-auto mt-12 max-w-[1120px] rounded-[2.2rem] border border-black/6 bg-white p-5 shadow-[0_28px_90px_-50px_rgba(15,23,42,0.1)] sm:p-6" variant="up" delayMs={140}>
          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-[1.8rem] border border-black/6 bg-[#f9f9fb] p-6">
              <div className="text-center">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">Before</p>
                <p className="mt-1 text-sm font-medium tracking-[-0.02em] text-slate-500">{problem.title}</p>
              </div>
              <div className="mt-8 flex min-h-[18rem] items-center justify-center">
                <div className="relative h-[320px] w-full max-w-[27rem]">
                  {[
                    { icon: Search, pos: "left-6 top-4", rot: "-rotate-[10deg]" },
                    { icon: FolderKanban, pos: "left-[114px] top-[58px]", rot: "rotate-[12deg]" },
                    { icon: ChartColumnIncreasing, pos: "left-[42px] bottom-[92px]", rot: "-rotate-[12deg]" },
                    { icon: MessageSquareText, pos: "right-[78px] top-[16px]", rot: "rotate-[9deg]" },
                    { icon: FileSearch, pos: "right-[28px] bottom-[112px]", rot: "-rotate-[10deg]" },
                    { icon: Layers3, pos: "left-[142px] bottom-[70px]", rot: "rotate-[7deg]" },
                    { icon: ShieldCheck, pos: "right-[150px] bottom-[48px]", rot: "-rotate-[7deg]" },
                    { icon: CalendarDays, pos: "left-[16px] top-[130px]", rot: "rotate-[8deg]" },
                  ].map(({ icon: Icon, pos, rot }, index) => (
                    <div key={`before-icon-${index}`} className={`absolute ${pos} ${rot}`}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-black/6 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                        <Icon className="h-[18px] w-[18px] text-slate-700" />
                      </div>
                    </div>
                  ))}

                  <div className="absolute left-1/2 top-[44%] z-20 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_24px_55px_-30px_rgba(15,23,42,0.22)]">
                    <div className="relative h-11 w-11 overflow-hidden">
                      <Image src="/images/icon_main.png" alt="Human decision maker" fill className="object-contain" sizes="44px" />
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2">
                    {problem.cards.map((card) => (
                      <div key={card.title} className="max-w-[330px] rounded-full border border-[#dbe5f7] bg-white px-4 py-2 text-center text-[12px] font-medium leading-5 tracking-[-0.01em] text-slate-700 shadow-[0_16px_36px_-24px_rgba(15,23,42,0.18)]">
                        {card.title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-[1.8rem] border border-black/6 bg-[#2f3a49] p-6">
              <div className="text-center">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-white">After</p>
                <p className="mt-1 text-sm font-medium tracking-[-0.02em] text-white/65">役割分担が整理され、本来の業務に集中</p>
              </div>
              <div className="mt-8 flex min-h-[18rem] items-center justify-center">
                <div className="relative h-[356px] w-full max-w-[33rem]">
                  {[
                    "left-[62px] top-[30px]",
                    "right-[62px] top-[30px]",
                    "left-[24px] top-[122px]",
                    "right-[24px] top-[122px]",
                    "left-[56px] bottom-[70px]",
                    "right-[56px] bottom-[70px]",
                    "left-[150px] top-[6px]",
                    "right-[150px] top-[6px]",
                    "left-[148px] bottom-[8px]",
                    "right-[148px] bottom-[8px]",
                  ].map((pos, index) => {
                    const backgroundIcons = [Search, Layers3, FileSearch, ChartColumnIncreasing, ShieldCheck];
                    const Icon = backgroundIcons[index % backgroundIcons.length];

                    return (
                      <div
                        key={`impact-bg-${index}`}
                        className={`absolute ${pos} z-10 flex h-11 w-11 items-center justify-center rounded-[15px] border border-white/8 bg-white/6 opacity-[0.18]`}
                      >
                        <Icon className="h-4 w-4 text-white/70" />
                      </div>
                    );
                  })}

                  <div className="absolute left-1/2 top-1/2 z-20 h-[312px] w-[312px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/16 bg-[radial-gradient(circle,#f7fbff_0%,#eef4fb_52%,rgba(255,255,255,0.06)_72%,rgba(255,255,255,0)_100%)]" />

                  <div className="absolute left-1/2 top-1/2 z-30 flex h-[154px] w-[154px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-white text-[#2f3a49] shadow-[0_30px_70px_-28px_rgba(15,23,42,0.18)]">
                    <div className="relative h-[74px] w-[74px] overflow-hidden">
                      <Image src="/images/icon_main.png" alt="Human decision maker" fill className="object-contain" sizes="74px" />
                    </div>
                    <span className="mt-2 text-center text-[12px] font-semibold leading-4 tracking-[-0.01em] text-slate-600">
                      人による最終判断
                    </span>
                  </div>

                  {[
                    { icon: Search, label: "調査", bubble: "right-[132px] top-[44px]", chip: "" },
                    { icon: Layers3, label: "整理", bubble: "right-[34px] top-[112px]", chip: "" },
                    { icon: FileSearch, label: "一次ドラフト", bubble: "right-[138px] bottom-[118px]", chip: "" },
                    { icon: ChartColumnIncreasing, label: "分析準備", bubble: "right-[30px] bottom-[110px]", chip: "" },
                    { icon: ShieldCheck, label: "リスク検知", bubble: "left-1/2 top-[22px] -translate-x-1/2", chip: "left-1/2 top-[88px] -translate-x-1/2" },
                  ].map(({ icon: Icon, label, bubble, chip }) => (
                    <div key={label}>
                      <div className={`absolute ${bubble} z-40 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/90 bg-[#1E293B] shadow-lg`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      {chip ? (
                        <div className={`absolute ${chip} z-40 whitespace-nowrap rounded-full bg-[#1E293B] px-3 py-1.5 text-[11px] font-medium text-white shadow-lg`}>
                          {label}
                        </div>
                      ) : null}
                    </div>
                  ))}

                  <div className="absolute left-[14px] top-1/2 z-30 w-[124px] -translate-y-1/2 rounded-[1rem] bg-white/14 px-3 py-4 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">人</p>
                    <div className="mt-3 grid gap-2">
                      {["最終判断", "顧客対応", "提案", "企画", "改善"].map((item) => (
                        <div key={item} className="rounded-[0.9rem] bg-white/10 px-3 py-2 text-[12px] font-medium text-white">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="absolute right-[14px] top-1/2 z-30 w-[124px] -translate-y-1/2 rounded-[1rem] bg-white/14 px-3 py-4 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">AI</p>
                    <div className="mt-3 grid gap-2">
                      {["調査", "整理", "一次ドラフト", "分析準備", "リスク検知"].map((item) => (
                        <div key={item} className="rounded-[0.9rem] bg-white/10 px-3 py-2 text-[12px] font-medium text-white">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </RevealOnScroll>
      </section>

      <section id="design-elements" className="mx-auto max-w-[1920px] bg-[#f6f8fb] px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1120px]">
          <RevealOnScroll>
            <h2 className="mx-auto max-w-[800px] text-center text-[33px] font-semibold leading-[1.22] tracking-[-0.04em] text-[#101828] sm:text-[45px] sm:leading-[1.2]">
              {renderHighlightedKeyword(featureIntro.subtitle, "実務を担う")}
            </h2>
          </RevealOnScroll>

          <div className="mt-10 grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-5">
            {featureTabs.map((item, index) => (
              <RevealOnScroll key={item.label} delayMs={index * 70}>
                <article className="flex h-full min-h-[212px] flex-col rounded-[1.35rem] border border-black/6 bg-white px-5 py-5 shadow-[0_18px_40px_-36px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#eef2f7] text-[#2f3a49]">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#98a2b3]">
                      {item.label}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-1 flex-col">
                    <h3 className="text-[18px] font-semibold leading-[1.45] tracking-[-0.02em] text-[#101828]">
                      {item.heading}
                    </h3>
                    <p className="mt-2 text-[14px] leading-6 text-[#667085]">{item.description}</p>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="mx-auto max-w-[1920px] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1120px] text-center">
          <RevealOnScroll>
            <h2 className="text-[37px] font-semibold leading-[1.26] tracking-[-0.03em] text-slate-950 sm:text-[45px] sm:leading-[58px] sm:tracking-[-0.04em]">
              {renderHighlightedKeyword(process.title, "小さく始める")}
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delayMs={80}>
            <p className="mx-auto mt-5 w-full max-w-[900px] whitespace-pre-line text-left text-base leading-7 text-slate-500 lg:pl-[30px]">
              {process.body}
            </p>
          </RevealOnScroll>
        </div>

        <div className="mx-auto mt-12 max-w-[1120px]">
          {process.note ? (
            <p className="mx-auto mb-6 max-w-[860px] text-center text-[16px] leading-7 text-slate-600">{process.note}</p>
          ) : null}

          <div className="grid gap-4 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
              {process.steps.map((step, index) => {
                const Icon = processStepIcons[index % processStepIcons.length];

                return (
                  <RevealOnScroll
                    key={step.step}
                    className="h-full"
                    delayMs={index * 70}
                  >
                    <article className="relative flex h-full min-h-[288px] flex-col overflow-hidden rounded-[1.8rem] border border-black/6 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-md shadow-[0_24px_70px_-50px_rgba(15,23,42,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-md lg:p-7">
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-white/0 via-white/70 to-white/0" />
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center rounded-full bg-[#2f3a49] px-3 py-1.5 text-[12px] font-semibold tracking-[0.08em] text-white">
                          {step.step}
                        </span>
                        <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#f2f4f7] text-[#344054]">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>

                      <h3 className="mt-6 text-[20px] font-semibold leading-[1.45] tracking-[-0.02em] text-slate-800">
                        {step.title}
                      </h3>
                      <p className="mt-4 text-[16px] leading-[1.95] text-slate-600">{step.body}</p>
                    </article>
                  </RevealOnScroll>
                );
              })}

              <RevealOnScroll className="h-full" delayMs={process.steps.length * 70}>
                <article className="relative flex h-full min-h-[288px] flex-col overflow-hidden rounded-[1.8rem] border border-[#d7e4fb] bg-[linear-gradient(135deg,#f8fbff_0%,#eef4ff_52%,#f7faff_100%)] p-6 shadow-[0_24px_70px_-50px_rgba(15,42,95,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-md lg:p-7">
                  <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgba(37,99,235,0)_0%,rgba(37,99,235,0.45)_50%,rgba(37,99,235,0)_100%)]" />
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] text-white shadow-[0_18px_36px_-24px_rgba(23,78,166,0.65)]">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                    <span className="inline-flex rounded-full border border-[#C9D8F5] bg-white/90 px-4 py-2 text-[12px] font-semibold tracking-[0.12em] text-[#163A7A] shadow-[0_14px_36px_-24px_rgba(15,42,95,0.28)]">
                      小さく始めて本番運用へ
                    </span>
                  </div>

                  <p className="mt-6 bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] bg-clip-text text-[16px] font-semibold leading-6 tracking-[-0.01em] text-transparent">
                    まずはお気軽にご相談ください
                  </p>

                  <div className="mt-auto flex flex-col gap-3 pt-5">
                    <Link href={process.primaryCta.href} className={aiCrewPrimaryButtonClass}>
                      {process.primaryCta.label}
                    </Link>
                    <Link href={process.secondaryCta.href} className={aiCrewSecondaryButtonClass}>
                      活用事例を見る
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              </RevealOnScroll>
          </div>
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-[1920px] bg-[#f6f8fb] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1120px] text-center">
          <RevealOnScroll>
            <h2 className="text-[37px] font-semibold leading-[1.26] tracking-[-0.03em] text-slate-950 sm:text-[45px] sm:leading-[58px] sm:tracking-[-0.04em]">
              {roi.title.split("\n")[0]}
              <br />
              {renderHighlightedKeyword(roi.title.split("\n")[1] ?? "", "QueryPie AIP")}
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delayMs={80}>
            <p className="mx-auto mt-5 w-full max-w-[760px] text-left text-base leading-7 text-slate-500">
              {roi.body}
            </p>
          </RevealOnScroll>
        </div>

        <RevealOnScroll className="mx-auto mt-12 max-w-[1120px]" variant="scale" delayMs={140}>
          <div className="relative overflow-hidden rounded-[2.4rem] border border-[#dbe5f4] bg-[linear-gradient(135deg,#ffffff_0%,#f7faff_48%,#eef4ff_100%)] p-5 shadow-[0_30px_90px_-58px_rgba(15,42,95,0.22)] sm:p-7 lg:h-[640px] lg:p-10">
            <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.13)_0%,rgba(37,99,235,0.07)_30%,rgba(37,99,235,0.025)_56%,rgba(37,99,235,0)_76%)] blur-[2px] lg:block" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2563EB]/10 lg:block" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2563EB]/8 lg:block" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.16)_0%,rgba(37,99,235,0.06)_52%,rgba(37,99,235,0)_76%)] lg:block" />

            <div className="relative z-10 grid gap-4 md:grid-cols-2 lg:block lg:h-full">
              <div className="flex min-h-[210px] flex-col items-center justify-center rounded-[2rem] border border-[#c9d8f5]/80 bg-white/90 px-8 py-9 text-center shadow-[0_24px_70px_-50px_rgba(15,42,95,0.24)] backdrop-blur-sm md:col-span-2 lg:absolute lg:left-1/2 lg:top-1/2 lg:h-[218px] lg:w-[218px] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-full lg:px-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B86B5]">Secure Enterprise AI</p>
                <p className="mt-2 pb-1 bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] bg-clip-text text-[26px] font-bold leading-[1.18] tracking-[-0.04em] text-transparent">
                  QueryPie AIP
                </p>
                <p className="mt-2 text-[12px] font-medium leading-5 text-slate-600">
                  AIエージェントの実務性能と
                  <br className="hidden lg:block" />
                  ガバナンスを支える中核基盤
                </p>
              </div>

              {roi.cards.map((card, index) => {
                const icons = [Brain, Cable, ScanSearch, Shield] as const;
                const positions = [
                  "lg:left-1/2 lg:top-0 lg:-translate-x-1/2",
                  "lg:right-[72px] lg:top-1/2 lg:-translate-y-1/2",
                  "lg:left-1/2 lg:bottom-0 lg:-translate-x-1/2",
                  "lg:left-[72px] lg:top-1/2 lg:-translate-y-1/2",
                ] as const;
                const Icon = icons[index] ?? ShieldCheck;
                const [headlineJa, headlineEn] = card.title.split(" / ");
                const labels = card.body.split("\n");

                return (
                  <article
                    key={card.title}
                    className={`rounded-[1.4rem] border border-black/6 bg-white/92 p-4 text-left shadow-[0_20px_54px_-48px_rgba(15,42,95,0.18)] backdrop-blur-sm lg:absolute lg:min-h-[146px] lg:w-[300px] ${positions[index] ?? ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#eef2f7] text-[#2f3a49]">
                        <Icon className="h-[18px] w-[18px]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="flex min-w-0 items-end gap-1.5 tracking-[-0.03em] text-slate-900">
                          <span className="text-[21px] font-semibold">{headlineJa}</span>
                          {headlineEn ? <span className="pb-0.5 text-[12px] font-medium tracking-[-0.01em] text-slate-400">{headlineEn}</span> : null}
                        </h3>
                        <div className="mt-1.5 inline-flex rounded-full bg-[#2f3a49] px-3 py-1 text-[11px] font-semibold text-white">
                          {card.stat}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 space-y-1.5">
                      {labels.map((label) => (
                        <p key={label} className="flex gap-2 text-[12px] font-medium leading-5 text-slate-700">
                          <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
                          <span>{label}</span>
                        </p>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section id="roles" className="mx-auto max-w-[1920px] bg-white px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1120px] text-center">
          <RevealOnScroll>
            <h2 className="text-[37px] font-semibold leading-[1.26] tracking-[-0.03em] text-slate-950 sm:text-[45px] sm:leading-[58px] sm:tracking-[-0.04em]">
              {roles.title}
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delayMs={80}>
            <p className="mx-auto mt-5 w-full max-w-[860px] whitespace-pre-line text-left text-base leading-7 text-slate-500 lg:pl-[42px]">
              {roles.body}
            </p>
          </RevealOnScroll>
        </div>

        <UseCaseShowcase
          note={roles.note}
          primaryCta={roles.primaryCta}
          secondaryCta={roles.secondaryCta}
          cards={roles.cards}
        />
      </section>

      <section id="results" className="mx-auto max-w-[1920px] bg-[#f6f8fb] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1280px] text-center">
          <RevealOnScroll>
            <h2 className="text-[37px] font-semibold leading-[1.26] tracking-[-0.03em] text-slate-950 sm:text-[45px] sm:leading-[58px] sm:tracking-[-0.04em] xl:whitespace-nowrap">
              {renderHighlightedKeywords(testimonials.title, ["スピード", "投資対効果"])}
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delayMs={80}>
            <p className="mx-auto mt-5 max-w-[1280px] text-center text-[16px] leading-7 text-slate-500 xl:whitespace-nowrap">
              {testimonials.body}
            </p>
          </RevealOnScroll>
        </div>

        <div className="mx-auto mt-12 max-w-[1120px] grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {testimonials.items.map((item, index) => {
              const icons = [Megaphone, MessageSquareText, ChartColumnIncreasing, FolderKanban] as const;
              const Icon = icons[index] ?? BriefcaseBusiness;

              return (
                <RevealOnScroll key={item.name} className="h-full" delayMs={index * 70}>
                <article
                  className="flex h-full flex-col rounded-[1.8rem] border border-black/8 bg-white px-7 py-7 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#eef2f7] text-[#2f3a49]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-5 flex-1 text-[14px] leading-7 tracking-[-0.01em] text-slate-700">{item.comment}</p>
                  <div className="mt-6 flex items-center gap-3 pt-1">
                    <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#f9f9fb] text-[11px] font-semibold text-slate-700">
                      {item.brand.slice(0, 2)}
                    </div>
                    <div className="text-left">
                      <p className="whitespace-nowrap text-[14px] font-medium tracking-[-0.02em] text-slate-900">{item.name}</p>
                      <p className="whitespace-nowrap text-[11px] leading-5 tracking-[-0.01em] text-slate-500">{item.company}</p>
                    </div>
                  </div>
                </article>
                </RevealOnScroll>
              );
            })}
        </div>

        <RevealOnScroll className="mx-auto mt-16 max-w-[1120px] rounded-[2rem] border border-black/6 bg-white p-8 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]" variant="up">
          <div className="max-w-none">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#eef2f7] text-[#2f3a49]">
              <Wallet className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-[30px] font-semibold leading-[1.35] tracking-[-0.03em] text-slate-950">
              {renderHighlightedKeyword(testimonials.pricing.title, "業務量に応じたクレジット制")}
            </h3>
            <div className="mt-5 space-y-1 text-base leading-7 text-slate-600">
              {testimonials.pricing.body.split("\n").map((line, index) => (
                <p key={`${line}-${index}`} className={index === 1 ? "xl:whitespace-nowrap" : ""}>
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {testimonials.pricing.bullets.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-black/6 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <h4 className="text-[20px] font-semibold tracking-[-0.03em] text-slate-950">{item.title}</h4>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </RevealOnScroll>

      </section>

      <section
        id="contact"
        className="w-full bg-white px-6 py-16 text-center lg:px-10 lg:py-20"
      >
        <div className="mx-auto max-w-[1120px] space-y-6">
          <RevealOnScroll className="rounded-[2rem] bg-[#f9f9fb] px-8 py-10 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
            <div className="mx-auto flex max-w-[720px] flex-col items-center gap-6">
              <div className="flex w-full flex-col items-center gap-4">
                <h2 className="text-center text-[37px] font-semibold leading-[1.18] tracking-[-0.04em] text-[#101828] sm:text-[45px] sm:leading-[54px]">
                  {contact.title.split("\n")[0]}
                  <br />
                  {renderHighlightedKeyword(contact.title.split("\n")[1] ?? "", "AI Crew")}
                </h2>
                <p className="w-full whitespace-pre-line text-center text-base leading-7 text-slate-500">{contact.body}</p>
              </div>

              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-[17px]">
                <Link
                  href={contact.primaryCta.href}
                  className={aiCrewPrimaryButtonClass}
                >
                  <CalendarDays className="h-4 w-4" />
                  {contact.primaryCta.label}
                </Link>
                <Link
                  href={contact.secondaryCta.href}
                  className={aiCrewSecondaryButtonClass}
                >
                  <Play className="h-4 w-4" />
                  {contact.secondaryCta.label}
                </Link>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="relative overflow-hidden rounded-[2rem] border border-[#d7dee7] bg-[linear-gradient(135deg,#f8fafc_0%,#eef4fb_48%,#e8eef7_100%)] px-8 py-8 text-left shadow-[0_28px_90px_-50px_rgba(15,23,42,0.18)]" variant="up" delayMs={120}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(47,58,73,0.10),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(71,84,103,0.10),transparent_30%)]" />
            <div className="absolute right-[-40px] top-[-40px] h-56 w-56 rounded-full border border-white/60 bg-white/25 blur-[2px]" />
            <div className="absolute bottom-[-70px] right-[18%] h-44 w-44 rounded-full border border-white/40 bg-white/20" />
            <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.04)_100%)] lg:block" />

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
              <div className="max-w-[980px]">
                <div className="inline-flex rounded-full border border-[#d0d5dd] bg-white/80 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-[#475467]">
                  {contact.partnerBadge}
                </div>
                <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#2f3a49] text-white shadow-[0_16px_32px_-20px_rgba(15,23,42,0.45)]">
                  <Settings2 className="h-5 w-5" />
                </div>
              <h3 className="mt-5 text-[30px] font-semibold leading-[1.35] tracking-[-0.03em] text-[#101828] xl:whitespace-nowrap">
                {renderHighlightedKeyword(contact.partnerTitle, "最短でAI化")}
              </h3>
                <p className="mt-4 max-w-[980px] text-left text-sm leading-7 text-[#475467]">
                  {contact.partnerBody}
                </p>
                <Link
                  href={contact.partnerCta.href}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#d0d5dd] bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#2f3a49] shadow-[0_16px_32px_-24px_rgba(15,23,42,0.25)] transition hover:bg-white"
                >
                  <Settings2 className="h-4 w-4" />
                  {contact.partnerCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="relative hidden h-[240px] lg:block">
                <div className="absolute right-0 top-0 w-[260px] rounded-[1.6rem] border border-white/70 bg-white/72 p-5 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.18)] backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#98a2b3]">AI Solution</p>
                    <div className="h-2.5 w-2.5 rounded-full bg-[#2563EB]" />
                  </div>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-[14px] bg-[#f5f7fb] px-4 py-3 text-[13px] font-medium text-[#344054]">
                      Your Service UI
                    </div>
                    <div className="rounded-[14px] border border-dashed border-[#cbd5e1] px-4 py-3 text-[12px] font-medium text-[#667085]">
                      AI Layer · QueryPie AIP
                    </div>
                    <div className="rounded-[14px] bg-[#2f3a49] px-4 py-3 text-[13px] font-semibold text-white">
                      FDE Guided Launch
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-[10px] left-[8px] flex h-[72px] w-[72px] items-center justify-center rounded-[20px] border border-white/70 bg-white/72 text-[#2f3a49] shadow-[0_20px_40px_-24px_rgba(15,23,42,0.18)] backdrop-blur-sm">
                  <Settings2 className="h-8 w-8" />
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
