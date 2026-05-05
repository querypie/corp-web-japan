"use client";

import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { Blocks, Brain, ChartColumnIncreasing, FileSearch, Play, Search, Wallet, X } from "lucide-react";
import { RevealOnScroll } from "@/components/sections/reveal-on-scroll";

const useCaseIcons = {
  search: Search,
  wallet: Wallet,
  brain: Brain,
  chart: ChartColumnIncreasing,
  file: FileSearch,
  blocks: Blocks,
} as const;

type UseCaseIconName = keyof typeof useCaseIcons;

type AICrewUseCasesVideoContextValue = {
  openVideo: (href: string) => void;
};

const AICrewUseCasesVideoContext = createContext<AICrewUseCasesVideoContextValue | null>(null);

function useAICrewUseCasesVideo() {
  const context = useContext(AICrewUseCasesVideoContext);

  if (!context) {
    throw new Error("AICrew use-case card components must be rendered inside AICrewUseCasesSection.");
  }

  return context;
}

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|v=)([^?&/]+)/);
  return match?.[1] ?? "";
}

function getYouTubeThumbnail(url: string) {
  const videoId = getYouTubeId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
}

function getYouTubeEmbed(url: string) {
  const videoId = getYouTubeId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : "";
}

function UseCaseCardChrome({
  icon,
  category,
  title,
  body,
  detailHref,
  videoHref,
  delayMs = 0,
}: {
  icon: UseCaseIconName;
  category: ReactNode;
  title: ReactNode;
  body: ReactNode;
  detailHref: string;
  videoHref: string;
  delayMs?: number;
}) {
  const Icon = useCaseIcons[icon];
  const { openVideo } = useAICrewUseCasesVideo();
  const thumbnail = getYouTubeThumbnail(videoHref);

  return (
    <RevealOnScroll delayMs={delayMs}>
      <article
        role="button"
        tabIndex={0}
        aria-label={`${typeof title === "string" ? title : "活用事例"} の動画を見る`}
        onClick={() => openVideo(videoHref)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openVideo(videoHref);
          }
        }}
        className="relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.14)] transition hover:-translate-y-1 hover:shadow-[0_28px_90px_-52px_rgba(15,23,42,0.18)] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/35 lg:p-7"
      >
        <div className="group block overflow-hidden rounded-[1.25rem] text-left">
          <div
            className="relative aspect-[16/9] overflow-hidden rounded-[1.25rem] bg-[#2f3a49] bg-cover bg-center"
            style={thumbnail ? { backgroundImage: `linear-gradient(rgba(15,23,42,0.34),rgba(15,23,42,0.34)), url(${thumbnail})` } : undefined}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/92 text-[#2f3a49] shadow-lg transition group-hover:scale-105">
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#eef1f4] text-[#2f3a49]">
            <Icon className="h-5 w-5" />
          </div>
          <div className="inline-flex rounded-full border border-black/6 bg-white px-3 py-1 text-[12px] font-semibold text-slate-600">
            {category}
          </div>
        </div>

        <h3 className="mt-5 text-pretty text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-slate-800">
          {title}
        </h3>
        <div className="mt-3 text-[15px] leading-[1.85] text-slate-600">{body}</div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <a
            href={detailHref}
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#475467] transition hover:text-[#101828]"
          >
            詳しく見る
          </a>
        </div>
      </article>
    </RevealOnScroll>
  );
}

