"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AdvertisementDetailsDialog } from "./advertisement-details-dialog"
import { MoreHorizontal, Eye, CheckCircle, XCircle, ArrowUp, ArrowDown, Edit } from "lucide-react"

// Mock data - replace with real data
const advertisements = [
  {
    id: "1",
    title: "Premium Metin2 Items",
    company: "GameShop TR",
    status: "active",
    order: 1,
    views: 1250,
    clicks: 89,
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    banner: "/ad-banner-1.png",
    url: "https://gameshop.com",
    description: "En iyi Metin2 itemları burada!",
  },
  {
    id: "2",
    title: "Metin2 Yang Satışı",
    company: "YangMarket",
    status: "pending",
    order: 2,
    views: 0,
    clicks: 0,
    startDate: "2024-01-20",
    endDate: "2024-02-20",
    banner: "/ad-banner-2.png",
    url: "https://yangmarket.com",
    description: "Güvenilir yang satış platformu",
  },
  {
    id: "3",
    title: "Metin2 Private Server",
    company: "DragonServer",
    status: "active",
    order: 3,
    views: 890,
    clicks: 45,
    startDate: "2024-01-10",
    endDate: "2024-02-10",
    banner: "/ad-banner-3.png",
    url: "https://dragonserver.com",
    description: "Yeni nesil Metin2 deneyimi",
  },
  {
    id: "4",
    title: "Metin2 Bot Programı",
    company: "AutoPlay",
    status: "rejected",
    order: 4,
    views: 0,
    clicks: 0,
    startDate: "2024-01-18",
    endDate: "2024-02-18",
    banner: "/ad-banner-4.png",
    url: "https://autoplay.com",
    description: "Otomatik oyun botu",
  },
]

export function AdvertisementTable() {
  const [selectedAd, setSelectedAd] = useState<(typeof advertisements)[0] | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Aktif</Badge>
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Beklemede</Badge>
      case "rejected":
        return <Badge variant="destructive">Reddedildi</Badge>
      case "expired":
        return <Badge variant="secondary">Süresi Doldu</Badge>
      default:
        return <Badge variant="secondary">Bilinmiyor</Badge>
    }
  }

  const handleViewDetails = (ad: (typeof advertisements)[0]) => {
    setSelectedAd(ad)
    setIsDetailsOpen(true)
  }

  const handleApproveAd = (adId: string) => {
    console.log("Reklam onaylandı:", adId)
    // Implement ad approval logic
  }

  const handleRejectAd = (adId: string) => {
    console.log("Reklam reddedildi:", adId)
    // Implement ad rejection logic
  }

  const handleChangeOrder = (adId: string, direction: "up" | "down") => {
    console.log(`Reklam sıralaması değiştirildi: ${adId} - ${direction}`)
    // Implement order change logic
  }

  const calculateCTR = (clicks: number, views: number) => {
    if (views === 0) return "0%"
    return `${((clicks / views) * 100).toFixed(1)}%`
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sıra</TableHead>
              <TableHead>Reklam</TableHead>
              <TableHead>Şirket</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Görüntülenme</TableHead>
              <TableHead>Tıklama</TableHead>
              <TableHead>CTR</TableHead>
              <TableHead>Bitiş Tarihi</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {advertisements.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {ad.order}
                    </span>
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => handleChangeOrder(ad.id, "up")}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => handleChangeOrder(ad.id, "down")}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={ad.banner || "/placeholder.svg?height=40&width=60&query=ad banner"}
                      alt={ad.title}
                      className="w-12 h-8 object-cover rounded border"
                    />
                    <div>
                      <div className="font-medium">{ad.title}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">{ad.description}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{ad.company}</TableCell>
                <TableCell>{getStatusBadge(ad.status)}</TableCell>
                <TableCell>{ad.views.toLocaleString()}</TableCell>
                <TableCell>{ad.clicks.toLocaleString()}</TableCell>
                <TableCell>{calculateCTR(ad.clicks, ad.views)}</TableCell>
                <TableCell>{ad.endDate}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Menüyü aç</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleViewDetails(ad)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Detayları Görüntüle
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {ad.status === "pending" && (
                        <>
                          <DropdownMenuItem onClick={() => handleApproveAd(ad.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Onayla
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRejectAd(ad.id)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Reddet
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AdvertisementDetailsDialog ad={selectedAd} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
    </>
  )
}
