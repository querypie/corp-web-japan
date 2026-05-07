import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { ResourceItem } from "@/content/resources";

export type ResourceCategoryLink = {
  label: string;
  href: string;
  active?: boolean;
};

type ClassNameProps = {
  className?: string;
  style?: CSSProperties;
};

type SectionWithContentProps = ClassNameProps & {
  contentClassName?: string;
};

export function ResourceListHeroSection({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return (
    <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[34px] pt-[111px] lg:px-[30px] lg:pb-[34px] lg:pt-[143px]">
      <div className={`mx-auto max-w-[1200px] text-center ${className}`.trim()}>{children}</div>
    </section>
  );
}

export function ResourceListHeroTitle({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return (
    <h1
      className={`text-[56.25px] font-medium leading-[67.5px] tracking-[-0.04em] text-slate-950 sm:text-[56.25px] sm:leading-[67.5px] sm:tracking-[-0.04em] ${className}`.trim()}
    >
      {children}
    </h1>
  );
}

export function ResourceListHeroDescription({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return (
    <p className={`mx-auto mt-5 max-w-none text-[16.875px] leading-[26.25px] text-slate-600 ${className}`.trim()}>{children}</p>
  );
}

export function ResourceListContentSection({
  children,
  className = "",
  contentClassName = "",
  style,
}: { children: ReactNode } & SectionWithContentProps) {
  return (
    <section className={`mx-auto max-w-[1920px] bg-white px-[30px] pb-[187.5px] pt-[34px] lg:px-[30px] lg:pb-[187.5px] lg:pt-[55px] ${className}`.trim()} style={style}>
      <div className={`mx-auto flex max-w-[1200px] flex-col gap-[34px] lg:flex-row lg:items-start lg:gap-[60px] ${contentClassName}`.trim()}>
        {children}
      </div>
    </section>
  );
}

export function ResourceListSectionHeading({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <div className={`mb-8 border-b border-slate-200 pb-4 ${className}`.trim()}>{children}</div>;
}

export function ResourceListSectionEyebrow({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <p className={`text-sm font-medium uppercase tracking-[0.18em] text-slate-500 ${className}`.trim()}>{children}</p>;
}

export function ResourceListSectionTitleRow({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <div className={`mt-2 flex flex-col gap-2 lg:flex-row lg:items-baseline lg:gap-4 ${className}`.trim()}>{children}</div>;
}

export function ResourceListSectionTitle({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <h2 className={`text-[28px] font-medium leading-[1.25] text-slate-950 lg:text-[32px] ${className}`.trim()}>{children}</h2>;
}

export function ResourceListSectionDescription({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <p className={`text-base leading-7 text-slate-600 ${className}`.trim()}>{children}</p>;
}

export function ResourceListSidebar({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <aside className={`w-full lg:w-[240px] lg:flex-shrink-0 lg:sticky lg:top-[128px] lg:self-start ${className}`.trim()}>{children}</aside>;
}

export function ResourceListSidebarLabel({ children }: { children: ReactNode }) {
  return <p className="sr-only">{children}</p>;
}

export function ResourceListSidebarViewport({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <div className={`block lg:hidden ${className}`.trim()}>{children}</div>;
}

export function ResourceListSidebarDesktop({ children, className = "" }: { children: ReactNode } & ClassNameProps) {
  return <div className={`hidden lg:block ${className}`.trim()}>{children}</div>;
}

export function ResourceListSidebarNav({ children, className = "", label }: { children: ReactNode; label?: string } & ClassNameProps) {
  return (
    <nav aria-label={label} className={`block ${className}`.trim()}>
      {children}
    </nav>
  );
}

export function ResourceListSidebarList({ children }: { children: ReactNode }) {
  return <ul className="grid grid-cols-2 gap-3 lg:flex lg:flex-col lg:gap-0">{children}</ul>;
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
      className={`flex w-full items-center justify-center rounded-[12px] px-4 py-3.5 text-center text-[15px] leading-[1.467] transition lg:block lg:rounded-none lg:px-0 lg:py-0 lg:text-left ${
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
          <li key={item.id}>
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

