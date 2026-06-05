"use client"

import { useEffect, useRef, useState } from "react"
import type { KeyboardEvent } from "react"
import { useTranslations } from "@/lib/lingo/intl"
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  Check,
  Clock,
  Copy,
  Eye,
  EyeSlash,
  GlobeSimple,
  X,
} from "@phosphor-icons/react"
import { QRCodeSVG } from "qrcode.react"
import { Dialog } from "@/components/lingo/mockup/ui/Dialog"
import { Switch } from "@/components/lingo/mockup/ui/Switch"
import { useToast } from "@/components/lingo/mockup/ui/Toast"

const QR_SIZE = 280
const QR_PAD = Math.round(QR_SIZE * 0.25)
const QR_LOGO_SIZE = QR_PAD * 0.8
// 투명 1×1 GIF: qrcode.react에게 excavate(정사각형 빈 영역)만 예약시키고,
// 실제 로고는 PNG 원본 비율 유지를 위해 아래 <img>로 오버레이한다.
const TRANSPARENT_1PX =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
const TIME_PICKER_HOURS = Array.from({ length: 24 }, (_, hour) => hour)
const TIME_PICKER_MINUTES = Array.from({ length: 60 }, (_, minute) => minute)

function shareUrl(token: string) {
  return `https://lingo.demo/s/${encodeURIComponent(token)}`
}

interface ShareModalShare {
  share_token: string
  share_expires_at?: string | null
  requires_password?: boolean
  generated_password?: string | null
}

interface ShareModalProps {
  open: boolean
  shareToken?: string | null
  share?: ShareModalShare | null
  onClose: () => void
  onCreateShare: () => Promise<string | ShareModalShare>
  onUpdateShare?: (settings: {
    expires_at?: string | null
    password?: string | null
  }) => Promise<ShareModalShare>
  onUnshare: () => Promise<void>
}

function normalizeShare(
  value: string | ShareModalShare | null | undefined
): ShareModalShare | null {
  if (!value) return null
  if (typeof value === "string") return { share_token: value }
  return value
}

const PASSWORD_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"

function generatePassword(): string {
  const randomValues = new Uint32Array(10)
  globalThis.crypto.getRandomValues(randomValues)
  return Array.from(
    randomValues,
    (value) => PASSWORD_ALPHABET[value % PASSWORD_ALPHABET.length]
  ).join("")
}

function formatExpiration(
  value: string | null | undefined,
  neverLabel: string
): string {
  if (!value) return neverLabel
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function isExpired(value: string | null | undefined): boolean {
  if (!value) return false
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false
  return date.getTime() <= Date.now()
}

function pad2(value: number): string {
  return String(value).padStart(2, "0")
}

function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

function localTimeValue(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

function monthLabel(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" })
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function daysForMonth(visibleMonth: Date): Date[] {
  const first = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1)
  const cursor = new Date(first)
  cursor.setDate(cursor.getDate() - cursor.getDay())
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(cursor)
    day.setDate(cursor.getDate() + index)
    return day
  })
}

function parseExpirationDraft(value: string | null | undefined): Date {
  const parsed = value
    ? new Date(value)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  if (!Number.isNaN(parsed.getTime())) return parsed
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
}

function buildExpirationIso(date: Date, timeValue: string): string | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(timeValue.trim())
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null
  const next = new Date(date)
  next.setHours(hours, minutes, 0, 0)
  return next.toISOString()
}

function normalizeTimeValue(value: string, fallback: string): string {
  const trimmed = value.trim()
  if (!trimmed) return fallback
  const parts = trimmed.split(":")
  if (parts.length > 2) return fallback
  const [hourPart, minutePart = "0"] = parts
  if (!/^\d+$/.test(hourPart)) return fallback
  if (minutePart !== "" && !/^\d+$/.test(minutePart)) return fallback
  const hours = Math.min(Number(hourPart), 23)
  const minutes = Math.min(Number(minutePart || "0"), 59)
  return `${pad2(hours)}:${pad2(minutes)}`
}

