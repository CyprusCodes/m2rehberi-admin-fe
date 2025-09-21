import { LandingHero } from '@/components/landing/hero'
import { LandingFeatures } from '@/components/landing/features'
import { LandingMobileApp } from '@/components/landing/mobile-app'
import { ForGamers } from '@/components/landing/for-gamers'
import { ForStreamers } from '@/components/landing/for-streamers'
import { ServerAnnouncement } from '@/components/landing/server-announcement'

export default function FrontendPage() {
  return (
    <div className="min-h-screen">
      <main>
        <LandingHero />
        <ForGamers />
        <ForStreamers />
        <ServerAnnouncement />
        <LandingFeatures />
        <LandingMobileApp />
      </main>
    </div>
  )
}
