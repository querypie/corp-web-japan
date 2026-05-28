/**
 * 목업 전용 OrganizationContext
 * — 항상 MOCK_ORG를 반환하여 대시보드/모달 컴포넌트가 컴파일되며 올바르게 동작합니다.
 */
"use client"

import { createContext, useContext, useMemo } from "react"
import type { ReactNode } from "react"
import { MOCK_ORG } from "@/components/lingo/mockup/mockData"
import type { Organization } from "@/components/lingo/mockup/types"

export const ORG_STORAGE_KEY = "lingo-current-org-id"
export const ORG_SLUG_STORAGE_KEY = "lingo-current-org-slug"

interface OrganizationContextValue {
  organizations: Organization[]
  currentOrg: Organization | null
  switchOrg: (orgId: string) => void
  isLoading: boolean
}

export const OrganizationContext = createContext<OrganizationContextValue>({
  organizations: [],
  currentOrg: null,
  switchOrg: () => {},
  isLoading: true,
})

export function useOrganizationContext() {
  return useContext(OrganizationContext)
}

interface OrganizationProviderProps {
  authFetch?: (
    input: RequestInfo | URL,
    init?: RequestInit
  ) => Promise<Response>
  orgSlug?: string
  children: ReactNode
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const currentOrg: Organization = useMemo(() => {
    // MOCK_ORG를 타입에 맞게 매핑 (nullish 필드 제거)
    return {
      id: MOCK_ORG.id,
      name: MOCK_ORG.name,
      slug: MOCK_ORG.slug,
    }
  }, [])

  const value = useMemo<OrganizationContextValue>(
    () => ({
      organizations: [currentOrg],
      currentOrg,
      switchOrg: () => {},
      isLoading: false,
    }),
    [currentOrg]
  )

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  )
}
