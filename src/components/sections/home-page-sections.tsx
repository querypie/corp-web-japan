import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Cable,
  ScanSearch,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { homePageContent } from "@/content/home";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";
import { UseCaseShowcase } from "@/components/sections/use-case-showcase";

const aiCrewAccentTextClass =
  "bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_48%,#2563EB_78%,#93C5FD_100%)] bg-clip-text text-transparent [animation:heroAccentGlow_3.2s_ease-in-out_infinite] motion-reduce:animate-none";

const aiCrewPrimaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] px-5 py-3 text-base font-semibold text-white shadow-[0_22px_46px_-24px_rgba(23,78,166,0.72)] transition hover:brightness-[1.06] hover:shadow-[0_26px_58px_-26px_rgba(23,78,166,0.82)]";

const aiCrewSecondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#C9D8F5] bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF4FF_100%)] px-5 py-3 text-base font-semibold text-[#163A7A] shadow-[0_18px_40px_-30px_rgba(15,42,95,0.34)] transition hover:border-[#B7CCEF] hover:bg-[linear-gradient(180deg,#FAFCFF_0%,#E8F0FF_100%)]";

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

function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}

export function HomePageIntroSections() {
  const { hero } = homePageContent;

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
                <h1 className="mt-5 text-left text-[42px] font-bold leading-[1.08] tracking-[-0.05em] text-slate-950 sm:text-[52px] lg:text-[66px] lg:leading-[74px]">
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
                <div className="mt-5 max-w-[35rem] text-left text-[15px] leading-[1.95] tracking-[-0.01em] text-slate-600 sm:text-base">
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


    </>
  );
}

export function AICrewSectionsAfterDesignElements() {
  const { roi, roles } = homePageContent;

  return (
    <>
      <section id="platform" className="mx-auto max-w-[1920px] bg-[#f6f8fb] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1120px] text-center">
          <RevealOnScroll>
            <h2 className="text-[34px] font-semibold leading-[1.24] tracking-[-0.03em] text-slate-950 sm:text-[42px] sm:leading-[54px] sm:tracking-[-0.04em]">
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

      <section id="use-cases" className="mx-auto max-w-[1920px] bg-white px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1120px] text-center">
          <RevealOnScroll>
            <h2 className="text-[34px] font-semibold leading-[1.24] tracking-[-0.03em] text-slate-950 sm:text-[42px] sm:leading-[54px] sm:tracking-[-0.04em]">
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


    </>
  );
}

export function HomePageSections() {
  return <AICrewSectionsAfterDesignElements />;
}
