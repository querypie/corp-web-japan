import { Container } from "@/components/layout/lingo/Container"
import { Button } from "@/components/lingo/common/Button"

const cards = [
  {
    title: "Audio Source",
    description:
      "Real-time transcription and translation keeps everyone aligned in meetings where Korean, English, and Japanese are all spoken.",
    link: "#",
  },
  {
    title: "Speaker Diarization",
    description:
      "Real-time transcription and translation keeps everyone aligned in meetings where Korean, English, and Japanese are all spoken.",
    link: "#",
  },
  {
    title: "Setup Required",
    description:
      "Real-time transcription and translation keeps everyone aligned in meetings where Korean, English, and Japanese are all spoken.",
    link: "#",
  },
]

export function InfoCardsSection() {
  return (
    <Container>
      <div className="flex flex-col gap-[30px] rounded-[var(--corner-feature)] bg-[var(--card)] p-6 md:p-10">
        {/* 헤더 */}
        <div className="flex flex-col gap-[10px]">
          <h2 className="text-h2 text-[var(--fg)]">
            Transcription is just the beginning.
          </h2>
          <p className="body-sm text-[var(--fg)]">
            Real-time transcription and translation keeps everyone aligned in
            meetings where Korean, English, and Japanese are all spoken.
          </p>
        </div>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {cards.map((card, i) => (
            <div
              key={i}
              className="flex flex-col gap-[10px] rounded-[var(--corner-box)] bg-[var(--white)] p-[30px]"
            >
              <h3 className="text-h3 text-[var(--fg)]">{card.title}</h3>
              <p className="body-sm text-[var(--mute)]">{card.description}</p>
              <div className="mt-auto">
                <Button variant="text" href={card.link}>
                  Learn more
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
