import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { AcpHeroCopy, AcpHeroLead, AcpHeroTitle } from "@/components/sections/acp/hero-primitives";
import faqStyles from "@/components/sections/acp/acp-faq.module.css";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export { AcpHeroCopy, AcpHeroLead, AcpHeroTitle };
function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function AcpStaticPageShell({ children }: { children: ReactNode }) {
  return <main {...componentNameDebugProps("AcpStaticPageShell")} className="bg-white text-[#24292f]">{children}</main>;
}

export function AcpHeroSection({
  children,
  media,
  mediaTitle,
  background = "dac",
}: {
  children: ReactNode;
  media: { kind: "youtube"; src: string } | { kind: "image"; src: string; alt: string };
  mediaTitle: string;
  background?: "dac" | "sac" | "kac" | "wac";
}) {
  const backgroundImage = {
    dac: "linear-gradient(180deg, #fff 30%, #dfe8f2 84%, #fff 84%, #fff 100%)",
    sac: "linear-gradient(180deg, #fff 30%, #e2e9e1 84%, #fff 84%, #fff 100%)",
    kac: "linear-gradient(180deg, #fff 30%, #e8eaf4 84%, #fff 84%, #fff 100%)",
    wac: "linear-gradient(180deg, #fff 30%, #dfeff2 84%, #fff 84%, #fff 100%)",
  }[background];

  return (
    <section {...componentNameDebugProps("AcpHeroSection")} className="px-6 pb-0 pt-[134px] lg:pt-[144px]" style={{ background: backgroundImage }}>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-20 text-center max-[480px]:gap-[70px]">
        {children}
        {media.kind === "youtube" ? (
          <div className="aspect-video w-full max-w-[1024px]">
            <iframe
              className="h-full w-full"
              src={`${media.src}&modestbranding=0`}
              title={mediaTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="w-full max-w-[1000px]">
            <Image src={media.src} alt={media.alt} width={1000} height={520} className="h-auto w-full" style={{ height: "auto", width: "100%" }} priority />
          </div>
        )}
      </div>
    </section>
  );
}

export function AcpHeroEyebrow({ children }: { children: ReactNode }) {
  void children;
  return null;
}


export function AcpFeatureSection({
  children,
  topPadding = "ultra",
}: {
  children: ReactNode;
  topPadding?: "mega" | "ultra";
}) {
  return (
    <section {...componentNameDebugProps("AcpFeatureSection")} className={joinClasses("px-6 pb-[100px]", topPadding === "mega" ? "pt-[140px]" : "pt-[200px]")}>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[100px] max-[480px]:gap-[70px]">{children}</div>
    </section>
  );
}

export function AcpSectionIntro({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AcpSectionIntro")} className="flex w-full max-w-[1200px] flex-col gap-5">{children}</div>;
}

export function AcpSectionHeading({ children }: { children: ReactNode }) {
  return <h2 {...componentNameDebugProps("AcpSectionHeading")} className="whitespace-pre-line text-[52px] font-normal leading-[62px] tracking-normal text-[#24292f] max-[480px]:text-[36px] max-[480px]:leading-[44px]">{children}</h2>;
}

export function AcpSectionLeadGroup({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AcpSectionLeadGroup")} className="text-lg font-light leading-7 text-[#57606a] max-[480px]:text-base max-[480px]:leading-7">{children}</div>;
}

export function AcpFeatureGrid({ children }: { children: ReactNode }) {
  return <ul {...componentNameDebugProps("AcpFeatureGrid")} className="grid gap-[30px] md:grid-cols-2 lg:grid-cols-3 max-[480px]:gap-5">{children}</ul>;
}

export function AcpFeatureCard({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <li {...componentNameDebugProps("AcpFeatureCard")} className="flex flex-col gap-5 rounded-[20px] bg-[#f6f8fa] px-10 py-[60px] max-[480px]:px-[30px] max-[480px]:py-10">
      <Image src={icon} alt="" width={40} height={40} className="h-10 w-10" />
      {children}
    </li>
  );
}

export function AcpFeatureCardTitle({ children }: { children: ReactNode }) {
  return <h6 {...componentNameDebugProps("AcpFeatureCardTitle")} className="text-[20px] font-medium leading-7 text-[#24292f] max-[480px]:text-base max-[480px]:leading-6">{children}</h6>;
}

export function AcpFeatureCardDescription({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AcpFeatureCardDescription")} className="text-base font-light leading-7 text-[#57606a] max-[480px]:text-sm max-[480px]:leading-[22px]">{children}</p>;
}

export function AcpWorksSection({
  children,
  imageSrc,
  imageAlt,
  imageWidth = 1000,
  imageHeight = 520,
}: {
  children: ReactNode;
  imageSrc: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
}) {
  return (
    <section {...componentNameDebugProps("AcpWorksSection")} className="px-6 py-[100px]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-20 max-[480px]:gap-[70px]">
        {children}
        <div className="mx-auto w-full max-w-[1000px]">
          <Image src={imageSrc} alt={imageAlt} width={imageWidth} height={imageHeight} className="h-auto w-full" style={{ height: "auto", width: "100%" }} />
        </div>
      </div>
    </section>
  );
}

export function AcpCapabilityGallery({ children }: { children: ReactNode }) {
  return (
    <section className="px-6 py-[100px]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-20">{children}</div>
    </section>
  );
}

export function AcpCapabilityImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div>
      <Image src={src} alt={alt} width={640} height={360} className="h-auto w-full" style={{ height: "auto", width: "100%" }} />
    </div>
  );
}

export function AcpCapabilityGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 md:grid-cols-2">{children}</div>;
}

export function AcpSplitFeatureSection({
  children,
  imageSrc,
  imageAlt,
  imageWidth = 640,
  imageHeight = 520,
  imageWidthClassName = "lg:basis-[53.3%]",
  reverse = false,
  gray = false,
  last = false,
}: {
  children: ReactNode;
  imageSrc: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
  imageWidthClassName?: string;
  reverse?: boolean;
  gray?: boolean;
  last?: boolean;
}) {
  return (
    <section {...componentNameDebugProps("AcpSplitFeatureSection")} className={joinClasses("px-6 py-[60px]", gray && "bg-[#f6f8fa]", last && "pb-20 md:pb-[80px]")}>
      <div className={joinClasses("mx-auto flex w-full max-w-[1200px] flex-col items-center gap-20 lg:flex-row", reverse && "lg:flex-row-reverse")}>
        <div className="flex flex-1 flex-col gap-5">{children}</div>
        <div className={joinClasses("w-full flex-none", imageWidthClassName)}>
          <Image src={imageSrc} alt={imageAlt} width={imageWidth} height={imageHeight} className="h-auto w-full" style={{ height: "auto", width: "100%" }} />
        </div>
      </div>
    </section>
  );
}

export function AcpSplitFeatureTitle({ children }: { children: ReactNode }) {
  return <h4 {...componentNameDebugProps("AcpSplitFeatureTitle")} className="whitespace-pre-line text-[32px] font-medium leading-[42px] text-[#24292f] max-[480px]:text-[20px] max-[480px]:leading-7">{children}</h4>;
}

export function AcpSplitFeatureBadge({ children }: { children: ReactNode }) {
  return <span {...componentNameDebugProps("AcpSplitFeatureBadge")} className="w-fit rounded-[20px] bg-[#24292f] px-4 py-2 text-sm font-medium leading-none text-white">{children}</span>;
}

export function AcpSplitFeatureBody({ children }: { children: ReactNode }) {
  return <div {...componentNameDebugProps("AcpSplitFeatureBody")} className="text-lg font-light leading-7 text-[#57606a] max-[480px]:text-base max-[480px]:leading-7">{children}</div>;
}

export function AcpFaqSection({ children }: { children: ReactNode }) {
  return (
    <section {...componentNameDebugProps("AcpFaqSection")} className={faqStyles.section}>
      <ul className={faqStyles.list}>{children}</ul>
    </section>
  );
}

export function AcpFaqItem({
  question,
  children,
}: {
  question: ReactNode;
  children: ReactNode;
}) {
  return (
    <li {...componentNameDebugProps("AcpFaqItem")} className={faqStyles.item}>
      <details>
        <summary>{question}</summary>
        <div className={faqStyles.answer}>{children}</div>
      </details>
    </li>
  );
}

export function AcpPageCta({ children }: { children: ReactNode }) {
  return (
    <section {...componentNameDebugProps("AcpPageCta")} className="bg-[#f6f8fa] px-6 py-[120px] max-[480px]:py-[105px]">
      <div className="mx-auto flex max-w-[960px] flex-col items-center gap-10 text-center">
        {children}
      </div>
    </section>
  );
}

export function AcpPageCtaTitle({ children }: { children: ReactNode }) {
  return <h2 {...componentNameDebugProps("AcpPageCtaTitle")} className="text-[52px] font-normal leading-[62px] text-[#24292f] max-[480px]:text-[32px] max-[480px]:leading-10">{children}</h2>;
}

export function AcpPageCtaDescription({ children }: { children: ReactNode }) {
  return <p {...componentNameDebugProps("AcpPageCtaDescription")} className="text-lg font-light leading-7 text-[#57606a] max-[480px]:text-base max-[480px]:leading-7">{children}</p>;
}

export function AcpPageCtaLink({ children }: { children: ReactNode }) {
  return (
    <Link {...componentNameDebugProps("AcpPageCtaLink")}
      href="https://app.querypie.com"
      className="inline-flex h-[50px] items-center justify-center rounded-[6px] bg-[#0762d4] px-7 text-base font-medium leading-4 text-[#f6f6f6] transition hover:opacity-90 max-[480px]:h-[44px] max-[480px]:text-sm"
      style={{ backgroundImage: "linear-gradient(100deg, #0762d4 34.93%, #875ac5 76.81%, #c55a8c 99.98%)" }}
    >
      {children}
    </Link>
  );
}
