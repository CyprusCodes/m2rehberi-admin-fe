'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Camera, Radio, Heart, MessageCircle, Megaphone, Users } from 'lucide-react'
import Link from 'next/link'

export function LandingHero() {
  const featurePills = [
    { icon: Camera, text: 'Oyun anlarını paylaş' },
    { icon: Users, text: 'Yayıncı profillerini takip et' },
    { icon: Radio, text: '"Yayındayım" ile yayını duyur' },
    { icon: Heart, text: 'Beğeni & yorumla etkileşim kur' },
  ]

  const highlightCards = [
    {
      icon: MessageCircle,
      title: 'Sosyal Akış',
      description: 'Takip ettiğin yayıncıların gönderilerini, kliplerini ve duyurularını tek akışta yakala.'
    },
    {
      icon: Radio,
      title: 'Canlı Yayın Ünitesi',
      description: 'Yayın açmadan önce "Yayındayım" deyip linkini bırak, herkes nerede canlı olduğunu anında bilsin.'
    },
    {
      icon: Users,
      title: 'Topluluğunu Büyüt',
      description: 'Yayıncı profili aç, takipçilerini yönet, oyuncularla birebir etkileşim kur.'
    },
    {
      icon: Megaphone,
      title: 'OynaGG Sunucu Duyuruları',
      description: 'Yeni OynaGG sunucunu banner ve ana sayfa vitrinleriyle binlerce oyuncuya tanıt.'
    }
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient - Dark Purple to Blue */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1625] via-[#1e293b] to-[#0f172a]" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-gradient-to-br from-purple-600/20 to-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/5 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/10 rounded-full blur-3xl" />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-primary/20 rounded-full animate-pulse" />
      <div className="absolute top-40 right-20 w-2 h-2 bg-primary/30 rounded-full animate-ping" />
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-primary/25 rounded-full animate-bounce" />
      <div className="absolute bottom-20 right-10 w-2 h-2 bg-primary/35 rounded-full animate-pulse" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Badge */}
          <Badge variant="outline" className="mx-auto bg-gradient-to-r from-indigo-500/20 to-slate-500/10 border-indigo-500/30 text-indigo-200">
            🎮 Oyna.gg Gaming Sosyal Platformu
          </Badge>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-indigo-200 via-blue-200 to-slate-100 bg-clip-text text-transparent">Oyna.gg topluluğu</span>
              <span className="block mt-2 text-gray-100">için canlı sosyal platform</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Yayıncı profilleri aç, oyun kliplerini paylaş, "Yayındayım" ile canlı yayınını duyur. 
              Yeni sunucularını banner ve ana sayfa vitrinleriyle binlerce oyuncuya göster.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {featurePills.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-card/70 backdrop-blur border border-border/50 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
              >
                <feature.icon className="w-4 h-4 text-indigo-200" />
                <span className="text-sm font-medium text-gray-200">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Main Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {highlightCards.map((item, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-slate-950/40 to-indigo-950/20 border-indigo-500/20 hover:border-indigo-400/40"
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-slate-500/20 rounded-lg flex items-center justify-center mx-auto group-hover:from-indigo-500/30 group-hover:to-slate-500/30 transition-all">
                    <item.icon className="w-6 h-6 text-indigo-200" />
                  </div>
                  <h3 className="font-semibold text-gray-100">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/register">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-indigo-600 to-slate-600 hover:from-indigo-500 hover:to-slate-500 text-white shadow-lg shadow-indigo-500/25 group min-w-[220px]"
              >
                Platforma Katıl
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-indigo-500/40 hover:bg-indigo-500/10 text-gray-200 min-w-[220px]"
              onClick={() => document.getElementById('server-announcement')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Sunucunu Duyur
            </Button>
          </div>

          {/* Companion Caption */}
          <div className="max-w-3xl mx-auto pt-12 border-t border-indigo-500/20">
            <p className="text-sm md:text-base text-gray-400">
              Oyna.gg oyuncuların sosyal medyasıdır: Yayından haberdar ol, sevdiğin yayıncıları takip et, 
              OynaGG sunucu duyurularını tek merkezden yönet.
            </p>
          </div>
        </div>
      </div>

    </section>
  )
}
