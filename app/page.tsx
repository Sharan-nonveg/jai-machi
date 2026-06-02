"use client"

import dynamic from "next/dynamic"
import { CTASection } from "@/components/cta-section"
import { PremiumFooter } from "@/components/premium-footer"

const Navbar = dynamic(() => import("@/components/navbar"), { ssr: false })
const HeroSection = dynamic(() => import("@/components/hero-section"), { ssr: false })
const AboutSection = dynamic(() => import("@/components/about-section"), { ssr: false })
const CricketJourneySection = dynamic(() => import("@/components/cricket-journey-section"), { ssr: false })
const PerformanceStatsSection = dynamic(() => import("@/components/performance-stats-section").then(mod => ({ default: mod.PerformanceStatsSection })), { ssr: false })
const AchievementsSection = dynamic(() => import("@/components/achievements-section").then(mod => ({ default: mod.AchievementsSection })), { ssr: false })
const CertificatesSection = dynamic(() => import("@/components/certificates-section").then(mod => ({ default: mod.CertificatesSection })), { ssr: false })
const GallerySection = dynamic(() => import("@/components/gallery-section").then(mod => ({ default: mod.GallerySection })), { ssr: false })

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <CricketJourneySection />
      <PerformanceStatsSection />
      <AchievementsSection />
      <CertificatesSection />
      <GallerySection />
      <CTASection />
      <PremiumFooter />
    </main>
  )
}
