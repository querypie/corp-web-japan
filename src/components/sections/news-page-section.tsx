import type { ReactNode } from "react";
import Link from "next/link";

type NavItemProps = {
  href: string;
  active?: boolean;
  children: ReactNode;
};

export function NewsPageSection({ children }: { children: ReactNode }) {
  return <section className="mx-auto max-w-[1440px] bg-white px-[30px] pb-[96px] pt-[92px] lg:pb-[128px] lg:pt-[116px]">{children}</section>;
}

export function NewsPageLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex max-w-[1200px] flex-col gap-[34px] lg:flex-row lg:items-start lg:gap-[60px]">{children}</div>;
}

export function NewsPageSidebar({ children }: { children: ReactNode }) {
  return <aside className="w-full pt-[20px] lg:w-[210px] lg:flex-shrink-0">{children}</aside>;
}

export function NewsPageSidebarLabel({ children }: { children: ReactNode }) {
  return <p className="sr-only">{children}</p>;
}

export function NewsPageNav({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:overflow-visible">
      <ul className="flex min-w-max gap-3 lg:min-w-0 lg:flex-col lg:gap-0">{children}</ul>
    </div>
  );
}

export function NewsPageNavItem({ href, active = false, children }: NavItemProps) {
  return (
    <li className="lg:mt-0 lg:[&+li]:mt-3">
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
    </li>
  );
}

export function NewsPageContent({ children }: { children: ReactNode }) {
  return <div className="min-w-0 flex-1">{children}</div>;
}

export function NewsPageIntro({ children }: { children: ReactNode }) {
  return <div className="text-left">{children}</div>;
}

export function NewsPageTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-[44px] font-medium leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-[52px] lg:text-[60px]">{children}</h1>;
}

export function NewsPageLead({ children }: { children: ReactNode }) {
  return <p className="mt-5 max-w-[760px] text-base leading-7 text-slate-500">{children}</p>;
}

export function NewsPageListArea({ children }: { children: ReactNode }) {
  return <div className="mt-[44px] lg:mt-[80px]">{children}</div>;
}
