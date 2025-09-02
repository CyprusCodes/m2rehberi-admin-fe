'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/auth-context'
import { LandingNavbar } from '@/components/landing/navbar'
import { Bell, Eye, Shield, Globe, Mail, Smartphone, Palette, Save } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
    updates: true,
    security: true
  })
  
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showLocation: false,
    allowMessages: true
  })
  
  const [theme, setTheme] = useState({
    auto: true,
    dark: false,
    light: false
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleThemeChange = (key: string, value: boolean) => {
    if (value) {
      setTheme({
        auto: key === 'auto',
        dark: key === 'dark',
        light: key === 'light'
      })
    }
  }

  const handleSaveSettings = () => {
    // TODO: Save settings to API
    console.log('Settings saved:', { notifications, privacy, theme })
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Ayarlar</h1>
            <p className="text-muted-foreground">Hesap ayarlarınızı özelleştirin</p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Ayarları Kaydet</span>
            </Button>
          </div>

          {/* Notifications Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Bildirim Ayarları</span>
              </CardTitle>
              <CardDescription>
                Hangi bildirimleri almak istediğinizi seçin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">E-posta Bildirimleri</Label>
                    <p className="text-sm text-muted-foreground">
                      Önemli güncellemeler için e-posta alın
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Push Bildirimleri</Label>
                    <p className="text-sm text-muted-foreground">
                      Tarayıcı push bildirimleri alın
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Pazarlama E-postaları</Label>
                    <p className="text-sm text-muted-foreground">
                      Yeni özellikler ve kampanyalar hakkında bilgi alın
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Güvenlik Uyarıları</Label>
                    <p className="text-sm text-muted-foreground">
                      Hesap güvenliği ile ilgili önemli uyarılar
                    </p>
                  </div>
                  <Switch
                    checked={notifications.security}
                    onCheckedChange={(checked) => handleNotificationChange('security', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Gizlilik Ayarları</span>
              </CardTitle>
              <CardDescription>
                Profil görünürlüğünüzü ve veri paylaşımınızı kontrol edin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Profil Görünür</Label>
                    <p className="text-sm text-muted-foreground">
                      Diğer kullanıcılar profilinizi görebilir
                    </p>
                  </div>
                  <Switch
                    checked={privacy.profileVisible}
                    onCheckedChange={(checked) => handlePrivacyChange('profileVisible', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">E-posta Göster</Label>
                    <p className="text-sm text-muted-foreground">
                      E-posta adresiniz diğer kullanıcılara görünür
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showEmail}
                    onCheckedChange={(checked) => handlePrivacyChange('showEmail', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Konum Göster</Label>
                    <p className="text-sm text-muted-foreground">
                      Konum bilginiz diğer kullanıcılara görünür
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showLocation}
                    onCheckedChange={(checked) => handlePrivacyChange('showLocation', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Mesaj Almaya İzin Ver</Label>
                    <p className="text-sm text-muted-foreground">
                      Diğer kullanıcılar size mesaj gönderebilir
                    </p>
                  </div>
                  <Switch
                    checked={privacy.allowMessages}
                    onCheckedChange={(checked) => handlePrivacyChange('allowMessages', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Tema Ayarları</span>
              </CardTitle>
              <CardDescription>
                Görünüm tercihlerinizi seçin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Otomatik Tema</Label>
                    <p className="text-sm text-muted-foreground">
                      Sistem ayarlarınıza göre otomatik tema seçimi
                    </p>
                  </div>
                  <Switch
                    checked={theme.auto}
                    onCheckedChange={(checked) => handleThemeChange('auto', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Koyu Tema</Label>
                    <p className="text-sm text-muted-foreground">
                      Her zaman koyu tema kullan
                    </p>
                  </div>
                  <Switch
                    checked={theme.dark}
                    onCheckedChange={(checked) => handleThemeChange('dark', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Açık Tema</Label>
                    <p className="text-sm text-muted-foreground">
                      Her zaman açık tema kullan
                    </p>
                  </div>
                  <Switch
                    checked={theme.light}
                    onCheckedChange={(checked) => handleThemeChange('light', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Hesap Bilgileri</span>
              </CardTitle>
              <CardDescription>
                Hesap bilgilerinizi görüntüleyin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Kullanıcı ID</Label>
                  <p className="text-base">{user?.id || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Rol</Label>
                  <p className="text-base capitalize">{user?.role || 'user'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">E-posta</Label>
                  <p className="text-base">{user?.email || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Ad Soyad</Label>
                  <p className="text-base">{user?.name || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
