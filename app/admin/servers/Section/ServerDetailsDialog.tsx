"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users, Activity, Settings, FileText, ImageIcon } from "lucide-react"

interface Server {
  id: string
  name: string
  status: string
  players: number
  maxPlayers: number
  uptime: string
  location: string
  version: string
  banner: string
  rules: string[]
  description: string
}

interface ServerDetailsDialogProps {
  server: Server | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ServerDetailsDialog({ server, open, onOpenChange }: ServerDetailsDialogProps) {
  if (!server) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500 hover:bg-green-600">Çevrimiçi</Badge>
      case "offline":
        return <Badge variant="destructive">Çevrimdışı</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Bakım</Badge>
      default:
        return <Badge variant="secondary">Bilinmiyor</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {server.name}
            {getStatusBadge(server.status)}
          </DialogTitle>
          <DialogDescription>{server.description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="rules">Kurallar</TabsTrigger>
            <TabsTrigger value="banner">Banner</TabsTrigger>
            <TabsTrigger value="settings">Ayarlar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Oyuncu İstatistikleri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Mevcut Oyuncular</span>
                      <span className="font-medium">
                        {server.players}/{server.maxPlayers}
                      </span>
                    </div>
                    <Progress value={(server.players / server.maxPlayers) * 100} className="h-2" />
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Doluluk Oranı: </span>
                    <span className="font-medium">{Math.round((server.players / server.maxPlayers) * 100)}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Sunucu Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Konum:</span>
                    <span className="font-medium">{server.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Versiyon:</span>
                    <span className="font-medium">{server.version}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Uptime:</span>
                    <span className="font-medium">{server.uptime}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Sunucu Kuralları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {server.rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-sm">{rule}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm">
                    Kural Ekle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banner" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Sunucu Banner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border">
                  <img
                    src={server.banner || "/placeholder.svg?height=200&width=600&query=server banner"}
                    alt={`${server.name} banner`}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Banner Değiştir
                  </Button>
                  <Button variant="outline" size="sm">
                    Banner Kaldır
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Sunucu Ayarları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Maksimum Oyuncu</label>
                    <p className="text-sm text-muted-foreground">{server.maxPlayers}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sunucu Durumu</label>
                    <p className="text-sm text-muted-foreground">{server.status}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button size="sm">Ayarları Düzenle</Button>
                  <Button variant="outline" size="sm">
                    Sunucuyu Yeniden Başlat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
