"use client"

import { useCallback } from "react"

export function useCalendarConnect() {
  const connect = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (provider: "google" | "microsoft" = "google") => {
      // 목업: 캘린더 연결은 no-op
    },
    []
  )

  return { connect, loading: false }
}
