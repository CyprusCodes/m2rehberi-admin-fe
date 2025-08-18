"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, Play, Pause } from "lucide-react"
import { PackageDetailsDialog } from "./package-details-dialog"

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

const mockPackages: Package[] = [
  {
    id: "1",
    name: "Ana Sidebar Reklamı",
    area: "Sidebar",
    price: 500,
    status: "sold",
    currentAd: "TechCorp Banner",
    weeklyViews: 12500,
    nextCycle: "3 gün",
    dimensions: "300x250",
  },
  {
    id: "2",
    name: "Navbar Üst Banner",
    area: "Navbar",
    price: 750,
    status: "active",
    weeklyViews: 18200,
    nextCycle: "5 gün",
    dimensions: "728x90",
  },
  {
    id: "3",
    name: "Footer Reklam Alanı",
    area: "Footer",
    price: 300,
    status: "inactive",
    weeklyViews: 0,
    nextCycle: "-",
    dimensions: "320x100",
  },
  {
    id: "4",
    name: "Login Ekran Reklamı",
    area: "Login",
    price: 600,
    status: "sold",
    currentAd: "GameStore Promo",
    weeklyViews: 8900,
    nextCycle: "1 gün",
    dimensions: "400x300",
  },
]

export function PackagesTable() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)

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

  const getAreaBadge = (area: string) => {
    const colors = {
      Sidebar: "bg-purple-500",
      Navbar: "bg-blue-500",
      Footer: "bg-green-500",
      Login: "bg-orange-500",
    }
    return <Badge className={colors[area as keyof typeof colors] || "bg-gray-500"}>{area}</Badge>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paket Adı</TableHead>
            <TableHead>Alan</TableHead>
            <TableHead>Boyut</TableHead>
            <TableHead>Fiyat</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Mevcut Reklam</TableHead>
            <TableHead>Haftalık Görüntülenme</TableHead>
            <TableHead>Sonraki Döngü</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockPackages.map((pkg) => (
            <TableRow key={pkg.id}>
              <TableCell className="font-medium">{pkg.name}</TableCell>
              <TableCell>{getAreaBadge(pkg.area)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{pkg.dimensions}</TableCell>
              <TableCell className="font-semibold">₺{pkg.price}</TableCell>
              <TableCell>{getStatusBadge(pkg.status)}</TableCell>
              <TableCell>
                {pkg.currentAd ? (
                  <span className="text-sm">{pkg.currentAd}</span>
                ) : (
                  <span className="text-sm text-muted-foreground">Boş</span>
                )}
              </TableCell>
              <TableCell>{pkg.weeklyViews.toLocaleString()}</TableCell>
              <TableCell>{pkg.nextCycle}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelectedPackage(pkg)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Detayları Görüntüle
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Düzenle
                    </DropdownMenuItem>
                    {pkg.status === "active" ? (
                      <DropdownMenuItem>
                        <Pause className="mr-2 h-4 w-4" />
                        Pasif Yap
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>
                        <Play className="mr-2 h-4 w-4" />
                        Aktif Yap
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedPackage && (
        <PackageDetailsDialog
          package={selectedPackage}
          open={!!selectedPackage}
          onOpenChange={() => setSelectedPackage(null)}
        />
      )}
    </>
  )
}
