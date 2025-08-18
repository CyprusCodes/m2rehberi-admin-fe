"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Eye, Monitor, Clock } from "lucide-react"

interface Package {
  id: string
  name: string
  area: string
  price: number
  status: "active" | "inactive" | "sold"
  currentAd?: string
  weeklyViews: number
  nextCycle: string
  dimensions: string
}

interface PackageDetailsDialogProps {
  package: Package
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PackageDetailsDialog({ package: pkg, open, onOpenChange }: PackageDetailsDialogProps) {
  const getStatusBadge = (status: Package["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            Aktif
          </Badge>
        )
      case "inactive":
        return <Badge variant="secondary">Pasif</Badge>
      case "sold":
        return (
          <Badge variant="default" className="bg-blue-500">
            Satıldı
          </Badge>
        )
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {pkg.name}
            {getStatusBadge(pkg.status)}
          </DialogTitle>
          <DialogDescription>Reklam paketi detayları ve performans bilgileri</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="analytics">Analitik</TabsTrigger>
            <TabsTrigger value="history">Geçmiş</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alan</CardTitle>
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pkg.area}</div>
                  <p className="text-xs text-muted-foreground">Boyut: {pkg.dimensions}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Haftalık Fiyat</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₺{pkg.price}</div>
                  <p className="text-xs text-muted-foreground">Cuma-Cuma döngüsü</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Haftalık Görüntülenme</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pkg.weeklyViews.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Bu hafta toplam</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sonraki Döngü</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pkg.nextCycle}</div>
                  <p className="text-xs text-muted-foreground">Kalan süre</p>
                </CardContent>
              </Card>
            </div>

            {pkg.currentAd && (
              <Card>
                <CardHeader>
                  <CardTitle>Mevcut Reklam</CardTitle>
                  <CardDescription>Şu anda gösterilen reklam</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{pkg.currentAd}</h4>
                      <p className="text-sm text-muted-foreground">Cuma 23:59'a kadar aktif</p>
                    </div>
                    <Badge variant="default" className="bg-green-500">
                      Aktif
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Bu Hafta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pkg.weeklyViews.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">görüntülenme</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Geçen Hafta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(pkg.weeklyViews * 0.85).toFixed(0)}</div>
                  <p className="text-xs text-green-600">+15% artış</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Ortalama CTR</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4%</div>
                  <p className="text-xs text-muted-foreground">tıklama oranı</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reklam Geçmişi</CardTitle>
                <CardDescription>Son 4 haftalık reklam geçmişi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { week: "Bu Hafta", ad: pkg.currentAd || "Boş", status: "active" },
                    { week: "Geçen Hafta", ad: "GameWorld Banner", status: "completed" },
                    { week: "2 Hafta Önce", ad: "TechStore Promo", status: "completed" },
                    { week: "3 Hafta Önce", ad: "Boş", status: "empty" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{item.week}</p>
                        <p className="text-sm text-muted-foreground">{item.ad}</p>
                      </div>
                      <Badge
                        variant={
                          item.status === "active" ? "default" : item.status === "completed" ? "secondary" : "outline"
                        }
                      >
                        {item.status === "active" ? "Aktif" : item.status === "completed" ? "Tamamlandı" : "Boş"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
