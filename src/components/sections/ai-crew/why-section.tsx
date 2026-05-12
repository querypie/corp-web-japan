import { Children, type ReactNode } from "react";
import Image from "next/image";
import {
  CalendarDays,
  ChartColumnIncreasing,
  FileSearch,
  FolderKanban,
  Layers3,
  MessageSquareText,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

const beforeIcons: ReadonlyArray<{ icon: LucideIcon; pos: string; rot: string }> = [
  { icon: Search, pos: "left-6 top-4", rot: "-rotate-[10deg]" },
  { icon: FolderKanban, pos: "left-[114px] top-[58px]", rot: "rotate-[12deg]" },
  { icon: ChartColumnIncreasing, pos: "left-[42px] bottom-[92px]", rot: "-rotate-[12deg]" },
  { icon: MessageSquareText, pos: "right-[78px] top-[16px]", rot: "rotate-[9deg]" },
  { icon: FileSearch, pos: "right-[28px] bottom-[112px]", rot: "-rotate-[10deg]" },
  { icon: Layers3, pos: "left-[142px] bottom-[70px]", rot: "rotate-[7deg]" },
  { icon: ShieldCheck, pos: "right-[150px] bottom-[48px]", rot: "-rotate-[7deg]" },
  { icon: CalendarDays, pos: "left-[16px] top-[130px]", rot: "rotate-[8deg]" },
] as const;

const afterBackgroundPositions = [
  "left-[62px] top-[30px]",
  "right-[62px] top-[30px]",
  "left-[24px] top-[122px]",
  "right-[24px] top-[122px]",
  "left-[56px] bottom-[70px]",
  "right-[56px] bottom-[70px]",
  "left-[150px] top-[6px]",
  "right-[150px] top-[6px]",
  "left-[148px] bottom-[8px]",
  "right-[148px] bottom-[8px]",
] as const;

const afterBackgroundIcons = [Search, Layers3, FileSearch, ChartColumnIncreasing, ShieldCheck] as const;

export function AICrewWhySection({ children }: { children: ReactNode }) {
  return (
    <section id="why" className="mx-auto max-w-[1920px] bg-white px-6 py-20 lg:px-10 lg:py-28">
      {children}
    </section>
  );
}

export function AICrewWhyIntro({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[1120px] text-center">{children}</div>;
}

export function AICrewWhyTitle({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll>
      <h2 className="text-[34px] font-semibold leading-[1.24] tracking-[-0.03em] text-slate-950 sm:text-[42px] sm:leading-[54px] sm:tracking-[-0.04em] [&_strong]:bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_48%,#2563EB_78%,#93C5FD_100%)] [&_strong]:bg-clip-text [&_strong]:font-inherit [&_strong]:text-transparent [&_strong]:[animation:heroAccentGlow_3.2s_ease-in-out_infinite] [&_strong]:motion-reduce:animate-none">
        {children}
      </h2>
    </RevealOnScroll>
  );
}

export function AICrewWhyBody({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll delayMs={80}>
      <p className="mx-auto mt-5 max-w-[900px] text-left text-base leading-8 text-slate-600 [&_strong]:font-semibold [&_strong]:text-slate-800">
        {children}
      </p>
    </RevealOnScroll>
  );
}

export function AICrewWhyComparisonShell({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll
      className="mx-auto mt-12 max-w-[1120px] rounded-[2.2rem] border border-black/6 bg-white p-5 shadow-[0_28px_90px_-50px_rgba(15,23,42,0.1)] sm:p-6"
      variant="up"
      delayMs={140}
    >
      <div className="grid gap-4 lg:grid-cols-2">{children}</div>
    </RevealOnScroll>
  );
}

export function AICrewWhyBeforeCard({ children }: { children: ReactNode }) {
  const [header, ...body] = Children.toArray(children);

  return (
    <article className="rounded-[1.8rem] border border-black/6 bg-[#f9f9fb] p-6">
      {header}
      <div className="mt-8 flex min-h-[18rem] items-center justify-center">
        <div className="relative h-[320px] w-full max-w-[27rem]">
          {beforeIcons.map(({ icon: Icon, pos, rot }, index) => (
            <div key={`before-icon-${index}`} className={`absolute ${pos} ${rot}`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-black/6 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                <Icon className="h-[18px] w-[18px] text-slate-700" />
              </div>
            </div>
          ))}

          <div className="absolute left-1/2 top-[44%] z-20 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_24px_55px_-30px_rgba(15,23,42,0.22)]">
            <div className="relative h-11 w-11 overflow-hidden">
              <Image src="/images/icon_main.png" alt="Human decision maker" fill className="object-contain" sizes="44px" />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2">{body}</div>
        </div>
      </div>
    </article>
  );
}

export function AICrewWhyBeforeCardSubtitle({ children }: { children: ReactNode }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">Before</p>
      <p className="mt-1 text-sm font-medium tracking-[-0.02em] text-slate-500">{children}</p>
    </div>
  );
}

export function AICrewWhyBeforePainPoint({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[330px] rounded-full border border-[#dbe5f7] bg-white px-4 py-2 text-center text-[12px] font-medium leading-5 tracking-[-0.01em] text-slate-700 shadow-[0_16px_36px_-24px_rgba(15,23,42,0.18)]">
      {children}
    </div>
  );
}

export function AICrewWhyHumanDecisionCore({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="relative h-[74px] w-[74px] overflow-hidden">
        <Image src="/images/icon_main.png" alt="Human decision maker" fill className="object-contain" sizes="74px" />
      </div>
      <span className="mt-2 text-center text-[12px] font-semibold leading-4 tracking-[-0.01em] text-slate-600">
        {children}
      </span>
    </>
  );
}

export function AICrewWhyAfterCard({ children }: { children: ReactNode }) {
  return <article className="rounded-[1.8rem] border border-black/6 bg-[#2f3a49] p-6">{children}</article>;
}

export function AICrewWhyAfterCardSubtitle({ children }: { children: ReactNode }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-semibold tracking-[-0.04em] text-white">After</p>
      <p className="mt-1 text-sm font-medium tracking-[-0.02em] text-white/65">{children}</p>
    </div>
  );
}

export function AICrewWhyAfterMobileLayout({
  centerCore,
  children,
}: {
  centerCore: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mt-8 lg:hidden">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-[154px] w-[154px] flex-col items-center justify-center rounded-full bg-white text-[#2f3a49] shadow-[0_30px_70px_-28px_rgba(15,23,42,0.18)]">{centerCore}</div>
        <div className="grid w-full max-w-[23rem] gap-3 sm:grid-cols-2">{children}</div>
      </div>
    </div>
  );
}

export function AICrewWhyAfterDesktopLayout({
  centerCore,
  children,
}: {
  centerCore: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mt-8 hidden min-h-[18rem] items-center justify-center lg:flex">
      <div className="relative h-[356px] w-full max-w-[33rem]">
        {afterBackgroundPositions.map((pos, index) => {
          const Icon = afterBackgroundIcons[index % afterBackgroundIcons.length];

          return (
            <div
              key={`impact-bg-${index}`}
              className={`absolute ${pos} z-10 flex h-11 w-11 items-center justify-center rounded-[15px] border border-white/8 bg-white/6 opacity-[0.18]`}
            >
              <Icon className="h-4 w-4 text-white/70" />
            </div>
          );
        })}

        <div className="absolute left-1/2 top-1/2 z-20 h-[312px] w-[312px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/16 bg-[radial-gradient(circle,#f7fbff_0%,#eef4fb_52%,rgba(255,255,255,0.06)_72%,rgba(255,255,255,0)_100%)]" />

        <div className="absolute left-1/2 top-1/2 z-30 flex h-[154px] w-[154px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-white text-[#2f3a49] shadow-[0_30px_70px_-28px_rgba(15,23,42,0.18)]">{centerCore}</div>

        {children}
      </div>
    </div>
  );
}

export function AICrewWhyAfterOrbitItem({
  icon: Icon,
  label,
  bubbleClassName,
  chipClassName,
}: {
  icon: LucideIcon;
  label: ReactNode;
  bubbleClassName: string;
  chipClassName?: string;
}) {
  return (
    <div>
      <div
        className={`absolute ${bubbleClassName} z-40 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/90 bg-[#1E293B] shadow-lg`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      {chipClassName ? (
        <div
          className={`absolute ${chipClassName} z-40 whitespace-nowrap rounded-full bg-[#1E293B] px-3 py-1.5 text-[11px] font-medium text-white shadow-lg`}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
}

export function AICrewWhyTaskColumn({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-[1rem] bg-white/14 px-4 py-4 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">{label}</p>
      <div className="mt-3 grid gap-2">{children}</div>
    </div>
  );
}

export function AICrewWhyDesktopTaskColumn({
  label,
  side,
  children,
}: {
  label: ReactNode;
  side: "left" | "right";
  children: ReactNode;
}) {
  return (
    <div
      className={`absolute ${
        side === "left" ? "left-[14px]" : "right-[14px]"
      } top-1/2 z-30 w-[124px] -translate-y-1/2 rounded-[1rem] bg-white/14 px-3 py-4 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">{label}</p>
      <div className="mt-3 grid gap-2">{children}</div>
    </div>
  );
}

export function AICrewWhyTaskItem({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[0.9rem] bg-white/10 px-3 py-2 text-[12px] font-medium text-white">
      {children}
    </div>
  );
}
