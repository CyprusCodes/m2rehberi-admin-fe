"use client"

import { useState, useEffect } from "react"
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
import { MoreHorizontal, Eye, CheckCircle, XCircle, ArrowUp, ArrowDown, Edit, Loader2, CheckCircle2 } from "lucide-react"
import { fetchAdvertisements, approveAdvertisement, rejectAdvertisement, deleteAdvertisement, type Advertisement } from "@/services/advertisements"
import { useToast } from "@/hooks/use-toast"

export function AdvertisementTable() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadAdvertisements()
  }, [])

  const loadAdvertisements = async () => {
    try {
      setLoading(true)
      const response = await fetchAdvertisements()
      setAdvertisements(response.data || [])
    } catch (error) {
      console.error('Error loading advertisements:', error)
      toast({
        title: "Hata",
        description: "Reklamlar yüklenirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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
      case "scheduled":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Zamanlanmış</Badge>
      case "inactive":
        return <Badge variant="outline">Pasif</Badge>
      default:
        return <Badge variant="secondary">Bilinmiyor</Badge>
    }
  }

  const getApprovalStatusBadge = (approvalStatus: string) => {
    switch (approvalStatus) {
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Onaylandı</Badge>
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Onay Bekliyor</Badge>
      case "rejected":
        return <Badge variant="destructive">Reddedildi</Badge>
      default:
        return <Badge variant="secondary">Bilinmiyor</Badge>
    }
  }

  const handleViewDetails = (ad: Advertisement) => {
    setSelectedAd(ad)
    setIsDetailsOpen(true)
  }

  const handleApproveAd = async (adId: number) => {
    try {
      await approveAdvertisement(adId, "Reklam onaylandı")
      toast({
        title: "Başarılı",
        description: "Reklam başarıyla onaylandı",
      })
      loadAdvertisements() // Refresh the list
    } catch (error) {
      console.error('Error approving advertisement:', error)
      toast({
        title: "Hata",
        description: "Reklam onaylanırken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  const handleRejectAd = async (adId: number) => {
    const rejectReason = prompt("Red nedenini girin:")
    if (!rejectReason) return

    try {
      await rejectAdvertisement(adId, rejectReason)
      toast({
        title: "Başarılı",
        description: "Reklam reddedildi",
      })
      loadAdvertisements() // Refresh the list
    } catch (error) {
      console.error('Error rejecting advertisement:', error)
      toast({
        title: "Hata",
        description: "Reklam reddedilirken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAd = async (adId: number) => {
    if (!confirm("Bu reklamı silmek istediğinizden emin misiniz?")) return

    try {
      await deleteAdvertisement(adId)
      toast({
        title: "Başarılı",
        description: "Reklam silindi",
      })
      loadAdvertisements() // Refresh the list
    } catch (error) {
      console.error('Error deleting advertisement:', error)
      toast({
        title: "Hata",
        description: "Reklam silinirken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  const handleChangeOrder = (adId: number, direction: "up" | "down") => {
    console.log(`Reklam sıralaması değiştirildi: ${adId} - ${direction}`)
    // TODO: Implement order change logic with API
    toast({
      title: "Bilgi",
      description: "Sıralama değiştirme özelliği yakında eklenecek",
    })
  }

  const calculateCTR = (clicks: number | undefined, views: number | undefined) => {
    const clickCount = clicks || 0
    const viewCount = views || 0
    if (viewCount === 0) return "0%"
    return `${((clickCount / viewCount) * 100).toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sıra</TableHead>
              <TableHead>Reklam</TableHead>
              <TableHead>Reklam Veren</TableHead>
              <TableHead>Konum</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Onay Durumu</TableHead>
              <TableHead>Görüntülenme</TableHead>
              <TableHead>Tıklama</TableHead>
              <TableHead>CTR</TableHead>
              <TableHead>Bitiş Tarihi</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {advertisements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8">
                  <div className="text-muted-foreground">Henüz reklam bulunmuyor</div>
                </TableCell>
              </TableRow>
            ) : (
              advertisements.map((ad) => (
                <TableRow key={ad.advertisementId}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {ad.priority}
                      </span>
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => handleChangeOrder(ad.advertisementId, "up")}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => handleChangeOrder(ad.advertisementId, "down")}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={ad.imageUrl || "/placeholder.svg?height=40&width=60&query=ad banner"}
                        alt={ad.title}
                        className="w-12 h-8 object-cover rounded border"
                      />
                      <div>
                        <div className="font-medium">{ad.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">{ad.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {ad.advertiserUser ? (
                      <div>
                        <div className="font-medium">{ad.advertiserUser.firstName} {ad.advertiserUser.lastName}</div>
                        <div className="text-sm text-muted-foreground">{ad.advertiserUser.email}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Bilinmiyor</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {ad.placementZone === 'login_page' && 'Giriş Sayfası'}
                      {ad.placementZone === 'onboarding' && 'Onboarding'}
                      {ad.placementZone === 'page_top' && 'Sayfa Üstü'}
                      {ad.placementZone === 'page_bottom' && 'Sayfa Altı'}
                      {ad.placementZone === 'sidebar' && 'Kenar Çubuğu'}
                      {ad.placementZone === 'popup' && 'Popup'}
                      {ad.placementZone === 'banner' && 'Banner'}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(ad.status)}</TableCell>
                  <TableCell>{getApprovalStatusBadge(ad.approvalStatus)}</TableCell>
                  <TableCell>{(ad.viewCount || 0).toLocaleString()}</TableCell>
                  <TableCell>{(ad.clickCount || 0).toLocaleString()}</TableCell>
                  <TableCell>{calculateCTR(ad.clickCount, ad.viewCount)}</TableCell>
                  <TableCell>{new Date(ad.endDate).toLocaleDateString('tr-TR')}</TableCell>
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
                        {ad.approvalStatus === "pending" && (
                          <>
                            <DropdownMenuItem onClick={() => handleApproveAd(ad.advertisementId)}>
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                              <span className="text-green-500">Onayla</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRejectAd(ad.advertisementId)}>
                              <XCircle className="mr-2 h-4 w-4 text-red-500" />
                              <span className="text-red-500">Reddet</span>
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDeleteAd(ad.advertisementId)}
                          className="text-red-600"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AdvertisementDetailsDialog ad={selectedAd} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
    </>
  )
}
