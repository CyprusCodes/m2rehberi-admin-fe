'use client'

import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Server, 
  Clock, 
  Users, 
  Star,
  TrendingUp,
  Megaphone,
  Crown,
  Sparkles,
  Radio,
  Calendar
} from 'lucide-react'

export function ServerAnnouncement() {
  const featuredServers = [
    {
      name: "Legends MT2",
      type: "PvP Hardcore",
      openDate: "25 Aralık 2024",
      badge: "YENİ",
      badgeColor: "bg-green-500",
      players: "5000+",
      rating: "4.8",
      features: ["Yeni Sistemler", "Aktif GM", "Haftalık Event"],
      premium: true
    },
    {
      name: "Dragon World",
      type: "Farm Server",
      openDate: "1 Ocak 2025", 
      badge: "YAKINDA",
      badgeColor: "bg-orange-500",
      players: "Ön Kayıt",
      rating: "Yeni",
      features: ["Kolay Farm", "Yeni Başlayan Dostu", "Günlük Ödüller"],
      premium: true
    },
    {
      name: "Classic MT2",
      type: "Oldschool",
      openDate: "Aktif",
      badge: "POPÜLER",
      badgeColor: "bg-purple-500",
      players: "3000+",
      rating: "4.5",
      features: ["Klasik Oynanış", "Nostalji", "Dengeli PvP"],
      premium: false
    }
  ]

  const serverSteps = [
    {
      icon: Megaphone,
      title: 'Sunucunu Kaydet',
      description: 'Server başvuru formunu doldur, sunucunun detaylarını paylaş.'
    },
    {
      icon: Calendar,
      title: 'Açılışını Planla',
      description: 'Açılış tarihini ve etkinliklerini gir, topluluğa geri sayım başlat.'
    },
    {
      icon: Radio,
      title: 'Banner ile Öne Çık',
      description: 'Ana sayfa banner ve yayıncı vitrinlerinde görün, oyuncuları yayına yönlendir.'
    }
  ]

  return (
    <section id="server-announcement" className="py-20 bg-gradient-to-b from-[#0f172a] to-[#1a1625]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-gradient-to-r from-orange-500/15 to-purple-500/15 border-orange-500/30 text-orange-300">
            <Server className="w-4 h-4 mr-2" />
            OynaGG Sunucu Vitrini
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-300 to-purple-300 bg-clip-text text-transparent">
              Sunucunu Oyna.gg'de
            </span>
            <span className="block mt-2 text-gray-200">Binlerce Oyuncuya Duyur</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            OynaGG sunucunu Oyna.gg ana sayfa banner'larında, yayıncı vitrinlerinde ve topluluk akışında tanıt. 
            Tek form ile sunucunu kaydet, açılışını planla, "Yayındayım" rozetiyle canlı yayınını öne çıkar.
          </p>
        </div>

        {/* Featured Servers Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {featuredServers.map((server, index) => (
            <Card 
              key={index} 
              className={`group hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                server.premium 
                  ? 'bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/30 hover:border-orange-400/50' 
                  : 'bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700/50 hover:border-gray-600/50'
              }`}
            >
              {server.premium && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-bl-lg">
                  <Crown className="w-3 h-3 inline mr-1" />
                  Premium
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-100 mb-1">{server.name}</h3>
                    <p className="text-sm text-gray-400">{server.type}</p>
                  </div>
                  <Badge className={`${server.badgeColor} text-white border-none`}>
                    {server.badge}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{server.openDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{server.players}</span>
                  </div>
                  {server.rating !== "Yeni" && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300">{server.rating}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {server.features.map((feature, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-1 text-xs bg-gradient-to-r from-purple-900/30 to-blue-900/30 text-gray-300 px-2 py-1 rounded-full"
                      >
                        <Sparkles className="w-3 h-3 text-purple-300" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      server.premium
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400'
                        : 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500'
                    } text-white`}
                    size="sm"
                  >
                    Sunucu Sayfasını Aç
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Steps */}
        <div className="bg-gradient-to-r from-orange-900/15 via-purple-900/15 to-blue-900/15 border border-orange-500/30 rounded-2xl p-8 mb-12">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-100 mb-4">Sunucunu Vitrine Taşımanın 3 Adımı</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Başvurunu gönder, banner alanını planla, yayına çıktığın an toplulukla buluş. Tüm süreç Oyna.gg panelinden takip edilir.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {serverSteps.map((step, index) => (
              <Card key={index} className="bg-gradient-to-br from-gray-900/70 to-gray-800/60 border border-orange-500/25">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-orange-500/20 to-purple-500/20 flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-orange-300" />
                  </div>
                  <h4 className="font-semibold text-gray-100">{step.title}</h4>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-orange-900/20 via-red-900/20 to-purple-900/20 border border-orange-500/30 rounded-2xl p-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full">
              <Megaphone className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">Reklam Alanı</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold">
              <span className="bg-gradient-to-r from-orange-300 to-purple-300 bg-clip-text text-transparent">
                Sunucunu ve Yayınını Öne Çıkar!
              </span>
            </h3>
            
            <p className="text-gray-400 max-w-2xl mx-auto">
              Oyna.gg'nin binlerce aktif oyuncusuna sunucunu anlat. Banner alanları, ana sayfa spotlight kartları 
              ve "Yayındayım" bildirimleriyle yayıncılarını destekle.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-sm font-semibold text-gray-200">%300 Daha Fazla</div>
                <div className="text-xs text-gray-400">Görünürlük</div>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-sm font-semibold text-gray-200">50K+ Oyuncu</div>
                <div className="text-xs text-gray-400">Erişim</div>
              </div>
              <div className="text-center">
                <Star className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-sm font-semibold text-gray-200">Premium Badge</div>
                <div className="text-xs text-gray-400">Öne Çıkma</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-400 hover:to-purple-400 text-white shadow-lg shadow-orange-500/25"
              >
                Sunucu Başvurusu Yap
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-orange-500/30 hover:bg-orange-500/10 text-gray-300"
              >
                Banner Planını Görüş
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
