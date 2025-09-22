"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ExternalLink,
  Eye,
  MousePointer,
  Calendar,
  Building,
  BarChart3,
} from "lucide-react";
import moment from "moment";
import "moment/locale/tr";
import { type Advertisement as Ad } from "@/services/advertisements";

interface AdvertisementDetailsDialogProps {
  ad: Ad | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvertisementDetailsDialog({
  ad,
  open,
  onOpenChange,
}: AdvertisementDetailsDialogProps) {
  if (!ad) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Aktif</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Beklemede</Badge>
        );
      case "scheduled":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Zamanlanmış</Badge>
        );
      case "inactive":
        return <Badge variant="outline">Pasif</Badge>;
      case "rejected":
        return <Badge variant="destructive">Reddedildi</Badge>;
      case "expired":
        return <Badge variant="secondary">Süresi Doldu</Badge>;
      default:
        return <Badge variant="secondary">Bilinmiyor</Badge>;
    }
  };

  const calculateCTR = (clicks: number, views: number) => {
    if (views === 0) return "0%";
    return `${((clicks / views) * 100).toFixed(2)}%`;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full md:max-w-4xl md:mx-auto min-h-[90vh] overflow-y-auto rounded-t-2xl border-t bg-background p-0 shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex flex-col items-center gap-2 border-b bg-background/80 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-base md:text-lg">
              {ad.title}
              {getStatusBadge(ad.status)}
            </SheetTitle>
            <SheetDescription className="text-sm md:text-base">
              {ad.description || ""}
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="px-4 pb-20 pt-4 md:px-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
              <TabsTrigger value="banner">Banner</TabsTrigger>
              <TabsTrigger value="analytics">Analitik</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Reklam Bilgileri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Reklam Veren:
                      </span>
                      <span className="font-medium">
                        {ad.advertiserUser
                          ? `${ad.advertiserUser.firstName} ${ad.advertiserUser.lastName}`
                          : "Bilinmiyor"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">URL:</span>
                      <a
                        href={ad.targetUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-500 hover:underline"
                      >
                        {ad.targetUrl || "-"}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Sıralama:</span>
                      <span className="font-medium">#{ad.priority}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Tarih Bilgileri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Başlangıç:</span>
                      <span className="font-medium">
                        {moment(ad.startDate)
                          .locale("tr")
                          .format("DD.MM.YYYY HH:mm")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Bitiş:</span>
                      <span className="font-medium">
                        {moment(ad.endDate)
                          .locale("tr")
                          .format("DD.MM.YYYY HH:mm")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Durum:</span>
                      {getStatusBadge(ad.status)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="banner" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reklam Banner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border">
                    <img
                      src={
                        ad.imageUrl ||
                        "/placeholder.svg?height=200&width=600&query=advertisement banner"
                      }
                      alt={ad.title}
                      className="w-full max-h-[55vh] object-contain bg-black/10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Banner Değiştir
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={ad.targetUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Siteyi Ziyaret Et
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Görüntülenme
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(ad.viewCount || 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Toplam görüntülenme
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MousePointer className="h-4 w-4" />
                      Tıklama
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(ad.clickCount || 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Toplam tıklama
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      CTR
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {calculateCTR(ad.clickCount || 0, ad.viewCount || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tıklama oranı
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performans Özeti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Günlük ortalama görüntülenme:</span>
                      <span className="font-medium">
                        {Math.round((ad.viewCount || 0) / 30).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Günlük ortalama tıklama:</span>
                      <span className="font-medium">
                        {Math.round((ad.clickCount || 0) / 30).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Performans durumu:</span>
                      <span className="font-medium text-green-500">İyi</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="sticky bottom-0 z-10 border-t bg-background/80 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Kapat
            </Button>
            {ad.targetUrl && (
              <Button asChild>
                <a
                  href={ad.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Siteyi Ziyaret Et
                </a>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
