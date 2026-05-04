import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type NavItemProps = {
  href: string;
  active?: boolean;
  children: ReactNode;
};

type ActionProps = {
  href: string;
  children: ReactNode;
};

export function NewsPageSection({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto max-w-[1920px] bg-white px-[30px] pb-[89px] pt-[82px] lg:px-[30px] lg:pb-[160px] lg:pt-[105px]">
      {children}
    </section>
  );
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
  return (
    <h1 className="text-4xl font-medium leading-[1.25] tracking-[-0.03em] text-slate-950 sm:text-[48px] sm:leading-[60px] sm:tracking-[-0.96px]">
      {children}
    </h1>
  );
}

export function NewsPageLead({ children }: { children: ReactNode }) {
  return <p className="mt-5 max-w-[760px] text-base leading-7 text-slate-500">{children}</p>;
}

export function NewsPageListArea({ children }: { children: ReactNode }) {
  return <div className="mt-[34px] lg:mt-[55px]">{children}</div>;
}

export function NewsFinalCtaSection({ children }: { children: ReactNode }) {
  return <section className="bg-[#F6F8FA] px-[22px] py-[72px] lg:px-[30px] lg:py-[112px]">{children}</section>;
}

export function NewsFinalCtaShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">{children}</div>;
}

export function NewsFinalCtaTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[30px] font-medium leading-[1.35] tracking-[-0.03em] text-slate-950 sm:text-[38px] lg:text-[42px]">{children}</h2>;
}

export function NewsFinalCtaBody({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-base leading-8 text-slate-500">{children}</p>;
}

export function NewsFinalCtaAction({ href, children }: ActionProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-[9.375px] rounded-[5.625px] bg-[linear-gradient(100deg,#0762D4_34.93%,#875AC5_76.81%,#C55A8C_99.98%)] px-[26.25px] py-[13.125px] text-[15px] font-medium text-[#F6F6F6] transition hover:brightness-[1.04]"
    >
      <span>{children}</span>
      <ArrowRight aria-hidden="true" className="h-3 w-[7px] stroke-[2.5]" />
    </Link>
  );
}
