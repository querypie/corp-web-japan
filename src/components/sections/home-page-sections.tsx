import Link from "next/link";
import {
  ArrowRight,
  Blocks,
  Bot,
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

const sectionPillClass =
  "inline-flex rounded-full border border-black/6 bg-[#f9f9fb] px-4 py-2 text-sm font-semibold text-slate-900";
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
            <h1 className="mx-auto max-w-[943px] text-5xl font-semibold leading-[0.96] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-[72px] lg:leading-[82px] lg:tracking-[-1.44px]">
              {hero.title.split("\n")[0]}
              <br />
              <span className="text-slate-950">{hero.title.split("\n")[1]}</span>
            </h1>

            <p className="mx-auto mt-4 max-w-[597px] text-base leading-[24px] text-slate-500">
              {hero.body}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={hero.primaryCta.href}
                className="inline-flex items-center justify-center rounded-[8px] bg-[#2f3a49] px-4 py-2.5 text-base font-semibold text-white transition hover:bg-[#25303d]"
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
          <h2 className="mt-5 text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
            {problem.title.split("\n")[0]}
            <br />
            {problem.title.split("\n")[1]}
          </h2>
          <p className="mx-auto mt-5 max-w-[561px] text-base leading-6 text-slate-500">{problem.body}</p>
        </div>

        <div className="mx-auto mt-12 max-w-[1120px] grid gap-4 lg:grid-cols-3">
          {problem.cards.map((card, index) => (
            <article
              key={card.title}
              className="rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#eef1f4] text-[#2f3a49]">
                {index === 0 && <FolderKanban className="h-5 w-5" />}
                {index === 1 && <Blocks className="h-5 w-5" />}
                {index === 2 && <MessageSquareText className="h-5 w-5" />}
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                {card.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-[1920px] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1120px] text-center">
          <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
            {featureIntro.title}
          </h2>
        </div>

        <FeatureShowcase items={featureTabs} />
      </section>

      <section id="roles" className="mx-auto max-w-[1920px] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1120px] text-center">
          <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
            {roles.title.split("\n")[0]}
            <br />
            {roles.title.split("\n")[1]}
          </h2>
          <p className="mx-auto mt-5 max-w-[561px] text-base leading-6 text-slate-500">
            {roles.body}
          </p>
        </div>

        <div className="mt-12">
          <RoleSlides items={roles.cards} />
        </div>
      </section>

      <section id="impact" className="mx-auto max-w-[1920px] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1120px] text-center">
          <h2 className="text-4xl font-semibold leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
            {comparison.title.split("\n")[0]}
            <br />
            {comparison.title.split("\n")[1]}
          </h2>
          <p className="mx-auto mt-5 max-w-[561px] text-base leading-6 text-slate-500">
            {comparison.body}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[1120px] rounded-[2.2rem] border border-black/6 bg-white p-5 shadow-[0_28px_90px_-50px_rgba(15,23,42,0.1)] sm:p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-[1.8rem] border border-black/6 bg-[#f9f9fb] p-6">
              <p className="text-center text-2xl font-semibold tracking-[-0.04em] text-slate-900">導入前</p>
              <div className="mt-8 flex min-h-[18rem] items-center justify-center">
                <div className="relative h-72 w-full max-w-[26rem]">
                  {beforeItems.map((Icon, index) => {
                    const positions = [
                      "left-4 top-4",
                      "left-24 top-8",
                      "left-2 top-28",
                      "left-24 top-32",
                      "left-6 bottom-12",
                      "left-24 bottom-4",
                      "left-40 bottom-10",
                      "left-52 top-28",
                      "right-10 bottom-10",
                      "right-0 bottom-20",
                      "right-8 top-36",
                      "left-44 bottom-0",
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
                        className={`absolute ${positions[index]} ${rotations[index]} flex h-14 w-14 items-center justify-center rounded-[18px] border border-black/6 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]`}
                      >
                        <Icon className="h-5 w-5 text-slate-700" />
                      </div>
                    );
                  })}
                  <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#2f3a49] text-white shadow-[0_24px_55px_-30px_rgba(15,23,42,0.3)]">
                    <Bot className="h-9 w-9" />
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-[1.8rem] border border-black/6 bg-[#2f3a49] p-6">
              <p className="text-center text-2xl font-semibold tracking-[-0.04em] text-white">導入後</p>
              <div className="mt-8 flex min-h-[18rem] items-center justify-center">
                <div className="relative flex h-64 w-64 items-center justify-center">
                  <div className="absolute inset-4 rounded-full border border-white/40 bg-[radial-gradient(circle,#ffffff_0%,#f8fafc_52%,#dfe5ee_100%)]" />
                  <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_30px_70px_-28px_rgba(15,23,42,0.18)]" />
                  <div className="absolute left-2 top-8 rounded-full bg-slate-950 px-3 py-2 text-xs font-medium text-white shadow-lg">
                    調査を自動集約
                  </div>
                  <div className="absolute right-0 top-14 rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg">
                    草案を準備済み
                  </div>
                  <div className="absolute left-0 bottom-16 rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg">
                    分析を更新
                  </div>
                  <div className="absolute bottom-7 right-3 rounded-full bg-slate-300 px-3 py-2 text-xs font-medium text-slate-900 shadow-lg">
                    承認済みフロー
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
