import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

type FeatureItem = {
  label: string;
  heading: string;
  description: string;
  cta: string;
  tags: readonly string[];
  panelTitle: string;
  panelSubtitle: string;
  cards: readonly string[];
};

type FeatureShowcaseProps = {
  items: readonly FeatureItem[];
};

export function FeatureShowcase({ items }: FeatureShowcaseProps) {
  return (
    <div className="mx-auto mt-8 max-w-[1120px]">
      <article className="overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_24px_70px_-50px_rgba(15,23,42,0.16)]">
        <div className="border-b border-black/6 bg-[linear-gradient(180deg,#fbfcfe_0%,#ffffff_100%)] px-6 py-6 sm:px-8 sm:py-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e4e7ec] bg-white px-3 py-1.5 text-[12px] font-medium text-[#475467]">
            <Sparkles className="h-4 w-4 text-[#ED602E]" />
            AI Staff Workflow
          </div>
          <h3 className="mt-2 text-[26px] font-medium leading-[1.14] tracking-[-0.04em] text-[#101828] sm:text-[30px] lg:text-[32px]">
            職務定義から成果評価まで、
            <br />
            AI Staffが働く流れを1枚で見える化しました。
          </h3>
          <p className="mt-4 max-w-[760px] text-[15px] leading-7 text-[#667085]">
            「職務定義｜オンボーディング｜実務巻き取り｜権限管理｜成果評価」の5ステップを、タブ遷移なしで流れごと把握できる構成にしています。
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          <div className="relative">
            <div className="pointer-events-none absolute left-[8%] right-[8%] top-7 hidden h-px bg-[#e4e7ec] xl:block" />

            <ol className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {items.map((item, index) => (
                <li
                  key={item.label}
                  className="relative rounded-[1.5rem] border border-black/6 bg-[#fbfcfd] p-5 shadow-[0_18px_40px_-36px_rgba(15,23,42,0.2)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-[#2f3a49] px-3 text-[13px] font-semibold text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {index < items.length - 1 && (
                      <ArrowRight className="hidden h-4 w-4 text-[#98a2b3] xl:block" />
                    )}
                  </div>

                  <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#98a2b3]">
                    {item.label}
                  </p>
                  <h4 className="mt-2 text-[19px] font-semibold leading-[1.45] tracking-[-0.02em] text-[#101828]">
                    {item.heading.split("\n").map((line, lineIndex) => (
                      <span key={`${line}-${lineIndex}`} className="block">
                        {line}
                      </span>
                    ))}
                  </h4>
                  <p className="mt-3 text-[14px] leading-6 text-[#667085]">{item.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-black/6 bg-white px-2.5 py-1 text-[11px] font-medium text-[#667085]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2.5 border-t border-[#eaecf0] pt-4">
                    {item.cards.map((card) => (
                      <div key={card} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ED602E]" />
                        <p className="text-[13px] leading-5 text-[#475467]">{card}</p>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </article>
    </div>
  );
}