export function ShareModal({
  open,
  shareToken,
  share,
  onClose,
  onCreateShare,
  onUpdateShare,
  onUnshare,
}: ShareModalProps) {
  const t = useTranslations("mockup.modals")
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [expirationLoading, setExpirationLoading] = useState(false)
  const [expirationPickerOpen, setExpirationPickerOpen] = useState(false)
  const [timePickerOpen, setTimePickerOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [localShare, setLocalShare] = useState<ShareModalShare | null>(
    normalizeShare(share ?? shareToken)
  )
  const initialExpirationDraft = parseExpirationDraft(
    localShare?.share_expires_at
  )
  const [draftExpiresAt, setDraftExpiresAt] = useState<string | null>(
    localShare?.share_expires_at ?? null
  )
  const [draftRequiresPassword, setDraftRequiresPassword] = useState(
    Boolean(localShare?.requires_password)
  )
  const [draftGeneratedPassword, setDraftGeneratedPassword] = useState<
    string | null
  >(localShare?.generated_password ?? null)
  const [showPassword, setShowPassword] = useState(
    Boolean(localShare?.generated_password)
  )
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [draftDate, setDraftDate] = useState<Date>(
    startOfDay(initialExpirationDraft)
  )
  const [draftTime, setDraftTime] = useState(
    localTimeValue(initialExpirationDraft)
  )
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(
      initialExpirationDraft.getFullYear(),
      initialExpirationDraft.getMonth(),
      1
    )
  )
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const feedbackTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const expirationButtonRef = useRef<HTMLButtonElement>(null)
  const expirationPickerRef = useRef<HTMLDivElement>(null)
  const selectedHourRef = useRef<HTMLButtonElement>(null)
  const selectedMinuteRef = useRef<HTMLButtonElement>(null)
  const prevShare = useRef<string | ShareModalShare | null | undefined>(
    share ?? shareToken
  )

  const resetDraft = (nextShare: ShareModalShare | null) => {
    const nextExpirationDraft = parseExpirationDraft(
      nextShare?.share_expires_at
    )
    setDraftExpiresAt(nextShare?.share_expires_at ?? null)
    setDraftRequiresPassword(Boolean(nextShare?.requires_password))
    setDraftGeneratedPassword(nextShare?.generated_password ?? null)
    setShowPassword(Boolean(nextShare?.generated_password))
    setDraftDate(startOfDay(nextExpirationDraft))
    setDraftTime(localTimeValue(nextExpirationDraft))
    setVisibleMonth(
      new Date(
        nextExpirationDraft.getFullYear(),
        nextExpirationDraft.getMonth(),
        1
      )
    )
    setTimePickerOpen(false)
  }

  // Sync prop → local state only when prop actually changes
  const currentShareProp = share ?? shareToken
  useEffect(() => {
    if (currentShareProp === prevShare.current) return
    const nextShare = normalizeShare(currentShareProp)
    setLocalShare(nextShare)
    resetDraft(nextShare)
    prevShare.current = currentShareProp
  }, [currentShareProp])

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCopied(false)
      setFeedbackMessage(null)
    }
    return () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current)
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
    }
  }, [open])

  useEffect(() => {
    if (!expirationPickerOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (expirationPickerRef.current?.contains(target)) return
      if (expirationButtonRef.current?.contains(target)) return
      setExpirationPickerOpen(false)
      setTimePickerOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [expirationPickerOpen])

  const token = localShare?.share_token ?? null
  const isShared = token !== null
  const showPolicyRows = isShared && share !== undefined
  const policyShare = showPolicyRows ? localShare : null
  const shareExpired = isExpired(localShare?.share_expires_at)
  const canCopyLink = isShared && !shareExpired
  const timeValid = buildExpirationIso(draftDate, draftTime) !== null
  const expirationTimeInvalid = draftExpiresAt !== null && !timeValid
  const [draftHourPart, draftMinutePart] = draftTime.split(":")
  const parsedDraftHour = Number(draftHourPart)
  const parsedDraftMinute = Number(draftMinutePart)
  const currentDraftHour =
    Number.isInteger(parsedDraftHour) &&
    parsedDraftHour >= 0 &&
    parsedDraftHour <= 23
      ? parsedDraftHour
      : 0
  const currentDraftMinute =
    Number.isInteger(parsedDraftMinute) &&
    parsedDraftMinute >= 0 &&
    parsedDraftMinute <= 59
      ? parsedDraftMinute
      : 0

  useEffect(() => {
    if (!timePickerOpen) return
    if (typeof selectedHourRef.current?.scrollIntoView === "function") {
      selectedHourRef.current.scrollIntoView({ block: "center" })
    }
    if (typeof selectedMinuteRef.current?.scrollIntoView === "function") {
      selectedMinuteRef.current.scrollIntoView({ block: "center" })
    }
  }, [timePickerOpen, currentDraftHour, currentDraftMinute])

  const showFeedback = (message: string) => {
    setFeedbackMessage(message)
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
    feedbackTimer.current = setTimeout(() => setFeedbackMessage(null), 2200)
  }

  const handleToggle = async () => {
    setLoading(true)
    try {
      if (isShared) {
        await onUnshare()
        setLocalShare(null)
        resetDraft(null)
      } else {
        const nextShare = await onCreateShare()
        const normalizedShare = normalizeShare(nextShare)
        const nextPassword = generatePassword()
        const shareWithPassword = normalizedShare
          ? {
              ...normalizedShare,
              requires_password: true,
              generated_password: nextPassword,
            }
          : null
        setLocalShare(shareWithPassword)
        resetDraft(shareWithPassword)
      }
    } catch {
      showToast(t("share.errors.update"))
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordToggle = async () => {
    if (!localShare || !onUpdateShare) return

    setPasswordLoading(true)
    if (draftRequiresPassword) {
      setDraftRequiresPassword(false)
      setDraftGeneratedPassword(null)
      setShowPassword(false)
      const updatedShare = {
        ...localShare,
        requires_password: false,
        generated_password: null,
      }
      setLocalShare(updatedShare)
      try {
        await onUpdateShare({ password: null })
      } catch {
        showToast(t("share.errors.update"))
      } finally {
        setPasswordLoading(false)
      }
    } else {
      const nextPassword = generatePassword()
      setDraftRequiresPassword(true)
      setDraftGeneratedPassword(nextPassword)
      setShowPassword(true)
      const updatedShare = {
        ...localShare,
        requires_password: true,
        generated_password: nextPassword,
      }
      setLocalShare(updatedShare)
      try {
        await onUpdateShare({ password: nextPassword })
      } catch {
        showToast(t("share.errors.update"))
      } finally {
        setPasswordLoading(false)
      }
    }
  }

  const openExpirationPicker = () => {
    if (!localShare) return
    const nextDraft = parseExpirationDraft(localShare.share_expires_at)
    setDraftDate(startOfDay(nextDraft))
    setDraftTime(localTimeValue(nextDraft))
    setVisibleMonth(new Date(nextDraft.getFullYear(), nextDraft.getMonth(), 1))
    setExpirationPickerOpen((current) => {
      if (current) setTimePickerOpen(false)
      return !current
    })
  }

  const handleSelectDate = (date: Date) => {
    const nextDate = startOfDay(date)
    setDraftDate(nextDate)
    const nextIso = buildExpirationIso(nextDate, draftTime)
    if (nextIso) setDraftExpiresAt(nextIso)
  }

  const handleTimeChange = (value: string) => {
    setDraftTime(value)
    const nextIso = buildExpirationIso(draftDate, value)
    if (nextIso) {
      setDraftExpiresAt(nextIso)
    }
  }

  const handleTimePartSelect = (hours: number, minutes: number) => {
    handleTimeChange(`${pad2(hours)}:${pad2(minutes)}`)
  }

  const normalizeDraftTime = () => {
    const fallback = localTimeValue(parseExpirationDraft(draftExpiresAt))
    const normalized = normalizeTimeValue(draftTime, fallback)
    setDraftTime(normalized)
    const nextIso = buildExpirationIso(draftDate, normalized)
    if (nextIso) setDraftExpiresAt(nextIso)
  }

  const handleTimeInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return
    event.preventDefault()
    normalizeDraftTime()
  }

  const handleTimeWheelKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    part: "hour" | "minute",
    value: number
  ) => {
    const max = part === "hour" ? 23 : 59
    let nextValue: number | null = null
    if (event.key === "ArrowDown") nextValue = value === max ? 0 : value + 1
    if (event.key === "ArrowUp") nextValue = value === 0 ? max : value - 1
    if (event.key === "Home") nextValue = 0
    if (event.key === "End") nextValue = max
    if (nextValue === null) return
    event.preventDefault()
    if (part === "hour") {
      handleTimePartSelect(nextValue, currentDraftMinute)
    } else {
      handleTimePartSelect(currentDraftHour, nextValue)
    }
  }

  const handleNeverExpiration = async () => {
    if (!localShare || !onUpdateShare) return
    setDraftExpiresAt(null)
    setExpirationPickerOpen(false)
    setTimePickerOpen(false)
    const updatedShare = { ...localShare, share_expires_at: null }
    setLocalShare(updatedShare)
    setExpirationLoading(true)
    try {
      await onUpdateShare({ expires_at: null })
    } catch {
      showToast(t("share.errors.update"))
    } finally {
      setExpirationLoading(false)
    }
  }

  const handleApplyExpiration = async () => {
    if (!localShare || !onUpdateShare || expirationTimeInvalid) return
    const updatedShare = { ...localShare, share_expires_at: draftExpiresAt }
    setLocalShare(updatedShare)
    setExpirationLoading(true)
    try {
      await onUpdateShare({ expires_at: draftExpiresAt })
      setExpirationPickerOpen(false)
    } catch {
      showToast(t("share.errors.update"))
    } finally {
      setExpirationLoading(false)
    }
  }

  const handleCopyGeneratedPassword = async () => {
    if (!draftGeneratedPassword) return
    try {
      await navigator.clipboard.writeText(draftGeneratedPassword)
      showFeedback(t("share.feedback.passwordCopied"))
    } catch {
      showToast(t("share.errors.copy"))
    }
  }

  const handleCopyLink = async () => {
    if (!token) return
    try {
      await navigator.clipboard.writeText(shareUrl(token))
      setCopied(true)
      if (copiedTimer.current) clearTimeout(copiedTimer.current)
      copiedTimer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast(t("share.errors.copy"))
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="relative mx-4 max-h-[calc(100vh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">{t("share.title")}</h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label={t("share.close")}
          >
            <X className="h-4 w-4" weight="bold" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GlobeSimple
              className="h-5 w-5 text-muted-foreground"
              weight="regular"
              aria-hidden="true"
            />
            <div>
              <span className="text-sm font-medium text-foreground">
                {t("share.publicLink.title")}
              </span>
              <p className="text-xs text-muted-foreground">
                {t("share.publicLink.description")}
              </p>
            </div>
          </div>
          <Switch
            checked={isShared}
            disabled={loading}
            onClick={() => void handleToggle()}
            aria-label={t("share.publicLink.title")}
          />
        </div>

        {token && (
          <div
            className="relative mt-4 flex justify-center"
            role="img"
            aria-label={t("share.qrCode")}
          >
            <QRCodeSVG
              value={shareUrl(token)}
              size={QR_SIZE}
              level="H"
              includeMargin
              imageSettings={{
                src: TRANSPARENT_1PX,
                width: QR_PAD,
                height: QR_PAD,
                excavate: true,
              }}
            />
            <img
              src="/lingo/symbol.png"
              alt=""
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
              style={{ width: QR_LOGO_SIZE, height: QR_LOGO_SIZE }}
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => void handleCopyLink()}
          disabled={!canCopyLink || loading}
          className={[
            "mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors",
            canCopyLink
              ? "bg-primary-soft text-primary-soft-foreground hover:bg-primary-soft/80"
              : "bg-muted text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
          ].join(" ")}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" weight="bold" />
              {t("share.copyLink.copied")}
            </>
          ) : (
            <>{t("share.copyLink.label")}</>
          )}
        </button>

        {policyShare && (
          <div className="mt-4 border-t border-border">
            <div className="flex min-h-14 items-center justify-between gap-3 py-3">
              <span className="text-sm font-medium text-muted-foreground">
                {t("share.expiration.label")}
              </span>
              <button
                ref={expirationButtonRef}
                type="button"
                onClick={openExpirationPicker}
                disabled={!onUpdateShare || expirationLoading}
                className="flex min-h-9 items-center justify-end gap-1.5 text-right text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={t("share.expiration.label")}
              >
                <CalendarBlank
                  className="h-4 w-4 text-muted-foreground"
                  weight="regular"
                  aria-hidden="true"
                />
                <span>
                  {formatExpiration(draftExpiresAt, t("share.expiration.never"))}
                </span>
                {isExpired(draftExpiresAt) && (
                  <span className="rounded-full border border-destructive/30 px-2 py-0.5 text-xs font-medium text-destructive">
                    {t("share.expiration.expired")}
                  </span>
                )}
              </button>
            </div>
            {expirationPickerOpen && (
              <div
                ref={expirationPickerRef}
                role="dialog"
                aria-label={t("share.expiration.calendar")}
                className="absolute top-1/2 left-1/2 z-20 w-[calc(100%-2rem)] max-w-80 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-background p-3 shadow-xl"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    {t("share.expiration.calendar")}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={t("share.expiration.prevMonth")}
                      onClick={() =>
                        setVisibleMonth(
                          new Date(
                            visibleMonth.getFullYear(),
                            visibleMonth.getMonth() - 1,
                            1
                          )
                        )
                      }
                    >
                      <CaretLeft className="h-4 w-4" weight="bold" />
                    </button>
                    <span className="w-28 text-center text-sm font-medium text-foreground">
                      {monthLabel(visibleMonth)}
                    </span>
                    <button
                      type="button"
                      className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      aria-label={t("share.expiration.nextMonth")}
                      onClick={() =>
                        setVisibleMonth(
                          new Date(
                            visibleMonth.getFullYear(),
                            visibleMonth.getMonth() + 1,
                            1
                          )
                        )
                      }
                    >
                      <CaretRight className="h-4 w-4" weight="bold" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <span key={`${day}-${index}`}>{day}</span>
                  ))}
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1">
                  {daysForMonth(visibleMonth).map((day) => {
                    const dateKey = localDateKey(day)
                    const selected = dateKey === localDateKey(draftDate)
                    const inMonth = day.getMonth() === visibleMonth.getMonth()
                    return (
                      <button
                        key={dateKey}
                        type="button"
                        aria-label={dateKey}
                        onClick={() => handleSelectDate(day)}
                        className={[
                          "h-8 rounded-md text-xs font-medium transition-colors",
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground",
                          inMonth
                            ? "text-foreground"
                            : "text-muted-foreground/50",
                        ].join(" ")}
                      >
                        {day.getDate()}
                      </button>
                    )
                  })}
                </div>
                <div className="mt-3 border-t border-border pt-3">
                  <label
                    htmlFor="share-expiration-time"
                    className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase"
                  >
                    <Clock
                      className="h-3.5 w-3.5"
                      weight="regular"
                      aria-hidden="true"
                    />
                    {t("share.time.label")}
                  </label>
                  <div
                    className={[
                      "flex h-9 items-center justify-between rounded-md bg-card px-2 ring-1 ring-border",
                      expirationTimeInvalid
                        ? "ring-destructive"
                        : "focus-within:ring-primary",
                    ].join(" ")}
                  >
                    <input
                      id="share-expiration-time"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{1,2}:[0-9]{2}"
                      value={draftTime}
                      onChange={(event) => handleTimeChange(event.target.value)}
                      onBlur={normalizeDraftTime}
                      onKeyDown={handleTimeInputKeyDown}
                      aria-label={t("share.time.label")}
                      className="h-8 w-16 border-0 bg-transparent px-1 font-mono text-sm text-foreground tabular-nums outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setTimePickerOpen((current) => !current)}
                      aria-label={t("share.time.picker")}
                      aria-expanded={timePickerOpen}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <Clock className="h-4 w-4" weight="regular" />
                    </button>
                  </div>
                  {timePickerOpen && (
                    <div
                      role="group"
                      aria-label={t("share.time.picker")}
                      className="relative mt-2 grid grid-cols-2 gap-2 overflow-hidden rounded-lg border border-border bg-card/95 p-2 shadow-sm"
                    >
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-2 top-1/2 z-0 h-8 -translate-y-1/2 rounded-md bg-accent/70"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-2 top-2 z-20 h-10 bg-gradient-to-b from-card via-card/90 to-transparent"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-2 bottom-2 z-20 h-10 bg-gradient-to-t from-card via-card/90 to-transparent"
                      />
                      <div
                        role="group"
                        aria-label={t("share.time.hourWheel")}
                        className="relative z-10 h-32 overflow-hidden"
                      >
                        <div className="h-full snap-y snap-mandatory overflow-y-auto py-12">
                          {TIME_PICKER_HOURS.map((hour) => {
                            const selected = hour === currentDraftHour
                            return (
                              <button
                                key={hour}
                                ref={selected ? selectedHourRef : undefined}
                                type="button"
                                tabIndex={selected ? 0 : -1}
                                aria-label={t("share.time.hourValue", {
                                  value: pad2(hour),
                                })}
                                onClick={() =>
                                  handleTimePartSelect(hour, currentDraftMinute)
                                }
                                onKeyDown={(event) =>
                                  handleTimeWheelKeyDown(event, "hour", hour)
                                }
                                className={[
                                  "flex h-8 w-full snap-center items-center justify-center rounded-md text-sm tabular-nums transition-colors",
                                  selected
                                    ? "font-semibold text-foreground"
                                    : "text-muted-foreground/55 hover:text-foreground",
                                ].join(" ")}
                              >
                                {pad2(hour)}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                      <div
                        role="group"
                        aria-label={t("share.time.minuteWheel")}
                        className="relative z-10 h-32 overflow-hidden"
                      >
                        <div className="h-full snap-y snap-mandatory overflow-y-auto py-12">
                          {TIME_PICKER_MINUTES.map((minute) => {
                            const selected = minute === currentDraftMinute
                            return (
                              <button
                                key={minute}
                                ref={selected ? selectedMinuteRef : undefined}
                                type="button"
                                tabIndex={selected ? 0 : -1}
                                aria-label={t("share.time.minuteValue", {
                                  value: pad2(minute),
                                })}
                                onClick={() =>
                                  handleTimePartSelect(currentDraftHour, minute)
                                }
                                onKeyDown={(event) =>
                                  handleTimeWheelKeyDown(
                                    event,
                                    "minute",
                                    minute
                                  )
                                }
                                className={[
                                  "flex h-8 w-full snap-center items-center justify-center rounded-md text-sm tabular-nums transition-colors",
                                  selected
                                    ? "font-semibold text-foreground"
                                    : "text-muted-foreground/55 hover:text-foreground",
                                ].join(" ")}
                              >
                                {pad2(minute)}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => void handleNeverExpiration()}
                    disabled={expirationLoading}
                    className="rounded-md px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                  >
                    {t("share.expiration.never")}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleApplyExpiration()}
                    disabled={expirationLoading || expirationTimeInvalid}
                    className="rounded-md bg-primary px-2.5 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t("share.expiration.apply")}
                  </button>
                </div>
              </div>
            )}
            <div className="flex min-h-14 items-center justify-between gap-3 py-3">
              <span className="text-sm font-medium text-muted-foreground">
                {t("share.password.label")}
              </span>
              <div className="flex min-w-0 items-center justify-end gap-2">
                {draftRequiresPassword ? (
                  <span className="flex min-w-0 items-center gap-1 text-sm font-medium text-foreground">
                    <span>
                      {showPassword && draftGeneratedPassword
                        ? draftGeneratedPassword
                        : "*******"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      aria-label={
                        showPassword
                          ? t("share.password.hide")
                          : t("share.password.show")
                      }
                    >
                      {showPassword ? (
                        <EyeSlash className="h-4 w-4" weight="regular" />
                      ) : (
                        <Eye className="h-4 w-4" weight="regular" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleCopyGeneratedPassword()}
                      disabled={!draftGeneratedPassword}
                      className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      aria-label={t("share.password.copy")}
                    >
                      <Copy className="h-4 w-4" weight="regular" />
                    </button>
                  </span>
                ) : null}
                <Switch
                  checked={draftRequiresPassword}
                  disabled={passwordLoading || loading}
                  onClick={() => void handlePasswordToggle()}
                  aria-label={t("share.password.label")}
                />
              </div>
            </div>
            <p
              role="status"
              aria-live="polite"
              className="sr-only"
            >
              {feedbackMessage ?? ""}
            </p>
          </div>
        )}
      </div>
    </Dialog>
  )
}
