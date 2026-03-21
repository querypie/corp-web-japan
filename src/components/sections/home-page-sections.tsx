import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Blocks,
  FileSearch,
  FolderKanban,
  Layers3,
  MessageSquareText,
  Play,
  Search,
  ShieldCheck,
  ChartColumnIncreasing,
} from "lucide-react";
import { homePageContent } from "@/content/home";
import { FeatureShowcase } from "@/components/sections/feature-showcase";
import { RoleSlides } from "@/components/sections/role-slides";

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
    card: "border-[#d9e8f7] bg-[#f8fbff]",
    icon: "bg-[#e8f3ff] text-[#245b8f]",
  },
  {
    card: "border-[#f3dec9] bg-[#fff9f5]",
    icon: "bg-[#ffe9d6] text-[#a6561a]",
  },
  {
    card: "border-[#e3e9d0] bg-[#fafbf6]",
    icon: "bg-[#eef3dc] text-[#5f6f2d]",
  },
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
                  {renderHighlightedKeyword(line, "AI社員")}
                </span>
              ))}
            </h1>

            <div className="mx-auto mt-4 max-w-[800px] space-y-1.5 text-left text-[15px] leading-7 tracking-[-0.01em] text-slate-500 sm:text-base">
              {hero.body.split("\n").map((line, index) => {
                const emphasizedText = "QueryPie AI Crew";

                if (!line.includes(emphasizedText)) {
                  return <p key={`${line}-${index}`}>{line}</p>;
                }

                const [before, after] = line.split(emphasizedText);

                return (
                  <p key={`${line}-${index}`}>
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

      <section id="why" className="mx-auto max-w-[1920px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="text-center">
          <h2 className="mt-5 font-sans text-[42px] font-bold leading-[1.22] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[58px] sm:tracking-[-0.96px]">
            {problem.title.split("\n")[0]}
            <br />
            {renderHighlightedKeyword(problem.title.split("\n")[1] ?? "", "右腕")}
          </h2>
          <p className="mx-auto mt-5 max-w-[820px] whitespace-pre-line text-left text-base leading-7 text-slate-500">
            {problem.body}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[1160px] grid gap-5 lg:grid-cols-3">
          {problem.cards.map((card, index) => (
            <article
              key={card.title}
              className={`relative flex h-full flex-col overflow-hidden rounded-[1.8rem] border p-7 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.14)] lg:p-8 ${problemCardStyles[index]?.card ?? "border-black/6 bg-white/95"}`}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-white/0 via-white/70 to-white/0" />
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-[12px] ${problemCardStyles[index]?.icon ?? "bg-[#eef1f4] text-[#2f3a49]"}`}
              >
                {index === 0 && <FolderKanban className="h-5 w-5" />}
                {index === 1 && <Blocks className="h-5 w-5" />}
                {index === 2 && <MessageSquareText className="h-5 w-5" />}
              </div>
              <h3 className="mt-6 text-[24px] font-bold leading-[1.35] tracking-[-0.03em] text-slate-950">
                {card.title}
              </h3>
              <p className="mt-5 text-[15px] leading-[2.05] text-slate-600">{renderEmphasizedText(card.body)}</p>
            </article>
          ))}
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

      <section id="roles" className="mx-auto max-w-[1920px] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1120px] text-center">
          <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
            {roles.title.split("\n")[0]}
            <br />
            {renderHighlightedKeyword(roles.title.split("\n")[1] ?? "", "AI Crew")}
          </h2>
          <p className="mx-auto mt-5 w-full max-w-[860px] whitespace-pre-line text-left text-base leading-7 text-slate-500 lg:pl-[68px]">
            {roles.body}
          </p>
        </div>

        <div className="mt-12">
          <RoleSlides items={roles.cards} note={roles.note} customCta={roles.customCta} />
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
                  {[...beforeItems.slice(1), ...beforeItems.slice(0, 3)].map((Icon, index) => {
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

      <section className="mx-auto max-w-[1920px] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1120px] text-center">
          <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
            {roi.title.split("\n")[0]}
            <br />
            {roi.title.split("\n")[1]}
          </h2>
          <p className="mx-auto mt-5 max-w-[561px] text-base leading-6 text-slate-500">
            {roi.body}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[1120px] grid gap-4 lg:grid-cols-3">
          {roi.cards.map((card) => (
            <article
              key={card.title}
              className="rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]"
            >
              <div className="inline-flex rounded-full bg-[#2f3a49] px-3 py-1 text-xs font-semibold text-white">
                {card.stat}
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{card.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1920px] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1120px] text-center">
          <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
            {testimonials.title.split("\n")[0]}
            <br />
            {testimonials.title.split("\n")[1]}
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-[1440px] overflow-x-auto px-1 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-4 xl:min-w-0 xl:justify-center">
            {testimonials.items.map((item) => (
              <article
                key={item.name}
                className="flex min-h-[300px] w-[320px] flex-col justify-between rounded-[1.8rem] border border-black/8 bg-white px-7 py-8 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]"
              >
                <p className="text-base leading-8 tracking-[-0.01em] text-slate-700">“{item.quote}”</p>

                <div className="mt-8 flex items-center gap-3">
                  <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#f9f9fb] text-xs font-semibold text-slate-700">
                    {item.brand.slice(0, 2)}
                  </div>
                  <div className="text-left">
                    <p className="text-base font-medium tracking-[-0.02em] text-slate-900">{item.name}</p>
                    <p className="text-sm leading-6 tracking-[-0.01em] text-slate-600">{item.company}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="w-full bg-[#f9f9fb] px-6 py-16 text-center lg:px-10 lg:py-20"
      >
        <div className="mx-auto flex max-w-[540px] flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.06em] text-[#010d3e] sm:text-[54px] sm:leading-[60px]">
              {contact.title.split("\n")[0]}
              <br />
              {contact.title.split("\n")[1]}
            </h2>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-[17px]">
            <Link
              href={contact.primaryCta.href}
              className="inline-flex items-center justify-center rounded-[8px] bg-[#2f3a49] px-4 py-2.5 text-base font-semibold text-white transition hover:bg-[#25303d]"
            >
              {contact.primaryCta.label}
            </Link>
            <Link
              href={contact.secondaryCta.href}
              className="inline-flex items-center justify-center gap-1 rounded-[10px] px-1 py-[10px] text-base font-medium text-black transition hover:text-slate-700"
            >
              {contact.secondaryCta.label}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
