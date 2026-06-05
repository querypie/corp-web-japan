"use client"

import { useCallback, useEffect, useRef, useState, type DragEvent } from "react"
import { useTranslations } from "@/lib/lingo/intl"
import { CloudArrowUp, File as FileIcon, X } from "@phosphor-icons/react"
import { Button } from "@/components/lingo/mockup/ui/Button"
import { Dialog } from "@/components/lingo/mockup/ui/Dialog"
import { Input } from "@/components/lingo/mockup/ui/Input"
import { LanguageMultiSelect } from "@/components/lingo/mockup/LanguageMultiSelect"

// 인라인 유효성 검사 훅 (useLangValidation 대체)
function useLangValidation(dismissMs = 2200) {
  const [error, setError] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const triggerError = useCallback(() => {
    setError(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setError(false), dismissMs)
  }, [dismissMs])

  const clearError = useCallback(() => {
    setError(false)
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  return { langError: error, triggerError, clearError }
}

const ACCEPTED_TYPES = [
  "audio/mpeg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/wav",
  "audio/webm",
  "audio/ogg",
]
const ACCEPTED_EXTENSIONS = [".mp3", ".m4a", ".wav", ".webm", ".ogg"]
const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024

interface AudioUploadModalProps {
  open: boolean
  onClose: () => void
}

export function AudioUploadModal({ open, onClose }: AudioUploadModalProps) {
  const t = useTranslations("mockup.modals")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState("")
  const [sourceLanguages, setSourceLanguages] = useState<Set<string>>(
    () => new Set(["en"])
  )
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const { langError, triggerError, clearError } = useLangValidation()

  const resetState = useCallback(() => {
    setFile(null)
    setName("")
    setSourceLanguages(new Set(["en"]))
    setError(null)
    setDragOver(false)
  }, [])

  const validateFile = useCallback((nextFile: File): string | null => {
    const ext = nextFile.name.includes(".")
      ? nextFile.name.slice(nextFile.name.lastIndexOf(".")).toLowerCase()
      : ""
    if (
      !ACCEPTED_TYPES.includes(nextFile.type) &&
      !ACCEPTED_EXTENSIONS.includes(ext)
    ) {
      return t("audioUpload.errors.invalidType")
    }
    if (nextFile.size > MAX_FILE_SIZE_BYTES) {
      return t("audioUpload.errors.fileTooLarge")
    }
    return null
  }, [t])

  const handleFileSelect = useCallback(
    (nextFile: File) => {
      const validationError = validateFile(nextFile)
      if (validationError) {
        setError(validationError)
        return
      }
      setError(null)
      setFile(nextFile)
      if (!name) {
        setName(nextFile.name.replace(/\.[^.]+$/, ""))
      }
    },
    [name, validateFile]
  )

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setDragOver(false)
      const droppedFile = event.dataTransfer.files[0]
      if (droppedFile) {
        handleFileSelect(droppedFile)
      }
    },
    [handleFileSelect]
  )

  const handleClose = () => {
    clearError()
    onClose()
    resetState()
  }

  // 업로드 핸들러: no-op — 모달을 닫기만 함
  const handleUpload = () => {
    if (sourceLanguages.size === 0) {
      triggerError()
      return
    }
    handleClose()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <div className="mx-4 w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl">
        <h2 className="mb-5 text-xl font-semibold text-card-foreground">
          {t("audioUpload.title")}
        </h2>

        {!file ? (
          <div
            onDrop={handleDrop}
            onDragOver={(event) => {
              event.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`mb-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border sm:hover:border-primary/50 sm:hover:bg-accent"
            }`}
          >
            <CloudArrowUp
              className="mb-3 h-10 w-10 text-muted-foreground"
              weight="regular"
            />
            <p className="text-center text-sm font-medium text-foreground">
              {t("audioUpload.dropzone.title")}
            </p>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              {t("audioUpload.dropzone.hint")}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS.join(",")}
              className="hidden"
              onChange={(event) => {
                const selectedFile = event.target.files?.[0]
                if (selectedFile) {
                  handleFileSelect(selectedFile)
                }
                event.target.value = ""
              }}
            />
          </div>
        ) : (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-border bg-accent/50 p-4">
            <FileIcon
              className="h-8 w-8 shrink-0 text-primary"
              weight="regular"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
            <button
              type="button"
              aria-label={t("audioUpload.removeFile")}
              onClick={() => {
                setFile(null)
                setError(null)
              }}
              className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors sm:hover:bg-accent sm:hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-foreground">
            {t("audioUpload.meetingName.label")}
          </label>
          <Input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("audioUpload.meetingName.placeholder")}
          />
        </div>

        <div className="mb-4">
          <LanguageMultiSelect
            label={t("audioUpload.sourceLanguage")}
            selected={sourceLanguages}
            onChange={(next) => {
              setSourceLanguages(next)
              clearError()
            }}
            max={3}
            error={langError}
          />
        </div>

        <div className="space-y-2">
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <Button onClick={handleUpload} disabled={!file} fullWidth>
            {t("audioUpload.actions.start")}
          </Button>
          <Button onClick={handleClose} variant="ghost" fullWidth>
            {t("audioUpload.actions.cancel")}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
