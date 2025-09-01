'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Shield, Key, AlertTriangle, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export function SecuritySettings() {
  const router = useRouter()
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Güvenlik Ayarları
          </CardTitle>
          <CardDescription>Sistem güvenliği ve erişim kontrolü</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Doğrulama</Label>
                <div className="text-sm text-muted-foreground">Tüm hesaplar için email doğrulama zorunlu</div>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Şifre Politikası
          </CardTitle>
          <CardDescription>Kullanıcı şifre gereksinimleri</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Güçlü Şifre Zorunlu</Label>
                <div className="text-sm text-muted-foreground">Minimum 8 karakter, büyük/küçük harf, sayı</div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Şifre Geçmişi</Label>
                <div className="text-sm text-muted-foreground">Son 5 şifreyi tekrar kullanmayı engelle</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minLength">Minimum Uzunluk</Label>
              <Input id="minLength" type="number" defaultValue="8" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expireDays">Şifre Geçerlilik (gün)</Label>
              <Input id="expireDays" type="number" defaultValue="90" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Erişim Kontrolü
          </CardTitle>
          <CardDescription>Kullanıcı rolleri ve izinleri</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">


          <div className="flex gap-2">
            <Button variant="outline" size="sm"
            onClick={() => {
              router.push("/admin/roles")
            }}
            >
              Rolleri Yönet
            </Button>
            <Button variant="outline" size="sm">
              İzinleri Düzenle
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Tehlikeli İşlemler
          </CardTitle>
          <CardDescription>Bu işlemler geri alınamaz. Dikkatli olun!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="destructive" size="sm">
              Tüm Oturumları Sonlandır
            </Button>
            <Button variant="destructive" size="sm">
              Güvenlik Loglarını Temizle
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
