"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import type { Page } from "@/components/lingo/mockup/types"
import { OrganizationProvider } from "@/components/lingo/mockup/contexts/OrganizationContext"
import { ToastProvider } from "@/components/lingo/mockup/ui/Toast"
import { TooltipProvider } from "@/components/lingo/mockup/ui/tooltip"
import { Sidebar } from "@/components/lingo/mockup/Sidebar"
import { BrandLogo } from "@/components/lingo/mockup/BrandLogo"
import { HomePage } from "@/components/lingo/mockup/pages/HomePage"
import { SessionPage } from "@/components/lingo/mockup/pages/SessionPage"
import { HistoryPage } from "@/components/lingo/mockup/pages/HistoryPage"
import { MeetingDetailPage } from "@/components/lingo/mockup/pages/MeetingDetailPage"
import { CalendarPage } from "@/components/lingo/mockup/pages/CalendarPage"
import { SettingsPage } from "@/components/lingo/mockup/pages/SettingsPage"
import { CustomizationPage } from "@/components/lingo/mockup/pages/CustomizationPage"
import { InPersonMeetingModal } from "@/components/lingo/mockup/InPersonMeetingModal"
import { RemoteMeetingModal } from "@/components/lingo/mockup/RemoteMeetingModal"
import { AudioUploadModal } from "@/components/lingo/mockup/AudioUploadModal"

// ── HeroMockup 외관 프레임 CSS 변수 ───────────────────────────────

const MOCKUP_CSS_VARS: Record<string, string> = {
  "--background": "oklch(1 0 0)",
  "--foreground": "oklch(0.145 0 0)",
  "--card": "oklch(1 0 0)",
  "--card-foreground": "oklch(0.145 0 0)",
  "--primary": "oklch(0.205 0 0)",
  "--primary-foreground": "oklch(0.985 0 0)",
  "--brand": "hsl(24.6 88% 48%)",
  "--brand-foreground": "hsl(0 0% 100%)",
  "--secondary": "oklch(0.97 0 0)",
  "--secondary-foreground": "oklch(0.205 0 0)",
  "--muted": "oklch(0.97 0 0)",
  "--muted-foreground": "oklch(0.556 0 0)",
  "--accent": "oklch(0.97 0 0)",
  "--accent-foreground": "oklch(0.205 0 0)",
  "--destructive": "oklch(0.577 0.245 27.325)",
  "--destructive-foreground": "hsl(0 0% 98%)",
  "--success": "hsl(142 71% 45%)",
  "--success-foreground": "hsl(0 0% 100%)",
  "--border": "oklch(0.922 0 0)",
  "--input": "oklch(0.922 0 0)",
  "--ring": "oklch(0.708 0 0)",
  "--sidebar": "oklch(0.985 0 0)",
  "--sidebar-foreground": "oklch(0.145 0 0)",
  "--sidebar-accent": "oklch(0.97 0 0)",
  "--sidebar-accent-foreground": "oklch(0.205 0 0)",
  "--sidebar-border": "oklch(0.922 0 0)",
  "--inverse-foreground": "hsl(0 0% 100%)",
  "--primary-soft": "hsl(0 0% 96.1%)",
  "--primary-soft-foreground": "hsl(0 0% 20%)",
  "--primary-soft-border": "hsl(0 0% 86%)",
  "--radius": "0.625rem",
}

// ── Props ────────────────────────────────────────────────────

interface MockupShellProps {
  initialPage?: Page
  initialSessionId?: string | null
  initialIsSessionRunning?: boolean
  autoPauseAfterMs?: number
  className?: string
}

