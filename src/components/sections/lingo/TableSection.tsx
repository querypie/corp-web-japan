import { Container } from "@/components/layout/lingo/Container"

const rows = [
  {
    feature: "Audio Source",
    inPerson: "Conversations are converted into structured business data",
    remote: "Less post-meeting cleanup. Clearer next actions.",
  },
  {
    feature: "Speaker Diarization",
    inPerson:
      "Real-time multilingual transcription and translation keeps everyone aligned",
    remote:
      "Discussion pace maintained regardless of participants' language",
  },
  {
    feature: "Setup Required",
    inPerson: "AI Agents instantly retrieve FAQs, CRM records, and documents",
    remote: "Faster response time and higher quality support",
  },
  {
    feature: "Best For",
    inPerson: "Connected to existing systems via MCP and Agents",
    remote: "Records that flow directly into execution",
  },
]

export function TableSection() {
  return (
    <Container>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
        {/* 헤더 행 */}
        <div className="grid grid-cols-[1fr_1fr_1fr] items-center rounded-[10px] bg-[var(--black)] text-[var(--white)] md:rounded-[10px]">
          <div />
          <div className="flex items-center justify-center py-[20px] body-md">
            In-Person
          </div>
          <div className="flex items-center justify-center py-[20px] body-md">
            Remote
          </div>
        </div>

        {/* 데이터 행 */}
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_1fr_1fr] items-center border-b border-[var(--border)] py-[20px]"
          >
            <div className="px-4 text-h3 text-[var(--fg)] md:px-[30px]">
              {row.feature}
            </div>
            <div className="px-4 body-sm text-[var(--fg)] md:px-[20px]">
              {row.inPerson}
            </div>
            <div className="px-4 body-sm text-[var(--fg)] md:px-[20px]">
              {row.remote}
            </div>
          </div>
        ))}
        </div>
      </div>
    </Container>
  )
}
