import { Container } from "@/components/layout/lingo/Container"

interface FeatureRow {
  title: React.ReactNode
  description: React.ReactNode
  imageSrc: string
}

interface FeatureSectionProps {
  rows: FeatureRow[]
}

export function FeatureSection({ rows }: FeatureSectionProps) {
  return (
    <Container className="section-gap">
      <div className="flex flex-col gap-10 md:gap-[60px]">
        {rows.map((row, i) => {
          const isEven = i % 2 === 0 // 짝수 인덱스면 텍스트 좌 / 이미지 우
          return (
            <div
              key={i}
              className="flex flex-col gap-[30px] md:flex-row md:gap-[60px]"
            >
              <div
                className={`flex flex-1 flex-col gap-[10px] ${
                  isEven ? "order-1" : "order-1 md:order-2"
                }`}
              >
                <h2 className="text-h2 text-[var(--fg)]">{row.title}</h2>
                <p className="body-md text-[var(--fg)]">{row.description}</p>
              </div>
              <div
                className={`relative w-full overflow-hidden rounded-[var(--corner-feature)] aspect-[1200/748] md:w-[600px] ${
                  isEven ? "order-2" : "order-2 md:order-1"
                }`}
              >
                <img
                  src={row.imageSrc}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
            </div>
          )
        })}
      </div>
    </Container>
  )
}
