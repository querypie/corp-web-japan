import type { ReactNode } from "react";
import { MarketingSectionIntro } from "@/components/sections/marketing-section-primitives";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

export function SolutionOverviewSection({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto max-w-[1920px] bg-[#f6f8fb] px-6 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-[1120px]">{children}</div>
    </section>
  );
}

export function SolutionOverviewIntro({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[900px] text-center">
      <RevealOnScroll variant="up">
        <MarketingSectionIntro
          className="max-w-[900px]"
          titleClassName="mx-auto max-w-[730px] text-balance text-[31px] leading-[1.22] tracking-[-0.045em] sm:text-[40px] lg:text-[43px]"
          bodyClassName="mt-6 max-w-[790px] space-y-4 text-left leading-[1.9]"
          title={title}
          body={children}
        />
      </RevealOnScroll>
    </div>
  );
}

export function SolutionOverviewLead({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function SolutionChoiceGroup({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll className="mt-10 grid items-stretch gap-5 lg:grid-cols-2" variant="up" delayMs={220}>
      {children}
    </RevealOnScroll>
  );
}

export function SolutionChoiceContent({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function SolutionChoiceHeading({ children }: { children: ReactNode }) {
  return <div className="mt-5">{children}</div>;
}
