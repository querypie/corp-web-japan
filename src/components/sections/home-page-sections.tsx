import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homePageContent } from "@/content/home";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

const aiCrewAccentTextClass =
  "bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_48%,#2563EB_78%,#93C5FD_100%)] bg-clip-text text-transparent [animation:heroAccentGlow_3.2s_ease-in-out_infinite] motion-reduce:animate-none";

const aiCrewPrimaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] px-5 py-3 text-base font-semibold text-white shadow-[0_22px_46px_-24px_rgba(23,78,166,0.72)] transition hover:brightness-[1.06] hover:shadow-[0_26px_58px_-26px_rgba(23,78,166,0.82)]";

const aiCrewSecondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#C9D8F5] bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF4FF_100%)] px-5 py-3 text-base font-semibold text-[#163A7A] shadow-[0_18px_40px_-30px_rgba(15,42,95,0.34)] transition hover:border-[#B7CCEF] hover:bg-[linear-gradient(180deg,#FAFCFF_0%,#E8F0FF_100%)]";

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

export function HomePageSections() {
  return null;
}
