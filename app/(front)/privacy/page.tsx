'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Shield, 
  Lock, 
  Eye, 
  Cookie, 
  UserCheck, 
  Mail,
  Database,
  FileText,
  Clock,
  Languages
} from 'lucide-react'

type Language = 'tr' | 'en'

export default function PrivacyPolicyPage() {
  const [language, setLanguage] = useState<Language>('tr')

  const content = {
    tr: {
      hero: {
        title: 'Gizlilik Politikası',
        description: 'Gizliliğiniz bizim için önemlidir. Bu politika, kişisel bilgilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.',
        lastUpdated: 'Son Güncelleme: 15 Ocak 2024'
      },
      tableOfContents: 'İçindekiler',
      sectionLabel: 'Bölüm',
      contactSection: {
        title: 'Sorularınız mı Var?',
        description: 'Bu Gizlilik Politikası hakkında herhangi bir sorunuz varsa, bizimle iletişime geçebilirsiniz.',
        email: 'info@oyna.gg'
      },
      sections: [
        {
          id: 'information-collection',
          title: 'Topladığımız Bilgiler',
          icon: Database,
          content: [
            {
              subtitle: 'Kayıt Bilgileri',
              text: 'Hesap oluşturduğunuzda e-posta adresiniz, kullanıcı adınız ve isteğe bağlı olarak telefon numaranızı topluyoruz.'
            },
            {
              subtitle: 'Kullanım Verileri',
              text: 'Platformumuzu nasıl kullandığınıza dair temel bilgiler (IP adresi, tarayıcı türü, ziyaret edilen sayfalar) otomatik olarak toplanır.'
            }
          ]
        },
        {
          id: 'how-we-use',
          title: 'Bilgilerinizi Nasıl Kullanıyoruz',
          icon: UserCheck,
          content: [
            {
              subtitle: 'Hizmet Sağlama',
              text: 'Bilgilerinizi platformumuzun çalışması, hesabınızın yönetimi ve size hizmet sunmak için kullanıyoruz.'
            },
            {
              subtitle: 'İletişim',
              text: 'Size hesabınız ve hizmetlerimiz hakkında önemli bildirimler göndermek için e-posta adresinizi kullanabiliriz.'
            }
          ]
        },
        {
          id: 'data-sharing',
          title: 'Bilgi Paylaşımı',
          icon: Eye,
          content: [
            {
              subtitle: 'Üçüncü Taraflar',
              text: 'Bilgilerinizi üçüncü taraflarla paylaşmıyoruz. Sadece yasal zorunluluk olması durumunda yetkili makamlara bilgi verebiliriz.'
            }
          ]
        },
        {
          id: 'data-security',
          title: 'Veri Güvenliği',
          icon: Lock,
          content: [
            {
              subtitle: 'Güvenlik Önlemleri',
              text: 'Kişisel bilgilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz. Verileriniz şifrelenmiş olarak saklanır.'
            }
          ]
        },
        {
          id: 'cookies',
          title: 'Çerezler',
          icon: Cookie,
          content: [
            {
              subtitle: 'Çerez Kullanımı',
              text: 'Platformumuzun düzgün çalışması için gerekli çerezler kullanıyoruz. Bu çerezler oturumunuzu ve tercihlerinizi hatırlamak için kullanılır.'
            }
          ]
        },
        {
          id: 'your-rights',
          title: 'Haklarınız',
          icon: FileText,
          content: [
            {
              subtitle: 'Erişim ve Düzeltme',
              text: 'Kişisel bilgilerinize hesap ayarlarınızdan erişebilir ve düzenleyebilirsiniz.'
            },
            {
              subtitle: 'Veri Silme',
              text: 'Hesabınızı ve verilerinizi istediğiniz zaman silebilirsiniz.'
            }
          ]
        }
      ]
    },
    en: {
      hero: {
        title: 'Privacy Policy',
        description: 'Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.',
        lastUpdated: 'Last Updated: January 15, 2024'
      },
      tableOfContents: 'Table of Contents',
      sectionLabel: 'Section',
      contactSection: {
        title: 'Have Questions?',
        description: 'If you have any questions about this Privacy Policy, you can contact us.',
        email: 'info@oyna.gg'
      },
      sections: [
        {
          id: 'information-collection',
          title: 'Information We Collect',
          icon: Database,
          content: [
            {
              subtitle: 'Registration Information',
              text: 'When you create an account, we collect your email address, username, and optionally your phone number.'
            },
            {
              subtitle: 'Usage Data',
              text: 'We automatically collect basic information about how you use our platform (IP address, browser type, pages visited).'
            }
          ]
        },
        {
          id: 'how-we-use',
          title: 'How We Use Your Information',
          icon: UserCheck,
          content: [
            {
              subtitle: 'Service Provision',
              text: 'We use your information to operate our platform, manage your account, and provide services to you.'
            },
            {
              subtitle: 'Communication',
              text: 'We may use your email address to send you important notifications about your account and our services.'
            }
          ]
        },
        {
          id: 'data-sharing',
          title: 'Information Sharing',
          icon: Eye,
          content: [
            {
              subtitle: 'Third Parties',
              text: 'We do not share your information with third parties. We may only disclose information to authorities if legally required.'
            }
          ]
        },
        {
          id: 'data-security',
          title: 'Data Security',
          icon: Lock,
          content: [
            {
              subtitle: 'Security Measures',
              text: 'We use industry-standard security measures to protect your personal information. Your data is stored encrypted.'
            }
          ]
        },
        {
          id: 'cookies',
          title: 'Cookies',
          icon: Cookie,
          content: [
            {
              subtitle: 'Cookie Usage',
              text: 'We use necessary cookies for our platform to function properly. These cookies are used to remember your session and preferences.'
            }
          ]
        },
        {
          id: 'your-rights',
          title: 'Your Rights',
          icon: FileText,
          content: [
            {
              subtitle: 'Access and Correction',
              text: 'You can access and edit your personal information through your account settings.'
            },
            {
              subtitle: 'Data Deletion',
              text: 'You can delete your account and data at any time.'
            }
          ]
        }
      ]
    }
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            
            {/* Language Toggle */}
            <div className="flex justify-center gap-2 mb-4">
              <Button
                variant={language === 'tr' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('tr')}
                className="gap-2"
              >
                <Languages className="w-4 h-4" />
                Türkçe
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('en')}
                className="gap-2"
              >
                <Languages className="w-4 h-4" />
                English
              </Button>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {currentContent.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              {currentContent.hero.description}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{currentContent.hero.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-muted/30 border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-lg font-semibold mb-4">{currentContent.tableOfContents}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
            {currentContent.sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors p-2 rounded-md hover:bg-primary/5"
              >
                <section.icon className="w-4 h-4" />
                <span>{index + 1}. {section.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {currentContent.sections.map((section, sectionIndex) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <section.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {currentContent.sectionLabel} {sectionIndex + 1}
                        </Badge>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold">{section.title}</h2>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {section.content.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full" />
                          {item.subtitle}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed pl-4">
                          {item.text}
                        </p>
                        {index < section.content.length - 1 && (
                          <Separator className="!mt-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="mt-12 border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-6 md:p-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">{currentContent.contactSection.title}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {currentContent.contactSection.description}
              </p>
              <div className="flex justify-center items-center pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-primary" />
                  <a href={`mailto:${currentContent.contactSection.email}`} className="text-primary hover:underline">
                    {currentContent.contactSection.email}
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Spacer */}
      <div className="h-16" />
    </div>
  )
}
