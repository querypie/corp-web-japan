import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingSectionIntro, MarketingSurface } from "@/components/sections/home/primitives";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

export function SecuritySection({ children }: { children: ReactNode }) {
  return (
    <section id="security" className="mx-auto max-w-[1920px] bg-[#f7f9fc] px-6 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-[1120px]">{children}</div>
    </section>
  );
}

export function SecurityIntro({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[900px] text-center">
      <RevealOnScroll variant="up">
        <MarketingSectionIntro eyebrow="Security & Compliance" titleClassName="mt-2 text-[26px] leading-[1.24] tracking-[-0.03em] sm:text-[32px]" bodyClassName="mt-4 max-w-[840px] text-left leading-7" title={title} body={<p>{children}</p>} />
      </RevealOnScroll>
    </div>
  );
}

export function SecurityCertificationGrid({ children }: { children: ReactNode }) {
  return <RevealOnScroll className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4" variant="up" delayMs={220}>{children}</RevealOnScroll>;
}

export function SecurityCertificationCard({ src, alt, title }: { src: string; alt: string; title: string }) {
  return (
    <MarketingSurface as="article" className="flex min-h-[150px] flex-col items-center justify-center rounded-[1.5rem] bg-white px-5 py-5 text-center shadow-[0_18px_44px_-42px_rgba(15,23,42,0.14)]">
      <div className="relative flex h-14 w-full items-center justify-center">
        <Image src={src} alt={alt} fill unoptimized className="object-contain" sizes="(min-width: 1280px) 15vw, (min-width: 768px) 25vw, 50vw" />
      </div>
      <p className="mt-4 text-[13px] font-semibold tracking-[0.01em] text-[#2f3a49]">{title}</p>
    </MarketingSurface>
  );
}

export function SecurityAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <RevealOnScroll className="mt-8 flex justify-center" variant="up" delayMs={320}>
      <Link href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#15181d] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_-26px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:bg-[#0f1216] hover:shadow-md">
        {children}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </RevealOnScroll>
  );
}
