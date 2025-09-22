"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { createAdvertisement } from "@/services/advertisements"
import { fetchUsers, type UserRow } from "@/services/users"
import { uploadAsset } from "@/services/uploads"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Megaphone, Image, Upload, X } from "lucide-react"

interface AddAdvertisementDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AddAdvertisementDialog({ isOpen, onClose, onSuccess }: AddAdvertisementDialogProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [users, setUsers] = useState<UserRow[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    targetUrl: "",
    advertiserUserId: "none",
    placementZone: "",
    startDate: "",
    endDate: "",
    status: "scheduled",
    priority: "0",
  })

  // Load users when modal opens
  useEffect(() => {
    if (!isOpen) return
    
    const loadUsers = async () => {
      try {
        setLoadingUsers(true)
        const response = await fetchUsers("?page_size=100&sort_by=-users.user_id")
        const activeUsers = response.data.filter(user => user.user_status === 'active')
        setUsers(activeUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
        toast({
          title: "Hata",
          description: "Kullanıcılar yüklenirken bir hata oluştu",
          variant: "destructive",
        })
      } finally {
        setLoadingUsers(false)
      }
    }
    
    loadUsers()
  }, [isOpen, toast])

  // File upload handlers
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Hata",
        description: "Lütfen sadece resim dosyası yükleyin",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Hata", 
        description: "Dosya boyutu 5MB'dan büyük olamaz",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)
      const response = await uploadAsset(file)
      setFormData({ ...formData, imageUrl: response.data.url })
    } catch (error) {
      console.error('Upload failed:', error)
      toast({
        title: "Hata",
        description: "Dosya yüklenirken hata oluştu",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const removeImage = () => {
    setFormData({ ...formData, imageUrl: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl,
        targetUrl: formData.targetUrl || undefined,
        advertiserUserId: formData.advertiserUserId && formData.advertiserUserId !== "none" ? parseInt(formData.advertiserUserId) : undefined,
        placementZone: formData.placementZone as any,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status as any,
        priority: parseInt(formData.priority),
      }

      await createAdvertisement(payload)
      
      toast({
        title: "Başarılı",
        description: "Reklam başarıyla oluşturuldu",
      })
      
      onClose()
      resetForm()
      onSuccess?.()
      
    } catch (error) {
      console.error('Error creating advertisement:', error)
      toast({
        title: "Hata",
        description: "Reklam oluşturulurken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      targetUrl: "",
      advertiserUserId: "none",
      placementZone: "",
      startDate: "",
      endDate: "",
      status: "scheduled",
      priority: "0",
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="flex min-w-[700px] flex-col border-l border-slate-800/60 bg-gradient-to-br from-background via-background to-muted/20 p-0 sm:w-[800px]"
      >
        <SheetHeader className="border-b border-slate-800/60 bg-gradient-to-r from-indigo-500/10 to-transparent px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500/20 to-slate-500/20 p-2">
              <Megaphone className="h-5 w-5 text-indigo-100" />
            </div>
            <div>
              <SheetTitle className="text-lg font-semibold text-slate-100 tracking-tight">
                Yeni Reklam Ekle
              </SheetTitle>
              <p className="mt-1 text-sm text-slate-400">MetinPort sistemine yeni bir reklam ekleyin</p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-transparent to-slate-900/70">
          <div className="flex-1 space-y-6 overflow-y-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-indigo-500/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-medium text-slate-300">
                  Reklam Başlığı
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Örn: Premium Metin2 Items"
                  className="rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400/60"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="advertiserUserId" className="text-sm font-medium text-slate-300">
                  Reklam Veren Kullanıcı (Opsiyonel)
                </Label>
                <Select value={formData.advertiserUserId} onValueChange={(value) => setFormData({ ...formData, advertiserUserId: value })}>
                  <SelectTrigger className="rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-slate-100 focus:border-indigo-400/60">
                    <SelectValue placeholder="Kullanıcı seçin (opsiyonel)" />
                  </SelectTrigger>
                  <SelectContent className="border border-slate-700/60 bg-slate-900 text-slate-200">
                    <SelectItem value="none">Kullanıcı seçmeyin</SelectItem>
                    {loadingUsers && (
                      <SelectItem value="loading" disabled>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                          Kullanıcılar yükleniyor...
                        </div>
                      </SelectItem>
                    )}
                    {!loadingUsers &&
                      users.map((user) => (
                        <SelectItem key={user.user_id} value={user.user_id.toString()}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.first_name} {user.last_name}</span>
                            <span className="text-xs text-slate-400">({user.email})</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-sm font-medium text-slate-300">
                  Açıklama
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Reklam hakkında kısa açıklama"
                  rows={3}
                  className="min-h-[120px] resize-none rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400/60"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Reklam Görseli
                </Label>
                
                {!formData.imageUrl ? (
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                      dragActive 
                        ? 'border-indigo-400 bg-indigo-500/5' 
                        : 'border-slate-700/60 hover:border-indigo-400/50 hover:bg-slate-900/30'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('advertisement-image-input')?.click()}
                  >
                    <input
                      id="advertisement-image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                        <p className="text-sm text-slate-400">Yükleniyor...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-300">Resim sürükleyip bırakın</p>
                          <p className="text-xs text-slate-500">veya tıklayarak seçin</p>
                        </div>
                        <p className="text-xs text-slate-500">PNG, JPG, GIF (max 5MB)</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-700/30">
                      <img
                        src={formData.imageUrl}
                        alt="Reklam görseli"
                        className="w-full h-full object-cover"
                        onLoad={() => {
                          console.log('Image loaded successfully:', formData.imageUrl)
                        }}
                        onError={(e) => {
                          console.log('Image failed to load:', formData.imageUrl)
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-400 text-sm">Resim yüklenemedi</div>';
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => document.getElementById('advertisement-image-input')?.click()}
                          className="h-8 px-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Değiştir
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={removeImage}
                          className="h-8 px-3 bg-red-800/80 hover:bg-red-700/80"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Kaldır
                        </Button>
                      </div>
                    </div>
                    <input
                      id="advertisement-image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="targetUrl" className="text-sm font-medium text-slate-300">
                  Hedef URL
                </Label>
                <Input
                  id="targetUrl"
                  type="url"
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400/60"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="placementZone" className="text-sm font-medium text-slate-300">
                  Konum
                </Label>
                <Select value={formData.placementZone} onValueChange={(value) => setFormData({ ...formData, placementZone: value })}>
                  <SelectTrigger className="rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-slate-100 focus:border-indigo-400/60">
                    <SelectValue placeholder="Reklam konumunu seçin" />
                  </SelectTrigger>
                  <SelectContent className="border border-slate-700/60 bg-slate-900 text-slate-200">
                    <SelectItem value="login_page">Giriş Sayfası</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="page_top">Sayfa Üstü</SelectItem>
                    <SelectItem value="page_bottom">Sayfa Altı</SelectItem>
                    <SelectItem value="sidebar">Kenar Çubuğu</SelectItem>
                    <SelectItem value="popup">Popup</SelectItem>
                    <SelectItem value="banner">Banner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="startDate" className="text-sm font-medium text-slate-300">
                    Başlangıç Tarihi
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400/60"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="endDate" className="text-sm font-medium text-slate-300">
                    Bitiş Tarihi
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400/60"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="status" className="text-sm font-medium text-slate-300">
                    Durum
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-slate-100 focus:border-indigo-400/60">
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                    <SelectContent className="border border-slate-700/60 bg-slate-900 text-slate-200">
                      <SelectItem value="scheduled">Zamanlanmış</SelectItem>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Pasif</SelectItem>
                      <SelectItem value="expired">Süresi Dolmuş</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="priority" className="text-sm font-medium text-slate-300">
                    Öncelik
                  </Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    placeholder="0"
                    min="0"
                    max="100"
                    className="rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400/60"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="border-t border-slate-800/60 bg-gradient-to-br from-background via-background to-muted/20 p-6">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-xl border border-slate-700/60 bg-transparent text-slate-200 hover:border-indigo-400/40 hover:bg-slate-900/70"
              >
                İptal
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-slate-600 py-3 text-slate-100 shadow-lg shadow-indigo-900/40 transition-all duration-200 disabled:opacity-50 disabled:shadow-none"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Megaphone className="mr-2 h-4 w-4" />
                Reklam Ekle
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
