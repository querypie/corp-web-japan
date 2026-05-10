"use client";

import Link from "next/link";
import {
  Children,
  cloneElement,
  createContext,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
  useState,
} from "react";
import { Check, Minus } from "lucide-react";

type PricingContextValue = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

type PlanTone = "primary" | "black";

type ProductTabInjectedProps = {
  isActive?: boolean;
  onTabClick?: () => void;
};

type FeatureValue = string | boolean | ReactNode | CompareTableCellContent;

type CompareTableCellContent = {
  primary: string;
  secondary?: string;
  isBold?: boolean;
  showIcon?: boolean;
};

export type CompareTableRowGroup = {
  label: string;
  values: string[];
};

export type CompareTableColumn = {
  label: string;
  values: FeatureValue[][];
};

const pricingContext = createContext<PricingContextValue | null>(null);
const PlanToneContext = createContext<PlanTone>("primary");

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function usePricingContext() {
  const context = useContext(pricingContext);

  if (!context) {
    throw new Error("Plans pricing components must be used within PricingContextProvider.");
  }

  return context;
}

export function PlansPageSection({ children }: { children: ReactNode }) {
  return <section className="mx-auto flex w-full max-w-[1200px] flex-col px-6 pb-24 pt-[72px] sm:pb-28 lg:px-8 xl:px-0">{children}</section>;
}

function PricingRoot({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-10 sm:gap-12">{children}</div>;
}

function PricingHeader({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-5">{children}</div>;
}

export const Pricing = Object.assign(PricingRoot, {
  Header: PricingHeader,
});

export function PlansHeroTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-[42px] font-medium leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-[52px]">{children}</h1>;
}

export function PlansHeroDescription({ children }: { children: ReactNode }) {
  return <div className="max-w-[640px] text-[15px] leading-7 text-slate-600 sm:text-base">{children}</div>;
}

export function PricingContextProvider({ children, defaultActiveTab }: { children: ReactNode; defaultActiveTab: string }) {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === "undefined") {
      return defaultActiveTab;
    }

    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.has("acp")) {
      return "acp";
    }

    if (searchParams.has("aip")) {
      return "aip";
    }

    return defaultActiveTab;
  });

  return <pricingContext.Provider value={{ activeTab, setActiveTab }}>{children}</pricingContext.Provider>;
}

function ProductTabsRoot({ children }: { children: ReactNode }) {
  const { activeTab, setActiveTab } = usePricingContext();

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <div className="flex flex-wrap items-end gap-x-10 gap-y-4 border-b border-slate-200 pb-4">
        {Children.map(children, (child) => {
          if (!isValidElement<{ name: string }>(child) || !("name" in child.props)) {
            return child;
          }

          const name = String(child.props.name);

          return cloneElement(child as ReactElement<ProductTabProps>, {
            isActive: activeTab === name,
            onTabClick: () => setActiveTab(name),
          });
        })}
      </div>
    </div>
  );
}

type ProductTabProps = {
  name: string;
  children: ReactNode;
} & ProductTabInjectedProps;

function ProductTab({ name, children, isActive, onTabClick }: ProductTabProps) {
  return (
    <button
      type="button"
      aria-label={name}
      onClick={onTabClick}
      className={joinClasses(
        "group flex min-w-[200px] flex-col items-start gap-1 text-left transition",
        isActive ? "text-[#1d4ed8]" : "text-slate-400 hover:text-slate-700",
      )}
    >
      <div>{children}</div>
    </button>
  );
}

function ProductName({ children }: { children: ReactNode }) {
  return <div className="text-[20px] font-semibold leading-tight sm:text-[22px]">{children}</div>;
}

function ProductDescription({ children }: { children: ReactNode }) {
  return <div className="text-sm leading-6 text-slate-500 group-hover:text-slate-500">{children}</div>;
}

export const ProductTabs = ProductTabsRoot;
export { ProductTab, ProductName, ProductDescription };

export function PlanVisibility({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab } = usePricingContext();

  if (activeTab !== id) {
    return null;
  }

  return <>{children}</>;
}

function PlanRoot({ children, num = 3 }: { children: ReactNode; num?: number }) {
  return <ul className={joinClasses("grid gap-5", num === 3 && "lg:grid-cols-3")}>{children}</ul>;
}

function PlanCard({ type, children }: { type: "primary" | "black"; children: ReactNode }) {
  return (
    <PlanToneContext.Provider value={type}>
      <li
        className={joinClasses(
          "flex min-h-full flex-col rounded-[24px] border px-6 py-7 sm:px-7 sm:py-8",
          type === "black"
            ? "border-slate-950 bg-[linear-gradient(180deg,#1f2937_0%,#111827_100%)] text-white shadow-[0_20px_60px_rgba(15,23,42,0.24)]"
            : "border-slate-200 bg-slate-50 text-slate-950",
        )}
      >
        {children}
      </li>
    </PlanToneContext.Provider>
  );
}

