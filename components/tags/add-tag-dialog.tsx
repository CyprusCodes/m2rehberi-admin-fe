"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, Tag, Sparkles, CheckCircle2, AlertCircle, Folder, FolderPlus } from "lucide-react"
import { fetchTags, createTag, type Tag as ApiTag } from "@/services/tags"
import toast from "react-hot-toast"

interface AddTagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddTagDialog({ open, onOpenChange, onSuccess }: AddTagDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "blue",
    parentId: "none",
  })
  const [parentTags, setParentTags] = useState<ApiTag[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingParents, setLoadingParents] = useState(false)

  // Load parent tags when dialog opens
  useEffect(() => {
    if (open) {
      loadParentTags()
    }
  }, [open])

  const loadParentTags = async () => {
    try {
      setLoadingParents(true)
      const response = await fetchTags()
      // Only show parent tags (not children)
      const parents = response.data.filter(tag => !tag.parentId)
      setParentTags(parents)
    } catch (error) {
      console.error('Parent tags yükleme hatası:', error)
      toast.error('Parent tag\'ler yüklenemedi')
    } finally {
      setLoadingParents(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Tag adı gereklidir')
      return
    }

    try {
      setLoading(true)
      
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
        parentId: formData.parentId === "none" ? undefined : Number(formData.parentId)
      }

      await createTag(payload)
      
      toast.success(`${formData.name} tag'i başarıyla oluşturuldu! 🎉`)
      
      // Reset form
      setFormData({ name: "", description: "", color: "blue", parentId: "none" })
      
      // Close dialog
      onOpenChange(false)
      
      // Trigger refresh
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error('Tag oluşturma hatası:', error)
      const errorMessage = error?.response?.data?.error || 'Tag oluşturulamadı'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getColorPreview = (color: string) => {
    const colors = {
      red: "bg-red-500/20 text-red-300 border-red-500/30",
      green: "bg-green-500/20 text-green-300 border-green-500/30",
      blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      orange: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      pink: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white max-w-2xl mx-auto shadow-2xl overflow-hidden">
        {/* Header Section */}
        <DialogHeader className="space-y-0 pb-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <Tag className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  Tag Oluştur
                </DialogTitle>
                <DialogDescription className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Yeni kategori veya alt kategori oluşturun
                </DialogDescription>
              </div>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
              v2.0
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-6" />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Card */}
          <Card className="border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <FolderPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Temel Bilgiler</h3>
              </div>
              
              <div className="space-y-4">
                {/* Tag Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    Tag Adı
                    <span className="text-red-500">*</span>
                    {formData.name && (
                      <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Geçerli
                      </span>
                    )}
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="örn: PUBG, MarketGG, PVP..."
                    className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                    disabled={loading}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Açıklama
                    <span className="text-xs text-slate-500 ml-1">(isteğe bağlı)</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Bu tag'in ne için kullanıldığını açıklayın..."
                    className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all resize-none"
                    rows={3}
                    disabled={loading}
                  />
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {formData.description.length}/500 karakter
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category & Styling Card */}
          <Card className="border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Folder className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Kategori & Stil</h3>
              </div>
              
              <div className="space-y-4">
                {/* Parent Tag */}
                <div className="space-y-2">
                  <Label htmlFor="parent" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Parent Tag
                    <span className="text-xs text-slate-500 ml-1">(alt kategori için)</span>
                  </Label>
                  <Select
                    value={formData.parentId}
                    onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                    disabled={loading || loadingParents}
                  >
                    <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500/20">
                      <SelectValue placeholder={loadingParents ? "Parent tag'ler yükleniyor..." : "Ana kategori seçin (isteğe bağlı)"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                      <SelectItem value="none" className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-yellow-500" />
                          Ana Kategori
                        </div>
                      </SelectItem>
                      {parentTags.map((tag) => (
                        <SelectItem key={tag.tagId} value={tag.tagId.toString()} className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
                          <div className="flex items-center gap-2">
                            <Badge className={getColorPreview(tag.color)} variant="outline">
                              {tag.name}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Color Selection */}
                <div className="space-y-3">
                  <Label htmlFor="color" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Tag Rengi
                  </Label>
                  <div className="flex items-center gap-3">
                    <Select 
                      value={formData.color} 
                      onValueChange={(value) => setFormData({ ...formData, color: value })}
                      disabled={loading}
                    >
                      <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500/20 flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                        {['red', 'green', 'blue', 'purple', 'yellow', 'orange', 'pink'].map((color) => (
                          <SelectItem key={color} value={color} className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getColorPreview(color).split(' ')[0]}`} />
                              {color.charAt(0).toUpperCase() + color.slice(1)}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* Live Preview */}
                    <Badge className={getColorPreview(formData.color)} variant="outline">
                      {formData.name || "Preview"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter className="gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              disabled={loading}
            >
              İptal
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-blue-500/25"
              disabled={loading || !formData.name.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <Tag className="h-4 w-4 mr-2" />
                  Tag Oluştur
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
