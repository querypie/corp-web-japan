"use client"

import Image from "next/image"
import {
  ArrowRight,
  Bot,
  Network,
  PlayCircle,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import { useLocale } from "@/lib/lingo/intl"
import { SubHeroSection } from "@/components/sections/lingo/SubHeroSection"
import { CTASection } from "@/components/sections/lingo/CTASection"
import { Footer } from "@/components/layout/lingo/Footer"
import { Container } from "@/components/layout/lingo/Container"
import { getLocaleCopy } from "@/lib/lingo/locale-copy"

const aipIcons: Record<string, LucideIcon> = {
  usage: Bot,
  mcp: Network,
  operations: ShieldCheck,
}

const serviceLogos: Record<string, string> = {
  googleCalendar: "/lingo/images/integrations/google-calendar.svg",
  outlook: "/lingo/images/integrations/microsoft-outlook.svg",
  zoom: "/lingo/images/integrations/zoom.svg",
  googleMeet: "/lingo/images/integrations/google-meet.svg",
  teams: "/lingo/images/integrations/microsoft-teams.svg",
  slack: "/lingo/images/integrations/slack.svg",
}

function ServiceLogo({ id, title }: { id: string; title: string }) {
  const logoSrc = serviceLogos[id]

  if (logoSrc) {
    return (
      <Image
        src={logoSrc}
        alt=""
        width={32}
        height={32}
        unoptimized
        className="size-8 object-contain"
        aria-hidden="true"
      />
    )
  }

  return (
    <span className="text-[16px] font-semibold leading-[24px] text-[var(--brand)]">
      {title.slice(0, 1)}
    </span>
  )
}

const integrationsCopy = {
  ko: {
    heroTitle: ["회의 기록을", "업무 자산으로 바꾸세요."],
    heroDescription: [
      "회의 내용은 저장에서 끝나지 않습니다.",
      "캘린더, 협업 도구, AI 워크플로우까지 자연스럽게 이어집니다.",
    ],
    core: "핵심 연동",
    aipDescription: [
      "Lingo의 회의 기록은 AIP와 연결되어 더욱 강력한 업무 자산이 됩니다.",
      "다양한 MCP와 AI 에이전트를 통해 회의 데이터를 자동화와 실행으로 확장하세요.",
    ],
    videoLabel: "QueryPie AIP 영상 보기",
    aipCta: "QueryPie AIP 알아보기",
    integrationsTitle: "Integrations",
    aipHighlights: [
      {
        id: "usage",
        title: "회의 기록을 업무 도구로 전달",
        description: "MCP를 통해 Lingo 회의 기록과 요약을 Salesforce, Slack 등으로 자연스럽게 보낼 수 있습니다.",
      },
      {
        id: "mcp",
        title: "액션 아이템을 바로 실행",
        description: "회의에서 나온 할 일을 JIRA 이슈로 만들고, 담당 업무가 실행 흐름까지 이어지도록 연결합니다.",
      },
      {
        id: "operations",
        title: "내 업무지식 비서로 확장",
        description: "AI 에이전트가 회의 맥락과 업무 지식을 함께 이해해 필요한 내용을 묻고 찾아볼 수 있도록 돕습니다.",
      },
    ],
    integrations: [
      {
        id: "googleCalendar",
        title: "Google Calendar",
        description: "Google Calendar 일정과 동기화하고 예정된 회의에 자동 참여합니다.",
      },
      {
        id: "outlook",
        title: "Microsoft Outlook",
        description: "Outlook 캘린더를 연결해 회의를 감지하고 자연스럽게 참여합니다.",
      },
      {
        id: "zoom",
        title: "Zoom",
        description: "Zoom 회의에 자동 참여해 대화를 실시간으로 기록합니다.",
      },
      {
        id: "googleMeet",
        title: "Google Meet",
        description: "Google Meet 통화의 전사와 번역을 자연스럽게 지원합니다.",
      },
      {
        id: "teams",
        title: "Microsoft Teams",
        description: "Teams 회의 기록과 AI 노트 생성을 지원합니다.",
      },
      {
        id: "slack",
        title: "Slack",
        description: "회의 요약과 액션 아이템을 Slack 채널로 공유합니다.",
      },
    ],
  },
  en: {
    heroTitle: ["Turn meeting records", "into work assets."],
    heroDescription: [
      "Meeting content does not end at storage.",
      "It naturally extends into calendars, collaboration tools, and AI workflows.",
    ],
    core: "Core integration",
    aipDescription: [
      "Lingo meeting records connect with AIP to become more powerful work assets.",
      "Extend meeting data into automation and execution through MCPs and AI agents.",
    ],
    videoLabel: "Watch QueryPie AIP video",
    aipCta: "Explore QueryPie AIP",
    integrationsTitle: "Integrations",
    aipHighlights: [
      {
        id: "usage",
        title: "Send meeting records to work tools",
        description: "Use MCP to send Lingo meeting records and summaries into Salesforce, Slack, and other tools.",
      },
      {
        id: "mcp",
        title: "Turn action items into execution",
        description: "Create JIRA issues from meeting action items and connect assigned work directly to the next workflow.",
      },
      {
        id: "operations",
        title: "Extend into a work knowledge assistant",
        description: "AI agents understand meeting context together with work knowledge, so you can ask for what you need later.",
      },
    ],
    integrations: [
      {
        id: "googleCalendar",
        title: "Google Calendar",
        description: "Sync events and auto-join meetings scheduled on Google Calendar.",
      },
      {
        id: "outlook",
        title: "Microsoft Outlook",
        description: "Connect Outlook calendars for seamless meeting detection and entry.",
      },
      {
        id: "zoom",
        title: "Zoom",
        description: "Join Zoom meetings automatically and capture conversations in real time.",
      },
      {
        id: "googleMeet",
        title: "Google Meet",
        description: "Works natively with Google Meet to transcribe and translate calls.",
      },
      {
        id: "teams",
        title: "Microsoft Teams",
        description: "Integrates with Teams for complete meeting coverage and note-taking.",
      },
      {
        id: "slack",
        title: "Slack",
        description: "Send meeting summaries and action items directly to Slack channels.",
      },
    ],
  },
  ja: {
    heroTitle: ["会議記録を", "業務資産に変えましょう。"],
    heroDescription: [
      "会議内容は保存だけで終わりません。",
      "カレンダー、コラボレーションツール、AIワークフローまで自然につながります。",
    ],
    core: "主要連携",
    aipDescription: [
      "Lingoの会議記録はAIPと連携し、より強力な業務資産になります。",
      "さまざまなMCPとAIエージェントを通じて、会議データを自動化と実行へ拡張できます。",
    ],
    videoLabel: "QueryPie AIPの動画を見る",
    aipCta: "QueryPie AIPを見る",
    integrationsTitle: "Integrations",
    aipHighlights: [
      {
        id: "usage",
        title: "会議記録を業務ツールへ連携",
        description: "MCPを通じてLingoの会議記録や要約をSalesforce、Slackなどへ自然に送れます。",
      },
      {
        id: "mcp",
        title: "アクションアイテムを実行へ接続",
        description: "会議で生まれたタスクをJIRA課題にし、担当業務を次のワークフローへつなげます。",
      },
      {
        id: "operations",
        title: "業務知識アシスタントへ拡張",
        description: "AIエージェントが会議の文脈と業務知識をあわせて理解し、必要な情報をあとから質問・確認できます。",
      },
    ],
    integrations: [
      {
        id: "googleCalendar",
        title: "Google Calendar",
        description: "Google Calendarの予定と同期し、予定された会議に自動参加します。",
      },
      {
        id: "outlook",
        title: "Microsoft Outlook",
        description: "Outlookカレンダーを接続し、会議検知と参加をスムーズにします。",
      },
      {
        id: "zoom",
        title: "Zoom",
        description: "Zoom会議に自動参加し、会話をリアルタイムで記録します。",
      },
      {
        id: "googleMeet",
        title: "Google Meet",
        description: "Google Meetの通話を自然に文字起こし・翻訳します。",
      },
      {
        id: "teams",
        title: "Microsoft Teams",
        description: "Teams会議の記録とAIノート作成を支援します。",
      },
      {
        id: "slack",
        title: "Slack",
        description: "会議要約とアクションアイテムをSlackチャンネルに共有します。",
      },
    ],
  },
}

const aipVideoThumb =
  "https://jbxeeb6ybylgemuz.public.blob.vercel-storage.com/main/public/aip/aip-video-thumb-xakPEZ1G0nxjKAUgm96n2Rlh7wNdz2.png"

function getAipUrl(locale: string) {
  if (locale === "ko") {
    return "/platforms/aip"
  }

  if (locale === "ja") {
    return "/platforms/aip"
  }

  return "/platforms/aip"
}

export default function IntegrationsPage() {
  const locale = useLocale()
  const aipUrl = getAipUrl(locale)
  const copy = getLocaleCopy(locale, integrationsCopy)

  return (
    <main className="min-h-screen bg-[var(--bg)] page-layout-sub">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[200px] overflow-hidden">
        <Image
          src="/lingo/images/bg-home.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </div>

      <div className="w-full page-gutter">
        <div className="container-main relative z-10 w-full">
          <SubHeroSection
            title={
              <>
                {copy.heroTitle[0]}
                <br />
                {copy.heroTitle[1]}
              </>
            }
            description={
              <>
                {copy.heroDescription[0]}
                <br />
                {copy.heroDescription[1]}
              </>
            }
            descriptionClassName="text-[16px] leading-[24px]"
          />
        </div>
      </div>

      {/* AIP 핵심 연동 */}
      <Container className="section-gap">
        <section className="flex flex-col gap-8 md:gap-10">
          <div className="mx-auto flex max-w-[860px] flex-col items-center gap-4 text-center">
            <p className="text-[16px] font-semibold leading-[24px] text-[var(--brand)]">
              {copy.core}
            </p>
            <h2 className="text-h1 text-[var(--fg)]">
              QueryPie AI Platform (AIP)
            </h2>
            <p className="body-md text-[var(--mute)]">
              {copy.aipDescription[0]}
              <br />
              {copy.aipDescription[1]}
            </p>
          </div>

          <a
            href={aipUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={copy.videoLabel}
            className="group relative isolate aspect-video w-full overflow-hidden rounded-[var(--corner-box)] bg-[var(--card)]"
          >
            <Image
              src={aipVideoThumb}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 1024px) 1000px, 100vw"
              className="-z-10 object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-black/10 transition-colors group-hover:bg-black/20" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-[var(--white)] text-[var(--brand)] shadow-[var(--shadow-popover)] transition-transform group-hover:scale-105">
                <PlayCircle className="size-8" aria-hidden="true" />
              </span>
            </span>
          </a>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {copy.aipHighlights.map((item) => {
              const Icon = aipIcons[item.id]

              return (
                <div
                  key={item.title}
                  className="grid grid-cols-[auto_1fr] gap-3 rounded-[var(--corner-box)] bg-[var(--card)] p-5"
                >
                  <span className="flex size-10 items-center justify-center rounded-[14px] border border-[var(--border)] bg-[var(--white)] text-[var(--brand)]">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="body-md font-semibold text-[var(--fg)]">
                      {item.title}
                    </h3>
                    <p className="text-[16px] leading-[24px] text-[var(--mute)]">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <a
            href={aipUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto inline-flex items-center gap-2 text-[16px] leading-[24px] text-[var(--fg)] transition-opacity hover:opacity-70"
          >
            {copy.aipCta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </section>
      </Container>

      {/* 연동 목록 섹션 */}
      <Container className="section-gap">
        <h2 className="text-h2 mb-5 text-[var(--fg)]">
          {copy.integrationsTitle}
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {copy.integrations.map((card) => {
            return (
              <div
                key={card.title}
                className="flex min-h-[210px] flex-col gap-5 rounded-[var(--corner-box)] bg-[var(--card)] p-[30px]"
              >
                <span className="flex size-12 items-center justify-center rounded-[16px] border border-[var(--border)] bg-[var(--white)] shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
                  <ServiceLogo id={card.id} title={card.title} />
                </span>
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-h3 text-[var(--fg)]">{card.title}</h3>
                  <p className="body-md text-[var(--fg)]">{card.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Container>

      <div className="section-gap">
        <CTASection />
      </div>
      <div className="section-gap"><Footer /></div>
    </main>
  )
}
