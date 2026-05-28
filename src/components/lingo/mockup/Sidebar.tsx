"use client"

import React, { useState, useEffect } from "react"
import {
  CalendarDots,
  ChatsTeardrop,
  GearSix,
  House,
  SidebarSimple,
  SignOut,
  Sparkle,
} from "@phosphor-icons/react"
import { BrandLogo } from "@/components/lingo/mockup/BrandLogo"
import { DropdownMenu } from "@/components/lingo/mockup/ui/DropdownMenu"
import {
  Tooltip,
  TooltipTrigger,
  SidebarTooltipContent,
  TooltipProvider,
} from "@/components/lingo/mockup/ui/tooltip"
import type { Page } from "@/components/lingo/mockup/types"

const isDev = false

interface SidebarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  onLogoClick: () => void
  hasMeetingActive?: boolean
  user?: { name?: string; email?: string; picture?: string }
  onLogout: () => void
  mobileSidebarOpen: boolean
  onMobileClose: () => void
}

const STORAGE_KEY = "lingo-sidebar-collapsed"

function Avatar({
  src,
  name,
  email,
}: {
  src?: string
  name?: string
  email?: string
}) {
  const [imgError, setImgError] = useState(false)

  if (!src || imgError) {
    return (
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
        {(name || email || "?").charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      className="h-7 w-7 flex-shrink-0 rounded-full"
      onError={() => setImgError(true)}
    />
  )
}

export function Sidebar({
  currentPage,
  onNavigate,
  onLogoClick,
  hasMeetingActive,
  user,
  onLogout,
  mobileSidebarOpen,
  onMobileClose,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true"
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed))
    } catch {
      // localStorage unavailable
    }
  }, [collapsed])

  const toggleCollapsed = () => setCollapsed((v) => !v)

  const navItems = [
    {
      id: "meeting-active" as Page,
      label: "Home",
      icon: <House className="h-5 w-5" weight="duotone" />,
      onClick: () => onNavigate("meeting-active"),
    },
    {
      id: "meetings" as Page,
      label: "Meetings",
      icon: <ChatsTeardrop className="h-5 w-5" weight="duotone" />,
      onClick: () => onNavigate("meetings"),
    },
    {
      id: "calendar" as Page,
      label: "Calendar",
      icon: <CalendarDots className="h-5 w-5" weight="duotone" />,
      onClick: () => onNavigate("calendar"),
    },
    {
      id: "customization" as Page,
      label: "Customization",
      icon: <Sparkle className="h-5 w-5" weight="duotone" />,
      onClick: () => onNavigate("customization"),
    },
    {
      id: "settings" as Page,
      label: "Settings",
      icon: <GearSix className="h-5 w-5" weight="duotone" />,
      onClick: () => onNavigate("settings"),
    },
  ]

  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={300}>
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex flex-shrink-0 flex-col border-l border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 sm:relative sm:inset-auto sm:right-auto sm:left-0 sm:z-auto sm:translate-x-0 sm:border-r sm:border-l-0 ${
          mobileSidebarOpen
            ? "translate-x-0"
            : "translate-x-full sm:translate-x-0"
        } ${collapsed ? "w-[220px] sm:w-[60px]" : "w-[220px] sm:w-[220px]"}`}
      >
        {/* Logo / mobile header */}
        <div className="group flex h-14 items-center border-b border-sidebar-border px-3">
          <div
            className={`hidden flex-1 items-center sm:flex ${collapsed ? "justify-center sm:justify-center" : ""}`}
          >
            <div
              className={`relative flex items-center justify-center ${collapsed ? "h-8 w-8" : ""}`}
            >
              <button
                type="button"
                onClick={onLogoClick}
                className={`cursor-pointer transition-opacity ${collapsed ? "group-hover:opacity-0" : ""}`}
              >
                {collapsed ? (
                  <BrandLogo collapsed={collapsed} />
                ) : (
                  <div className="flex items-center gap-0.5">
                    <img
                      src="/lingo/symbol.png"
                      alt=""
                      className="h-5 w-auto shrink-0"
                    />
                    <BrandLogo collapsed={collapsed} />
                  </div>
                )}
              </button>
              {collapsed && (
                <button
                  type="button"
                  onClick={toggleCollapsed}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-md text-muted-foreground opacity-0 transition-[opacity,background-color,color,transform] group-hover:opacity-100 focus-visible:opacity-100 active:scale-95 sm:hover:bg-sidebar-accent sm:hover:text-sidebar-accent-foreground sm:active:scale-100"
                  aria-label="Expand sidebar"
                >
                  <SidebarSimple
                    className="h-[18px] w-[18px] rotate-180"
                    weight="regular"
                  />
                </button>
              )}
            </div>
          </div>
          {!collapsed && (
            <button
              type="button"
              onClick={toggleCollapsed}
              className="hidden min-h-8 min-w-8 cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground transition-[background-color,color,transform] active:scale-95 sm:flex sm:hover:bg-sidebar-accent sm:hover:text-sidebar-accent-foreground sm:active:scale-100"
              aria-label="Collapse sidebar"
            >
              <SidebarSimple className="h-[18px] w-[18px]" weight="regular" />
            </button>
          )}
          {/* Close button — mobile only */}
          <button
            onClick={onMobileClose}
            className="cursor-pointer rounded-lg p-1 text-muted-foreground transition-[background-color,color,transform] active:scale-95 sm:hidden sm:hover:bg-sidebar-accent sm:hover:text-sidebar-accent-foreground sm:active:scale-100"
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="space-y-0.5 p-2 pb-1">
          {navItems.map((item) => {
            const isActive =
              currentPage === item.id ||
              (item.id === "meetings" && currentPage === "meeting-detail") ||
              (item.id === "meeting-active" && currentPage === "meeting-active")

            const button = (
              <button
                onClick={item.onClick}
                aria-label={item.label}
                className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-[background-color,color,transform] active:scale-[0.99] sm:active:scale-100 ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-accent-foreground sm:hover:bg-sidebar-accent sm:hover:text-sidebar-accent-foreground"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span
                  className={`flex flex-1 items-center ${collapsed ? "sm:hidden" : ""}`}
                >
                  <span>{item.label}</span>
                  {item.id === "meeting-active" && hasMeetingActive && (
                    <span className="ml-auto inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                  )}
                </span>
              </button>
            )

            return collapsed ? (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <SidebarTooltipContent>
                  {item.label}
                  {item.id === "meeting-active" &&
                    hasMeetingActive &&
                    " (Live)"}
                </SidebarTooltipContent>
              </Tooltip>
            ) : (
              <React.Fragment key={item.id}>{button}</React.Fragment>
            )
          })}
        </nav>

        {/* Dev tools — only visible in development mode */}
        {isDev && (
          <div className="space-y-0.5 border-t border-dashed border-border p-2">
            <button
              onClick={() => onNavigate("dashboard")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                currentPage === "dashboard"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              } ${collapsed ? "sm:justify-center" : ""}`}
              title="Dev: Calendar Dashboard"
            >
              <CalendarDots
                className="h-4 w-4 flex-shrink-0"
                weight="duotone"
              />
              <span className={collapsed ? "sm:hidden" : ""}>Dashboard</span>
            </button>
            <button
              onClick={() => onNavigate("dev-audio")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                currentPage === "dev-audio"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              } ${collapsed ? "sm:justify-center" : ""}`}
              title="Dev: Audio Enhancement Test"
            >
              <span className="flex-shrink-0 text-base">🔬</span>
              <span className={collapsed ? "sm:hidden" : ""}>Audio Dev</span>
            </button>
          </div>
        )}

        {/* User menu */}
        <div className="mt-auto p-2">
          <div
            className={`flex gap-2 ${collapsed ? "items-center sm:flex-col" : "items-center"}`}
          >
            {user && (
              <DropdownMenu
                className={`relative ${collapsed ? "flex-1 sm:flex-none" : "flex-1"} min-w-0`}
                menuClassName={`absolute bottom-full z-20 mb-2 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg ${
                  collapsed
                    ? "left-0 right-0 sm:right-auto sm:w-44"
                    : "left-0 right-0"
                }`}
                trigger={({ toggle }) => (
                  <button
                    type="button"
                    onClick={toggle}
                    title={user.name ?? user.email}
                    className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-[background-color,color,transform] active:scale-[0.99] sm:hover:bg-sidebar-accent sm:hover:text-sidebar-accent-foreground sm:active:scale-100 ${
                      collapsed ? "sm:justify-center" : ""
                    }`}
                  >
                    <Avatar
                      key={user?.picture}
                      src={user?.picture}
                      name={user?.name}
                      email={user?.email}
                    />
                    <div
                      className={`min-w-0 flex-1 text-left ${collapsed ? "sm:hidden" : ""}`}
                    >
                      <div className="truncate text-sm text-sidebar-foreground">
                        {user.name ?? user.email}
                      </div>
                    </div>
                  </button>
                )}
              >
                {({ close }) => (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        close()
                        onLogout()
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-[background-color,color,transform] active:scale-[0.99] sm:hover:bg-accent sm:hover:text-accent-foreground sm:active:scale-100"
                    >
                      <SignOut className="h-4 w-4" weight="regular" />
                      <span>Log out</span>
                    </button>
                  </>
                )}
              </DropdownMenu>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
