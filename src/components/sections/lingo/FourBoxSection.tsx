import { Container } from "@/components/layout/lingo/Container"
import { Globe, MessageCircle, Sparkles, Mic } from "lucide-react"

const cards = [
  {
    icon: Globe,
    title: "Same context, different languages",
    description:
      "Real-time transcription and translation keeps everyone aligned in meetings where Korean, English, and Japanese are all spoken.",
  },
  {
    icon: MessageCircle,
    title: "Same context, different languages",
    description:
      "Real-time transcription and translation keeps everyone aligned in meetings where Korean, English, and Japanese are all spoken.",
  },
  {
    icon: Sparkles,
    title: "From conversation to next action",
    description:
      "AI captures customer needs, concerns, and commitments — then converts them into follow-up contacts, proposals, and internal updates.",
  },
  {
    icon: Mic,
    title: "Beyond minutes — into execution",
    description:
      "Decisions, owners, risks, and follow-ups are structured so the team can move immediately without additional coordination.",
  },
]

export function FourBoxSection() {
  return (
    <Container>
      <h2 className="text-h2 mb-5 text-[var(--fg)]">
        Transcription is just the beginning.
      </h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <div
              key={i}
              className="flex gap-5 rounded-[var(--corner-box)] bg-[var(--card)] p-[30px]"
            >
              <div className="shrink-0">
                <Icon className="size-11 text-[var(--fg)]" />
              </div>
              <div className="flex flex-col gap-[10px]">
                <h3 className="text-h3 text-[var(--fg)]">{card.title}</h3>
                <p className="body-md text-[var(--fg)]">{card.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Container>
  )
}
