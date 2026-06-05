"use client";

import Link from "next/link";
import { Children, isValidElement, type ReactElement, type ReactNode, useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { componentNameDebugProps } from "@/lib/component-name-debug";

export type AIDashiFaqItem = {
  question: string;
  answer: string;
};

type AIDashiFaqProps = {
  ctaHref: string;
  ctaLabel: string;
  children: ReactNode;
};

type AIDashiFaqQuestionProps = {
  question: string;
  children: ReactNode;
};

export function AIDashiFaqQuestion(_props: AIDashiFaqQuestionProps) {
  void _props;
  return null;
}

export function AIDashiFaq({ children, ctaHref, ctaLabel }: AIDashiFaqProps) {
  const [openIndex, setOpenIndex] = useState<number>(-1);

  const items = useMemo(
    () =>
      Children.toArray(children)
        .filter((child): child is ReactElement<AIDashiFaqQuestionProps> => isValidElement(child) && child.type === AIDashiFaqQuestion)
        .map(({ props }) => ({
          question: props.question,
          answer: typeof props.children === "string" ? props.children : "",
        })),
    [children],
  );

  return (
    <div {...componentNameDebugProps("AIDashiFaq")} className="w-full max-w-[1120px] space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <article
            key={item.question}
            className={isOpen ? "rounded-[10px] bg-[#f9f9fb] px-8 py-6" : "px-8 py-6"}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-start gap-6 text-left"
              aria-expanded={isOpen}
            >
              <span className="flex-1 text-[20px] font-semibold leading-8 tracking-[-0.02em] text-slate-950 md:text-[22px]">
                {item.question}
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-950">
                {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </span>
            </button>

            {isOpen ? (
              <div className="pr-14">
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>
                <div className="mt-5">
                  <Link
                    href={ctaHref}
                    className="inline-flex items-center justify-center rounded-[8px] bg-[#15181d] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#0f1216]"
                  >
                    {ctaLabel}
                  </Link>
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
