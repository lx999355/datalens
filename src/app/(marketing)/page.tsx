import { HeroSection } from "@/modules/landing/components/HeroSection"
import { FeatureCards } from "@/modules/landing/components/FeatureCards"
import { PricingPreview } from "@/modules/landing/components/PricingPreview"
import { Footer } from "@/modules/landing/components/Footer"

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <FeatureCards />
      <PricingPreview />
      <Footer />
    </div>
  )
}