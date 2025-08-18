'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Server, 
  MessageSquare, 
  Megaphone, 
  Users, 
  BarChart3, 
  Shield, 
  Clock, 
  Gamepad2,
  Settings,
  Heart,
  Zap,
  Globe
} from 'lucide-react'

export function LandingFeatures() {
  const mainFeatures = [
    {
      icon: Server,
      title: 'Server Management',
      description: 'Complete control over your Metin2 servers with advanced monitoring and management tools.',
      features: ['Real-time monitoring', 'Performance analytics', 'Automated backups', 'Custom configurations']
    },
    {
      icon: MessageSquare,
      title: 'Forum System',
      description: 'Build vibrant communities with our integrated forum system designed for gaming communities.',
      features: ['Topic management', 'User moderation', 'Rich text editor', 'Mobile responsive']
    },
    {
      icon: Megaphone,
      title: 'Advertisement Platform',
      description: 'Promote your server and monetize your platform with our integrated advertising system.',
      features: ['Banner ads', 'Sponsored posts', 'Analytics dashboard', 'Revenue tracking']
    },
    {
      icon: Users,
      title: 'Player Communication',
      description: 'Stay connected with your players through multiple communication channels.',
      features: ['In-game messaging', 'Discord integration', 'Announcements', 'Event notifications']
    }
  ]

  const additionalFeatures = [
    { icon: BarChart3, title: 'Analytics Dashboard', description: 'Comprehensive insights into player behavior and server performance' },
    { icon: Shield, title: 'Security Features', description: 'Advanced security measures to protect your server and player data' },
    { icon: Clock, title: '24/7 Monitoring', description: 'Round-the-clock server monitoring with instant alerts' },
    { icon: Gamepad2, title: 'Game Integration', description: 'Deep integration with Metin2 game mechanics and features' },
    { icon: Settings, title: 'Customization', description: 'Fully customizable interface and settings for your needs' },
    { icon: Heart, title: 'Community Support', description: 'Active community and dedicated support team' },
    { icon: Zap, title: 'Performance Optimization', description: 'Optimized for speed and reliability' },
    { icon: Globe, title: 'Multi-language', description: 'Support for multiple languages and regions' }
  ]

  return (
    <section id="features" className="py-20 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-primary/10 border-primary/20 text-primary">
            🚀 Platform Features
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to
            <span className="block text-primary">Manage Your Server</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools you need to create, manage, and grow your Metin2 server community.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {additionalFeatures.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-card border border-border/50 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of server owners who trust M2Rehberi for their Metin2 server management needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">Free</div>
                <div className="text-sm text-muted-foreground">Basic Features</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">Premium</div>
                <div className="text-sm text-muted-foreground">Advanced Tools</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">Enterprise</div>
                <div className="text-sm text-muted-foreground">Custom Solutions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
