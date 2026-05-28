"use client"

import { useState } from "react"
import { Dialog } from "@/components/lingo/mockup/ui/Dialog"

interface DeleteConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  onError?: (err: unknown) => void
  title: string
  description: string
  confirmButtonText: string
  cancelButtonText: string
}

export function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  onError,
  title,
  description,
  confirmButtonText,
  cancelButtonText,
}: DeleteConfirmationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
      setIsDeleting(false)
      onClose()
    } catch (err) {
      console.error("Delete confirmation failed:", err)
      if (onError) onError(err)
      setIsDeleting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isDeleting) onClose()
      }}
      ariaLabelledBy="delete-confirm-title"
      ariaDescribedBy="delete-confirm-desc"
    >
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl">
        <h3 id="delete-confirm-title" className="mb-1 text-base font-semibold">
          {title}
        </h3>
        <p
          id="delete-confirm-desc"
          className="mb-5 text-sm text-muted-foreground"
        >
          {description}
        </p>
        <div className="flex flex-row justify-end gap-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
          >
            {cancelButtonText}
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleConfirm}
            className="flex items-center justify-center rounded-xl bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50"
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </Dialog>
  )
}
