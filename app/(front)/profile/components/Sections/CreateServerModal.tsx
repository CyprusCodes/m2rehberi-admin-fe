"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Check, Server, Globe, MessageCircle, Calendar, Shield, Gamepad2, Settings, Star, Zap, Image } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createFrontendServer, type CreateServerPayload } from "@/services/servers"
import { fetchActiveTags, type Tag } from "@/services/tags"
import { LEVEL_RANGES, DIFFICULTY_LEVELS, SERVER_TYPES, METIN2_SYSTEMS, METIN2_FEATURES, METIN2_EVENTS } from "@/lib/helpersConstants"
import { HtmlEditor } from "@/components/ui/html-editor"

interface CreateServerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
}


export function CreateServerModal({ open, onOpenChange, onCreated }: CreateServerModalProps) {
  const { user } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [tags, setTags] = useState<Tag[]>([])
  const [loadingTags, setLoadingTags] = useState(false)
  const [form, setForm] = useState({
    name: "",
    description: "",
    gameType: "metin2",
    levelRange: "",
    difficulty: "",
    serverType: "",
    tagId: "none",
    discordLink: "",
    websiteLink: "",
    youtubeLinks: "",
    rules: "",
    serverCoverImageUrl: "",
    showTimeStatus: false,
    showDateTime: "",
    systems: [] as string[],
    features: [] as string[],
    events: [] as string[],
  })

  useEffect(() => {
    if (!open) return
    const load = async () => {
      try {
        setLoadingTags(true)
        const res = await fetchActiveTags()
        const active = (res.data || [])
        setTags(active)
      } catch (e) {
        console.error('Error fetching tags:', e)
      } finally {
        setLoadingTags(false)
      }
    }
    load()
  }, [open])

  const handleSubmit = async () => {
    if (!user?.id) return
    if (!form.name.trim() || !form.description.trim() || !form.levelRange || !form.difficulty || !form.serverType)
      return
    try {
      setSubmitting(true)
      const payload: CreateServerPayload = {
        userId: Number(user.id),
        serverName: form.name,
        description: form.description,
        gameType: "metin2",
        serverLevelRange: form.levelRange,
        serverDifficulty: form.difficulty as any,
        serverType: form.serverType,
        maxPlayers: 0,
        tagId: form.tagId && form.tagId !== "none" ? Number(form.tagId) : undefined,
        discordLink: form.discordLink || undefined,
        websiteLink: form.websiteLink || undefined,
        youtubeLinks: form.youtubeLinks
          ? form.youtubeLinks
              .split(/[\n,]+/)
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        serverRules: form.rules || undefined,
        serverCoverImageUrl: form.serverCoverImageUrl || undefined,
        systems: form.systems.length > 0 ? form.systems : undefined,
        features: form.features.length > 0 ? form.features : undefined,
        events: form.events.length > 0 ? form.events : undefined,
        showTimeStatus: form.showTimeStatus,
        showDateTime: form.showDateTime || undefined,
      }
      await createFrontendServer(payload)
      onOpenChange(false)
      setForm({
        name: "",
        description: "",
        gameType: "metin2",
        levelRange: "",
        difficulty: "",
        serverType: "",
        tagId: "none",
        discordLink: "",
        websiteLink: "",
        youtubeLinks: "",
        rules: "",
        serverCoverImageUrl: "",
        showTimeStatus: false,
        showDateTime: "",
        systems: [],
        features: [],
        events: [],
      })
      if (onCreated) onCreated()
      if (typeof window !== "undefined") window.dispatchEvent(new Event("servers:refresh"))
    } catch (e) {
      console.error("Failed to create server", e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-7xl max-h-[95vh] p-0 gap-0 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
          <DialogHeader className="relative px-8 py-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Yeni Sunucu Ekle
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground mt-1">
                  Sunucunu oluştur ve admin onayına gönder
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
                  <Gamepad2 className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Temel Bilgiler</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Sunucu Adı</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Örn: Emek Server"
                      className="h-11 border-border/50 focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Oyun Türü</Label>
                    <Select value={form.gameType} onValueChange={(v) => setForm({ ...form, gameType: v })}>
                      <SelectTrigger className="h-11 border-border/50 focus:border-primary/50">
                        <SelectValue placeholder="Oyun seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metin2">Metin2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Server Configuration */}
              <div className="space-y-4 p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Sunucu Ayarları</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Level Aralığı</Label>
                    <Select value={form.levelRange} onValueChange={(v) => setForm({ ...form, levelRange: v })}>
                      <SelectTrigger className="h-11 border-border/50 focus:border-primary/50">
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEVEL_RANGES.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Zorluk</Label>
                    <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v })}>
                      <SelectTrigger className="h-11 border-border/50 focus:border-primary/50">
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIFFICULTY_LEVELS.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Server Tipi</Label>
                  <Select value={form.serverType} onValueChange={(v) => setForm({ ...form, serverType: v })}>
                    <SelectTrigger className="h-11 border-border/50 focus:border-primary/50">
                      <SelectValue placeholder="Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVER_TYPES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Metin2 Systems */}
              <div className="space-y-4 p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Metin2 Sistemleri</h3>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sistemler (Çoklu seçim)</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-border/30 rounded-lg p-3">
                    {METIN2_SYSTEMS.map((system) => (
                      <label key={system} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.systems.includes(system)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setForm({ ...form, systems: [...form.systems, system] })
                            } else {
                              setForm({ ...form, systems: form.systems.filter(s => s !== system) })
                            }
                          }}
                          className="rounded border-border/50 text-primary focus:ring-primary/50"
                        />
                        <span className="text-sm">{system}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metin2 Features */}
              <div className="space-y-4 p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Metin2 Özellikleri</h3>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Özellikler (Çoklu seçim)</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-border/30 rounded-lg p-3">
                    {METIN2_FEATURES.map((feature) => (
                      <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.features.includes(feature)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setForm({ ...form, features: [...form.features, feature] })
                            } else {
                              setForm({ ...form, features: form.features.filter(f => f !== feature) })
                            }
                          }}
                          className="rounded border-border/50 text-primary focus:ring-primary/50"
                        />
                        <span className="text-sm">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metin2 Events */}
              <div className="space-y-4 p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Metin2 Etkinlikleri</h3>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Etkinlikler (Çoklu seçim)</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-border/30 rounded-lg p-3">
                    {METIN2_EVENTS.map((event) => (
                      <label key={event} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.events.includes(event)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setForm({ ...form, events: [...form.events, event] })
                            } else {
                              setForm({ ...form, events: form.events.filter(ev => ev !== event) })
                            }
                          }}
                          className="rounded border-border/50 text-primary focus:ring-primary/50"
                        />
                        <span className="text-sm">{event}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

               <div className="space-y-4 p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                 <div className="space-y-2">
                   <Label className="text-sm font-medium">Tag Seçimi</Label>
                   <Select value={form.tagId} onValueChange={(value) => setForm({ ...form, tagId: value })}>
                     <SelectTrigger className="h-11 border-border/50 focus:border-primary/50">
                       <SelectValue placeholder="Tag seçin (opsiyonel)" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="none">Tag seçmeyin</SelectItem>
                       {loadingTags && (
                         <SelectItem value="loading" disabled>
                           <div className="flex items-center gap-2">
                             <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                             Tag'ler yükleniyor...
                           </div>
                         </SelectItem>
                       )}
                       {!loadingTags &&
                         tags.map((tag) => (
                           <SelectItem key={tag.tagId} value={String(tag.tagId)}>
                             <div className="flex items-center gap-2">
                               <div
                                 className={`w-3 h-3 rounded-full ${
                                   tag.color === 'red' ? 'bg-red-500' :
                                   tag.color === 'blue' ? 'bg-blue-500' :
                                   tag.color === 'green' ? 'bg-green-500' :
                                   tag.color === 'yellow' ? 'bg-yellow-500' :
                                   tag.color === 'purple' ? 'bg-purple-500' :
                                   'bg-gray-500'
                                 }`}
                               />
                               <span>{tag.name}</span>
                               {tag.description && (
                                 <span className="text-xs text-muted-foreground ml-1">
                                   - {tag.description}
                                 </span>
                               )}
                             </div>
                           </SelectItem>
                         ))}
                     </SelectContent>
                   </Select>
                   {form.tagId && form.tagId !== "none" && (
                     <div className="mt-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                       <div className="flex items-center gap-2">
                         <div
                           className={`w-3 h-3 rounded-full ${
                             (() => {
                               const selectedTag = tags.find(t => String(t.tagId) === form.tagId);
                               if (!selectedTag) return 'bg-gray-500';
                               return selectedTag.color === 'red' ? 'bg-red-500' :
                                      selectedTag.color === 'blue' ? 'bg-blue-500' :
                                      selectedTag.color === 'green' ? 'bg-green-500' :
                                      selectedTag.color === 'yellow' ? 'bg-yellow-500' :
                                      selectedTag.color === 'purple' ? 'bg-purple-500' :
                                      'bg-gray-500';
                             })()
                           }`}
                         />
                         <span className="text-sm font-medium text-primary">
                           Seçilen Tag: {tags.find(t => String(t.tagId) === form.tagId)?.name}
                         </span>
                       </div>
                       {tags.find(t => String(t.tagId) === form.tagId)?.description && (
                         <p className="text-xs text-muted-foreground mt-1">
                           {tags.find(t => String(t.tagId) === form.tagId)?.description}
                         </p>
                       )}
                     </div>
                   )}
                 </div>
               </div>
            </div>

            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-4 p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Açıklama</Label>
                  <HtmlEditor
                    value={form.description}
                    onChange={(value) => setForm({ ...form, description: value })}
                    placeholder="Sunucu hakkında detaylar yazın... HTML etiketleri kullanabilirsiniz."
                    minHeight="150px"
                  />
                </div>
              </div>

              {/* Links Section */}
              <div className="space-y-4 p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Bağlantılar</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Discord
                    </Label>
                    <Input
                      value={form.discordLink}
                      onChange={(e) => setForm({ ...form, discordLink: e.target.value })}
                      placeholder="https://discord.gg/..."
                      className="h-11 border-border/50 focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Website
                    </Label>
                    <Input
                      value={form.websiteLink}
                      onChange={(e) => setForm({ ...form, websiteLink: e.target.value })}
                      placeholder="https://example.com"
                      className="h-11 border-border/50 focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">YouTube Linkleri</Label>
                  <Textarea
                    rows={3}
                    value={form.youtubeLinks}
                    onChange={(e) => setForm({ ...form, youtubeLinks: e.target.value })}
                    placeholder="https://youtu.be/abc, https://youtu.be/def"
                    className="resize-none border-border/50 focus:border-primary/50 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Sunucu Kapak Resmi URL
                  </Label>
                  <Input
                    value={form.serverCoverImageUrl}
                    onChange={(e) => setForm({ ...form, serverCoverImageUrl: e.target.value })}
                    placeholder="https://example.com/cover-image.jpg"
                    className="h-11 border-border/50 focus:border-primary/50 transition-colors"
                  />
                  {form.serverCoverImageUrl && (
                    <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border/30">
                      <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Önizleme:
                      </Label>
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border/30">
                        <img
                          src={form.serverCoverImageUrl}
                          alt="Sunucu kapak resmi önizlemesi"
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
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rules Section */}
              <div className="space-y-4 p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Kurallar</Label>
                  <HtmlEditor
                    value={form.rules}
                    onChange={(value) => setForm({ ...form, rules: value })}
                    placeholder="Sunucu kurallarını yazın... HTML etiketleri kullanabilirsiniz."
                    minHeight="120px"
                  />
                </div>
              </div>

               <div className="space-y-4 p-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                 <div className="flex items-center gap-2 mb-3">
                   <Calendar className="w-5 h-5 text-primary" />
                   <h3 className="font-semibold text-lg">Zamanlama</h3>
                 </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/30">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Belirli Tarihte Göster</Label>
                      <p className="text-sm text-muted-foreground">
                        Sunucuyu ileri bir tarihte göstermek istiyorsanız aktif edin
                      </p>
                    </div>
                    <Switch
                      checked={form.showTimeStatus}
                      onCheckedChange={(checked) => setForm({ ...form, showTimeStatus: checked })}
                    />
                  </div>

                  {form.showTimeStatus && (
                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                      <Label className="text-sm font-medium">Gösterim Tarihi</Label>
                      <Input
                        type="datetime-local"
                        value={form.showDateTime}
                        onChange={(e) => setForm({ ...form, showDateTime: e.target.value })}
                        placeholder="YYYY-MM-DDTHH:MM"
                        className="h-11 border-border/50 focus:border-primary/50 transition-colors"
                      />
                      <p className="text-sm text-muted-foreground">Sunucunun gösterileceği tarih ve saat</p>
                    </div>
                  )}
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
              disabled={
                submitting ||
                !form.name ||
                !form.description ||
                !form.levelRange ||
                !form.difficulty ||
                !form.serverType
              }
              className="h-11 px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Sunucuyu Ekle
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
