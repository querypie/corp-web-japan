"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export interface TimedValidationOptions {
  autoDismiss?: boolean
  dismissMs?: number
}

export interface TimedValidation {
  error: boolean
  errorToken: number
  triggerError: () => void
  clearError: () => void
}

export function useTimedValidation(
  options: TimedValidationOptions = {}
): TimedValidation {
  const { autoDismiss = true, dismissMs = 2200 } = options
  const [error, setError] = useState(false)
  const [errorToken, setErrorToken] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  const triggerError = useCallback(() => {
    setError(true)
    setErrorToken((t) => t + 1)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (autoDismiss) {
      timerRef.current = setTimeout(() => setError(false), dismissMs)
    }
  }, [autoDismiss, dismissMs])

  const clearError = useCallback(() => {
    setError(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  return { error, triggerError, clearError, errorToken }
}
