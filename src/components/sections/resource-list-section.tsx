import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ResourceItem } from "@/content/resources";

export type ResourceCategoryLink = {
  label: string;
  href: string;
  active?: boolean;
};

export function ResourceListHeroSection({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[34px] pt-[111px] lg:px-[30px] lg:pb-[34px] lg:pt-[143px]">
      <div className="mx-auto max-w-[1200px] text-center">{children}</div>
    </section>
  );
}

export function ResourceListHeroTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-4xl font-medium leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
      {children}
    </h1>
  );
}

export function ResourceListHeroDescription({ children }: { children: ReactNode }) {
  return <p className="mx-auto mt-5 max-w-[760px] text-base leading-6 text-slate-500">{children}</p>;
}

export function ResourceListContentSection({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[89px] pt-[34px] lg:px-[30px] lg:pb-[160px] lg:pt-[55px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[34px] lg:flex-row lg:items-start lg:gap-[60px]">
        {children}
      </div>
    </section>
  );
}

export function ResourceListSidebar({ children }: { children: ReactNode }) {
  return <aside className="w-full lg:w-[210px] lg:flex-shrink-0">{children}</aside>;
}

export function ResourceListSidebarLabel({ children }: { children: ReactNode }) {
  return <p className="sr-only">{children}</p>;
}

export function ResourceListSidebarNav({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:overflow-visible">{children}</div>;
}

export function ResourceListSidebarList({ children }: { children: ReactNode }) {
  return <ul className="flex min-w-max gap-3 lg:min-w-0 lg:flex-col lg:gap-0">{children}</ul>;
}

export function ResourceListSidebarItem({ children }: { children: ReactNode }) {
  return <li className="lg:mt-0 lg:[&+li]:mt-3">{children}</li>;
}

export function ResourceListSidebarLink({
  href,
  active = false,
  children,
}: ResourceCategoryLink & { children?: ReactNode }) {
  return (
    <Link
      href={href}
      className={`inline-flex rounded-[12px] px-4 py-3.5 text-[15px] leading-[1.467] transition lg:block lg:rounded-none lg:px-0 lg:py-0 ${
        active
          ? "bg-[#15181d] font-medium text-white lg:bg-transparent lg:text-[#15181d]"
          : "bg-[#f9f9fb] font-normal text-slate-700 hover:text-slate-950 lg:bg-transparent lg:text-slate-950"
      }`}
    >
      {children}
    </Link>
  );
}

export function ResourceListItems({ items }: { items: readonly ResourceItem[] }) {
  return (
    <div className="min-w-0 flex-1">
      <ul className="grid gap-[34px] lg:grid-cols-2 lg:gap-[60px]">
        {items.map((item) => (
          <li key={item.title}>
            <Link href={item.href} className="flex flex-col gap-5 transition hover:opacity-70">
              <div className="aspect-[16/9] overflow-hidden rounded-[8px] bg-[#eceff3]">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  width={640}
                  height={360}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <span className="inline-flex self-start rounded-full border border-[#353c45] px-3 py-1 text-xs font-medium leading-[1.42] tracking-[0.015rem] text-slate-950">
                  {item.badge}
                </span>
                <h2 className="text-[20px] font-medium leading-[1.4] text-slate-950">{item.title}</h2>
                <p className="text-sm leading-6 text-slate-500">{item.description}</p>
                {item.date ? <p className="text-sm leading-6 text-slate-400">{item.date}</p> : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResourceListCtaSection({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[110px] lg:px-[30px] lg:pb-[160px]">
      <div className="mx-auto max-w-[1200px]">{children}</div>
    </section>
  );
}

export function ResourceListCtaBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-6 py-8 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.24)] sm:px-8 sm:py-10 lg:px-12 lg:py-12">
      {children}
    </div>
  );
}

export function ResourceListCtaTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[28px] font-medium leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[34px]">{children}</h2>;
}

export function ResourceListCtaDescription({ children }: { children: ReactNode }) {
  return <p className="mt-4 max-w-[760px] text-[15px] leading-7 text-slate-600">{children}</p>;
}

export function ResourceListCtaActions({ children }: { children: ReactNode }) {
  return <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">{children}</div>;
}

export function ResourceListCtaButton({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        variant === "primary"
          ? "inline-flex min-h-[46px] items-center justify-center rounded-[10px] bg-[#15181d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          : "inline-flex min-h-[46px] items-center justify-center rounded-[10px] border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
      }
    >
      {children}
    </Link>
  );
}
