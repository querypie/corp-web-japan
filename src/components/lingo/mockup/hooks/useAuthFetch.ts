/**
 * 목업 전용 no-op useAuthFetch
 * — 실제 네트워크 호출 없이 항상 빈 JSON 200 응답을 반환합니다.
 */
export function useAuthFetch(): (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response> {
  return () => {
    // SSR 환경(Edge 등)에서 Response가 없을 경우를 대비한 보호
    if (typeof Response === "undefined") {
      return Promise.resolve(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { ok: true, status: 200, json: async () => ({}) } as any
      )
    }
    return Promise.resolve(
      new Response("{}", {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    )
  }
}
