'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Radio, Users, Megaphone, Heart, Eye, Share2, Smartphone } from 'lucide-react'

export function LandingFeatures() {
  const mainFeatures = [
    {
      icon: MessageCircle,
      title: 'Sosyal Akış',
      description: 'Paylaşımlar, klipler ve Metin2 haberleri tek akışta birleşir.',
      features: ['Fotoğraf & video gönder', 'Topluluk yorumları', 'Destek mesajlarını topla', 'Favori paylaşımları sabitle']
    },
    {
      icon: Radio,
      title: '"Yayındayım" Merkezi',
      description: 'Canlı rozetini aç, yayın linkini bırak, takipçilerin saniyesinde haberdar olsun.',
      features: ['Çoklu platform linki', 'Canlı durum rozetleri', 'Takipçi akışında öne çık', 'Yayın sonrası geri bildirim al']
    },
    {
      icon: Users,
      title: 'Yayıncı Profilleri',
      description: 'Profilinde kim olduğunu anlat, topluluğunu ve içeriklerini yönet.',
      features: ['Biyografi & link koleksiyonu', 'Toplulukla yorumlaş', 'Takipçilerini yönet', 'Öne çıkan gönderiler oluştur']
    },
    {
      icon: Megaphone,
      title: 'Metin2 Sunucu Vitrini',
      description: 'Sunucu başvurusu yap, banner ve ana sayfa vitrinlerinde görün.',
      features: ['Sunucu başvuru formu', 'Banner alanı talebi', 'Ana sayfa spotlight kartları', 'Topluluğa özel kampanya paylaş']
    }
  ]

  const additionalFeatures = [
    { icon: Heart, title: 'Beğeni & Yorumlar', description: 'Topluluğundan anlık geri bildirim al, destek mesajlarını vitrinde tut.' },
    { icon: Eye, title: 'Canlı Yayın Takibi', description: 'Yayında olan yayıncıları ve sunucu etkinliklerini kaçırma.' },
    { icon: Share2, title: 'Linklerin Tek Yerde', description: 'Tüm yayın ve sosyal medya linklerini profilinde topla.' },
    { icon: Smartphone, title: 'Mobil Deneyim', description: 'Oyna.gg mobil uygulamasıyla akışını ve duyurularını cebinden yönet.' }
  ]

  return (
    <section id="features" className="py-20 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-gradient-to-r from-indigo-500/10 to-slate-500/10 border-indigo-500/20 text-indigo-300">
            🚀 Oyna.gg Özellikleri
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Metin2 Oyna.gg Topluluğunu
            <span className="block text-indigo-300">Tek Platformda Buluşturuyoruz</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Oyna.gg oyuncuların sosyal medyasıdır. Paylaş, canlı yayınını işaretle, Metin2 sunucunu duyur ve 
            topluluğunu aynı çatı altında büyüt.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-indigo-400/30">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/10 to-slate-500/10 rounded-lg flex items-center justify-center group-hover:from-indigo-500/20 group-hover:to-slate-500/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-indigo-300" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full" />
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
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-indigo-400/30 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/10 to-slate-500/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:from-indigo-500/20 group-hover:to-slate-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-indigo-300" />
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
            <h3 className="text-2xl font-bold mb-4">Hemen Başla, Topluluğa Katıl</h3>
            <p className="text-muted-foreground mb-6">
              Binlerce oyuncu ve yayıncının tercih ettiği Oyna.gg platformunda sen de yerini al.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-300">Ücretsiz</div>
                <div className="text-sm text-muted-foreground">Temel Özellikler</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-300">Pro</div>
                <div className="text-sm text-muted-foreground">Gelişmiş Araçlar</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-300">Partner</div>
                <div className="text-sm text-muted-foreground">Özel Çözümler</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
