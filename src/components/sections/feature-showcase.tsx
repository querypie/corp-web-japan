"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];

  return (
    <div className="mx-auto mt-8 max-w-[1120px]">
      <div className="flex flex-wrap items-center justify-center gap-[10px]">
        {items.map((item, index) => (
          <Button
            key={item.label}
            type="button"
            variant="ghost"
            className={cn(
              "rounded-[26px] bg-[#f9f9fb] px-8 py-3 text-[15px] font-medium text-[#24292f] hover:bg-[#f9f9fb]",
              index === activeIndex &&
                "bg-[#2f3a49] text-[#f6f6f6] hover:bg-[#2f3a49] hover:text-[#f6f6f6]",
            )}
            onClick={() => setActiveIndex(index)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[544px_544px] lg:items-start lg:justify-between">
          <div>
          <h3 className="max-w-[544px] text-4xl font-medium leading-[60px] tracking-[-0.96px] text-[#0d121f]">
            {activeItem.heading}
          </h3>
          <p className="mt-4 max-w-[544px] text-base leading-6 text-[#596780]">{activeItem.description}</p>
          </div>

          <div className="rounded-[1.8rem] bg-[#f9f9fb] p-6">
            <div className="overflow-hidden rounded-[1.8rem] border border-black/8 bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="h-5 w-32 rounded bg-slate-100" />
                <div className="h-9 w-20 rounded-full bg-slate-100" />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {activeItem.tags.map((tag) => (
                  <div key={tag} className="h-8 w-20 rounded-full bg-slate-100" />
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[1.25rem] bg-[#f9f9fb] p-4">
                  <div className="h-4 w-28 rounded bg-slate-200" />
                  <div className="mt-5 space-y-4">
                    {activeItem.cards.map((card, index) => (
                      <div key={card} className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-200" />
                        <div className="flex-1">
                          <div className="h-4 w-[72%] rounded bg-slate-200" />
                          <div className="mt-2 h-2 rounded-full bg-white">
                            <div
                              className="h-2 rounded-full bg-slate-300"
                              style={{ width: `${68 - index * 12}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.25rem] bg-[#f9f9fb] p-4">
                  <div className="h-4 w-24 rounded bg-slate-200" />
                  <div className="mt-5 rounded-[1rem] bg-white p-4">
                    <div className="h-3 w-20 rounded bg-slate-100" />
                    <div className="mt-4 h-10 w-24 rounded bg-slate-100" />
                    <div className="mt-4 h-2 rounded-full bg-slate-100" />
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-[1rem] bg-[#f9f9fb] p-3">
                        <div className="h-3 w-12 rounded bg-slate-100" />
                        <div className="mt-2 h-5 w-10 rounded bg-slate-100" />
                      </div>
                      <div className="rounded-[1rem] bg-[#f9f9fb] p-3">
                        <div className="h-3 w-12 rounded bg-slate-100" />
                        <div className="mt-2 h-5 w-10 rounded bg-slate-100" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
