"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type RoleSlide = {
  status: string;
  summary: string;
};

type RoleSlidesProps = {
  items: readonly RoleSlide[];
};

export function RoleSlides({ items }: RoleSlidesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || items.length < 2) {
      return;
    }

    requestAnimationFrame(() => {
      const firstCard = container.children[0] as HTMLElement | undefined;

      if (!firstCard) {
        return;
      }

      container.scrollTo({
        left: firstCard.offsetWidth + 24,
        behavior: "auto",
      });
    });
  }, [items.length]);

  function scrollSlides(direction: "prev" | "next") {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const amount = Math.max(container.clientWidth * 0.86, 320);
    container.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative mx-auto max-w-[1232px]">
      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <article
            key={item.status}
            className="min-w-[1104px] snap-center overflow-hidden rounded-[1.8rem] border border-black/6 bg-white shadow-[0_28px_80px_-56px_rgba(15,23,42,0.24)]"
          >
            <div className="relative aspect-[5441/2656] overflow-hidden bg-[#eefbfe]">
              <div className="absolute inset-y-0 right-0 w-[62%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/role-slides/robot-assistant-display.png"
                  alt=""
                  className="absolute right-[-38%] bottom-0 h-full w-auto max-w-none"
                />
              </div>

              <div className="absolute left-[5.28%] top-[10.47%] z-10 w-[52.74%]">
                <h3 className="whitespace-nowrap text-[62px] font-semibold leading-[0.96] tracking-[-0.06em] text-black">
                  インバウンドセールス
                </h3>
              </div>

              <div className="absolute left-[6.14%] top-[27.6%] z-10 w-[47.33%]">
                <p className="text-[20px] leading-[1.25] tracking-[-0.03em] text-[#72808a]">
                  {item.summary}
                </p>
                <button
                  type="button"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-[#2f3a49] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#25303d]"
                >
                  詳しく見る
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <div className="flex items-center gap-6 rounded-full bg-[#f9fafb] px-6 py-4">
          <button
            type="button"
            className="text-slate-900 transition hover:text-slate-700"
            onClick={() => scrollSlides("prev")}
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="text-slate-900 transition hover:text-slate-700"
            onClick={() => scrollSlides("next")}
            aria-label="Next slide"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
