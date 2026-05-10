"use client";

import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { useState } from "react";
import { Check, Minus } from "lucide-react";

type ProductKey = "aip" | "acp";

type PlanFeature = {
  label: ReactNode;
  supported?: boolean;
  dividerAfter?: boolean;
};

export type PlanCardData = {
  title: string;
  description: ReactNode;
  price: ReactNode;
  ctaLabel: string;
  ctaHref: string;
  ctaExternal?: boolean;
  tone: "primary" | "dark";
  features: readonly PlanFeature[];
};

export type ComparisonRow = {
  label: string;
  values: readonly [ReactNode, ReactNode, ReactNode];
};

export type ComparisonGroup = {
  title: string;
  rows: readonly ComparisonRow[];
};

type ProductPanel = {
  key: ProductKey;
  name: string;
  description: string;
  cards: readonly PlanCardData[];
  comparisonGroups?: readonly ComparisonGroup[];
};

type PlansProductSwitcherProps = {
  products: readonly [ProductPanel, ProductPanel];
};

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function FeatureIcon({ supported = true }: { supported?: boolean }) {
  if (supported) {
    return <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={2.5} />;
  }

  return <Minus className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" strokeWidth={2.5} />;
}

function TableCellValue({ value }: { value: ReactNode }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex justify-center text-[#1d4ed8]">
        <Check className="h-4 w-4" strokeWidth={2.75} />
      </span>
    ) : (
      <span className="inline-flex justify-center text-slate-300">
        <Minus className="h-4 w-4" strokeWidth={2.75} />
      </span>
    );
  }

  return <>{value}</>;
}

export function PlansPageSection({ children }: { children: ReactNode }) {
  return <section className="mx-auto flex w-full max-w-[1200px] flex-col px-6 pb-24 pt-[72px] sm:pb-28 lg:px-8 xl:px-0">{children}</section>;
}

export function PlansHeroSection({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-10 sm:gap-12">{children}</div>;
}

export function PlansHeroTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-[42px] font-medium leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-[52px]">{children}</h1>;
}

export function PlansHeroDescription({ children }: { children: ReactNode }) {
  return <div className="max-w-[640px] text-[15px] leading-7 text-slate-600 sm:text-base">{children}</div>;
}

export function PlansProductSwitcher({ products }: PlansProductSwitcherProps) {
  const [activeProduct, setActiveProduct] = useState<ProductKey>(products[0].key);
  const activePanel = products.find((product) => product.key === activeProduct) ?? products[0];

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <div className="flex flex-wrap items-end gap-x-10 gap-y-4 border-b border-slate-200 pb-4">
        {products.map((product) => {
          const isActive = product.key === activeProduct;

          return (
            <button
              key={product.key}
              type="button"
              onClick={() => setActiveProduct(product.key)}
              className={joinClasses(
                "group flex min-w-[200px] flex-col items-start gap-1 text-left transition",
                isActive ? "text-[#1d4ed8]" : "text-slate-400 hover:text-slate-700",
              )}
            >
              <span className="text-[20px] font-semibold leading-tight sm:text-[22px]">{product.name}</span>
              <span className={joinClasses("text-sm leading-6", isActive ? "text-slate-600" : "text-slate-400 group-hover:text-slate-500")}>
                {product.description}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {activePanel.cards.map((card) => (
          <article
            key={`${activePanel.key}-${card.title}`}
            className={joinClasses(
              "flex min-h-full flex-col rounded-[24px] border px-6 py-7 sm:px-7 sm:py-8",
              card.tone === "dark"
                ? "border-slate-950 bg-[linear-gradient(180deg,#1f2937_0%,#111827_100%)] text-white shadow-[0_20px_60px_rgba(15,23,42,0.24)]"
                : "border-slate-200 bg-slate-50 text-slate-950",
            )}
          >
            <div className="flex flex-col gap-3">
              <div>
                <h2 className={joinClasses("text-[22px] font-semibold leading-tight", card.tone === "dark" ? "text-white" : "text-slate-950")}>
                  {card.title}
                </h2>
                <div className={joinClasses("mt-2 text-[15px] leading-6", card.tone === "dark" ? "text-slate-300" : "text-slate-500")}>
                  {card.description}
                </div>
              </div>
              <div className={joinClasses("text-[38px] font-semibold leading-none tracking-[-0.03em] sm:text-[42px]", card.tone === "dark" ? "text-white" : "text-slate-950")}>
                {card.price}
              </div>
            </div>

            <Link
              href={card.ctaHref}
              target={card.ctaExternal ? "_blank" : undefined}
              rel={card.ctaExternal ? "noreferrer" : undefined}
              className={joinClasses(
                "mt-6 inline-flex w-fit items-center justify-center rounded-[10px] px-5 py-3 text-sm font-medium transition",
                card.tone === "dark"
                  ? "bg-slate-950 text-white hover:bg-slate-900"
                  : "bg-[#1d4ed8] text-white hover:bg-[#1e40af]",
              )}
            >
              {card.ctaLabel}
            </Link>

            <ul className="mt-6 flex flex-1 flex-col gap-3 border-t border-slate-200/80 pt-6 text-[15px] leading-6 text-slate-700">
              {card.features.map((feature, index) => (
                <Fragment key={`${card.title}-feature-${index}`}>
                  <li className={joinClasses("flex gap-3", card.tone === "dark" ? "text-slate-100" : "text-slate-700", !feature.supported && "text-slate-400")}>
                    <FeatureIcon supported={feature.supported} />
                    <div>{feature.label}</div>
                  </li>
                  {feature.dividerAfter ? (
                    <li aria-hidden className={joinClasses("my-1 h-px w-full list-none", card.tone === "dark" ? "bg-white/10" : "bg-slate-200")} />
                  ) : null}
                </Fragment>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {activePanel.comparisonGroups ? <PlansComparisonTable groups={activePanel.comparisonGroups} /> : null}
    </div>
  );
}

export function PlansComparisonTable({ groups }: { groups: readonly ComparisonGroup[] }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm leading-6 text-slate-700">
          <thead>
            <tr className="border-b border-slate-200 bg-white text-slate-950">
              <th className="min-w-[220px] px-5 py-4 font-medium sm:px-6">&nbsp;</th>
              <th className="min-w-[180px] px-5 py-4 text-center font-medium sm:px-6">スターター</th>
              <th className="min-w-[180px] px-5 py-4 text-center font-medium sm:px-6">チーム</th>
              <th className="min-w-[180px] px-5 py-4 text-center font-medium sm:px-6">エンタープライズ</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <Fragment key={group.title}>
                <tr className="bg-slate-900 text-white">
                  <th colSpan={4} className="px-5 py-3 text-left text-sm font-medium sm:px-6">
                    {group.title}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={`${group.title}-${row.label}`} className="border-b border-slate-200 last:border-b-0">
                    <th className="bg-white px-5 py-4 font-medium text-slate-950 sm:px-6">{row.label}</th>
                    {row.values.map((value, index) => (
                      <td key={`${group.title}-${row.label}-${index}`} className="px-5 py-4 text-center align-middle sm:px-6">
                        <TableCellValue value={value} />
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
