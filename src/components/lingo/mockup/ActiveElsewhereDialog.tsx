import { Dialog } from "@/components/lingo/mockup/ui/Dialog"

interface ActiveElsewhereDialogProps {
  open: boolean
  onClose: () => void
}

export function ActiveElsewhereDialog({
  open,
  onClose,
}: ActiveElsewhereDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
        <h2 className="text-base font-semibold text-foreground">
          Active on Another Tab
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You appear to have an active session in another tab or window.
        </p>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Okay
          </button>
        </div>
      </div>
    </Dialog>
  )
}
