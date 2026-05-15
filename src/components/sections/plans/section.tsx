"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
  useState,
} from "react";
import { Check, Minus } from "lucide-react";
import { MarketingPageSection } from "@/components/sections/home/primitives";

type PricingContextValue = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

type PlanTone = "primary" | "black";

type ProductTabInjectedProps = {
  isActive?: boolean;
  onTabClick?: () => void;
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
  return (
    <MarketingPageSection className="pb-[200px] pt-20 lg:px-8 xl:px-0" contentClassName="flex flex-col">
      {children}
    </MarketingPageSection>
  );
}

export function PricingRoot({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-20">{children}</div>;
}

export function PricingHeader({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-5">{children}</div>;
}

export function PlansHeroTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-[46px] font-normal leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-[60px]">{children}</h1>;
}

export function PlansHeroDescription({ children }: { children: ReactNode }) {
  return <div className="text-[17px] font-light leading-7 tracking-[0.02em] text-slate-950 sm:text-lg">{children}</div>;
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

function getPlansProductHref(pathname: string, product: string) {
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments.at(-1);
  const baseSegments = lastSegment === "aip" || lastSegment === "acp" ? segments.slice(0, -1) : segments;

  return `/${[...baseSegments, product].join("/")}`;
}

function ProductTabsRoot({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { activeTab, setActiveTab } = usePricingContext();

  return (
    <div className="flex w-full gap-5 border-b-2 border-[#dae1e7] md:gap-10 lg:gap-[60px]">
      {Children.map(children, (child) => {
        if (!isValidElement<{ name: string }>(child) || !("name" in child.props)) {
          return child;
        }

        const name = String(child.props.name);

        return cloneElement(child as ReactElement<ProductTabProps>, {
          href: getPlansProductHref(pathname, name),
          isActive: activeTab === name,
          onTabClick: () => setActiveTab(name),
        });
      })}
    </div>
  );
}

type ProductTabProps = {
  name: string;
  href?: string;
  children: ReactNode;
} & ProductTabInjectedProps;

export function ProductTab({ name, href, children, isActive, onTabClick }: ProductTabProps) {
  return (
    <Link
      href={href ?? name}
      aria-label={name}
      onClick={onTabClick}
      className={joinClasses(
        "group -mb-0.5 flex min-h-11 flex-1 cursor-pointer flex-col items-start gap-1.5 pb-4 text-left font-[inherit] transition md:pb-5",
        isActive ? "border-b-2 border-slate-950 text-[#1d4ed8]" : "text-slate-950 hover:opacity-80",
      )}
    >
      {children}
    </Link>
  );
}

export function ProductName({ children }: { children: ReactNode }) {
  return <div className="whitespace-nowrap text-[20px] font-medium leading-7 text-inherit md:text-[26px] md:leading-[34px]">{children}</div>;
}

export function ProductDescription({ children }: { children: ReactNode }) {
  return <div className="whitespace-nowrap text-xs font-normal leading-[18px] tracking-[0.02em] text-slate-600 md:text-sm md:leading-[22px]">{children}</div>;
}

export const ProductTabs = ProductTabsRoot;

export function PlanVisibility({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab } = usePricingContext();

  if (activeTab !== id) {
    return null;
  }

  return <>{children}</>;
}

export function PlanRoot({ children, num = 3 }: { children: ReactNode; num?: number }) {
  return (
    <ul
      className={joinClasses(
        "grid w-full grid-cols-1 gap-5 [container-name:plan-list] [container-type:inline-size] min-[600px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1201px]:gap-10",
        num === 2 && "min-[900px]:grid-cols-2 min-[1201px]:gap-[60px]",
        num === 4 && "min-[900px]:grid-cols-3 min-[1201px]:grid-cols-4 min-[1201px]:gap-x-5",
      )}
    >
      {children}
    </ul>
  );
}

export function PlanCard({ type, children }: { type: PlanTone; children: ReactNode }) {
  return (
    <PlanToneContext.Provider value={type}>
      <li
        className={joinClasses(
          "relative flex min-w-[280px] flex-col items-center gap-10 overflow-hidden rounded-t-[20px] px-6 pb-0 pt-[60px] text-center [container-name:plan-card] [container-type:inline-size] min-[1201px]:px-6",
          type === "black"
            ? "bg-[radial-gradient(126.36%_70.17%_at_50%_86.97%,#fff_0%,rgba(255,255,255,0)_100%),linear-gradient(180deg,#141920_0%,rgba(255,255,255,0)_70.46%)]"
            : "bg-[linear-gradient(180deg,#edf0f7_0%,#edf0f7_26.89%,rgba(255,255,255,0)_60%)]",
        )}
      >
        <span
          aria-hidden="true"
          className={joinClasses(
            "pointer-events-none absolute inset-0 rounded-t-[20px]",
            type === "black"
              ? "bg-[radial-gradient(ellipse_570px_322px_at_center_bottom,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)]"
              : "bg-[radial-gradient(ellipse_570px_232px_at_center_top,rgba(237,240,247,1)_0%,rgba(237,240,247,0)_100%)]",
          )}
        />
        {children}
      </li>
    </PlanToneContext.Provider>
  );
}

export function PlanTitleContainer({ children }: { children: ReactNode }) {
  return <div className="relative flex w-full flex-col items-center gap-2.5 text-center">{children}</div>;
}

export function PlanTitle({ children }: { children: ReactNode }) {
  const tone = useContext(PlanToneContext);

  return <h2 className={joinClasses("m-0 text-[26px] font-medium leading-[34px]", tone === "black" ? "text-[#f6f6f6]" : "text-slate-950")}>{children}</h2>;
}

export function PlanDescription({ children }: { children: ReactNode }) {
  const tone = useContext(PlanToneContext);

  return <div className={joinClasses("m-0 self-stretch text-center text-sm font-normal leading-[22px] tracking-[0.02em]", tone === "black" ? "text-[#f6f6f6]" : "text-slate-600")}>{children}</div>;
}

export function PlanPrice({ children }: { children: ReactNode }) {
  const tone = useContext(PlanToneContext);

  return <div className={joinClasses("relative m-0 text-[32px] font-medium leading-[42px]", tone === "black" ? "text-[#f6f6f6]" : "text-slate-950")}>{children}</div>;
}

export function PlanButton({ href, external = false, type = "primary", children }: { href: string; external?: boolean; type?: PlanTone; children: ReactNode }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={joinClasses(
        "relative inline-flex items-center justify-center gap-2.5 rounded-md px-5 py-2.5 text-[15px] font-medium leading-[22px] transition",
        type === "black" ? "bg-slate-950 text-white hover:bg-slate-800" : "bg-[#1d4ed8] text-white hover:bg-[#1e40af]",
      )}
    >
      <span>{children}</span>
      <ButtonChevronIcon />
    </Link>
  );
}

function ButtonChevronIcon() {
  return (
    <svg aria-hidden="true" className="h-3 w-[7px] shrink-0" viewBox="0 0 7 12" fill="none" focusable="false">
      <path d="M7 6L0.865033 12L0 11.154L5.26381 6L0 0.846L0.865033 0L7 6Z" fill="currentColor" />
    </svg>
  );
}

export function PlanFeatures({ children }: { children: ReactNode }) {
  return <ul className="relative flex w-[230px] flex-col gap-2.5 text-left text-base font-normal leading-[26px] tracking-[0.02em] text-slate-950">{children}</ul>;
}

export function PlanFeature({ supported = true, children }: { supported?: boolean; children: ReactNode }) {
  return (
    <li className={joinClasses("flex flex-1 items-start gap-2.5 text-inherit [text-wrap:pretty] [word-break:keep-all]", !supported && "text-slate-400")}>
      {supported ? <Check className="mt-2 h-[11px] w-[14px] shrink-0 text-emerald-500" strokeWidth={3} /> : <Minus className="mt-1.5 h-3 w-3 shrink-0 text-slate-400" strokeWidth={3} />}
      <div>{children}</div>
    </li>
  );
}

export function PlanDivider() {
  return (
    <li aria-hidden role="separator" className="block h-0 w-full list-none self-start">
      <span className="block h-px w-full origin-top-left bg-[#dae1e7]" />
    </li>
  );
}

export function CompareTable({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-6 w-[calc(100%+48px)] overflow-x-auto px-6 sm:-mx-10 sm:w-[calc(100%+80px)] sm:px-10">
      <table className="w-[1200px] border-collapse text-left text-[15px] text-slate-950">{children}</table>
    </div>
  );
}

export function CompareTableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="h-16 border-0">
        <th className="w-[420px] text-left font-bold">&nbsp;</th>
        {children}
      </tr>
    </thead>
  );
}

