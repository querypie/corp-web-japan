import { HeroSection } from "@/components/sections/lingo/home/HeroSection"
import { FeatureBento } from "@/components/sections/lingo/home/FeatureBento"
// import { ReviewsSection } from "@/components/sections/lingo/home/ReviewsSection"
import { FAQSection } from "@/components/sections/lingo/FAQSection"
import { CTASection } from "@/components/sections/lingo/CTASection"
import { Footer } from "@/components/layout/lingo/Footer"
import { componentNameDebugProps } from "@/lib/component-name-debug";

export default function HomePage() {
  return (
    <main {...componentNameDebugProps("HomePage")} className="relative isolate overflow-hidden bg-[var(--bg)]">
      <div className="relative z-10 flex flex-col items-center">
        <HeroSection />
        <div className="section-gap w-full">
          <FeatureBento />
        </div>
        {/*
        <div className="section-gap w-full">
          <ReviewsSection />
        </div>
        */}
        <div className="section-gap w-full">
          <FAQSection />
        </div>
        <div className="section-gap w-full">
          <CTASection />
        </div>
        <div className="section-gap w-full">
          <Footer />
        </div>
      </div>
    </main>
  )
}
