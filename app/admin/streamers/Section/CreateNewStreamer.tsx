"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Check, Video, Globe, Upload, X, ExternalLink, User } from "lucide-react"
import { createStreamer, type CreateStreamerPayload } from "@/services/streamers"
import { uploadAsset } from "@/services/uploads"

interface CreateNewStreamerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateNewStreamer({ open, onOpenChange, onSuccess }: CreateNewStreamerProps) {
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const [form, setForm] = useState({
    handle: "",
    display_name: "",
    bio: "",
    avatar_url: "",
    banner_url: "",
    main_link_url: "",
    kick_url: "",
    youtube_url: "",
    twitch_url: "",
    instagram_url: "",
    tiktok_url: "",
    x_url: "",
    website_url: "",
    socials_json: null,
    is_verified: false,
  })

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Lütfen sadece resim dosyası yükleyin.')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Dosya boyutu 5MB\'dan büyük olamaz.')
      return
    }

    try {
      setUploading(true)
      const response = await uploadAsset(file)
      setForm({ ...form, avatar_url: response.data.url })
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Dosya yüklenirken hata oluştu.')
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
    setForm({ ...form, avatar_url: "" })
  }

  const generateHandleSuggestion = (name: string) => {
    const baseHandle = name.toLowerCase()
      .replace(/[^a-z0-9\s_]/g, '')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .trim()
    
    const timestamp = Date.now().toString().slice(-4)
    return `${baseHandle}_${timestamp}`
  }

  const handleSubmit = async () => {
    if (!form.handle.trim()) {
      alert('Handle alanı zorunludur.')
      return
    }

    if (!form.display_name.trim()) {
      alert('Görünen ad alanı zorunludur.')
      return
    }

    // Handle format kontrolü
    if (!/^[a-z0-9_]+$/.test(form.handle)) {
      alert('Handle sadece küçük harf, rakam ve alt çizgi içerebilir.')
      return
    }

    try {
      setSubmitting(true)
      
      // Sosyal medya linklerini JSON olarak hazırla
      const socialsData: any = {};
      if (form.main_link_url) socialsData.main_link = form.main_link_url;
      if (form.kick_url) socialsData.kick = form.kick_url;
      if (form.youtube_url) socialsData.youtube = form.youtube_url;
      if (form.twitch_url) socialsData.twitch = form.twitch_url;
      if (form.instagram_url) socialsData.instagram = form.instagram_url;
      if (form.tiktok_url) socialsData.tiktok = form.tiktok_url;
      if (form.x_url) socialsData.x = form.x_url;
      if (form.website_url) socialsData.website = form.website_url;

      const payload: CreateStreamerPayload = {
        handle: form.handle,
        display_name: form.display_name,
        bio: form.bio || undefined,
        avatar_url: form.avatar_url || undefined,
        banner_url: form.banner_url || undefined,
        main_link_url: form.main_link_url || undefined,
        kick_url: form.kick_url || undefined,
        youtube_url: form.youtube_url || undefined,
        twitch_url: form.twitch_url || undefined,
        instagram_url: form.instagram_url || undefined,
        tiktok_url: form.tiktok_url || undefined,
        x_url: form.x_url || undefined,
        website_url: form.website_url || undefined,
        socials_json: Object.keys(socialsData).length > 0 ? socialsData : undefined,
        is_verified: form.is_verified,
      }
      
      await createStreamer(payload)
      
      // Reset form
      setForm({
        handle: "",
        display_name: "",
        bio: "",
        avatar_url: "",
        banner_url: "",
        main_link_url: "",
        kick_url: "",
        youtube_url: "",
        twitch_url: "",
        instagram_url: "",
        tiktok_url: "",
        x_url: "",
        website_url: "",
        socials_json: null,
        is_verified: false,
      })
      
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (e: any) {
      console.error("Failed to create streamer", e)
      
      // Handle specific duplicate handle error
      if (e?.message?.includes('handle') && e?.message?.includes('kullanılıyor')) {
        const suggestion = generateHandleSuggestion(form.display_name || 'streamer')
        const confirmMessage = `Bu handle zaten kullanılıyor. "${suggestion}" handle'ını kullanmak ister misiniz?`
        
        if (confirm(confirmMessage)) {
          setForm({ ...form, handle: suggestion })
        }
      } else {
        alert(e?.message || "Yayıncı oluşturulamadı")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-4xl max-h-[95vh] p-0 gap-0 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
          <DialogHeader className="relative px-8 py-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Yeni Yayıncı Ekle
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground mt-1">
                  Yeni bir yayıncı profili oluşturun
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 px-8 py-6 max-h-[60vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Basic Info Section */}
              <div className="space-y-4 p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Temel Bilgiler</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Handle (Zorunlu)</Label>
                    <Input
                      value={form.handle}
                      onChange={(e) => setForm({ ...form, handle: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                      placeholder="Örn: emek_streamer"
                      className="h-11 border-border/50 focus:border-primary/50 transition-colors"
                    />
                    <p className="text-xs text-muted-foreground">Sadece küçük harf, rakam ve alt çizgi kullanın</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Görünen Ad (Zorunlu)</Label>
                    <Input
                      value={form.display_name}
                      onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                      placeholder="Emek Streamer"
                      className="h-11 border-border/50 focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Bio</Label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
                      maxLength={280}
                      className="min-h-[80px] w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:border-primary/50 transition-colors resize-none"
                    />
                    <p className="text-xs text-muted-foreground">{form.bio.length}/280 karakter</p>
                  </div>

                  {/* Verification Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/30">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Doğrulanmış Yayıncı</Label>
                      <p className="text-sm text-muted-foreground">
                        Yayıncıya doğrulanmış rozeti ver
                      </p>
                    </div>
                    <Switch
                      checked={form.is_verified}
                      onCheckedChange={(checked) => setForm({ ...form, is_verified: checked })}
                    />
                  </div>
                </div>
              </div>

              {/* Profile Image Upload */}
              <div className="space-y-4 p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Profil Resmi
                  </Label>
                  
                  {!form.avatar_url ? (
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                        dragActive 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border/50 hover:border-primary/50 hover:bg-muted/30'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('profile-image-input')?.click()}
                    >
                      <input
                        id="profile-image-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                          <p className="text-sm text-muted-foreground">Yükleniyor...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Resim sürükleyip bırakın</p>
                            <p className="text-xs text-muted-foreground">veya tıklayarak seçin</p>
                          </div>
                          <p className="text-xs text-muted-foreground">PNG, JPG, GIF (max 5MB)</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border/30">
                        <img
                          src={form.avatar_url}
                          alt="Profil resmi"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Resim yüklenemedi</div>';
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => document.getElementById('profile-image-input')?.click()}
                            className="h-8 px-3"
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            Değiştir
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={removeImage}
                            className="h-8 px-3"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Kaldır
                          </Button>
                        </div>
                      </div>
                      <input
                        id="profile-image-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Social Media Links */}
              <div className="space-y-4 p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Sosyal Medya Linkleri</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Ana Link
                    </Label>
                    <Input
                      value={form.main_link_url}
                      onChange={(e) => setForm({ ...form, main_link_url: e.target.value })}
                      placeholder="https://linktr.ee/username"
                      className="h-11 border-border/50 focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Kick
                    </Label>
                    <Input
                      value={form.kick_url}
                      onChange={(e) => setForm({ ...form, kick_url: e.target.value })}
                      placeholder="https://kick.com/username"
                      className="h-11 border-border/50 focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      YouTube
                    </Label>
                    <Input
                      value={form.youtube_url}
                      onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
                      placeholder="https://youtube.com/@username"
                      className="h-11 border-border/50 focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Twitch
                    </Label>
                    <Input
                      value={form.twitch_url}
                      onChange={(e) => setForm({ ...form, twitch_url: e.target.value })}
                      placeholder="https://twitch.tv/username"
                      className="h-11 border-border/50 focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Instagram
                    </Label>
                    <Input
                      value={form.instagram_url}
                      onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                      placeholder="https://instagram.com/username"
                      className="h-11 border-border/50 focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      TikTok
                    </Label>
                    <Input
                      value={form.tiktok_url}
                      onChange={(e) => setForm({ ...form, tiktok_url: e.target.value })}
                      placeholder="https://tiktok.com/@username"
                      className="h-11 border-border/50 focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      X (Twitter)
                    </Label>
                    <Input
                      value={form.x_url}
                      onChange={(e) => setForm({ ...form, x_url: e.target.value })}
                      placeholder="https://x.com/username"
                      className="h-11 border-border/50 focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Website
                    </Label>
                    <Input
                      value={form.website_url}
                      onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                      placeholder="https://example.com"
                      className="h-11 border-border/50 focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="relative border-t border-border/50 bg-gradient-to-r from-background via-background to-muted/10">
          <div className="flex justify-end gap-3 px-8 py-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 px-6 border-border/50 hover:bg-muted/50 transition-colors"
            >
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !form.handle.trim() || !form.display_name.trim()}
              className="h-11 px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Yayıncı Ekle
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}