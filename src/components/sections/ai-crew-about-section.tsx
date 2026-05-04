import type { ReactNode } from "react";
import Image from "next/image";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

function renderHighlightedKeyword(line: string, keyword: string) {
  if (!line.includes(keyword)) {
    return line;
  }

  const [before, after] = line.split(keyword);

  return (
    <>
      {before}
      <span className="bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] bg-clip-text text-transparent">
        {keyword}
      </span>
      {after}
    </>
  );
}

export function AICrewAboutSection({ children }: { children: ReactNode }) {
  return (
    <section id="about" className="mx-auto max-w-[1920px] bg-[#f6f8fb] px-6 py-20 lg:px-10">
      {children}
    </section>
  );
}

export function AICrewAboutShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto mt-8 max-w-[1120px]">
      <article className="overflow-visible">
        <div className="grid gap-8 px-6 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1.08fr)_380px] lg:items-center lg:gap-12">
          {children}
        </div>
      </article>
    </div>
  );
}

export function AICrewAboutIntro({ children }: { children: ReactNode }) {
  return <div className="max-w-[650px]">{children}</div>;
}

export function AICrewAboutTitle({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll>
      <h2 className="max-w-none text-[30px] font-semibold leading-[1.2] tracking-[-0.04em] text-[#101828] sm:text-[42px] sm:leading-[1.2] sm:whitespace-nowrap">
        <span className="block">
          {typeof children === "string" ? renderHighlightedKeyword(children, "AI Crew") : children}
        </span>
      </h2>
    </RevealOnScroll>
  );
}

export function AICrewAboutBody({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll delayMs={90}>
      <div className="mt-5 space-y-5 text-[15px] leading-8 text-[#667085]">{children}</div>
    </RevealOnScroll>
  );
}

export function AICrewAboutImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <RevealOnScroll variant="scale" delayMs={120}>
      <figure className="overflow-hidden rounded-[1.8rem] bg-white shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_90px_-52px_rgba(15,23,42,0.2)] lg:ml-auto lg:w-full lg:max-w-[380px] lg:translate-x-10">
        <div className="relative aspect-[5/4] bg-[#eef2f6]">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-[94%_center]"
            sizes="(min-width: 1024px) 380px, 100vw"
          />
        </div>
      </figure>
    </RevealOnScroll>
  );
}