function PlanTitleContainer({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3">{children}</div>;
}

function PlanTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[22px] font-semibold leading-tight text-inherit">{children}</h2>;
}

function PlanDescription({ children }: { children: ReactNode }) {
  const tone = useContext(PlanToneContext);

  return <div className={joinClasses("mt-2 text-[15px] leading-6", tone === "black" ? "text-slate-300" : "text-slate-500")}>{children}</div>;
}

function PlanPrice({ children }: { children: ReactNode }) {
  return <div className="text-[38px] font-semibold leading-none tracking-[-0.03em] text-inherit sm:text-[42px]">{children}</div>;
}

function PlanButton({ href, external = false, type = "primary", children }: { href: string; external?: boolean; type?: "primary" | "black"; children: ReactNode }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={joinClasses(
        "mt-6 inline-flex w-fit items-center justify-center rounded-[10px] px-5 py-3 text-sm font-medium transition",
        type === "black" ? "bg-slate-950 text-white hover:bg-slate-900" : "bg-[#1d4ed8] text-white hover:bg-[#1e40af]",
      )}
    >
      {children}
    </Link>
  );
}

function PlanFeatures({ children }: { children: ReactNode }) {
  return <ul className="mt-6 flex flex-1 flex-col gap-3 border-t border-slate-200/80 pt-6 text-[15px] leading-6 text-slate-700">{children}</ul>;
}

function PlanFeature({ supported = true, children }: { supported?: boolean; children: ReactNode }) {
  return (
    <li className={joinClasses("flex gap-3", supported ? "text-inherit" : "text-slate-400")}> 
      {supported ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={2.5} /> : <Minus className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" strokeWidth={2.5} />}
      <div>{children}</div>
    </li>
  );
}

function PlanDivider() {
  const tone = useContext(PlanToneContext);

  return <li aria-hidden className={joinClasses("my-1 h-px w-full list-none", tone === "black" ? "bg-white/10" : "bg-slate-200")} />;
}

export const Plan = Object.assign(PlanRoot, {
  Card: PlanCard,
  TitleContainer: PlanTitleContainer,
  Title: PlanTitle,
  Description: PlanDescription,
  Price: PlanPrice,
  Button: PlanButton,
  Features: PlanFeatures,
  Feature: PlanFeature,
  Divider: PlanDivider,
});

function renderCompareTableCell(value: FeatureValue) {
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

  if (typeof value === "object" && value !== null && "primary" in value) {
    const cellValue = value as CompareTableCellContent;

    if (cellValue.showIcon) {
      return (
        <div className="inline-flex items-center gap-2">
          <Check className="h-4 w-4 text-[#1d4ed8]" strokeWidth={2.75} />
          <span className={joinClasses(cellValue.isBold && "font-semibold")}>{cellValue.primary}</span>
        </div>
      );
    }

    return (
      <div className="inline-flex flex-col items-center text-center">
        <span className={joinClasses(cellValue.isBold && "font-semibold")}>{cellValue.primary}</span>
        {cellValue.secondary ? <span className="text-xs text-slate-500">{cellValue.secondary}</span> : null}
      </div>
    );
  }

  return value;
}

export function CompareTable({ rows, columns }: { rows: CompareTableRowGroup[]; columns: CompareTableColumn[] }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm leading-6 text-slate-700">
          <thead>
            <tr className="border-b border-slate-200 bg-white text-slate-950">
              <th className="min-w-[220px] px-5 py-4 font-medium sm:px-6">&nbsp;</th>
              {columns.map((column) => (
                <th key={column.label} className="min-w-[180px] px-5 py-4 text-center font-medium sm:px-6">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <Fragment key={row.label}>
                <tr className="bg-slate-900 text-white">
                  <th colSpan={columns.length + 1} className="px-5 py-3 text-left text-sm font-medium sm:px-6">
                    {row.label}
                  </th>
                </tr>
                {row.values.map((valueLabel, valueIndex) => (
                  <tr key={`${row.label}-${valueLabel}`} className="border-b border-slate-200 last:border-b-0">
                    <th className="bg-white px-5 py-4 font-medium text-slate-950 sm:px-6">{valueLabel}</th>
                    {columns.map((column) => (
                      <td key={`${column.label}-${valueLabel}`} className="px-5 py-4 text-center align-middle sm:px-6">
                        {renderCompareTableCell(column.values[rowIndex][valueIndex])}
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
