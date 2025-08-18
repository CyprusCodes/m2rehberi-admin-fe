'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Smartphone, 
  Download, 
  Bell, 
  MessageCircle, 
  BarChart3, 
  Settings,
  Apple,
  Play
} from 'lucide-react'

export function LandingMobileApp() {
  const mobileFeatures = [
    {
      icon: Bell,
      title: 'Push Notifications',
      description: 'Stay updated with real-time server alerts and player activities'
    },
    {
      icon: MessageCircle,
      title: 'Mobile Chat',
      description: 'Communicate with players directly from your mobile device'
    },
    {
      icon: BarChart3,
      title: 'Live Analytics',
      description: 'Monitor server performance and statistics on the go'
    },
    {
      icon: Settings,
      title: 'Remote Management',
      description: 'Manage server settings and configurations remotely'
    }
  ]

  return (
    <section id="mobile" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <Badge variant="outline" className="mb-4 bg-primary/10 border-primary/20 text-primary">
                📱 Mobile Application
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Manage Your Server
                <span className="block text-primary">Anywhere, Anytime</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Take full control of your Metin2 server with our powerful mobile application. 
                Available for both Android and iOS devices, bringing professional server management to your fingertips.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {mobileFeatures.map((feature, index) => (
                <div key={index} className="flex gap-3 p-4 bg-card border border-border/50 rounded-lg hover:border-primary/20 transition-colors">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Download Buttons */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Download Now</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex items-center gap-3 border-2 hover:bg-muted/50 group"
                  disabled
                >
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <Apple className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">Download on the</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex items-center gap-3 border-2 hover:bg-muted/50 group"
                  disabled
                >
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">Get it on</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Mobile applications are coming soon. Sign up to be notified when they're available!
              </p>
            </div>
          </div>

          {/* Mobile Mockup */}
          <div className="relative">
            <div className="relative mx-auto max-w-sm">
              {/* Phone Frame */}
              <div className="relative z-10 bg-gray-900 rounded-[2.5rem] p-4 shadow-2xl">
                <div className="bg-background rounded-[2rem] p-6 h-[600px] overflow-hidden">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center mb-6 text-xs">
                    <span className="font-semibold">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 bg-primary rounded-sm" />
                      <div className="w-6 h-3 border border-foreground rounded-sm">
                        <div className="w-4 h-full bg-primary rounded-sm" />
                      </div>
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">M2Rehberi</h3>
                      <p className="text-xs text-muted-foreground">Server Dashboard</p>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-primary/10 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-primary">127</div>
                      <div className="text-xs text-muted-foreground">Online Players</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <div className="text-lg font-bold">98%</div>
                      <div className="text-xs text-muted-foreground">Server Uptime</div>
                    </div>
                  </div>

                  {/* Feature List */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border/50">
                      <Bell className="w-5 h-5 text-primary" />
                      <span className="text-sm">Push Notifications</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border/50">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      <span className="text-sm">Live Chat</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border/50">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      <span className="text-sm">Real-time Analytics</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary/30 rounded-full animate-bounce" />
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