export function MockupShell({
  initialPage = "meeting-active",
  initialSessionId = null,
  initialIsSessionRunning = false,
  autoPauseAfterMs = 30000,
  className,
}: MockupShellProps) {
  const [currentPage, setCurrentPage] = useState<Page>(initialPage)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    initialSessionId
  )
  const [isSessionRunning, setIsSessionRunning] = useState(initialIsSessionRunning)
  const [isPreviewPaused, setIsPreviewPaused] = useState(false)
  const pauseTimerRef = useRef<number | null>(null)

  // 모바일 사이드바(드로어) 열림 상태
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // 모달 열림 상태
  const [inPersonModalOpen, setInPersonModalOpen] = useState(false)
  const [remoteModalOpen, setRemoteModalOpen] = useState(false)
  const [audioUploadModalOpen, setAudioUploadModalOpen] = useState(false)

  // ── 네비게이션 핸들러 ─────────────────────────────────────────

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page)
    setMobileSidebarOpen(false)
  }, [])

  const handleSelectSession = useCallback((sessionId: string) => {
    setSelectedSessionId(sessionId)
    setCurrentPage("meeting-detail")
  }, [])

  const handleBackFromDetail = useCallback(() => {
    setSelectedSessionId(null)
    setCurrentPage("meetings")
  }, [])

  const handleSessionEnd = useCallback(() => {
    setIsSessionRunning(false)
    setIsPreviewPaused(false)
    setCurrentPage("meeting-active")
  }, [])

  const handleOpenOngoing = useCallback((sessionId: string) => {
    setSelectedSessionId(sessionId)
    setIsSessionRunning(true)
    setIsPreviewPaused(false)
    setCurrentPage("meeting-active")
  }, [])

  // ── 모달 시작 핸들러 ─────────────────────────────────────────

  const handleInPersonStart = useCallback(() => {
    setInPersonModalOpen(false)
    setIsSessionRunning(true)
    setIsPreviewPaused(false)
    setCurrentPage("meeting-active")
  }, [])

  const handleRemoteStart = useCallback(() => {
    setRemoteModalOpen(false)
    setIsSessionRunning(true)
    setIsPreviewPaused(false)
    setCurrentPage("meeting-active")
  }, [])

  const clearAutoPauseTimer = useCallback(() => {
    if (pauseTimerRef.current === null) return
    window.clearTimeout(pauseTimerRef.current)
    pauseTimerRef.current = null
  }, [])

  const scheduleAutoPause = useCallback(() => {
    clearAutoPauseTimer()
    if (!isSessionRunning || currentPage !== "meeting-active") return

    pauseTimerRef.current = window.setTimeout(() => {
      setIsPreviewPaused(true)
    }, autoPauseAfterMs)
  }, [autoPauseAfterMs, clearAutoPauseTimer, currentPage, isSessionRunning])

  const handlePreviewActivity = useCallback(() => {
    if (!isSessionRunning || currentPage !== "meeting-active") return
    setIsPreviewPaused(false)
    scheduleAutoPause()
  }, [currentPage, isSessionRunning, scheduleAutoPause])

  useEffect(() => {
    scheduleAutoPause()
    return clearAutoPauseTimer
  }, [clearAutoPauseTimer, scheduleAutoPause])

  // ── 페이지 렌더링 ────────────────────────────────────────────

  const renderPage = () => {
    switch (currentPage) {
      case "meetings":
        return (
          <HistoryPage
            onSelectSession={handleSelectSession}
            onRejoinSession={() => {
              setIsSessionRunning(true)
              setCurrentPage("meeting-active")
            }}
            onResumeScheduled={() => {
              setIsSessionRunning(true)
              setCurrentPage("meeting-active")
            }}
          />
        )
      case "meeting-detail":
        return selectedSessionId ? (
          <MeetingDetailPage
            sessionId={selectedSessionId}
            onBack={handleBackFromDetail}
            onRejoinSession={() => {
              setIsSessionRunning(true)
              setCurrentPage("meeting-active")
            }}
            onNavigate={handleNavigate}
          />
        ) : (
          <HistoryPage
            onSelectSession={handleSelectSession}
            onRejoinSession={() => {
              setIsSessionRunning(true)
              setCurrentPage("meeting-active")
            }}
            onResumeScheduled={() => {
              setIsSessionRunning(true)
              setCurrentPage("meeting-active")
            }}
          />
        )
      case "meeting-active":
        return isSessionRunning ? (
          <SessionPage
            previewPaused={isPreviewPaused}
            onEnd={handleSessionEnd}
            onNavigate={handleNavigate}
          />
        ) : (
          <HomePage
            onStartInPerson={() => setInPersonModalOpen(true)}
            onStartRemote={() => setRemoteModalOpen(true)}
            onOpenOngoing={handleOpenOngoing}
          />
        )
      case "calendar":
        return <CalendarPage onNavigate={handleNavigate} />
      case "settings":
        return <SettingsPage />
      case "customization":
        return <CustomizationPage />
      default:
        return (
          <HomePage
            onStartInPerson={() => setInPersonModalOpen(true)}
            onStartRemote={() => setRemoteModalOpen(true)}
            onOpenOngoing={handleOpenOngoing}
          />
        )
    }
  }

  return (
    <OrganizationProvider>
      <ToastProvider>
        <TooltipProvider>
          <div
            data-mockup
            onPointerEnter={handlePreviewActivity}
            onPointerMove={handlePreviewActivity}
            onFocusCapture={handlePreviewActivity}
            className={`dark mockup-reveal w-full max-w-[1080px] px-4 md:px-0 ${className ?? ""}`}
            style={MOCKUP_CSS_VARS}
          >
            <div
              className="relative flex h-[640px] flex-col overflow-hidden rounded-xl border shadow-2xl md:h-[720px]"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                fontFamily:
                  "'Geist Variable', 'Pretendard', system-ui, sans-serif",
              }}
            >
              {/* 모바일 상단바 — sm 미만에서만 표시 */}
              <div
                className="flex h-14 shrink-0 items-center justify-between border-b px-4 sm:hidden"
                style={{ borderColor: "var(--border)" }}
              >
                <button
                  type="button"
                  onClick={() => handleNavigate("meeting-active")}
                  className="flex cursor-pointer items-center gap-0.5"
                >
                  <img src="/lingo/symbol.png" alt="" className="h-5 w-auto shrink-0" />
                  <BrandLogo />
                </button>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(true)}
                  aria-label="Open menu"
                  className="ml-2 cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="flex min-h-0 flex-1">
                <Sidebar
                  currentPage={currentPage}
                  onNavigate={handleNavigate}
                  onLogoClick={() => handleNavigate("meeting-active")}
                  hasMeetingActive={
                    isSessionRunning && currentPage === "meeting-active"
                  }
                  onLogout={() => {}}
                  mobileSidebarOpen={mobileSidebarOpen}
                  onMobileClose={() => setMobileSidebarOpen(false)}
                />

                <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                  {renderPage()}
                </main>
              </div>

              {/* 모바일 드로어 백드롭 */}
              {mobileSidebarOpen && (
                <div
                  className="absolute inset-0 z-40 bg-black/40 sm:hidden"
                  onClick={() => setMobileSidebarOpen(false)}
                  aria-hidden="true"
                />
              )}
            </div>
          </div>

          <InPersonMeetingModal
            open={inPersonModalOpen}
            onClose={() => setInPersonModalOpen(false)}
            onStart={handleInPersonStart}
          />
          <RemoteMeetingModal
            open={remoteModalOpen}
            onClose={() => setRemoteModalOpen(false)}
            onStart={handleRemoteStart}
            onManualCreate={handleRemoteStart}
          />
          <AudioUploadModal
            open={audioUploadModalOpen}
            onClose={() => setAudioUploadModalOpen(false)}
          />

          {/* ShareModal 상태는 상위에서 관리하며 각 페이지 내부에서 독립적으로 렌더링됨 */}
        </TooltipProvider>
      </ToastProvider>
    </OrganizationProvider>
  )
}
