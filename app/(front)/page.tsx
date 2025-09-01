import { LandingNavbar } from '@/components/landing/navbar'
import { LandingHero } from '@/components/landing/hero'
import { LandingFeatures } from '@/components/landing/features'
import { LandingMobileApp } from '@/components/landing/mobile-app'
import { LandingFooter } from '@/components/landing/footer'

export default function FrontendPage() {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingMobileApp />
      </main>
      <LandingFooter />
    </div>
  )
}
