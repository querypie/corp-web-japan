import Image from "next/image"

export function SubPageHeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-x-0 -top-10 h-[200px] overflow-hidden md:top-0">
      <Image
        src="/lingo/images/bg-home.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="size-full object-cover object-bottom"
      />
    </div>
  )
}
