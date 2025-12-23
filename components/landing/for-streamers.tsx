'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Wifi, Users, Heart, MessageCircle, Radio, Eye, Share2, Megaphone, Crown } from 'lucide-react'

export function ForStreamers() {
  const features = [
    {
      icon: Radio,
      title: '"Yayındayım" Bildirimi',
      description: 'Twitch, YouTube veya istediğin platformda yayını başlat, Oyna.gg\'de "Yayındayım" diyerek linkini sabitle.',
      highlights: ['Tek dokunuşla canlı rozet', 'Yayın linkini paylaş', 'Feed\'de anında görün', 'Takipçilerin hızlıca bağlansın']
    },
    {
      icon: Users,
      title: 'Takipçi Topluluğu',
      description: 'Takipçi kitleni yönet, yayın sonrası geri bildirim topla, topluluğunu sıcak tut.',
      highlights: ['Takipçi listene göz at', 'Beğeni ve yorumlarla etkileşim', 'Destek mesajlarını öne çıkar', 'Sadık takipçilerle bağ kur']
    },
    {
      icon: MessageCircle,
      title: 'Yayıncı Profili',
      description: 'Profilinde kim olduğunu anlat, sabit gönderilerle yayına hazırlık yap, linklerini tek yerde tut.',
      highlights: ['Hakkında alanını doldur', 'Sosyal linklerini ekle', 'Öne çıkan kliplerini paylaş', 'Topluluk gönderilerini sabitle']
    },
    {
      icon: Megaphone,
      title: 'Sunucu & Banner Vitrini',
      description: 'OynaGG sunucunu veya yayını ana sayfa banner\'ları ve vitrin kartlarıyla öne çıkar.',
      highlights: ['Banner alanı talep et', 'Ana sayfa spotlight\'ı kullan', 'Sunucu duyurusu planla', 'Topluluğa özel kampanya başlat']
    }
  ]

  const streamingBenefits = [
    { icon: Eye, title: 'Daha Fazla Görünürlük', desc: 'Canlı rozetin ve banner vitrinleriyle keşfedil.' },
    { icon: Share2, title: 'Tek Link Paneli', desc: 'Bütün yayın kanallarını tek yerden paylaş.' },
    { icon: Heart, title: 'Topluluğunla Bağ Kur', desc: 'Beğeni ve yorumlarla etkileşimi sıcak tut.' },
    { icon: Megaphone, title: 'Sunucu Sponsorluğu', desc: 'OynaGG sunucu duyurularını takipçilerinle paylaş.' }
  ]

  return (
    <section id="for-streamers" className="py-20 bg-gradient-to-b from-[#0b111e] to-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-gradient-to-r from-indigo-500/10 to-slate-500/10 border-indigo-500/20 text-indigo-300">
            <Wifi className="w-4 h-4 mr-2" />
            Yayıncılar İçin
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-300 to-slate-200 bg-clip-text text-transparent">
              Yayındayım İşaretle
            </span>
            <span className="block mt-2 text-gray-200">Takipçilerin Haberdar Olsun</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Hangi platformda yayın açarsan aç, Oyna.gg'de "Yayındayım" diyerek linkini sabitle; 
            takipçilerin akışta seni canlı görsün. Profilini güçlendir, topluluğunu yönet, yayınına daha fazla izleyici çek.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-slate-900/40 to-indigo-900/30 border-indigo-500/20 hover:border-indigo-400/40 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-600/10 to-transparent rounded-full -mr-16 -mt-16" />
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-slate-500/20 rounded-xl flex items-center justify-center group-hover:from-indigo-500/30 group-hover:to-slate-500/30 transition-all">
                    <feature.icon className="w-7 h-7 text-indigo-300" />
                  </div>
                  <CardTitle className="text-xl text-gray-200">{feature.title}</CardTitle>
                </div>
                <p className="text-gray-400">{feature.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {feature.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm bg-gradient-to-r from-slate-900/40 to-indigo-900/30 text-gray-300 px-3 py-2 rounded-lg">
                      <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works - Live Stream Alert */}
        <div className="bg-gradient-to-br from-slate-900/40 to-indigo-900/30 border border-indigo-500/20 rounded-2xl p-8 lg:p-12 mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-rose-600/20 border border-red-500/30 rounded-full mb-6">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-sm font-medium text-red-400">CANLI YAYIN</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-300 to-slate-200 bg-clip-text text-transparent">
                Nasıl Çalışır?
              </span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              3 adımda yayınını duyur, takipçilerini topla!
            </p>
          </div>

          {/* Steps */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-slate-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-indigo-300">1</span>
              </div>
              <h4 className="font-semibold mb-2 text-gray-200">Yayına Başla</h4>
              <p className="text-sm text-gray-400">Twitch, YouTube veya herhangi bir platformda yayınını aç</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-slate-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-indigo-300">2</span>
              </div>
              <h4 className="font-semibold mb-2 text-gray-200">Yayındayım İşaretle</h4>
              <p className="text-sm text-gray-400">Oyna.gg'de "Yayındayım" butonuna tıkla, yayın linkini ekle</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-slate-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-indigo-300">3</span>
              </div>
              <h4 className="font-semibold mb-2 text-gray-200">Takipçiler Gelsin</h4>
              <p className="text-sm text-gray-400">Takipçilerin Oyna.gg akışında "Yayında" rozetini görür ve yayınına katılır</p>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {streamingBenefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-900/60 to-gray-800/60 border-indigo-500/20 hover:border-indigo-400/30">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-slate-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-indigo-300" />
                  </div>
                  <h4 className="font-semibold mb-1 text-gray-200">{benefit.title}</h4>
                  <p className="text-sm text-gray-400">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Streamer Profile Preview */}
        <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/50 border border-indigo-500/20 rounded-2xl p-8 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-slate-500/20 border border-indigo-500/30 rounded-full">
                <Crown className="w-4 h-4 text-indigo-300" />
                <span className="text-sm font-medium text-indigo-300">Yayıncı Profili</span>
              </div>
              <h3 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-indigo-300 to-slate-100 bg-clip-text text-transparent">
                  Profesyonel Profilin
                </span>
                <span className="block mt-2 text-gray-200">Seni Bekliyor</span>
              </h3>
              <p className="text-gray-400">
                Yayıncı profiline biyografini ekle, canlı linklerini sabitle, kampanyalarını duyur. 
                Topluluğuna kendinden bahsetmek artık çok kolay.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-300 rounded-full" />
                  <span className="text-gray-300">Yayında rozetini ve yayın linkini profilinde öne çıkar</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-300 rounded-full" />
                  <span className="text-gray-300">Sosyal medya hesaplarını tek yerde topla</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-300 rounded-full" />
                  <span className="text-gray-300">OynaGG sunucu banner ve kampanyalarını vitrine taşı</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-300 rounded-full" />
                  <span className="text-gray-300">Topluluktan gelen yorum ve destekleri öne çıkar</span>
                </div>
              </div>
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-slate-600 hover:from-indigo-500 hover:to-slate-500 text-white shadow-lg shadow-indigo-500/25">
                Yayıncı Profili Oluştur
              </Button>
            </div>

            {/* Profile Mock */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-indigo-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-slate-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">YS</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-100">YayinciSample</h4>
                    <p className="text-sm text-gray-400">Profesyonel Yayıncı</p>
                  </div>
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                    Takip Et
                  </Button>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-red-500/20 to-indigo-500/20 border border-indigo-500/40 rounded-full text-xs font-medium text-indigo-200 mb-6">
                  <Radio className="w-4 h-4 text-red-400" />
                  YAYINDA
                  <span className="text-gray-400">• twitch.tv/yayinci</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                  <div>
                    <div className="text-xl font-bold text-gray-100">5.2K</div>
                    <div className="text-xs text-gray-400">Takipçi</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-100">342</div>
                    <div className="text-xs text-gray-400">Yayın</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-100">128K</div>
                    <div className="text-xs text-gray-400">Görüntülenme</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-300">
                    🎮 Variety Streamer | FPS & MOBA
                  </p>
                  <p className="text-sm text-gray-400">
                    Her gün 20:00'da yayındayım! Takip etmeyi unutma.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                      OynaGG
                    </Badge>
                    <Badge className="bg-slate-500/20 text-slate-200 border-slate-500/30">
                      PvP
                    </Badge>
                    <Badge className="bg-amber-500/20 text-amber-200 border-amber-500/30">
                      Sunucu Duyurusu
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-slate-900/40 via-indigo-900/30 to-gray-900/40 border border-indigo-500/30 rounded-2xl p-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-rose-600/20 border border-red-500/30 rounded-full mb-6">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="text-sm font-medium text-red-400">CANLI YAYIN BAŞLAT</span>
          </div>
          <h3 className="text-2xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-300 to-slate-200 bg-clip-text text-transparent">
              Şimdi Yayıncı Ol!
            </span>
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Oyna.gg'de yayıncı profili oluştur, "Yayındayım" özelliğini kullan,
            takipçilerini artır ve topluluğunu büyüt!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-slate-600 hover:from-indigo-500 hover:to-slate-500 text-white shadow-lg shadow-indigo-500/25">
              Hemen Başla
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-indigo-500/30 hover:bg-indigo-500/10 text-gray-300">
              Daha Fazla Bilgi
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
