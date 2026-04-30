"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import {
  topPageFinalCta,
  topPageSecurity,
  topPageWhitepapers,
} from "@/content/top-page";
import {
  MarketingPill,
  MarketingSectionIntro,
  MarketingSurface,
} from "@/components/sections/marketing-section-primitives";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

export function TopPageSections({ children }: { children?: ReactNode }) {
  const security = topPageSecurity;
  const whitepapers = topPageWhitepapers;
  const finalCta = topPageFinalCta;
  return (
    <div className="bg-white text-[#17191d]">
        {children}

        <section id="security" className="mx-auto max-w-[1920px] bg-[#f7f9fc] px-6 py-16 lg:px-10 lg:py-20">
          <div className="mx-auto w-full max-w-[1120px]">
            <div className="mx-auto max-w-[900px] text-center">
              <RevealOnScroll variant="up">
                <MarketingSectionIntro
                  eyebrow="Security & Compliance"
                  titleClassName="mt-2 text-[26px] leading-[1.24] tracking-[-0.03em] sm:text-[32px]"
                  bodyClassName="mt-4 max-w-[840px] text-left leading-7"
                  title={security.title}
                  body={<p>{security.body}</p>}
                />
              </RevealOnScroll>
            </div>

            <RevealOnScroll className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4" variant="up" delayMs={220}>
              {security.certifications.map((item) => (
                <MarketingSurface
                  as="article"
                  key={item.title}
                  className="flex min-h-[150px] flex-col items-center justify-center rounded-[1.5rem] bg-white px-5 py-5 text-center shadow-[0_18px_44px_-42px_rgba(15,23,42,0.14)]"
                >
                  <div className="relative flex h-14 w-full items-center justify-center">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      unoptimized
                      className="object-contain"
                      sizes="(min-width: 1280px) 15vw, (min-width: 768px) 25vw, 50vw"
                    />
                  </div>
                  <p className="mt-4 text-[13px] font-semibold tracking-[0.01em] text-[#2f3a49]">{item.title}</p>
                </MarketingSurface>
              ))}
            </RevealOnScroll>

            <RevealOnScroll className="mt-8 flex justify-center" variant="up" delayMs={320}>
              <Link
                href={security.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#15181d] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_-26px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:bg-[#0f1216] hover:shadow-md"
              >
                {security.link.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </RevealOnScroll>
          </div>
        </section>

        <section className="mx-auto max-w-[1920px] bg-white px-6 py-16 lg:px-10 lg:py-20">
          <div className="mx-auto w-full max-w-[1120px]">
            <MarketingSurface className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(255,255,255,0.98)_100%)] px-6 py-8 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.14)] lg:px-8 lg:py-10">
              <div className="mx-auto max-w-[900px] text-center">
                <RevealOnScroll variant="up">
                  <MarketingSectionIntro
                    eyebrow="Download"
                    titleClassName="mt-2 text-[24px] leading-[1.3] tracking-[-0.03em] sm:text-[30px]"
                    bodyClassName="mt-4 max-w-[820px] text-left leading-7"
                    title={whitepapers.title}
                    body={<p>{whitepapers.body}</p>}
                  />
                </RevealOnScroll>
              </div>

              <RevealOnScroll className="mt-8 grid gap-5 lg:grid-cols-2" variant="up" delayMs={220}>
                {whitepapers.items.map((item) => (
                  <MarketingSurface
                    as="article"
                    key={item.title}
                    className="overflow-hidden rounded-[1.8rem] bg-white shadow-[0_20px_54px_-44px_rgba(15,23,42,0.16)]"
                  >
                    <div className="flex flex-col">
                      <div className="relative min-h-[320px] bg-[#f5f7fb]">
                        <Image
                          src={item.image.src}
                          alt={item.image.alt}
                          fill
                          unoptimized
                          className="object-contain p-4"
                          sizes="(min-width: 1024px) 50vw, 100vw"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-[21px] font-medium leading-[1.4] tracking-[-0.02em] text-slate-950">
                          {item.title}
                        </h3>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <MarketingPill
                              key={tag}
                              className="bg-[#eef2f7] px-3 py-1 tracking-[0.04em] text-[#2f3a49]"
                            >
                              {tag}
                            </MarketingPill>
                          ))}
                        </div>
                        {item.description ? (
                          <p className="mt-4 text-[14px] leading-7 text-slate-600">{item.description}</p>
                        ) : null}
                        {item.toc ? (
                          <details className="mt-4 rounded-[1rem] border border-slate-200 bg-slate-50/70 px-4 py-3">
                            <summary className="cursor-pointer list-none text-sm font-semibold text-[#2f3a49] [&::-webkit-details-marker]:hidden">
                              目次を見る
                            </summary>
                            <ul className="mt-3 space-y-2 text-[13px] leading-6 text-slate-600">
                              {item.toc.map((tocItem) => (
                                <li key={tocItem} className="flex gap-2">
                                  <span className="mt-[0.45rem] h-1.5 w-1.5 flex-none rounded-full bg-[#2f3a49]/70" />
                                  <span>{tocItem}</span>
                                </li>
                              ))}
                            </ul>
                          </details>
                        ) : null}
                        <Link
                          href={item.href}
                          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-[#2f3a49]"
                        >
                          {item.ctaLabel}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </MarketingSurface>
                ))}
              </RevealOnScroll>
            </MarketingSurface>
          </div>
        </section>

        <section id="contact" className="bg-[#0f172a] text-white">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
            <div className="rounded-[2rem] border border-white/12 bg-white/5 px-6 py-8 shadow-[0_28px_100px_-60px_rgba(15,23,42,0.55)] backdrop-blur xl:px-10 xl:py-10">
              <div className="mx-auto max-w-[880px] text-center">
                <RevealOnScroll variant="up">
                  <h2 className="text-[34px] font-semibold leading-[1.15] tracking-[-0.04em] sm:text-[46px]">
                    {finalCta.title}
                  </h2>
                </RevealOnScroll>
                <RevealOnScroll variant="up" delayMs={120}>
                  <div className="mx-auto mt-5 max-w-[760px] text-sm leading-8 text-white/75 sm:text-[15px]">
                    <p>{finalCta.body.line1}</p>
                    <p>{finalCta.body.line2}</p>
                  </div>
                </RevealOnScroll>
              </div>

              <RevealOnScroll variant="up" delayMs={220}>
                <div id="download" className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:flex-wrap">
                  {finalCta.actions.map((action, index) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={`flex min-h-[44px] w-full max-w-[220px] items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-center text-[13px] font-semibold transition sm:w-[220px] ${
                        index === 0
                          ? "border-white bg-white text-slate-950 hover:bg-slate-100"
                          : "border-white/15 bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      {action.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

    </div>
  );
}
