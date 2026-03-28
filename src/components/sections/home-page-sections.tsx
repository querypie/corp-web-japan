import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  BriefcaseBusiness,
  Blocks,
  Cable,
  CalendarDays,
  FileSearch,
  FolderKanban,
  Headset,
  Layers3,
  Megaphone,
  MessageSquareText,
  Quote,
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

const beforeItems = [
  Search,
  MessageSquareText,
  FolderKanban,
  ChartColumnIncreasing,
  Blocks,
  Layers3,
  FileSearch,
  ShieldCheck,
  Search,
  Layers3,
  ChartColumnIncreasing,
  FolderKanban,
];

const problemCardStyles = [
  {
    card: "border-[#e5e7eb] bg-[#fbfcfd]",
    icon: "bg-[#f2f4f7] text-[#344054]",
  },
  {
    card: "border-[#e5e7eb] bg-[#fbfcfd]",
    icon: "bg-[#f2f4f7] text-[#344054]",
  },
  {
    card: "border-[#e5e7eb] bg-[#fbfcfd]",
    icon: "bg-[#f2f4f7] text-[#344054]",
  },
] as const;

const useCaseIcons = [
  Search,
  Wallet,
  ChartColumnIncreasing,
  Blocks,
  FileSearch,
  Brain,
  Layers3,
] as const;

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
      <span className="bg-gradient-to-r from-[#E45A2A] via-[#ED602E] to-[#F08A3C] bg-clip-text text-transparent">
        {keyword}
      </span>
      {after}
    </>
  );
}

