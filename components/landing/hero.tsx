'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Shield, Zap, Users, Star } from 'lucide-react'
import Link from 'next/link'

export function LandingHero() {
  const features = [
    { icon: Shield, text: 'Secure Management' },
    { icon: Zap, text: 'Lightning Fast' },
    { icon: Users, text: 'Community Driven' },
    { icon: Star, text: 'Premium Features' },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute inset-0 bg-[url('/metin2-bg.png')] bg-cover bg-center opacity-5" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-primary/20 rounded-full animate-pulse" />
      <div className="absolute top-40 right-20 w-2 h-2 bg-primary/30 rounded-full animate-ping" />
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-primary/25 rounded-full animate-bounce" />
      <div className="absolute bottom-20 right-10 w-2 h-2 bg-primary/35 rounded-full animate-pulse" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Badge */}
          <Badge variant="outline" className="mx-auto bg-primary/10 border-primary/20 text-primary">
            🎮 Welcome to M2Rehberi Platform
          </Badge>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              Welcome to
              <span className="block text-primary font-black">M2Rehberi</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The ultimate platform for Metin2 server management, community building, and player engagement
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-border/50 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
              >
                <feature.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Main Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Server Management</h3>
                <p className="text-sm text-muted-foreground">Add and manage your Metin2 servers with ease</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Community Forums</h3>
                <p className="text-sm text-muted-foreground">Create forums and engage with your players</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Advertisement System</h3>
                <p className="text-sm text-muted-foreground">Promote your server with our ad platform</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Mobile App</h3>
                <p className="text-sm text-muted-foreground">Access everything on Android & iOS</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/login">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg group min-w-[200px]"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 hover:bg-muted/50 min-w-[200px]"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-border/50">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Active Servers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Players</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full blur-3xl" />
    </section>
  )
}
