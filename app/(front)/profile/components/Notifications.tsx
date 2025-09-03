'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ModeToggle } from '@/components/mode-toggle'
import { Bell, Mail, Smartphone, Globe, Shield } from 'lucide-react'

export function Notifications() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
    updates: true,
    security: true,
    serverUpdates: true,
    newMessages: true,
    weeklyDigest: false
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bildirim Ayarları</h1>
          <p className="text-muted-foreground">Hangi bildirimleri almak istediğinizi seçin</p>
        </div>
        <ModeToggle />
      </div>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>E-posta Bildirimleri</span>
          </CardTitle>
          <CardDescription>
            Önemli güncellemeler için e-posta alın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Genel E-posta Bildirimleri</Label>
                <p className="text-sm text-muted-foreground">
                  Önemli hesap güncellemeleri ve güvenlik uyarıları
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
                <Label className="text-base font-medium">Haftalık Özet</Label>
                <p className="text-sm text-muted-foreground">
                  Haftalık aktivite özeti ve istatistikler
                </p>
              </div>
              <Switch
                checked={notifications.weeklyDigest}
                onCheckedChange={(checked) => handleNotificationChange('weeklyDigest', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Pazarlama E-postaları</Label>
                <p className="text-sm text-muted-foreground">
                  Yeni özellikler ve kampanyalar hakkında bilgi
                </p>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5" />
            <span>Push Bildirimleri</span>
          </CardTitle>
          <CardDescription>
            Mobil cihazınızda anlık bildirimler alın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Push Bildirimleri</Label>
                <p className="text-sm text-muted-foreground">
                  Mobil cihazınızda anlık bildirimler
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
                <Label className="text-base font-medium">Yeni Mesaj Bildirimleri</Label>
                <p className="text-sm text-muted-foreground">
                  Gelen mesajlar için anlık uyarılar
                </p>
              </div>
              <Switch
                checked={notifications.newMessages}
                onCheckedChange={(checked) => handleNotificationChange('newMessages', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Server Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Sunucu Bildirimleri</span>
          </CardTitle>
          <CardDescription>
            Sunucu güncellemeleri ve değişiklikler hakkında bilgi alın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Sunucu Güncellemeleri</Label>
                <p className="text-sm text-muted-foreground">
                  Sunucu bakım ve güncelleme bildirimleri
                </p>
              </div>
              <Switch
                checked={notifications.serverUpdates}
                onCheckedChange={(checked) => handleNotificationChange('serverUpdates', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Sistem Güncellemeleri</Label>
                <p className="text-sm text-muted-foreground">
                  Platform güncellemeleri ve yeni özellikler
                </p>
              </div>
              <Switch
                checked={notifications.updates}
                onCheckedChange={(checked) => handleNotificationChange('updates', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Güvenlik Bildirimleri</span>
          </CardTitle>
          <CardDescription>
            Hesap güvenliği ile ilgili önemli uyarılar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Güvenlik Uyarıları</Label>
                <p className="text-sm text-muted-foreground">
                  Şüpheli giriş denemeleri ve güvenlik uyarıları
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

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Bildirim Tercihleri</span>
          </CardTitle>
          <CardDescription>
            Bildirim sıklığı ve zamanlaması ayarları
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Sessiz Saatler</Label>
                <p className="text-sm text-muted-foreground">
                  Gece saatlerinde bildirimleri sustur
                </p>
              </div>
              <Switch
                checked={false}
                onCheckedChange={() => {}}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Hafta Sonu Bildirimleri</Label>
                <p className="text-sm text-muted-foreground">
                  Hafta sonları bildirimleri azalt
                </p>
              </div>
              <Switch
                checked={false}
                onCheckedChange={() => {}}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
