"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Eye, Calendar, Image as ImageIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Carousel, CreateCarouselRequest, UpdateCarouselRequest, getCarousels, postCarousel, updateCarousel, deleteCarousel, fetchCarouselServers } from "@/services/carousels"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import moment from "moment"
import "moment/locale/tr"

export default function CarouselPage() {
  const [carousels, setCarousels] = useState<Carousel[]>([])
  const [activeServers, setActiveServers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Moment'i Türkçe locale ile ayarla
  moment.locale('tr')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCarousel, setEditingCarousel] = useState<Carousel | null>(null)
  const [formData, setFormData] = useState<CreateCarouselRequest>({
    title: "",
    description: "",
    imageUrl: "",
    status: "active",
    startDate: "",
    endDate: "",
    serverLinkId: undefined
  })

  const fetchCarousels = async () => {
    try {
      setLoading(true)
      const data = await getCarousels()
      setCarousels(data)
    } catch (error) {
      toast({
        title: "Hata",
        description: "Carousel'ler yüklenirken bir hata oluştu.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchActiveServersData = async () => {
    try {
      const servers = await fetchCarouselServers()
      setActiveServers(servers)
    } catch (error) {
      console.error("Aktif sunucular yüklenirken hata:", error)
    }
  }

  useEffect(() => {
    fetchCarousels()
    fetchActiveServersData()
  }, [])

  const handleCreate = async () => {
    try {
      await postCarousel(formData)
      toast({
        title: "Başarılı",
        description: "Carousel başarıyla oluşturuldu."
      })
      setIsCreateModalOpen(false)
      resetForm()
      fetchCarousels()
    } catch (error: any) {
      console.error("Carousel creation error:", error)
      const errorMessage = error?.response?.data?.message || error?.message || "Carousel oluşturulurken bir hata oluştu."
      toast({
        title: "Hata",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  const handleUpdate = async () => {
    if (!editingCarousel?.carouselId) return

    try {
      await updateCarousel(editingCarousel.carouselId.toString(), formData)
      toast({
        title: "Başarılı",
        description: "Carousel başarıyla güncellendi."
      })
      setIsEditModalOpen(false)
      setEditingCarousel(null)
      resetForm()
      fetchCarousels()
    } catch (error: any) {
      console.error("Carousel update error:", error)
      const errorMessage = error?.response?.data?.message || error?.message || "Carousel güncellenirken bir hata oluştu."
      toast({
        title: "Hata",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteCarousel(id.toString())
      toast({
        title: "Başarılı",
        description: "Carousel başarıyla silindi."
      })
      fetchCarousels()
    } catch (error) {
      toast({
        title: "Hata",
        description: "Carousel silinirken bir hata oluştu.",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      status: "active",
      startDate: "",
      endDate: "",
      serverLinkId: undefined
    })
  }

  const openEditModal = (carousel: Carousel) => {
    setEditingCarousel(carousel)
    setFormData({
      title: carousel.title,
      description: carousel.description,
      imageUrl: carousel.imageUrl,
      status: carousel.status,
      startDate: carousel.startDate,
      endDate: carousel.endDate,
      serverLinkId: carousel.serverLinkId
    })
    setIsEditModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge variant="default" className="bg-green-500">Aktif</Badge>
    ) : (
      <Badge variant="secondary">Pasif</Badge>
    )
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy HH:mm", { locale: tr })
    } catch {
      return dateString
    }
  }

  const getDaysUntilStart = (dateString: string) => {
    try {
      const startDate = moment(dateString)
      const now = moment()
      const daysDiff = startDate.diff(now, 'days')
      
      if (daysDiff > 0) {
        return `${daysDiff} gün sonra`
      } else if (daysDiff === 0) {
        return "Bugün başlıyor"
      } else {
        return `${Math.abs(daysDiff)} gün önce başladı`
      }
    } catch {
      return "Tarih hesaplanamadı"
    }
  }

  const getDaysUntilEnd = (dateString: string) => {
    try {
      const endDate = moment(dateString)
      const now = moment()
      const daysDiff = endDate.diff(now, 'days')
      
      if (daysDiff > 0) {
        return `${daysDiff} gün kaldı`
      } else if (daysDiff === 0) {
        return "Bugün bitiyor"
      } else {
        return `${Math.abs(daysDiff)} gün önce bitti`
      }
    } catch {
      return "Tarih hesaplanamadı"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Carousel Yönetimi</h1>
          <p className="text-muted-foreground">Ana sayfa carousel'lerini yönetin</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Carousel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Yeni Carousel Oluştur</DialogTitle>
              <DialogDescription>
                Ana sayfada görüntülenecek yeni bir carousel oluşturun.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Başlık</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Carousel başlığı"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Carousel açıklaması"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Resim URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Durum</Label>
                <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Pasif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="serverLinkId">Bağlı Sunucu (Opsiyonel)</Label>
                <Select 
                  value={formData.serverLinkId?.toString() || "none"} 
                  onValueChange={(value) => setFormData({ ...formData, serverLinkId: value === "none" ? undefined : parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sunucu seçin (opsiyonel)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sunucu seçilmedi</SelectItem>
                    {activeServers && activeServers.length > 0 ? (
                      activeServers.map((server) => (
                        <SelectItem key={server.server_id} value={server.server_id?.toString() || "none"}>
                          {server.server_name || "Bilinmeyen Sunucu"}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-servers" disabled>
                        Aktif sunucu bulunamadı
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">Bitiş Tarihi</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleCreate}>Oluştur</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Carousel Listesi</CardTitle>
          <CardDescription>
            Toplam {carousels.length} carousel bulundu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlık</TableHead>
                <TableHead>Açıklama</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Bağlı Sunucu</TableHead>
                <TableHead>Başlangıç</TableHead>
                <TableHead>Bitiş</TableHead>
                <TableHead>Oluşturulma</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carousels.map((carousel) => {
                const linkedServer = activeServers?.find(server => server.server_id === carousel.serverLinkId)
                return (
                <TableRow key={carousel.carouselId}>
                  <TableCell className="font-medium">{carousel.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{carousel.description}</TableCell>
                  <TableCell>{getStatusBadge(carousel.status)}</TableCell>
                  <TableCell>
                    {linkedServer ? (
                      <div className="space-y-1">
                        <Badge variant="outline">{linkedServer.server_name}</Badge>
                        <div className="text-xs text-muted-foreground">
                          {linkedServer.first_name} {linkedServer.last_name}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Bağlı sunucu yok</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-sm">{formatDate(carousel.startDate)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getDaysUntilStart(carousel.startDate)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-sm">{formatDate(carousel.endDate)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getDaysUntilEnd(carousel.endDate)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {carousel.createdAt && formatDate(carousel.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(carousel.imageUrl, '_blank')}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(carousel)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Carousel'i Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{carousel.title}" başlıklı carousel'i silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => carousel.carouselId && handleDelete(carousel.carouselId)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Carousel Düzenle</DialogTitle>
            <DialogDescription>
              Carousel bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Başlık</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Carousel başlığı"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Açıklama</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Carousel açıklaması"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-imageUrl">Resim URL</Label>
              <Input
                id="edit-imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Durum</Label>
              <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Pasif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-serverLinkId">Bağlı Sunucu (Opsiyonel)</Label>
              <Select 
                value={formData.serverLinkId?.toString() || "none"} 
                onValueChange={(value) => setFormData({ ...formData, serverLinkId: value === "none" ? undefined : parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sunucu seçin (opsiyonel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sunucu seçilmedi</SelectItem>
                  {activeServers && activeServers.length > 0 ? (
                    activeServers.map((server) => (
                      <SelectItem key={server.server_id} value={server.server_id?.toString() || "none"}>
                        {server.server_name || "Bilinmeyen Sunucu"}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-servers" disabled>
                      Aktif sunucu bulunamadı
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-startDate">Başlangıç Tarihi</Label>
                <Input
                  id="edit-startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-endDate">Bitiş Tarihi</Label>
                <Input
                  id="edit-endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleUpdate}>Güncelle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