export function HomePageSections() {
  const {
    hero,
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
      <section className="mx-auto max-w-[1920px] px-6 py-20 lg:px-10 lg:py-[88px]">
        <div className="relative z-10 mx-auto max-w-[1120px]">
          <div className="mx-auto max-w-[943px] text-center">
            <h1 className="mx-auto max-w-[960px] text-[40px] font-bold leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-[48px] lg:text-[60px] lg:leading-[68px] lg:tracking-[-1.2px]">
              {hero.title.split("\n").map((line, index) => (
                <span key={`${line}-${index}`} className="block text-slate-950 lg:whitespace-nowrap">
                  {renderHighlightedKeyword(line, "AI Crew")}
                </span>
              ))}
            </h1>

            <div className="mx-auto mt-4 w-full max-w-[960px] space-y-1.5 text-left text-[15px] leading-7 tracking-[-0.01em] text-slate-500 sm:text-base lg:pl-[12px]">
              {hero.body.split("\n").map((line, index) => {
                const emphasizedText = "QueryPie AI Crew";

                if (!line.includes(emphasizedText)) {
                  return <p key={`${line}-${index}`} className="lg:whitespace-nowrap">{line}</p>;
                }

                const [before, after] = line.split(emphasizedText);

                return (
                  <p key={`${line}-${index}`} className="lg:whitespace-nowrap">
                    {before}
                    <strong className="font-semibold tracking-[-0.01em] text-[#2f3a49]">
                      {emphasizedText}
                    </strong>
                    {after}
                  </p>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={hero.primaryCta.href}
                className="inline-flex items-center justify-center rounded-[8px] bg-[#ED602E] px-4 py-2.5 text-base font-semibold text-white transition hover:bg-[#d45527]"
              >
                {hero.primaryCta.label}
              </Link>
              <Link
                href={hero.secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#f1f1f3] bg-white px-4 py-2.5 text-base font-medium text-[#262626] transition hover:bg-slate-50"
              >
                {hero.secondaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-10 w-full overflow-hidden rounded-[12px]">
            <div className="relative aspect-[1596/790] rounded-[12px] bg-[#eceff3]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-start rounded-[60px] border-[5px] border-white/30 bg-white/20 p-[12px] backdrop-blur-sm">
                  <Play className="ml-0.5 h-[36px] w-[36px] fill-white text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="mx-auto max-w-[1920px] bg-[#f6f8fb] px-6 py-20 lg:px-10 lg:py-28">
        <div className="text-center">
          <h2 className="mt-5 font-sans text-[42px] font-bold leading-[1.22] tracking-[-0.03em] text-slate-900 sm:text-[48px] sm:leading-[58px] sm:tracking-[-0.96px]">
            {problem.title.split("\n")[0]}
            <br />
            {problem.title.split("\n")[1] ?? ""}
          </h2>
          <p className="mx-auto mt-5 w-full max-w-[860px] whitespace-pre-line text-left text-base leading-7 text-slate-600 lg:pl-[16px]">
            {problem.body}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[1200px] grid gap-4 lg:grid-cols-3">
          {problem.cards.map((card, index) => (
            <article
              key={card.title}
              className={`relative flex h-full flex-col overflow-hidden rounded-[1.8rem] border p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.14)] lg:p-7 ${problemCardStyles[index]?.card ?? "border-black/6 bg-white/95"}`}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-white/0 via-white/70 to-white/0" />
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-[12px] ${problemCardStyles[index]?.icon ?? "bg-[#eef1f4] text-[#2f3a49]"}`}
              >
                {index === 0 && <FolderKanban className="h-5 w-5" />}
                {index === 1 && <Blocks className="h-5 w-5" />}
                {index === 2 && <MessageSquareText className="h-5 w-5" />}
              </div>
              <h3 className="mt-6 text-pretty text-[19px] font-semibold leading-[1.55] tracking-[-0.015em] text-slate-800 sm:text-[20px]">
                {card.title}
              </h3>
              <p className="mt-5 text-[15px] leading-[2.05] text-slate-600">{renderEmphasizedText(card.body)}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-[1120px] text-center">
          <p className="text-[15px] leading-7 text-slate-600">{problem.note}</p>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-[1920px] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1120px] text-center">
          <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
            {featureIntro.title.split("\n")[0]}
            <br />
            {renderHighlightedKeyword(featureIntro.title.split("\n")[1] ?? "", "プロ")}
          </h2>
        </div>

        <FeatureShowcase items={featureTabs} />
      </section>

      <section id="roles" className="mx-auto max-w-[1920px] bg-[#f6f8fb] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1120px] text-center">
          <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
            {roles.title.split("\n")[0]}
            <br />
            {roles.title.split("\n")[1] ?? ""}
          </h2>
          <p className="mx-auto mt-5 w-full max-w-[860px] whitespace-pre-line text-left text-base leading-7 text-slate-500 lg:pl-[42px]">
            {roles.body}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-[1120px] gap-4 md:grid-cols-2 xl:grid-cols-4">
          {roles.cards.map((card, index) => {
            const Icon = useCaseIcons[index % useCaseIcons.length];

            return (
              <article
                key={card.title}
                className={`relative flex h-full flex-col overflow-hidden rounded-[1.8rem] border p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.14)] lg:p-7 ${problemCardStyles[index % problemCardStyles.length]?.card ?? "border-black/6 bg-white/95"}`}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-white/0 via-white/70 to-white/0" />
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-[12px] ${problemCardStyles[index % problemCardStyles.length]?.icon ?? "bg-[#eef1f4] text-[#2f3a49]"}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-pretty text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-slate-800">
                  {card.title}
                </h3>
                <p className="mt-4 text-[15px] leading-[1.95] text-slate-600">{card.body}</p>
              </article>
            );
          })}
        </div>

        <div className="mx-auto mt-10 max-w-[1120px] text-center">
          <p className="mx-auto max-w-[860px] text-[15px] leading-7 text-slate-600">{roles.note}</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={roles.primaryCta.href}
              className="inline-flex items-center justify-center rounded-[8px] bg-[#ED602E] px-4 py-2.5 text-base font-semibold text-white transition hover:bg-[#d45527]"
            >
              {roles.primaryCta.label}
            </Link>
            <Link
              href={roles.secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#f1f1f3] bg-white px-4 py-2.5 text-base font-medium text-[#262626] transition hover:bg-slate-50"
            >
              {roles.secondaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="process" className="mx-auto max-w-[1920px] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1120px] text-center">
          <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
            {process.title}
          </h2>
          <p className="mx-auto mt-5 w-full max-w-[900px] whitespace-pre-line text-left text-base leading-7 text-slate-500 lg:pl-[30px]">
            {process.body}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[1120px]">
          <div className="relative">
            <div className="pointer-events-none absolute left-[10%] right-[10%] top-11 hidden h-px bg-[#e4e7ec] xl:block" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {process.steps.map((step, index) => {
                const Icon = processStepIcons[index % processStepIcons.length];

                return (
                  <article
                    key={step.step}
                    className="relative overflow-hidden rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.14)] lg:p-7"
                  >
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
                    <p className="mt-4 text-[15px] leading-[1.95] text-slate-600">{step.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-[1120px] text-center">
          <p className="mx-auto max-w-[860px] text-[15px] leading-7 text-slate-600">{process.note}</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={process.primaryCta.href}
              className="inline-flex items-center justify-center rounded-[8px] bg-[#ED602E] px-4 py-2.5 text-base font-semibold text-white transition hover:bg-[#d45527]"
            >
              {process.primaryCta.label}
            </Link>
            <Link
              href={process.secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#f1f1f3] bg-white px-4 py-2.5 text-base font-medium text-[#262626] transition hover:bg-slate-50"
            >
              {process.secondaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="impact" className="mx-auto max-w-[1920px] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1120px] text-center">
          <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
            {comparison.title.split("\n")[0]}
            <br />
            {renderHighlightedKeyword(comparison.title.split("\n")[1] ?? "", "新しい組織図")}
          </h2>
          <p className="mx-auto mt-5 w-full max-w-[860px] whitespace-pre-line text-left text-base leading-7 text-slate-500 lg:pl-[92px]">
            {comparison.body}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[1120px] rounded-[2.2rem] border border-black/6 bg-white p-5 shadow-[0_28px_90px_-50px_rgba(15,23,42,0.1)] sm:p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-[1.8rem] border border-black/6 bg-[#f9f9fb] p-6">
              <div className="text-center">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">Before</p>
                <p className="mt-1 text-sm font-medium tracking-[-0.02em] text-slate-500">AI Crew採用前</p>
              </div>
              <div className="mt-8 flex min-h-[18rem] items-center justify-center">
                <div className="relative h-72 w-full max-w-[26rem]">
                  {beforeItems.map((Icon, index) => {
                    const positions = [
                      "left-4 top-2",
                      "left-24 top-10",
                      "left-0 top-32",
                      "left-2 top-52",
                      "left-8 bottom-18",
                      "left-22 bottom-2",
                      "left-36 bottom-4",
                      "left-60 top-14",
                      "right-12 bottom-10",
                      "right-2 bottom-24",
                      "right-2 top-46",
                      "right-28 bottom-0",
                    ];
                    const rotations = [
                      "-rotate-[12deg]",
                      "rotate-[18deg]",
                      "rotate-[2deg]",
                      "-rotate-[16deg]",
                      "rotate-[8deg]",
                      "-rotate-[6deg]",
                      "rotate-[10deg]",
                      "rotate-0",
                      "-rotate-[14deg]",
                      "rotate-[12deg]",
                      "-rotate-[18deg]",
                      "rotate-[6deg]",
                    ];

                    return (
                      <div
                        key={index}
                        className={`absolute ${positions[index]} ${rotations[index]} z-0 flex h-14 w-14 items-center justify-center rounded-[18px] border border-black/6 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]`}
                      >
                        <Icon className="h-5 w-5 text-slate-700" />
                      </div>
                    );
                  })}
                  <div className="absolute left-1/2 top-[45%] z-50 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_24px_55px_-30px_rgba(15,23,42,0.22)]">
                    <div className="relative h-11 w-11 overflow-hidden">
                      <Image src="/images/icon_main.png" alt="Decision maker" fill className="object-contain" sizes="44px" />
                    </div>
                  </div>
                  <p className="absolute left-1/2 top-[60%] z-50 max-w-[220px] -translate-x-1/2 rounded-full bg-white px-3 py-1.5 text-center text-[12px] font-medium tracking-[-0.01em] text-slate-700 shadow-lg [text-shadow:0_1px_10px_rgba(255,255,255,0.92)]">
                    情報探しと調整に疲弊
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-[1.8rem] border border-black/6 bg-[#2f3a49] p-6">
              <div className="text-center">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-white">After</p>
                <p className="mt-1 text-sm font-medium tracking-[-0.02em] text-white/65">AI Crew採用後</p>
              </div>
              <div className="mt-8 flex min-h-[18rem] items-center justify-center">
                <div className="relative h-[356px] w-full max-w-[33rem]">
                  {[...beforeItems.slice(1), ...beforeItems, ...beforeItems.slice(0, 5)].map((Icon, index) => {
                    const chaosPositions = [
                      "left-[78px] top-[8px]",
                      "right-[74px] top-[20px]",
                      "right-[12px] top-[84px]",
                      "left-[8px] bottom-[88px]",
                      "left-[84px] bottom-[18px]",
                      "right-[82px] bottom-[18px]",
                      "right-[10px] bottom-[94px]",
                      "left-[28px] top-[118px]",
                      "right-[54px] top-[128px]",
                      "left-[38px] bottom-[44px]",
                      "right-[44px] bottom-[46px]",
                      "left-[120px] top-[26px]",
                      "left-[18px] top-[172px]",
                      "right-[22px] top-[176px]",
                      "left-[122px] bottom-[78px]",
                      "right-[120px] bottom-[80px]",
                      "left-[154px] top-[8px]",
                      "right-[150px] top-[14px]",
                      "left-[12px] top-[252px]",
                      "right-[14px] top-[252px]",
                      "left-[174px] bottom-[8px]",
                      "right-[176px] bottom-[10px]",
                      "left-[218px] top-[6px]",
                      "right-[214px] top-[8px]",
                      "left-[210px] bottom-[2px]",
                      "right-[208px] bottom-[4px]",
                      "left-[54px] top-[214px]",
                      "right-[58px] top-[216px]",
                      "left-[102px] top-[152px]",
                    ];

                    return (
                      <div
                        key={`after-chaos-${index}`}
                        className={`absolute ${chaosPositions[index]} z-10 flex h-12 w-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/8 opacity-[0.18] shadow-[0_10px_24px_rgba(15,23,42,0.12)] backdrop-blur-[1px]`}
                      >
                        <Icon className="h-4 w-4 text-white/80" />
                      </div>
                    );
                  })}

                  <div className="absolute left-1/2 top-1/2 z-20 h-[312px] w-[312px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/16 bg-[radial-gradient(circle,#f7fbff_0%,#eef4fb_52%,rgba(255,255,255,0.06)_72%,rgba(255,255,255,0)_100%)]" />
                  <svg
                    viewBox="0 0 528 356"
                    className="pointer-events-none absolute inset-0 z-30 h-full w-full overflow-visible"
                    aria-hidden="true"
                  >
                    <defs>
                      <marker id="impact-arrowhead-gray" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                        <path d="M0,0 L5,2.5 L0,5 z" fill="#94A3B8" />
                      </marker>
                    </defs>
                    <path d="M264 62 L264 88" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#impact-arrowhead-gray)" />
                    <path d="M378 178 L360 178" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#impact-arrowhead-gray)" />
                    <path d="M264 294 L264 268" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#impact-arrowhead-gray)" />
                    <path d="M150 178 L168 178" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#impact-arrowhead-gray)" />
                  </svg>

                  <div className="absolute left-1/2 top-[28px] z-40 -translate-x-1/2">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/90 shadow-lg">
                      <Image src="/crew/anna.png" alt="AI Crew avatar" fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="absolute bottom-0 left-14 z-40 whitespace-nowrap rounded-full bg-[#1E293B] px-3 py-1.5 text-[11px] font-medium text-white shadow-lg">
                      過去履歴からの一次ドラフト完成
                    </div>
                  </div>

                  <div className="absolute left-[88px] top-1/2 z-40 -translate-y-1/2">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/90 shadow-lg">
                      <Image src="/crew/noah_2.png" alt="AI Crew avatar" fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="absolute bottom-14 right-0 z-40 whitespace-nowrap rounded-full bg-[#1E293B] px-3 py-1.5 text-[11px] font-medium text-white shadow-lg">
                      データ統合・分析完了
                    </div>
                  </div>

                  <div className="absolute right-[88px] top-1/2 z-40 -translate-y-1/2">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/90 shadow-lg">
                      <Image src="/crew/liam.png" alt="AI Crew avatar" fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="absolute top-14 left-0 z-40 whitespace-nowrap rounded-full bg-[#1E293B] px-3 py-1.5 text-[11px] font-medium text-white shadow-lg">
                      提案資料・見積準備完了
                    </div>
                  </div>

                  <div className="absolute bottom-[30px] left-1/2 z-40 -translate-x-1/2">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/90 shadow-lg">
                      <Image src="/crew/sophia.png" alt="AI Crew avatar" fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="absolute top-1 right-16 z-40 whitespace-nowrap rounded-full bg-[#1E293B] px-3 py-1.5 text-[11px] font-medium text-white shadow-lg">
                      リスク検知・アラート
                    </div>
                  </div>

                  <div className="absolute left-1/2 top-1/2 z-50 flex h-[154px] w-[154px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-white text-[#2f3a49] shadow-[0_30px_70px_-28px_rgba(15,23,42,0.18)]">
                    <div className="relative h-[74px] w-[74px] overflow-hidden">
                      <Image src="/images/icon_main.png" alt="Decision maker" fill className="object-contain" sizes="74px" />
                    </div>
                    <span className="mt-2 text-center text-[12px] font-semibold leading-4 tracking-[-0.01em] text-slate-600">
                      人による最終判断
                    </span>
                  </div>

                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1920px] bg-[#f6f8fb] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1120px] text-center">
          <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
            {roi.title.split("\n")[0]}
            <br />
            {renderHighlightedKeyword(roi.title.split("\n")[1] ?? "", "QueryPie AIP")}
          </h2>
          <p className="mx-auto mt-5 w-full max-w-[860px] whitespace-pre-line text-left text-base leading-7 text-slate-500 lg:pl-[72px]">
            {roi.body}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[1280px] grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {roi.cards.map((card, index) => {
            const icons = [Brain, Cable, ScanSearch, Shield] as const;
            const Icon = icons[index] ?? ShieldCheck;
            const [headline, subheadline = ""] = card.title.split("\n");
            const [headlineJa, headlineEn] = headline.split(" / ");

            return (
            <article
              key={card.title}
              className="rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#eef2f7] text-[#2f3a49]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 flex items-end gap-1.5 tracking-[-0.03em] text-slate-900">
                <span className="text-[22px] font-semibold">{headlineJa}</span>
                {headlineEn ? <span className="pb-0.5 text-[13px] font-medium tracking-[-0.01em] text-slate-400">{headlineEn}</span> : null}
              </h3>
              <p className="mt-2 text-[15px] font-medium leading-[1.5] tracking-[-0.015em] text-slate-700">
                {subheadline}
              </p>
              <div className="mt-4 inline-flex rounded-full bg-[#2f3a49] px-3 py-1 text-xs font-semibold text-white">
                {card.stat}
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{card.body}</p>
            </article>
          )})}
        </div>
      </section>

      <section className="mx-auto max-w-[1920px] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1120px] text-center">
          <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
            {renderHighlightedKeyword(testimonials.title.split("\n")[0], "スピード")}
            <br />
            {renderHighlightedKeyword(testimonials.title.split("\n")[1] ?? "", "投資対効果")}
          </h2>
          <p className="mx-auto mt-5 max-w-[820px] text-left text-[15px] leading-7 text-slate-500">
            {testimonials.body}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[1440px] overflow-x-auto px-1 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-4 xl:min-w-0 xl:justify-center">
            {testimonials.items.map((item, index) => {
              const icons = [Megaphone, Headset, ChartColumnIncreasing, FolderKanban, BriefcaseBusiness] as const;
              const Icon = icons[index] ?? BriefcaseBusiness;

              return (
              <article
                key={item.name}
                className="relative flex min-h-[272px] w-[316px] flex-col justify-between overflow-hidden rounded-[1.8rem] border border-black/8 bg-white px-7 py-7 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/0 via-[#e8edf5] to-white/0" />
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#eef2f7] text-[#2f3a49]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Quote className="h-5 w-5 text-slate-300" />
                  </div>

                  <p className="mt-4 text-[14px] leading-7 tracking-[-0.01em] text-slate-700">“{item.quote}”</p>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#f9f9fb] text-[11px] font-semibold text-slate-700">
                    {item.brand.slice(0, 2)}
                  </div>
                  <div className="text-left">
                    <p className="whitespace-nowrap text-[14px] font-medium tracking-[-0.02em] text-slate-900">{item.name}</p>
                    <p className="whitespace-nowrap text-[11px] leading-5 tracking-[-0.01em] text-slate-500">{item.company}</p>
                  </div>
                </div>
              </article>
            )})}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-[1120px] rounded-[2rem] border border-black/6 bg-[#f9fafb] p-8 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
          <div className="max-w-[980px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#eef2f7] text-[#2f3a49]">
              <Wallet className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-[30px] font-semibold leading-[1.35] tracking-[-0.03em] text-slate-950">
              {testimonials.pricing.title}
            </h3>
            <p className="mt-5 max-w-[960px] whitespace-pre-line text-base leading-7 text-slate-600">
              {testimonials.pricing.body}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {testimonials.pricing.bullets.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-black/6 bg-white p-6">
                <h4 className="text-[20px] font-semibold tracking-[-0.03em] text-slate-950">{item.title}</h4>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-[1120px] rounded-[2rem] bg-[#2f3a49] px-8 py-10 text-white shadow-[0_28px_90px_-50px_rgba(15,23,42,0.24)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[700px]">
              <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-white/10 text-white">
                <ArrowRight className="h-5 w-5" />
              </div>
              <p className="mt-5 text-[30px] font-semibold leading-[1.35] tracking-[-0.03em]">
                {testimonials.calculatorCta.title}
              </p>
              <p className="mt-4 max-w-[700px] text-sm leading-7 text-white/78">
                {testimonials.calculatorCta.body}
              </p>
            </div>
            <Link
              href={testimonials.calculatorCta.href}
              className="inline-flex items-center justify-center rounded-[12px] bg-white px-5 py-3 text-sm font-semibold text-[#2f3a49] transition hover:bg-[#f4f6f8]"
            >
              {testimonials.calculatorCta.label}
            </Link>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="w-full bg-[#f9f9fb] px-6 py-16 text-center lg:px-10 lg:py-20"
      >
        <div className="mx-auto max-w-[1120px] space-y-6">
          <div className="rounded-[2rem] bg-white px-8 py-10 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
            <div className="mx-auto flex max-w-[720px] flex-col items-center gap-6">
              <div className="flex w-full flex-col items-center gap-4">
                <h2 className="text-center text-4xl font-semibold leading-[1.08] tracking-[-0.05em] text-[#101828] sm:text-[52px] sm:leading-[58px]">
                  {contact.title.split("\n")[0]}
                  <br />
                  {renderHighlightedKeyword(contact.title.split("\n")[1] ?? "", "AI Crew")}
                </h2>
                <p className="w-full text-left text-base leading-7 text-slate-500">{contact.body}</p>
              </div>

              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-[17px]">
                <Link
                  href={contact.primaryCta.href}
                  className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#2f3a49] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#25303d]"
                >
                  <CalendarDays className="h-4 w-4" />
                  {contact.primaryCta.label}
                </Link>
                <Link
                  href={contact.secondaryCta.href}
                  className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#d0d5dd] bg-white px-5 py-3 text-base font-medium text-[#101828] transition hover:bg-slate-50"
                >
                  <Play className="h-4 w-4" />
                  {contact.secondaryCta.label}
                </Link>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-[#d7dee7] bg-[linear-gradient(135deg,#f8fafc_0%,#eef4fb_48%,#e8eef7_100%)] px-8 py-8 text-left shadow-[0_28px_90px_-50px_rgba(15,23,42,0.18)]">
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
              <h3 className="mt-5 text-[30px] font-semibold leading-[1.35] tracking-[-0.03em] text-[#101828]">
                {renderHighlightedKeyword(contact.partnerTitle.split("\n")[0], "最高品質のAI基盤")}
                <br />
                {contact.partnerTitle.split("\n")[1]}
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
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#98a2b3]">AI Dashi</p>
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ED602E]" />
                  </div>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-[14px] bg-[#f5f7fb] px-4 py-3 text-[13px] font-medium text-[#344054]">
                      Your Product UI
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
          </div>
        </div>
      </section>
    </>
  );
}
