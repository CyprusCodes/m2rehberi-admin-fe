import { LandingHero } from '@/components/landing/hero'
import { LandingFeatures } from '@/components/landing/features'
import { LandingMobileApp } from '@/components/landing/mobile-app'
import { ServerApplicationForm } from '@/components/landing/server-application-form'
import { Rocket } from 'lucide-react'

export default function FrontendPage() {
  return (
    <div className="min-h-screen">
      <main>
        <LandingHero />
        
        {/* Server Application Section */}
        <section id="server-application" className="relative py-24 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/10 to-background" />
          <div className="absolute inset-0 bg-[url('/metin2-bg.png')] bg-cover bg-center opacity-5" />
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-4 h-4 bg-primary/20 rounded-full animate-pulse" />
          <div className="absolute top-40 right-32 w-2 h-2 bg-primary/30 rounded-full animate-ping" />
          <div className="absolute bottom-32 left-32 w-3 h-3 bg-primary/25 rounded-full animate-bounce" />
          <div className="absolute bottom-20 right-20 w-2 h-2 bg-primary/35 rounded-full animate-pulse" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                <Rocket className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Server Başvuru</span>
              </div>
              
              {/* Heading */}
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                  Ready to Launch
                  <span className="block text-primary">Your Server?</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Server'ınızı M2Rehberi platformuna eklemek için aşağıdaki formu doldurun. 
                  Ekibimiz en kısa sürede size dönüş yapacak.
                </p>
              </div>
              
              {/* Form */}
              <div className="max-w-4xl mx-auto">
                <ServerApplicationForm />
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full blur-3xl" />
        </section>
        
        <LandingFeatures />
        <LandingMobileApp />
      </main>
    </div>
  )
}
