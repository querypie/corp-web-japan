import {
  ChatTeardropText,
  Microphone,
  MonitorPlay,
} from "@phosphor-icons/react"
import { DropdownMenu } from "@/components/lingo/mockup/ui/DropdownMenu"

type MeetingType = "in-person" | "remote"

interface NewMeetingDropdownProps {
  onSelect: (type: MeetingType) => void
}

export function NewMeetingDropdown({ onSelect }: NewMeetingDropdownProps) {
  return (
    <DropdownMenu
      className="relative"
      menuClassName="absolute right-0 z-50 mt-1 w-56 rounded-lg border border-border bg-popover py-1 text-popover-foreground shadow-lg"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className="flex w-full cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-[opacity,transform] active:scale-[0.98] sm:hover:opacity-90 sm:active:scale-100"
        >
          <span className="flex items-center gap-1.5">
            <ChatTeardropText className="h-4 w-4" weight="regular" />
            New meeting
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    >
      {({ close }) => (
        <>
          <button
            onClick={() => {
              close()
              onSelect("in-person")
            }}
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm text-popover-foreground transition-[background-color,color,transform] active:scale-[0.99] sm:hover:bg-accent sm:hover:text-accent-foreground sm:active:scale-100"
          >
            <Microphone
              className="h-[18px] w-[18px] text-muted-foreground"
              weight="regular"
            />
            <div>
              <div className="font-medium">In-person meeting</div>
              <div className="text-xs text-muted-foreground">
                Record with your device microphone
              </div>
            </div>
          </button>
          <button
            onClick={() => {
              close()
              onSelect("remote")
            }}
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm text-popover-foreground transition-[background-color,color,transform] active:scale-[0.99] sm:hover:bg-accent sm:hover:text-accent-foreground sm:active:scale-100"
          >
            <MonitorPlay
              className="h-[18px] w-[18px] text-muted-foreground"
              weight="regular"
            />
            <div>
              <div className="font-medium">Remote meeting</div>
              <div className="text-xs text-muted-foreground">
                Join with a meeting bot
              </div>
            </div>
          </button>
        </>
      )}
    </DropdownMenu>
  )
}