export function CompareTablePlanHead({ children }: { children: ReactNode }) {
  return <th className="h-16 w-[130px] text-center text-sm font-normal leading-[22px] text-slate-950">{children}</th>;
}

export function CompareTableSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <tbody>
      <tr className="h-8 bg-[#24292f] text-white">
        <td colSpan={4} className="pl-5 text-left text-xs font-medium leading-[17px] tracking-[0.24px]">
          {title}
        </td>
      </tr>
      {children}
    </tbody>
  );
}

export function CompareTableRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <tr className="h-11 border-b border-[#dae1e7]">
      <td className="w-[420px] pl-5 text-left text-sm font-normal leading-[22px] text-slate-950">{label}</td>
      {children}
    </tr>
  );
}

function CompareTableCell({ children }: { children: ReactNode }) {
  return <td className="w-[130px] text-center align-middle text-sm leading-[1.2] text-slate-950">{children}</td>;
}

export function CompareTableTextCell({ children, secondary, isBold = false }: { children: ReactNode; secondary?: ReactNode; isBold?: boolean }) {
  return (
    <CompareTableCell>
      <div className="inline-flex flex-col items-center gap-1 text-center">
        <span className={joinClasses(isBold && "font-semibold")}>{children}</span>
        {secondary ? <span className="whitespace-pre-line text-[10px] leading-[1.4] text-slate-500">{secondary}</span> : null}
      </div>
    </CompareTableCell>
  );
}

export function CompareTableBooleanCell({ supported }: { supported: boolean }) {
  return (
    <CompareTableCell>
      {supported ? (
        <span className="inline-flex justify-center text-[#1d4ed8]">
          <Check className="h-4 w-4" strokeWidth={2.75} />
        </span>
      ) : (
        <span className="inline-flex justify-center text-[#dc2626]">
          <Minus className="h-4 w-4" strokeWidth={2.75} />
        </span>
      )}
    </CompareTableCell>
  );
}

export function CompareTableCheckLabelCell({ children }: { children: ReactNode }) {
  return (
    <CompareTableCell>
      <div className="inline-flex items-center justify-center gap-1">
        <Check className="h-4 w-4 text-[#1d4ed8]" strokeWidth={2.75} />
        <span>{children}</span>
      </div>
    </CompareTableCell>
  );
}
