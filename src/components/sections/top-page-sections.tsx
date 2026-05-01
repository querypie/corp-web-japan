"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import {
  topPageFinalCta,
} from "@/content/top-page";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

export function TopPageSections({ children }: { children?: ReactNode }) {
  const finalCta = topPageFinalCta;
  return (
    <div className="bg-white text-[#17191d]">
        {children}

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