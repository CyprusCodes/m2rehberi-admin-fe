'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Camera, Heart, MessageCircle, Radio, Users, Megaphone } from 'lucide-react'

export function ForGamers() {
  const features = [
    {
      icon: Camera,
      title: 'Oyun Anlarını Paylaş',
      description: 'Screenshot, klip ve güncellemelerini tek tuşla topluluğunla buluştur.',
      highlights: ['Fotoğraf & video yükle', 'Profilinde öne çıkar', 'Takipçilerinin akışında görünsün']
    },
    {
      icon: Heart,
      title: 'Beğen & Yorum Yap',
      description: 'Sevdiğin yayıncıları destekle, topluluk sohbetlerine katıl.',
      highlights: ['Kalp bırak', 'Yorum yaz', 'Yanıtlarla konuşmayı sürdür']
    },
    {
      icon: Users,
      title: 'Takipte Kal',
      description: 'Yayıncı profillerini takip et, paylaşımlarını ve canlı yayınlarını kaçırma.',
      highlights: ['Takip listeni yönet', 'Yeni paylaşımlardan haberdar ol', 'Canlı linkleri gör']
    },
    {
      icon: Radio,
      title: '"Yayındayım" Rozeti',
      description: 'Takip ettiğin yayıncı yayına çıkınca feed\'inde hemen gör ve canlıya tıkla.',
      highlights: ['Canlı rozetini anında yakala', 'Yayın linkine tek dokunuş', 'Destek mesajı bırak']
    }
  ]

  return (
    <section id="for-gamers" className="py-20 bg-gradient-to-b from-[#1a1625] to-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-gradient-to-r from-indigo-500/10 to-slate-500/10 border-indigo-500/20 text-indigo-300">
            <Camera className="w-4 h-4 mr-2" />
            Oyuncular İçin
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-300 to-slate-200 bg-clip-text text-transparent">
              Gaming İçeriklerini
            </span>
            <span className="block mt-2 text-gray-200">Paylaş & Keşfet</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Oyna.gg oyuncular için tasarlandı. Favori yayıncılarını takip et, canlı yayınlara tek dokunuşla bağlan, 
            topluluğunla birlikte yeni OynaGG sunucularını keşfet.
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        {/* Social Features Section */}
        <div className="bg-gradient-to-br from-slate-900/40 to-indigo-900/30 border border-indigo-500/20 rounded-2xl p-8 lg:p-12 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-300 to-slate-200 bg-clip-text text-transparent">
                Tek Akışta Oyna.gg Deneyimi
              </span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Takip ettiğin yayıncıların canlı yayın bildirimleri, paylaşımları ve OynaGG sunucu duyuruları 
              tek bir yerde birleşiyor.
            </p>
          </div>

          {/* Social Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: MessageCircle, title: 'Topluluk Akışı', desc: 'Yayıncı ve oyuncu paylaşımlarını zamanında yakala.' },
              { icon: Radio, title: 'Canlı Yayın Alarmı', desc: '"Yayındayım" rozetiyle o an canlı olan yayıncıyı gör.' },
              { icon: Heart, title: 'Destek Gönder', desc: 'Kalp bırak, yorum yaz, yayın öncesi motive et.' },
              { icon: Megaphone, title: 'Sunucu Haberleri', desc: 'Yeni OynaGG sunucularını banner ve vitrinlerden keşfet.' }
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-900/60 to-gray-800/60 border-indigo-500/20 hover:border-indigo-400/30">
                <CardContent className="p-6 space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-slate-500/20 rounded-lg flex items-center justify-center mx-auto">
                    <feature.icon className="w-6 h-6 text-indigo-300" />
                  </div>
                  <h4 className="font-semibold text-gray-200">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How It Works */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-slate-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-300">1</span>
              </div>
              <h4 className="font-semibold mb-2 text-gray-200">Hesap Oluştur</h4>
              <p className="text-sm text-gray-400">E-posta veya sosyal medya hesabınla kayıt ol</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-slate-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-300">2</span>
              </div>
              <h4 className="font-semibold mb-2 text-gray-200">Profilini Tamamla</h4>
              <p className="text-sm text-gray-400">Oynadığın oyunları ekle, profilini özelleştir</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-slate-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-300">3</span>
              </div>
              <h4 className="font-semibold mb-2 text-gray-200">Paylaşmaya Başla</h4>
              <p className="text-sm text-gray-400">İçeriklerini paylaş, arkadaşlarınla etkileş</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
