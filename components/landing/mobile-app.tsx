'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Smartphone, 
  Gamepad2, 
  Bell, 
  MessageCircle, 
  Radio, 
  Megaphone,
  Apple,
  Play,
  Download,
  Star,
  Users,
  Zap,
  Shield
} from 'lucide-react'

export function LandingMobileApp() {
  const mobileFeatures = [
    {
      icon: Bell,
      title: 'Canlı Yayın Bildirimleri',
      description: 'Takip ettiğin yayıncı "Yayındayım" dediğinde telefonunda anında gör.',
      color: 'from-red-500/20 to-pink-500/20',
      iconColor: 'text-red-400'
    },
    {
      icon: MessageCircle,
      title: 'Sosyal Akış',
      description: 'Paylaşımları beğen, yorum yap, toplulukla etkileşimde kal.',
      color: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-400'
    },
    {
      icon: Megaphone,
      title: 'Sunucu Duyuruları',
      description: 'Metin2 sunucularının açılış tarihlerini ve kampanyalarını kaçırma.',
      color: 'from-orange-500/20 to-yellow-500/20',
      iconColor: 'text-orange-400'
    },
    {
      icon: Radio,
      title: 'Yayın Linkleri',
      description: 'Tüm yayın linklerini tek dokunuşla aç, canlıya hızlı bağlan.',
      color: 'from-purple-500/20 to-indigo-500/20',
      iconColor: 'text-purple-400'
    }
  ]

  const stats = [
    { icon: Users, value: '10K+', label: 'Aktif Kullanıcı' },
    { icon: Star, value: '4.9', label: 'Uygulama Puanı' },
    { icon: Zap, value: '99.9%', label: 'Uptime' },
    { icon: Shield, value: 'SSL', label: 'Güvenli' }
  ]

  return (
    <section id="mobile" className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#05060c] via-[#040512] to-[#02030a]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-10">
            {/* Header */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/30 text-indigo-300 px-4 py-2 text-sm font-medium">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Oyna.gg Mobil
                </Badge>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">4.9/5</span>
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Yayıncılarını
                <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Her Yerden Takip Et
                </span>
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Oyna.gg mobil uygulamasıyla sosyal akış cebine gelir. "Yayındayım" bildirimlerini yakala, 
                Metin2 sunucu duyurularını takip et, favori yayıncılarının paylaşımlarını kaçırma.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl hover:border-indigo-400/30 transition-all duration-300">
                  <stat.icon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {mobileFeatures.map((feature, index) => (
                <Card key={index} className="group border-border/50 hover:border-indigo-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2 text-foreground group-hover:text-indigo-300 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Download Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Download className="w-6 h-6 text-indigo-400" />
                <h3 className="text-2xl font-bold">Hemen İndir</h3>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex items-center gap-4 border-2 border-border/50 hover:border-indigo-400/50 hover:bg-indigo-500/5 group transition-all duration-300 h-16 px-6"
                  disabled
                >
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Apple className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground font-medium">App Store'dan</div>
                    <div className="font-bold text-base">İndir</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex items-center gap-4 border-2 border-border/50 hover:border-green-400/50 hover:bg-green-500/5 group transition-all duration-300 h-16 px-6"
                  disabled
                >
                  <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground font-medium">Google Play'den</div>
                    <div className="font-bold text-base">İndir</div>
                  </div>
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                <span>Mobil uygulamalarımız çok yakında! Yayınlandığında haberdar olmak için kayıt ol.</span>
              </div>
            </div>
          </div>

          {/* Mobile Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative z-10 bg-gradient-to-b from-gray-900 to-gray-800 rounded-[3rem] p-2 shadow-2xl shadow-indigo-500/20">
                <div className="bg-background rounded-[2.5rem] p-1">
                  <div className="bg-gradient-to-b from-background to-muted/20 rounded-[2.2rem] p-6 h-[700px] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center mb-8 text-sm">
                      <span className="font-bold">9:41</span>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-3 bg-primary rounded-full">
                          <div className="w-4 h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full ml-0.5" />
                        </div>
                        <div className="w-6 h-3 border-2 border-foreground rounded-sm">
                          <div className="w-4 h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-sm" />
                        </div>
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                        <Gamepad2 className="w-8 h-8 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">OYNA.GG</h3>
                        <p className="text-sm text-muted-foreground">Gaming Sosyal Medya</p>
                      </div>
                    </div>

                    {/* Live Highlights */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-xs text-red-400 font-medium">Şu an canlı</span>
                          </div>
                          <div className="text-base font-bold text-foreground">YayinciSample</div>
                          <div className="text-xs text-muted-foreground">twitch.tv/yayinci</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/20">
                        <CardContent className="p-4">
                          <div className="text-xs text-orange-400 font-medium mb-2">Yeni sunucu</div>
                          <div className="text-base font-bold text-foreground">Dragon Storm</div>
                          <div className="text-xs text-muted-foreground">Açılış: 12 Ocak</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Feature List */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/30">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                          <Bell className="w-5 h-5 text-red-400" />
                        </div>
                        <span className="text-sm font-medium">"Yayındayım" bildirimi: YayinciSample canlı!</span>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/30">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-sm font-medium">Yeni yorum: "Bu klip efsane!"</span>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/30">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg flex items-center justify-center">
                          <Megaphone className="w-5 h-5 text-orange-400" />
                        </div>
                        <span className="text-sm font-medium">Metin2: Sunucu açılışına 2 gün kaldı</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-gradient-to-r from-pink-500/30 to-orange-500/30 rounded-full animate-bounce" />
              <div className="absolute top-1/2 -right-8 w-6 h-6 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full animate-ping" />
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl -z-10 scale-150" />
          </div>
        </div>
      </div>
    </section>
  )
}
