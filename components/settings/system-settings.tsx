import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings, Database, Bell } from "lucide-react"

export function SystemSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Genel Sistem Ayarları
          </CardTitle>
          <CardDescription>MetinPort sisteminin genel yapılandırması</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Adı</Label>
              <Input id="siteName" defaultValue="MetinPort" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteUrl">Site URL</Label>
              <Input id="siteUrl" defaultValue="https://metinport.com" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Site Açıklaması</Label>
            <Input id="description" defaultValue="Metin2 Server Management System" />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Bakım Modu</Label>
                <div className="text-sm text-muted-foreground">Siteyi bakım moduna alır</div>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Yeni Kayıtlar</Label>
                <div className="text-sm text-muted-foreground">Yeni kullanıcı kayıtlarına izin ver</div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Debug Modu</Label>
                <div className="text-sm text-muted-foreground">Geliştirici debug bilgilerini göster</div>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Veritabanı Ayarları
          </CardTitle>
          <CardDescription>Veritabanı bağlantı ve yedekleme ayarları</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Otomatik Yedekleme</Label>
              <div className="text-sm text-muted-foreground">Günlük otomatik veritabanı yedeği</div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Yedek Al
            </Button>
            <Button variant="outline" size="sm">
              Veritabanını Temizle
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Bildirim Ayarları
          </CardTitle>
          <CardDescription>Sistem bildirimleri ve uyarıları</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Bildirimleri</Label>
                <div className="text-sm text-muted-foreground">Önemli olaylar için email gönder</div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sunucu Uyarıları</Label>
                <div className="text-sm text-muted-foreground">Sunucu durumu değişikliklerinde bildir</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