export function AICrewUseCasesSection({ children }: { children: ReactNode }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    if (!activeVideo) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveVideo(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [activeVideo]);

  return (
    <AICrewUseCasesVideoContext.Provider value={{ openVideo: setActiveVideo }}>
      <section id="use-cases" className="mx-auto max-w-[1920px] bg-white px-6 py-20 lg:px-10">
        {children}
      </section>

      {activeVideo ? (
        <div className="fixed inset-0 z-[1200] bg-black/70 px-4 py-10 backdrop-blur-sm" onClick={() => setActiveVideo(null)}>
          <div className="mx-auto flex h-full max-w-[960px] items-center justify-center" onClick={(event) => event.stopPropagation()}>
            <div className="relative w-full overflow-hidden rounded-[1.5rem] bg-black shadow-[0_32px_90px_-40px_rgba(0,0,0,0.65)]">
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/75"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="aspect-video">
                <iframe
                  src={getYouTubeEmbed(activeVideo)}
                  title="Use case demo video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AICrewUseCasesVideoContext.Provider>
  );
}

export function AICrewUseCasesIntro({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[1120px] text-center">{children}</div>;
}

export function AICrewUseCasesTitle({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll>
      <h2 className="text-[34px] font-semibold leading-[1.24] tracking-[-0.03em] text-slate-950 sm:text-[42px] sm:leading-[54px] sm:tracking-[-0.04em]">
        {children}
      </h2>
    </RevealOnScroll>
  );
}

export function AICrewUseCasesBody({ children }: { children: ReactNode }) {
  return (
    <RevealOnScroll delayMs={80}>
      <p className="mx-auto mt-5 w-full max-w-[860px] whitespace-pre-line text-left text-base leading-7 text-slate-500 lg:pl-[42px]">
        {children}
      </p>
    </RevealOnScroll>
  );
}

export function AICrewUseCasesGrid({ children }: { children: ReactNode }) {
  return <div className="relative mx-auto mt-10 grid max-w-[980px] gap-4 md:grid-cols-2">{children}</div>;
}

export function AICrewUseCaseCardCategory({ children }: { children: ReactNode; slot: AICrewUseCaseCardSlot }) {
  return <>{children}</>;
}

export function AICrewUseCaseCardTitle({ children }: { children: ReactNode; slot: AICrewUseCaseCardSlot }) {
  return <>{children}</>;
}

export function AICrewUseCaseCardBody({ children }: { children: ReactNode; slot: AICrewUseCaseCardSlot }) {
  return <>{children}</>;
}

function isCardSlotElement(node: ReactNode): node is ReactElement<AICrewUseCaseCardSlotProps> {
  return (
    isValidElement<AICrewUseCaseCardSlotProps>(node) &&
    typeof node.props === "object" &&
    node.props !== null &&
    typeof node.props.slot === "string"
  );
}

function readCardContent(children: ReactNode) {
  let category: ReactNode = null;
  let title: ReactNode = null;
  let body: ReactNode = null;

  for (const child of Children.toArray(children)) {
    if (!isCardSlotElement(child)) {
      continue;
    }

    if (child.props.slot === "card-category") {
      category = child.props.children;
      continue;
    }

    if (child.props.slot === "card-title") {
      title = child.props.children;
      continue;
    }

    if (child.props.slot === "card-body") {
      body = child.props.children;
    }
  }

  return { category, title, body };
}

export function AICrewUseCaseCard({
  children,
  detailHref,
  icon,
  videoHref,
  delayMs = 0,
}: {
  children: ReactNode;
  detailHref: string;
  icon: UseCaseIconName;
  videoHref: string;
  delayMs?: number;
}) {
  const { category, title, body } = readCardContent(children);

  return (
    <UseCaseCardChrome
      body={body}
      category={category}
      delayMs={delayMs}
      detailHref={detailHref}
      icon={icon}
      title={title}
      videoHref={videoHref}
    />
  );
}

type AICrewUseCaseCardSlot = "card-category" | "card-title" | "card-body";

type AICrewUseCaseCardSlotProps = {
  children: ReactNode;
  slot: AICrewUseCaseCardSlot;
};

type AICrewUseCaseTabProps = {
  children: ReactNode;
  detailHref: string;
  label: string;
  videoHref: string;
};

export function AICrewUseCaseTab(_props: AICrewUseCaseTabProps) {
  void _props;
  return null;
}

function isUseCaseTabElement(node: ReactNode): node is ReactElement<AICrewUseCaseTabProps> {
  return (
    isValidElement<AICrewUseCaseTabProps>(node) &&
    typeof node.props === "object" &&
    node.props !== null &&
    typeof node.props.label === "string" &&
    typeof node.props.detailHref === "string" &&
    typeof node.props.videoHref === "string"
  );
}

function getUseCaseTabs(children: ReactNode) {
  return Children.toArray(children).filter(isUseCaseTabElement);
}

export function AICrewUseCaseTabbedCard({
  children,
  icon,
  delayMs = 0,
}: {
  children: ReactNode;
  icon: UseCaseIconName;
  delayMs?: number;
}) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabs = useMemo(() => getUseCaseTabs(children), [children]);
  const { category, title, body } = readCardContent(children);
  const activeTab = tabs[activeTabIndex] ?? tabs[0];

  return (
    <UseCaseCardChrome
      body={
        <>
          {activeTab ? <div>{activeTab.props.children}</div> : body ? <div>{body}</div> : null}
          {tabs.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {tabs.map((tab, tabIndex) => (
                <button
                  key={tab.props.label}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveTabIndex(tabIndex);
                  }}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                    activeTabIndex === tabIndex
                      ? "bg-[#2f3a49] text-white"
                      : "border border-black/6 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab.props.label}
                </button>
              ))}
            </div>
          ) : null}
        </>
      }
      category={category}
      delayMs={delayMs}
      detailHref={activeTab?.props.detailHref ?? ""}
      icon={icon}
      title={title}
      videoHref={activeTab?.props.videoHref ?? ""}
    />
  );
}

const aiCrewPrimaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#0F2A5F_0%,#174EA6_52%,#2563EB_100%)] px-5 py-3 text-base font-semibold text-white shadow-[0_22px_46px_-24px_rgba(23,78,166,0.72)] transition hover:brightness-[1.06] hover:shadow-[0_26px_58px_-26px_rgba(23,78,166,0.82)]";

const aiCrewSecondaryButtonClass =
  "inline-flex items-center justify-center rounded-[12px] border border-[#C9D8F5] bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF4FF_100%)] px-5 py-3 text-base font-semibold text-[#163A7A] shadow-[0_18px_40px_-30px_rgba(15,42,95,0.34)] transition hover:border-[#B7CCEF] hover:bg-[linear-gradient(180deg,#FAFCFF_0%,#E8F0FF_100%)]";

export function AICrewUseCasesFooter({ children }: { children: ReactNode }) {
  return <div className="mx-auto mt-10 max-w-[1120px] text-center">{children}</div>;
}

export function AICrewUseCasesNote({ children }: { children: ReactNode }) {
  return <p className="mx-auto max-w-[860px] text-[15px] leading-7 text-slate-600">{children}</p>;
}

export function AICrewUseCasesActions({ children }: { children: ReactNode }) {
  return <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">{children}</div>;
}

export function AICrewUseCasesPrimaryAction({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a href={href} className={aiCrewPrimaryButtonClass}>
      {children}
    </a>
  );
}

export function AICrewUseCasesSecondaryAction({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a href={href} className={aiCrewSecondaryButtonClass}>
      {children}
    </a>
  );
}
