"use client"

import { useRef, useState, useEffect } from "react"
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

function LazySection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if(e.isIntersecting){setShow(true);ob.disconnect()} }, {rootMargin:'200px'})
    if(ref.current) ob.observe(ref.current)
    return () => ob.disconnect()
  }, [])
  return <div ref={ref}>{show ? children : <div className="min-h-screen"/>}</div>
}

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <AboutSection />
      
      <LazySection>
        <CricketJourneySection />
      </LazySection>
      
      <LazySection>
        <PerformanceStatsSection />
      </LazySection>
      
      <LazySection>
        <AchievementsSection />
      </LazySection>
      
      <CertificatesSection />
      
      <LazySection>
        <GallerySection />
      </LazySection>
      
      <CTASection />
      <PremiumFooter />
    </main>
  )
}
