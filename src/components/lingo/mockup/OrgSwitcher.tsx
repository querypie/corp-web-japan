"use client"

/**
 * @deprecated This component is currently unused. The org switcher UI was removed
 * from the sidebar. Keep this file for potential future re-integration.
 */
import { CaretDown, Check } from "@phosphor-icons/react"
import { useOrganizationContext } from "@/components/lingo/mockup/contexts/OrganizationContext"
import { DropdownMenu } from "@/components/lingo/mockup/ui/DropdownMenu"

const ORG_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#f97316",
  "#6366f1",
  "#14b8a6",
]

function orgColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return ORG_COLORS[Math.abs(hash) % ORG_COLORS.length]
}

function OrgIcon({ name, size = 28 }: { name: string; size?: number }) {
  const bg = orgColor(name)
  const initial = (name[0] ?? "?").toUpperCase()
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white"
      style={{ backgroundColor: bg, width: size, height: size }}
    >
      {initial}
    </div>
  )
}

interface OrgSwitcherProps {
  collapsed?: boolean
}

export function OrgSwitcher({ collapsed }: OrgSwitcherProps) {
  const { organizations, currentOrg, switchOrg } = useOrganizationContext()

  if (!currentOrg) return null

  return (
    <DropdownMenu
      className="relative w-full"
      menuClassName="absolute top-full left-0 z-20 mt-1 w-56 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg"
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 transition-[background-color,color,transform] active:scale-[0.99] sm:hover:bg-sidebar-accent sm:hover:text-sidebar-accent-foreground sm:active:scale-100 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <OrgIcon name={currentOrg.name} />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1 truncate text-left text-sm font-medium text-sidebar-foreground">
                {currentOrg.name}
              </span>
              <CaretDown
                className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground"
                weight="bold"
              />
            </>
          )}
        </button>
      )}
    >
      {({ close }) => (
        <div>
          <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
            Organizations
          </div>
          {organizations.map((org) => (
            <button
              key={org.id}
              type="button"
              onClick={() => {
                switchOrg(org.id)
                close()
                // Full page reload to reset all state on org switch
                window.location.reload()
              }}
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-[background-color,color,transform] active:scale-[0.99] sm:hover:bg-accent sm:hover:text-accent-foreground sm:active:scale-100"
            >
              <OrgIcon name={org.name} size={24} />
              <span className="min-w-0 flex-1 truncate text-left">
                {org.name}
              </span>
              {org.id === currentOrg.id && (
                <Check
                  className="h-4 w-4 flex-shrink-0 text-primary"
                  weight="bold"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </DropdownMenu>
  )
}
