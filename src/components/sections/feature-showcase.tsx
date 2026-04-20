import Image from "next/image";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

type FeatureShowcaseProps = {
  intro: {
    title: string;
    body: string;
    imageSrc?: string;
    imageAlt?: string;
  };
};

function renderEmphasizedText(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold text-[#163A7A]">
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
      <span className="bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] bg-clip-text text-transparent">
        {keyword}
      </span>
      {after}
    </>
  );
}

export function FeatureShowcase({ intro }: FeatureShowcaseProps) {
  return (
    <div className="mx-auto mt-8 max-w-[1120px]">
      <article className="overflow-visible">
        <div className="grid gap-8 px-6 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1.08fr)_380px] lg:items-center lg:gap-12">
          <div className="max-w-[650px]">
            <RevealOnScroll>
              <h2 className="max-w-none text-[30px] font-semibold leading-[1.2] tracking-[-0.04em] text-[#101828] sm:text-[42px] sm:leading-[1.2] sm:whitespace-nowrap">
              {intro.title.split("\n").map((line, index) => (
                <span
                  key={`${line}-${index}`}
                  className={
                    index === 1
                      ? "block bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] bg-clip-text text-transparent"
                      : "block"
                  }
                >
                  {renderHighlightedKeyword(line, "AI Crew")}
                </span>
              ))}
              </h2>
            </RevealOnScroll>
            <RevealOnScroll delayMs={90}>
              <div className="mt-5 space-y-5 text-[15px] leading-8 text-[#667085]">
                {intro.body.split("\n\n").map((paragraph, index) => (
                  <p key={`${paragraph}-${index}`}>{renderEmphasizedText(paragraph)}</p>
                ))}
              </div>
            </RevealOnScroll>
          </div>

          <RevealOnScroll variant="scale" delayMs={120}>
            <figure className="overflow-hidden rounded-[1.8rem] bg-white shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_90px_-52px_rgba(15,23,42,0.2)] lg:ml-auto lg:w-full lg:max-w-[380px] lg:translate-x-10">
            <div className="relative aspect-[5/4] bg-[#eef2f6]">
              <Image
                src={intro.imageSrc ?? "/images/ai-staff-team.jpg"}
                alt={intro.imageAlt ?? "AI Crewが既存チームの業務を支えるイメージ"}
                fill
                className="object-cover object-[94%_center]"
                sizes="(min-width: 1024px) 380px, 100vw"
              />
            </div>
            </figure>
          </RevealOnScroll>
        </div>
      </article>
    </div>
  );
}
