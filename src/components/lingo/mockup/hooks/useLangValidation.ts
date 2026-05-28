"use client"

import { useTimedValidation } from "@/components/lingo/mockup/hooks/useTimedValidation"

export function useLangValidation(dismissMs = 2200) {
  const { error, errorToken, triggerError, clearError } = useTimedValidation({
    dismissMs,
  })
  return { langError: error, errorToken, triggerError, clearError }
}
